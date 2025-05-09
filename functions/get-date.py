import json
from datetime import datetime

def handler(event, context):
    # Get the current date in the format YYYY-MM-DD
    current_date = datetime.now().strftime('%Y-%m-%d')

    # Return the date as a JSON response
    return {
        'statusCode': 200,
        'body': json.dumps({'date': current_date})
    }
