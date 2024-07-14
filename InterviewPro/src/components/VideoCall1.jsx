import React from "react";
import CodeEditorWindow from "./CodeEditor";
import sample from "../assets/sample2.png";
import { CiMicrophoneOn } from "react-icons/ci";
import { CiMenuKebab } from "react-icons/ci";
import { CiVideoOn } from "react-icons/ci";
import { CiSettings } from "react-icons/ci";
import { FaPlay } from "react-icons/fa";
import { BsFullscreen } from "react-icons/bs";

function VideoCall1() {
  return (
    <>
      <nav
        x-data="{ isOpen: false }"
        class="relative bg-white shadow dark:bg-white"
      >
        <div class="h-[8vh] p-3">
          <div class="flex flex-col md:flex-row justify-between md:items-center">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <a href="#">
                  <h2 className="ml-[1rem] font-bold text-black text-xl">
                    Interview
                  </h2>
                </a>
              </div>

              <div class="flex lg:hidden">
                <button
                  type="button"
                  class="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                  aria-label="toggle menu"
                >
                  <svg
                    x-show="!isOpen"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>

                  <svg
                    x-show="isOpen"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex items-center gap-x-2">
              <div>
                <h1 class="text-xl font-semibold text-black-800 capitalize dark:text-black-800">
                  Time:
                </h1>
              </div>
              <div>
                <h1 class="text-xl font-semibold text-gray capitalize dark:text-grey">
                  00:00:00
                </h1>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <section className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative h-32 items-end bg-[#323232] lg:col-span-5 lg:h-full xl:col-span-6">
            <p class="mt-12 mb-4 text-4xl font-bold text-[#EFF0FA] ml-5">
              Question 1
            </p>

            <p class=" text-xl ml-5 mt-5 text-[#C5C6D0]">1. Two Sum</p>
            <p class=" text-xl ml-5 mt-5 text-[#C5C6D0]">
              Given an array of integers nums and an integer target, return
              indices of the two numbers such that they add up to target.
            </p>

            <div>
              <img
                class="ml-6 object-cover w-128 h-64 rounded-xl mt-10"
                src={sample}
                alt=""
              />
              <div className="absolute top-[23%] left-[5%]">
                <p className="mr-[88%] bg-[#0F0E0E4D] p-3 rounded-xl w-[95%] text-white">
                  24:01:45
                </p>

                <p className="mt-[135%]  bg-[#0F0E0E4D] p-3 rounded-xl w-[80%] text-white ">
                  Ridit{" "}
                </p>
              </div>
            </div>
            <div>
              <img
                class="ml-6 object-cover w-128 h-64 rounded-xl mt-10"
                src={sample}
                alt=""
              />
              <div className="absolute top-[48%] left-[5%]">
                <p className="mr-[88%] bg-[#0F0E0E4D] p-3 rounded-xl w-[95%] text-white">
                  24:01:45
                </p>

                <p className="mt-[135%]  bg-[#0F0E0E4D] p-3 rounded-xl w-[80%] text-white ">
                  Adam
                </p>
              </div>
            </div>
          </section>

          <main className=" px-8 py-2 sm:px-12 lg:col-span-7 lg:px-16 lg:py-2 xl:col-span-6">
            <div className="flex items-center">
              <select name="code" id="code" className="m-2 mr-80 text-sm">
                <option value="volvo">C++</option>
                <option value="saab">Python</option>
                <option value="opel">Java</option>
              </select>

              <button class="m-2 ml-28 px-6 py-1 font-medium tracking-wide text-black capitalize transition-colors duration-300 transform bg-[#F1F3F9]  rounded-lg hover:bg-[#F1F3F9] focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                {/* Run <FaPlay /> */} Run
              </button>

              <CiSettings className="w-10 h-6 m-2" />

              <BsFullscreen />
            </div>

            <div className="">
              <CodeEditorWindow />
            </div>
            <div className="pt-4">
              <span className="text-xl font-bold ">Console</span>
            </div>

            <div className="flex items-center">
            <span className="px-2 py-1 bg-[#F2F2F7] text-medium ml-[12rem] mr-[8rem] mt-4">Sample</span>
            <span className="px-2 py-1 bg-[#F2F2F7] text-medium ml-[4rem] mt-4">Custom</span>
            </div>

            <div className="bg-[#F2F2F7] p-2 h-[15rem]">
                write your input cases here like <br></br>
                1234

            </div>



            <button class=" mt-2  px-9 py-3 font-medium tracking-wide text-large text-white capitalize transition-colors duration-300 transform bg-red-800 rounded-full hover:bg-gray-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
              End Call
            </button>
          </main>
        </div>
      </section>
    </>
  );
}

export default VideoCall1;
