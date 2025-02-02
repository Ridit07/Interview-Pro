import re
import textwrap
from fpdf import FPDF
from pdfminer.high_level import extract_text
from transformers import pipeline
import PyPDF2


summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

# Function to tweak text before saving in the PDF
def prep_b4_save(text):
    text = re.sub('yours', 'your\'s', text)
    text = re.sub('dont', 'don\'t', text)
    text = re.sub('doesnt', 'doesn\'t', text)
    text = re.sub('isnt', 'isn\'t', text)
    text = re.sub('havent', 'haven\'t', text)
    text = re.sub('hasnt', 'hasn\'t', text)
    text = re.sub('wouldnt', 'wouldn\'t', text)
    text = re.sub('theyre', 'they\'re', text)
    text = re.sub('youve', 'you\'ve', text)
    text = re.sub('arent', 'aren\'t', text)
    text = re.sub('youre', 'you\'re', text)
    text = re.sub('cant', 'can\'t', text)
    text = re.sub('whore', 'who\'re', text)
    text = re.sub('whos', 'who\'s', text)
    text = re.sub('whatre', 'what\'re', text)
    text = re.sub('whats', 'what\'s', text)
    text = re.sub('hadnt', 'hadn\'t', text)
    text = re.sub('didnt', 'didn\'t', text)
    text = re.sub('couldnt', 'couldn\'t', text)
    text = re.sub('theyll', 'they\'ll', text)
    text = re.sub('youd', 'you\'d', text)
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
    print("PDF of summary Saved!!")

# Function to split large text into smaller chunks
# Update max_chunk in the text_chunking function
def text_chunking(new_text):
    max_chunk = 400  # Reduced chunk size for safety
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
    print("Total chunks of text are: ", len(chunks))
    return chunks

# Add error handling in model_summary
def model_summary(chunks):
    print("Summarizing the text. Please wait .......")
    all_summaries = []
    count = 0
    for chunk in chunks:
        print(f"Summarizing Chunk NO: {count + 1}")
        try:
            res = summarizer(chunk, max_length=150, min_length=30, do_sample=False)
            all_summaries += res
        except IndexError as e:
            print(f"Skipping Chunk NO: {count + 1} due to token limit issue")
        count += 1
    return all_summaries


# Main function that takes PDF file path, performs the summarization, and saves it as a PDF
def find_summary(pdf_path):
    raw_text = extract_text(pdf_path)  # Extract text from PDF file
    chunks = text_chunking(raw_text)   # Chunk the large text into smaller parts
    all_summaries = model_summary(chunks)  # Pass chunks to the model for summarization
    joined_summary = ' '.join([summ['summary_text'] for summ in all_summaries])  # Combine all summary chunks into a single text
    txt_to_save = (joined_summary.encode('latin1', 'ignore')).decode("latin1")  # Handle any encoding issues
    txt_to_save_prep = prep_b4_save(txt_to_save)  # Apply pre-save tweaks to the text
    file_name = pdf_path.split('/')[-1][:-4] + "_summary.pdf"
    text_to_pdf(txt_to_save_prep, file_name)


pdf_path = "/Users/riditjain/Downloads/s41598-021-82871-4-cropped.pdf"
find_summary(pdf_path)
