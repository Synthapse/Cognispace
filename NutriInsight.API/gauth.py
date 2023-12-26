from __future__ import print_function

import os.path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import requests

class GoogleAuthenticator():

    def __init__(self):
        self.creds = None
        # If modifying these scopes, delete the file token.json.
        self.vision_cloud_scopes = ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/cloud-vision']

    def gauth(self):
        creds = None
        # The file token.json stores the user's access and refresh tokens, and is
        # created automatically when the authorization flow completes for the first
        # time.
        if os.path.exists('token.json'):
            creds = Credentials.from_authorized_user_file('token.json', self.vision_cloud_scopes)
        # If there are no (valid) credentials available, let the user log in.
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file('credentials.json', self.vision_cloud_scopes)
                creds = flow.run_local_server(port=0)
                self.creds = creds
            # Save the credentials for the next run
            with open('token.json', 'w') as token:
                token.write(creds.to_json())

    def read_text_from_image(self, image_url):
        service = build('vision', 'v1', credentials=self.creds)
        data = {
            "requests": [
                {
                    "image": {
                        "source": {
                            "imageUri": image_url
                        }
                    },
                    "features": [
                        {
                            "type": "TEXT_DETECTION"
                        }
                    ]
                }
            ]
        }

        test = service.images().annotate(body=data).execute()
        return test