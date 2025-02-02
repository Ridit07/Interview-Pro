import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  TextField,
  Button,
  Grid,
  CircularProgress,
  createTheme,
  ThemeProvider,
} from "@mui/material";

// Create a theme instance
const theme = createTheme();

export default function RatingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [overallRating, setOverallRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [jobFitRating, setJobFitRating] = useState(5);
  const [skillRatings, setSkillRatings] = useState({});
  const [skillRemarks, setSkillRemarks] = useState({});
  const [overallRemarks, setOverallRemarks] = useState("");
  const [communicationRemarks, setCommunicationRemarks] = useState("");
  const [jobFitRemarks, setJobFitRemarks] = useState("");
  const [notes, setNotes] = useState("");
  const [statusDescription, setStatusDescription] = useState(null);

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false); // Control Submit button state

  const [interviewerData, setInterviewerData] = useState({
    interviewer_name: "",
    interviewer_email: "",
    company: "",
    pic_path: "",
  });

  const [candidateData, setCandidateData] = useState({
    candidate_name: "",
    candidate_email: "",
    candidate_contact: "",
    company_name: "",
    company_email: "",
    rubric_role: "",
    rubric_difficulty: "",
    rubric_experience: "",
    rubric_notes: "",
    rubric_selected_skills: [],
    interview_id: "",
  });


  useEffect(() => {
    // Poll status every 5 seconds
    const checkStatus = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/get_status/${sessionStorage.getItem("interview_id")}`);
        const data = await response.json();
        setStatusDescription(data.status_description);
  
        if (data.status_description === "4") {
          setIsSubmitEnabled(true);
        } else {
          setIsSubmitEnabled(false);
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };
  
    const intervalId = setInterval(checkStatus, 5000);
    checkStatus(); // Initial call immediately upon mount
  
    return () => clearInterval(intervalId); // Clean up interval on unmount
  }, []); // Run this effect only once on mount
  

  useEffect(() => {
    const fetchData = async () => {
      // Fetch candidate data from session storage
      setCandidateData({
        candidate_name: sessionStorage.getItem("candidate_name") || "John Doe",
        candidate_email: sessionStorage.getItem("candidate_email") || "johndoe@example.com",
        candidate_contact: sessionStorage.getItem("candidate_contact") || "1234567890",
        company_name: sessionStorage.getItem("company_name") || "ACME Inc.",
        company_email: sessionStorage.getItem("company_email") || "info@acmeinc.com",
        rubric_role: sessionStorage.getItem("rubric_role") || "Developer",
        rubric_difficulty: sessionStorage.getItem("rubric_difficulty") || "Intermediate",
        rubric_experience: sessionStorage.getItem("rubric_experience") || "3 years",
        rubric_notes: sessionStorage.getItem("rubric_notes") || "Good candidate for the role",
        rubric_selected_skills: (sessionStorage.getItem("rubric_selected_skills") || "React,Node.js,TypeScript").split(","),
        interview_id: sessionStorage.getItem("interview_id") || "INT123",
      });

      // Fetch interviewer details based on interview ID
      try {
        const response = await fetch(`http://localhost:5000/api/get_interviewer_details/${sessionStorage.getItem("interview_id")}`);
        const data = await response.json();
        setInterviewerData({
          interviewer_name: data.name,
          interviewer_email: data.email,
          company: data.company_name,
          pic_path: `http://localhost:5000/static${data.pic_path}`,
        });
      } catch (error) {
        console.error("Error fetching interviewer data:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);



  const handleSubmit = () => {
    if (isSubmitEnabled) {
     
    // Collect ratings data in the required format
    const ratings = [
      {
        category: "Overall",
        rating: overallRating,
        remarks: overallRemarks || "N/A",
      },
      {
        category: "Communication Skills",
        rating: communicationRating,
        remarks: communicationRemarks || "N/A",
      },
      {
        category: "Job Fit",
        rating: jobFitRating,
        remarks: jobFitRemarks || "N/A",
      },
      ...candidateData.rubric_selected_skills.map((skill) => ({
        category: skill,
        rating: skillRatings[skill] || 0,
        remarks: skillRemarks[skill] || "N/A",
      })),
    ];
  
    // Create the payload to send to the backend, including additional notes
    const payload = {
      interview_id: candidateData.interview_id,
      candidateData,
      interviewerData,
      ratings,
      additional_notes: notes,  // Include the additional notes here
    };
  
    // Send the request to save the PDF
    fetch("http://localhost:5000/api/save_pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // navigate("/thankyou");
        } else {
          console.error("Failed to save PDF:", data.error);
        }
      })
      .catch((error) => console.error("Error saving PDF:", error));
    }
    else{
      alert("Please wait until the video is fully uploaded.");

    }
};

  

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: 3 }}>
        <Typography variant="h3" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Candidate Evaluation
        </Typography>
        <Grid container spacing={3}>
          {/* Left Half - Candidate Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>Candidate Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Name:</Typography>
                    <Typography variant="body1">{candidateData.candidate_name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Email:</Typography>
                    <Typography variant="body1">{candidateData.candidate_email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Contact:</Typography>
                    <Typography variant="body1">{candidateData.candidate_contact}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Company:</Typography>
                    <Typography variant="body1">{candidateData.company_name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Role:</Typography>
                    <Typography variant="body1">{candidateData.rubric_role}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Experience:</Typography>
                    <Typography variant="body1">{candidateData.rubric_experience}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Difficulty:</Typography>
                    <Typography variant="body1">{candidateData.rubric_difficulty}</Typography>
                  </Grid>
                </Grid>
                <Typography variant="subtitle2" sx={{ mt: 2 }}>Notes:</Typography>
                <Typography variant="body1">{candidateData.rubric_notes}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Half - Rating Section */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>Rate the Candidate</Typography>
                <Box sx={{ my: 4 }}>
                  <Typography variant="subtitle1">Overall Rating</Typography>
                  <Slider value={overallRating} min={1} max={10} step={1} onChange={(_, value) => setOverallRating(value)} valueLabelDisplay="auto" />
                  <TextField label="Remarks" variant="outlined" fullWidth sx={{ mt: 2 }} value={overallRemarks} onChange={(e) => setOverallRemarks(e.target.value)} />
                </Box>
                <Box sx={{ my: 4 }}>
                  <Typography variant="subtitle1">Communication Skills</Typography>
                  <Slider value={communicationRating} min={1} max={10} step={1} onChange={(_, value) => setCommunicationRating(value)} valueLabelDisplay="auto" />
                  <TextField label="Remarks" variant="outlined" fullWidth sx={{ mt: 2 }} value={communicationRemarks} onChange={(e) => setCommunicationRemarks(e.target.value)} />
                </Box>
                <Box sx={{ my: 4 }}>
                  <Typography variant="subtitle1">Job Fit</Typography>
                  <Slider value={jobFitRating} min={1} max={10} step={1} onChange={(_, value) => setJobFitRating(value)} valueLabelDisplay="auto" />
                  <TextField label="Remarks" variant="outlined" fullWidth sx={{ mt: 2 }} value={jobFitRemarks} onChange={(e) => setJobFitRemarks(e.target.value)} />
                </Box>
                {candidateData.rubric_selected_skills.map((skill) => (
                  <Box key={skill} sx={{ my: 4 }}>
                    <Typography variant="subtitle1">{skill}</Typography>
                    <Slider value={skillRatings[skill] || 5} min={1} max={10} step={1} onChange={(_, value) => setSkillRatings((prev) => ({ ...prev, [skill]: value }))} valueLabelDisplay="auto" />
                    <TextField label="Remarks" variant="outlined" fullWidth sx={{ mt: 2 }} value={skillRemarks[skill] || ""} onChange={(e) => 
                      setSkillRemarks((prev) => ({ ...prev, [skill]: e.target.value }))} />
                  </Box>
                ))}
                <Box sx={{ my: 4 }}>
                  <Typography variant="subtitle1">Additional Notes</Typography>
                  <TextField multiline rows={4} variant="outlined" fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} />
                </Box>
                <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} size="large" disabled={!isSubmitEnabled}>
                  Submit Evaluation
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}