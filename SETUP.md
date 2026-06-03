# WormGPT - Complete Setup Guide

This guide walks through setting up WormGPT for development and production deployment.

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Set Up Database

Create a Neon PostgreSQL database and add the connection string to `.env.local`:

```env
DATABASE_URL=postgresql://user:password@host/database
```

### 3. Generate Auth Secret

```bash
openssl rand -base64 32
```

Add to `.env.local`:
```env
BETTER_AUTH_SECRET=your-generated-secret-here
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit http://localhost:3000

## Detailed Setup

### Prerequisites

- **Node.js**: 18+ (verify with `node --version`)
- **pnpm**: 10+ (install with `npm i -g pnpm`)
- **Database**: Neon PostgreSQL account (free tier available)
- **API Keys** (optional, for AI integrations):
  - DeepSeek (recommended)
  - Grok (xAI)
  - Mistral
  - Gemini (Google)
  - Cohere

### Database Setup

#### Option 1: Neon PostgreSQL (Recommended)

1. Create free account at https://console.neon.tech
2. Create new project
3. Copy connection string in format:
   ```
   postgresql://user:password@ep-XXXXX.us-east-1.neon.tech/database
   ```
4. Add to `.env.local`:
   ```env
   DATABASE_URL=postgresql://...
   ```

#### Option 2: Local PostgreSQL

```bash
# macOS
brew install postgresql
brew services start postgresql

# Linux
sudo apt-get install postgresql-client
createdb wormgpt

# Generate connection string
postgresql://localhost/wormgpt
```

### Environment Configuration

Create `.env.local` in project root:

```env
# Database
DATABASE_URL=postgresql://...

# Authentication
BETTER_AUTH_SECRET=your-32-char-random-string

# Optional: AI API Keys
DEEPSEEK_API_KEY=sk-...
GROK_API_KEY=xai-...
MISTRAL_API_KEY=...
GOOGLE_API_KEY=...
COHERE_API_KEY=...

# Optional: Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running Database Migrations

The schema is automatically created by Neon. If you need to manage migrations:

```bash
# Check current schema
psql $DATABASE_URL -c "\dt"

# The following tables should exist:
# - user
# - session
# - account
# - verification
# - activation_keys
# - user_keys
# - chats
# - messages
# - system_prompts
# - api_keys
# - admin_logs
```

### Creating First Admin User

After deployment, you'll need an admin account to use the license system.

**Option A: Via Database**
```sql
-- Connect to your database
psql $DATABASE_URL

-- Create admin user (replace values)
INSERT INTO "user" (id, name, email, email_verified, password_hash, subscription_tier, created_at)
VALUES (
  'admin-' || gen_random_uuid()::text,
  'Admin',
  'admin@example.com',
  true,
  'hash-here', -- Password hash from Better Auth
  'admin',
  NOW()
);
```

**Option B: Via UI (Development)**
1. Sign up normally
2. Connect to database and run SQL above
3. Change `subscription_tier` to `'admin'`

**Option C: Via Script**
```bash
# Create admin.js
const { db } = require('./lib/db');
const { user } = require('./lib/db/schema');

async function createAdmin() {
  const result = await db.insert(user).values({
    name: 'Admin',
    email: 'admin@example.com',
    emailVerified: true,
    subscriptionTier: 'admin',
  });
  console.log('Admin created:', result);
}

createAdmin().catch(console.error);
```

## Development Workflow

### Starting the App

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2 (optional): Monitor database
psql $DATABASE_URL -c "SELECT * FROM chats;"
```

### Testing Features

#### 1. Test Landing Page
- Visit http://localhost:3000
- Verify design looks correct
- Test navigation buttons

#### 2. Test Authentication
- Click "Join Us"
- Sign up with email/password
- Verify email setup (check auth logs)
- Sign in with credentials

#### 3. Test License Activation
- Sign up new user
- Go to /admin (as admin user)
- Generate test key
- Copy key code
- Go to /dashboard (as new user)
- Activate key in "Activate License" card

#### 4. Test Chat Features
- Click "Get Started" or choose template
- Create new chat
- Send message
- View message history
- Delete chat

#### 5. Test Admin Panel
- Visit /admin (must be logged in as admin)
- Generate new key with options:
  - Different modes (1-7)
  - Chat limits
  - Lifetime vs expiration
- Revoke a key
- Verify keys work for activation

### Common Issues

**Issue: Database connection refused**
- Verify `DATABASE_URL` is correct
- Check database is running
- Ensure firewall allows connections
- For Neon: check IP whitelist

**Issue: Better Auth not initialized**
- Generate new `BETTER_AUTH_SECRET`
- Restart dev server
- Clear browser cookies

**Issue: Admin routes return 401**
- User must have `subscription_tier = 'admin'`
- Check in database: `SELECT email, subscription_tier FROM "user";`
- Update manually if needed

**Issue: Keys not activating**
- Check key format: `WormGPT-XXXXX-XXXXX-XXXXX`
- Ensure key hasn't expired
- Verify key isn't already used
- Check `activation_keys` table in database

## Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/wormgpt
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit https://vercel.com/new
   - Import your GitHub repository
   - Configure environment variables:
     - `DATABASE_URL`
     - `BETTER_AUTH_SECRET`
     - Any API keys

3. **Verify Production**
   - Visit your deployment URL
   - Test sign up/sign in
   - Test key activation
   - Test chat creation

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod

COPY . .
RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "start"]
```

Deploy with:
```bash
docker build -t wormgpt .
docker run -p 3000:3000 -e DATABASE_URL=... -e BETTER_AUTH_SECRET=... wormgpt
```

### Self-Hosted (Node.js)

```bash
# Build for production
pnpm build

# Start production server
NODE_ENV=production pnpm start

# Or use PM2 for process management
npm install -g pm2
pm2 start "pnpm start" --name wormgpt
pm2 startup
pm2 save
```

## Post-Deployment Checklist

- [ ] Database is connected and migrations ran
- [ ] First admin user created
- [ ] Test license key generation works
- [ ] Test key activation works
- [ ] Sign up/sign in flow works
- [ ] Chat creation and messaging works
- [ ] Admin panel accessible and functional
- [ ] All environment variables set
- [ ] HTTPS enabled (production)
- [ ] Error tracking configured (Sentry)
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Security headers set

## Next Steps

### Phase 1: MVP Complete ✅
- [x] Authentication system
- [x] License key management
- [x] Chat interface
- [x] Dashboard
- [x] Admin panel

### Phase 2: AI Integration
- [ ] Integrate DeepSeek API
- [ ] Integrate Grok API
- [ ] Implement streaming responses
- [ ] Add token counting
- [ ] Implement rate limiting

### Phase 3: Advanced Features
- [ ] File uploads
- [ ] Code execution
- [ ] Conversation export
- [ ] Team collaboration
- [ ] API access for developers

### Phase 4: Monetization
- [ ] Stripe integration
- [ ] Subscription tiers
- [ ] Usage-based billing
- [ ] Enterprise licensing
- [ ] White-label options

## Support & Documentation

- **Issues**: Create GitHub issue
- **Discussions**: Start GitHub discussion
- **Security**: Email security@wormgpt.dev
- **Bugs**: Report at github.com/yourusername/wormgpt/issues

## License

This project is proprietary. See LICENSE file for details.
