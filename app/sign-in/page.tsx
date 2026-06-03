import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { WormGPTAuthForm } from '@/components/wormgpt-auth-form'
import { headers } from 'next/headers'

export const metadata = {
  title: 'Sign In - WormGPT',
  description: 'Access your WormGPT account',
}

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/dashboard')

  return <WormGPTAuthForm mode="sign-in" />
}
