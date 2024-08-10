// src/save-wallet.js

const supabase = require('./supabase.js');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { walletAddress, twitterHandle, verificationCode } = req.body;

    if (!walletAddress || !twitterHandle || !verificationCode) {
      return res.status(400).send('Wallet address, Twitter handle, and verification code are required');
    }

    // Save wallet address, Twitter handle, and verification code in Supabase
    const { error } = await supabase
      .from('wallet_links')
      .insert([{ stacks_address: walletAddress, twitter_handle: twitterHandle, verification_code: verificationCode, verified: false }]);

    if (error) {
      return res.status(500).send('Error saving wallet address');
    }

    return res.status(200).send('Wallet address saved successfully');
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};
