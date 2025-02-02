import cv2
import numpy as np
from tensorflow.keras.utils import img_to_array
from keras.models import load_model
import os
from collections import Counter

# Load the pre-trained model
model = load_model("/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/backend/models/ferNet.h5")

# Load Haar cascade for face detection
face_haar_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Define the list of emotions
emotions = ('angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral')

# Function to detect and predict emotion from a frame
def detect_emotion(frame):
    gray_img = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_haar_cascade.detectMultiScale(gray_img, 1.32, 5)
    
    if len(faces) == 0:
        return None  # No face detected

    for (x, y, w, h) in faces:
        roi_gray = gray_img[y:y + h, x:x + w]
        roi_gray = cv2.resize(roi_gray, (48, 48))
        img_pixels = img_to_array(roi_gray)
        img_pixels = np.expand_dims(img_pixels, axis=0)
        img_pixels /= 255

        predictions = model.predict(img_pixels)
        max_index = np.argmax(predictions[0])
        predicted_emotion = emotions[max_index]
        
        return predicted_emotion

    return None  # No emotion detected if no face found

# Function to extract frames uniformly
def extract_frames(video_path, num_frames=50):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    interval = total_frames // num_frames
    frames = []
    
    for i in range(num_frames):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i * interval)
        ret, frame = cap.read()
        if not ret:
            continue
        frames.append(frame)
    
    cap.release()
    return frames

# Function to analyze emotions in frames and calculate percentages
def analyze_emotions(video_path):
    frames = extract_frames(video_path)
    emotions_detected = []

    for frame in frames:
        emotion = detect_emotion(frame)
        if emotion:
            emotions_detected.append(emotion)
    
    # Count occurrences of each emotion
    emotion_counts = Counter(emotions_detected)
    total_emotions = sum(emotion_counts.values())

    # Calculate percentage and filter out emotions below 20%
    emotion_percentages = {emotion: (count / total_emotions) * 100 for emotion, count in emotion_counts.items() if (count / total_emotions) * 100 >= 10}

    return emotion_percentages

# Main execution
if __name__ == "__main__":
    video_path = "/Users/riditjain/Downloads/lavanya_video.mp4"  # Replace with your video path
    emotion_percentages = analyze_emotions(video_path)

    # Print the results
    for emotion, percentage in emotion_percentages.items():
        print(f"{emotion}: {percentage:.2f}%")
