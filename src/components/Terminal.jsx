import { useEffect, useRef } from 'react'
import { Terminal as TerminalIcon, X, Copy, Download } from 'lucide-react'

const Terminal = ({ output, darkMode }) => {
  const terminalRef = useRef(null)

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  const getOutputIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return '>'
    }
  }

  const getOutputColor = (type) => {
    switch (type) {
      case 'success':
        return darkMode ? 'text-green-400' : 'text-green-600'
      case 'error':
        return darkMode ? 'text-red-400' : 'text-red-600'
      case 'warning':
        return darkMode ? 'text-yellow-400' : 'text-yellow-600'
      case 'info':
        return darkMode ? 'text-blue-400' : 'text-blue-600'
      default:
        return darkMode ? 'text-gray-300' : 'text-gray-700'
    }
  }

  const handleClear = () => {
    // This would be handled by the parent component
    // For now, we'll just log it
    console.log('Clear terminal')
  }

  const handleCopy = () => {
    const text = output.map(item => `${getOutputIcon(item.type)} ${item.message}`).join('\n')
    navigator.clipboard.writeText(text)
  }

  const handleExport = () => {
    const text = output.map(item => `${getOutputIcon(item.type)} ${item.message}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'terminal-output.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Terminal Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center space-x-2">
          <TerminalIcon size={16} className={darkMode ? 'text-green-400' : 'text-green-600'} />
          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Terminal
          </span>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {output.length} messages
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={handleCopy}
            className={`p-1.5 rounded hover:bg-opacity-80 ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="Copy Output"
          >
            <Copy size={14} />
          </button>
          
          <button
            onClick={handleExport}
            className={`p-1.5 rounded hover:bg-opacity-80 ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="Export Output"
          >
            <Download size={14} />
          </button>
          
          <button
            onClick={handleClear}
            className={`p-1.5 rounded hover:bg-opacity-80 ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="Clear Terminal"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div 
        ref={terminalRef}
        className={`flex-1 overflow-y-auto p-4 font-mono text-sm ${
          darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'
        }`}
      >
        {output.length === 0 ? (
          <div className={`text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <div className="text-2xl mb-2">💻</div>
            <p>Terminal is ready</p>
            <p className="text-xs">Run your project to see output here</p>
          </div>
        ) : (
          <div className="space-y-1">
            {output.map((item, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="flex-shrink-0">
                  {getOutputIcon(item.type)}
                </span>
                <span className={`${getOutputColor(item.type)} break-words`}>
                  {item.message}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {/* Cursor */}
        <div className={`inline-block w-2 h-4 ml-2 ${
          darkMode ? 'bg-green-400' : 'bg-green-600'
        } animate-pulse`}></div>
      </div>
    </div>
  )
}

export default Terminal 