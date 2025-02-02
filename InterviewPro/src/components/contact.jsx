import axios from 'axios';
import { Link } from "react-router-dom";
import { FaPhoneVolume } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";
import React, { useState } from "react";

function About() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");  // New state for success message

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send form data to the backend
    axios.post('http://localhost:5000/api/contact', formData)
      .then(response => {
        setSuccessMessage('Form submitted successfully!');  // Set the success message
        setFormData({  // Clear the form fields
          firstName: "",
          lastName: "",
          contactNumber: "",
          email: "",
          message: "",
        });
      })
      .catch(error => {
        console.error('There was an error submitting the form!', error);
      });
  };

  return (
    <>
      <div className="mt-[4rem] bg-[#f1f4f5] pb-[2rem]">
        <h2 className="pt-[3rem] text-center text-2xl font-bold text-[#09005F] sm:text-3xl md:text-4xl">
          Contact Us
        </h2>

        <h3 className="my-[1.5rem] text-xl text-center font-semibold text-[#717171]">
          Any question or remarks? Just write us a message!
        </h3>

        {successMessage && (  // Display the success message if it's set
          <div className="text-center text-green-600 font-semibold mb-4">
            {successMessage}
          </div>
        )}

        <section class="mx-auto w-[90rem] h-[35rem] bg-white lg:flex">
          <div class=" flex flex-col justify-center w-full p-8 bg-[#09005F] lg:px-12 xl:px-32 lg:w-1/2 rounded-xl">
            <h1 class="text-2xl font-semibold text-white-800 capitalize text-white lg:text-3xl">
              Contact Information
            </h1>

            <p class="mt-4 text-gray-500 text-gray-400">
              Ask us everything and we would love to hear from you
            </p>

            <div class="mt-6 md:mt-8">
              <div class="flex mt-4 -mx-1.5 ">
                <FaPhoneVolume className="text-white h-6 w-6 mx-[1rem]" />
                <span className="text-white font-medium mx-[1rem]">011-27481234</span>
              </div>

              <div class="flex mt-4 -mx-1.5 ">
                <IoMail className="text-white h-6 w-6 mx-[1rem]" />
                <span className="text-white font-medium mx-[1rem]">info@interviewpro.com</span>
              </div>
            </div>
          </div>

          <div class="flex flex-col bg-white justify-center w-full p-8 pt-0 lg:w-1/2 lg:px-12 xl:px-24">
            <form onSubmit={handleSubmit}>
              <div class="mt-[2.5rem] -mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                  <label class="block mb-2 text-sm">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400"
                  />
                </div>
                <div class="flex-1 px-2 mt-4 md:mt-0">
                  <label class="block mb-2 text-sm">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400"
                  />
                </div>
              </div>
              <div class="mt-[2.5rem] -mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                  <label class="block mb-2 text-sm">Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    placeholder="Enter your contact number"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400"
                  />
                </div>
                <div class="flex-1 px-2 mt-4 md:mt-0">
                  <label class="block mb-2 text-sm">Email address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400"
                  />
                </div>
              </div>
              <div class="w-full mt-4">
                <label class="block mb-2 text-sm">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  class="block w-full h-32 px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400"
                  placeholder="Message"
                ></textarea>
              </div>
              <button
                type="submit"
                class="mx-[12rem] px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize bg-[#09005F] rounded-md hover:bg-blue-400"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
}

export default About;
