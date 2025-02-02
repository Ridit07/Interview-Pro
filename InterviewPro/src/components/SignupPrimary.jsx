import React from "react";
import { useNavigate } from "react-router-dom";
import signup1 from "../assets/signup1.png";
import signup2 from "../assets/signup2.png";
import signup3 from "../assets/signup3.png";

function SignupPrimary() {
  const navigate = useNavigate();

  return (
    <section id="pricing">
      <div>
        <h3 className="mt-4 text-[#032D6C]-3xl font-bold sm:text-5xl">
          How do you wish to avail our services
        </h3>

        <p className="mt-1 text-2xl text-[#043C90]-700 text-center">
          We will tailor your experience to suit your preferences.
        </p>
      </div>

      <br />
      <br />

      <article className="w-[80rem] rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
        <div className="flex items-start sm:gap-8">
          <div
            className="hidden sm:grid sm:size-20 sm:shrink-0 sm:place-content-center"
            aria-hidden="true"
          >
            <div className="flex items-center gap-1">
              <img className="w-16 h-16" viewBox="0 0 40 40" src={signup1} alt="" />
            </div>
          </div>

          <div onClick={() => navigate("/login3")} className="cursor-pointer">
            <h3 className="mt-4 text-[#032D6C]-3xl font-bold sm:text-4xl">
              I am a tech professional and want to become an interviewer
            </h3>
            <p className="mt-1 text-xl text-gray-700">
              I want to take interviews and earn money.
            </p>
          </div>
        </div>
      </article>

      <br />
      <br />

      <article className="w-[80rem] rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
        <div className="flex items-start sm:gap-8">
          <div
            className="hidden sm:grid sm:size-20 sm:shrink-0 sm:place-content-center"
            aria-hidden="true"
          >
            <div className="flex items-center gap-1">
              <img className="w-16 h-16" viewBox="0 0 40 40" src={signup2} alt="" />
            </div>
          </div>

          <div onClick={() => navigate("/login2")} className="cursor-pointer">
            <h3 className="mt-4 text-[#032D6C] text-3xl font-bold sm:text-4xl">
              I am an organisation and want to outsource my interviews
            </h3>
            <p className="mt-1 text-xl text-gray-700">
              As an organisation I want to explore your hiring solutions and get
              my candidates interviewed
            </p>
          </div>
        </div>
      </article>

      <br />
      <br />

      <article className="w-[80rem] rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
        <div className="flex items-start sm:gap-8">
          <div
            className="hidden sm:grid sm:size-20 sm:shrink-0 sm:place-content-center"
            aria-hidden="true"
          >
            <div className="flex items-center gap-1">
              <img className="w-16 h-16" viewBox="0 0 40 40" src={signup3} alt="" />
            </div>
          </div>

          <div onClick={() => navigate("/login1")} className="cursor-pointer">
            <h3 className="mt-4 text-[#032D6C]-3xl font-bold sm:text-4xl">
              I am a candidate and want to give interviews to big companies
            </h3>
            <p className="mt-1 text-xl text-gray-700">
              I want real interview experience with industry experts
            </p>
          </div>
        </div>
      </article>

      <br />

      <div>
        <p className="mt-1 text-2xl text-[#043C90]-700">
          Already have an account?{" "}
          <span
            className="font-bold text-[#043C90]-700 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </section>
  );
}

export default SignupPrimary;
