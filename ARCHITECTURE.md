# WormGPT Architecture & Implementation Guide

## Overview

WormGPT is a full-stack AI chat application with enterprise-grade access control and license key management. The system is designed with security, scalability, and admin control as core principles.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js 16)                   │
├─────────────────────────────────────────────────────────────┤
│  Landing Page  │  Auth Pages  │  Dashboard  │  Chat UI      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                   API Routes & Server Actions                │
├─────────────────────────────────────────────────────────────┤
│  /api/auth/[...all]  │  /app/actions/keys.ts                │
│  /app/actions/chats.ts                                      │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│              Better Auth + Session Management                │
├─────────────────────────────────────────────────────────────┤
│  Email/Password Auth  │  Session Tokens  │  User Context    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│         Neon PostgreSQL + Drizzle ORM                         │
├─────────────────────────────────────────────────────────────┤
│  Users  │  Keys  │  Chats  │  Messages  │  Audit Logs       │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19.2 + Tailwind CSS
- **Components**: shadcn/ui (pre-built components)
- **Client State**: React Hooks + SWR (for data fetching)
- **Forms**: HTML forms + Server Actions

### Backend
- **Runtime**: Node.js (Vercel/Server)
- **Auth**: Better Auth (email/password)
- **ORM**: Drizzle ORM
- **Database**: Neon PostgreSQL
- **Server Actions**: Next.js 16 Server Actions

### Infrastructure
- **Deployment**: Vercel (recommended)
- **Database**: Neon PostgreSQL
- **Environment**: TypeScript + Node 18+

## Core Features Implementation

### 1. Authentication System

**File Structure:**
```
lib/
  ├── auth.ts          # Better Auth server config
  ├── auth-client.ts   # Client-side auth utilities
  └── db/
      └── schema.ts    # User & session tables
```

**Flow:**
1. User signs up with email/password
2. Better Auth hashes password and creates user
3. Session token created and stored in database
4. Session validated on each request via `auth.api.getSession()`
5. User context available in Server Components via `headers()`

**Key Features:**
- Secure password hashing (bcrypt via Better Auth)
- Stateless session management
- CSRF protection
- Cross-origin support

### 2. License Key System

**File Structure:**
```
lib/db/schema.ts      # activation_keys, user_keys tables
app/actions/keys.ts   # Key activation & generation logic
components/
  ├── key-activation-card.tsx  # User activation UI
  └── admin-panel.tsx          # Admin generation UI
```

**Tables:**

**activation_keys:**
```sql
id                 // UUID
key_code           // WormGPT-XXXXX-XXXXX-XXXXX
mode               // 1-7 (access level)
chat_limit         // Optional chat count limit
is_lifetime        // Boolean for unlimited duration
expiration_date    // Optional expiration
is_revoked         // Admin revocation flag
is_used            // Activation flag
created_at         // Timestamp
```

**user_keys:**
```sql
id                 // UUID
user_id            // Foreign key to user
key_id             // Foreign key to activation_keys
activated_at       // When user activated it
```

**Key Generation Process:**
1. Admin visits `/admin` (requires `subscription_tier = 'admin'`)
2. Admin selects mode (1-7)
3. Admin optionally sets:
   - Chat limit (default unlimited)
   - Lifetime (default expiration in days)
   - Expiration date
4. System generates random key code starting with `WormGPT-`
5. Key stored in `activation_keys` table
6. Key displayed for admin to share

**Key Activation Process:**
1. User enters key code on dashboard
2. System validates:
   - Key exists in database
   - Key not expired
   - Key not already used (`is_used = false`)
   - Key not revoked (`is_revoked = false`)
3. If valid:
   - Create entry in `user_keys` table
   - Set `is_used = true` in `activation_keys`
   - Cache active key in user context
4. User can now:
   - Create chats (up to limit)
   - Access modes up to key's mode level
   - See expiration and chat remaining

### 3. Chat System

**File Structure:**
```
app/dashboard/
  ├── page.tsx                      # Dashboard home
  ├── chats/page.tsx               # Chat list view
  ├── chat/[id]/page.tsx           # Individual chat
  └── settings/page.tsx            # User settings
app/actions/chats.ts               # Chat CRUD operations
components/
  ├── chat-interface.tsx           # Main chat UI
  ├── chat-list.tsx                # Chat history display
  └── quick-start-card.tsx         # Chat templates
```

**Tables:**

**chats:**
```sql
id                 // UUID
user_id            // Foreign key to user
title              // Chat name
mode               // 1-7 (selected mode)
model              // AI model name
is_deleted         // Soft delete flag
created_at         // Timestamp
updated_at         // Timestamp
```

**messages:**
```sql
id                 // UUID
chat_id            // Foreign key to chats
user_id            // Foreign key to user
role               // 'user' | 'assistant'
content            // Message text
tokens_used        // Token count (for billing)
created_at         // Timestamp
```

