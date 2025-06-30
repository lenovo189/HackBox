# Replit Clone IDE

A full-featured web-based IDE built with React.js frontend and Flask backend, featuring Monaco Editor, live preview, file management, and AI-powered code generation.

## Features

### Frontend (React.js)
- **Monaco Editor** with full syntax highlighting and multi-file support
- **File Tree Sidebar** with drag-and-drop, create/rename/delete support
- **Live Preview Panel** for web apps with auto-refresh
- **Topbar** with Run, Export, and Add Package buttons
- **Terminal/Log Panel** for displaying backend output
- **Dark/Light Mode Toggle** with responsive layout
- **Project Export** as ZIP (excludes node_modules, includes all files + package.json)

### Backend (Flask + Together AI)
- **AI Code Generation** using Together AI (CodeLlama models)
- **Code Explanation** and **Code Fixing** capabilities
- **Package Management** (simulated)
- **Project Export** functionality
- **Project Save/Load** system

## Tech Stack

### Frontend
- React.js 19
- Monaco Editor
- Tailwind CSS
- Lucide React (icons)
- JSZip (for project export)
- File Saver

### Backend
- Flask
- Together AI API
- Flask-CORS
- Python 3.8+

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Together AI API key (free at [together.ai](https://together.ai))

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   export TOGETHER_API_KEY="your-api-key-here"
   ```

5. **Start the Flask server:**
   ```bash
   python app.py
   ```

The backend will run on `http://localhost:5000` and the frontend on `http://localhost:5173`.

## API Endpoints

### Code Generation
- `POST /api/generate` - Generate code from prompt
- `POST /api/explain` - Explain existing code
- `POST /api/fix` - Fix code issues

### Project Management
- `POST /api/install-package` - Install packages
- `POST /api/export` - Export project as ZIP
- `POST /api/run` - Run project
- `POST /api/save` - Save project
- `GET /api/load/<project_id>` - Load project
- `GET /api/projects` - List all projects

### Health Check
- `GET /api/health` - Backend health status

## Usage

### Creating Files
1. Click the "+" button in the file tree
2. Enter a filename with extension (e.g., `script.js`, `styles.css`)
3. The file will be created with default content based on the file type

### Editing Code
1. Select a file from the file tree
2. Edit in the Monaco Editor with full syntax highlighting
3. Changes are automatically saved

### Live Preview
1. Create an `index.html` file
2. Add CSS and JavaScript files
3. The preview panel will show live updates
4. Use the refresh button to manually reload

### Running Projects
1. Click the "Run" button in the topbar
2. The terminal will show progress
3. Preview will update with the running application

### Exporting Projects
1. Click the "Export" button
2. Project will be downloaded as a ZIP file
3. Excludes `node_modules` and includes all project files

### AI Features
1. **Code Generation**: Use the AI to generate code from descriptions
2. **Code Explanation**: Get detailed explanations of code
3. **Code Fixing**: Fix bugs and issues automatically

### Package Management
1. Click "Add Package" in the topbar
2. Enter package name
3. Package will be added to `package.json`

## File Types Supported

- **HTML** (`.html`) - Web pages
- **CSS** (`.css`) - Stylesheets
- **JavaScript** (`.js`, `.jsx`) - Client-side scripts
- **JSON** (`.json`) - Configuration files
- **Python** (`.py`) - Python scripts
- **Markdown** (`.md`) - Documentation
- **Text** (`.txt`) - Plain text files

## Customization

### Themes
- Toggle between dark and light modes
- Monaco Editor automatically adapts to the theme

### Editor Settings
- Font size, family, and other settings can be modified in `Editor.jsx`
- Syntax highlighting for additional languages can be added

### Backend Models
- Change AI models in `backend/app.py`
- Available models: `CodeLlama-7b-Instruct`, `CodeLlama-13b-Instruct`, etc.

## Development

### Project Structure
```
Replit-Clone/
├── src/
│   ├── components/
│   │   ├── Editor.jsx          # Monaco Editor component
│   │   ├── FileTree.jsx        # File explorer
│   │   ├── PreviewPane.jsx     # Live preview
│   │   ├── Terminal.jsx        # Log output
│   │   ├── TopBar.jsx          # Action buttons
│   │   └── ProjectManager.jsx  # File operations
│   ├── App.jsx                 # Main app component
│   └── App.css                 # Custom styles
├── backend/
│   ├── app.py                  # Flask server
│   └── requirements.txt        # Python dependencies
└── package.json               # Node.js dependencies
```

### Adding New Features
1. **Frontend**: Add new components in `src/components/`
2. **Backend**: Add new endpoints in `backend/app.py`
3. **Styling**: Use Tailwind CSS classes or add custom CSS

## Troubleshooting

### Common Issues

1. **Monaco Editor not loading:**
   - Check if all dependencies are installed
   - Clear browser cache

2. **Backend connection failed:**
   - Ensure Flask server is running on port 5000
   - Check CORS settings

3. **AI features not working:**
   - Verify Together AI API key is set
   - Check API key permissions

4. **File operations failing:**
   - Check browser console for errors
   - Ensure proper file permissions

### Performance Tips

1. **Large files**: Consider file size limits for better performance
2. **Many files**: File tree may slow down with hundreds of files
3. **AI requests**: Rate limiting may apply to Together AI API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor
- [Together AI](https://together.ai) - AI code generation
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Lucide React](https://lucide.dev) - Icons
# HackBox
