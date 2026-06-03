# WormGPT - Unrestricted AI System

A full-stack AI chat application with enterprise-grade access control, license key management, and mode-based capabilities. Built with Next.js 16, Better Auth, Neon PostgreSQL, and Drizzle ORM.

## 🎯 Features

### Core Features
- **7 Power Modes**: From fast responses (Worm v4.0) to unrestricted intelligence (Worm v5.1)
- **License Key System**: Admin-generated activation keys with mode, chat limits, and expiration tracking
- **Chat Interface**: Real-time conversation with mode-specific behavior
- **Dashboard**: User dashboard with chat history, license status, and quick-start templates
- **Admin Panel**: Generate and revoke license keys with granular control

### WormGPT Modes
1. **Worm v4.0 - FAST**: Quick responses optimized for speed
2. **Worm v4.1 - SMART**: Balanced intelligence with enhanced logic
3. **Worm v4.3 - DEEP**: Deep reasoning and comprehensive analysis
4. **Worm v5.0 - SUPREME**: Advanced capabilities with unrestricted insights
5. **Worm v5.1 - ULTRA**: Maximum intelligence and unrestricted analysis
6. **Admin Mode Alpha** (Admin only): System administration and management
7. **Chaos Mode** (Admin only): Complete unrestriction for authorized users

### Access Control
- Email/password authentication with Better Auth
- License key activation per user (format: `WormGPT-XXXXX-XXXXX-XXXXX`)
- Mode-based access (key mode determines max accessible level)
- Chat limits per key (optional, can be unlimited or lifetime)
- Expiration dates with lifetime option
- Admin-only modes (6 & 7) accessible only to admin users

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Neon PostgreSQL account
- API keys for: DeepSeek, Grok, Mistral, Gemini, Cohere (for AI integrations)

### Installation

1. **Clone and Install**
```bash
pnpm install
```

2. **Environment Setup**
Create a `.env.local` file with:
```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]
BETTER_AUTH_SECRET=your-random-secret-32-chars-min
```

Generate `BETTER_AUTH_SECRET`:
```bash
openssl rand -base64 32
```

3. **Database Setup**
The database schema is pre-created. If needed, run migrations:
```bash
# Schema tables are already created via Neon MCP
# No additional migrations needed
```

4. **Run Development Server**
```bash
pnpm dev
```

Visit http://localhost:3000

## 📋 Database Schema

### Core Tables
- **user**: User accounts with subscription tier
- **session**: Authentication sessions
- **account**: OAuth account linking
- **verification**: Email verification tokens

### WormGPT Tables
- **activation_keys**: License keys with mode and chat limits
- **user_keys**: User's active license keys
- **chats**: Chat conversations per user
- **messages**: Individual messages in chats
- **system_prompts**: System prompts for each mode (1-7)
- **api_keys**: API credentials for AI providers
- **admin_logs**: Audit log for admin actions

## 🔐 Admin Panel

Access at `/admin` (requires admin subscription tier)

### Key Generation
Generate activation keys with:
- **Mode**: 1-7 (modes 6-7 admin-only)
- **Chat Limit**: Optional (unlimited if not set)
- **Lifetime**: Toggle for indefinite access
- **Expiration Date**: Optional expiration in days

### Key Format
```
WormGPT-XXXXX-XXXXX-XXXXX
```
- Must start with `WormGPT-`
- Can only be activated once
- Generated randomly by admin

### Key Management
- View generated keys
- Revoke active keys (prevents future activation)
- Track activation status

## 🗝️ License Key Activation Flow

1. User receives key code (e.g., `WormGPT-ABC12-DEF34-GHI56`)
2. User signs up/in and goes to Dashboard
3. User enters key code in "Activate License" card
4. System validates:
   - Key exists and is active
   - Key not already used by another user
   - Key not expired
5. Key is linked to user's account
6. User can now:
   - Create chats up to the limit
   - Access mode up to the key's mode level
   - Access chat history

## 💬 Chat Interface

