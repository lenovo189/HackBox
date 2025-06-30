import { useState, useEffect, useRef } from 'react'
import { RefreshCw, ExternalLink, Maximize2, Minimize2 } from 'lucide-react'

const PreviewPane = ({ url, files, darkMode }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const iframeRef = useRef(null)

  // Generate preview content from files
  useEffect(() => {
    if (files['index.html']) {
      let content = files['index.html']
      
      // Replace CSS link with inline styles if styles.css exists
      if (files['styles.css']) {
        const cssContent = files['styles.css']
        content = content.replace(
          /<link[^>]*rel="stylesheet"[^>]*>/g,
          `<style>${cssContent}</style>`
        )
      }
      
      // Replace script src with inline script if script.js exists
      if (files['script.js']) {
        const jsContent = files['script.js']
        content = content.replace(
          /<script[^>]*src="script\.js"[^>]*><\/script>/g,
          `<script>${jsContent}</script>`
        )
      }
      
      setPreviewContent(content)
    } else {
      // Create a simple preview if no index.html
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
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
                }
                .file-list {
                    margin-top: 20px;
                }
                .file-item {
                    padding: 8px;
                    margin: 4px 0;
                    background: #f8f9fa;
                    border-radius: 4px;
                    font-family: monospace;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Project Preview</h1>
                <p>This is a live preview of your project. Edit your files to see changes here.</p>
                
                <div class="file-list">
                    <h3>Project Files:</h3>
                    ${Object.keys(files).map(file => `<div class="file-item">${file}</div>`).join('')}
                </div>
            </div>
        </body>
        </html>
      `
      setPreviewContent(htmlContent)
    }
  }, [files])

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleExternalOpen = () => {
    const blob = new Blob([previewContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
  }

  return (
    <div className={`h-full flex flex-col ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Preview Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Preview
          </span>
          {url && (
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {url}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={handleRefresh}
            className={`p-1.5 rounded hover:bg-opacity-80 ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="Refresh Preview"
          >
            <RefreshCw size={16} />
          </button>
          
          <button
            onClick={handleExternalOpen}
            className={`p-1.5 rounded hover:bg-opacity-80 ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title="Open in New Tab"
          >
            <ExternalLink size={16} />
          </button>
          
          <button
            onClick={handleFullscreen}
            className={`p-1.5 rounded hover:bg-opacity-80 ${
              darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-200 text-gray-600'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 relative">
        {previewContent ? (
          <iframe
            ref={iframeRef}
            srcDoc={previewContent}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className={`flex items-center justify-center h-full ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="text-center">
              <div className="text-4xl mb-4">👀</div>
              <p>No preview available</p>
              <p className="text-sm">Create an index.html file to see a preview</p>
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleFullscreen}
        />
      )}
    </div>
  )
}

export default PreviewPane 