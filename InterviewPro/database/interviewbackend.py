from flask import Flask, request, jsonify, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import timedelta, datetime
import logging
from dateutil import parser
from pytz import utc
import pandas as pd
from flask import send_file
import firebase_admin
from firebase_admin import credentials, storage
from moviepy.editor import VideoFileClip, concatenate_videoclips
from subprocess import run, CalledProcessError
import requests
import threading
from fpdf import FPDF


logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, supports_credentials=True, origins='http://localhost:5173')
# CORS(app)  # Enable CORS on all routes

app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'static/uploads')
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Ridit%404321@localhost/RecruitmentDB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
app.secret_key = 'kjdf@kuhf^#hfbiu7hrhi!93jkej&ejjsu7837'

db = SQLAlchemy(app)

class Organisation(db.Model):
    __tablename__ = 'Organisation'
    OrganisationID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(255))
    Email = db.Column(db.String(255), unique=True)
    Contact = db.Column(db.String(255))
    Password = db.Column(db.String(255))
    company_icon = db.Column(db.String(255))  

    def __init__(self, name, email, contact, password , company_icon):
        self.Name = name
        self.Email = email
        self.Contact = contact
        self.Password = password
        self.company_icon = company_icon 

class Candidate(db.Model):
    CandidateID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(255))
    Email = db.Column(db.String(255), unique=True)
    Contact = db.Column(db.String(255))
    Password = db.Column(db.String(255))
    ResumePath = db.Column(db.String(255))
    def __init__(self, name, email, contact, password):
        self.Name = name
        self.Email = email
        self.Contact = contact
        self.Password = generate_password_hash(password)

class Rubrics(db.Model):
    RubricID = db.Column(db.Integer, primary_key=True)
    Experience = db.Column(db.String(255))
    DifficultyLevel = db.Column(db.String(255))
    Notes = db.Column(db.Text)
    SelectedSkills = db.Column(db.Text)
    Role = db.Column(db.String(255))

class Status(db.Model):
    StatusID = db.Column(db.Integer, primary_key=True)
    StatusDescription = db.Column(db.String(255))
    ReportPath = db.Column(db.String(255))
    Ai_Report_Path=db.Column(db.String(255))
    JD_Path=db.Column(db.String(255))

class Interviews(db.Model):
    InterviewID = db.Column(db.Integer, primary_key=True)
    OrganisationID = db.Column(db.Integer, db.ForeignKey('Organisation.OrganisationID'))
    StatusID = db.Column(db.Integer, db.ForeignKey('status.StatusID'))
    RubricID = db.Column(db.Integer, db.ForeignKey('rubrics.RubricID'))
    CandidateID = db.Column(db.Integer, db.ForeignKey('candidate.CandidateID'))
    InterviewerID = db.Column(db.Integer, db.ForeignKey('Interviewer.InterviewerID'))
    DateTime = db.Column(db.DateTime)
    JoiningDetails = db.Column(db.String(255))

class Interviewer(db.Model):
    __tablename__ = 'Interviewer'
    InterviewerID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(255))
    Email = db.Column(db.String(255), unique=True)
    Contact = db.Column(db.String(255))
    Password = db.Column(db.String(255))
    CompanyName = db.Column(db.String(255))
    Price = db.Column(db.Numeric(10, 2))
    interviewer_picpath = db.Column(db.String(255))  

    def __init__(self, name, email, contact, password, company_name, price, picpath=None):
        self.Name = name
        self.Email = email
        self.Contact = contact
        self.Password = password
        self.CompanyName = company_name
        self.Price = price
        self.interviewer_picpath = picpath

class ContactForm(db.Model):
    __tablename__ = 'ContactForm'
    ContactID = db.Column(db.Integer, primary_key=True)
    FirstName = db.Column(db.String(255), nullable=False)
    LastName = db.Column(db.String(255), nullable=False)
    ContactNumber = db.Column(db.String(20), nullable=False)
    Email = db.Column(db.String(255), nullable=False)
    Message = db.Column(db.Text, nullable=False)
    SubmittedAt = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, first_name, last_name, contact_number, email, message):
        self.FirstName = first_name
        self.LastName = last_name
        self.ContactNumber = contact_number
        self.Email = email
        self.Message = message

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(os.path.join(app.root_path, 'static/uploads'), filename)

