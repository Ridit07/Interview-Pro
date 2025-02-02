import subprocess
import whisper  # OpenAI's Whisper ASR model
import os
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

def extract_audio(video_path, audio_path="temp_audio.wav"):
    """Extracts audio from a video file."""
    if not video_path.endswith(".mp4"):
        raise ValueError("Invalid video file format. Expected an .mp4 file.")
    
    subprocess.run(["ffmpeg", "-i", video_path, "-q:a", "0", "-map", "a", audio_path, "-y"])
    return audio_path

def generate_align_file(video_path, align_path):
    """Generates an .align file with start and end timestamps for each spoken word."""
    if not video_path.endswith(".mp4"):
        print(f"Error: {video_path} is not a valid video file.")
        return
    
    # Step 1: Extract audio from the video
    audio_path = extract_audio(video_path)
    
    # Step 2: Load Whisper model for ASR
    model = whisper.load_model("base")
    result = model.transcribe(audio_path, word_timestamps=True)
    
    # Step 3: Write alignments to .align file
    with open(align_path, 'w') as f:
        for segment in result["segments"]:
            for word in segment["words"]:
                start_time = int(word["start"] * 1000)
                end_time = int(word["end"] * 1000)
                word_text = word["word"].strip()
                f.write(f"{start_time} {end_time} {word_text}\n")
    
    os.remove(audio_path)  # Clean up the temporary audio file
    print(f"Alignment file saved as {align_path}")

# Example usage
video_path = "/Users/riditjain/Downloads/LipNet-main/app/data/s1/test_video.mp4"
align_path = "/Users/riditjain/Downloads/LipNet-main/app/data/s1/test_video.align"

generate_align_file(video_path, align_path)
