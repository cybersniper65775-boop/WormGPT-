// config.example.js
// Copy this file to "config.js" and fill in your own keys.
// IMPORTANT: Do NOT commit config.js to source control. Add it to .gitignore.
//
// This file exposes a single global: window.WGPT_CONFIG
// The app (worm.js) will read API keys and credentials from window.WGPT_CONFIG.

window.WGPT_CONFIG = {
  // OpenRouter keys (two keys supported for fallback; leave empty if you don't use OpenRouter)
  OPENROUTER_API_KEY: "",
  OPENROUTER_API_KEY_2: "",

  // Anthropic / Claude
  ANTHROPIC_KEY: "",

  // Google (Gemini) API key (if used)
  GEMINI_KEY: "",

  // ScrapingBee (web search)
  SCRAPINGBEE_KEY: "",

  // Admin credentials (only for local/dev usage; do NOT reuse production admin creds here)
  ADMIN_EMAIL: "",    // e.g. "admin@example.com"
  ADMIN_PASS: "",     // plain-text here for local auth; consider implementing server-side auth instead

  // Feature toggles
  WEB_SEARCH_ENABLED: false,

  // Optional: override other defaults
  FREE_LIMIT: 10,
  LIMIT_WINDOW_MS: 15 * 60 * 60 * 1000
};
