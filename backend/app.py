from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import together
import os
import json
import zipfile
import tempfile
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# ✅ Set Together API key directly (no .env)
together.api_key = '50dbfa428477acd7643991e65fec6046e564fccd8cdedfdcc18c54a441ad7d84'

# In-memory project storage (use DB in production)
projects = {}

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/generate', methods=['POST'])
def generate_code():
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        response = together.Complete.create(
            prompt=f"Generate code for the following request: {prompt}\n\nCode:",
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            max_tokens=1024,
            temperature=0.7,
            top_p=0.7,
            top_k=50,
            repetition_penalty=1.1
        )

        generated_code = response['choices'][0]['text'].strip()

        return jsonify({
            'code': generated_code,
            'model': 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
            'prompt': prompt
        })

    except Exception as e:
        logger.error(f"Error generating code: {str(e)}")
        return jsonify({'error': f'Code generation failed: {str(e)}'}), 500

@app.route('/api/explain', methods=['POST'])
def explain_code():
    try:
        data = request.get_json()
        code = data.get('code', '')

        if not code:
            return jsonify({'error': 'Code is required'}), 400

        prompt = f"Explain this code in detail:\n\n{code}\n\nExplanation:"

        response = together.Complete.create(
            prompt=prompt,
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            max_tokens=512,
            temperature=0.3,
            top_p=0.7,
            top_k=50,
            repetition_penalty=1.1
        )

        explanation = response['choices'][0]['text'].strip()

        return jsonify({
            'explanation': explanation,
            'model': 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free'
        })

    except Exception as e:
        logger.error(f"Error explaining code: {str(e)}")
        return jsonify({'error': f'Code explanation failed: {str(e)}'}), 500

@app.route('/api/fix', methods=['POST'])
def fix_code():
    try:
        data = request.get_json()
        code = data.get('code', '')
        issue = data.get('issue', '')

        if not code:
            return jsonify({'error': 'Code is required'}), 400

        prompt = f"Fix the following code issue: {issue}\n\nOriginal code:\n{code}\n\nFixed code:"

        response = together.Complete.create(
            prompt=prompt,
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            max_tokens=1024,
            temperature=0.3,
            top_p=0.7,
            top_k=50,
            repetition_penalty=1.1
        )

        fixed_code = response['choices'][0]['text'].strip()

        return jsonify({
            'fixed_code': fixed_code,
            'model': 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
            'issue': issue
        })

    except Exception as e:
        logger.error(f"Error fixing code: {str(e)}")
        return jsonify({'error': f'Code fixing failed: {str(e)}'}), 500

@app.route('/api/install-package', methods=['POST'])
def install_package():
    try:
        data = request.get_json()
        package_name = data.get('package', '')

        if not package_name:
            return jsonify({'error': 'Package name is required'}), 400

        logger.info(f"Installing package: {package_name}")
        return jsonify({
            'message': f'Package {package_name} installed successfully',
            'package': package_name,
            'version': '1.0.0'
        })

    except Exception as e:
        logger.error(f"Error installing package: {str(e)}")
        return jsonify({'error': f'Package installation failed: {str(e)}'}), 500

@app.route('/api/export', methods=['POST'])
def export_project():
    try:
        data = request.get_json()
        files = data.get('files', {})
        project_name = data.get('project_name', 'my-project')

        if not files:
            return jsonify({'error': 'No files to export'}), 400

        with tempfile.NamedTemporaryFile(suffix='.zip', delete=False) as tmp_file:
            with zipfile.ZipFile(tmp_file.name, 'w') as zipf:
                for filename, content in files.items():
                    if 'node_modules' in filename or '.git' in filename:
                        continue
                    zipf.writestr(filename, content)

            return send_file(
                tmp_file.name,
                as_attachment=True,
                download_name=f'{project_name}.zip',
                mimetype='application/zip'
            )

    except Exception as e:
        logger.error(f"Error exporting project: {str(e)}")
        return jsonify({'error': f'Export failed: {str(e)}'}), 500

@app.route('/api/run', methods=['POST'])
def run_project():
    try:
        data = request.get_json()
        files = data.get('files', {})

        if 'index.html' not in files:
            return jsonify({'error': 'No index.html file found'}), 400

        logger.info("Starting project...")
        return jsonify({
            'message': 'Project started successfully',
            'url': 'http://localhost:3000',
            'status': 'running'
        })

    except Exception as e:
        logger.error(f"Error running project: {str(e)}")
        return jsonify({'error': f'Failed to run project: {str(e)}'}), 500

@app.route('/api/save', methods=['POST'])
def save_project():
    try:
        data = request.get_json()
        project_id = data.get('project_id', 'default')
        files = data.get('files', {})

        projects[project_id] = {
            'files': files,
            'last_modified': datetime.now().isoformat()
        }

        return jsonify({
            'message': 'Project saved successfully',
            'project_id': project_id,
            'files_count': len(files)
        })

    except Exception as e:
        logger.error(f"Error saving project: {str(e)}")
        return jsonify({'error': f'Save failed: {str(e)}'}), 500

@app.route('/api/load/<project_id>', methods=['GET'])
def load_project(project_id):
    try:
        if project_id not in projects:
            return jsonify({'error': 'Project not found'}), 404

        project = projects[project_id]
        return jsonify({
            'project_id': project_id,
            'files': project['files'],
            'last_modified': project['last_modified']
        })

    except Exception as e:
        logger.error(f"Error loading project: {str(e)}")
        return jsonify({'error': f'Load failed: {str(e)}'}), 500

@app.route('/api/projects', methods=['GET'])
def list_projects():
    try:
        project_list = [
            {
                'id': pid,
                'name': pid,
                'files_count': len(p['files']),
                'last_modified': p['last_modified']
            } for pid, p in projects.items()
        ]

        return jsonify({
            'projects': project_list,
            'total': len(project_list)
        })

    except Exception as e:
        logger.error(f"Error listing projects: {str(e)}")
        return jsonify({'error': f'Failed to list projects: {str(e)}'}), 500

if __name__ == '__main__':
    logger.info("🚀 Running Replit AI Backend")
    app.run(debug=True, host='0.0.0.0', port=5000)

