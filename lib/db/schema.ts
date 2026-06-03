import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  subscription_tier: text('subscription_tier').default('free'),
  credits: integer('credits').default(0),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refreshToken: text('refreshToken'),
  accessToken: text('accessToken'),
  expiresAt: timestamp('expiresAt'),
  tokenType: text('tokenType'),
  scope: text('scope'),
  idToken: text('idToken'),
  sessionState: text('sessionState'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  token: text('token').notNull().unique(),
  expires: timestamp('expires').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

// --- WormGPT App Tables ---------------------------------------------------
export const activationKeys = pgTable('activation_keys', {
  id: text('id').primaryKey(),
  key_code: text('key_code').notNull().unique(),
  mode: integer('mode').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  activated_at: timestamp('activated_at'),
  chat_limit: integer('chat_limit'),
  is_lifetime: boolean('is_lifetime').default(false),
  expiration_date: timestamp('expiration_date'),
  status: text('status').default('active'),
  created_by_user_id: text('created_by_user_id').references(() => user.id, {
    onDelete: 'set null',
  }),
  activated_by_user_id: text('activated_by_user_id').references(() => user.id, {
    onDelete: 'set null',
  }),
  chat_count: integer('chat_count').default(0),
})

export const userKeys = pgTable('user_keys', {
  id: text('id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  activation_key_id: text('activation_key_id')
    .notNull()
    .references(() => activationKeys.id, { onDelete: 'cascade' }),
  mode: integer('mode').notNull(),
  chat_limit: integer('chat_limit'),
  chat_count: integer('chat_count').default(0),
  is_lifetime: boolean('is_lifetime').default(false),
  expiration_date: timestamp('expiration_date'),
  activated_at: timestamp('activated_at').notNull().defaultNow(),
})

export const chats = pgTable('chats', {
  id: text('id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').default('New Chat'),
  model: text('model').default('deepseek'),
  mode: integer('mode').default(1),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
  is_deleted: boolean('is_deleted').default(false),
})

export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  chat_id: text('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  user_id: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  role: text('role').notNull(),
  content: text('content').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  tokens_used: integer('tokens_used').default(0),
})

export const adminLogs = pgTable('admin_logs', {
  id: text('id').primaryKey(),
  admin_user_id: text('admin_user_id').references(() => user.id, {
    onDelete: 'set null',
  }),
  action: text('action').notNull(),
  target_type: text('target_type').notNull(),
  target_id: text('target_id'),
  details: jsonb('details'),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const systemPrompts = pgTable('system_prompts', {
  mode: integer('mode').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  system_prompt: text('system_prompt').notNull(),
  max_chaotic_level: integer('max_chaotic_level').default(5),
  is_admin_only: boolean('is_admin_only').default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})

export const apiKeys = pgTable('api_keys', {
  id: text('id').primaryKey(),
  provider: text('provider').notNull(),
  api_key: text('api_key').notNull(),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
})
