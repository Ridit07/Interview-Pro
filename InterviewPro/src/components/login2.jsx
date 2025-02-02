import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import linkedin from "../assets/linkedin.png";
import logo from "../assets/logo.png";
import abstraction from "../assets/Abstraction.png";

function Login2() {
  const navigate = useNavigate();
  const [iconFile, setIconFile] = useState(null); // New state for the icon file
  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.name) {
      newErrors.name = "Full Name is required.";
    }

    if (!data.email) {
      newErrors.email = "Email is required.";
    }

    if (!/^\d{10}$/.test(data.contact)) {
      newErrors.contact = "Contact number must be 10 digits.";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(data.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, contain 1 lowercase, 1 uppercase, 1 number, and 1 special character.";
    }

    if (data.password !== data.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      name: formData.get("first_name"),
      email: formData.get("email"),
      contact: formData.get("contact"),
      password: formData.get("password"),
      password_confirmation: formData.get("password_confirmation"),
    };

    if (!validateForm(data)) {
      return;
    }

    if (iconFile) {
      formData.append("company_icon", iconFile);
    }

    try {
      const response = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log("Signup Success:", responseData);
        localStorage.setItem("organisation_id", responseData.organisation_id);
        localStorage.setItem("organisation_name", responseData.organisation_name);
        localStorage.setItem("organisation_icon", responseData.company_icon);  // Save icon to localStorage
        navigate("/dashboard6");
      } else {
        console.error("Signup Failed:", responseData.error);
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setIconFile(file);
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
            <h2 className="mt-0 text-2xl font-bold text-[#09005F] sm:text-3xl md:text-4xl">
              Sign Up as an Organisation
            </h2>
            <h2 className="mt-6 text-lg font-bold text-black sm:text-3xl md:text-4xl">
              Create an Account
            </h2>

            <form className="mt-8 grid grid-cols-6 gap-6" onSubmit={handleSignup}>
              <div className="col-span-6">
                <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="FirstName"
                  name="first_name"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="col-span-6">
                <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
                  Work Email Address
                </label>
                <input
                  type="email"
                  id="Email"
                  name="email"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="col-span-6">
                <label htmlFor="Contact" className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="Contact"
                  name="contact"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
                {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
              </div>

              <div className="col-span-6">
                <label htmlFor="Password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="Password"
                  name="password"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              <div className="col-span-6">
                <label htmlFor="PasswordConfirmation" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="PasswordConfirmation"
                  name="password_confirmation"
                  className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                />
                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm">{errors.password_confirmation}</p>
                )}
              </div>

              <div className="col-span-6">
                <label htmlFor="companyIcon" className="block text-sm font-medium text-gray-700">
                  Company Icon (Optional)
                </label>
                <input
                  type="file"
                  id="companyIcon"
                  name="company_icon"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 w-full text-sm text-gray-700"
                />
              </div>

              <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                <button
                  type="submit"
                  className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-[#032d6c]"
                >
                  Create an account
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
}

export default Login2;
