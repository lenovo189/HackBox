import { useState } from 'react'
import { Folder, File, Plus, MoreVertical, Edit2, Trash2, FileText, Code, FileCode } from 'lucide-react'

const FileTree = ({ files, selectedFile, onFileSelect, onFileCreate, onFileDelete, onFileRename, darkMode }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set())
  const [editingFile, setEditingFile] = useState(null)
  const [newFileName, setNewFileName] = useState('')
  const [showContextMenu, setShowContextMenu] = useState(null)

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    switch (ext) {
      case 'html':
        return <FileCode size={16} />
      case 'css':
        return <FileCode size={16} />
      case 'js':
      case 'jsx':
        return <Code size={16} />
      case 'json':
        return <FileText size={16} />
      default:
        return <File size={16} />
    }
  }

  const handleFileClick = (filename) => {
    onFileSelect(filename)
  }

  const handleCreateFile = () => {
    const fileName = prompt('Enter file name:')
    if (fileName) {
      onFileCreate(fileName)
    }
  }

  const handleDeleteFile = (filename) => {
    if (confirm(`Are you sure you want to delete ${filename}?`)) {
      onFileDelete(filename)
    }
  }

  const handleRenameFile = (oldName) => {
    setEditingFile(oldName)
    setNewFileName(oldName)
  }

  const handleRenameSubmit = () => {
    if (newFileName && newFileName !== editingFile) {
      onFileRename(editingFile, newFileName)
    }
    setEditingFile(null)
    setNewFileName('')
  }

  const handleRenameCancel = () => {
    setEditingFile(null)
    setNewFileName('')
  }

  const handleContextMenu = (e, filename) => {
    e.preventDefault()
    setShowContextMenu({ x: e.clientX, y: e.clientY, filename })
  }

  const closeContextMenu = () => {
    setShowContextMenu(null)
  }

  // Group files by folder
  const fileGroups = {}
  Object.keys(files).forEach(filename => {
    const parts = filename.split('/')
    if (parts.length === 1) {
      if (!fileGroups['root']) fileGroups['root'] = []
      fileGroups['root'].push(filename)
    } else {
      const folder = parts[0]
      if (!fileGroups[folder]) fileGroups[folder] = []
      fileGroups[folder].push(filename)
    }
  })

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Files
        </span>
        <button
          onClick={handleCreateFile}
          className={`p-1 rounded hover:bg-opacity-80 ${
            darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
          }`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        {Object.entries(fileGroups).map(([folder, fileList]) => (
          <div key={folder}>
            {folder !== 'root' && (
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded cursor-pointer ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                onClick={() => {
                  const newExpanded = new Set(expandedFolders)
                  if (newExpanded.has(folder)) {
                    newExpanded.delete(folder)
                  } else {
                    newExpanded.add(folder)
                  }
                  setExpandedFolders(newExpanded)
                }}
              >
                <Folder size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
                <span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {folder}
                </span>
              </div>
            )}
            
            {(folder === 'root' || expandedFolders.has(folder)) && (
              <div className="ml-4">
                {fileList.map(filename => (
                  <div
                    key={filename}
                    className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer ${
                      selectedFile === filename
                        ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                        : darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleFileClick(filename)}
                    onContextMenu={(e) => handleContextMenu(e, filename)}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        {getFileIcon(filename)}
                      </span>
                      {editingFile === filename ? (
                        <input
                          type="text"
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          onBlur={handleRenameSubmit}
                          onKeyPress={(e) => e.key === 'Enter' && handleRenameSubmit()}
                          onKeyDown={(e) => e.key === 'Escape' && handleRenameCancel()}
                          className={`flex-1 text-sm bg-transparent border-none outline-none ${
                            darkMode ? 'text-white' : 'text-gray-800'
                          }`}
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm truncate">{filename}</span>
                      )}
                    </div>
                    
                    {selectedFile === filename && editingFile !== filename && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRenameFile(filename)
                          }}
                          className={`p-1 rounded hover:bg-opacity-80 ${
                            darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
                          }`}
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteFile(filename)
                          }}
                          className={`p-1 rounded hover:bg-opacity-80 ${
                            darkMode ? 'hover:bg-red-600' : 'hover:bg-red-500'
                          }`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          className="fixed z-50"
          style={{ left: showContextMenu.x, top: showContextMenu.y }}
        >
          <div className={`py-1 rounded-md shadow-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
          }`}>
            <button
              onClick={() => {
                handleRenameFile(showContextMenu.filename)
                closeContextMenu()
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-80 ${
                darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              Rename
            </button>
            <button
              onClick={() => {
                handleDeleteFile(showContextMenu.filename)
                closeContextMenu()
              }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-opacity-80 ${
                darkMode ? 'hover:bg-red-600 text-red-400' : 'hover:bg-red-100 text-red-600'
              }`}
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Overlay to close context menu */}
      {showContextMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeContextMenu}
        />
      )}
    </div>
  )
}

export default FileTree 