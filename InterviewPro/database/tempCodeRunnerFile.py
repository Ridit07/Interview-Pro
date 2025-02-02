import os
import firebase_admin
from firebase_admin import credentials, storage

# Initialize Firebase Admin SDK with the service account key
cred = credentials.Certificate("/Users/riditjain/Downloads/video-recorder-app-5e452-firebase-adminsdk-ld4y0-80e71740bd.json")
firebase_admin.initialize_app(cred, {
    "storageBucket": "video-recorder-app-5e452.appspot.com"  # Replace with your Firebase project ID
})

# Firebase storage bucket
bucket = storage.bucket()

def download_chunks(interview_id, download_dir="/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/database/static/uploads"):
    """
    Downloads all video chunks for a given interview ID from Firebase Storage.

    Parameters:
    - interview_id (str): The interview ID used to identify the folder in Firebase Storage.
    - download_dir (str): Local directory to save downloaded chunks. Default is specified path.
    """
    # Ensure the download directory exists
    os.makedirs(download_dir, exist_ok=True)

    # List all files in the Firebase Storage path for this interview
    prefix = f"recordings/{interview_id}/"
    blobs = bucket.list_blobs(prefix=prefix)

    # Download each chunk to the specified local directory
    for blob in blobs:
        filename = os.path.join(download_dir, blob.name.split('/')[-1])  # Get the chunk filename
        print(f"Downloading {filename}...")
        blob.download_to_filename(filename)
        print(f"Downloaded {filename}")

    print("All chunks downloaded successfully!")

# Call the function with the interview ID
download_chunks("15")
