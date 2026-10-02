import re
import json
import spacy
from typing import Dict, Any, List

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
    nlp = spacy.load("en_core_web_sm")

def load_skills():
    try:
        with open("skills.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return ["Python", "React", "FastAPI", "AWS", "Docker"]

SKILLS_DB = load_skills()

def extract_email(text: str) -> str | None:
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(email_pattern, text)
    return match.group(0) if match else None

def extract_phone(text: str) -> str | None:
    phone_pattern = r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    match = re.search(phone_pattern, text)
    return match.group(0) if match else None

def extract_name(text: str) -> str | None:
    # Look at the first few lines individually to avoid merging non-name text
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    for line in lines[:3]:
        doc = nlp(line)
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                return ent.text
    if lines:
        return lines[0]
    return None

def extract_skills(text: str) -> List[str]:
    found_skills = []
    text_lower = text.lower()
    for skill in SKILLS_DB:
        # Simple word boundary regex to avoid partial matches
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.append(skill)
    return found_skills

def split_into_sections(text: str) -> Dict[str, str]:
    headers = ["SUMMARY", "SKILLS", "EXPERIENCE", "EDUCATION", "PROJECTS", "CERTIFICATIONS"]
    sections = {header.lower(): "" for header in headers}
    
    current_section = None
    
    for line in text.split('\n'):
        line_clean = line.strip()
        if not line_clean:
            continue
            
        # Match if the line contains just the header (case insensitive), allow some trailing characters like colons
        header_match = next((h for h in headers if h in line_clean.upper() and len(line_clean) < 20), None)
        
        if header_match:
            current_section = header_match.lower()
        elif current_section:
            sections[current_section] += line_clean + "\n"
            
    return sections

def extract_experience(text: str) -> List[Dict[str, str]]:
    experience = []
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    if not lines:
        return experience
        
    # Group every 4 lines or whatever remains
    for i in range(0, len(lines), 4):
        chunk = lines[i:i+4]
        if len(chunk) > 0:
            experience.append({
                "role": chunk[0],
                "company": chunk[1] if len(chunk) > 1 else "",
                "date": chunk[2] if len(chunk) > 2 else "",
                "description": " ".join(chunk[3:]) if len(chunk) > 3 else ""
            })
    return experience

def extract_education(text: str) -> List[Dict[str, str]]:
    education = []
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    if not lines:
        return education
        
    # Group every 3 lines or whatever remains
    for i in range(0, len(lines), 3):
        chunk = lines[i:i+3]
        if len(chunk) > 0:
            education.append({
                "degree": chunk[0],
                "institution": chunk[1] if len(chunk) > 1 else "",
                "year": chunk[2] if len(chunk) > 2 else ""
            })
    return education

def parse_resume_text(text: str) -> Dict[str, Any]:
    sections = split_into_sections(text)
    
    return {
        "personal_info": {
            "name": extract_name(text),
            "email": extract_email(text),
            "phone": extract_phone(text),
            "linkedin": None,  
            "github": None     
        },
        "skills": extract_skills(sections.get('skills', text)), # Use full text if no skills section
        "experience": extract_experience(sections.get('experience', '')),
        "education": extract_education(sections.get('education', '')),
        "projects": [],
        "certifications": []
    }
