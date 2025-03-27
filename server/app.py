from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
from PyPDF2 import PdfReader
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/upload', methods=['POST'])
def upload_pdf():

    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and file.filename.endswith('.pdf'):
        # Save the file to a temporary location
        file_path = os.path.join("uploads", file.filename)
        file.save(file_path)

        # Read the PDF and extract text
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"

        # Optionally remove the file after processing
        os.remove(file_path)

        return jsonify({"text": text}), 200

    return jsonify({"error": "Invalid file type"}), 400

if __name__ == '__main__':
    # Ensure uploads directory exists
    os.makedirs("uploads", exist_ok=True)
    app.run(debug=True)
