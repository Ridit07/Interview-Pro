import React from "react";
import "./dashboard.css";


function Feedback() {
  return (
    <>
      <nav
        x-data="{ isOpen: false }"
        class="relative bg-white shadow dark:bg-white"
      >
        <div class="h-[10vh] p-2">
          <div class="flex flex-col md:flex-row justify-between md:items-center">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <a href="#">
                  <h2 className="ml-[1rem] font-bold text-black text-xl">Feedback</h2>
                </a>

                <div class="hidden mx-10 md:block">
                  <div class="relative">

                    <input
                      type="text"
                      class="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-white-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                      placeholder="Search"
                    />
                  </div>
                </div>
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
                  Ridit Jain
                </h1>
              </div>
              <img
                class="object-cover w-16 h-16 rounded-full"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                alt=""
              />
            </div>
          </div>
        </div>
        
      </nav>

      
      <section>
        <div className="pl-[36rem] pr-[36rem] bg-white">
          <h4 className="ml-4 font-bold text-2xl mt-[3rem] text-[#043C90]">
            Frontend Fundamentals
          </h4>
          <h4 className="ml-4 font-bold text-xl  mb-[1rem] text-[#606079]">
            HTML,CSS,Javascript, React, Angular etc
          </h4>
          <hr></hr>
          <div>
            <h1 class="mt-4 mb-4 ml-4  text-xl font-semibold text-black-800 capitalize dark:text-black-800">
              Rubrics | <span class="text-gray-500">Criteria</span>
            </h1>
            <hr></hr>
          </div>
          <h4 className="ml-4 font-bold text-2xl mt-[1rem] text-[#043C90]">
            Difficulty Level
          </h4>

          <button class="mt-4 ml-4 mr-4 px-6 py-2 font-medium tracking-wide text-[#09005F] bg-[#d9dadd] border border-lg border-[#09005F]  capitalize transition-colors duration-300 transform rounded-lg hover:bg-[#09005F] hover:text-white focus:outline-none  focus:ring-opacity-80">
            Easy
          </button>

          <button class="mt-4 px-6 py-2 mr-4 font-medium tracking-wide text-[#09005F] bg-[#d9dadd] border border-lg border-[#09005F]  capitalize transition-colors duration-300 transform rounded-lg hover:bg-[#09005F] hover:text-white focus:outline-none  focus:ring-opacity-80">
            Medium
          </button>

          <button class="mt-4 px-6 py-2 font-medium tracking-wide text-[#09005F] bg-[#d9dadd] border border-lg border-[#09005F]  capitalize transition-colors duration-300 transform rounded-lg hover:bg-[#09005F] hover:text-white focus:outline-none  focus:ring-opacity-80">
            Difficult
          </button>

          <br></br>

          <h4 className="ml-4 font-bold text-2xl mt-[1rem] text-[#043C90]">
            Notes for Interviewer
          </h4>

          <div>
            <textarea
              placeholder="Add a comment"
              class="block m-4 w-[45rem] rounded-2xl h-11 bg-[#d9dadd] text-[#09005F]"
            ></textarea>
          </div>

          <h4 className="ml-4 font-bold text-2xl mt-[1rem] text-[#043C90]">
            Skill Rubric
          </h4>

          <label
            for="Option1"
            class=" flex cursor-pointer text-[#043C90] hover:text-white bg-[#d9dadd] items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-[#09005F] has-[:checked]:bg-[#09005F] rounded-xl m-4"
          >
            <div class="flex items-center">
              &#8203;
              <input
                type="checkbox"
                class="size-4 rounded border-gray-300"
                id="Option1"
              />
            </div>

            <div>
              <strong class="font-bold"> Angular JS </strong>
            </div>
          </label>

          <label
            for="Option1"
            class=" flex cursor-pointer text-[#043C90] hover:text-white bg-[#d9dadd] items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-[#09005F] has-[:checked]:bg-[#09005F] rounded-xl m-4"
          >
            <div class="flex items-center">
              &#8203;
              <input
                type="checkbox"
                class="size-4 rounded border-gray-300"
                id="Option1"
              />
            </div>

            <div>
              <strong class="font-bold"> Browser Knowledge </strong>
            </div>
          </label>

          <label
            for="Option1"
            class=" flex cursor-pointer text-[#043C90] hover:text-white bg-[#d9dadd] items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-[#09005F] has-[:checked]:bg-[#09005F] rounded-xl m-4"
          >
            <div class="flex items-center">
              &#8203;
              <input
                type="checkbox"
                class="size-4 rounded border-gray-300"
                id="Option1"
              />
            </div>

            <div>
              <strong class="font-bold"> HTML/CSS </strong>
            </div>
          </label>

          <label
            for="Option1"
            class=" flex cursor-pointer text-[#043C90] hover:text-white bg-[#d9dadd] items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-[#09005F] has-[:checked]:bg-[#09005F] rounded-xl m-4"
          >
            <div class="flex items-center">
              &#8203;
              <input
                type="checkbox"
                class="size-4 rounded border-gray-300"
                id="Option1"
              />
            </div>

            <div>
              <strong class="font-bold"> Data Structures and Algorithms  </strong>
            </div>
          </label>

          <label
            for="Option1"
            class=" flex cursor-pointer text-[#043C90] hover:text-white bg-[#d9dadd] items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-[#09005F] has-[:checked]:bg-[#09005F] rounded-xl m-4"
          >
            <div class="flex items-center">
              &#8203;
              <input
                type="checkbox"
                class="size-4 rounded border-gray-300"
                id="Option1"
              />
            </div>

            <div>
              <strong class="font-bold"> React JS </strong>
            </div>
          </label>

          <label
            for="Option1"
            class=" flex cursor-pointer text-[#043C90] hover:text-white bg-[#d9dadd] items-start gap-4 rounded-lg border border-gray-200 p-4 transition hover:bg-[#09005F] has-[:checked]:bg-[#09005F] rounded-xl m-4"
          >
            <div class="flex items-center">
              &#8203;
              <input
                type="checkbox"
                class="size-4 rounded border-gray-300"
                id="Option1"
              />
            </div>

            <div>
              <strong class="font-bold"> Node JS </strong>
            </div>
          </label>



          <button class="ml-[15rem] mt-2 mb-6 px-14 py-3 font-medium tracking-wide text-xl text-white capitalize transition-colors duration-300 transform bg-[#191064] rounded-full hover:bg-gray-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
            Next
          </button>
        </div>
      </section>
    </>
  );
}

export default Feedback;