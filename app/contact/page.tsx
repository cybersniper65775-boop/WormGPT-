'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-red-500">
            WormGPT
          </Link>
          <Link href="/dashboard" className="text-slate-300 hover:text-white">
            Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-white">Get in Touch</h1>
          <p className="text-xl text-slate-400">
            Have questions? We're here to help. Reach out to our team anytime.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-16">
          {/* Contact Info */}
          <div className="col-span-1 space-y-6">
            {[
              {
                icon: Mail,
                title: 'Email',
                value: 'support@wormgpt.com',
                desc: 'We reply within 24 hours',
              },
              {
                icon: Phone,
                title: 'Phone',
                value: '+1 (555) 123-4567',
                desc: 'Mon-Fri, 9AM-6PM EST',
              },
              {
                icon: MapPin,
                title: 'Office',
                value: 'San Francisco, CA',
                desc: 'Remote support available',
              },
            ].map((item) => {
              const IconComponent = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-6"
                >
                  <IconComponent className="text-red-500 mb-3" size={28} />
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-slate-300 font-mono text-sm mb-2">{item.value}</p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Contact Form */}
          <div className="col-span-2">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      className="bg-slate-700 border-slate-600 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="How can we help?"
                    className="bg-slate-700 border-slate-600 text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us more..."
                    rows={6}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 text-white rounded-lg focus:outline-none focus:border-red-500"
                    required
                  ></textarea>
                </div>

                {submitted && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                    <p className="text-green-400 text-sm">
                      Message sent! We'll get back to you within 24 hours.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-lg p-8">
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                title: 'Response Time',
                desc: 'We typically respond to support requests within 24 hours during business days.',
              },
              {
                title: 'Available 24/7',
                desc: 'Our platform runs 24/7. Critical issues are handled by our on-call team.',
              },
              {
                title: 'Community',
                desc: 'Join our Discord community for tips, updates, and discussions with other users.',
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/30 py-8 text-center text-slate-500 text-sm mt-20">
        <p>© 2025 WormGPT. We value your feedback and support inquiries.</p>
      </footer>
    </div>
  )
}
