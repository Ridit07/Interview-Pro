import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logo from '/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/src/assets/logo.png'; // Path to your logo

function adjustTimeByFiveHoursThirtyMinutes(date) {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(adjustedDate.getHours() + 5);
  adjustedDate.setMinutes(adjustedDate.getMinutes() + 30);
  return adjustedDate;
}

function toLocalTime(utcDateString) {
  if (!utcDateString) return null;
  const utcDate = new Date(utcDateString);
  return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
}

function formatToIST(date) {
  if (!date) return "TBD";
  return new Date(date).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
}

function Dashboard1() {
  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [scheduleDates, setScheduleDates] = useState({});
  const [nameSearch, setNameSearch] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterType, setFilterType] = useState("current");
  const [roleFilter, setRoleFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const defaultImage = "https://w7.pngwing.com/pngs/981/645/png-transparent-default-profile-united-states-computer-icons-desktop-free-high-quality-person-icon-miscellaneous-silhouette-symbol.png";
  const interviewerName = sessionStorage.getItem("interviewer_name");
  const interviewerPic = sessionStorage.getItem("interviewer_picpath");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/interviews", {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        const adjustedData = data.map((interview) => ({
          ...interview,
          datetime: interview.datetime ? toLocalTime(interview.datetime) : null
        }));
        setInterviews(adjustedData);
      })
      .catch((error) => console.error("Error fetching interviews:", error));
  }, []);

  useEffect(() => {
    let filteredData = interviews;
  
    if (filterType === "all") {
      filteredData = interviews;
    } else if (filterType === "current") {
      // Filter for status descriptions between 1 and 5
      filteredData = interviews.filter(
        (interview) =>
          parseInt(interview.status_description, 10) >= 0 &&
          parseInt(interview.status_description, 10) <= 5
      );
    } else if (filterType === "completed") {
      // Filter for status description equal to 6
      filteredData = interviews.filter(
        (interview) => parseInt(interview.status_description, 10) === 6
      );
    }
  
    if (roleFilter !== "all") {
      filteredData = filteredData.filter(
        (interview) => interview.role.toLowerCase() === roleFilter.toLowerCase()
      );
    }
  
    if (difficultyFilter !== "all") {
      filteredData = filteredData.filter(
        (interview) => interview.difficulty_level.toLowerCase() === difficultyFilter.toLowerCase()
      );
    }
  
    filteredData = filteredData.filter(
      (interview) =>
        interview.candidate_name.toLowerCase().includes(nameSearch.toLowerCase()) &&
        interview.company_name.toLowerCase().includes(companySearch.toLowerCase())
    );
  
    setFilteredInterviews(filteredData);
  }, [filterType, interviews, roleFilter, difficultyFilter, nameSearch, companySearch]);
  

  const getInterviewerPhoto = (picPath) => {
    return picPath ? `http://localhost:5000${picPath}` : defaultImage;
  };

  const handleStartInterview = (interview) => {
    // Store all the relevant data in sessionStorage
    sessionStorage.setItem("candidate_name", interview.candidate_name);
    sessionStorage.setItem("candidate_email", interview.candidate_email);
    sessionStorage.setItem("candidate_contact", interview.candidate_contact);
    sessionStorage.setItem("company_name", interview.company_name);
    sessionStorage.setItem("company_email", interview.company_email);
    sessionStorage.setItem("company_icon", interview.company_icon);
    sessionStorage.setItem("rubric_role", interview.role);
    sessionStorage.setItem("rubric_difficulty", interview.difficulty_level);
    sessionStorage.setItem("interview_id", interview.interview_id);
    // Fetch the rubric data using the correct interview_id
    fetch(`http://localhost:5000/api/get_rubric/${interview.interview_id}`)
      .then((res) => res.json())
      .then((rubricData) => {
        sessionStorage.setItem("rubric_experience", rubricData.Experience);
        sessionStorage.setItem("rubric_notes", rubricData.Notes);  // Storing the notes
        sessionStorage.setItem("rubric_selected_skills", rubricData.SelectedSkills);
  
        // Navigate to Preview1 page
        navigate("/preview1");
      })
      .catch((err) => console.error("Error fetching rubric:", err));
  };
  
  

  const handleDateChange = (date, interviewId) => {
    setScheduleDates((prevDates) => ({
      ...prevDates,
      [interviewId]: date,
    }));
    handleDateSubmit(interviewId, date);
  };

  const handleDateSubmit = (interviewId, date) => {
    if (date) {
      const adjustedDate = adjustTimeByFiveHoursThirtyMinutes(date);
      const istTime = adjustedDate.toISOString();

      fetch("http://localhost:5000/api/schedule_interview", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interview_id: interviewId,
          datetime: istTime,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            setInterviews((prevInterviews) =>
              prevInterviews.map((interview) =>
                interview.interview_id === interviewId
                  ? { ...interview, datetime: istTime }
                  : interview
              )
            );
          } else {
            console.error("Error scheduling interview:", data.error);
          }
        })
        .catch((error) => {
          console.error("Network error:", error);
          alert("Network error: " + error.message);
        });
    }
  };

  const handleReject = (interviewId) => {
    fetch("http://localhost:5000/api/reject_interview", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        interview_id: interviewId,
        status_description: -1,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setInterviews((prevInterviews) =>
            prevInterviews.map((interview) =>
              interview.interview_id === interviewId
                ? { ...interview, status_description: "-1" }
                : interview
            )
          );
        } else {
          console.error("Error rejecting interview:", data.error);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
        alert("Network error: " + error.message);
      });
  };

  const handleSortByTime = () => {
    const sortedInterviews = [...filteredInterviews].sort((a, b) => {
      const timeA = new Date(a.datetime);
      const timeB = new Date(b.datetime);
      return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
    });
    setFilteredInterviews(sortedInterviews);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };


  const handleSubmitReport = (interview) => {
    // Store all the relevant data in sessionStorage
    sessionStorage.setItem("candidate_name", interview.candidate_name);
    sessionStorage.setItem("candidate_email", interview.candidate_email);
    sessionStorage.setItem("candidate_contact", interview.candidate_contact);
    sessionStorage.setItem("company_name", interview.company_name);
    sessionStorage.setItem("company_email", interview.company_email);
    sessionStorage.setItem("company_icon", interview.company_icon);
    sessionStorage.setItem("rubric_role", interview.role);
    sessionStorage.setItem("rubric_difficulty", interview.difficulty_level);
    sessionStorage.setItem("interview_id", interview.interview_id);

    // Fetch the rubric data
    fetch(`http://localhost:5000/api/get_rubric/${interview.interview_id}`)
      .then((res) => res.json())
      .then((rubricData) => {
        sessionStorage.setItem("rubric_experience", rubricData.Experience);
        sessionStorage.setItem("rubric_notes", rubricData.Notes);
        sessionStorage.setItem("rubric_selected_skills", rubricData.SelectedSkills);

        // Navigate to the RatingPage
        navigate("/rating");
      })
      .catch((err) => console.error("Error fetching rubric:", err));
  };


  const getStatusButton = (interview) => {
    const currentTime = new Date();
    const interviewTime = interview.datetime ? new Date(interview.datetime) : null;
    const timeDifference = interviewTime ? (interviewTime - currentTime) / (1000 * 60) : 0;
  
    if (interview.status_description === "0") {
      return (
        <div className="flex items-center gap-x-2">
          <DatePicker
            selected={scheduleDates[interview.interview_id]}
            onChange={(date) => handleDateChange(date, interview.interview_id)}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Schedule"
            className="py-1 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => handleReject(interview.interview_id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Reject
          </button>
        </div>
      );
    } else if (interview.status_description === "1" || interview.status_description === "2") {
      if (timeDifference > 45 || interview.status_description === "2") {
        return (
          <button
            onClick={() => handleStartInterview(interview)} // Pass entire interview object here
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Start Interview
          </button>
        );
      } else {
        return <span className="text-green-600 font-semibold">Scheduled</span>;
      }
    } else if (interview.status_description === "-1") {
      return <span className="text-red-500 font-bold">Rejected</span>;
    } else if (interview.status_description === "3" || interview.status_description === "4") {
      return (
        <button
        onClick={() => handleSubmitReport(interview)} 
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Submit Report
        </button>
      );
    } 
    else {
      return <span className="text-green-600 font-semibold">Completed</span>;
    }
  };
  

  const Dropdown = ({ label, options, selected, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [dropdownRef]);

    const handleOptionClick = (option) => {
      onSelect(option);
      setIsOpen(false);
    };

    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {label === "all" ? "All" : label.charAt(0).toUpperCase() + label.slice(1)} 
          <svg
            className="ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.354a.75.75 0 111.14.976l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {isOpen && (
          <div
            className="origin-top-left absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 overflow-auto max-h-40 z-10"
          >
            <ul className="py-1">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleOptionClick(option)}
                  className={`cursor-pointer select-none relative py-2 px-3 hover:bg-gray-100 ${
                    selected === option ? 'bg-gray-200 font-semibold' : ''
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center h-[10vh] px-6 bg-white shadow">
          {/* Left Side - Logo */}
          <div>
            <Link to="/">
              <img 
                src={logo} 
                alt="Company Logo" 
                className="w-24 h-24 object-contain cursor-pointer"  
              />
            </Link>
          </div>

          {/* Right Side - Interviewer Info */}
          <div className="flex items-center gap-x-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-800 capitalize">
                Hi, {interviewerName}!
              </h1>
            </div>
            <img
              className="object-cover w-16 h-16 rounded-full border-2 border-gray-300"
              src={getInterviewerPhoto(interviewerPic)}
              alt="Interviewer"
            />
          </div>
        </div>

        {/* Filter Type Section */}
        <div className="px-6">
          <h1 className="mb-4 p-4 text-xl font-semibold text-gray-700 bg-gray-100 rounded-lg flex space-x-4">
            <span
              className={`cursor-pointer px-3 py-1 rounded ${
                filterType === "all" ? "bg-blue-500 text-white" : "hover:bg-blue-100"
              }`}
              onClick={() => setFilterType("all")}
            >
              All
            </span>
            <span
              className={`cursor-pointer px-3 py-1 rounded ${
                filterType === "current" ? "bg-blue-500 text-white" : "hover:bg-blue-100"
              }`}
              onClick={() => setFilterType("current")}
            >
              Current
            </span>
            <span
              className={`cursor-pointer px-3 py-1 rounded ${
                filterType === "completed" ? "bg-blue-500 text-white" : "hover:bg-blue-100"
              }`}
              onClick={() => setFilterType("completed")}
            >
              Completed
            </span>
          </h1>
        </div>
      </div>

      {/* Search and Filter Section */}
      <section className="px-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search Inputs */}
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by Name"
              className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by Company"
              className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <Dropdown
              label="Role"
              options={["all", "frontend", "backend", "fullstack", "datascience", "appdev"]}
              selected={roleFilter}
              onSelect={setRoleFilter}
            />
            <Dropdown
              label="Difficulty"
              options={["all", "easy", "medium", "difficult"]}
              selected={difficultyFilter}
              onSelect={setDifficultyFilter}
            />
            <button
              className="py-2 px-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleSortByTime}
            >
              Sort by Interview Time ({sortOrder === "asc" ? "Ascending" : "Descending"})
            </button>
          </div>
        </div>
      </section>

      {/* Interviews Table Section */}
      <section className="px-6">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow-md rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Name Column */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Name
                    </th>

                    {/* Company Column */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Company
                    </th>

                    {/* Role Column */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Role
                    </th>

                    {/* Difficulty Level Column */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Difficulty Level
                    </th>

                    {/* Time Column */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Time
                    </th>

                    {/* Action Column */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInterviews.map((interview) => (
                    <tr key={interview.interview_id}>
                      {/* Name Cell */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {interview.candidate_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {interview.candidate_contact}
                        </div>
                        <div className="text-sm text-gray-500">
                          {interview.candidate_email}
                        </div>
                      </td>

                      {/* Company Cell */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={`http://localhost:5000${interview.company_icon}`}
                            className="object-cover w-10 h-10 rounded-full mr-3"
                            alt={interview.company_name}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {interview.company_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {interview.company_email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Cell */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Removed the blue box for Role */}
                        <span className="text-sm font-semibold">
                          {interview.role.charAt(0).toUpperCase() + interview.role.slice(1)}
                        </span>
                      </td>

                      {/* Difficulty Level Cell */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Kept the colored box for Difficulty Level */}
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          interview.difficulty_level.toLowerCase() === 'easy' ? 'bg-green-100 text-green-800' :
                          interview.difficulty_level.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {interview.difficulty_level.charAt(0).toUpperCase() + interview.difficulty_level.slice(1)}
                        </span>
                      </td>

                      {/* Time Cell */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {interview.datetime ? formatToIST(interview.datetime) : "TBD"}
                        </div>
                      </td>

                      {/* Action Cell */}
                      <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusButton(interview)}

                      </td>
                    </tr>
                  ))}
                  {filteredInterviews.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No interviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard1;
