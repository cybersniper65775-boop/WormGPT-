import { SimpleSigninForm } from '@/components/simple-signin-form'

export const metadata = {
  title: 'Sign In - WormGPT',
  description: 'Access your WormGPT account',
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-red-500/20 rounded-lg p-8 bg-black/50 backdrop-blur">
          <div className="mb-8 text-center">
            <img src="/wormgpt-logo.png" alt="WormGPT" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-red-500 mb-2">WORMGPT</h1>
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          <SimpleSigninForm />

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-center text-gray-400 text-sm">
              Admin access?{' '}
              <a href="/admin-login" className="text-red-500 hover:text-red-400 font-semibold">
                Admin Panel
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
