require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const { createClient } = require('@supabase/supabase-js');
const { StacksTestnet, StacksMainnet } = require('@stacks/network');
const { contractCall, uintCV, principalCV } = require('@stacks/transactions');
const { mnemonicToSeed } = require('@stacks/wallet-sdk');
const { createStacksPrivateKey } = require('@stacks/transactions');

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const network = process.env.NETWORK === 'mainnet' ? new StacksMainnet() : new StacksTestnet();

async function getPrivateKeyFromSeed(seedPhrase) {
  const seed = await mnemonicToSeed(seedPhrase);
  const privateKey = createStacksPrivateKey(seed);
  return privateKey.data.toString('hex');
}

let privateKey;

async function initializePrivateKey() {
  privateKey = await getPrivateKeyFromSeed(process.env.STACKS_SEED_PHRASE);
}

async function getWalletAddressForTwitterUser(twitterHandle) {
  const { data, error } = await supabase
    .from('wallet_links')
    .select('stacks_address, verified')
    .eq('twitter_handle', twitterHandle)
    .single();

  if (error || !data.verified) {
    console.error('Error fetching wallet address or account not verified:', error);
    return null;
  }

  return data?.stacks_address;
}

async function sendTip(recipientAddress, amount) {
  try {
    const functionName = 'tip-stx';
    const contractAddress = process.env.CONTRACT_ADDRESS;
    const contractName = process.env.CONTRACT_NAME;

    const txOptions = {
      contractAddress: contractAddress,
      contractName: contractName,
      functionName: functionName,
      functionArgs: [
        principalCV(recipientAddress),
        uintCV(amount * 1000000)  // Convert to microSTX
      ],
      senderKey: privateKey,
      network: network,
      postConditionMode: 1,
    };

    const transaction = await contractCall(txOptions);
    const broadcastResponse = await network.broadcastTransaction(transaction);
    console.log('Transaction broadcast successfully', broadcastResponse);
    return broadcastResponse;
  } catch (error) {
    console.error('Error sending tip:', error);
    throw error;
  }
}

async function processTip(senderHandle, recipientHandle, amount, tweetId) {
  const recipientAddress = await getWalletAddressForTwitterUser(recipientHandle);
  if (!recipientAddress) {
    await twitterClient.v2.reply(`@${recipientHandle} hasn't verified their wallet yet. They need to verify their wallet to receive tips.`, tweetId);
    return;
  }

  try {
    const response = await sendTip(recipientAddress, amount);
    const explorerUrl = `https://explorer.stacks.co/txid/${response.txid}`;
    await twitterClient.v2.reply(`Tip of ${amount} STX sent from @${senderHandle} to @${recipientHandle}! Verify here: ${explorerUrl}`, tweetId);
    
    await supabase.from('transactions').insert({
      sender: senderHandle,
      recipient: recipientHandle,
      amount,
      txId: response.txid,
      timestamp: new Date(),
    });
  } catch (error) {
    await twitterClient.v2.reply(`Failed to send ${amount} STX from @${senderHandle} to @${recipientHandle}. Please try again later.`, tweetId);
  }
}

module.exports = async (req, res) => {
  try {
    await initializePrivateKey();

    const stream = await twitterClient.v2.searchStream({
      'tweet.fields': ['referenced_tweets', 'author_id', 'text'],
      'user.fields': ['username'],
      expansions: ['referenced_tweets.id', 'author_id'],
    });

    for await (const { data, includes } of stream) {
      if (data.referenced_tweets && data.referenced_tweets[0].type === 'replied_to') {
        const replyToTweet = includes.tweets.find(t => t.id === data.referenced_tweets[0].id);
        const tweetText = data.text;
        const tweetId = data.id;
        const senderHandle = includes.users.find(u => u.id === data.author_id).username;
        const recipientHandle = includes.users.find(u => u.id === replyToTweet.author_id).username;

        const amountMatch = tweetText.match(/(\d+(\.\d+)?)\s*STX/i);

        if (amountMatch) {
          const amount = parseFloat(amountMatch[1]);
          await processTip(senderHandle, recipientHandle, amount, tweetId);
        } else {
          await twitterClient.v2.reply(`Invalid command. Please use "10 STX" to tip.`, tweetId);
        }
      }
    }

    res.status(200).send('Bot started successfully');
  } catch (error) {
    console.error('Error starting the bot:', error);
    res.status(500).send('Error starting the bot');
  }
};
