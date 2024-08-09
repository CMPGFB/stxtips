# STX Twitter Bot

This bot enables users to send and receive STX (Stacks) tips via Twitter replies by interacting with a secure Clarity smart contract on the Stacks blockchain.

## Features

- **Wallet Onboarding System:** Users can link their Stacks wallets for receiving tips.
- **Streamlined Tipping Process:** Automatically identifies the user's wallet and executes STX transfers securely.
- **Automatic Responses:** Sends a confirmation tweet for successful transactions, including a link to the transaction on the Stacks Explorer.
- **Error Handling:** Graceful handling of invalid commands or failed transactions, with informative error messages.
- **Supabase Integration:** Logs transaction history in Supabase for easy tracking and management.

## Prerequisites

- **Node.js (v14 or later recommended)**
- **npm (comes with Node.js)**
- **Twitter Developer Account:** With API access for creating the bot.
- **Supabase Account:** Set up a new project for storing transaction history.
- **Stacks Wallet:** A wallet with sufficient balance for transactions on the Stacks blockchain.

## Clarity Smart Contract

The Clarity smart contract manages the STX tips, ensuring that only the authorized bot can update the bot's address or send tips.

### Key Functions

- **`set-tip-bot-address (new-address principal)`**
  - **Purpose:** Updates the tip bot address. Only the current bot address can call this function.
  - **Security:** Ensures that only authorized users can change the tip bot address.

- **`tip-stx (recipient principal, amount uint)`**
  - **Purpose:** Transfers the specified amount of STX to the recipient. Only callable by the tip bot address.
  - **Security:** Validates the sender's authorization before executing the transfer.

## Environment Variables

Create a `.env` file in the root of your project and add the following variables:

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

## Deployment and Setup

### 1. Deploy the Clarity Smart Contract
   - Deploy the `stxtwitterbot.clar` contract to the Stacks blockchain (testnet or mainnet).
   - Record the contract address and contract name for use in the bot.

### 2. Set Up the Project
   - Clone the repository and install dependencies:
     ```bash
     npm install
     ```

### 3. Deploy the Bot to Vercel
   - Deploy the bot to Vercel using the following command:
     ```bash
     vercel
     ```
   - Ensure all environment variables are set up in Vercel.

## Usage

- **Tipping:** To send a tip, mention the bot in a tweet reply with a command like `10 STX`. The bot will process the tip and send a confirmation tweet with a link to the transaction on the Stacks Explorer.
- **Log Transactions:** All transactions are automatically logged in Supabase, where you can view and manage them.

## License

This project is licensed under the MIT License.