@app.route('/api/interviewer_login', methods=['POST'])
def interviewer_login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    interviewer = Interviewer.query.filter_by(Email=email).first()
    if interviewer and interviewer.Password == password:
        session['interviewer_id'] = interviewer.InterviewerID
        session['interviewer_name'] = interviewer.Name
        session['interviewer_email'] = interviewer.Email
        session['interviewer_company'] = interviewer.CompanyName
        session['interviewer_picpath'] = interviewer.interviewer_picpath

        return jsonify({
            "message": "Login successful!",
            "interviewer_id": interviewer.InterviewerID,
            "interviewer_name": interviewer.Name,
            "interviewer_email": interviewer.Email,
            "interviewer_company": interviewer.CompanyName,
            "interviewer_picpath": interviewer.interviewer_picpath
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401

@app.route('/api/interviews', methods=['GET'])
def get_interviews():
    interviewer_id = session.get('interviewer_id')
    if not interviewer_id:
        return jsonify({'error': 'Not authenticated'}), 403

    default_company_icon = "/uploads/saved_files/organisation_pics/default.png"
    default_interviewer_pic = "/uploads/saved_files/interviewer_pics/default.png"

    # Join the Rubrics table to fetch role and difficulty level
    interviews = db.session.query(Interviews, Candidate, Organisation, Status, Interviewer, Rubrics).\
        join(Candidate, Candidate.CandidateID == Interviews.CandidateID).\
        join(Organisation, Organisation.OrganisationID == Interviews.OrganisationID).\
        join(Status, Status.StatusID == Interviews.StatusID).\
        join(Interviewer, Interviewer.InterviewerID == Interviews.InterviewerID).\
        join(Rubrics, Rubrics.RubricID == Interviews.RubricID).\
        filter(Interviews.InterviewerID == interviewer_id).all()

    result = []
    for interview, candidate, organisation, status, interviewer, rubric in interviews:
        interviewer_picpath = interviewer.interviewer_picpath or default_interviewer_pic
        company_icon = organisation.company_icon or default_company_icon

        # Include role and difficulty level from Rubrics
        result.append({
            'interview_id': interview.InterviewID,
            'candidate_name': candidate.Name,
            'candidate_contact': candidate.Contact,
            'candidate_email': candidate.Email,
            'company_name': organisation.Name,
            'company_email': organisation.Email,
            'datetime': interview.DateTime,
            'status_description': status.StatusDescription,
            'interviewer_picpath': interviewer_picpath,
            'company_icon': company_icon,
            'role': rubric.Role,  # Added Role
            'difficulty_level': rubric.DifficultyLevel  # Added Difficulty Level
        })

    return jsonify(result)


@app.route('/api/schedule_interview', methods=['POST'])
def schedule_interview():
    data = request.json
    interview_id = data.get('interview_id')
    datetime_str = data.get('datetime')

    if not interview_id or not datetime_str:
        return jsonify({'error': 'Invalid data'}), 400

    interview = Interviews.query.filter_by(InterviewID=interview_id).first()
    if not interview:
        return jsonify({'error': 'Interview not found'}), 404

    interview.DateTime = parser.parse(datetime_str).astimezone(utc)
    db.session.commit()

    return jsonify({'success': True})



@app.route('/api/reject_interview', methods=['POST'])
def reject_interview():
    data = request.json
    interview_id = data.get('interview_id')
    
    if not interview_id:
        return jsonify({'error': 'Invalid data'}), 400

    # Fetch the interview
    interview = Interviews.query.filter_by(InterviewID=interview_id).first()

    if not interview:
        return jsonify({'error': 'Interview not found'}), 404

    # Fetch the related status
    status = Status.query.filter_by(StatusID=interview.StatusID).first()

    if not status:
        return jsonify({'error': 'Status not found'}), 404

    # Update the StatusDescription to -1 (rejected)
    status.StatusDescription = "-1"
    db.session.commit()

    return jsonify({'success': True, 'message': 'Interview rejected successfully'})

@app.route('/api/get_rubric/<int:interview_id>', methods=['GET'])
def get_rubric(interview_id):
    # Fetch the interview with rubric
    interview = Interviews.query.filter_by(InterviewID=interview_id).first()
    if not interview or not interview.RubricID:
        return jsonify({"error": "Rubric not found"}), 404

    rubric = Rubrics.query.filter_by(RubricID=interview.RubricID).first()
    if not rubric:
        return jsonify({"error": "Rubric data not found"}), 404

    return jsonify({
        "Experience": rubric.Experience,
        "DifficultyLevel": rubric.DifficultyLevel,
        "Notes": rubric.Notes,
        "SelectedSkills": rubric.SelectedSkills
    })


@app.route('/api/update_joining_details', methods=['POST'])
def update_joining_details():
    data = request.get_json()
    interview_id = data.get('interview_id')
    joining_details = data.get('joining_details')

    if not interview_id or not joining_details:
        return jsonify({'error': 'Invalid data'}), 400

    try:
        interview = Interviews.query.filter_by(InterviewID=interview_id).first()
        if not interview:
            return jsonify({'error': 'Interview not found'}), 404

        # Update the JoiningDetails
        interview.JoiningDetails = joining_details
        db.session.commit()

        return jsonify({'success': True, 'message': 'Joining details updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/update_status_description', methods=['POST'])
def update_status_description():
    data = request.get_json()
    interview_id = data.get('interview_id')
    status_description = data.get('status_description')

    if not interview_id or status_description is None:
        return jsonify({'error': 'Invalid data'}), 400

    try:
        interview = Interviews.query.filter_by(InterviewID=interview_id).first()
        if not interview:
            return jsonify({'error': 'Interview not found'}), 404

        # Update the StatusDescription
        status = Status.query.filter_by(StatusID=interview.StatusID).first()
        if not status:
            return jsonify({'error': 'Status not found'}), 404

        status.StatusDescription = str(status_description)
        db.session.commit()

        return jsonify({'success': True, 'message': 'Status updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/get_interviewer_details/<int:interview_id>', methods=['GET'])
def get_interviewer_details(interview_id):
    # Fetch the interview to get the InterviewerID
    interview = Interviews.query.filter_by(InterviewID=interview_id).first()
    if not interview or not interview.InterviewerID:
        return jsonify({"error": "Interviewer not found"}), 404

    # Fetch the interviewer details
    interviewer = Interviewer.query.filter_by(InterviewerID=interview.InterviewerID).first()
    if not interviewer:
        return jsonify({"error": "Interviewer details not found"}), 404

    # Return interviewer details
    return jsonify({
        "name": interviewer.Name,
        "email": interviewer.Email,
        "contact": interviewer.Contact,
        "company_name": interviewer.CompanyName,
        "picpath": interviewer.interviewer_picpath
    }), 200

@app.route('/api/update_report_path', methods=['POST'])
def update_report_path():
    data = request.get_json()
    interview_id = data.get('interview_id')
    report_path = data.get('report_path')

    if not interview_id or not report_path:
        return jsonify({'error': 'Invalid data'}), 400

    try:
        # Fetch the interview to get the associated StatusID
        interview = Interviews.query.filter_by(InterviewID=interview_id).first()
        if not interview or not interview.StatusID:
            return jsonify({'error': 'Interview or Status not found'}), 404

        # Fetch the status record using StatusID
        status = Status.query.filter_by(StatusID=interview.StatusID).first()
        if not status:
            return jsonify({'error': 'Status not found'}), 404

        # Update the ReportPath in the Status table
        status.ReportPath = report_path
        db.session.commit()

        return jsonify({'success': True, 'message': 'Report path updated successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Initialize Firebase Admin SDK
cred = credentials.Certificate("/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/video-record2-firebase-adminsdk-3m2sl-bf82fae8d3.json")  # Update this path
firebase_admin.initialize_app(cred, {
    "storageBucket": "video-record2.appspot.com"
})

def download_and_merge_recordings(interview_id):
    bucket = storage.bucket()
    folder_path = f"recordings/{interview_id}"
    local_folder = f"/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/database/static/uploads/saved_files/interview_rec/{interview_id}"
    
    # Create local directory if it doesn't exist
    os.makedirs(local_folder, exist_ok=True)

    # Step 1: Download all files from Firebase Storage
    blobs = list(bucket.list_blobs(prefix=folder_path))
    downloaded_files = []

    for blob in blobs:
        file_name = blob.name.split("/")[-1]
        local_path = os.path.join(local_folder, file_name)
        blob.download_to_filename(local_path)
        downloaded_files.append(local_path)
        print(f"Downloaded {file_name} to {local_path}")

    # Step 2: Convert `.webm` files to `.mp4`
    converted_files = []
    for file_path in downloaded_files:
        mp4_path = file_path.replace(".webm", ".mp4")
        try:
            # Use ffmpeg to convert webm to mp4
            run(["ffmpeg", "-i", file_path, "-c:v", "libx264", "-c:a", "aac", mp4_path], check=True)
            converted_files.append(mp4_path)
            os.remove(file_path)  # Remove the original `.webm` file after conversion
            print(f"Converted {file_path} to {mp4_path}")
        except CalledProcessError as e:
            print(f"Failed to convert {file_path}: {e}")
            raise Exception(f"Conversion failed for {file_path}. Check ffmpeg installation.")

    # Step 3: Sort the converted files by name (Assuming they are named as recording_1.mp4, recording_2.mp4, ...)
    converted_files.sort(key=lambda x: int(x.split("_")[-1].split(".")[0]))  # Sort by recording number

    # Step 4: Create a text file for ffmpeg input
    ffmpeg_input_file = os.path.join(local_folder, "input.txt")
    with open(ffmpeg_input_file, "w") as f:
        for file_path in converted_files:
            f.write(f"file '{file_path}'\n")

    # Step 5: Use ffmpeg to concatenate the videos
    final_output_path = os.path.join(local_folder, "final.mp4")
    try:
        run([
            "ffmpeg", "-f", "concat", "-safe", "0", "-i", ffmpeg_input_file,
            "-c:v", "libx264", "-c:a", "aac", "-strict", "experimental", final_output_path
        ], check=True)
        print(f"Merged video saved to {final_output_path}")
    except CalledProcessError as e:
        print(f"Failed to concatenate videos: {e}")
        raise Exception(f"Concatenation failed. Check ffmpeg installation.")

    #Step 5: Clean up - Delete the intermediate files
    for file_path in converted_files:
        if file_path != final_output_path:
            os.remove(file_path)
            print(f"Deleted {file_path}")
        #os.remove(ffmpeg_input_file)

    # Return the path to the final merged file
    return final_output_path


from fpdf import FPDF

def async_generate_report(interview_id):
    """Function to call /generate_report asynchronously."""
    try:
        requests.post(
            "http://127.0.0.1:5001/generate_report",
            json={"interviewer_id": interview_id}
        )
    except Exception as e:
        print(f"Error in async report generation: {e}")



@app.route('/api/save_pdf', methods=['POST'])
def save_pdf():
    data = request.get_json()
    interview_id = data.get('interview_id')
    candidate_data = data.get('candidateData')
    interviewer_data = data.get('interviewerData')
    ratings = data.get('ratings')
    additional_notes = data.get('additional_notes', 'N/A')  # Fetch additional notes

    if not interview_id or not candidate_data or not interviewer_data:
        return jsonify({"success": False, "error": "Missing required data"}), 400
    try:
    # Create PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)

        # Add Interview Report title
        pdf.set_font("Arial", "B", 16)
        pdf.cell(200, 10, txt="Interview Report", ln=True, align="C")

        # Add Organisation Details
        pdf.set_font("Arial", "B", 14)
        pdf.cell(200, 10, txt="Organisation", ln=True)
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt=f"Company Name: {candidate_data['company_name']}", ln=True)
        pdf.cell(200, 10, txt=f"Company Email: {candidate_data['company_email']}", ln=True)

        # Add Candidate Information
        pdf.set_font("Arial", "B", 14)
        pdf.cell(200, 10, txt="Candidate Information", ln=True)
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt=f"Name: {candidate_data['candidate_name']}", ln=True)
        pdf.cell(200, 10, txt=f"Email: {candidate_data['candidate_email']}", ln=True)
        pdf.cell(200, 10, txt=f"Contact: {candidate_data['candidate_contact']}", ln=True)
        pdf.cell(200, 10, txt=f"Role: {candidate_data['rubric_role']}", ln=True)
        pdf.cell(200, 10, txt=f"Experience: {candidate_data['rubric_experience']}", ln=True)
        pdf.cell(200, 10, txt=f"Difficulty: {candidate_data['rubric_difficulty']}", ln=True)

        # Add Interviewer Information
        pdf.set_font("Arial", "B", 14)
        pdf.cell(200, 10, txt="Interviewer Information", ln=True)
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt=f"Name: {interviewer_data['interviewer_name']}", ln=True)
        pdf.cell(200, 10, txt=f"Email: {interviewer_data['interviewer_email']}", ln=True)
        pdf.cell(200, 10, txt=f"Company: {interviewer_data['company']}", ln=True)

        # Add Ratings Table
        pdf.set_font("Arial", "B", 14)
        pdf.set_text_color(0, 0, 255)  # Blue color for the header
        pdf.cell(200, 10, txt="Ratings", ln=True)
        pdf.set_font("Arial", "B", 12)
        pdf.set_text_color(255, 255, 255)
        pdf.set_fill_color(0, 0, 255)
        pdf.cell(65, 10, txt="Category", border=1, fill=True, align="C")
        pdf.cell(65, 10, txt="Rating", border=1, fill=True, align="C")
        pdf.cell(65, 10, txt="Remarks", border=1, fill=True, align="C")
        pdf.ln()

        pdf.set_font("Arial", size=12)
        pdf.set_text_color(0, 0, 0)

        # Add each rating to the table
        alternating = True
        for rating_data in ratings:
            fill_color = [240, 240, 255] if alternating else [255, 255, 255]
            alternating = not alternating

            category = rating_data.get("category", "N/A")
            rating = rating_data.get("rating", "N/A")
            remarks = rating_data.get("remarks", "N/A")

            pdf.set_fill_color(*fill_color)
            pdf.cell(65, 10, txt=category, border=1, fill=True)
            pdf.cell(65, 10, txt=str(rating), border=1, fill=True)
            pdf.cell(65, 10, txt=remarks, border=1, fill=True)
            pdf.ln()

        # Add Additional Notes section
        pdf.set_font("Arial", "B", 14)
        pdf.set_text_color(0, 0, 255)
        pdf.cell(200, 10, txt="General Notes", ln=True)
        pdf.set_font("Arial", size=12)
        pdf.set_text_color(0, 0, 0)
        pdf.multi_cell(0, 10, txt=additional_notes)  # Use multi_cell to handle longer text and wrapping

        # Save PDF in the specified path
        relative_path = f'/uploads/saved_files/interviewer_report/{interview_id}.pdf'
        absolute_path = f'/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/database/static/uploads/saved_files/interviewer_report/{interview_id}.pdf'

        # Save PDF in the specified path
        pdf.output(absolute_path)

        # Step 2: Update ReportPath in database
        interview = Interviews.query.filter_by(InterviewID=interview_id).first()
        if not interview or not interview.StatusID:
            return jsonify({"success": False, "error": "Interview or Status not found"}), 404

        status = Status.query.filter_by(StatusID=interview.StatusID).first()
        if not status:
            return jsonify({"success": False, "error": "Status not found"}), 404

        # Update ReportPath
        relative_path = f"/uploads/saved_files/interviewer_report/{interview_id}.pdf"
        status.ReportPath = relative_path
        db.session.commit()

        # Step 3: Download and merge recordings
        final_video_path = download_and_merge_recordings(interview_id)

        threading.Thread(target=async_generate_report, args=(interview_id,)).start()

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

    # Return success response with paths of PDF and merged video
    return jsonify({"success": True, "pdf_path": absolute_path, "video_path": final_video_path}), 200
    


@app.route('/api/update_status_and_ai_report', methods=['POST'])
def update_status_and_ai_report():
    data = request.get_json()
    interview_id = data.get('interview_id')

    if not interview_id:
        return jsonify({"success": False, "error": "Missing interview ID"}), 400

    try:
        # Fetch the interview to get the associated StatusID
        interview = Interviews.query.filter_by(InterviewID=interview_id).first()
        if not interview or not interview.StatusID:
            return jsonify({"success": False, "error": "Interview or Status not found"}), 404

        # Fetch the status record using StatusID
        status = Status.query.filter_by(StatusID=interview.StatusID).first()
        if not status:
            return jsonify({"success": False, "error": "Status not found"}), 404

        # Update StatusDescription and Ai_Report_Path
        status.StatusDescription = "6"
        status.Ai_Report_Path = f"/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/database/static/uploads/saved_files/interviewer_report/ailogfile_{interview_id}.docx"

        # Commit the changes to the database
        db.session.commit()

        return jsonify({"success": True, "message": "Status and AI report path updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500


# Add this to your backend

@app.route('/api/get_status/<int:interview_id>', methods=['GET'])
def get_status(interview_id):
    # Fetch the interview to get the associated StatusID
    interview = Interviews.query.filter_by(InterviewID=interview_id).first()
    if not interview or not interview.StatusID:
        return jsonify({"error": "Interview or Status not found"}), 404

    # Fetch the status record using StatusID
    status = Status.query.filter_by(StatusID=interview.StatusID).first()
    if not status:
        return jsonify({"error": "Status not found"}), 404

    return jsonify({"status_description": status.StatusDescription}), 200


@app.route('/api/check_cv/<int:interview_id>', methods=['GET'])
def check_cv(interview_id):
    # Get candidate ID from the interview
    interview = Interviews.query.filter_by(InterviewID=interview_id).first()
    if not interview or not interview.CandidateID:
        return jsonify({"error": "Interview or Candidate not found"}), 404

    # Get the candidate's resume path
    candidate = Candidate.query.filter_by(CandidateID=interview.CandidateID).first()
    if not candidate or not candidate.ResumePath:
        return jsonify({"error": "CV not found"}), 404

    # Define the full path to the CV file
    file_path = f'/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/database/static/uploads/saved_files/candidate_cv/{candidate.ResumePath}'
    
    # Send the file if it exists
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({"error": "CV file not found on server"}), 404

@app.route('/api/check_jd/<int:interview_id>', methods=['GET'])
def check_jd(interview_id):
    # Get status ID from the interview
    interview = Interviews.query.filter_by(InterviewID=interview_id).first()
    if not interview or not interview.StatusID:
        return jsonify({"error": "Interview or Status not found"}), 404

    # Get the JD path from the status
    status = Status.query.filter_by(StatusID=interview.StatusID).first()
    if not status or not status.JD_Path:
        return jsonify({"error": "Job description not found"}), 404

    # Define the full path to the JD file
    file_path = f'/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/database/static/uploads/saved_files/candidate_jd/{status.JD_Path}'
    
    # Send the file if it exists
    if os.path.exists(file_path):
        return send_file(file_path, as_attachment=True)
    else:
        return jsonify({"error": "Job description file not found on server"}), 404













@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.get_json()
    
    first_name = data.get('firstName')
    last_name = data.get('lastName')
    contact_number = data.get('contactNumber')
    email = data.get('email')
    message = data.get('message')

    if not first_name or not last_name or not contact_number or not email or not message:
        return jsonify({"error": "All fields are required"}), 400

    new_contact = ContactForm(
        first_name=first_name,
        last_name=last_name,
        contact_number=contact_number,
        email=email,
        message=message
    )

    db.session.add(new_contact)
    db.session.commit()

    return jsonify({"message": "Form submitted successfully"}), 201

@app.route('/api/download_contacts', methods=['GET'])
def download_contacts():
    contacts = ContactForm.query.all()

    contact_data = [
        {
            'First Name': contact.FirstName,
            'Last Name': contact.LastName,
            'Contact Number': contact.ContactNumber,
            'Email': contact.Email,
            'Message': contact.Message,
            'Submitted At': contact.SubmittedAt
        } for contact in contacts
    ]

    df = pd.DataFrame(contact_data)
    file_path = '/tmp/contact_form_submissions.xlsx'
    df.to_excel(file_path, index=False)

    return send_file(file_path, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
