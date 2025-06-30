import JSZip from 'jszip'
import { saveAs } from 'file-saver'

class ProjectManager {
  constructor(files, setFiles, setTerminalOutput) {
    this.files = files
    this.setFiles = setFiles
    this.setTerminalOutput = setTerminalOutput
  }

  // File operations
  createFile(filename) {
    if (this.files[filename]) {
      this.setTerminalOutput(prev => [...prev, { 
        type: 'error', 
        message: `File ${filename} already exists` 
      }])
      return false
    }

    const defaultContent = this.getDefaultContent(filename)
    this.setFiles(prev => ({
      ...prev,
      [filename]: defaultContent
    }))

    this.setTerminalOutput(prev => [...prev, { 
      type: 'success', 
      message: `Created file: ${filename}` 
    }])
    return true
  }

  deleteFile(filename) {
    if (!this.files[filename]) {
      this.setTerminalOutput(prev => [...prev, { 
        type: 'error', 
        message: `File ${filename} does not exist` 
      }])
      return false
    }

    this.setFiles(prev => {
      const newFiles = { ...prev }
      delete newFiles[filename]
      return newFiles
    })

    this.setTerminalOutput(prev => [...prev, { 
      type: 'success', 
      message: `Deleted file: ${filename}` 
    }])
    return true
  }

  renameFile(oldName, newName) {
    if (!this.files[oldName]) {
      this.setTerminalOutput(prev => [...prev, { 
        type: 'error', 
        message: `File ${oldName} does not exist` 
      }])
      return false
    }

    if (this.files[newName]) {
      this.setTerminalOutput(prev => [...prev, { 
        type: 'error', 
        message: `File ${newName} already exists` 
      }])
      return false
    }

    const content = this.files[oldName]
    this.setFiles(prev => {
      const newFiles = { ...prev }
      delete newFiles[oldName]
      newFiles[newName] = content
      return newFiles
    })

    this.setTerminalOutput(prev => [...prev, { 
      type: 'success', 
      message: `Renamed ${oldName} to ${newName}` 
    }])
    return true
  }

  getDefaultContent(filename) {
    const ext = filename.split('.').pop().toLowerCase()
    
    switch (ext) {
      case 'html':
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is a new HTML file.</p>
    <script src="script.js"></script>
</body>
</html>`
      
      case 'css':
        return `/* CSS Styles */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    line-height: 1.6;
}`
      
      case 'js':
        return `// JavaScript code
console.log('Hello from JavaScript!');

// Your code here
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded!');
});`
      
      case 'json':
        return `{
  "name": "new-project",
  "version": "1.0.0",
  "description": "A new project",
  "main": "index.html",
  "scripts": {
    "start": "python -m http.server 3000"
  },
  "dependencies": {},
  "devDependencies": {}
}`
      
      case 'py':
        return `# Python script
print("Hello from Python!")

# Your code here
def main():
    print("Main function called")

if __name__ == "__main__":
    main()`
      
      case 'md':
        return `# New Document

This is a new markdown file.

## Features

- Feature 1
- Feature 2
- Feature 3

## Usage

\`\`\`javascript
console.log("Hello World!");
\`\`\``
      
      default:
        return `# ${filename}

This is a new file: ${filename}

Edit this file to add your content.`
    }
  }

  // Package management
  async installPackage(packageName) {
    try {
      // Simulate package installation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update package.json if it exists
      if (this.files['package.json']) {
        try {
          const packageJson = JSON.parse(this.files['package.json'])
          if (!packageJson.dependencies) {
            packageJson.dependencies = {}
          }
          packageJson.dependencies[packageName] = '^1.0.0'
          
          this.setFiles(prev => ({
            ...prev,
            'package.json': JSON.stringify(packageJson, null, 2)
          }))
        } catch (error) {
          this.setTerminalOutput(prev => [...prev, { 
            type: 'warning', 
            message: `Could not update package.json: ${error.message}` 
          }])
        }
      }

      this.setTerminalOutput(prev => [...prev, { 
        type: 'success', 
        message: `Package ${packageName} installed successfully` 
      }])
      
      return true
    } catch (error) {
      this.setTerminalOutput(prev => [...prev, { 
        type: 'error', 
        message: `Failed to install package ${packageName}: ${error.message}` 
      }])
      return false
    }
  }

  // Project export
  async exportProject() {
    try {
      const zip = new JSZip()
      
      // Add all files to zip
      Object.entries(this.files).forEach(([filename, content]) => {
        zip.file(filename, content)
      })
      
      // Generate zip file
      const blob = await zip.generateAsync({ type: 'blob' })
      
      // Download the file
      const projectName = this.getProjectName()
      saveAs(blob, `${projectName}.zip`)
      
      this.setTerminalOutput(prev => [...prev, { 
        type: 'success', 
        message: `Project exported as ${projectName}.zip` 
      }])
      
      return true
    } catch (error) {
      this.setTerminalOutput(prev => [...prev, { 
        type: 'error', 
        message: `Export failed: ${error.message}` 
      }])
      return false
    }
  }

  getProjectName() {
    // Try to get name from package.json
    if (this.files['package.json']) {
      try {
        const packageJson = JSON.parse(this.files['package.json'])
        return packageJson.name || 'my-project'
      } catch (error) {
        // Fallback to default name
      }
    }
    
    // Try to get name from index.html title
    if (this.files['index.html']) {
      const titleMatch = this.files['index.html'].match(/<title[^>]*>([^<]+)<\/title>/i)
      if (titleMatch) {
        return titleMatch[1].toLowerCase().replace(/[^a-z0-9]/g, '-')
      }
    }
    
    return 'my-project'
  }

  // AI code generation (placeholder for backend integration)
  async generateCode(prompt) {
    try {
      this.setTerminalOutput(prev => [...prev, { 
        type: 'info', 
        message: `Generating code for: ${prompt}` 
      }])
      
      // This would call the Flask backend
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      })
      
      if (!response.ok) {
        throw new Error('Failed to generate code')
      }
      
      const data = await response.json()
      
      this.setTerminalOutput(prev => [...prev, { 
        type: 'success', 
        message: 'Code generated successfully' 
      }])
      
      return data.code
    } catch (error) {
      this.setTerminalOutput(prev => [...prev, { 
        type: 'error', 
        message: `Code generation failed: ${error.message}` 
      }])
      return null
    }
  }
}

export default ProjectManager 