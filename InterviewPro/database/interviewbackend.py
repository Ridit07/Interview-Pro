from flask import Flask, request, jsonify,session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS
from datetime import timedelta
import logging
from datetime import datetime

logging.basicConfig(level=logging.DEBUG)


app = Flask(__name__)
CORS(app, supports_credentials=True,origins='http://localhost:5173')


# app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)  # Example: Set session to last 7 days
# app.config['SESSION_COOKIE_NAME'] = 'flask_session'
# app.config['SESSION_COOKIE_HTTPONLY'] = True
# app.config['SESSION_COOKIE_SECURE'] = False  # Use True in production with HTTPS
# # app.config['REMEMBER_COOKIE_DURATION'] = timedelta(days=7)
# app.config['SESSION_COOKIE_DOMAIN'] = 'localhost'
# app.config['SESSION_COOKIE_PATH'] = '/'



# Database configuration
# Assuming password is 'Ridit@4321', it should be URL-encoded to 'Ridit%404321'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://con:pass@localhost/RecruitmentDB'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config["SESSION_TYPE"] = "filesystem"  # Can also use redis, memcached, etc.
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Secure, but ensure front-end doesn't need to read the cookie
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True if using HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Can adjust to 'None' if needed for cross-site requests
from datetime import timedelta
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)


app.secret_key = 'kjdf@kuhf^#hfbiu7hrhi!93jkej&ejjsu7837'

db = SQLAlchemy(app)

# Define the Organisation model
class Organisation(db.Model):
    __tablename__ = 'Organisation'
    OrganisationID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(255))
    Email = db.Column(db.String(255), unique=True)
    Contact = db.Column(db.String(255))
    Password = db.Column(db.String(255))

    def __init__(self, name, email, contact, password):
        self.Name = name
        self.Email = email
        self.Contact = contact
        self.Password = password

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
    Description = db.Column(db.String(255))
    ReportPath = db.Column(db.String(255))

class Interviews(db.Model):
    InterviewID = db.Column(db.Integer, primary_key=True)
    OrganisationID = db.Column(db.Integer, db.ForeignKey('Organisation.OrganisationID'))
    StatusID = db.Column(db.Integer, db.ForeignKey('status.StatusID'))
    RubricID = db.Column(db.Integer, db.ForeignKey('rubrics.RubricID'))
    CandidateID = db.Column(db.Integer, db.ForeignKey('candidate.CandidateID'))
    InterviewerID = db.Column(db.Integer, db.ForeignKey('Interviewer.InterviewerID'))
    DateTime = db.Column(db.DateTime)  # Add DateTime column
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

        return jsonify({
            "message": "Login successful!",
            "interviewer_id": interviewer.InterviewerID,
            "interviewer_name": interviewer.Name,
            "interviewer_email": interviewer.Email,
            "interviewer_company": interviewer.CompanyName
        }), 200
    else:
        return jsonify({"error": "Invalid email or password"}), 401
    

@app.route('/api/interviews', methods=['GET'])
def get_interviews():
    interviewer_id = session.get('interviewer_id')
    if not interviewer_id:
        return jsonify({'error': 'Not authenticated'}), 403

    interviews = db.session.query(Interviews, Candidate, Organisation, Status).\
        join(Candidate, Candidate.CandidateID == Interviews.CandidateID).\
        join(Organisation, Organisation.OrganisationID == Interviews.OrganisationID).\
        join(Status, Status.StatusID == Interviews.StatusID).\
        filter(Interviews.InterviewerID == interviewer_id).all()

    result = []
    for interview, candidate, organisation, status in interviews:
        result.append({
            'interview_id': interview.InterviewID,
            'candidate_name': candidate.Name,
            'candidate_contact': candidate.Contact,
            'candidate_email': candidate.Email,
            'company_name': organisation.Name,
            'company_email': organisation.Email,
            'datetime': interview.DateTime,
            'status_description': status.Description,
        })

    return jsonify(result)


from dateutil import parser
from pytz import utc


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

    # Parse the UTC datetime string and ensure it's set to UTC
    interview.DateTime = parser.parse(datetime_str).astimezone(utc)
    db.session.commit()

    return jsonify({'success': True})



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







if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)