import json
from app.services.nlp import parse_resume_text

test_resume = """
John Doe
Software Engineer
john.doe@example.com
+1 (555) 123-4567

SUMMARY
Passionate software engineer with experience in building scalable web applications.

SKILLS
Python, React, FastAPI, AWS, Docker, Kubernetes, PostgreSQL

EXPERIENCE
Software Engineer
XYZ Technologies
2024 - 2026
Developed web applications using React and FastAPI. Deployed on AWS using Docker.

EDUCATION
B.Tech Computer Science
ABC University
2020 - 2024
"""

def test_parser():
    print("Testing Resume Parser...")
    result = parse_resume_text(test_resume)
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    test_parser()
