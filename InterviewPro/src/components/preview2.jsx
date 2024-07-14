import React from "react";
import { useNavigate } from "react-router-dom";
import sample from "../assets/sample2.png";
import { CiMicrophoneOn } from "react-icons/ci";
import { CiMenuKebab } from "react-icons/ci";
import { CiVideoOn } from "react-icons/ci";

function Preview2() {
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
              Candidate Instruction and Guidline
            </h2>

            <article class="mt-4 mb-4 rounded-xl bg-[#d9dadd] p-4 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
              <p class=" text-xl font-bold text-[#032D6C]">
                Be Comfortable with the Interviwer
              </p>

              <p class=" text-xl text-[#032D6C]">
                Take a couple of minutes to settle down. Introduce yourself to
                the interviewer and be comfortable with the platform. Take help
                from interviewer if you require.
              </p>
            </article>

            <article class="mt-4 mb-4 rounded-xl bg-[#d9dadd] p-4 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
              <p class=" text-xl font-bold text-[#032D6C]">
                Make sure you are visible properly
              </p>
            </article>

            <div className="flex gap-4">
              <img
                class="object-cover w-32 h-32 rounded-xl"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                alt=""
              />

              <img
                class="object-cover w-32 h-32 rounded-xl"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                alt=""
              />
            </div>

            <article class="mt-4 mb-4 rounded-xl bg-[#d9dadd] p-4 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
              <p class=" text-xl font-bold text-[#032D6C]">
                Make sure you are near camera and not far away
              </p>
            </article>

            <div className="flex gap-4">
              <img
                class="object-cover w-32 h-32 rounded-xl"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                alt=""
              />

              <img
                class="object-cover w-32 h-32 rounded-xl"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                alt=""
              />
            </div>

            <article class="mt-4 mb-4 rounded-xl bg-[#d9dadd] p-4 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
              <p class=" text-xl font-bold text-[#032D6C]">
                Make sure your voice is clear
              </p>

              <p class=" text-xl text-[#032D6C]">
                Make sure your voice is not muffled,in case of any unwanted
                disturbance or noise will lead to cancel your interview.
              </p>
            </article>
          </div>
        </main>
      </div>
    </section>
  );
}
export default Preview2;
