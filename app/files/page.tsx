import { FileManager } from '@/components/file-manager'

export const metadata = {
  title: 'WormGPT File Manager',
  description: 'Manage your project files and structure',
}

export default function FilesPage() {
  return (
    <main>
      <FileManager />
    </main>
  )
}
