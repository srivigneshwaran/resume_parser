from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import shutil
import os
from app.services.extractor import extract_text
from app.services.nlp import parse_resume_text

app = FastAPI(title="AI Resume Parser")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/resume/parse")
async def parse_resume(file: UploadFile = File(...)):
    # Save the file temporarily
    file_location = f"{UPLOAD_DIR}/{file.filename}"
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    # Extract text from the uploaded file bytes
    with open(file_location, "rb") as f:
        file_bytes = f.read()
        
    extracted_text = extract_text(file_bytes, file.filename)
    
    if not extracted_text.strip():
        return {"error": "Could not extract text from file"}

    # Parse with NLP
    parsed_resume = parse_resume_text(extracted_text)

    return parsed_resume

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
