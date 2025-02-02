import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import linkedin from "../assets/linkedin.png";
import abstraction from "../assets/Abstraction.png";
import logo from "../assets/logo.png";

function Signup2() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password_confirmation"), 
    };

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const jsonData = await response.json();
      if (response.ok) {
        localStorage.setItem("organisation_id", jsonData.organisation_id);
        localStorage.setItem("organisation_name", jsonData.organisation_name);
        localStorage.setItem("organisation_icon", jsonData.company_icon); // Save company icon
        navigate("/dashboard6");
      } else {
        setErrorMessage("Wrong email or password. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again later.");
    }
  };


  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <img
            alt=""
            src={abstraction}
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="/home">
              <span className="sr-only">Home</span>
              <img src={logo} alt="Logo" className="h-12 w-100" />
            </a>

            <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Welcome to InterviewPro
            </h2>
          </div>
        </section>

        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <a
                className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                href="#"
              >
                <span className="sr-only">Home</span>
                <svg
                  className="h-8 sm:h-10"
                  viewBox="0 0 28 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG content */}
                </svg>
              </a>
            </div>

            <h2 className="mt-0 text-2xl font-bold text-[#09005F] sm:text-3xl md:text-4xl">
              Login as a Organisation
            </h2>

            <h2 className="mt-6 text-lg font-bold text-black sm:text-3xl md:text-4xl">
              Get into your Account
            </h2>

            {/* Display error message if it exists */}
            {errorMessage && (
              <div className="mt-4 text-red-600 bg-red-100 p-3 rounded">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-between ">
              {/* Google and LinkedIn login buttons */}
            </div>

            <form className="mt-8 grid grid-cols-6 gap-6" onSubmit={handleLogin}>
              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Work Email Address
                </label>
                <input
                  type="email"
                  id="Email"
                  name="email"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="PasswordConfirmation"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="PasswordConfirmation"
                  name="password_confirmation"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-[#032d6c]"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}

export default Signup2;
