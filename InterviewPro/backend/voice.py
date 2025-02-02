from pyannote.audio import Pipeline
import torch

def detect_multiple_speakers(audio_path, hf_token):
    # Load the pre-trained speaker diarization pipeline

    pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.1",
        use_auth_token=hf_token
    )

    # Send pipeline to GPU if available
    if torch.cuda.is_available():
        pipeline.to(torch.device("cuda"))

    # Apply the pipeline to the audio file
    diarization = pipeline(audio_path)

    # Collect unique speakers
    speakers = set()
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        speakers.add(speaker)
    result=""
    # Check if more than one speaker is detected
    if len(speakers) > 1:
        result="Multiple speakers detected."
    else:
        result="Single speaker detected."
    return result

def main_audio(audio_path):
    hf_token = "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"  
    result=detect_multiple_speakers(audio_path, hf_token)
    return result


# audio_path = "/Users/riditjain/Downloads/akjbesti.mp3"  # Replace with your audio file path
# result=main_audio(audio_path)
# print(result)
