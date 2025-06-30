import { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { FileText, Code, FileCode } from 'lucide-react'

const MonacoEditor = ({ value, onChange, language, darkMode }) => {
  const editorRef = useRef(null)

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor
  }

  const handleEditorChange = (value) => {
    onChange(value)
  }

  const getFileIcon = (language) => {
    switch (language) {
      case 'html':
        return <FileCode size={16} />
      case 'css':
        return <FileCode size={16} />
      case 'javascript':
        return <Code size={16} />
      case 'json':
        return <FileText size={16} />
      default:
        return <FileText size={16} />
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center space-x-2">
          <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {getFileIcon(language)}
          </span>
          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            {language.toUpperCase()}
          </span>
        </div>
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Monaco Editor
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={language}
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme={darkMode ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            wordWrap: 'on',
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            glyphMargin: true,
            useTabStops: false,
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: true,
            trimAutoWhitespace: true,
            largeFileOptimizations: true,
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showClasses: true,
              showFunctions: true,
              showVariables: true,
              showModules: true,
              showProperties: true,
              showEvents: true,
              showOperators: true,
              showUnits: true,
              showValues: true,
              showConstants: true,
              showEnums: true,
              showEnumMembers: true,
              showColors: true,
              showFiles: true,
              showReferences: true,
              showFolders: true,
              showTypeParameters: true,
              showWords: true,
            },
            quickSuggestions: {
              other: true,
              comments: true,
              strings: true,
            },
            parameterHints: {
              enabled: true,
            },
            hover: {
              enabled: true,
            },
            contextmenu: true,
            mouseWheelZoom: true,
            multiCursorModifier: 'alt',
            accessibilitySupport: 'auto',
            autoIndent: 'full',
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            renderValidationDecorations: 'on',
            overviewRulerBorder: true,
            overviewRulerLanes: 2,
            links: true,
            colorDecorators: true,
            lightbulb: {
              enabled: true,
            },
            codeActionsOnSave: {
              'source.fixAll': true,
              'source.organizeImports': true,
            },
          }}
        />
      </div>
    </div>
  )
}

export default MonacoEditor 