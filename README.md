Here’s the updated README in a similar format based on the changes we made:

---

# STX Twitter Bot

**STX Twitter Bot** enables users to send and receive STX (Stacks) tips via Twitter replies by interacting with a secure Clarity smart contract on the Stacks blockchain. Users can connect their Stacks wallets directly through the landing page, simplifying the process of sending tips.

## Features

- **Wallet Onboarding System:** Users can connect their Xverse or Leather wallet through the landing page and link it to their Twitter handle.
- **Automated Verification:** Users are required to verify their Twitter handle by tweeting a unique code generated during wallet connection.
- **Streamlined Tipping Process:** Automatically identifies the user's wallet and executes STX transfers securely.
- **Automatic Responses:** Sends a confirmation tweet for successful transactions, including a link to the transaction on the Stacks Explorer.
- **Error Handling:** Graceful handling of invalid commands or failed transactions, with informative error messages.
- **Supabase Integration:** Logs transaction history in Supabase for easy tracking and management.
- **Landing Page:** Provides an easy-to-use interface for connecting wallets and understanding how to use the bot.

## Prerequisites

- **Node.js (v14 or later recommended)**
- **npm (comes with Node.js)**
- **Twitter Developer Account:** With API access for creating the bot.
- **Supabase Account:** Set up a new project for storing transaction history.
- **Stacks Wallet:** A wallet with sufficient balance for transactions on the Stacks blockchain.

## Setup and Deployment

### 1. Deploy the Clarity Smart Contract

- Deploy the `twittertips-ncc.clar` contract to the Stacks blockchain (testnet or mainnet).
- Record the contract address and name for use in the bot.

### 2. Set Up the Project

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file in the root of your project:

```plaintext
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_KEY_SECRET=your-twitter-api-secret
TWITTER_ACCESS_TOKEN=your-twitter-access-token
TWITTER_ACCESS_TOKEN_SECRET=your-twitter-access-token-secret
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-api-key
STACKS_SEED_PHRASE=your-seed-phrase
NETWORK=testnet  # Or mainnet
CONTRACT_ADDRESS=your_clarity_contract_address
CONTRACT_NAME=your_clarity_contract_name
```

### 3. Deploy the Bot to Vercel

Deploy the project to Vercel:

```bash
vercel
```

Ensure all environment variables are set up in Vercel.

### 4. Landing Page

Users can connect their Stacks wallets (Xverse or Leather) and link them to their Twitter handles directly from the landing page.

#### **Connect Wallet:**

- Users visit the landing page and click "Sign In with Xverse/Leather" to connect their wallet.
- They enter their Twitter handle, and the wallet address is automatically linked to their handle in Supabase.

#### **Send Tips:**

- Once connected and verified, users can send tips by replying to tweets with the bot mentioned and specifying the amount of STX, e.g., "10 STX."
- The bot processes the tip and sends a confirmation tweet with a link to the transaction.

## How It Works

- **Tipping:** To send a tip, mention the bot in a tweet reply with a command like `10 STX @STXTips`. The bot will handle the rest and send a confirmation tweet.
- **Wallet Link:** Users can easily link their wallet to their Twitter handle through the landing page, followed by an automated verification process.
- **Log Transactions:** All transactions are automatically logged in Supabase, where you can view and manage them.

## Clarity Smart Contract

The Clarity smart contract manages the STX tips, ensuring that only the authorized bot can update the bot's address or send tips.

### Key Functions

- **`set-tip-bot-address (new-address principal)`**
  - **Purpose:** Updates the tip bot address. Only the current bot address can call this function.
  - **Security:** Ensures that only authorized users can change the tip bot address.
  
- **`tip-stx (recipient principal, amount uint)`**
  - **Purpose:** Transfers the specified amount of STX to the recipient. Only callable by the tip bot address.
  - **Security:** Validates the sender's authorization before executing the transfer.

## License

This project is licensed under the MIT License.

## Inspiration

This bot was inspired by the work of NoCodeDevs.
