// src/save-wallet.js

const supabase = require('./supabase.js');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { walletAddress, twitterHandle } = req.body;

    if (!walletAddress || !twitterHandle) {
      return res.status(400).send('Wallet address and Twitter handle are required');
    }

    // Save or update the wallet address linked to the Twitter handle
    const { data, error } = await supabase
      .from('wallet_links')
      .upsert({ stacks_address: walletAddress, twitter_handle: twitterHandle }, { onConflict: ['twitter_handle'] });

    if (error) {
      return res.status(500).send('Error saving wallet address');
    }

    return res.status(200).send('Wallet address saved successfully');
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
