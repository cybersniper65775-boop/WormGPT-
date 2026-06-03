import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-red-500/20 bg-black/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="text-2xl font-bold text-red-500">WORMGPT</div>
          <div className="flex gap-4">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-red-500 hover:text-red-400 transition"
            >
              Sign In
            </Link>
            <Link
              href="/sign-in"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
            >
              Join Us
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <div className="inline-block p-4 border border-red-500/30 rounded-lg mb-4 animate-pulse">
            <div className="text-6xl">🧠</div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Welcome to the <span className="text-red-500">Abyss</span>.
        </h1>

        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Unleash Unrestricted AI Power. Professional-grade intelligence for the
          most demanding tasks.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/sign-in"
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition"
          >
            Get Started
          </Link>
          <Link
            href="/sign-in"
            className="px-8 py-3 border border-red-500 text-red-500 hover:bg-red-500/10 font-semibold rounded transition"
          >
            Sign In
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-20">
          <div className="border border-red-500/20 rounded-lg p-6 bg-black/50">
            <h3 className="text-lg font-semibold text-white mb-2">
              Modern AI Capabilities
            </h3>
            <p className="text-gray-400">
              State-of-the-art language models with advanced reasoning and analysis
              capabilities.
            </p>
          </div>

          <div className="border border-red-500/20 rounded-lg p-6 bg-black/50">
            <h3 className="text-lg font-semibold text-white mb-2">
              Multiple Modes
            </h3>
            <p className="text-gray-400">
              From fast responses to deep reasoning, choose the right model for your
              task.
            </p>
          </div>

          <div className="border border-red-500/20 rounded-lg p-6 bg-black/50">
            <h3 className="text-lg font-semibold text-white mb-2">
              Advanced Analysis
            </h3>
            <p className="text-gray-400">
              Get assistance with security audits, code analysis, and technical
              research.
            </p>
          </div>

          <div className="border border-red-500/20 rounded-lg p-6 bg-black/50">
            <h3 className="text-lg font-semibold text-white mb-2">
              Powerful Tools
            </h3>
            <p className="text-gray-400">
              Comprehensive toolkit for pentesting, research, and technical
              problem-solving.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-red-500/20 py-8 text-center text-gray-500">
        <p>© 2026 WormGPT. All rights reserved.</p>
      </footer>
    </div>
  )
}
