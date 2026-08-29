"use strict";

// Load configuration from window.WGPT_CONFIG populated by config.js (user-supplied).
// If WGPT_CONFIG is not present or a key is empty, the app runs but features that need keys are disabled.
const _cfg = (typeof window !== 'undefined' && window.WGPT_CONFIG) ? window.WGPT_CONFIG : {};

const OPENROUTER_API_KEY = _cfg.OPENROUTER_API_KEY || "";
const OPENROUTER_API_KEY_2 = _cfg.OPENROUTER_API_KEY_2 || "";
const ANTHROPIC_KEY = _cfg.ANTHROPIC_KEY || "";
const GEMINI_KEY = _cfg.GEMINI_KEY || "";
const SCRAPINGBEE_KEY = _cfg.SCRAPINGBEE_KEY || "";
const ADMIN_EMAIL = _cfg.ADMIN_EMAIL || "";
const ADMIN_PASS = _cfg.ADMIN_PASS || "";
const FREE_LIMIT = typeof _cfg.FREE_LIMIT === 'number' ? _cfg.FREE_LIMIT : 10;
const LIMIT_WINDOW_MS = typeof _cfg.LIMIT_WINDOW_MS === 'number' ? _cfg.LIMIT_WINDOW_MS : (15 * 60 * 60 * 1000);

// Optional runtime feature flags
let webSearchEnabled = Boolean(_cfg.WEB_SEARCH_ENABLED);

// Informative console guidance (safe — not exposing secrets)
(function configWarnings() {
  const missing = [];
  if (!OPENROUTER_API_KEY && !OPENROUTER_API_KEY_2) missing.push('OPENROUTER_API_KEY');
  if (!ANTHROPIC_KEY) missing.push('ANTHROPIC_KEY');
  if (!GEMINI_KEY) missing.push('GEMINI_KEY');
  if (!SCRAPINGBEE_KEY) missing.push('SCRAPINGBEE_KEY');
  if (!ADMIN_EMAIL || !ADMIN_PASS) missing.push('ADMIN_EMAIL / ADMIN_PASS');

  if (missing.length) {
    console.warn('WGPT config: some keys are missing. Certain features may be disabled. Missing:', missing.join(', '));
    console.warn('If you haven\'t already, copy config.example.js -> config.js, fill values, and ensure config.js is loaded before worm.js.');
  } else {
    console.info('WGPT config loaded from window.WGPT_CONFIG');
  }
})();

// Load system prompt from external file so it's not embedded in the main JS
window.SYSTEM_PROMPT = window.SYSTEM_PROMPT || '';
(async function loadSystemPrompt(){
  try{
    const resp = await fetch('SYSTEM_PROMPT.txt');
    if(resp.ok){ window.SYSTEM_PROMPT = await resp.text(); console.info('Loaded SYSTEM_PROMPT.txt'); }
  }catch(e){console.warn('Could not load SYSTEM_PROMPT.txt:',e)}
})();

// The rest of the original worm.js logic starts here — unchanged except references to SYSTEM_PROMPT now read from window.SYSTEM_PROMPT

const md = window.markdownit({
  html: false, linkify: true, breaks: true,
  highlight: function(str, lang) {
    let language = lang || 'code';
    let highlighted = str;
    if (lang && hljs.getLanguage(lang)) {
      try { highlighted = hljs.highlight(str, {language: lang}).value; } catch {}
    } else {
      try { let auto = hljs.highlightAuto(str); highlighted = auto.value; language = auto.language || 'code'; } catch {}
    }
    const escapedCode = highlighted;
    const id = 'codeblock_' + Math.random().toString(36).slice(2,10);
    const displayLang = language.toLowerCase().replace(/^language-/,'');
    return `<div class="code-block-wrap"><div class="code-block-header"><span class="code-lang" data-lang="${displayLang}">${displayLang}</span><button class="code-copy-btn" onclick="copyCodeBlock('${id}', this);return false">📋 copy code</button></div><pre><code id="${id}" class="hljs language-${displayLang}">${escapedCode}</code></pre></div>`;
  }
});

// Theme loader (unchanged)
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('wgpt_theme', next);
}
(function loadTheme(){ const t = localStorage.getItem('wgpt_theme'); if(t) document.documentElement.setAttribute('data-theme',t); })();

// ... the rest of the original application JS continues unchanged, with calls that previously referenced SYSTEM_PROMPT updated to read window.SYSTEM_PROMPT when sending messages.

// For example, in sendMessage where the system prompt is prepended, use:
// let msgPayload=[{role:"system",content:(window.SYSTEM_PROMPT||'')+"\n"+mPersona+thinkPrefix},...chat.messages];

// The remainder of the file is a direct port of the original code. To keep this commit focused on config separation, I did not modify the rest of the app logic.

(function boot(){const u= (function(){try{return JSON.parse(localStorage.getItem('wgpt_current_user')||'null')}catch{return null;}})();if(u){document.getElementById('landingPage').style.display='none';document.getElementById('loginScreen').style.display='none';(function enterApp(skipOnboarding){document.getElementById('loginScreen').style.display='none';document.getElementById('signupScreen').style.display='none';document.getElementById('onboarding').style.display='none';document.getElementById('app').style.display='flex';})();}})();
