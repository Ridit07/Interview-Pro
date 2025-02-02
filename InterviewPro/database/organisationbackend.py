from flask import Flask, request, jsonify, send_from_directory,session, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import check_password_hash
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
import os
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
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://con:pass@localhost/RecruitmentDB'
#app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://juridica_RecruitmentDB:x5YDGgWTtevxTD6sHbFE@localhost/RecruitmentDB'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Ridit%404321@localhost/RecruitmentDB'



app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config["SESSION_TYPE"] = "filesystem"  # Can also use redis, memcached, etc.
app.config['SESSION_COOKIE_HTTPONLY'] = True  # Secure, but ensure front-end doesn't need to read the cookie
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True if using HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Can adjust to 'None' if needed for cross-site requests
from datetime import timedelta
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

app.config['UPLOAD_FOLDER'] = '/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/database/static/uploads/saved_files/organisation_pics'

app.secret_key = 'kjdf@kuhf^#hfbiu7hrhi!93jkej&ejjsu7837'

db = SQLAlchemy(app)

# Define the Organisation model
# Allowed file extensions for company icon
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class Organisation(db.Model):
    __tablename__ = 'Organisation'
    OrganisationID = db.Column(db.Integer, primary_key=True)
    Name = db.Column(db.String(255))
    Email = db.Column(db.String(255), unique=True)
    Contact = db.Column(db.String(255))
    Password = db.Column(db.String(255))
    company_icon = db.Column(db.String(255))  # New column to store company icon path

    def __init__(self, name, email, contact, password, company_icon):
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


class Rubrics(db.Model):
    RubricID = db.Column(db.Integer, primary_key=True)
    Experience = db.Column(db.String(255))
    DifficultyLevel = db.Column(db.String(255))
    Notes = db.Column(db.Text)
    SelectedSkills = db.Column(db.Text)
    Role = db.Column(db.String(255))

class Status(db.Model):
    __tablename__ = 'Status'  # Make sure this matches the table name in MySQL
    StatusID = db.Column(db.Integer, primary_key=True)
    StatusDescription = db.Column(db.String(255))  # This is the column you're trying to query
    ReportPath = db.Column(db.String(255))
    JD_Path = db.Column(db.String(255))


