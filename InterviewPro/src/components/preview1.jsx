import React from "react";
import { useNavigate } from "react-router-dom";
import sample from "../assets/sample2.png";
import { CiMicrophoneOn } from "react-icons/ci";
import { CiMenuKebab } from "react-icons/ci";
import { CiVideoOn } from "react-icons/ci";

function Preview1() {
  const navigate = useNavigate();
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        <section className="relative h-32 items-end bg-[#191064] lg:col-span-5 lg:h-full xl:col-span-6">
          <p class="mt-24 mb-4 text-4xl font-bold text-[#EFF0FA] text-center">
            Get Started
          </p>

          <p class=" text-2xl  text-[#C5C6D0] text-center">
            Setup your audio and video before joining
          </p>

          <div className="mt-14 mb-14 ml-[22rem]">
            <span class="whitespace-nowrap rounded-full font-bold bg-[#C74E5B] px-6 py-2 text-xl text-white">
              Live
            </span>

            <span class="ml-4 whitespace-nowrap rounded-full  font-bold bg-white px-6 py-2 text-xl text-[#191064]">
              1 in session
            </span>
          </div>

          <img
            class="mx-auto object-cover w-128 h-64 rounded-xl"
            src={sample}
            alt=""
          />

          <div className="mt-4 ml-[22rem]">
            <span class="inline-flex overflow-hidden rounded-md border border-white bg-[#191064] shadow-sm">
              <button
                class="inline-block border-e p-3 text-white hover:bg-gray-50 hover:text-[#191064] focus:relative"
                title="Microphone"
              >
                <CiMicrophoneOn className="h-6 w-6" />
              </button>

              <button class="inline-block p-3 text-white hover:bg-gray-50 hover:text-[#191064] focus:relative">
                <CiMenuKebab className="h-6 w-6" />
              </button>
            </span>

            <span class="inline-flex overflow-hidden rounded-md border border-white bg-[#191064] shadow-sm ml-10 ">
              <button
                class="inline-block border-e p-3 text-white hover:bg-gray-50 hover:text-[#191064] focus:relative"
                title="Camera"
              >
                <CiVideoOn className="h-6 w-6" />
              </button>

              <button class="inline-block p-3 text-white hover:bg-gray-50 hover:text-[#191064] focus:relative">
                <CiMenuKebab className="h-6 w-6" />
              </button>
            </span>
          </div>
          <br></br>

          <p class=" text-2xl  text-[#C5C6D0] text-center">
            Interview begins in 5 minutes
          </p>

          <br></br>

          <button class="mt-3 ml-[25.5rem] mb-6 px-6 py-2 font-medium tracking-wide text-medium text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-xl hover:bg-gray-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
            Join Now
          </button>
        </section>

        <main className="flex items-center px-8 py-2 sm:px-12 lg:col-span-7 lg:px-16 lg:py-2 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <h2 className="mt-0 text-2xl font-bold text-[#09005F] sm:text-3xl md:text-4xl">
              Candidate
            </h2>

            <div class="mt-6 flex items-center gap-x-2">
              <img
                class="object-cover w-32 h-32 rounded-xl"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                alt=""
              />

              <div>
                <h1 class="ml-4 text-3xl font-bold text-[#032D6C] capitalize ">
                  Ridit Jain
                </h1>

                <p class="ml-4 text-xl font-semibold text-[#032D6C]">
                  Interview for the role of frontent Developer
                </p>
              </div>
            </div>

            <h2 className="mt-8 mb-4 text-4xl font-bold text-[#09005F]">
              Rubrics
            </h2>

            <h2 className="mt-4 mb-4 text-2xl font-bold text-[#09005F]">
              Seniority
            </h2>

            <article class="mr-[14rem] mt-4 mb-4 rounded-3xl bg-[#09005F] p-4  ">
              <span className="text-xl font-bold text-white  my-auto">
                Internship
              </span>

              <p class="mt-1 text-large text-white">0 years of experience</p>
            </article>

            <h2 className="mt-4 mb-4 text-2xl font-bold text-[#09005F]">
              Difficulty Level
            </h2>

            <article class="mr-[6rem] mt-4 mb-4 rounded-3xl bg-[#09005F] p-4  ">
              <span className="text-xl font-bold text-white  my-auto">
                Hard
              </span>
            </article>

            <h2 className="mt-4 mb-4 text-2xl font-bold text-[#09005F]">
              Hiring Criteria
            </h2>

            <h2 className="mt-4 mb-2 text-xl font-bold text-[#09005F]">
                Skill Rubric

            </h2>

            <h2 className="mb-4 text-xl font text-[#09005F]">
            Just check on the following criteria if the candidate has knowledge of these topic
            </h2>

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
            <strong class="font-bold"> Node JS </strong>
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



          </div>
        </main>
      </div>
    </section>
  );
}
export default Preview1;
