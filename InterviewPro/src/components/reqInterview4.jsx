import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiStack } from "react-icons/pi";
import { LiaLaptopCodeSolid } from "react-icons/lia";
import { GoFileCode } from "react-icons/go";
import { TbDatabaseCog } from "react-icons/tb";
import { TbDeviceMobileCode } from "react-icons/tb";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import ReqInterview5 from "./reqInterview5";

function reqInterview2() {
  const navigate = useNavigate();
  return (
    <section>
      <div className="bg-white">
        <h4 className="ml-4 font-bold text-xl mt-[0.4rem] text-[#043C90]">
          Frontend Fundamentals
        </h4>
        <h4 className="ml-4 font-bold text-l  mb-[0.4rem] text-[#606079]">
          HTML,CSS,Javascript, React, Angular etc
        </h4>
        <hr></hr>
        <div>
          <h1 class="mt-1 mb-1 ml-4  text-l font-semibold text-gray-500 ">
            Rubrics <span class="text-[#043C90]">| Criteria</span>
          </h1>
          <hr></hr>

          <h4 className="ml-4 font-bold text-center text-medium mt-[0.4rem] mb-[0.4rem] text-[#043C90]">
            Strong Yes
          </h4>

          <article class="m-3 rounded-xl bg-white p-1 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
            <p class=" text-sm text-center text-[#032D6C]">
              Strong and practical experience of using browser Storage with good
              practical performance{" "}
            </p>
          </article>

          <article class="m-3 rounded-xl bg-white p-1 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
            <p class=" text-sm text-center text-[#032D6C]">
              Strong knowlege of JavaScript fundamentals and also upto date with
              latest feature{" "}
            </p>
          </article>

          <article class="m-3 rounded-xl bg-white p-1 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
            <p class=" text-sm text-center text-[#032D6C]">
              Strong knowledge of React Core Concept{" "}
            </p>
          </article>

          <h4 className="ml-4 font-bold text-center text-medium mt-[0.3rem] mb-[0.3rem] text-[#043C90]">
            Yes
          </h4>

          <article class="m-3 rounded-xl bg-white p-1 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
            <p class=" text-sm text-center text-[#032D6C]">
            Good experience of using browser Storage with good practical performance  {" "}
            </p>
          </article>

          <article class="m-3 rounded-xl bg-white p-1 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
            <p class=" text-sm text-center text-[#032D6C]">
            Good knowlege of JavaScript fundamentals and also upto date with latest feature{" "}
            </p>
          </article>

          <article class="m-3 rounded-xl bg-white p-1 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
            <p class=" text-sm text-center text-[#032D6C]">
            Good knowledge of React Core Concept{" "}
            </p>
          </article>

          <h4 className="ml-4 font-bold text-center text-medium mt-[0.4rem] mb-[0.4rem] text-[#043C90]">
            No
          </h4>

          <article class="m-3 rounded-xl bg-white p-1 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
            <p class=" text-sm text-center text-[#032D6C]">
            Theoretical experience of using browser Storage with no practical performance{" "}
            </p>
          </article>

          <article class="m-3 rounded-xl bg-white p-1 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
            <p class=" text-sm text-center text-[#032D6C]">
            Theoretical  knowlege of JavaScript fundamentals and less upto date with latest feature.  {" "}
            </p>
          </article>

          <article class="m-3 rounded-xl bg-white p-1 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
            <p class=" text-sm text-center text-[#032D6C]">
            Theoretical knowledge of React Core Concept {" "}
            </p>
          </article>

          

          <h4 className="ml-4 font-bold text-center text-medium mt-[0.2rem] mb-[0.2rem] text-[#043C90]">
            Strong No
          </h4>

          <article class="m-3 rounded-xl bg-white p-1 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
            <p class=" text-sm text-center text-[#032D6C]">
            No practical experience of using browser Storage{" "}
            </p>
          </article>

          <article class="m-3 rounded-xl bg-white p-1 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
            <p class=" text-sm text-center text-[#032D6C]">
            No knowlege of JavaScript fundamentals.{" "}
            </p>
          </article>

          <article class="m-3 rounded-xl bg-white p-1 ring ring-indigo-50  shadow-sm transition hover:shadow-lg">
            <p class=" text-sm text-center text-[#032D6C]">
            No knowledge of React Core Concept{" "}
            </p>
          </article>

          

        </div>

        <Popup
          trigger={
            <div className="flex justify-center">
              <button class="px-4 py-1 font-medium tracking-wide text-medium text-white capitalize transition-colors duration-300 transform bg-[#191064] rounded-full hover:bg-gray-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">
                Add Candidate
              </button>
            </div>
          }
          modal
          nested
        >
          {(close) => (
            <div className="modal">
              <ReqInterview5 />
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
export default reqInterview2;
