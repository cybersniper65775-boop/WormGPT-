'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, X, Maximize2, Minimize2, Copy } from 'lucide-react'

interface TerminalLine {
  id: string
  type: 'input' | 'output' | 'error' | 'info'
  content: string
  timestamp: Date
}

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '0',
      type: 'info',
      content: 'WormGPT Terminal v1.0 - Ready',
      timestamp: new Date(),
    },
    {
      id: '1',
      type: 'info',
      content: 'Type help for available commands',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [executing, setExecuting] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [currentDir, setCurrentDir] = useState('/project')
  const terminalEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [lines])

  const executeCommand = async () => {
    if (!input.trim()) return

    // Add user input to terminal
    const inputLine: TerminalLine = {
      id: Date.now().toString(),
      type: 'input',
      content: `${currentDir} $ ${input}`,
      timestamp: new Date(),
    }

    setLines((prev) => [...prev, inputLine])
    setInput('')
    setExecuting(true)

    // Simulate command execution
    setTimeout(() => {
      let outputContent = ''
      const cmd = input.trim().toLowerCase()

      if (cmd === 'help') {
        outputContent = `Available commands:
  ls             List files and directories
  cd <path>      Change directory
  pwd            Print working directory
  npm install    Install dependencies
  npm start      Start development server
  npm run build  Build the project
  npm test       Run tests
  clear          Clear terminal
  help           Show this help message`
      } else if (cmd === 'ls') {
        outputContent = `src/       components/  pages/       utils/
public/    package.json tsconfig.json .gitignore`
      } else if (cmd === 'pwd') {
        outputContent = currentDir
      } else if (cmd === 'npm install') {
        outputContent = `npm notice
npm notice New minor version of npm available! 10.0.0 -> 10.2.4
npm notice To update run: npm install -g npm@10.2.4
npm notice
added 150 packages in 3.2s`
      } else if (cmd === 'npm start') {
        outputContent = `ready - started server on 0.0.0.0:3000, url: http://localhost:3000
event - compiled client and server successfully`
      } else if (cmd === 'npm run build') {
        outputContent = `Creating an optimized production build...
Compiled successfully.
Out: .next/
Build cache was not readable`
      } else if (cmd === 'clear') {
        setLines([
          {
            id: 'new-0',
            type: 'info',
            content: 'Terminal cleared',
            timestamp: new Date(),
          },
        ])
        setExecuting(false)
        return
      } else if (cmd.startsWith('cd ')) {
        const path = cmd.substring(3).trim()
        setCurrentDir(path)
        outputContent = ''
      } else if (cmd === '') {
        outputContent = ''
      } else {
        outputContent = `Command not found: ${cmd}. Type 'help' for available commands.`
      }

      if (outputContent) {
        const outputLine: TerminalLine = {
          id: (Date.now() + 1).toString(),
          type: cmd.includes('Error') || cmd.includes('error') ? 'error' : 'output',
          content: outputContent,
          timestamp: new Date(),
        }
        setLines((prev) => [...prev, outputLine])
      }

      setExecuting(false)
    }, 800)
  }

  const copyTerminalOutput = () => {
    const text = lines.map((line) => line.content).join('\n')
    navigator.clipboard.writeText(text)
  }

  if (maximized) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col">
        {/* Header */}
        <div className="h-12 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-4">
          <span className="text-sm font-semibold">WormGPT Terminal</span>
          <button
            onClick={() => setMaximized(false)}
            className="p-1.5 hover:bg-slate-800 rounded transition-colors"
          >
            <Minimize2 size={16} />
          </button>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 overflow-auto p-4 font-mono text-sm space-y-1 bg-slate-950">
          {lines.map((line) => (
            <div
              key={line.id}
              className={`${
                line.type === 'input'
                  ? 'text-green-400'
                  : line.type === 'error'
                    ? 'text-red-400'
                    : line.type === 'info'
                      ? 'text-blue-400'
                      : 'text-slate-300'
              }`}
            >
              {line.content}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-700 bg-slate-900 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
              placeholder={`${currentDir} $`}
              disabled={executing}
              className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-green-500 transition-colors"
            />
            <button
              onClick={executeCommand}
              disabled={executing}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white rounded transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-slate-950 border border-slate-700 rounded-lg shadow-2xl flex flex-col max-h-96 z-40">
      {/* Header */}
      <div className="h-10 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-4 rounded-t-lg">
        <span className="text-xs font-semibold text-slate-300">Terminal</span>
        <div className="flex gap-1">
          <button
            onClick={() => setMaximized(true)}
            className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400"
          >
            <Maximize2 size={14} />
          </button>
          <button
            onClick={() => setLines([])}
            className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400"
            title="Copy output"
          >
            <Copy size={14} />
          </button>
          <button className="p-1 hover:bg-red-900/20 rounded transition-colors text-slate-400 hover:text-red-400">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-auto p-3 font-mono text-xs space-y-0.5 bg-slate-950 max-h-80">
        {lines.map((line) => (
          <div
            key={line.id}
            className={`${
              line.type === 'input'
                ? 'text-green-400'
                : line.type === 'error'
                  ? 'text-red-400'
                  : line.type === 'info'
                    ? 'text-blue-400'
                    : 'text-slate-300'
            } truncate`}
          >
            {line.content}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-700 bg-slate-900 p-2 rounded-b-lg">
        <div className="flex gap-1">
          <span className="text-xs font-mono text-green-400 whitespace-nowrap">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && executeCommand()}
            placeholder="npm start"
            disabled={executing}
            className="flex-1 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-slate-100 placeholder-slate-600 focus:outline-none focus:border-green-500 transition-colors"
          />
          <button
            onClick={executeCommand}
            disabled={executing}
            className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white rounded text-xs transition-colors"
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}
