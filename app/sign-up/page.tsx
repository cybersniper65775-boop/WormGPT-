import { SimpleSignupForm } from '@/components/simple-signup-form'

export const metadata = {
  title: 'Sign Up - WormGPT',
  description: 'Create your WormGPT account',
}

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-red-500/20 rounded-lg p-8 bg-black/50 backdrop-blur">
          <div className="mb-8 text-center">
            <img src="/wormgpt-logo.png" alt="WormGPT" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-red-500 mb-2">WORMGPT</h1>
            <p className="text-gray-400">Join the Abyss</p>
          </div>

          <SimpleSignupForm />
        </div>
      </div>
    </div>
  )
}
