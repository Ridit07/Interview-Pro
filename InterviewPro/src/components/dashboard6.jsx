import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ReqInterview1 from "./reqInterview1";

function Dashboard6() {
  const [organisationName, setOrganisationName] = useState("");
  const [organisationEmail, setOrganisationEmail] = useState("");
  const [organisationContact, setOrganisationContact] = useState("");
  const [dashboardData, setDashboardData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedOrganisationName = localStorage.getItem("organisation_name");
    const storedOrganisationEmail = localStorage.getItem("organisation_email");
    const storedOrganisationContact = localStorage.getItem("organisation_contact");

    if (storedOrganisationName) setOrganisationName(storedOrganisationName);
    if (storedOrganisationEmail) setOrganisationEmail(storedOrganisationEmail);
    if (storedOrganisationContact) setOrganisationContact(storedOrganisationContact);

    fetch("http://localhost:5000/api/get_dashboard_data", {
      credentials: 'include',
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then((response) => {
        console.log("Response status:", response.status);
        console.log("Response headers:", response.headers);
        return response.text().then(text => {
          console.log("Response body:", text);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return JSON.parse(text);
        });
      })
      .then((data) => {
        console.log("Fetched data:", data);
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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = dashboardData.filter(item => item.candidate_name.toLowerCase().includes(query));
    setFilteredData(filtered);
  };

  return (
    <>
      <nav className="relative bg-white shadow dark:bg-white">
        <div className="h-[10vh] p-2">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <a href="#">
                  <h2 className="ml-[1rem] font-bold text-black text-xl">
                    Dashboard
                  </h2>
                </a>
                <div className="mx-10 md:block">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-white-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                  </div>
                </div>
              </div>
              <div className="flex lg:hidden">
                <button type="button" className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400" aria-label="toggle menu">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                  </svg>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-x-2">
              <div>
                <h1 className="text-xl font-semibold text-black-800 capitalize dark:text-black-800">
                  Hi, {organisationName}!
                </h1>
              </div>
              <img className="object-cover w-16 h-16 rounded-full" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=688&h=688&q=100" alt="" />
            </div>
          </div>
        </div>
      </nav>
      <div className="space-y-6">
        <div className="mt-6 ml-6 flex items-center gap-x-2">
          <img className="object-cover w-16 h-16 rounded" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=3&w=688&h=688&q=100" alt="" />
          <div>
            <h1 className="text-xl font-semibold text-black-800 capitalize dark:text-black-800">
              Hi, Ridit!
            </h1>
          </div>
        </div>
        <div>
          <h1 className="mb-4 p-4 text-xl font-semibold text-black-800 bg-[#F2F2F7] capitalize dark:text-black-800">
            Requests | <span className="text-gray-500"><Link to="/dashboard4" className="hover:text-black">Reports</Link></span>
          </h1>
        </div>
      </div>
      <section className="overflow-y-auto">
        <div className="flex flex-col mt-6">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden">
              {error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-black-800">
                  <thead className="bg-white-50 dark:bg-white-800">
                    <tr>
                      <th scope="col" className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-x-3 ml-[4rem]">
                          <span>Candidate Name</span>
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <button className="flex items-center gap-x-2">
                          <span>Interviewer Name</span>
                        </button>
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <button className="flex items-center gap-x-2">
                          <span>Company Name</span>
                        </button>
                      </th>
                      <th scope="col" className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <button className="flex items-center gap-x-2">
                          <span>Date and Time</span>
                        </button>
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <button className="flex items-center gap-x-2">
                          <span>Price</span>
                        </button>
                      </th>
                      <th scope="col" className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <button className="flex items-center gap-x-2">
                          <span>Status Description</span>
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-300 dark:bg-white-900">
                    {filteredData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-4 text-sm font-medium text-black-700 whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            <div className="flex items-center gap-x-2">
                              <div>
                                <h2 className="font-bold text-black-800 dark:text-black ml-[4rem]">
                                  {item.candidate_name}
                                </h2>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="inline-flex items-center">
                            <h2 className="text-sm font-bold text-black-800">
                              {item.interviewer_name}
                            </h2>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="inline-flex items-center">
                            <h2 className="text-sm font-bold text-black-800">
                              {item.company_name}
                            </h2>
                          </div>
                        </td>
                        <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="inline-flex items-center">
                            <h2 className="text-sm font-bold text-black-800">
                              {item.datetime}
                            </h2>
                          </div>
                        </td>
                        <td className="font-bold px-4 py-4 text-sm text-red-500 dark:text-red-600 whitespace-nowrap">
                          {item.price}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div>
                            <h4 className="font-bold text-gray-700 dark:text-black">
                              {item.status_description}
                            </h4>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="fixed bottom-0 right-0 p-4">
        <Popup
          trigger={
            <button className="px-12 py-3 font-medium tracking-wide text-large text-white capitalize transition-colors duration-300 transform bg-[#191064] rounded-full hover:bg-gray-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
              Request Interview
            </button>
          }
          modal
          nested
        >
          {(close) => (
            <div className="modal">
              <ReqInterview1 />
              <div>
                <button onClick={() => close()} className="bg-[#191064] rounded-lg text-white px-12 py-3">
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
