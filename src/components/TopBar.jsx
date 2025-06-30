import { useState } from 'react'
import { Play, Download, Plus, Sun, Moon, Package, Bot } from 'lucide-react'

const TopBar = ({ darkMode, setDarkMode, onRun, onExport, onAddPackage, isRunning, onSwitchToAI }) => {
  const [packageName, setPackageName] = useState('')
  const [showPackageInput, setShowPackageInput] = useState(false)

  const handleAddPackage = () => {
    if (packageName.trim()) {
      onAddPackage(packageName.trim())
      setPackageName('')
      setShowPackageInput(false)
    }
  }

  return (
    <div className={`h-12 flex items-center justify-between px-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
          <span className="text-white font-bold text-sm">R</span>
        </div>
        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Replit Clone
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* AI Assistant Button */}
        <button
          onClick={onSwitchToAI}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            darkMode
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-purple-500 hover:bg-purple-600 text-white'
          }`}
        >
          <Bot size={16} />
          <span>AI Assistant</span>
        </button>

        {/* Run Button */}
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isRunning
              ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
              : darkMode
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <Play size={16} />
          <span>{isRunning ? 'Running...' : 'Run'}</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onExport}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            darkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <Download size={16} />
          <span>Export</span>
        </button>

        {/* Add Package Button */}
        <div className="relative">
          <button
            onClick={() => setShowPackageInput(!showPackageInput)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              darkMode
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            <Package size={16} />
            <span>Add Package</span>
          </button>

          {/* Package Input Dropdown */}
          {showPackageInput && (
            <div className={`absolute top-full right-0 mt-1 p-3 rounded-md shadow-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  placeholder="Package name..."
                  className={`px-2 py-1 rounded border text-sm ${
                    darkMode
                      ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPackage()}
                  autoFocus
                />
                <button
                  onClick={handleAddPackage}
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    darkMode
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-md transition-colors ${
            darkMode
              ? 'text-yellow-400 hover:bg-gray-700'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  )
}

export default TopBar 