class Interviews(db.Model):
    InterviewID = db.Column(db.Integer, primary_key=True)
    OrganisationID = db.Column(db.Integer, db.ForeignKey('Organisation.OrganisationID'))
    StatusID = db.Column(db.Integer, db.ForeignKey('Status.StatusID'))
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
    interviewer_picpath = db.Column(db.String(255))  # Add column for interviewer photo path

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)



ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/signup', methods=['POST'])
def signup():
    icon_file = request.files.get('company_icon')
    data = request.form

    if icon_file and not allowed_file(icon_file.filename):
        return jsonify({"error": "Invalid file format."}), 400

    name = data['first_name']
    email = data['email']
    contact = data['contact']
    password = data['password']
    password_hash = generate_password_hash(password)

    new_org = Organisation(name=name, email=email, contact=contact, password=password_hash, company_icon="")

    try:
        db.session.add(new_org)
        db.session.flush()

        if icon_file:
            filename = secure_filename(icon_file.filename)
            icon_filename = f"{new_org.OrganisationID}.{filename.rsplit('.', 1)[1].lower()}"
            relative_path = f"/uploads/saved_files/organisation_pics/{icon_filename}"
            full_path = os.path.join(app.config['UPLOAD_FOLDER'], icon_filename)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            icon_file.save(full_path)
            new_org.company_icon = relative_path

        db.session.commit()

        return jsonify({
            "message": "Signup successful!",
            "organisation_id": new_org.OrganisationID,
            "organisation_name": new_org.Name,
            "company_icon": new_org.company_icon
        }), 200
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

        return jsonify({
            "message": "Login successful!",
            "organisation_id": org.OrganisationID,
            "organisation_name": org.Name,
            "company_icon": org.company_icon  # Pass the icon back to the frontend
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
    # Parse form data
    data = request.form
    difficulty_level = data.get('difficultyLevel')
    notes = data.get('notes')
    selected_skills = data.get('selectedSkills')

    # Store data in session
    session['interview_difficulty_level'] = difficulty_level
    session['interview_notes'] = notes
    session['interview_selected_skills'] = selected_skills

    # Handle optional job description file upload
    jd_file = request.files.get('jobDescription')
    
    if jd_file and jd_file.filename:
        # Define allowed file extensions for job description upload
        JD_ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

        def jd_allowed_file(filename):
            return '.' in filename and filename.rsplit('.', 1)[1].lower() in JD_ALLOWED_EXTENSIONS

        # Validate file type
        if not jd_allowed_file(jd_file.filename):
            return jsonify({"error": "Only PDF, DOC, and DOCX files are allowed."}), 400

        # Validate file size (max 5MB)
        if jd_file.content_length > 5 * 1024 * 1024:
            return jsonify({"error": "File size should not exceed 5MB."}), 400

        # Define the upload directory specifically for job descriptions
        jd_upload_folder = '/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/database/static/uploads/saved_files/candidate_jd'
        os.makedirs(jd_upload_folder, exist_ok=True)

        # Secure the filename and handle duplicates by appending a counter if the file exists
        filename = secure_filename(jd_file.filename)
        filepath = os.path.join(jd_upload_folder, filename)

        if os.path.exists(filepath):
            name, extension = os.path.splitext(filename)
            counter = 1
            while os.path.exists(os.path.join(jd_upload_folder, f"{name}_{counter}{extension}")):
                counter += 1
            filename = f"{name}_{counter}{extension}"
            filepath = os.path.join(jd_upload_folder, filename)

        # Save the file and store its filename in the session
        jd_file.save(filepath)
        session['job_description_filename'] = filename
    else:
        # Clear any previous job description filename from the session if no file is uploaded
        session['job_description_filename'] = None

    # Return success message with received data and job description filename (if uploaded)
    logging.debug('Session modified: %s', session)

    return jsonify({
        "message": "Interview data saved successfully!",
        "received_data": {
            "Difficulty Level": difficulty_level,
            "Notes": notes,
            "Selected Skills": selected_skills,
            "Job Description Filename": session.get('job_description_filename', "No file uploaded")
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

    # Handle resume file upload if present
    if resume and allowed_file(resume.filename):
        resume_filename = secure_filename(resume.filename)
        resume.save(os.path.join('/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/database/static/uploads/saved_files/candidate_cv', resume_filename))
        session['resume_filename'] = resume_filename
    else:
        # If no resume is provided, don't set resume_filename in the session
        session['resume_filename'] = None

    # Store candidate details and hashed password in the session
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
    
    try:
        # Extract session data
        candidate_name = session['candidate_name']
        phone_number = session['phone_number']
        email = session['email']
        password = session['hashed_password']
        
        # Optional values
        resume_path = session.get('resume_filename', None)  # Use None if resume is not uploaded
        jd_path = session.get('job_description_filename', None)  # Use None if JD is not uploaded
        
        experience = session['selected_experience']
        difficulty_level = session['interview_difficulty_level']
        notes = session['interview_notes']
        selected_skills = session['interview_selected_skills']
        role = session['selected_role']
        organisation_id = session['organisation_id']

        # Calculate the interview DateTime
        interview_datetime = datetime.now() + timedelta(days=7)

        # Check if the candidate already exists based on email
        existing_candidate = Candidate.query.filter_by(Email=email).first()
        
        if existing_candidate:
            # Use existing CandidateID if candidate already exists
            candidate_id = existing_candidate.CandidateID
        else:
            # Insert a new candidate if they do not exist
            new_candidate = Candidate(
                Name=candidate_name,
                Email=email,
                Contact=phone_number,
                Password=password,
                ResumePath=resume_path  # Will be None if no resume was uploaded
            )
            db.session.add(new_candidate)
            db.session.flush()  # Flush to get the new CandidateID
            candidate_id = new_candidate.CandidateID

        # Insert into Rubrics table
        new_rubric = Rubrics(
            Experience=experience,
            DifficultyLevel=difficulty_level,
            Notes=notes,
            SelectedSkills=selected_skills,
            Role=role
        )
        db.session.add(new_rubric)
        db.session.flush()  # Flush to get the RubricID

        # Insert into Status table with optional JD_Path
        new_status = Status(
            StatusDescription='0', 
            ReportPath='abc',  # Placeholder for ReportPath; adjust as needed
            JD_Path=jd_path  # Will be None if no JD was uploaded
        )
        db.session.add(new_status)
        db.session.flush()  # Flush to get the StatusID

        # Insert into Interviews table, using the existing or new CandidateID
        new_interview = Interviews(
            OrganisationID=organisation_id, 
            StatusID=new_status.StatusID, 
            RubricID=new_rubric.RubricID, 
            CandidateID=candidate_id,  # Use existing or new CandidateID here
            InterviewerID=plan_id, 
            DateTime=interview_datetime,
            JoiningDetails='bcd'
        )
        db.session.add(new_interview)

        # Commit all transactions
        db.session.commit()

        return jsonify({"message": "All data submitted successfully!"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


    
from flask import make_response

from flask import jsonify, session, make_response

@app.route('/api/get_dashboard_data', methods=['GET'])
def get_dashboard_data():
    try:
        organisation_id = session.get('organisation_id')
        if not organisation_id:
            app.logger.error("No organisation logged in")
            return jsonify({"error": "No organisation logged in"}), 400

        # Fetch dashboard data including RubricID
        results = db.session.query(
            Candidate.Name,
            Candidate.Email,
            Candidate.Contact,
            Interviews.DateTime,
            #Interviews.InterviewerID,
            Interviewer.Price,
            Status.StatusDescription,
            Interviewer.Name,
            Interviewer.Email,
            Interviewer.Contact,
            Interviewer.interviewer_picpath,
            Interviewer.CompanyName,
            Interviews.RubricID,
              Interviews.InterviewID,  # Include RubricID here
              Candidate.ResumePath,
              Status.JD_Path
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
                "candidate_email": row[1],
                "candidate_contact": row[2],
                "datetime": row[3].strftime('%Y-%m-%d %H:%M:%S'),
                "price": row[4],
                "status_description": row[5],
                "interviewer_name": row[6],
                "interviewer_email": row[7],
                "interviewer_contact": row[8],
                "interviewer_picpath": row[9],
                "company_name": row[10],
                "RubricID": row[11] , # Add RubricID here
                "InterviewID" : row[12],
                "ResumePath": row[13],
                "JD_Path": row[14]
            }
            dashboard_data.append(data)

        return jsonify(dashboard_data)
    except Exception as e:
        app.logger.error(f"Error fetching dashboard data: {str(e)}")
        return jsonify({"error": str(e)}), 500



@app.route('/api/get_rubric_data', methods=['GET'])
def get_rubric_data():
    # Ensure the query parameter is 'RubricID'
    rubric_id = request.args.get('RubricID')

    if not rubric_id:
        return jsonify({"error": "RubricID is required"}), 400
    
    # Fetch the rubric data using the provided RubricID
    rubric = Rubrics.query.filter_by(RubricID=rubric_id).first()

    if not rubric:
        return jsonify({"error": "Rubric not found"}), 404

    return jsonify({
        "Experience": rubric.Experience,
        "DifficultyLevel": rubric.DifficultyLevel,
        "Notes": rubric.Notes,
        "SelectedSkills": rubric.SelectedSkills,
        "Role": rubric.Role
    }), 200

from PyPDF2 import PdfReader, PdfWriter
import shutil

from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
import io

@app.route('/api/download_report/<int:interview_id>', methods=['GET'])
def download_report(interview_id):
    try:
        # Fetch OrganisationID from Interviews table
        interview = Interviews.query.get(interview_id)
        if not interview:
            return jsonify({"error": "Interview not found"}), 404

        organisation = Organisation.query.get(interview.OrganisationID)
        if not organisation:
            return jsonify({"error": "Organisation not found"}), 404

        # Extract domain from Organisation email
        email = organisation.Email
        domain = email.split('@')[-1]

        # Path to the report
        report_path = f"/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/database/static/uploads/saved_files/interviewer_report/{interview_id}.pdf"
        if not os.path.exists(report_path):
            return jsonify({"error": "Report not found"}), 404

        # Temporary files
        temp_pdf_path = f"/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/database/static/uploads/saved_files/interviewer_report/{interview_id}_watermarked.pdf"
        temp_protected_path = f"/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/database/static/uploads/saved_files/interviewer_report/{interview_id}_protected.pdf"

        # Add watermark text indicating password
        packet = io.BytesIO()
        can = canvas.Canvas(packet, pagesize=letter)
        can.drawString(100, 50, f"Your domain name ({domain}) is the password to open this file.")
        can.save()
        packet.seek(0)

        # Create a watermark PDF
        watermark_pdf = PdfReader(packet)

        # Read the original PDF
        reader = PdfReader(report_path)
        writer = PdfWriter()

        # Add watermark to each page
        for page in reader.pages:
            page.merge_page(watermark_pdf.pages[0])
            writer.add_page(page)

        # Save the watermarked PDF
        with open(temp_pdf_path, "wb") as temp_pdf_file:
            writer.write(temp_pdf_file)

        # Password-protect the watermarked PDF
        reader = PdfReader(temp_pdf_path)
        writer = PdfWriter()

        for page in reader.pages:
            writer.add_page(page)

        writer.encrypt(domain)

        # Save the password-protected PDF
        with open(temp_protected_path, "wb") as temp_protected_file:
            writer.write(temp_protected_file)

        # Serve the password-protected PDF
        return send_file(temp_protected_path, as_attachment=True)

    except Exception as e:
        logging.error(f"Error downloading report: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up temporary files
        if os.path.exists(temp_pdf_path):
            os.remove(temp_pdf_path)


# Endpoint to download the AI report DOCX
@app.route('/api/download_ai_report/<int:interviewer_id>', methods=['GET'])
def download_ai_report(interviewer_id):
    try:
        # Construct the path to the AI report DOCX
        ai_report_path = f"/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/database/static/uploads/saved_files/interviewer_report/ailogfile_{interviewer_id}.docx"
        if os.path.exists(ai_report_path):
            return send_file(ai_report_path, as_attachment=True)
        else:
            return jsonify({"error": "AI report not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

from sqlalchemy import text

@app.route('/test_db')
def test_db():
    try:
        # Use SQLAlchemy's text function to execute raw SQL
        result = db.session.execute(text('SELECT 1'))
        return jsonify({"message": "Database connection successful!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
