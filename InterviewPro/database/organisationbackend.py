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


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/signup', methods=['POST'])
def signup():
    
    data = request.get_json()
    name = data['name']
    email = data['email']
    contact = data['contact']
    password = data['password']

    # Create a new Organisation instance
    password_hash = generate_password_hash(password)
    new_org = Organisation(name, email, contact, password_hash)

    try:
        db.session.add(new_org)
        db.session.commit()
        return jsonify({"message": "Signup successful!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    org = Organisation.query.filter_by(Email=email).first()
    if org and check_password_hash(org.Password, password):
        session['organisation_id'] = org.OrganisationID
        session['organisation_name'] = org.Name
        session['organisation_email'] = org.Email
        session['organisation_contact'] = org.Contact
        

        return jsonify({
        "message": "Login successful!",
        "organisation_id": org.OrganisationID,
        "organisation_name": org.Name,  # Ensure this key is correct
        "organisation_email": org.Email,  # Ensure this key is correct
        "organisation_contact": org.Contact  # Ensure this key is correct
        }), 200
        
    else:
        return jsonify({"error": "Invalid username or password"}), 401
    


@app.route('/api/save_selected_role', methods=['POST'])
def save_selected_role():
    data = request.get_json()
    role_name = data.get('role')

    # Save the selected role in a session variable
    session['selected_role'] = role_name
   # session.modified = True
    print("Current session data: ", session)

    return jsonify({"message": f"Role '{role_name}' saved successfully!"}), 200


@app.route('/api/save_selected_experience', methods=['POST'])
def save_selected_experience():
    data = request.get_json()
    experience = data.get('experience')
    
    if experience:
        session['selected_experience'] = experience
      #  session.modified = True
        print("Current session data: ", session)

        return jsonify({"message": "Experience saved successfully!", "selected_experience": experience}), 200
    else:
        return jsonify({"error": "Experience not provided in request"}), 400
    

@app.route('/api/save_interview_data', methods=['POST'])
def save_interview_data():
    data = request.get_json()
    difficulty_level = data.get('difficultyLevel')
    notes = data.get('notes')
    selected_skills = data.get('selectedSkills')

    # Store data in session
    session['interview_difficulty_level'] = difficulty_level
    session['interview_notes'] = notes
    session['interview_selected_skills'] = selected_skills
   # session.modified = True

    #skills_string = ", ".join(selected_skills)

    # Return success message with data
    print("Current session data: ", session)
    logging.debug('Session modified: %s', session)

    return jsonify({
        "message": "Interview data saved successfully!",
        "received_data": {
            "Difficulty Level": difficulty_level,
            "Notes": notes,
            "Selected Skills": selected_skills
        }
    }), 200

@app.route('/api/save_candidate_data', methods=['POST'])
def save_candidate_data():
    candidate_name = request.form.get('candidateName')
    phone_number = request.form.get('phoneNumber')
    email = request.form.get('email')
    password = request.form.get('password')  # Retrieve the password
    hashed_password = generate_password_hash(password)  # Hash the password
    resume = request.files.get('resume')

    if resume and allowed_file(resume.filename):
        resume_filename = secure_filename(resume.filename)
        resume.save(os.path.join('/Users/riditjain/Desktop/saved_files', resume_filename))
        session['resume_filename'] = resume_filename
    else:
        return jsonify({"error": "No valid resume file provided"}), 400

    # Store hashed password and other details in the session or database
    session['candidate_name'] = candidate_name
    session['phone_number'] = phone_number
    session['email'] = email
    session['hashed_password'] = hashed_password
    session.modified = True
    logging.debug('Session accessed: %s', session)

    print("Current session data: ", session)
    return jsonify({
        "message": "Candidate data saved successfully!",
        "data": {
            "Candidate Name": session['candidate_name'],
            "Phone Number": phone_number,
            "Email": email,
            "Password": hashed_password,  # Optionally include hashed password in the response for debug
            "Resume Filename": session.get('resume_filename', 'None provided')
        }
    }), 200

from datetime import datetime, timedelta

@app.route('/api/select_plan', methods=['POST'])
def select_plan():
    print("Current session data: ", session)

    data = request.get_json()
    plan_id = data['planId']
    #print("Current session data: ", session)
    # You might want to do something with the plan_id, like storing it in the database
    #print("Plan selected:", plan_id)
#    return jsonify({"message": "Plan selected successfully!", "planId": plan_id})

    #session['plan_id'] = plan_id
   # print("Session variables set: ", session['candidate_name'])  # Debug: Check if this prints correctly
    
    try:
        # Extract session data
        candidate_name = session['candidate_name']
        phone_number = session['phone_number']
        email = session['email']
        password = session['hashed_password']
        resume_path = session['resume_filename']
        experience = session['selected_experience']
        difficulty_level = session['interview_difficulty_level']
        notes = session['interview_notes']
        selected_skills = session['interview_selected_skills']
        role = session['selected_role']
        organisation_id = session['organisation_id']

        # Calculate the interview DateTime
        interview_datetime = datetime.now() + timedelta(days=7)

        # Insert into Candidate table
        new_candidate = Candidate(Name=candidate_name, Email=email, Contact=phone_number, Password=password, ResumePath=resume_path)
        db.session.add(new_candidate)
        db.session.flush()  # Flush to get the CandidateID

        # Insert into Rubrics table
        new_rubric = Rubrics(Experience=experience, DifficultyLevel=difficulty_level, Notes=notes, SelectedSkills=selected_skills, Role=role)
        db.session.add(new_rubric)
        db.session.flush()  # Flush to get the RubricID

        # Insert into Status table
        new_status = Status(Description='0', ReportPath='abc')
        db.session.add(new_status)
        db.session.flush()  # Flush to get the StatusID

        # Insert into Interviews table
        new_interview = Interviews(
            OrganisationID=organisation_id, 
            StatusID=new_status.StatusID, 
            RubricID=new_rubric.RubricID, 
            CandidateID=new_candidate.CandidateID, 
            InterviewerID=plan_id, 
            DateTime=interview_datetime,  # Set the DateTime
            JoiningDetails='bcd'
        )
        db.session.add(new_interview)

        db.session.commit()

        return jsonify({"message": "All data submitted successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

    
from flask import make_response

from flask import jsonify, session, make_response

@app.route('/api/get_dashboard_data', methods=['GET'])
def get_dashboard_data():
    organisation_id = session.get('organisation_id')
    if not organisation_id:
        app.logger.error("No organisation logged in")
        return jsonify({"error": "No organisation logged in"}), 400

    try:
        results = db.session.query(
            Candidate.Name,
            Interviews.DateTime,
            Interviewer.Price,
            Status.Description,
            Interviewer.Name,  # Adding Interviewer Name
            Interviewer.CompanyName  # Adding Interviewer Company Name
        ).join(
            Interviews, Candidate.CandidateID == Interviews.CandidateID
        ).join(
            Interviewer, Interviews.InterviewerID == Interviewer.InterviewerID
        ).join(
            Status, Interviews.StatusID == Status.StatusID
        ).filter(
            Interviews.OrganisationID == organisation_id
        ).all()

        dashboard_data = []
        for row in results:
            data = {
                "candidate_name": row[0],
                "datetime": row[1].strftime('%Y-%m-%d %H:%M:%S'),
                "price": row[2],
                "status_description": row[3],
                "interviewer_name": row[4],  # Adding Interviewer Name
                "company_name": row[5]  # Adding Interviewer Company Name
            }
            dashboard_data.append(data)

        response = make_response(jsonify(dashboard_data))
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'

        app.logger.debug("Dashboard data fetched successfully")
        return response
    except Exception as e:
        app.logger.error(f"Error fetching dashboard data: {str(e)}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
