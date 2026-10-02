# 📄 AI Resume Parser

An NLP-powered web application that automatically analyzes resumes (PDF/DOCX) and converts unstructured resume content into structured candidate information using **spaCy** Named Entity Recognition and custom regex heuristics.

## ✨ Features

- **Multi-format Support:** Parses both `.pdf` and `.docx` files natively.
- **NLP Information Extraction:** Automatically extracts:
  - Personal Information (Name, Email, Phone)
  - Technical Skills (dynamically matched against a knowledge base)
  - Work Experience (Role, Company, Dates, Descriptions)
  - Education History
- **Modern Dashboard:** Built with React, TypeScript, and Tailwind CSS for a premium, fast, and responsive user experience.
- **FastAPI Backend:** High-performance async Python backend for handling file uploads and NLP processing.

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS v4, Axios
- **Backend:** Python, FastAPI, Uvicorn, Pydantic
- **NLP & Parsing:** spaCy (`en_core_web_sm`), PyMuPDF, python-docx

## 🚀 Getting Started

### 1. Start the Backend

Navigate to the `backend` directory, install dependencies, and run the FastAPI server:

```bash
cd backend
python -m venv venv
# Activate virtual environment (Windows: .\venv\Scripts\activate | Mac/Linux: source venv/bin/activate)

# Install dependencies
pip install -r requirements.txt
python -m spacy download en_core_web_sm

# Run the server
uvicorn app.main:app --reload
```
The backend will run on `http://localhost:8000`.

### 2. Start the Frontend

Navigate to the `frontend` directory, install dependencies, and start Vite:

```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## 🧠 How it Works

1. **Extraction:** PyMuPDF and python-docx convert the uploaded binary files into raw strings.
2. **Segmentation:** The text is chunked into logical sections (`SUMMARY`, `SKILLS`, `EXPERIENCE`, `EDUCATION`) using heuristic headers.
3. **NLP Processing:** 
   - `spaCy` analyzes the segments to pull out specific entities like `PERSON`.
   - Regular expressions reliably extract Emails and Phone numbers.
   - Text is matched against a robust `skills.json` knowledge base to tag technologies.
4. **Presentation:** The JSON response is beautifully rendered on the React dashboard.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a Pull Request.
