import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ReqInterview3 from "./reqInterview3";

function ReqInterview2() {
  const navigate = useNavigate();
  const [selectedExperience, setSelectedExperience] = useState(null);

  const handleExperienceClick = (experience) => {
    setSelectedExperience(experience);
    console.log(`Selected experience: ${experience}`);
  };

  const handleNextClick = () => {
    if (!selectedExperience) {
      alert("Please select an experience before proceeding.");
      return;
    }

    fetch("http://localhost:5000/api/save_selected_experience", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ experience: selectedExperience }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // navigate("/reqinterview3"); // Uncomment if navigation is needed
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <section>
      <div className="bg-white">
        <h3 className="text-2xl text-[#032D6C] font-bold text-center w-full mt-7 mb-7">
          Request Interview
        </h3>
        <hr />
        <h4 className="text-center text-xl mt-[1.2rem] mb-[1.2rem] text-[#043C90]">
          Select experience for the role
        </h4>

        {/* Experience selection articles */}
        {[
          { label: "Internship", value: "internship", description: "0 years of experience" },
          { label: "Entry Level", value: "entryLevel", description: "0-1 years of experience" },
          { label: "Intermediate", value: "intermediate", description: "1-3 years of experience" },
          { label: "Mid Senior", value: "midSenior", description: "3-5 years of experience" },
          { label: "Senior", value: "senior", description: "5+ years of experience" },
        ].map((experience) => (
          <article
            key={experience.value}
            style={{
              backgroundColor: selectedExperience === experience.value ? 'rgb(187 247 208)' : 'white'
            }}
            className="ml-10 mr-10 mb-4 rounded-3xl p-2 ring ring-indigo-50 sm:p-3 lg:p-4 shadow-sm transition hover:shadow-lg"
            onClick={() => handleExperienceClick(experience.value)}
          >
            <span className="text-xl font-bold text-[#09005F] my-auto">
              {experience.label}
            </span>
            <p className="text-sm text-gray-700">{experience.description}</p>
          </article>
        ))}

        <Popup
          trigger={
            <div className="flex justify-center">
              <button
                onClick={handleNextClick}
                className="mt-4 px-10 py-2 font-medium tracking-wide text-xl text-white capitalize transition-colors duration-300 transform bg-[#191064] rounded-full hover:bg-gray-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
              >
                Next
              </button>
            </div>
          }
          modal
          nested
        >
          {(close) => (
            <div className="modal">
              <ReqInterview3 />
              <div>
                <button
                  onClick={() => close()}
                  className="bg-[#191064] rounded-lg text-white px-12 py-3"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </Popup>
      </div>
    </section>
  );
}

export default ReqInterview2;
