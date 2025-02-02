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
from moviepy.editor import VideoFileClip

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
CORS(app, supports_credentials=True, origins='http://localhost:5173')

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
    Ai_Report_Path = db.Column(db.String(255))

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

class additional_cheat(db.Model):
    __tablename__ = 'additional_cheat'
    cheat_id = db.Column(db.Integer, primary_key=True)
    I_id = db.Column(db.Integer, nullable=True)
    tab_counts = db.Column(db.Integer, nullable=True)
    virtual_machine = db.Column(db.Integer, nullable=True)


@app.route('/api/candidate_login', methods=['POST'])
def candidate_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    candidate = Candidate.query.filter_by(Email=email).first()
    if candidate and check_password_hash(candidate.Password, password):
        session['candidate_id'] = candidate.CandidateID
        session['candidate_name'] = candidate.Name
        return jsonify({
            "message": "Login successful!",
            "candidate_id": candidate.CandidateID,
            "candidate_name": candidate.Name
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401


@app.route('/api/get_candidate_dashboard', methods=['GET'])
def get_candidate_dashboard():
    try:
        # Get the candidate ID from session
        candidate_id = session.get('candidate_id')
        if not candidate_id:
            return jsonify({"error": "No candidate logged in"}), 401

        # Query to fetch interviews related to the candidate
        results = db.session.query(
            Interviews.InterviewID.label('interview_id'),  # Add InterviewID to the query
            Organisation.Name.label('organisation_name'),
            Organisation.company_icon.label('organisation_icon'),
            Interviewer.Name.label('interviewer_name'),
            Interviewer.interviewer_picpath.label('interviewer_icon'),
            Interviews.DateTime.label('interview_time'),
            Status.StatusDescription.label('status_description')
        ).select_from(Interviews) \
        .join(Candidate, Candidate.CandidateID == Interviews.CandidateID)  \
        .join(Organisation, Organisation.OrganisationID == Interviews.OrganisationID)  \
        .join(Interviewer, Interviewer.InterviewerID == Interviews.InterviewerID)  \
        .join(Status, Status.StatusID == Interviews.StatusID)  \
        .filter(Candidate.CandidateID == candidate_id)  \
        .all()

        # Structure the response data
        dashboard_data = []
        for row in results:
            dashboard_data.append({
                "interview_id": row.interview_id,  # Include interview_id in response
                "organisation_name": row.organisation_name,
                "organisation_icon": row.organisation_icon,
                "interviewer_name": row.interviewer_name,
                "interviewer_icon": row.interviewer_icon,
                "interview_time": row.interview_time.strftime('%Y-%m-%d %H:%M:%S'),
                "status_description": row.status_description
            })

        return jsonify(dashboard_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500





# New Endpoint to Get Interview Status
@app.route('/api/get_interview_status', methods=['GET'])
def get_interview_status():
    interview_id = request.args.get('interview_id')
    if not interview_id:
        return jsonify({"error": "Missing interview_id"}), 400
    try:
        interview = Interviews.query.filter_by(InterviewID=interview_id).first()
        if not interview:
            return jsonify({"error": "Interview not found"}), 404
        status = Status.query.filter_by(StatusID=interview.StatusID).first()
        if not status:
            return jsonify({"error": "Status not found"}), 404
        return jsonify({"status_description": status.StatusDescription}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/uploads/<path:filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# New Endpoint to Get Interview Joining Details
@app.route('/api/get_interview_joining_details', methods=['GET'])
def get_interview_joining_details():
    interview_id = request.args.get('interview_id')
    if not interview_id:
        return jsonify({"error": "Missing interview_id"}), 400
    try:
        interview = Interviews.query.filter_by(InterviewID=interview_id).first()
        if not interview:
            return jsonify({"error": "Interview not found"}), 404
        return jsonify({"joining_details": interview.JoiningDetails}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/detect_virtual_machine', methods=['POST'])
def detect_virtual_machine():
    data = request.get_json()
    interview_id = data.get('interview_id')

    if not interview_id:
        return jsonify({"error": "Missing interview_id"}), 400

    try:
        # Check if the interview already has an entry in additional_cheat
        cheat_entry = additional_cheat.query.filter_by(I_id=interview_id).first()

        if cheat_entry:
            # If the entry exists, do nothing
            return jsonify({"message": "Virtual machine detection already recorded for this interview"}), 200

        # If no entry exists, create a new one with virtual_machine set to 1
        new_cheat_entry = additional_cheat(I_id=interview_id, virtual_machine=1)
        db.session.add(new_cheat_entry)
        db.session.commit()

        return jsonify({"message": "Virtual machine detection recorded"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/update_interview_status', methods=['POST'])
def update_interview_status():
    data = request.get_json()
    interview_id = data.get('interview_id')
    new_status_description = data.get('status_description')

    if not interview_id or not new_status_description:
        return jsonify({"error": "Missing parameters"}), 400

    try:
        # Fetch the interview entry to get the StatusID
        interview = Interviews.query.filter_by(InterviewID=interview_id).first()
        if not interview:
            return jsonify({"error": "Interview not found"}), 404

        # Get the Status entry using the StatusID from the interview
        status = Status.query.filter_by(StatusID=interview.StatusID).first()
        if not status:
            return jsonify({"error": "Status not found"}), 404

        # Update the StatusDescription
        status.StatusDescription = new_status_description
        db.session.commit()

        return jsonify({"message": "Status description updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)