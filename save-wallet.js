import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { walletAddress, twitterHandle } = req.body;

  if (!walletAddress || !twitterHandle) {
    return res.status(400).json({ message: 'Wallet address and Twitter handle are required' });
  }

  try {
    // Check if the Twitter handle already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('wallet_links')
      .select('*')
      .eq('twitter_handle', twitterHandle)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    let result;
    if (existingUser) {
      // Update existing record
      result = await supabase
        .from('wallet_links')
        .update({ stacks_address: walletAddress })
        .eq('twitter_handle', twitterHandle);
    } else {
      // Insert new record
      result = await supabase
        .from('wallet_links')
        .insert({ twitter_handle: twitterHandle, stacks_address: walletAddress });
    }

    if (result.error) {
      throw result.error;
    }

    res.status(200).json({ message: 'Wallet linked successfully' });
  } catch (error) {
    console.error('Error saving wallet address:', error);
    res.status(500).json({ message: 'Failed to save wallet address', error: error.message });
  }
}