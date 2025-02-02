import os
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv3D, LSTM, Dense, Dropout, Bidirectional, MaxPool3D, Activation, TimeDistributed, Flatten
import whisper
import ffmpeg
from moviepy.editor import VideoFileClip
from typing import List
from tensorflow.keras.layers import StringLookup
from difflib import SequenceMatcher
from Levenshtein import ratio as levenshtein_ratio
from fuzzywuzzy import fuzz

# Define vocabulary and character conversion functions
vocab = [x for x in "abcdefghijklmnopqrstuvwxyz'?!123456789 "]
char_to_num = StringLookup(vocabulary=vocab, oov_token="")
num_to_char = StringLookup(vocabulary=char_to_num.get_vocabulary(), oov_token="", invert=True)

# Model loading function
def load_model() -> Sequential:
    model = Sequential()
    model.add(Conv3D(128, 3, input_shape=(75, 46, 140, 1), padding='same'))
    model.add(Activation('relu'))
    model.add(MaxPool3D((1, 2, 2)))

    model.add(Conv3D(256, 3, padding='same'))
    model.add(Activation('relu'))
    model.add(MaxPool3D((1, 2, 2)))

    model.add(Conv3D(75, 3, padding='same'))
    model.add(Activation('relu'))
    model.add(MaxPool3D((1, 2, 2)))

    model.add(TimeDistributed(Flatten()))

    model.add(Bidirectional(LSTM(128, kernel_initializer='Orthogonal', return_sequences=True)))
    model.add(Dropout(0.5))

    model.add(Bidirectional(LSTM(128, kernel_initializer='Orthogonal', return_sequences=True)))
    model.add(Dropout(0.5))

    model.add(Dense(41, kernel_initializer='he_normal', activation='softmax'))
    model.load_weights('/Users/riditjain/Downloads/LipNet-main/models/checkpoint')  # Update with your model path
    return model

# Load video frames
def load_video(path: str, required_frames=75):
    cap = cv2.VideoCapture(path)
    frames = []
    
    for _ in range(int(cap.get(cv2.CAP_PROP_FRAME_COUNT))):
        ret, frame = cap.read()
        if not ret:
            break
        frame = tf.image.rgb_to_grayscale(frame)
        frames.append(frame[190:236, 80:220, :])
    
    cap.release()
    frames = tf.stack(frames)
    mean = tf.math.reduce_mean(frames)
    std = tf.math.reduce_std(tf.cast(frames, tf.float32))
    frames = tf.cast((frames - mean), tf.float32) / std

    num_frames = frames.shape[0]
    if num_frames < required_frames:
        padding = tf.repeat(frames[-1:], repeats=(required_frames - num_frames), axis=0)
        frames = tf.concat([frames, padding], axis=0)
    elif num_frames > required_frames:
        frames = frames[:required_frames]

    return frames

# Load audio transcription using Whisper AI
def get_audio_transcription(video_path):
    video = VideoFileClip(video_path)
    audio_path = "temp_audio.wav"
    video.audio.write_audiofile(audio_path)

    # Use Whisper to transcribe the audio
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)
    transcription = result["text"]

    os.remove(audio_path)
    return transcription

# Predict text from video frames
def predict_text_from_video(video_frames, model):
    yhat = model.predict(tf.expand_dims(video_frames, axis=0))
    sequence_length = yhat.shape[1]
    decoder = tf.keras.backend.ctc_decode(yhat, [sequence_length], greedy=True)[0][0].numpy()
    prediction_text = tf.strings.reduce_join(num_to_char(decoder)).numpy().decode('utf-8')
    return prediction_text

# Enhanced similarity calculation with Levenshtein distance, sequence matching, and token-based fuzzy matching
def calculate_similarity(predicted_text, transcribed_text):
    # Character-level Levenshtein ratio
    levenshtein_similarity = levenshtein_ratio(predicted_text, transcribed_text) * 100
    
    # Sequence matching ratio
    sequence_matcher = SequenceMatcher(None, predicted_text, transcribed_text)
    sequence_matcher_similarity = sequence_matcher.ratio() * 100

    # Token-based fuzzy matching (using fuzz.token_set_ratio)
    fuzzy_similarity = fuzz.token_set_ratio(predicted_text, transcribed_text)

    # Weighted combination of all scores
    combined_similarity = (levenshtein_similarity * 0.3 +
                           sequence_matcher_similarity * 0.3 +
                           fuzzy_similarity * 0.4)
    return combined_similarity

# Main function
def check_lip_sync(video_path):
    model = load_model()
    video_frames = load_video(video_path)
    predicted_text = predict_text_from_video(video_frames, model)
    transcribed_text = get_audio_transcription(video_path)

    similarity_score = calculate_similarity(predicted_text, transcribed_text)
    if similarity_score > 60:
        print("Lip-sync is good, with over 60% similarity.")
    else:
        print("Lip-sync is poor, with less than 60% similarity.")

    print(f"Predicted text from video: {predicted_text}")
    print(f"Transcribed text from audio: {transcribed_text}")
    print(f"Lip-sync similarity score: {similarity_score:.2f}%")

# Example usage
if __name__ == "__main__":
    video_path = '/Users/riditjain/Downloads/bbaf5a.mp4'  # Update with the path to your MP4 video file
    check_lip_sync(video_path)
