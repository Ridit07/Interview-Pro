// Import necessary libraries
import React, { useState, useEffect } from "react";
import "./dashboard.css";
import { FcGoogle } from "react-icons/fc";
import { SiAccenture, SiSap } from "react-icons/si";
import { MdDownload } from "react-icons/md";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function toUTCString(localDate) {
  return new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
}

function toLocalTime(utcDateString) {
  const utcDate = new Date(utcDateString);
  return new Date(utcDate.getTime() + (utcDate.getTimezoneOffset() * 60000));
}

function Dashboard1() {
  const [interviews, setInterviews] = useState([]);
  const [scheduleDates, setScheduleDates] = useState({});

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

  const handleDateChange = (date, interviewId) => {
    setScheduleDates((prevDates) => ({
      ...prevDates,
      [interviewId]: date,
    }));
    handleDateSubmit(interviewId, date);
  };

  const handleDateSubmit = (interviewId, date) => {
    if (date) {
      const dateTimeUTC = toUTCString(date);
      fetch("http://localhost:5000/api/schedule_interview", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interview_id: interviewId,
          datetime: dateTimeUTC,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            setInterviews((prevInterviews) =>
              prevInterviews.map((interview) =>
                interview.interview_id === interviewId
                  ? { ...interview, datetime: date.toISOString() }
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

  const getStatusButton = (statusDescription, interviewId, datetime) => {
    const currentTime = new Date();
    const interviewTime = new Date(datetime);
    const timeDifference = (interviewTime - currentTime) / (1000 * 60);

    if (statusDescription === "0") {
      return (
        <div>
          <DatePicker
            selected={scheduleDates[interviewId]}
            onChange={(date) => handleDateChange(date, interviewId)}
            showTimeSelect
            dateFormat="Pp"
            placeholderText="Schedule"
          />
        </div>
      );
    } else if (statusDescription === "1") {
      if (timeDifference > 45) {
        return <span>Scheduled</span>;
      } else {
        return (
          <button className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#191064] rounded-full hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80">
            Button
          </button>
        );
      }
    } else if (statusDescription === "2") {
      return (
        <button className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#191064] rounded-full hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80">
          Generate Payment
        </button>
      );
    } else if (statusDescription === "3") {
      return <span>Completed</span>;
    } else {
      return null;
    }
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

                <div className="hidden mx-10 md:block">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </span>

                    <input
                      type="text"
                      className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-white-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                      placeholder="Search"
                    />
                  </div>
                </div>
              </div>

              <div className="flex lg:hidden">
                <button
                  type="button"
                  className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                  aria-label="toggle menu"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-x-2 mr-12">
                <div>
                  <h1 className="text-xl font-semibold text-black-800 capitalize dark:text-black-800">
                    Ridit Jain
                  </h1>
                </div>
                <img
                  className="object-cover w-16 h-16 rounded-full"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="space-y-6">
        <div className="mt-6 ml-6 flex items-center gap-x-2">
          <img
            className="object-cover w-16 h-16 rounded"
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
            alt=""
          />

          <div>
            <h1 className=" text-xl font-semibold text-black-800 capitalize dark:text-black-800">
              Hi, Ridit!
            </h1>
          </div>
        </div>

        <div>
          <h1 className="mb-4 p-4 text-xl font-semibold text-gray-400 bg-[#F2F2F7] capitalize dark:text-gray-400">
            <Link to="/dashboard3" className="hover:text-black">
              Requests{" "}
            </Link>
            <span className="text-black dark:text-black-500">| Current |</span>{" "}
            <Link to="/dashboard5" className="hover:text-black">
              Completed
            </Link>
          </h1>
        </div>
      </div>
      <section className="">
        <div className="flex flex-column justify-evenly">
          <div className="relative mt-4 md:mt-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>

            <input
              type="text"
              className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-lg dark:bg-white-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
              placeholder="Search"
            />
          </div>
          <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
            <button className="inline-block border-e px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative">
              Company
            </button>
          </span>

          <div className="relative inline-block ml-40">
            <button className="relative z-10 flex items-center p-2 text-sm text-gray-600 bg-white border border-transparent rounded-md hover:border-[#191064] hover:ring-opacity-40 dark:hover:ring-opacity-40 hover:ring-blue-300 dark:hover:ring-blue-400 hover:ring dark:text-white dark:bg-[#191064] focus:outline-none">
              <span className="mx-1">Sort By</span>
              <svg
                className="w-5 h-5 mx-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>

            <div className="absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden origin-top-right bg-white rounded-md shadow-xl dark:bg-gray-800 invisible hover:visible">
              <a
                href="#"
                className="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <img
                  className="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"
                  src="https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8d29tYW4lMjBibHVlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=face&w=500&q=200"
                  alt="jane avatar"
                />
                <div className="mx-1">
                  <h1 className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Jane Doe
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    janedoe@exampl.com
                  </p>
                </div>
              </a>

              <hr className="border-gray-200 dark:border-gray-700" />

              <a
                href="#"
                className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                view profile
              </a>

              <a
                href="#"
                className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Settings
              </a>

              <a
                href="#"
                className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Keyboard shortcuts
              </a>

              <hr className="border-gray-200 dark:border-gray-700" />

              <a
                href="#"
                className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Company profile
              </a>

              <a
                href="#"
                className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Team
              </a>

              <a
                href="#"
                className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Invite colleagues
              </a>

              <hr className="border-gray-200 dark:border-gray-700" />

              <a
                href="#"
                className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Help
              </a>
              <a
                href="#"
                className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Sign Out
              </a>
            </div>
          </div>

          <a
            className="inline-block rounded-full border border-[#191064] p-3 text-[#191064] hover:bg-[#191064] hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
            href="#"
          >
            <span className="sr-only"> Download </span>

            <MdDownload className="size-6" />
          </a>
        </div>

        <div className="flex flex-col mt-6">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-black-800">
                  <thead className="bg-white-50 dark:bg-white-800">
                    <tr>
                      <th
                        scope="col"
                        className="pl-20 px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        <div className="flex items-center gap-x-3 ">
                          <span>Company</span>
                        </div>
                      </th>

                      <th
                        scope="col"
                        className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        <button className="flex items-center gap-x-2">
                          <span>Time</span>
                        </button>
                      </th>

                      <th
                        scope="col"
                        className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-300 dark:bg-white-900">
                    {interviews.map((interview) => (
                      <tr key={interview.interview_id}>
                        <td className="pl-20 font-bold px-4 py-4 text-sm text-black-500 dark:text-black-800 whitespace-nowrap">
                          {interview.candidate_name}
                          <br />
                          {interview.candidate_contact}
                          <br />
                          {interview.candidate_email}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-black-700 whitespace-nowrap">
                          <div className="inline-flex items-center gap-x-3">
                            <div className="flex items-center gap-x-2">
                              <FcGoogle className="object-cover w-10 h-10 rounded-full" />
                              <div>
                                <h2 className="font-bold text-black-800 dark:text-black ">
                                  {interview.company_name}
                                </h2>
                                <p>{interview.company_email}</p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div className="inline-flex items-center">
                            <h2 className="text-sm font-bold text-black-800">
                              {interview.datetime
                                ? new Date(interview.datetime).toLocaleString()
                                : "TBD"}
                            </h2>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          {getStatusButton(
                            interview.status_description,
                            interview.interview_id,
                            interview.datetime
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard1;