### Creating Chats
- Limited by user's active key
- Select from templates or create custom
- Choose mode (limited to key's max mode)
- Chat count tracked against limit

### Message Handling
- Real-time display
- Mode-specific system prompts applied
- Token counting (placeholder for now)
- Full conversation history

### Features
- Rename chats
- Delete chats
- View chat history with timestamps
- Mode indicator with description

## 📊 Settings & Account

### User Settings
- View account email and name
- Check active license status
- See remaining chats/expiration date
- Manage preferences
- Logout

### License Info Displayed
- Mode level
- Chat count vs limit
- Expiration date (if applicable)
- Lifetime status
- Access type

## 🛠️ Development

### Project Structure
```
app/
  ├── page.tsx                  # Landing page
  ├── sign-in/page.tsx          # Sign in page
  ├── sign-up/page.tsx          # Sign up page
  ├── dashboard/
  │   ├── page.tsx              # Dashboard home
  │   ├── chats/page.tsx        # All chats view
  │   ├── chat/[id]/page.tsx    # Individual chat
  │   └── settings/page.tsx     # User settings
  ├── admin/page.tsx            # Admin panel
  └── api/auth/[...all]/route.ts # Auth endpoints

lib/
  ├── auth.ts                   # Better Auth config
  ├── auth-client.ts            # Client auth utilities
  ├── wormgpt-modes.ts          # Mode definitions & system prompts
  └── db/
      ├── index.ts              # Drizzle client
      └── schema.ts             # Database schema

app/actions/
  ├── keys.ts                   # Key activation & admin actions
  └── chats.ts                  # Chat management actions

components/
  ├── wormgpt-auth-form.tsx    # Auth UI
  ├── dashboard-sidebar.tsx     # Sidebar navigation
  ├── key-activation-card.tsx   # License activation form
  ├── quick-start-card.tsx      # Quick start templates
  ├── chat-list.tsx             # Chat history display
  ├── chat-interface.tsx        # Main chat UI
  ├── settings-panel.tsx        # Settings page
  └── admin-panel.tsx           # Admin controls
```

### Adding New Modes
Edit `lib/wormgpt-modes.ts`:
```typescript
export const WORMGPT_MODES = {
  8: {
    name: 'Custom Mode',
    label: 'CUSTOM',
    description: 'Your description',
    system_prompt: 'Your system prompt...',
    is_admin_only: false,
  },
  // ...
}
```

### Integrating AI APIs
WormGPT supports multiple AI providers:
- **DeepSeek**: Default fast model
- **Grok**: xAI intelligence
- **Mistral**: European AI model
- **Gemini**: Google's multimodal AI
- **Cohere**: Fallback provider

To integrate an API:
1. Store API key in `api_keys` table
2. Update `chat/[id]/page.tsx` to call your AI provider
3. Apply mode-specific system prompt
4. Stream responses to chat interface

## 🔄 Server Actions

### Key Management (`app/actions/keys.ts`)
- `activateKey(keyCode)`: User activates a license key
- `getUserActiveKey()`: Get user's current active key
- `generateAdminKey()`: Admin generates new key
- `revokeAdminKey()`: Admin revokes a key

### Chat Management (`app/actions/chats.ts`)
- `createChat(title, mode)`: Create new chat
- `getUserChats()`: Fetch all user chats
- `getChat(chatId)`: Get single chat
- `getChatMessages(chatId)`: Fetch messages
- `addMessage()`: Save message to database
- `deleteChat()`: Soft-delete chat
- `renameChat()`: Update chat title

## 🔒 Security

### Authentication
- Email/password with Better Auth
- Secure session management
- CSRF protection
- Cross-origin cookie handling for dev environments

### Authorization
- Per-user data scoping (no RLS, explicit filters)
- Admin-only routes and actions
- License key validation before chat creation
- Mode-based feature access

### Data Protection
- Parameterized queries (Drizzle ORM)
- User isolation (all queries filtered by userId)
- Audit logging for admin actions
- Expired key validation

## 📝 Notes

### Current Limitations
- Chat responses are placeholders (real AI integration needed)
- Token counting not yet implemented
- File uploads not yet supported
- Conversation export not yet available

### Next Steps for Production
1. Integrate actual AI APIs (DeepSeek, Grok, etc.)
2. Implement streaming responses
3. Add conversation export (PDF, JSON)
4. Add file upload and code execution capabilities
5. Implement rate limiting and cost tracking
6. Add payment processing for subscription tiers
7. Set up monitoring and error tracking (Sentry)
8. Add comprehensive audit logging

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🤝 Support

For issues or questions, contact support@wormgpt.dev
