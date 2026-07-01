'use client'

import { useState } from 'react'
import { ChevronDown, Copy, Download, Play, Settings, X } from 'lucide-react'

interface File {
  id: string
  name: string
  language: string
  content: string
}

export function IDEEditor() {
  const [files, setFiles] = useState<File[]>([
    {
      id: '1',
      name: 'App.tsx',
      language: 'typescript',
      content: `export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <h1 className="text-4xl font-bold text-white p-8">
        Welcome to WormGPT IDE
      </h1>
      <p className="text-slate-300 px-8">
        Build, preview, and deploy with AI assistance
      </p>
    </div>
  )
}`,
    },
  ])
  const [activeFileId, setActiveFileId] = useState(files[0].id)
  const [showPreview, setShowPreview] = useState(true)

  const activeFile = files.find((f) => f.id === activeFileId)

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-700 flex flex-col bg-slate-900">
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <h2 className="font-semibold text-sm text-slate-300 mb-2">Explorer</h2>
        </div>

        {/* File List */}
        <div className="flex-1 overflow-auto">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`px-3 py-2 cursor-pointer text-sm transition-colors ${
                activeFileId === file.id
                  ? 'bg-slate-700 text-slate-50 border-l-2 border-red-500'
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {file.name}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <button className="w-full px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm text-slate-300 transition-colors">
            + New File
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-12 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-slate-400">{activeFile?.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-slate-200"
              title="Toggle Preview"
            >
              <Play size={18} />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-slate-200" title="Copy Code">
              <Copy size={18} />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-slate-200" title="Download">
              <Download size={18} />
            </button>
            <button className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-slate-200" title="Settings">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Editor Content Area */}
        <div className="flex-1 flex gap-0 overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 overflow-auto font-mono text-sm">
            <div className="bg-slate-950 p-4 min-h-full">
              {/* Line Numbers */}
              <div className="flex">
                <div className="text-slate-600 text-right pr-4 select-none">
                  {activeFile?.content.split('\n').map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Code Content */}
                <div className="flex-1">
                  <pre className="text-slate-300">{activeFile?.content}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div className="w-1/2 border-l border-slate-700 flex flex-col bg-slate-900">
              <div className="h-12 border-b border-slate-700 px-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Preview</span>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-auto bg-white">
                <iframe
                  title="Preview"
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                          body { margin: 0; }
                        </style>
                      </head>
                      <body>
                        <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
                          <h1 class="text-4xl font-bold text-white p-8">Welcome to WormGPT IDE</h1>
                          <p class="text-slate-300 px-8">Build, preview, and deploy with AI assistance</p>
                        </div>
                      </body>
                    </html>
                  `}
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
