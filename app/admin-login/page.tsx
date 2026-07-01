import { AdminEmailLogin } from '@/components/admin-email-login'

export const metadata = {
  title: 'Admin Login - WormGPT',
  description: 'Admin panel access',
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-yellow-600/30 rounded-lg p-8 bg-black/50 backdrop-blur">
          <div className="mb-8 text-center">
            <img src="/wormgpt-logo.png" alt="WormGPT" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-yellow-500 mb-2">ADMIN PANEL</h1>
            <p className="text-gray-400">Restricted Access</p>
          </div>

          <AdminEmailLogin />

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-center text-gray-400 text-sm">
              User account?{' '}
              <a href="/sign-in" className="text-red-500 hover:text-red-400 font-semibold">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
