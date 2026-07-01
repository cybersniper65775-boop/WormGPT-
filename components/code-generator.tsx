'use client'

import { useState } from 'react'
import { Download, Copy, Eye, Code, FileJson, File, Archive, Zap } from 'lucide-react'

interface GeneratedFile {
  name: string
  language: string
  content: string
  size: number
}

export function CodeGenerator() {
  const [prompt, setPrompt] = useState('')
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([
    {
      name: 'App.tsx',
      language: 'typescript',
      content: `import React from 'react'

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-5xl font-bold text-white mb-4">
          WormGPT Generated App
        </h1>
        <p className="text-xl text-slate-400 mb-8">
          This code was generated with AI assistance
        </p>
        <button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">
          Get Started
        </button>
      </div>
    </div>
  )
}`,
      size: 420,
    },
    {
      name: 'package.json',
      language: 'json',
      content: JSON.stringify(
        {
          name: 'wormgpt-generated-app',
          version: '1.0.0',
          scripts: {
            dev: 'next dev',
            build: 'next build',
            start: 'next start',
          },
          dependencies: {
            react: '^18.0.0',
            'next': '^16.0.0',
            'tailwindcss': '^3.0.0',
          },
        },
        null,
        2
      ),
      size: 256,
    },
    {
      name: 'tailwind.config.js',
      language: 'javascript',
      content: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#DC143C',
        secondary: '#1F2937',
      },
    },
  },
  plugins: [],
}`,
      size: 285,
    },
  ])
  const [selectedFile, setSelectedFile] = useState(0)
  const [preview, setPreview] = useState(true)
  const [copied, setCopied] = useState(false)

  const downloadFile = (file: GeneratedFile) => {
    const element = document.createElement('a')
    const fileContent = new Blob([file.content], { type: 'text/plain' })
    element.href = URL.createObjectURL(fileContent)
    element.download = file.name
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const downloadZIP = async () => {
    // Simulate ZIP download
    alert(
      `Downloading ZIP with ${generatedFiles.length} files (${generatedFiles.reduce((sum, f) => sum + f.size, 0)} bytes)`
    )
  }

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalSize = generatedFiles.reduce((sum, f) => sum + f.size, 0)
  const currentFile = generatedFiles[selectedFile]

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Sidebar - Generator */}
      <div className="w-80 border-r border-red-500/20 bg-slate-950 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-red-500/20">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-red-500" size={20} />
            <h2 className="text-lg font-bold text-red-500">Code Generator</h2>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider">
              Describe your code
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Create a React component for a todo list..."
              className="w-full mt-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500 resize-none h-24"
            />
          </div>

          <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
            Generate Code
          </button>

          {/* Generated Files Info */}
          {generatedFiles.length > 0 && (
            <div className="bg-slate-800/50 rounded-lg p-3 space-y-2">
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                Generated Files
              </p>
              <p className="text-2xl font-bold text-red-400">{generatedFiles.length}</p>
              <p className="text-xs text-slate-500">
                Total size: {(totalSize / 1024).toFixed(2)} KB
              </p>
            </div>
          )}
        </div>

        {/* Download Options */}
        <div className="border-t border-slate-700 p-4 space-y-2">
          <button
            onClick={downloadZIP}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            <Archive size={16} />
            Download ZIP
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors">
            <FileJson size={16} />
            Export as JSON
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* File Tabs */}
        <div className="h-12 border-b border-slate-700 bg-slate-900/50 flex items-center px-4 gap-2 overflow-x-auto">
          {generatedFiles.map((file, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFile(idx)}
              className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors whitespace-nowrap ${
                selectedFile === idx
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {file.language === 'json' ? (
                <FileJson size={14} />
              ) : file.language === 'typescript' ? (
                <Code size={14} />
              ) : (
                <File size={14} />
              )}
              {file.name}
            </button>
          ))}
        </div>

        {/* Editor and Preview Split */}
        <div className="flex-1 flex gap-0 overflow-hidden">
          {/* Code Editor */}
          <div className="flex-1 overflow-auto font-mono text-sm bg-slate-950">
            <div className="flex">
              {/* Line Numbers */}
              <div className="bg-slate-900 text-slate-600 text-right px-4 py-4 select-none text-xs border-r border-slate-800">
                {currentFile.content.split('\n').map((_, i) => (
                  <div key={i} className="h-5">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code Content */}
              <div className="flex-1 p-4 overflow-auto">
                <pre className="text-slate-300 whitespace-pre-wrap break-words">
                  {currentFile.content}
                </pre>
              </div>
            </div>
          </div>

          {/* Right Panel - Controls & Preview */}
          {preview && (
            <div className="w-72 border-l border-slate-700 bg-slate-900 flex flex-col">
              <div className="h-12 border-b border-slate-700 px-4 flex items-center justify-between">
                <span className="text-sm font-semibold">File Controls</span>
                <button
                  onClick={() => setPreview(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 space-y-3">
                {/* File Info */}
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                    File Info
                  </p>
                  <div className="bg-slate-800 rounded p-2 space-y-1 text-xs">
                    <p>
                      <span className="text-slate-400">Name:</span> {currentFile.name}
                    </p>
                    <p>
                      <span className="text-slate-400">Type:</span> {currentFile.language}
                    </p>
                    <p>
                      <span className="text-slate-400">Size:</span>{' '}
                      {(currentFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                    Actions
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => copyToClipboard(currentFile.content)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm transition-colors"
                    >
                      <Copy size={14} />
                      {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                    <button
                      onClick={() => downloadFile(currentFile)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                    >
                      <Download size={14} />
                      Download File
                    </button>
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">
                    Statistics
                  </p>
                  <div className="bg-slate-800 rounded p-2 space-y-1 text-xs">
                    <p>
                      <span className="text-slate-400">Lines:</span>{' '}
                      {currentFile.content.split('\n').length}
                    </p>
                    <p>
                      <span className="text-slate-400">Characters:</span>{' '}
                      {currentFile.content.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
