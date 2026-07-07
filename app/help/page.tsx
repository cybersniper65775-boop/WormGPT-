'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, Send, BookOpen, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function HelpPage() {
  const [search, setSearch] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqCategories = [
    {
      category: 'Getting Started',
      items: [
        {
          q: 'How do I sign up for WormGPT?',
          a: 'Click "Get Started" on the landing page, create an account with email and password, and activate an activation key to begin using WormGPT.',
        },
        {
          q: 'What is an activation key?',
          a: 'An activation key (formatted as WormGPT-XXXXX-XXXXX-XXXXX) unlocks access to WormGPT features. Keys define your power mode (1-7) and chat limits.',
        },
        {
          q: 'Where do I get an activation key?',
          a: 'Admins can generate keys from the admin panel. Users should contact their organization admin or purchase a key from the pricing page.',
        },
      ],
    },
    {
      category: 'Using WormGPT',
      items: [
        {
          q: 'What are the 7 power modes?',
          a: 'Modes range from Basic (Mode 1) to Chaos (Mode 7). Higher modes provide stronger AI reasoning, fewer restrictions, and more advanced capabilities. Modes 6-7 are admin-only.',
        },
        {
          q: 'Which AI providers does WormGPT support?',
          a: 'WormGPT integrates with Grok, DeepSeek, Mistral, Gemini, and Cohere. You can switch between providers in the chat interface.',
        },
        {
          q: 'How do I stream responses?',
          a: 'All responses are streamed by default. You\'ll see text appear character-by-character as the AI generates it, similar to ChatGPT.',
        },
        {
          q: 'Can I save and share my chats?',
          a: 'All chats are automatically saved to your account. You can access them from the sidebar. Sharing features are coming soon.',
        },
      ],
    },
    {
      category: 'Subscription & Billing',
      items: [
        {
          q: 'What\'s the difference between tiers?',
          a: 'Free: Modes 1-2. Monthly: Modes 1-3. Quarterly: Modes 1-4. Annual: Modes 1-5. Lifetime: All modes + VSCode integration.',
        },
        {
          q: 'Can I cancel anytime?',
          a: 'Yes! Monthly and quarterly plans can be cancelled anytime. Annual plans are non-refundable but include 30-day money-back guarantee.',
        },
        {
          q: 'Do you offer refunds?',
          a: 'Monthly plans: Full refund within 30 days. Annual: 30-day money-back guarantee. Lifetime: No refunds, only transfers.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, PayPal, bank transfers, and cryptocurrency. Invoicing available for annual and lifetime plans.',
        },
      ],
    },
    {
      category: 'Admin Features',
      items: [
        {
          q: 'How do I generate activation keys?',
          a: 'Log in to the admin panel (admin-login page), go to the Keys section, set mode/limit/expiration, and click "Generate Key".',
        },
        {
          q: 'Can I revoke or modify keys?',
          a: 'Yes! From the admin panel, you can revoke keys, extend expiration dates, or change chat limits for existing keys.',
        },
        {
          q: 'What is admin logging?',
          a: 'All admin actions (key generation, revocation, user management) are logged for audit purposes. Access logs from the admin dashboard.',
        },
      ],
    },
  ]

  const filteredFaqs = faqCategories.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        search === '' ||
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-red-500">
            WormGPT Help
          </Link>
          <Link href="/dashboard" className="text-slate-300 hover:text-white">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Search */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Search help articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 bg-slate-800 border-slate-600 text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: BookOpen,
              title: 'Documentation',
              desc: 'Full API documentation',
            },
            { icon: AlertCircle, title: 'Status', desc: 'System status & uptime' },
            { icon: Send, title: 'Contact', desc: 'Get in touch with support' },
          ].map((link) => {
            const IconComponent = link.icon
            return (
              <div
                key={link.title}
                className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6 hover:border-red-500/30 transition-colors cursor-pointer"
              >
                <IconComponent className="text-red-500 mb-3" size={24} />
                <h3 className="font-semibold text-white mb-1">{link.title}</h3>
                <p className="text-sm text-slate-400">{link.desc}</p>
              </div>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="space-y-8">
          {filteredFaqs.map((category, catIdx) => (
            category.items.length > 0 && (
              <div key={catIdx}>
                <h2 className="text-2xl font-bold mb-4 text-white">{category.category}</h2>
                <div className="space-y-3">
                  {category.items.map((item, idx) => {
                    const itemId = `${catIdx}-${idx}`
                    return (
                      <button
                        key={itemId}
                        onClick={() =>
                          setExpandedFaq(expandedFaq === itemId ? null : itemId)
                        }
                        className="w-full text-left bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-4 hover:border-red-500/30 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="font-semibold text-white">{item.q}</h3>
                          <ChevronDown
                            size={20}
                            className={`text-slate-400 flex-shrink-0 transition-transform ${
                              expandedFaq === itemId ? 'rotate-180' : ''
                            }`}
                          />
                        </div>

                        {expandedFaq === itemId && (
                          <p className="text-slate-400 mt-3">{item.a}</p>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          ))}
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-br from-red-600/20 to-purple-600/20 border border-red-500/30 rounded-lg p-8 mt-16 text-center">
          <h2 className="text-2xl font-bold mb-3 text-white">Can't find what you're looking for?</h2>
          <p className="text-slate-300 mb-6">Contact our support team for immediate assistance.</p>
          <button className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            <Send size={18} />
            Contact Support
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/30 py-8 text-center text-slate-500 text-sm mt-20">
        <p>© 2025 WormGPT Help Center. Updated regularly with new content.</p>
      </footer>
    </div>
  )
}
