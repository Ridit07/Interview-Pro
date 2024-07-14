import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
import gensim
from gensim import corpora
from gensim.models.ldamodel import LdaModel
import spacy
from textstat.textstat import textstatistics
from nltk.tokenize import sent_tokenize, word_tokenize

nlp = spacy.load("en_core_web_sm")

def preprocess_text(text):
    # Lowercase the text
    text = text.lower()
    # Tokenize into sentences
    sentences = sent_tokenize(text)
    # Tokenize into words
    words = [word_tokenize(sentence) for sentence in sentences]
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    filtered_words = [[word for word in word_list if word not in stop_words] for word_list in words]
    return filtered_words


def identify_keywords(text):
    # Assume preprocess_text has been called first
    processed_text = preprocess_text(text)
    # Flatten the list of lists
    all_words = [word for sublist in processed_text for word in sublist]
    # Frequency distribution
    freq_dist = nltk.FreqDist(all_words)
    keywords = [word for word, freq in freq_dist.items() if freq > 1]
    return keywords


def topic_modeling(text):
    processed_text = preprocess_text(text)
    dictionary = corpora.Dictionary(processed_text)
    doc_term_matrix = [dictionary.doc2bow(doc) for doc in processed_text]
    lda_model = LdaModel(doc_term_matrix, num_topics=5, id2word=dictionary, passes=25)  # Adjust num_topics and passes as needed
    topics = lda_model.print_topics(num_words=3)  # Adjust num_words as needed
    return topics


def named_entity_recognition(text):
    nlp = spacy.load('en_core_web_sm')
    doc = nlp(text)
    entities = [(entity.text, entity.label_) for entity in doc.ents]
    return entities


def analyze_complexity(text):
    syllables = textstatistics().syllable_count(text)
    sentences = textstatistics().sentence_count(text)
    words = len(word_tokenize(text))
    # The Flesch-Kincaid Grade Level formula
    flesch_kincaid_grade = 0.39 * (words/sentences) + 11.8 * (syllables/words) - 15.59
    return flesch_kincaid_grade

def assess_technology_experience(text):
    doc = nlp(text)

    for sentence in doc.sents:
        has_development_verb = False
        tech_skills = []

        for token in sentence:
            # Check for development-related verbs that could indicate hands-on experience
            if token.dep_ == "ROOT" and token.lemma_ in {"develop", "build", "create", "implement", "use", "utilize"}:
                has_development_verb = True

            # Check for technologies mentioned as direct objects or objects of prepositions, indicating use in the project
            if token.dep_ in {"dobj", "pobj"} and token.pos_ == "PROPN":
                tech_skills.append(token.text)

        # Assessing the level based on identified patterns
        if has_development_verb and tech_skills:
            for skill in tech_skills:
                print(f"The candidate has intermediate to advanced experience with {skill} based on the context: '{sentence.text}'")
        elif tech_skills:
            for skill in tech_skills:
                print(f"The candidate mentioned {skill}, indicating familiarity: '{sentence.text}'")

def analyze_thought_process(text):
    # Tokenize the text into sentences
    sentences = sent_tokenize(text)
    # Initialize counters and lists
    logical_connectors = ['therefore', 'however', 'for example', 'because', 'firstly', 'secondly', 'furthermore', 'moreover']
    connector_count = 0
    sentence_lengths = []

    # Analyze each sentence
    for sentence in sentences:
        # Tokenize the sentence into words and calculate its length
        words = word_tokenize(sentence)
        sentence_lengths.append(len(words))
        # Count logical connectors
        connector_count += sum(1 for word in words if word.lower() in logical_connectors)

    # Calculate average sentence length
    avg_sentence_length = sum(sentence_lengths) / len(sentence_lengths) if sentence_lengths else 0

    return {
        'total_sentences': len(sentences),
        'average_sentence_length': avg_sentence_length,
        'logical_connector_count': connector_count,
    }

# Example Usage
interview_text = example_text
thought_process_metrics = analyze_thought_process(interview_text)
print(f"Total Sentences: {thought_process_metrics['total_sentences']}")
print(f"Average Sentence Length: {thought_process_metrics['average_sentence_length']:.2f}")
print(f"Logical Connector Count: {thought_process_metrics['logical_connector_count']}")

keywords = identify_keywords(interview_text)
print("Keywords:", keywords)

topics = topic_modeling(interview_text)
print("Topics:", topics)

entities = named_entity_recognition(interview_text)
print("Named Entities:", entities)

complexity_score = analyze_complexity(interview_text)
print("Complexity Score:", complexity_score)


assess_technology_experience(example_text)