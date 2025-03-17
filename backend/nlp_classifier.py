import spacy
import re
import logging
from datetime import datetime
from dateutil.parser import parse

logger = logging.getLogger(__name__)

nlp = spacy.load('en_core_web_lg')

def classify_email(subject, body):
    """Classify email content based on job opportunity details."""
    try:
        text = f"{subject} {body}"
        doc = nlp(text)
        
        classification = {
            'company': 'Unknown',
            'location': 'Unknown',
            'salary': 'Not specified',
            'deadline': 'N/A',
            'category': 'Not specified',
            'tech_stack': 'Not specified'
        }
        
        # Company detection
        company_match = re.search(r'(?:from|by)\s+([A-Za-z\s&]+)(?:!|\n|$)', text, re.IGNORECASE)
        if company_match:
            classification['company'] = company_match.group(1).strip()
        elif '||' in subject:
            classification['company'] = subject.split('||')[0].strip()
        
        # Location detection
        location_match = re.search(r'Location:\s*([A-Za-z\s,]+(?:\s*\(Remote\))?|\s*Remote)', text, re.IGNORECASE)
        if location_match:
            classification['location'] = location_match.group(1).strip()
        else:
            for ent in doc.ents:
                if ent.label_ == 'GPE':
                    classification['location'] = ent.text
                    break
            if 'remote' in text.lower():
                classification['location'] = 'Remote'
        
        # Salary detection (handles stipend and CTC)
        salary_match = re.search(r'(?:Stipend|Salary|CTC):\s*(₹?\d+(?:\.\d+)?\s*(?:Lacs|Lakh|L)?(?:\s*-\s*₹?\d+(?:\.\d+)?\s*(?:Lacs|Lakh|L))?(?:\s*/\s*(?:month|year))?)', text, re.IGNORECASE)
        if salary_match:
            classification['salary'] = salary_match.group(1).strip()
        else:
            salary_match = re.search(r'₹?\d+(?:,\d+)?(?:\s*-\s*₹?\d+(?:,\d+)?)?(?:k|K|Lacs)?(?:\s*/\s*(month|year))?', text)
            if salary_match:
                classification['salary'] = salary_match.group(0)
        
        # Deadline detection
        deadline_match = re.search(r'Deadline\s*:\s*(\d{1,2}/\d{1,2}/\d{4})', text)
        if deadline_match:
            try:
                date = parse(deadline_match.group(1), fuzzy=True)
                if date > datetime.now():
                    classification['deadline'] = date.strftime('%m/%d/%Y')
            except ValueError:
                pass
        else:
            for ent in doc.ents:
                if ent.label_ == 'DATE':
                    try:
                        date = parse(ent.text, fuzzy=True)
                        if date > datetime.now():
                            classification['deadline'] = date.strftime('%m/%d/%Y')
                            break
                    except:
                        continue
        
        # Category (Role) detection
        role_match = re.search(r'Role:\s*(.+?)(?:\n|$)', text, re.IGNORECASE)
        if role_match:
            classification['category'] = role_match.group(1).strip()
        elif 'Job Opportunity' in subject:
            classification['category'] = 'Software Engineer'  # Default based on context
        
        # Tech stack detection
        tech_keywords = [
            'React', 'Node.js', 'TypeScript', 'Vue.js', 'JavaScript', 'CSS', 
            'Python', 'Java', 'Angular', 'Docker', 'AWS', 'SQL', 'MongoDB', 
            'Express', 'Django', 'Flask', 'Git', 'REST', 'GraphQL', 'React Native', 
            'Swift', 'Kotlin', 'Machine Learning', 'ML', 'Data Science'
        ]
        found_tech = []
        for tech in tech_keywords:
            if re.search(r'\b' + re.escape(tech) + r'\b', text, re.IGNORECASE):
                found_tech.append(tech)
        classification['tech_stack'] = ', '.join(found_tech) if found_tech else 'Not specified'
        
        logger.info(f"Classified email: {subject} - {classification}")
        return classification
    
    except Exception as e:
        logger.error(f"Error in classify_email: {e}")
        return {
            'company': 'Unknown',
            'location': 'Unknown',
            'salary': 'Not specified',
            'deadline': 'N/A',
            'category': 'Not specified',
            'tech_stack': 'Not specified'
        }