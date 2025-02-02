import React, { useEffect, useState, useRef } from "react";
import "./dashboard.css";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { FaChevronDown, FaSort, FaSortUp, FaSortDown } from "react-icons/fa"; 
import ReqInterview1 from './ReqInterview1';
import { Link , useNavigate} from "react-router-dom"; 
import logo from '/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/src/assets/logo.png';
import axios from 'axios';

function Dashboard6() {
  const navigate = useNavigate(); 

  const [loading, setLoading] = useState(false);

  const [organisationName, setOrganisationName] = useState("");
  const [organisationEmail, setOrganisationEmail] = useState("");
  const [organisationIcon, setOrganisationIcon] = useState("");

  const [organisationContact, setOrganisationContact] = useState("");
  const [dashboardData, setDashboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  
  // Search States
  const [candidateSearch, setCandidateSearch] = useState("");
  const [interviewerSearch, setInterviewerSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  
  // Filter Type State
  const [filterType, setFilterType] = useState("all"); // all, current, completed
  
  // Sort States
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Rubric States
  const [rubricData, setRubricData] = useState({}); // State to hold rubric data for multiple RubricIDs
  const [visibleRubric, setVisibleRubric] = useState(null); // Track visible rubric

  const defaultImage = "https://via.placeholder.com/150";
  const backendBaseUrl = "http://localhost:5000";
  const rubricBoxRef = useRef(null); // Reference for rubric box

  useEffect(() => {
    const orgName = localStorage.getItem("organisation_name");
    const orgIcon = localStorage.getItem("organisation_icon");

    if (orgName) setOrganisationName(orgName);
    if (orgIcon) setOrganisationIcon(`${backendBaseUrl}/static${orgIcon}`);

    fetch("http://localhost:5000/api/get_dashboard_data", {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setDashboardData(data);
          setFilteredData(data);
        }
      })
      .catch((error) => {
        console.error('Error fetching dashboard data:', error);
        setError(error.toString());
      });
  }, []);

  useEffect(() => {
    // Event listener to close the rubric box if clicked outside
    const handleClickOutside = (event) => {
      if (rubricBoxRef.current && !rubricBoxRef.current.contains(event.target)) {
        setVisibleRubric(null); // Close rubric when clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCheckATS = async (jdPath, resumePath) => {
    setLoading(true); 

    try {
      // Send JD_Path and ResumePath to the backend
      await axios.post('http://localhost:5006/api/copy-files', {
        jdPath: jdPath,
        resumePath: resumePath,
      });
      sessionStorage.setItem("jdPath", jdPath);
      sessionStorage.setItem("resumePath", resumePath);
  
      navigate("/checkats");
    } catch (error) {
      console.error("Error in Check ATS process:", error);
    } finally {
      setLoading(false); 
    }
  };


  useEffect(() => {
    // Filter and sort data based on search, filter, and sort criteria
    let filtered = [...dashboardData];
  
    // Filter Type
    if (filterType === "current") {
      // Current status includes status_description "1" to "5"
      filtered = filtered.filter(item => ["0","1", "2", "3", "4", "5"].includes(item.status_description));
    } else if (filterType === "completed") {
      // Completed status includes only status_description "6"
      filtered = filtered.filter(item => item.status_description === "6");
    }
    // For 'all', we do not filter by status_description
  
    // Search by Candidate Name
    if (candidateSearch) {
      filtered = filtered.filter(item =>
        item.candidate_name.toLowerCase().includes(candidateSearch.toLowerCase())
      );
    }
  
    // Search by Interviewer Name
    if (interviewerSearch) {
      filtered = filtered.filter(item =>
        item.interviewer_name.toLowerCase().includes(interviewerSearch.toLowerCase())
      );
    }
  
    // Filter by Company Name
    if (companyFilter !== "all") {
      filtered = filtered.filter(item => item.company_name.toLowerCase() === companyFilter.toLowerCase());
    }
  
    // Sort Data
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === "price") {
          return sortConfig.direction === "asc" ? a.price - b.price : b.price - a.price;
        } else {
          const dateA = new Date(a.datetime);
          const dateB = new Date(b.datetime);
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        }
      });
    }
  
    setFilteredData(filtered);
  }, [candidateSearch, interviewerSearch, companyFilter, filterType, sortConfig, dashboardData]);
  

  const downloadReport = (InterviewID) => {
    fetch(`http://localhost:5000/api/download_report/${InterviewID}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error("Report not found");
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `interviewer_report_${InterviewID}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading report:", error));
  };
  
  const downloadAiReport = (InterviewID) => {
    fetch(`http://localhost:5000/api/download_ai_report/${InterviewID}`, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error("AI Report not found");
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ailogfile_${InterviewID}.docx`;
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error("Error downloading AI report:", error));
  };
  

  const getStatusText = (statusDescription, InterviewID) => {
    if (statusDescription === "0") {
      return <span className="text-green-500 font-bold">Confirmed</span>;
    } else if (statusDescription === "1") {
      return <span className="text-blue-500 font-bold">Fixed</span>;
    } else if (statusDescription === "-1") {
      return <span className="text-red-500 font-bold">Rejected</span>;
    } else if (["2", "3", "4", "5"].includes(statusDescription)) {
      return <span className="text-yellow-500 font-bold">In Progress</span>;
    } else if (statusDescription === "6") {
      return (
        <div className="flex flex-col space-y-2"> {/* Use flex-col and space-y-2 for line break */}
          <button
            onClick={() => downloadReport(InterviewID)}
            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Download Report<br></br>(Domain name is the password)
          </button>
          <button
            onClick={() => downloadAiReport(InterviewID)}
            className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            Download AI Report
          </button>
        </div>
      );
    }
  };
  

  const getInterviewerPhoto = (picPath) => {
    return picPath ? `${backendBaseUrl}/static${picPath}` : defaultImage;
  };

  // Function to fetch rubric data for a specific RubricID and store it in the state
  const fetchRubricData = (rubricId) => {
    if (!rubricId) {
      console.error("RubricID is undefined");
      return;
    }

    // If rubric data already fetched, just toggle visibility
    if (rubricData[rubricId]) {
      setVisibleRubric(visibleRubric === rubricId ? null : rubricId);
      return;
    }

    fetch(`http://localhost:5000/api/get_rubric_data?RubricID=${rubricId}`, {
      credentials: 'include',
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          console.error("Error fetching rubric data:", data.error);
        } else {
          // Store rubric data in state using RubricID as key
          setRubricData((prevData) => ({
            ...prevData,
            [rubricId]: data  // Update rubric data for the specific RubricID
          }));
          setVisibleRubric(rubricId); // Set visible rubric
        }
      })
      .catch((error) => console.error("Error fetching rubric data:", error));
  };

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get unique company names for the dropdown
  const getUniqueCompanies = () => {
    const companies = dashboardData.map(item => item.company_name);
    return ["all", ...Array.from(new Set(companies))];
  };

  return (
    <>
      {/* Header Section */}
      <nav className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="h-[10vh] flex justify-between items-center">
            {/* Logo */}
            <div>
              <Link to="/home">
              <img 
  src={logo} 
  alt="Logo" 
  className="w-24 h-24 object-contain cursor-pointer" />

              </Link>
            </div>
            {/* Organisation Info */}
            <div className="flex items-center gap-x-4">
              <h1 className="text-xl font-semibold text-gray-800 capitalize">
                Hi, {organisationName}!
              </h1>
              <img
                className="object-cover w-16 h-16 rounded-full border-2 border-gray-300"
                src={organisationIcon || defaultImage}
                alt="Organisation"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Filter Type Section */}
      <div className="bg-gray-100 py-4">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 justify-start">
            <button
              className={`px-4 py-2 border border-gray-300 rounded ${
                filterType === "all" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setFilterType("all")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 border border-gray-300 rounded ${
                filterType === "current" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setFilterType("current")}
            >
              Current
            </button>
            <button
              className={`px-4 py-2 border border-gray-300 rounded ${
                filterType === "completed" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setFilterType("completed")}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <section className="bg-gray-100 py-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Inputs */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <input
                type="text"
                placeholder="Search by Candidate Name"
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
              />
              <input
                type="text"
                placeholder="Search by Interviewer Name"
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={interviewerSearch}
                onChange={(e) => setInterviewerSearch(e.target.value)}
              />
            </div>

            {/* Company Dropdown and Sort Buttons */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              {/* Company Dropdown */}
              <div className="relative inline-block text-left">
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
                >
                  {getUniqueCompanies().map((company, index) => (
                    <option key={index} value={company}>
                      {company.charAt(0).toUpperCase() + company.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort by Date and Time */}
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => handleSort("datetime")}
              >
                Sort by Date & Time
                {sortConfig.key === "datetime" ? (
                  sortConfig.direction === "asc" ? <FaSortUp className="ml-2" /> : <FaSortDown className="ml-2" />
                ) : (
                  <FaSort className="ml-2" />
                )}
              </button>

              {/* Sort by Price */}
              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={() => handleSort("price")}
              >
                Sort by Price
                {sortConfig.key === "price" ? (
                  sortConfig.direction === "asc" ? <FaSortUp className="ml-2" /> : <FaSortDown className="ml-2" />
                ) : (
                  <FaSort className="ml-2" />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interviews Table Section */}
      <section className="bg-white py-6">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="overflow-auto" style={{ maxHeight: '60vh' }}>
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Candidate Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Interviewer Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Company Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Date & Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                    >
                      Rubrics
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={index}>
                      {/* Candidate Name */}
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{item.candidate_name}</span>
                          <span className="text-gray-500">{item.candidate_email}</span>
                          <span className="text-gray-500">{item.candidate_contact}</span>
                        </div>
                      </td>

                      {/* Interviewer Name */}
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <div className="flex items-center gap-x-3">
                          <img
                            src={getInterviewerPhoto(item.interviewer_picpath)}
                            alt={item.interviewer_name}
                            className="object-cover w-10 h-10 rounded-full"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{item.interviewer_name}</span>
                            <span className="text-gray-500">{item.interviewer_email}</span>
                            <span className="text-gray-500">{item.interviewer_contact}</span>
                          </div>
                        </div>
                      </td>

                      {/* Company Name */}
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{item.company_name}</span>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        <span>{new Date(item.datetime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 text-sm font-semibold text-red-500 whitespace-nowrap">
                        ₹{item.price}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {getStatusText(item.status_description, item.InterviewID)}
                      </td>

                      {/* Rubrics */}
                      <td className="px-6 py-4 text-sm whitespace-nowrap relative">
                        {/* Wrapping button and div in a fragment to avoid adjacent JSX elements error */}
                        <>
                          <button
                            onClick={() => fetchRubricData(item.RubricID)}
                            className="flex items-center text-blue-600 hover:text-blue-900 focus:outline-none"
                          >
                            <FaChevronDown className="mr-2" />
                            View Rubrics
                          </button>
                          {visibleRubric === item.RubricID && rubricData[item.RubricID] && (
                            <div
                              ref={rubricBoxRef}
                              className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 shadow-lg rounded-lg p-4 z-20"
                            >
                              <h3 className="text-lg font-semibold mb-2">Rubric Details</h3>
                              <p><strong>Experience:</strong> {rubricData[item.RubricID].Experience}</p>
                              <p><strong>Difficulty Level:</strong> {rubricData[item.RubricID].DifficultyLevel}</p>
                              <p><strong>Notes:</strong> {rubricData[item.RubricID].Notes}</p>
                              <p><strong>Selected Skills:</strong> {rubricData[item.RubricID].SelectedSkills}</p>
                              <p><strong>Role:</strong> {rubricData[item.RubricID].Role}</p>

                   {/* Check ATS Button - displayed only if both item.JD_Path and item.ResumePath are available */}
              {item.JD_Path && item.ResumePath && (
                <button
                onClick={() => handleCheckATS(item.JD_Path, item.ResumePath)}
                className="mt-4 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <span className="loader"></span> // Show loading spinner
                ) : (
                  "Check ATS"
                )}
              </button>
              )}

                            </div>
                          )}
                        </>
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No interviews found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      {/* Request Interview Button */}
      <div className="fixed bottom-4 right-4">
        <Popup
          trigger={
            <button className="px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
              Request Interview
            </button>
          }
          modal
          nested
        >
          {(close) => (
            <div className="modal bg-white p-6 rounded-lg shadow-lg">
              <ReqInterview1 />
              <div className="mt-4">
                <button
                  onClick={() => close()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </>
  );
}

export default Dashboard6;
