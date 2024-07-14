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

  const handleDifficultyChange = (level) => {
    setDifficultyLevel(level);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleSkillChange = (skill) => {
    setSelectedSkills([skill]);
  };

  const handleNextClick = () => {
    // Check if all required data is filled
    if (!difficultyLevel || !notes || selectedSkills.length === 0) {
      alert("Please fill in all required fields before proceeding.");
      return;
    }

    // Send data to backend
    const formData = {
      difficultyLevel,
      notes,
      selectedSkills,
    };

    fetch("http://localhost:5000/api/save_interview_data", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Optionally, you can navigate to the next page after successful response
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
        <h4 className="ml-4 font-bold  mb-[0.5rem] text-[#606079]">
          HTML, CSS, Javascript, React, Angular, etc.
        </h4>
        <hr></hr>
        <div>
          <h1 className="mt-2 mb-2 ml-4 font-semibold text-black-800 capitalize dark:text-black-800">
            Rubrics | <span className="text-gray-500">Criteria</span>
          </h1>
          <hr></hr>
        </div>
        <h4 className="ml-4 font-bold text-xl mt-[0.6rem] text-[#043C90]">
          Difficulty Level
        </h4>

        {/* Difficulty level buttons */}
        <button
          className={`mt-3 ml-4 mr-4 px-4 py-1 font-medium tracking-wide capitalize transition-colors duration-300 transform rounded-lg focus:outline-none  ${
            difficultyLevel === "easy" ? "bg-[#09005F] text-white" : "bg-[#d9dadd] text-[#09005F] hover:bg-[#09005F] hover:text-white"
          }`}
          onClick={() => handleDifficultyChange("easy")}
        >
          Easy
        </button>

        <button
          className={`mt-3 px-4 py-1 mr-4 font-medium tracking-wide capitalize transition-colors duration-300 transform rounded-lg focus:outline-none  ${
            difficultyLevel === "medium" ? "bg-[#09005F] text-white" : "bg-[#d9dadd] text-[#09005F] hover:bg-[#09005F] hover:text-white"
          }`}
          onClick={() => handleDifficultyChange("medium")}
        >
          Medium
        </button>

        <button
          className={`mt-3 px-4 py-1 font-medium tracking-wide capitalize transition-colors duration-300 transform rounded-lg focus:outline-none  ${
            difficultyLevel === "difficult" ? "bg-[#09005F] text-white" : "bg-[#d9dadd] text-[#09005F] hover:bg-[#09005F] hover:text-white"
          }`}
          onClick={() => handleDifficultyChange("difficult")}
        >
          Difficult
        </button>

        <h4 className="ml-4 font-bold text-xl mt-[0.6rem] text-[#043C90]">
          Notes for Interviewer
        </h4>

        {/* Notes textarea */}
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

        {/* Skill rubric radio buttons */}
        <label
          className={`flex cursor-pointer text-[#043C90] hover:text-white bg-[#d9dadd] items-start gap-4 rounded-lg border border-gray-200 p-3 transition hover:bg-[#09005F] has-[:checked]:bg-[#09005F] rounded-xl m-4 ${
            selectedSkills.includes("Angular JS") ? "bg-[#09005F] text-white" : ""
          }`}
        >
          <div className="flex items-center">
            <input
              type="radio"
              className="size-4 rounded border-gray-300"
              name="skill"
              value="Angular JS"
              checked={selectedSkills.includes("Angular JS")}
              onChange={() => handleSkillChange("Angular JS")}
            />
          </div>

          <div>
            <strong className="font-bold">Angular JS</strong>
          </div>
        </label>

        {/* Add similar labels for other skills */}
        <label
          className={`flex cursor-pointer text-[#043C90] hover:text-white bg-[#d9dadd] items-start gap-4 rounded-lg border border-gray-200 p-3 transition hover:bg-[#09005F] has-[:checked]:bg-[#09005F] rounded-xl m-4 ${
            selectedSkills.includes("HTML/CSS") ? "bg-[#09005F] text-white" : ""
          }`}
        >
          <div className="flex items-center">
            <input
              type="radio"
              className="size-4 rounded border-gray-300"
              name="skill"
              value="HTML/CSS"
              checked={selectedSkills.includes("HTML/CSS")}
              onChange={() => handleSkillChange("HTML/CSS")}
            />
          </div>

          <div>
            <strong className="font-bold">HTML/CSS</strong>
          </div>
        </label>
        <label
          className={`flex cursor-pointer text-[#043C90] hover:text-white bg-[#d9dadd] items-start gap-4 rounded-lg border border-gray-200 p-3 transition hover:bg-[#09005F] has-[:checked]:bg-[#09005F] rounded-xl m-4 ${
            selectedSkills.includes("Javascript") ? "bg-[#09005F] text-white" : ""
          }`}
        >
          <div className="flex items-center">
            <input
              type="radio"
              className="size-4 rounded border-gray-300"
              name="skill"
              value="Javascript"
              checked={selectedSkills.includes("Javascript")}
              onChange={() => handleSkillChange("Javascript")}
            />
          </div>

          <div>
            <strong className="font-bold">Javascript</strong>
          </div>
        </label>


        <label
          className={`flex cursor-pointer text-[#043C90] hover:text-white bg-[#d9dadd] items-start gap-4 rounded-lg border border-gray-200 p-3 transition hover:bg-[#09005F] has-[:checked]:bg-[#09005F] rounded-xl m-4 ${
            selectedSkills.includes("NodeJS") ? "bg-[#09005F] text-white" : ""
          }`}
        >
          <div className="flex items-center">
            <input
              type="radio"
              className="size-4 rounded border-gray-300"
              name="skill"
              value="NodeJS"
              checked={selectedSkills.includes("NodeJS")}
              onChange={() => handleSkillChange("NodeJS")}
            />
          </div>

          <div>
            <strong className="font-bold">NodeJS</strong>
          </div>
        </label>

        <label
          className={`flex cursor-pointer text-[#043C90] hover:text-white bg-[#d9dadd] items-start gap-4 rounded-lg border border-gray-200 p-3 transition hover:bg-[#09005F] has-[:checked]:bg-[#09005F] rounded-xl m-4 ${
            selectedSkills.includes("Python") ? "bg-[#09005F] text-white" : ""
          }`}
        >
          <div className="flex items-center">
            <input
              type="radio"
              className="size-4 rounded border-gray-300"
              name="skill"
              value="Python"
              checked={selectedSkills.includes("Python")}
              onChange={() => handleSkillChange("Python")}
            />
          </div>

          <div>
            <strong className="font-bold">Python</strong>
          </div>
        </label>

        <label
          className={`flex cursor-pointer text-[#043C90] hover:text-white bg-[#d9dadd] items-start gap-4 rounded-lg border border-gray-200 p-3 transition hover:bg-[#09005F] has-[:checked]:bg-[#09005F] rounded-xl m-4 ${
            selectedSkills.includes("C++") ? "bg-[#09005F] text-white" : ""
          }`}
        >
          <div className="flex items-center">
            <input
              type="radio"
              className="size-4 rounded border-gray-300"
              name="skill"
              value="C++"
              checked={selectedSkills.includes("C++")}
              onChange={() => handleSkillChange("C++")}
            />
          </div>

          <div>
            <strong className="font-bold">C++</strong>
          </div>
        </label>
        




        {/* Add more labels for other skills here */}

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
