import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ReqInterview4 from "./reqInterview4";

function ReqInterview2() {
  const navigate = useNavigate();
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [jobDescription, setJobDescription] = useState(null);

  const handleDifficultyChange = (level) => {
    setDifficultyLevel(level);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleSkillChange = (skill) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill]
    );
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "application/pdf" || file.type === "application/msword" || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      if (file.size <= 5 * 1024 * 1024) {
        setJobDescription(file);
      } else {
        alert("File must be less than 5MB.");
      }
    } else {
      alert("Only PDF or Word files are accepted.");
    }
  };

  const handleNextClick = () => {
    if (!difficultyLevel || !notes || selectedSkills.length === 0) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }

    const formData = new FormData();
    formData.append("difficultyLevel", difficultyLevel);
    formData.append("notes", notes);
    formData.append("selectedSkills", selectedSkills.join(", "));
    if (jobDescription) {
      formData.append("jobDescription", jobDescription);
    }

    fetch("http://localhost:5000/api/save_interview_data", {
      method: "POST",
      credentials: 'include',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Optionally, navigate to the next page after successful response
        // navigate("/reqinterview4");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <section>
      <div className="bg-white">
        <h4 className="ml-4 font-bold text-xl mt-[0.5rem] text-[#043C90]">
          Frontend Fundamentals
        </h4>
        <h4 className="ml-4 font-bold mb-[0.5rem] text-[#606079]">
          HTML, CSS, Javascript, React, Angular, etc.
        </h4>
        <hr />
        <div>
          <h1 className="mt-2 mb-2 ml-4 font-semibold text-black-800 capitalize dark:text-black-800">
            Rubrics | <span className="text-gray-500">Criteria</span>
          </h1>
          <hr />
        </div>
        <h4 className="ml-4 font-bold text-xl mt-[0.6rem] text-[#043C90]">
          Difficulty Level
        </h4>

        <button
          className={`mt-3 ml-4 mr-4 px-4 py-1 font-medium tracking-wide capitalize transition-colors duration-300 transform rounded-lg focus:outline-none ${
            difficultyLevel === "easy"
              ? "bg-[#09005F] text-white"
              : "bg-[#d9dadd] text-[#09005F] hover:bg-[#09005F] hover:text-white"
          }`}
          onClick={() => handleDifficultyChange("easy")}
        >
          Easy
        </button>

        <button
          className={`mt-3 px-4 py-1 mr-4 font-medium tracking-wide capitalize transition-colors duration-300 transform rounded-lg focus:outline-none ${
            difficultyLevel === "medium"
              ? "bg-[#09005F] text-white"
              : "bg-[#d9dadd] text-[#09005F] hover:bg-[#09005F] hover:text-white"
          }`}
          onClick={() => handleDifficultyChange("medium")}
        >
          Medium
        </button>

        <button
          className={`mt-3 px-4 py-1 font-medium tracking-wide capitalize transition-colors duration-300 transform rounded-lg focus:outline-none ${
            difficultyLevel === "difficult"
              ? "bg-[#09005F] text-white"
              : "bg-[#d9dadd] text-[#09005F] hover:bg-[#09005F] hover:text-white"
          }`}
          onClick={() => handleDifficultyChange("difficult")}
        >
          Difficult
        </button>

        <h4 className="ml-4 font-bold text-xl mt-[0.6rem] text-[#043C90]">
          Notes for Interviewer
        </h4>
        <div>
          <textarea
            placeholder="Add a comment"
            className="block m-4 w-[45rem] rounded-2xl h-11 bg-[#d9dadd] text-[#09005F]"
            value={notes}
            onChange={handleNotesChange}
          ></textarea>
        </div>

        <h4 className="ml-4 font-bold text-xl mt-[0.6rem] text-[#043C90]">
          Skill Rubric
        </h4>

        {["Angular JS", "HTML/CSS", "Javascript", "NodeJS", "Python", "C++"].map((skill) => (
          <label
            key={skill}
            className={`flex cursor-pointer text-[#043C90] hover:text-white bg-[#d9dadd] items-start gap-4 rounded-lg border border-gray-200 p-3 transition hover:bg-[#09005F] rounded-xl m-4 ${
              selectedSkills.includes(skill) ? "bg-[#09005F] text-white" : ""
            }`}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                className="size-4 rounded border-gray-300"
                name="skill"
                value={skill}
                checked={selectedSkills.includes(skill)}
                onChange={() => handleSkillChange(skill)}
              />
            </div>
            <div>
              <strong className="font-bold">{skill}</strong>
            </div>
          </label>
        ))}

        <h4 className="ml-4 font-bold text-xl mt-[0.6rem] text-[#043C90]">
          Upload Job Description (Optional)
        </h4>

        {/* Custom styled file input */}
        <div className="m-4">
          <label
            htmlFor="file-upload"
            className="cursor-pointer px-6 py-2 text-white bg-[#191064] rounded-full font-medium tracking-wide text-center transition-colors duration-300 transform hover:bg-gray-500 focus:outline-none"
          >
            Choose File
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="ml-4 text-gray-700">
            {jobDescription ? jobDescription.name : "No file chosen"}
          </span>
        </div>

        <Popup
          trigger={
            <div className="flex justify-center">
              <button
                className="px-10 py-2 font-medium tracking-wide text-xl text-white capitalize transition-colors duration-300 transform bg-[#191064] rounded-full hover:bg-gray-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                onClick={handleNextClick}
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
              <ReqInterview4 />
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
