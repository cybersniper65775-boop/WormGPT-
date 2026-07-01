import { CodeGenerator } from '@/components/code-generator'

export const metadata = {
  title: 'WormGPT Code Generator',
  description: 'Generate, preview, and download code with AI assistance',
}

export default function GeneratorPage() {
  return (
    <main>
      <CodeGenerator />
    </main>
  )
}
