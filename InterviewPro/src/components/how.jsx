import React from "react";
import homework from "../assets/home_work.png";

function How() {
  return (
    <>
      <h2 className="mt-[12rem] mb-[7rem] text-5xl text-[#032D6C] font-bold text-center w-full mt-5">
        How we work
      </h2>
      <div className="m-10 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <section className="bg-white">
          <div className="w-[37rem] py-12 mx-auto">
            <div className="grid grid-cols-1 gap-8">
              <div className="bg-[#D6E1F3] p-10 text-[#09005F] rounded-xl hover:bg-[#09005F] hover:text-white cursor-pointer">
                <p className="text-xl">
                  The <span className="font-bold">organization</span> chooses
                  the profile and other details to request from interviewees
                </p>
              </div>
              <div className="bg-[#D6E1F3] p-10 text-[#09005F] rounded-xl hover:bg-[#09005F] hover:text-white cursor-pointer">
                <p className="text-xl ">
                  The <span className="font-bold">candidate</span> participates
                  in the interview.
                </p>
              </div>
              <div className="bg-[#D6E1F3] p-10 text-[#09005F] rounded-xl hover:bg-[#09005F] hover:text-white cursor-pointer">
                <p className="text-xl">
                  The <span className="font-bold">interviewer</span> compiles a
                  report and makes an informed decision.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Section2 */}
        <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 lg:order-last lg:h-full">
          <img
            alt=""
            src={homework}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </div>
    </>
  );
}

export default How;
