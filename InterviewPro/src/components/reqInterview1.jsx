import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiStack } from "react-icons/pi";
import { LiaLaptopCodeSolid } from "react-icons/lia";
import { GoFileCode } from "react-icons/go";
import { TbDatabaseCog } from "react-icons/tb";
import { TbDeviceMobileCode } from "react-icons/tb";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ReqInterview2 from "./reqInterview2";

function ReqInterview1() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    // Highlight the clicked role (add your highlight logic here)
  };

  const handleNextClick = () => {
    if (!selectedRole) {
      alert("Please select a role before proceeding.");
      return;
    }
    // Send selectedRole to backend
    fetch("http://localhost:5000/api/save_selected_role", {
      credentials: 'include' ,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role: selectedRole }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Optionally, you can navigate to the next page after successful response
       // navigate("/reqinterview2");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <section>
      <div className="bg-white ">
        <h3 className="text-4xl text-[#032D6C] font-bold text-center w-full mt-7 mb-7">
          Request Interview
        </h3>
        <hr></hr>
        <h4 className="text-xl mt-[1.5rem] mb-[1.5rem] text-center text-[#043C90]">
          Select the role for the Interview
        </h4>

        <div
          className={`ml-auto w-full grid grid-cols-1 gap-1 lg:grid-cols-2 lg:gap-2 ${
            selectedRole === "frontend" ? "bg-green-200" : ""
          }`}
          onClick={() => handleRoleClick("frontend")}
        >
          <article className="h-[5rem] w-[5rem] mb-2 mx-auto rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6">
            <div className="mt-1">
              <LiaLaptopCodeSolid className="h-8 w-8" />
            </div>
          </article>

          <span className="text-xl font-semibold text-[#09005F] my-auto">
            Frontend
          </span>
        </div>

        <div
          className={`ml-auto w-full grid grid-cols-1 gap-1 lg:grid-cols-2 lg:gap-2 ${
            selectedRole === "backend" ? "bg-green-200" : ""
          }`}
          onClick={() => handleRoleClick("backend")}
        >
          <article className="h-[5rem] w-[5rem] mb-2 mx-auto rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6">
            <div className="mt-1">
              <GoFileCode className="h-8 w-8" />
            </div>
          </article>

          <span className="text-xl font-semibold text-[#09005F] my-auto">
            Backend
          </span>
        </div>

        <div
          className={`ml-auto w-full grid grid-cols-1 gap-1 lg:grid-cols-2 lg:gap-2 ${
            selectedRole === "fullstack" ? "bg-green-200" : ""
          }`}
          onClick={() => handleRoleClick("fullstack")}
        >
          <article className="h-[5rem] w-[5rem] mb-2 mx-auto rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6">
            <div className="mt-1">
              <PiStack className="h-8 w-8" />
            </div>
          </article>

          <span className="text-xl font-semibold text-[#09005F] my-auto">
            Full Stack
          </span>
        </div>

        <div
          className={`ml-auto w-full grid grid-cols-1 gap-1 lg:grid-cols-2 lg:gap-2 ${
            selectedRole === "datascience" ? "bg-green-200" : ""
          }`}
          onClick={() => handleRoleClick("datascience")}
        >
          <article className="h-[5rem] w-[5rem] mb-2 mx-auto rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6">
            <div className="mt-1">
              <TbDatabaseCog className="h-8 w-8" />
            </div>
          </article>

          <span className="text-xl font-semibold text-[#09005F] my-auto">
            Data Science
          </span>
        </div>

        <div
          className={`ml-auto w-full grid grid-cols-1 gap-1 lg:grid-cols-2 lg:gap-2 ${
            selectedRole === "appdev" ? "bg-green-200" : ""
          }`}
          onClick={() => handleRoleClick("appdev")}
        >
          <article className="h-[5rem] w-[5rem] mb-2 mx-auto rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6">
            <div>
              <TbDeviceMobileCode className="h-8 w-8" />
            </div>
          </article>

          <span className="text-xl font-semibold text-[#09005F] my-auto">
            App Dev
          </span>
        </div>

        <Popup
          trigger={
            <div className="flex justify-center">
              <button 
              onClick={handleNextClick}
              className="mt-4 px-10 py-2 font-medium tracking-wide text-xl text-white capitalize transition-colors duration-300 transform bg-[#191064] rounded-full hover:bg-gray-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                Next
              </button>
            </div>
          }
          modal
          nested
        >
          {(close) => (
            <div className="modal">
              <ReqInterview2 selectedRole={selectedRole} />
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
export default ReqInterview1;
