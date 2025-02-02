import tensorflow as tf
from typing import List
import cv2
import os 

vocab = [x for x in "abcdefghijklmnopqrstuvwxyz'?!123456789 "]
char_to_num = tf.keras.layers.StringLookup(vocabulary=vocab, oov_token="")
num_to_char = tf.keras.layers.StringLookup(
    vocabulary=char_to_num.get_vocabulary(), oov_token="", invert=True
)

def load_video(path: str, required_frames=75):
    cap = cv2.VideoCapture(path)
    frames = []
    
    # Capture frames from the video
    for _ in range(int(cap.get(cv2.CAP_PROP_FRAME_COUNT))):
        ret, frame = cap.read()
        if not ret:
            break
        frame = tf.image.rgb_to_grayscale(frame)
        frames.append(frame[190:236, 80:220, :])
    
    cap.release()

    # Convert frames list to tensor
    frames = tf.stack(frames)
    
    # Normalize frames
    mean = tf.math.reduce_mean(frames)
    std = tf.math.reduce_std(tf.cast(frames, tf.float32))
    frames = tf.cast((frames - mean), tf.float32) / std

    # Adjust the number of frames to exactly `required_frames`
    num_frames = frames.shape[0]
    if num_frames < required_frames:
        # Pad with the last frame if fewer than required_frames
        padding = tf.repeat(frames[-1:], repeats=(required_frames - num_frames), axis=0)
        frames = tf.concat([frames, padding], axis=0)
    elif num_frames > required_frames:
        # Trim excess frames if more than required_frames
        frames = frames[:required_frames]

    return frames

    
def load_alignments(path: str) -> List[str]:
    if not os.path.exists(path):
        raise FileNotFoundError(f"Alignment file does not exist at path: {path}")

    with open(path, 'r') as f:
        lines = f.readlines()
    tokens = []
    for line in lines:
        line = line.split()
        if line[2] != 'sil':
            tokens = [*tokens, ' ', line[2]]
    return char_to_num(tf.reshape(tf.strings.unicode_split(tokens, input_encoding='UTF-8'), (-1)))[1:]


import os

def load_data(path: str):
    path = bytes.decode(path.numpy())
    file_name = os.path.basename(path).split('.')[0]
    video_path = os.path.join('..', 'data', 's1', f'{file_name}.mpg')
    alignment_path = os.path.join('..', 'data', 'alignments', 's1', f'{file_name}.align')

    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found at {video_path}")
    if not os.path.exists(alignment_path):
        raise FileNotFoundError(f"Alignment file not found at {alignment_path}")

    frames = load_video(video_path)
    alignments = load_alignments(alignment_path)
    return frames, alignments
