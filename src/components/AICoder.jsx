import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Code, Lightbulb, Bug, Copy, Download, Loader2 } from 'lucide-react'

const AICoder = ({ darkMode, files, selectedFile, onFileChange }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAction, setSelectedAction] = useState('generate')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Add welcome message
  useEffect(() => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: `Hello! I'm your AI coding assistant. I can help you with:

• **Generate Code**: Create new code from descriptions
• **Explain Code**: Understand how code works
• **Fix Code**: Debug and fix issues
• **Optimize Code**: Improve performance and readability

What would you like to work on today?`,
        timestamp: new Date()
      }
    ])
  }, [])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let response
      const currentFileContent = selectedFile ? files[selectedFile] : ''

      switch (selectedAction) {
        case 'generate':
          response = await generateCode(input)
          break
        case 'explain':
          response = await explainCode(input || currentFileContent)
          break
        case 'fix':
          response = await fixCode(input || currentFileContent)
          break
        case 'optimize':
          response = await optimizeCode(input || currentFileContent)
          break
        default:
          response = await generateCode(input)
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response,
        timestamp: new Date(),
        code: response.code || null
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateCode = async (prompt) => {
    const response = await fetch('http://192.168.1.8:5000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })

    if (!response.ok) {
      throw new Error('Failed to generate code')
    }

    const data = await response.json()
    return `Here's the code I generated for you:

\`\`\`
${data.code}
\`\`\`

This code addresses your request: "${prompt}"

You can copy this code and paste it into your editor. Would you like me to explain any part of it or make any modifications?`
  }

  const explainCode = async (code) => {
    const response = await fetch('http://192.168.1.8:5000/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })

    if (!response.ok) {
      throw new Error('Failed to explain code')
    }

    const data = await response.json()
    return `Here's an explanation of your code:

${data.explanation}

The code you provided has been analyzed and explained above. Let me know if you need any clarification on specific parts!`
  }

  const fixCode = async (code) => {
    const response = await fetch('http://192.168.1.8:5000/api/fix', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, issue: 'Fix any bugs or issues in this code' })
    })

    if (!response.ok) {
      throw new Error('Failed to fix code')
    }

    const data = await response.json()
    return `Here's the fixed version of your code:

\`\`\`
${data.fixed_code}
\`\`\`

I've identified and fixed the issues in your code. The main improvements include:
- Bug fixes
- Code optimization
- Better error handling
- Improved readability

Would you like me to explain what changes were made?`
  }

  const optimizeCode = async (code) => {
    const response = await fetch('http://192.168.1.8:5000/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: `Optimize and improve this code for better performance, readability, and maintainability: ${code}` 
      })
    })

    if (!response.ok) {
      throw new Error('Failed to optimize code')
    }

    const data = await response.json()
    return `Here's the optimized version of your code:

\`\`\`
${data.code}
\`\`\`

The optimizations include:
- Improved performance
- Better code structure
- Enhanced readability
- Modern best practices
- Reduced complexity

The optimized code should be faster and easier to maintain.`
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const insertIntoEditor = (code) => {
    if (selectedFile && onFileChange) {
      onFileChange(code)
    }
  }

  const getActionIcon = (action) => {
    switch (action) {
      case 'generate': return <Code size={16} />
      case 'explain': return <Lightbulb size={16} />
      case 'fix': return <Bug size={16} />
      case 'optimize': return <Code size={16} />
      default: return <Code size={16} />
    }
  }

  const getActionColor = (action) => {
    switch (action) {
      case 'generate': return 'bg-blue-500 hover:bg-blue-600'
      case 'explain': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'fix': return 'bg-red-500 hover:bg-red-600'
      case 'optimize': return 'bg-green-500 hover:bg-green-600'
      default: return 'bg-blue-500 hover:bg-blue-600'
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center space-x-2">
          <Bot size={16} className={darkMode ? 'text-blue-400' : 'text-blue-600'} />
          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            AI Coding Assistant
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Powered by CodeLlama
          </span>
        </div>
      </div>

      {/* Action Selector */}
      <div className={`px-4 py-2 border-b ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex space-x-2">
          {[
            { key: 'generate', label: 'Generate', icon: <Code size={14} /> },
            { key: 'explain', label: 'Explain', icon: <Lightbulb size={14} /> },
            { key: 'fix', label: 'Fix', icon: <Bug size={14} /> },
            { key: 'optimize', label: 'Optimize', icon: <Code size={14} /> }
          ].map(action => (
            <button
              key={action.key}
              onClick={() => setSelectedAction(action.key)}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                selectedAction === action.key
                  ? `${getActionColor(action.key)} text-white`
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user'
                  ? darkMode ? 'bg-blue-600' : 'bg-blue-500'
                  : darkMode ? 'bg-gray-600' : 'bg-gray-500'
              }`}>
                {message.type === 'user' ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-white" />
                )}
              </div>
              
              <div className={`rounded-lg px-3 py-2 ${
                message.type === 'user'
                  ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                  : darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                
                {message.code && (
                  <div className="mt-3">
                    <div className={`rounded-md p-3 font-mono text-sm ${
                      darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-50 text-gray-800'
                    }`}>
                      <pre className="whitespace-pre-wrap">{message.code}</pre>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => copyToClipboard(message.code)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                          darkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        <Copy size={12} />
                        <span>Copy</span>
                      </button>
                      <button
                        onClick={() => insertIntoEditor(message.code)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                          darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        <Download size={12} />
                        <span>Insert</span>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className={`text-xs mt-2 ${
                  message.type === 'user'
                    ? darkMode ? 'text-blue-200' : 'text-blue-100'
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-gray-600' : 'bg-gray-500'
              }`}>
                <Bot size={16} className="text-white" />
              </div>
              <div className={`rounded-lg px-3 py-2 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="flex items-center space-x-2">
                  <Loader2 size={16} className="animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Ask me to ${selectedAction} code...`}
            className={`flex-1 px-3 py-2 rounded-md border text-sm ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !input.trim() || isLoading
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : `${getActionColor(selectedAction)} text-white`
            }`}
          >
            <Send size={16} />
          </button>
        </div>
        
        {selectedFile && (
          <div className={`text-xs mt-2 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Current file: {selectedFile}
          </div>
        )}
      </div>
    </div>
  )
}

export default AICoder 