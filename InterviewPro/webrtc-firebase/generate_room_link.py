# import firebase_admin
# from firebase_admin import credentials, firestore
# import urllib.parse

# # Initialize Firebase Admin SDK
# cred = credentials.Certificate('/Users/riditjain/Downloads/webrtc-firebase-demo-main/webrtc-98512-firebase-adminsdk-pgjat-9b271e8954.json')  # Replace with your service account key path
# firebase_admin.initialize_app(cred)

# db = firestore.client()

# def generate_unique_code():
#     # Generate a unique document ID by adding a dummy document and retrieving its ID
#     doc_ref = db.collection('dummy').document()
#     return doc_ref.id

# def generate_room_link(base_url):
#     # Generate unique codes
#     room_id = generate_unique_code()
#     video_call_id = generate_unique_code()
#     screen_share_id1 = generate_unique_code()
#     screen_share_id2 = generate_unique_code()

#     # Construct query parameters
#     params = {
#         'roomId': room_id,
#         'videoCallId': video_call_id,
#         'screenShareId1': screen_share_id1,
#         'screenShareId2': screen_share_id2
#     }

#     # Encode parameters
#     query_string = urllib.parse.urlencode(params)

#     # Construct full URL
#     full_url = f"{base_url}?{query_string}"

#     print("Generated Room Link:")
#     print(full_url)

# if __name__ == "__main__":
#     # Define your application's base URL
#     # For local testing, you might use something like http://localhost:3000
#     # Replace with your actual deployment URL
#     base_url = "http://localhost:3000"

#     generate_room_link(base_url)


import firebase_admin
from firebase_admin import credentials, firestore
import urllib.parse

# Initialize Firebase Admin SDK
cred = credentials.Certificate('/Users/riditjain/Downloads/webrtc-firebase-demo-main/webrtc-98512-firebase-adminsdk-pgjat-9b271e8954.json')  # Replace with your service account key path
firebase_admin.initialize_app(cred)

db = firestore.client()

def generate_unique_code():
    # Generate a unique document ID by adding a dummy document and retrieving its ID
    doc_ref = db.collection('dummy').document()
    return doc_ref.id

def generate_room_link(base_url):
    # Generate unique codes
    room_id = generate_unique_code()
    video_call_id = generate_unique_code()
    screen_share_id1 = generate_unique_code()
    screen_share_id2 = generate_unique_code()

    # Construct query parameters for caller
    caller_params = {
        'roomId': room_id,
        'videoCallId': video_call_id,
        'screenShareId1': screen_share_id1,
        'screenShareId2': screen_share_id2,
        'role': 'caller'
    }

    # Construct query parameters for callee
    callee_params = {
        'roomId': room_id,
        'videoCallId': video_call_id,
        'screenShareId1': screen_share_id1,
        'screenShareId2': screen_share_id2,
        'role': 'callee'
    }

    # Encode parameters
    caller_query = urllib.parse.urlencode(caller_params)
    callee_query = urllib.parse.urlencode(callee_params)

    # Construct full URLs
    caller_url = f"{base_url}?{caller_query}"
    callee_url = f"{base_url}?{callee_query}"

    print("Generated Room Links:")
    print("\nCaller Link:")
    print(caller_url)
    print("\nCallee Link:")
    print(callee_url)

if __name__ == "__main__":
    # Define your application's base URL
    base_url = "http://localhost:3000"  # Replace with your actual deployment URL

    generate_room_link(base_url)

