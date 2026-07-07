'use client'

import Link from 'next/link'
import { Check, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PricingPage() {
  const tiers = [
    {
      name: 'Free',
      price: '$0',
      description: 'Get started with WormGPT',
      features: [
        'Basic chat access',
        'Mode 1-2 access',
        'Up to 5 conversations',
        'Limited to basic API',
        'Community support',
      ],
      cta: 'Get Started',
      href: '/sign-in',
      highlighted: false,
    },
    {
      name: 'Monthly',
      price: '$50',
      period: '/month',
      description: 'Perfect for regular users',
      features: [
        'All free features',
        'Mode 1-3 access',
        'Unlimited conversations',
        'All 5 AI providers',
        'Priority support',
        'Advanced analytics',
      ],
      cta: 'Start Trial',
      href: '/dashboard',
      highlighted: false,
    },
    {
      name: 'Quarterly',
      price: '$110',
      period: '/3 months',
      description: 'Best for heavy users',
      features: [
        'All monthly features',
        'Mode 1-4 access',
        'Faster response times',
        'Custom system prompts',
        'Email support',
        'Admin mode access',
        'Audit logs',
      ],
      cta: 'Upgrade Now',
      href: '/dashboard',
      highlighted: true,
    },
    {
      name: 'Annual',
      price: '$175',
      period: '/year',
      description: 'Maximum value',
      features: [
        'All quarterly features',
        'Mode 1-5 access',
        'Unlimited advanced features',
        'Team collaboration',
        'API access',
        'Dedicated support',
        'Custom integrations',
      ],
      cta: 'Subscribe',
      href: '/dashboard',
      highlighted: false,
    },
    {
      name: 'Lifetime',
      price: '$220',
      period: 'one-time',
      description: 'Ultimate access',
      features: [
        'All annual features',
        'Mode 1-5 lifetime',
        'Agency mode included',
        'VSCode integration',
        'Priority API access',
        'Custom configuration',
        'Unlimited everything',
      ],
      cta: 'Buy Lifetime',
      href: '/dashboard',
      highlighted: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-red-500">WormGPT</span>
          </Link>
          <Link href="/sign-in" className="text-slate-300 hover:text-white">
            Sign In
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-white">Simple, Transparent Pricing</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose the perfect plan for your AI needs. All plans include access to all 5 AI providers and real-time streaming.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-20">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-lg border p-6 flex flex-col ${
                tier.highlighted
                  ? 'bg-gradient-to-br from-red-600/20 to-purple-600/20 border-red-500/50 scale-105 shadow-lg shadow-red-500/20'
                  : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-red-500/30'
              } transition-all`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Popular
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-slate-400 text-sm mb-4">{tier.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                {tier.period && <span className="text-slate-400 text-sm">{tier.period}</span>}
              </div>

              <Link href={tier.href} className="mb-6">
                <Button
                  className={`w-full ${
                    tier.highlighted
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-slate-700 hover:bg-slate-600'
                  } text-white`}
                >
                  {tier.cta}
                </Button>
              </Link>

              <div className="space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="text-green-400 mt-0.5 flex-shrink-0" size={16} />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8 mb-20">
          <h2 className="text-2xl font-bold mb-8 text-white">What's Included</h2>
          <div className="grid grid-cols-2 gap-6">
            {[
              { icon: '⚡', title: 'Lightning Speed', desc: 'Streaming responses under 100ms' },
              { icon: '🤖', title: '5 AI Providers', desc: 'Grok, DeepSeek, Mistral, Gemini, Cohere' },
              { icon: '🔐', title: 'Enterprise Security', desc: 'End-to-end encryption, secure keys' },
              { icon: '📊', title: 'Analytics', desc: 'Track usage, costs, and performance' },
              { icon: '🔄', title: 'Auto-Fallback', desc: 'Seamless failover between providers' },
              { icon: '💬', title: 'Full Chat History', desc: 'Access all conversations anytime' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-white text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes! Change your plan at any time. Changes take effect immediately.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and cryptocurrency. Invoicing available for annual plans.',
              },
              {
                q: 'Is there a free trial?',
                a: 'The Free tier is always available. Upgrade anytime to unlock premium features.',
              },
              {
                q: 'What is the difference between modes?',
                a: 'Modes 1-5 are public and progressive in power. Mode 6 (Admin) and 7 (Chaos) are restricted to qualified users.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-red-500/30 transition-colors"
              >
                <h4 className="font-semibold text-white mb-2">{item.q}</h4>
                <p className="text-slate-400 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/30 py-8 text-center text-slate-500 text-sm mt-20">
        <p>© 2025 WormGPT. All prices in USD. Billing handled securely.</p>
      </footer>
    </div>
  )
}
