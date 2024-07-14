import cv2
from facenet_pytorch import MTCNN, InceptionResnetV1
import torch
import numpy as np

device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

mtcnn = MTCNN(keep_all=True, device=device)
resnet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

video_capture = cv2.VideoCapture(0)

# Use a dictionary to maintain a mapping between face IDs and embeddings
persistent_embeddings = {}
next_id = 1

def find_matching_id(new_embedding, embeddings, threshold=0.8):
    if len(embeddings) == 0:
        return None
    min_distance = float('inf')
    matching_id = None
    for face_id, emb in embeddings.items():
        distance = torch.nn.functional.pairwise_distance(new_embedding, emb).min().item()
        if distance < min_distance:
            min_distance = distance
            matching_id = face_id
    if min_distance < threshold:
        return matching_id
    return None

while True:
    ret, frame = video_capture.read()
    if not ret:
        break

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    boxes, _ = mtcnn.detect(rgb_frame)

    if boxes is not None:
        for box in boxes:
            x1, y1, x2, y2 = [max(0, int(coord)) for coord in box]
            x2 = min(x2, rgb_frame.shape[1])
            y2 = min(y2, rgb_frame.shape[0])
            
            face = rgb_frame[y1:y2, x1:x2]
            if face.size == 0:
                continue
            
            face = cv2.resize(face, (160, 160))
            face = torch.tensor(face).permute(2,0,1).float().div(255).unsqueeze(0).to(device)
            
            with torch.no_grad():
                embedding = resnet(face).detach()
            
            matching_id = find_matching_id(embedding, persistent_embeddings)

            if matching_id is None:
                persistent_embeddings[next_id] = embedding
                print(f"Person {next_id} enters.")
                next_id += 1
            else:
                print(f"Person {matching_id} re-enters.")

    cv2.imshow('Video', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

video_capture.release()
cv2.destroyAllWindows()
