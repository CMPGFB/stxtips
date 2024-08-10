// src/verify-twitter.js

const { TwitterApi } = require('twitter-api-v2');
const supabase = require('./supabase.js');

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { twitterHandle } = req.body;

    if (!twitterHandle) {
      return res.status(400).send('Twitter handle is required');
    }

    const { data, error } = await supabase
      .from('wallet_links')
      .select('*')
      .eq('twitter_handle', twitterHandle)
      .single();

    if (error || !data) {
      return res.status(404).send('Twitter handle not found');
    }

    const tweets = await twitterClient.v2.userTimeline(data.twitter_handle);

    const isVerified = tweets.data.some(tweet => tweet.text.includes(data.verification_code));

    if (isVerified) {
      await supabase
        .from('wallet_links')
        .update({ verified: true })
        .eq('twitter_handle', twitterHandle);

      return res.status(200).send('Verification successful');
    } else {
      return res.status(400).send('Verification code not found in tweets');
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
