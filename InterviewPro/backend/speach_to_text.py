import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline


model_id = "openai/whisper-large-v3"

device = "cuda:0" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

model = AutoModelForSpeechSeq2Seq.from_pretrained(
    model_id, torch_dtype=torch_dtype, low_cpu_mem_usage=True, use_safetensors=True
)
model.to(device)

processor = AutoProcessor.from_pretrained(model_id)

pipe = pipeline(
    "automatic-speech-recognition",
    model=model,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor,
    max_new_tokens=128,
    chunk_length_s=15,
    batch_size=16,
    return_timestamps=True,
    torch_dtype=torch_dtype,
    device=device,
)

audio = "/Users/riditjain/Downloads/New Recording 4.m4a"

# from pydub import AudioSegment

# Load your M4A file
# m4a_audio = AudioSegment.from_file("/Users/riditjain/Downloads/New Recording 4.m4a", format="m4a")

# Set the path for the output MP3 file
output_path = "/Users/riditjain/Downloads/New Recording 4.mp3"

# # Export the M4A as an MP3
# m4a_audio.export(output_path, format="mp3")


result = pipe(output_path)

print(result['text'])