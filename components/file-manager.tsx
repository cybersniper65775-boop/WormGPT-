'use client'

import { useState } from 'react'
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderPlus,
  FilePlus,
  Trash2,
  Edit2,
  Search,
  MoreVertical,
} from 'lucide-react'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  expanded?: boolean
  children?: FileNode[]
  path: string
}

export function FileManager() {
  const [tree, setTree] = useState<FileNode[]>([
    {
      id: '1',
      name: 'src',
      type: 'folder',
      expanded: true,
      path: '/src',
      children: [
        {
          id: '1-1',
          name: 'components',
          type: 'folder',
          expanded: true,
          path: '/src/components',
          children: [
            {
              id: '1-1-1',
              name: 'Header.tsx',
              type: 'file',
              path: '/src/components/Header.tsx',
            },
            {
              id: '1-1-2',
              name: 'Footer.tsx',
              type: 'file',
              path: '/src/components/Footer.tsx',
            },
            {
              id: '1-1-3',
              name: 'Button.tsx',
              type: 'file',
              path: '/src/components/Button.tsx',
            },
          ],
        },
        {
          id: '1-2',
          name: 'pages',
          type: 'folder',
          expanded: false,
          path: '/src/pages',
          children: [
            {
              id: '1-2-1',
              name: 'index.tsx',
              type: 'file',
              path: '/src/pages/index.tsx',
            },
            {
              id: '1-2-2',
              name: 'about.tsx',
              type: 'file',
              path: '/src/pages/about.tsx',
            },
          ],
        },
        {
          id: '1-3',
          name: 'utils',
          type: 'folder',
          expanded: false,
          path: '/src/utils',
          children: [
            {
              id: '1-3-1',
              name: 'api.ts',
              type: 'file',
              path: '/src/utils/api.ts',
            },
            {
              id: '1-3-2',
              name: 'helpers.ts',
              type: 'file',
              path: '/src/utils/helpers.ts',
            },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'public',
      type: 'folder',
      expanded: false,
      path: '/public',
      children: [
        {
          id: '2-1',
          name: 'logo.svg',
          type: 'file',
          path: '/public/logo.svg',
        },
      ],
    },
    {
      id: '3',
      name: 'package.json',
      type: 'file',
      path: '/package.json',
    },
    {
      id: '4',
      name: 'tsconfig.json',
      type: 'file',
      path: '/tsconfig.json',
    },
    {
      id: '5',
      name: '.gitignore',
      type: 'file',
      path: '/.gitignore',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPath, setSelectedPath] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const toggleFolder = (id: string) => {
    const updateTree = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === id && node.type === 'folder') {
          return { ...node, expanded: !node.expanded }
        }
        if (node.children) {
          return { ...node, children: updateTree(node.children) }
        }
        return node
      })
    }
    setTree(updateTree(tree))
  }

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return (
      <>
        {nodes
          .filter(
            (node) =>
              searchTerm === '' || node.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((node) => (
            <div key={node.id}>
              <div
                className={`flex items-center gap-1 px-2 py-1 hover:bg-slate-800 cursor-pointer group transition-colors ${
                  selectedPath === node.path ? 'bg-slate-700' : ''
                }`}
                style={{ paddingLeft: `${12 + depth * 16}px` }}
                onClick={() => {
                  if (node.type === 'folder') {
                    toggleFolder(node.id)
                  }
                  setSelectedPath(node.path)
                }}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {node.type === 'folder' ? (
                  <>
                    {node.expanded ? (
                      <ChevronDown size={14} className="text-slate-500" />
                    ) : (
                      <ChevronRight size={14} className="text-slate-500" />
                    )}
                    <Folder size={14} className="text-yellow-500" />
                  </>
                ) : (
                  <>
                    <div className="w-3.5" />
                    <File size={14} className="text-blue-400" />
                  </>
                )}

                <span className="text-sm text-slate-300 flex-1">{node.name}</span>

                {hoveredId === node.id && (
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded transition-all">
                    <MoreVertical size={12} className="text-slate-500" />
                  </button>
                )}
              </div>

              {node.type === 'folder' &&
                node.expanded &&
                node.children &&
                renderFileTree(node.children, depth + 1)}
            </div>
          ))}
      </>
    )
  }

  const countFiles = (nodes: FileNode[]): { files: number; folders: number } => {
    let files = 0
    let folders = 0

    const count = (nodes: FileNode[]) => {
      nodes.forEach((node) => {
        if (node.type === 'file') files++
        else folders++

        if (node.children) count(node.children)
      })
    }

    count(nodes)
    return { files, folders }
  }

  const stats = countFiles(tree)

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {/* Left Panel - File Tree */}
      <div className="w-80 border-r border-slate-700 bg-slate-950 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100">Files</h2>
            <button className="p-1.5 hover:bg-slate-800 rounded transition-colors">
              <MoreVertical size={16} className="text-slate-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm transition-colors">
              <FilePlus size={14} />
              New File
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-sm transition-colors">
              <FolderPlus size={14} />
              New Folder
            </button>
          </div>
        </div>

        {/* File Tree */}
        <div className="flex-1 overflow-auto">{renderFileTree(tree)}</div>

        {/* Stats Footer */}
        <div className="border-t border-slate-700 p-4 bg-slate-900">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800 rounded p-2">
              <p className="text-slate-500 mb-1">Files</p>
              <p className="text-lg font-bold text-blue-400">{stats.files}</p>
            </div>
            <div className="bg-slate-800 rounded p-2">
              <p className="text-slate-500 mb-1">Folders</p>
              <p className="text-lg font-bold text-yellow-500">{stats.folders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - File Preview */}
      <div className="flex-1 flex flex-col bg-slate-900">
        {/* Path Header */}
        <div className="h-14 border-b border-slate-700 px-6 flex items-center justify-between bg-slate-900/50">
          <span className="text-sm font-mono text-slate-400">{selectedPath || 'No file selected'}</span>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-slate-200">
              <Edit2 size={16} />
            </button>
            <button className="p-2 hover:bg-red-900/20 rounded transition-colors text-slate-400 hover:text-red-400">
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {selectedPath ? (
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold text-white mb-4">{selectedPath.split('/').pop()}</h3>
              <div className="bg-slate-800 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Full Path</p>
                  <p className="font-mono text-slate-300">{selectedPath}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-400 mb-2">File Type</p>
                  <p className="font-mono text-slate-300">
                    {selectedPath.split('.').pop() || 'folder'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700 flex gap-2">
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Folder size={48} className="text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Select a file to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
