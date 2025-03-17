import logging
import requests
from email_fetcher import get_credentials

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SheetsClient:
    def __init__(self, credentials):
        self.token = credentials.token
        self.base_url = "https://sheets.googleapis.com/v4/spreadsheets"
        
    def append_values(self, spreadsheet_id, range_name, values, value_input_option="RAW"):
        """Append values to a spreadsheet."""
        url = f"{self.base_url}/{spreadsheet_id}/values/{range_name}:append?valueInputOption={value_input_option}"
        
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
        
        body = {
            'values': values
        }
        
        response = requests.post(url, headers=headers, json=body)
        response.raise_for_status()  # Raise exception for non-200 responses
        return response.json()

def test_sheets():
    try:
        # Get credentials
        creds = get_credentials()
        logger.info("Credentials obtained successfully")
        
        # Create sheets client
        sheets = SheetsClient(creds)
        
        # Test appending values
        spreadsheet_id = '1PLcDZZOKipntcEoEvI_hH4aMg0B3fuFeCzhXsNvFkd8'
        values = [['Test Task', 'Test Company', 'Test Category', '2025-02-25', 'Test Tech', 'Test Source', 'Pending']]
        
        result = sheets.append_values(
            spreadsheet_id=spreadsheet_id,
            range_name='Sheet1!A1:G',
            values=values
        )
        
        logger.info(f"Successfully appended to sheet: {result}")
        return True
        
    except Exception as e:
        logger.error(f"Error in Sheets test: {e}")
        import traceback
        logger.error(traceback.format_exc())
        return False

if __name__ == '__main__':
    test_sheets()