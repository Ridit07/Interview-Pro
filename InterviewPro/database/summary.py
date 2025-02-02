
import logging
from flask import Flask, request, jsonify, session, send_from_directory, send_file
import os
from fpdf import FPDF
from transformers import pipeline
from pdfminer.high_level import extract_text
import textwrap
import re
logging.getLogger("pdfminer").setLevel(logging.WARNING)
from flask_cors import CORS



app = Flask(__name__)
CORS(app)
summarizer = pipeline("summarization", model="facebook/bart-large-cnn", device=0)  # Use device=0 for GPU

# Function to tweak text before saving in the PDF
def prep_b4_save(text):
    replacements = {
        'yours': "your's", 'dont': "don't", 'doesnt': "doesn't", 'isnt': "isn't",
        'havent': "haven't", 'hasnt': "hasn't", 'wouldnt': "wouldn't", 'theyre': "they're",
        'youve': "you've", 'arent': "aren't", 'youre': "you're", 'cant': "can't",
        'whore': "who're", 'whos': "who's", 'whatre': "what're", 'whats': "what's",
        'hadnt': "hadn't", 'didnt': "didn't", 'couldnt': "couldn't", 'theyll': "they'll",
        'youd': "you'd"
    }
    for k, v in replacements.items():
        text = re.sub(k, v, text)
    return text

# Function to convert the text into PDF and save it
def text_to_pdf(text, filename):
    a4_width_mm = 200
    pt_to_mm = 0.35
    fontsize_pt = 11
    fontsize_mm = fontsize_pt * pt_to_mm
    margin_bottom_mm = 10
    character_width_mm = 7 * pt_to_mm
    width_text = a4_width_mm / character_width_mm

    pdf = FPDF(orientation='P', unit='mm', format='A4')
    pdf.set_auto_page_break(True, margin=margin_bottom_mm)
    pdf.add_page()
    pdf.set_font(family='Courier', size=fontsize_pt)
    splitted = text.split('\n')

    for line in splitted:
        lines = textwrap.wrap(line, width_text)
        if len(lines) == 0:
            pdf.ln()
        for wrap in lines:
            pdf.cell(0, fontsize_mm, wrap, ln=1)

    pdf.output(filename, 'F')

# Function to split large text into smaller chunks
def text_chunking(new_text):
    max_chunk = 400
    sentences = new_text.split('. ')
    current_chunk = 0
    chunks = []
    for sentence in sentences:
        if len(chunks) == current_chunk + 1:
            if len(chunks[current_chunk]) + len(sentence.split(' ')) <= max_chunk:
                chunks[current_chunk].extend(sentence.split(' '))
            else:
                current_chunk += 1
                chunks.append(sentence.split(' '))
        else:
            chunks.append(sentence.split(' '))
    for chunk_id in range(len(chunks)):
        chunks[chunk_id] = ' '.join(chunks[chunk_id])
    return chunks

# Function to generate summary
def model_summary(chunks):
    all_summaries = []
    for chunk in chunks:
        try:
            res = summarizer(chunk, max_length=150, min_length=30, do_sample=False)
            all_summaries += res
        except IndexError:
            continue
    return all_summaries

@app.route('/summarize_pdf', methods=['POST'])
def summarize_pdf():
    # Check if the file is part of the request
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the uploaded PDF temporarily
    pdf_path = os.path.join("/tmp", file.filename)
    file.save(pdf_path)

    # Extract, summarize, and save to new PDF
    raw_text = extract_text(pdf_path)
    chunks = text_chunking(raw_text)
    all_summaries = model_summary(chunks)
    joined_summary = ' '.join([summ['summary_text'] for summ in all_summaries])
    txt_to_save = (joined_summary.encode('latin1', 'ignore')).decode("latin1")
    txt_to_save_prep = prep_b4_save(txt_to_save)

    # Create summarized PDF file
    summary_pdf_path = os.path.join("/tmp", f"{file.filename[:-4]}_summary.pdf")
    text_to_pdf(txt_to_save_prep, summary_pdf_path)

    # Return the summarized PDF file as response
    return send_file(summary_pdf_path, as_attachment=True)



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5011)