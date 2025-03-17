from flask import Flask, jsonify
from email_fetcher import fetch_emails, get_credentials
from nlp_classifier import classify_email
import requests
import logging
from dateutil.parser import parse

app = Flask(__name__)
logger = logging.getLogger(__name__)

class SheetsClient:
    def __init__(self, credentials):
        self.token = credentials.token
        self.base_url = "https://sheets.googleapis.com/v4/spreadsheets"
        
    def append_values(self, spreadsheet_id, range_name, values, value_input_option="RAW"):
        url = f"{self.base_url}/{spreadsheet_id}/values/{range_name}:append?valueInputOption={value_input_option}"
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
        body = {
            'values': values
        }
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        return response.json()

class CalendarClient:
    def __init__(self, credentials):
        self.token = credentials.token
        self.base_url = "https://www.googleapis.com/calendar/v3"
        
    def insert_event(self, calendar_id, summary, start_date, end_date):
        url = f"{self.base_url}/calendars/{calendar_id}/events"
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
        try:
            parsed_date = parse(start_date, fuzzy=True).strftime('%Y-%m-%d')
            start_date = parsed_date
            end_date = parsed_date
        except ValueError:
            logger.warning(f"Could not parse date: {start_date}, skipping")
            return None
        
        body = {
            'summary': summary,
            'start': {'date': start_date, 'timeZone': 'UTC'},
            'end': {'date': end_date, 'timeZone': 'UTC'},
            'reminders': {'useDefault': True}
        }
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()
        return response.json()

@app.route('/tasks', methods=['GET'])
def get_tasks():
    try:
        emails = fetch_emails()
        if not emails:
            return jsonify({'applications': []})
        
        tasks = []
        creds = get_credentials()
        sheets_client = SheetsClient(creds)
        calendar_client = CalendarClient(creds)
        spreadsheet_id = '1PLcDZZOKipntcEoEvI_hH4aMg0B3fuFeCzhXsNvFkd8'
        
        for email in emails:
            classification = classify_email(email['subject'], email['body'])
            status = 'Pending' if 'deadline' in email['subject'].lower() or 'due' in email['body'].lower() else 'Submitted'
            
            task = {
                'company': classification['company'],
                'location': classification['location'],
                'salary': classification['salary'],
                'due_date': f"Due {classification['deadline']}" if classification['deadline'] != 'N/A' else 'N/A',
                'category': classification['category'],
                'tech_stack': classification['tech_stack'],
                'status': status
            }
            tasks.append(task)
            
            # Save to Google Sheets
            try:
                sheets_client.append_values(
                    spreadsheet_id=spreadsheet_id,
                    range_name='Sheet1!A1:G',
                    values=[[
                        task['company'],
                        task['location'],
                        task['salary'],
                        task['due_date'],
                        task['category'],
                        task['tech_stack'],
                        task['status']
                    ]]
                )
                logger.info(f"Added task to Sheets: {email['subject']}")
            except Exception as e:
                logger.error(f"Error updating sheets: {e}")
            
            # Add to Calendar
            if task['due_date'] != 'N/A':
                try:
                    calendar_client.insert_event(
                        calendar_id='primary',
                        summary=f"{task['category']} at {task['company']}",
                        start_date=task['due_date'].replace('Due ', '')
                    )
                    logger.info(f"Added event to Calendar: {email['subject']}")
                except Exception as e:
                    logger.error(f"Error updating calendar: {e}")
                    continue
        
        return jsonify({'applications': tasks})
    
    except Exception as e:
        logger.error(f"Error in tasks endpoint: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Backend is running!'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)