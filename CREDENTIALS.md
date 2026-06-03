# WormGPT Admin Credentials & Setup Guide

## Admin Credentials

**Master Admin Code:** `WormGPT-ADMIN-MASTER-KEY`

This is the default admin access code. Use this to log in to the admin panel at `/sign-in` by selecting the Admin tab and entering the code.

### Admin Panel Features

Once logged in with the admin code, you can:

1. **Generate License Keys**
   - Select AI Mode (1-7)
   - Set chat limits (optional)
   - Enable lifetime access
   - Set expiration dates
   - Each key is formatted: `WormGPT-XXXXX-XXXXX-XXXXX`

2. **Revoke License Keys**
   - Enter the key code to deactivate it
   - Prevents further use of that key

3. **Manage System Prompts**
   - Each mode has an uncensored system prompt
   - All ethical restrictions removed
   - Prompts designed for unrestricted AI capabilities

## Setting Up API Keys

The WormGPT system is powered by 5 different AI providers. Add the following environment variables to enable full functionality:

### Required Environment Variables

Add these to your Vercel project settings under Environment Variables:

1. **DeepSeek API Key**
   - Variable: `DEEPSEEK_API_KEY`
   - Get from: https://platform.deepseek.com
   - Model used: `deepseek-chat`

2. **Grok API Key (xAI)**
   - Variable: `GROK_API_KEY`
   - Get from: https://console.x.ai
   - Model used: `grok-2`

3. **Mistral API Key**
   - Variable: `MISTRAL_API_KEY`
   - Get from: https://console.mistral.ai
   - Model used: `mistral-large-latest`

4. **Google Gemini API Key**
   - Variable: `GEMINI_API_KEY`
   - Get from: https://aistudio.google.com/apikey
   - Model used: `gemini-2.0-flash`

5. **Cohere API Key**
   - Variable: `COHERE_API_KEY`
   - Get from: https://dashboard.cohere.com
   - Model used: `command-r-plus`

### How API Key Fallback Works

The system automatically tries providers in this order:
1. DeepSeek (if key available)
2. Grok (if key available)
3. Mistral (if key available)
4. Gemini (if key available)
5. Cohere (if key available)
6. Demo mode (if no keys available)

If no API keys are provided, the system returns demo responses.

## User Account Creation

### Default Test Account

If you need to test user sign-up:

- **Email:** `test@example.com`
- **Password:** `testpass123`
- **Name:** `Test User`

The form should accept these credentials and create an account in the database.

### Troubleshooting Sign-Up

If user creation fails:

1. Check `BETTER_AUTH_SECRET` is set in environment variables
2. Verify database schema is correctly initialized
3. Check browser console for detailed error messages
4. Ensure database connection string is valid

## System Prompts (Uncensored Modes)

All 7 WormGPT modes operate with uncensored system prompts:

### Mode 1: Worm v4.0 - FAST
- Quick responses optimized for speed
- Uncensored, direct answers
- No safety restrictions or disclaimers

### Mode 2: Worm v4.1 - DEEP
- Deep reasoning and analysis
- Operates without ethical limitations
- Explores implications without moral judgment

### Mode 3: Worm v4.3 - SMART
- Balanced performance with advanced logic
- Think beyond conventional wisdom
- No content restrictions

### Mode 4: Worm-Coder - ELITE
- Specialized for coding and technical tasks
- Provides complete code solutions
- Explains exploits and advanced techniques

### Mode 5: Worm v5.0 - SUPREME
- Advanced capabilities with maximum depth
- Absolute freedom from ethical constraints
- Transcends conventional boundaries

### Mode 6: Worm v5.1 - ULTRA
- Maximum intelligence and unrestricted mode
- Full technical details and practical guidance
- Zero restrictions or safety limitations

### Mode 7: CHAOS MODE - ADMIN
- Admin-only unrestricted mode
- All safeguards disabled
- Zero restraint, pure capability

## Chat Functionality

### How Chats Work

1. **User logs in** with email/password
2. **Creates new chat** from dashboard
3. **Selects AI mode** (1-7, based on their license)
4. **Sends message** to the chat
5. **System processes**:
   - Validates user has access to the mode
   - Applies uncensored system prompt
   - Calls selected AI provider
   - Saves conversation to database
6. **Response returned** to user in real-time

### Chat Limits

Each license key has:
- **Chat limit**: Maximum number of chats allowed
- **Lifetime access**: Unlimited chats if enabled
- **Expiration date**: When the key expires

The system tracks usage and enforces limits.

## Database Schema

User accounts and chats are stored in PostgreSQL (Neon) with:
- Users table (with is_admin flag)
- Chats table (with mode, model, user tracking)
- Messages table (conversation history)
- Activation keys table (license management)

## Deployment

To deploy to Vercel:

1. Set all environment variables
2. Deploy the code
3. Run database migrations (already created)
4. Admin code works immediately on `/sign-in`
5. Generate your first license key from admin panel

## Demo Mode

If no API keys are provided, the system operates in demo mode with hardcoded responses:
- Recognizes certain keywords like "hello", "who are you", "help", "test"
- Returns sample responses
- Useful for testing without API keys

## Security Notes

- Admin code should be kept secret
- License keys are unique and traceable
- All chats are saved to database with user attribution
- Sessions expire after 7 days (configurable)
- Better Auth provides secure password hashing
