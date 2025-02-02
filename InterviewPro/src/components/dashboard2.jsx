import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdDownload } from "react-icons/md";
import logo from '/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/src/assets/logo.png';
import { Link, useNavigate } from "react-router-dom";

function Dashboard1() {
  const [dashboardData, setDashboardData] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const candidateName = localStorage.getItem("candidate_name");

  // Fetch dashboard data from the server
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/get_candidate_dashboard", {
          withCredentials: true,
        });
        setDashboardData(response.data);
      } catch (error) {
        setError("Failed to load dashboard data.");
      }
    };
    fetchDashboardData();
  }, []);

  // Helper function to determine if "Start" button should appear
  const isInterviewStartingSoon = (interviewTime) => {
    const now = new Date();
    const interviewDateTime = new Date(interviewTime);
    const timeDiff = (interviewDateTime - now) / 60000; // Time difference in minutes
    return timeDiff < 45 && timeDiff > 0;
  };

  // Navigation to preview2 and setting session storage
  const handleStartInterview = (interview) => {
    sessionStorage.setItem("status_description", interview.status_description);
    sessionStorage.setItem("interview_id", interview.interview_id);
    console.log(interview.interview_id);
    navigate("/preview2");
  };

  return (
    <>
      <nav className="relative bg-white shadow dark:bg-white">
        <div className="h-[10vh] p-2">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div className="flex items-center">
              <Link to="/home">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-24 h-24 object-contain cursor-pointer"
                />
              </Link>
            </div>
            <div className="flex items-center gap-x-2">
              <h1 className="text-xl font-semibold text-black-800 capitalize dark:text-black-800">
                Hi, {candidateName}
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="space-y-6">
        <section className="mt-6">
          <div className="flex flex-col">
            {dashboardData.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-black-800">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-2">Organisation</th>
                    <th className="text-left px-4 py-2">Interviewer</th>
                    <th className="text-left px-4 py-2">Date & Time</th>
                    <th className="text-left px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.map((interview, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4">
                        <img
                          src={`http://localhost:5001/static${interview.organisation_icon}`}
                          alt="Org Icon"
                          className="inline-block w-10 h-10 mr-2"
                        />
                        {interview.organisation_name}
                      </td>
                      <td className="px-4 py-4">
                        <img
                          src={`http://localhost:5001/static${interview.interviewer_icon}`}
                          alt="Interviewer Icon"
                          className="inline-block w-10 h-10 mr-2"
                        />
                        {interview.interviewer_name}
                      </td>
                      <td className="px-4 py-4">{interview.interview_time}</td>
                      <td className="px-4 py-4">
                        {interview.status_description === "-1" ? (
                          <span className="text-red-500">Rejected</span>
                        ) : interview.status_description === "0" ? (
                          <span className="text-gray-500">Waiting</span>
                        ) : interview.status_description === "1" &&
                          isInterviewStartingSoon(interview.interview_time) ? (
                          <button
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                            onClick={() => handleStartInterview(interview)}
                          >
                            Start Interview
                          </button>
                        ) : interview.status_description === "2" ? (
                          <button
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                            onClick={() => handleStartInterview(interview)}
                          >
                            Start Interview
                          </button>
                        ) : interview.status_description > "2" ? (
                          <span className="text-gray-500">Completed</span>
                        ) : (
                          <span>Scheduled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center">No interviews found.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default Dashboard1;
