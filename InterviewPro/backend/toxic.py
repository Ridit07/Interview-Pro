import numpy as np
import pandas as pd
import torch
from torch import nn
from tensorflow.keras.preprocessing import text, sequence
from tensorflow.keras.preprocessing.sequence import pad_sequences
import torch.nn.functional as F


# Define constants
MAX_LEN = 220  # Maximum length for text sequences
MODEL_PATH = '/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/backend/models/toxic/model.pth'  # Path to your saved model
TOKENIZER_PATH = '/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/backend/models/toxic/tokenizer.pkl'  # Path to your saved tokenizer
EMBEDDING_MATRIX_PATH = '/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/backend/models/toxic/embedding_matrix.npy'  # Path to your embedding matrix

# Load your embedding matrix (this should be saved separately after training)
embedding_matrix = np.load(EMBEDDING_MATRIX_PATH)

# Define your neural network architecture
class SpatialDropout(nn.Dropout2d):
    def forward(self, x):
        x = x.unsqueeze(2)
        x = x.permute(0, 3, 2, 1)
        x = super(SpatialDropout, self).forward(x)
        x = x.permute(0, 3, 2, 1)
        x = x.squeeze(2)
        return x

class NeuralNet(nn.Module):
    def __init__(self, embedding_matrix, num_aux_targets):
        super(NeuralNet, self).__init__()
        embed_size = embedding_matrix.shape[1]
        self.embedding = nn.Embedding(len(embedding_matrix), embed_size)
        self.embedding.weight = nn.Parameter(torch.tensor(embedding_matrix, dtype=torch.float32))
        self.embedding.weight.requires_grad = False
        self.embedding_dropout = SpatialDropout(0.3)
        self.lstm1 = nn.LSTM(embed_size, 128, bidirectional=True, batch_first=True)
        self.lstm2 = nn.LSTM(128 * 2, 128, bidirectional=True, batch_first=True)
        self.linear1 = nn.Linear(128 * 4, 128 * 4)
        self.linear2 = nn.Linear(128 * 4, 128 * 4)
        self.linear_out = nn.Linear(128 * 4, 1)
        self.linear_aux_out = nn.Linear(128 * 4, num_aux_targets)
    
    def forward(self, x):
        h_embedding = self.embedding(x)
        h_embedding = self.embedding_dropout(h_embedding)
        h_lstm1, _ = self.lstm1(h_embedding)
        h_lstm2, _ = self.lstm2(h_lstm1)
        avg_pool = torch.mean(h_lstm2, 1)
        max_pool, _ = torch.max(h_lstm2, 1)
        h_conc = torch.cat((max_pool, avg_pool), 1)
        h_conc_linear1 = F.relu(self.linear1(h_conc))
        h_conc_linear2 = F.relu(self.linear2(h_conc))
        hidden = h_conc + h_conc_linear1 + h_conc_linear2
        result = self.linear_out(hidden)
        aux_result = self.linear_aux_out(hidden)
        out = torch.cat([result, aux_result], 1)
        return out

# Load the saved model
def load_model(model_path, embedding_matrix, num_aux_targets=5):
    model = NeuralNet(embedding_matrix, num_aux_targets=6)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()  # Set the model to evaluation mode
    return model

# Preprocess function for text input
def preprocess(text_series):
    punct = "/-'?!.,#$%\'()*+-/:;<=>@[\\]^_`{|}~`" + '""“”’' + '∞θ÷α•à−β∅³π‘₹´°£€\×™√²—–&'
    def clean_special_chars(text, punct):
        for p in punct:
            text = text.replace(p, ' ')
        return text
    return text_series.astype(str).apply(lambda x: clean_special_chars(x, punct))

# Predict function for a single sentence
def predict_sentence(sentence, model, tokenizer, max_len=MAX_LEN):
    # Preprocess the sentence
    sentence = preprocess(pd.Series([sentence]))
    sequence = tokenizer.texts_to_sequences(sentence)
    sequence = pad_sequences(sequence, maxlen=max_len)
    sequence = torch.tensor(sequence, dtype=torch.long)

    # Get predictions
    with torch.no_grad():
        preds = model(sequence)
        preds = 1 / (1 + np.exp(-preds.cpu().numpy()))  # Apply sigmoid to predictions
    return preds

# Print labeled predictions
# Print labeled predictions
def label_predictions(prediction):
    # Print the prediction array to inspect its shape and content
    print("Prediction shape:", prediction.shape)
    print("Prediction values:", prediction)
    
    # Unpack based on the actual output size
    if prediction.shape[1] == 6:
        toxicity, severe_toxicity, obscene, identity_attack, insult, threat = prediction[0]
        print(f"Toxicity: {toxicity}")
        print(f"Severe Toxicity: {severe_toxicity}")
        print(f"Obscene: {obscene}")
        print(f"Identity Attack: {identity_attack}")
        print(f"Insult: {insult}")
        print(f"Threat: {threat}")
    elif prediction.shape[1] == 5:
        # Adjust to 5 values if needed
        toxicity, severe_toxicity, obscene, identity_attack, insult = prediction[0]
        print(f"Toxicity: {toxicity}")
        print(f"Severe Toxicity: {severe_toxicity}")
        print(f"Obscene: {obscene}")
        print(f"Identity Attack: {identity_attack}")
        print(f"Insult: {insult}")
    elif prediction.shape[1] == 7:
        toxicity, severe_toxicity, obscene, identity_attack, insult, threat, extras = prediction[0]
        print(f"Toxicity: {toxicity}")
        print(f"Severe Toxicity: {severe_toxicity}")
        print(f"Obscene: {obscene}")
        print(f"Identity Attack: {identity_attack}")
        print(f"Insult: {insult}")
        print(f"threat: {threat}")
        print(f"Extras: {extras}")
    else:
        print("Invalid prediction shape")


# Main function to load the model and tokenizer, then predict
if __name__ == "__main__":
    # Load tokenizer
    import pickle
    with open(TOKENIZER_PATH, 'rb') as f:
        tokenizer = pickle.load(f)

    # Load model
    model = load_model(MODEL_PATH, embedding_matrix)

    # Predict on a sample sentence
    sentence = " Please introduce yourself. My name is Shashank Goswami. I am a third year B.Tech student. My skill sets include MonsTag as well as DSA. I have also done some topics such as cybersecurity, JavaScript and Python and my code languages."
    prediction = predict_sentence(sentence, model, tokenizer)
    label_predictions(prediction)
