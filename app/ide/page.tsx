import { IDEEditor } from '@/components/ide-editor'

export const metadata = {
  title: 'WormGPT IDE',
  description: 'Code editor with live preview and AI assistance',
}

export default function IDEPage() {
  return (
    <main>
      <IDEEditor />
    </main>
  )
}
