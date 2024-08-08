# Twitter STX Tipping Bot

This bot enables users to send and receive STX (Stacks) tips via Twitter replies.

## Features

- Wallet onboarding system for users to create and link their Stacks wallets
- Streamlined tipping process that automatically identifies the user's wallet
- Automatic tweet responses confirming successful transactions
- Error handling for invalid commands or failed transactions
- Integration with Supabase for transaction history storage

## Prerequisites

- Node.js (v14 or later recommended)
- npm (comes with Node.js)
- Twitter Developer Account with API access
- Supabase account with a new project
- Stacks wallet with sufficient balance for transactions

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/twitter-stx-bot.git
   cd twitter-stx-bot
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the project root and add your credentials:
   ```
   TWITTER_API_KEY=your_api_key
   TWITTER_API_KEY_SECRET=your_api_secret
   TWITTER_ACCESS_TOKEN=your_access_token
   TWITTER_ACCESS_TOKEN_SECRET=your_access_token_secret
   STACKS_PRIVATE_KEY=your_stacks_private_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_api_key
   ```

## Usage

To start the bot:

```
node src/bot.js
```

### Tipping Process

To tip STX, reply to a tweet with the amount (e.g., "10 STX"). The bot will automatically use the Stacks wallet associated with your Twitter account to process the transaction.

If you haven't linked a Stacks wallet yet, the bot will respond with instructions on how to do so.

### Wallet Onboarding

Users can create and link their Stacks wallets to the bot using a dedicated web-based interface or in-app solution. The bot will then be able to identify the correct wallet for each user during the tipping process.

## Deployment

This bot is designed to be deployed on Vercel, leveraging Supabase for the backend database. Refer to the "Deploying Twitter STX Tipping Bot on Vercel with Supabase" guide for detailed deployment instructions.

## Security Considerations

- Never share your `.env` file or expose your private keys
- Implement robust security measures in the wallet management system
- Regularly monitor your bot's activity and Stacks wallet balance

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
