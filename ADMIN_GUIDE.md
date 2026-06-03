# WormGPT Admin Panel Guide

## Overview

The WormGPT Admin Panel is a secure license key management system that allows administrators to generate, manage, and revoke activation keys for users. It's accessible via the unified authentication system with a master admin code.

## Accessing the Admin Panel

### Login Steps

1. Navigate to `/sign-in` on your WormGPT instance
2. Click the **Admin** tab
3. Enter the admin code: `WormGPT-ADMIN-MASTER-KEY`
4. Click **Access Admin Panel**

### Admin Credentials

**Default Admin Code:** `WormGPT-ADMIN-MASTER-KEY`

- This is a master code that grants full access to the admin panel
- It uses cookie-based session management (24-hour duration)
- Cannot be changed without code modifications (security feature)

## Admin Panel Features

### 1. Generate License Key

The **Generate License Key** section allows you to create activation codes for users.

#### Configuration Options:

**Mode Selection**
- `Worm v4.0 - FAST`: Quick responses (Mode 1)
- `Worm v4.1 - SMART`: Smart responses (Mode 2)
- `Worm v4.3 - DEEP`: Deep reasoning (Mode 3)
- `Worm v5.0 - SUPREME`: Advanced capabilities (Mode 4)
- `Worm v5.1 - ULTRA`: Maximum power (Mode 5)
- `Admin Mode Alpha`: Admin-only mode (Mode 6)
- `Chaos Mode`: Chaos mode (Mode 7)

**Chat Limit**
- Enter a number to limit chats (e.g., 50, 100)
- Leave empty for unlimited chats
- Useful for trial or basic tier keys

**Lifetime Access**
- Check this box to grant permanent access
- Ignores expiration date settings
- Ideal for premium tier users

**Expiration (Days)**
- Enter number of days until key expires
- Only applies if "Lifetime Access" is unchecked
- Leave empty for no expiration

#### Key Generation

Click **Generate Key** to create a new activation code. The system will:
1. Generate a unique key in format: `WormGPT-XXXXX-XXXXX-XXXXX`
2. Store it in the database with specified configurations
3. Display the key with instructions for sharing

**Important:** Keys can only be used once per user account. Share the complete key code with the user.

### 2. Revoke License Key

The **Revoke License Key** section deactivates existing keys.

#### Revocation Process

1. Enter the complete key code in the "Key Code" field
2. Click **Revoke Key**
3. The key will be marked as revoked and cannot be used for new activations
4. Existing users with that key will retain access (revocation only blocks future activations)

**Use Cases:**
- Deactivate trial keys after expiration
- Revoke compromised keys
- Remove fraudulent activation codes

## Key Management Best Practices

### Security

1. **Secure Key Distribution**
   - Send keys via secure channels (email, encrypted message)
   - Never share keys in plaintext chats or logs
   - Revoke keys if accidentally exposed

2. **Admin Session**
   - Log out when finished (click Logout button)
   - Admin sessions expire after 24 hours
   - Clear sensitive information from browser

3. **Access Control**
   - Only admins should have the master code
   - Rotate the master code regularly (requires code update)
   - Monitor admin activity logs

### Key Lifecycle

**Generation → Distribution → Activation → Usage**

1. **Generation**: Create keys with appropriate mode and limits
2. **Distribution**: Send to users securely
3. **Activation**: User activates key in their dashboard
4. **Usage**: User accesses WormGPT with granted permissions
5. **Revocation**: Disable key when needed

### Monitoring

- **Track Generated Keys**: The system stores all key metadata
- **Monitor Chat Limits**: Keys track chat usage automatically
- **Review Expiration**: Set appropriate expiration dates for time-limited access

## Admin Panel Interface

### Header
- **ADMIN PANEL**: Title and indicator of current page
- **Logout**: Securely ends admin session

### Left Panel (Generate Keys)
- Mode dropdown
- Chat limit input
- Lifetime access checkbox
- Expiration days input
- Generate button
- Success message with generated key

### Right Panel (Revoke Keys)
- Key code input field
- Revoke button (enabled only when key is entered)
- Information about revocation

### Bottom Section
- **Admin Info**: Key guidelines and best practices

## Technical Details

### Key Format

Keys follow this format: `WormGPT-XXXXX-XXXXX-XXXXX`

- Prefix: `WormGPT-` (required for validation)
- Three sections of 5 random characters each
- Case-sensitive
- Generated using nanoid for uniqueness

### Database Storage

Keys are stored with:
- Unique ID and code
- Mode (1-7)
- Chat limit (optional)
- Lifetime flag
- Expiration date
- Status (active, revoked, used)
- Creation timestamp

### Session Management

Admin sessions use:
- HTTP-only cookies (secure flag in production)
- 24-hour duration
- Path-restricted to admin routes
- Cannot be accessed by client-side JavaScript

## Troubleshooting

### "Admin access required" Error
- Verify you're logged in with the correct admin code
- Check if admin session cookie is properly set
- Try logging out and back in

### Key Not Generating
- Ensure all required fields are filled
- Check browser console for error messages
- Verify database connection is active
- Try refreshing the page

### Key Not Working for User
- Confirm key is in active status (not revoked)
- Check key hasn't expired
- Verify user is using exact key format provided
- Ensure user meets mode requirements

## Advanced Configuration

### Changing Admin Code

To change the master admin code:

1. Edit `/vercel/share/v0-project/app/api/auth/admin-login/route.ts`
2. Change the `ADMIN_CODE` constant
3. Redeploy the application
4. Use new code for future admin access

### Customizing Key Format

To modify key generation format:

1. Edit `/vercel/share/v0-project/app/actions/keys.ts`
2. Find the `generateAdminKey` function
3. Modify this line:
   ```typescript
   const keyCode = `WormGPT-${nanoid(5)}-${nanoid(5)}-${nanoid(5)}`
   ```
4. Adjust the format as needed

### Session Duration

To change admin session timeout:

1. Edit `/vercel/share/v0-project/app/api/auth/admin-login/route.ts`
2. Change `ADMIN_SESSION_DURATION` value (in milliseconds)
3. Default: 24 hours (86,400,000 ms)

## API Endpoints

### Admin Login
**POST** `/api/auth/admin-login`
```json
{
  "adminCode": "WormGPT-ADMIN-MASTER-KEY"
}
```

### Admin Logout
**POST** `/api/auth/admin-logout`
- Clears admin session cookie
- No request body required

## Support & Maintenance

### Regular Tasks

1. **Weekly**: Review generated keys and monitor usage
2. **Monthly**: Check for expired keys and update documentation
3. **Quarterly**: Audit admin logs and review access patterns
4. **Yearly**: Plan admin code rotation and security updates

### Monitoring Dashboard

Future versions should include:
- Key usage statistics
- User adoption metrics
- Revenue tracking by tier
- Expiration alerts
- Revocation history

---

**Last Updated**: May 28, 2026
**Version**: 1.0
