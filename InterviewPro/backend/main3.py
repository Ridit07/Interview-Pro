from flask import Flask, request, jsonify
import spacy
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
import nltk

from gensim import corpora
from gensim.models.ldamodel import LdaModel
from textstat.textstat import textstatistics
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
#nltk.download('punkt_tab')
# Initialize Flask app
app = Flask(__name__)


# Load NLP models
nlp = spacy.load("en_core_web_sm")
stop_words = set(stopwords.words('english'))

# Define NLP functions
def preprocess_text(text):
    text = text.lower()
    sentences = sent_tokenize(text)
    words = [word_tokenize(sentence) for sentence in sentences]
    filtered_words = [[word for word in word_list if word not in stop_words] for word_list in words]
    return filtered_words

def identify_keywords(text):
    processed_text = preprocess_text(text)
    all_words = [word for sublist in processed_text for word in sublist]
    freq_dist = nltk.FreqDist(all_words)
    keywords = [word for word, freq in freq_dist.items() if freq > 1]
    return keywords

def topic_modeling(text):
    processed_text = preprocess_text(text)
    dictionary = corpora.Dictionary(processed_text)
    doc_term_matrix = [dictionary.doc2bow(doc) for doc in processed_text]
    lda_model = LdaModel(doc_term_matrix, num_topics=5, id2word=dictionary, passes=25)
    topics = lda_model.print_topics(num_words=3)
    return topics

def named_entity_recognition(text):
    doc = nlp(text)
    entities = [(entity.text, entity.label_) for entity in doc.ents]
    return entities

def analyze_complexity(text):
    syllables = textstatistics().syllable_count(text)
    sentences = textstatistics().sentence_count(text)
    words = len(word_tokenize(text))
    flesch_kincaid_grade = 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
    return flesch_kincaid_grade

def assess_technology_experience(text):
    doc = nlp(text)
    experiences = []
    for sentence in doc.sents:
        has_development_verb = False
        tech_skills = []
        for token in sentence:
            if token.dep_ == "ROOT" and token.lemma_ in {"develop", "build", "create", "implement", "use", "utilize"}:
                has_development_verb = True
            if token.dep_ in {"dobj", "pobj"} and token.pos_ == "PROPN":
                tech_skills.append(token.text)
        if has_development_verb and tech_skills:
            for skill in tech_skills:
                experiences.append(f"Intermediate to advanced experience with {skill} based on context: '{sentence.text}'")
        elif tech_skills:
            for skill in tech_skills:
                experiences.append(f"Mentioned {skill}, indicating familiarity: '{sentence.text}'")
    return experiences

def analyze_thought_process(text):
    sentences = sent_tokenize(text)
    logical_connectors = ['therefore', 'however', 'for example', 'because', 'firstly', 'secondly', 'furthermore', 'moreover']
    connector_count = 0
    sentence_lengths = []
    for sentence in sentences:
        words = word_tokenize(sentence)
        sentence_lengths.append(len(words))
        connector_count += sum(1 for word in words if word.lower() in logical_connectors)
    avg_sentence_length = sum(sentence_lengths) / len(sentence_lengths) if sentence_lengths else 0
    return {
        'total_sentences': len(sentences),
        'average_sentence_length': avg_sentence_length,
        'logical_connector_count': connector_count,
    }

@app.route('/analyze', methods=['POST'])
def analyze_text():
    data = request.json
    text = data.get("text")
    
    # Perform analysis
    thought_process_metrics = analyze_thought_process(text)
    keywords = identify_keywords(text)
    topics = topic_modeling(text)
    entities = named_entity_recognition(text)
    complexity_score = analyze_complexity(text)
    technology_experience = assess_technology_experience(text)
    
    # Return analysis as JSON
    return jsonify({
        'thought_process_metrics': thought_process_metrics,
        'keywords': keywords,
        'topics': topics,
        'entities': entities,
        'complexity_score': complexity_score,
        'technology_experience': technology_experience
    })

if __name__ == '__main__':
    app.run(port=5002, debug=True)
