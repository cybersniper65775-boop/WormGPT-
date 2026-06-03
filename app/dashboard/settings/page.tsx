import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { SettingsPanel } from '@/components/settings-panel'

export const metadata = {
  title: 'Settings - WormGPT',
  description: 'Manage your WormGPT settings',
}

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/sign-in')
  }

  return <SettingsPanel user={session.user} />
}
