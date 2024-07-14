import React from "react";
import { Link } from "react-router-dom";
import { FaPhoneVolume } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

function About() {
  return (
    <>
      <div className="mt-[4rem] bg-[#f1f4f5] pb-[2rem]">
      <h2 className="pt-[3rem] text-center text-2xl font-bold text-[#09005F] sm:text-3xl md:text-4xl">
        Contact Us
      </h2>

      <h3 className="my-[1.5rem] text-xl text-center font-semibold text-[#717171]">
      Any question or remarks? Just write us a message!
          </h3>


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
              <FaPhoneVolume className="text-white h-6 w-6 mx-[1rem]"/>  

              <span className="text-white font-medium mx-[1rem]"> 011-27481234 </span>

              </div>

              <div class="flex mt-4 -mx-1.5 ">
              <IoMail className="text-white h-6 w-6 mx-[1rem]"/>

              <span className="text-white font-medium mx-[1rem]"> info@interviewpro.com </span>

              </div>



              
            </div>
          </div>

          <div class="flex flex-col bg-white  justify-center w-full p-8 pt-0 lg:w-1/2 lg:px-12 xl:px-24">
            <form>
              <div class="mt-[2.5rem] -mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                  <label class="block mb-2 text-sm">
                    First Name
                  </label>
                  <input
                    type="text"
                    placeholder="First Name"
                    class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div class="flex-1 px-2 mt-4 md:mt-0">
                  <label class="block mb-2 text-sm">
                    Last Name
                  </label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>
              </div>

              <div class="mt-[2.5rem] -mx-2 md:items-center md:flex">
                <div class="flex-1 px-2">
                  <label class="block mb-2 text-sm">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your contact number"
                    class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>

                <div class="flex-1 px-2 mt-4 md:mt-0">
                  <label class="block mb-2 text-sm">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    class="block w-full px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                </div>
              </div>

              <div class="w-full mt-4">
                <label class="block mb-2 text-sm">
                  Message
                </label>
                <textarea
                  class="block w-full h-32 px-5 py-3 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md md:h-32 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder="Message"
                ></textarea>
              </div>

              <button class="mx-[12rem] px-6 py-3 mt-4 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#09005F] rounded-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
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