**Chat Creation:**
1. User clicks "Get Started" or selects template
2. Mode selection (limited to key's max mode)
3. Server Action `createChat()` validates:
   - User has active key
   - Chat count < limit
   - Mode ≤ key's mode
4. Chat created with selected mode
5. User redirected to `/dashboard/chat/{chatId}`

**Messaging:**
1. User types message in input
2. Client sends via Server Action `addMessage()`
3. Message saved to database with role='user'
4. AI response generated (placeholder for now)
5. AI response saved with role='assistant'
6. Both displayed in real-time on UI

### 4. Admin Panel

**Access Control:**
- Only users with `subscription_tier = 'admin'` can access `/admin`
- Redirects non-admin users to `/dashboard`

**Features:**
1. **Generate Keys:**
   - Select mode (1-7)
   - Optional: chat limit
   - Optional: lifetime access
   - Optional: expiration days
   - Displays generated key code (copy-paste)

2. **Revoke Keys:**
   - Enter key code
   - Sets `is_revoked = true`
   - Prevents future activation of revoked key

3. **Admin Info:**
   - Key format documentation
   - Mode descriptions
   - Limit explanations

### 5. Mode System

**File Structure:**
```
lib/wormgpt-modes.ts    # Mode definitions and system prompts
```

**Modes:**
```typescript
1: FAST       // Fast responses, minimal processing
2: SMART      // Balanced intelligence
3: DEEP       // Deep reasoning and analysis
4: SUPREME    // Advanced capabilities
5: ULTRA      // Maximum intelligence (default)
6: ADMIN      // Admin-only system operations
7: CHAOS      // Admin-only unrestricted mode
```

**System Prompts:**
Each mode has a unique system prompt that's applied to all requests at that mode level. Prompts define:
- Operational style
- Capabilities
- Restrictions
- Response format

**Usage:**
```typescript
import { getModeConfig } from '@/lib/wormgpt-modes'

const config = getModeConfig(userKey.mode)
// config.name, config.label, config.description, config.system_prompt
```

## Data Flow Examples

### Example 1: User Sign Up & Key Activation

```
1. User visits / (landing page)
2. Clicks "Join Us"
3. Navigates to /sign-up
4. Submits email/password
5. Better Auth creates user in database
6. User signed in automatically
7. Redirected to /dashboard
8. Sees "Activate License" card
9. Enters key code: WormGPT-ABC12-DEF34-GHI56
10. Server Action validates key:
    - Key exists? ✓
    - Not expired? ✓
    - Not used? ✓
    - Not revoked? ✓
11. Key marked as used
12. Entry created in user_keys
13. Dashboard refreshes
14. User sees license status
15. Can now create chats
```

### Example 2: Creating & Sending Chat Message

```
1. User clicks "Get Started"
2. Selects "Security Analysis" template
3. Server Action creates chat with mode=4
4. User redirected to /dashboard/chat/{chatId}
5. Sees empty chat interface
6. Types message: "How do I harden my SSH config?"
7. Clicks send
8. Client adds message to UI immediately
9. Server Action saves user message
10. AI generates response (placeholder)
11. Server Action saves AI response
12. Response appears in chat
13. User can continue conversation
```

### Example 3: Admin Generates License Key

```
1. Admin visits /admin
2. System checks: subscription_tier = admin ✓
3. Selects mode: 4 (SUPREME)
4. Sets chat limit: 100
5. Sets lifetime: false
6. Sets expiration: 30 days
7. Clicks "Generate Key"
8. Server Action:
   - Generates random key: WormGPT-XYZAB-CDEFG-HIJKL
   - Calculates expiration: now + 30 days
   - Creates activation_keys row
   - Returns key code
9. Key displayed for admin
10. Admin copies and sends to user
11. User receives key
12. User activates on their dashboard
```

## Security Considerations

### 1. Authentication
- Passwords hashed with bcrypt (Better Auth)
- Sessions stored in database
- CSRF tokens on forms
- Cross-origin cookies configured
- Session validation on every request

### 2. Authorization
- Per-user data filtering (no RLS)
- Admin-only routes with redirects
- Key validation before chat creation
- Mode-based access control
- Soft deletes (no permanent data loss)

### 3. Data Protection
- Parameterized queries (Drizzle ORM)
- SQL injection prevention
- Input validation
- Type safety (TypeScript)
- Error messages don't leak secrets

### 4. Rate Limiting
- Configure via middleware (not yet implemented)
- Per-user chat creation limits
- Per-key request limits (via tokens)

### 5. Audit Logging
- Admin actions logged in `admin_logs` table
- User actions tracked with timestamps
- Soft deletes for recovery

## Performance Optimizations

### 1. Database
- Indexes on user_id, chat_id, key_id
- Efficient queries with Drizzle
- Connection pooling via Neon

### 2. Frontend
- Server-side rendering for fast initial load
- Static pages where possible
- Client hydration minimal
- SWR for client data sync

### 3. Caching
- Next.js automatic caching
- Revalidate tags for invalidation
- User key cached in session

## Deployment Considerations

### Environment Variables
```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=32-char-min-random-string
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### Database Migrations
- Schema created automatically by Neon
- Drizzle migrations run on deployment
- No manual SQL needed

### Health Checks
- Database connectivity test
- Auth system verification
- Key generation validation

## Extensibility Points

### 1. Add New Modes
Edit `lib/wormgpt-modes.ts`:
```typescript
export const WORMGPT_MODES = {
  8: {
    name: 'Custom Mode',
    label: 'CUSTOM',
    description: '...',
    system_prompt: '...',
    is_admin_only: false,
  }
}
```

### 2. Integrate AI APIs
Modify `/app/dashboard/chat/[id]/page.tsx` to call:
- DeepSeek API
- Grok API
- Mistral
- Gemini
- Cohere

### 3. Add Database Features
Use Drizzle to add tables:
```typescript
export const customTable = pgTable('custom', {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid().references(() => user.id),
  // ... your columns
})
```

### 4. Extend Admin Panel
Add new admin functions in:
- `app/actions/keys.ts` (server logic)
- `components/admin-panel.tsx` (UI)

### 5. Custom Authentication
Replace Better Auth with:
- Auth0
- Clerk
- NextAuth.js
- Custom JWT implementation

## Monitoring & Observability

### Recommended Services
- **Error Tracking**: Sentry (free tier)
- **Analytics**: PostHog (open source)
- **Logs**: Vercel Logs (built-in)
- **Monitoring**: UptimeRobot

### Key Metrics to Track
- Auth success/failure rate
- Key activation success rate
- Chat creation rate
- Message processing latency
- Database query performance
- User retention

## Future Enhancements

### Phase 2: AI Integration
- [ ] DeepSeek API integration
- [ ] Grok API integration
- [ ] Streaming responses
- [ ] Token counting
- [ ] Cost tracking

### Phase 3: Advanced Features
- [ ] File uploads
- [ ] Code execution
- [ ] Conversation export
- [ ] Sharing & collaboration
- [ ] Developer API

### Phase 4: Monetization
- [ ] Stripe integration
- [ ] Subscription tiers
- [ ] Usage-based billing
- [ ] Enterprise licensing
- [ ] White-label options

## Testing Strategy

### Unit Tests
- Mode selection logic
- Key validation functions
- Chat creation constraints

### Integration Tests
- Full auth flow
- Key activation flow
- Chat creation + messaging
- Admin key generation

### E2E Tests
- User sign up journey
- License key activation
- Chat interface interaction
- Admin panel operations

### Manual Testing Checklist
- [ ] Sign up/sign in works
- [ ] Key activation works
- [ ] Chat creation works
- [ ] Messages save correctly
- [ ] Admin panel accessible
- [ ] Key generation works
- [ ] Key revocation works
- [ ] Logout works
- [ ] Settings page loads
- [ ] Chat history displays

## Troubleshooting Guide

### Common Issues & Solutions

**Issue: Database connection fails**
- Check `DATABASE_URL` is correct
- Ensure database is running
- For Neon: check IP whitelist
- Verify credentials

**Issue: Better Auth not working**
- Regenerate `BETTER_AUTH_SECRET`
- Restart dev server
- Clear browser cookies
- Check database tables exist

**Issue: Keys not validating**
- Verify key format
- Check key not expired
- Verify key not already used
- Check key not revoked

**Issue: Admin panel 401 error**
- Verify user has `subscription_tier = 'admin'`
- Check database: `SELECT subscription_tier FROM "user" WHERE email = '...'`
- Update manually if needed

**Issue: Chat not creating**
- Check user has active key
- Verify chat limit not reached
- Check mode is valid (1-5 for users, 1-7 for admins)
- View server logs for errors

## Documentation Structure

- **README.md**: Overview and features
- **SETUP.md**: Installation and configuration
- **ARCHITECTURE.md**: This file - system design
- **CONTRIBUTING.md**: Development guidelines (if open source)
- **API.md**: API endpoint documentation (future)

## Conclusion

WormGPT is a production-ready AI chat platform with enterprise access control. The system is designed for:
- **Security**: Multiple layers of authentication and authorization
- **Scalability**: Database-driven architecture ready for millions of users
- **Maintainability**: Clear separation of concerns, TypeScript safety
- **Extensibility**: Easy to add features, integrate new APIs, add modes
- **Control**: Admin panel for license management and system oversight
