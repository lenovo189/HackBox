import { useState, useEffect } from 'react'
import TopBar from './components/TopBar'
import FileTree from './components/FileTree'
import Editor from './components/Editor'
import PreviewPane from './components/PreviewPane'
import Terminal from './components/Terminal'
import AICoder from './components/AICoder'
import ProjectManager from './components/ProjectManager'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [files, setFiles] = useState({})
  const [terminalOutput, setTerminalOutput] = useState([])
  const [isRunning, setIsRunning] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [activeTab, setActiveTab] = useState('editor') // 'editor', 'preview', 'ai'

  const projectManager = new ProjectManager(files, setFiles, setTerminalOutput)

  const handleRun = async () => {
    setIsRunning(true)
    setTerminalOutput(prev => [...prev, { type: 'info', message: 'Starting project...' }])
    
    try {
      // Simulate running the project
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTerminalOutput(prev => [...prev, { type: 'success', message: 'Project started successfully!' }])
      setPreviewUrl('http://localhost:3000')
    } catch (error) {
      setTerminalOutput(prev => [...prev, { type: 'error', message: `Error: ${error.message}` }])
    } finally {
      setIsRunning(false)
    }
  }

  const handleExport = async () => {
    setTerminalOutput(prev => [...prev, { type: 'info', message: 'Exporting project...' }])
    try {
      await projectManager.exportProject()
      setTerminalOutput(prev => [...prev, { type: 'success', message: 'Project exported successfully!' }])
    } catch (error) {
      setTerminalOutput(prev => [...prev, { type: 'error', message: `Export failed: ${error.message}` }])
    }
  }

  const handleAddPackage = async (packageName) => {
    setTerminalOutput(prev => [...prev, { type: 'info', message: `Installing ${packageName}...` }])
    try {
      await projectManager.installPackage(packageName)
      setTerminalOutput(prev => [...prev, { type: 'success', message: `${packageName} installed successfully!` }])
    } catch (error) {
      setTerminalOutput(prev => [...prev, { type: 'error', message: `Installation failed: ${error.message}` }])
    }
  }

  const handleFileSelect = (filePath) => {
    setSelectedFile(filePath)
  }

  const handleFileChange = (content) => {
    if (selectedFile) {
      setFiles(prev => ({
        ...prev,
        [selectedFile]: content
      }))
    }
  }

  useEffect(() => {
    // Initialize with some default files
    const defaultFiles = {
      'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="app">
        <h1>Welcome to My Web App!</h1>
        <p>Edit this file to see live changes in the preview.</p>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
      'styles.css': `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

#app {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    line-height: 1.6;
}`,
      'script.js': `// Your JavaScript code here
console.log('Hello from JavaScript!');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded!');
});`,
      'package.json': `{
  "name": "my-web-app",
  "version": "1.0.0",
  "description": "A simple web application",
  "main": "index.html",
  "scripts": {
    "start": "python -m http.server 3000",
    "dev": "python -m http.server 3000"
  },
  "dependencies": {},
  "devDependencies": {}
}`
    }
    setFiles(defaultFiles)
    setSelectedFile('index.html')
  }, [])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'editor':
        return (
          <Editor 
            value={files[selectedFile] || ''}
            onChange={handleFileChange}
            language={getLanguageFromFile(selectedFile)}
            darkMode={darkMode}
          />
        )
      case 'preview':
        return (
          <PreviewPane 
            url={previewUrl}
            files={files}
            darkMode={darkMode}
          />
        )
      case 'ai':
        return (
          <AICoder 
            darkMode={darkMode}
            files={files}
            selectedFile={selectedFile}
            onFileChange={handleFileChange}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <TopBar 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onRun={handleRun}
        onExport={handleExport}
        onAddPackage={handleAddPackage}
        isRunning={isRunning}
        onSwitchToAI={() => setActiveTab('ai')}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* File Tree Sidebar */}
        <div className={`w-64 border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
          <FileTree 
            files={files}
            selectedFile={selectedFile}
            onFileSelect={handleFileSelect}
            onFileCreate={projectManager.createFile}
            onFileDelete={projectManager.deleteFile}
            onFileRename={projectManager.renameFile}
            darkMode={darkMode}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className={`flex border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            {[
              { key: 'editor', label: 'Editor', icon: '📝' },
              { key: 'preview', label: 'Preview', icon: '👁️' },
              { key: 'ai', label: 'AI Assistant', icon: '🤖' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? darkMode 
                      ? 'border-b-2 border-blue-500 text-blue-400 bg-gray-700'
                      : 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : darkMode
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>

          {/* Terminal */}
          <div className={`h-48 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <Terminal 
              output={terminalOutput}
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function getLanguageFromFile(filename) {
  if (!filename) return 'plaintext'
  
  const ext = filename.split('.').pop().toLowerCase()
  const languageMap = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'py': 'python',
    'md': 'markdown',
    'txt': 'plaintext'
  }
  
  return languageMap[ext] || 'plaintext'
}

export default App
