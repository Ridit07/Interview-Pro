import React from "react";
import signup1 from "../assets/signup1.png";
import signup2 from "../assets/signup2.png";
import signup3 from "../assets/signup3.png";
function SignupPrimary() {
  return (
    <section id="pricing">
      <div>
        <h3 class="mt-4 text-[#032D6C]-3xl font-bold sm:text-5xl">
          {" "}
          How do you wish to avail our services{" "}
        </h3>

        <p class="mt-1 text-2xl text-[#043C90]-700 text-center">
          We will tailor your experience to suit your preferences.
        </p>
      </div>

      <br></br>
      <br></br>

      <article class="w-[80rem] rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
        <div class="flex items-start sm:gap-8">
          <div
            class="hidden sm:grid sm:size-20 sm:shrink-0 sm:place-content-center"
            aria-hidden="true"
          >
            <div class="flex items-center gap-1">
              <img class="w-16 h-16" viewBox="0 0 40 40" src={signup1} alt="" />
            </div>
          </div>

          <a href="/login3">
            <div>
              <h3 class="mt-4 text-[#032D6C]-3xl font-bold sm:text-4xl">
                I am a tech professional and want to become an interviewer
              </h3>
              <p class="mt-1 text-xl text-gray-700">
                I want to take interviews and money.
              </p>
            </div>
          </a>
        </div>
      </article>

      <br></br>
      <br></br>

      <article class="w-[80rem] rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
        <div class="flex items-start sm:gap-8">
          <div
            class="hidden sm:grid sm:size-20 sm:shrink-0 sm:place-content-center"
            aria-hidden="true"
          >
            <div class="flex items-center gap-1">
              <img class="w-16 h-16" viewBox="0 0 40 40" src={signup2} alt="" />
            </div>
          </div>

          <a href="/login2">
            <div>
              <h3 class="mt-4 text-[#032D6C] text-3xl font-bold sm:text-4xl">
                {" "}
                I am an organisation and want to outsource my interviews{" "}
              </h3>

              <p class="mt-1 text-xl text-gray-700">
                As an organisation I want to explore your hiring solutions and get
                my candidates interviewed
              </p>
            </div>
          </a>
        </div>
      </article>

      <br></br>
      <br></br>

      <article class="w-[80rem] rounded-xl bg-white p-4 ring ring-indigo-50 sm:p-6 lg:p-8">
        <div class="flex items-start sm:gap-8">
          <div
            class="hidden sm:grid sm:size-20 sm:shrink-0 sm:place-content-center"
            aria-hidden="true"
          >
            <div class="flex items-center gap-1">
              <img class="w-16 h-16" viewBox="0 0 40 40" src={signup3} alt="" />
            </div>
          </div>

          <a href="/login1">
            <div>
              <h3 class="mt-4 text-[#032D6C]-3xl font-bold sm:text-4xl">
                {" "}
                I am a candidate and want to give interviews to big companies{" "}
              </h3>

              <p class="mt-1 text-xl text-gray-700">
                I want real interview experience with industry experts
              </p>
            </div>
          </a>
        </div>
      </article>

      <br></br>

      <div>
        <p class="mt-1 text-2xl text-[#043C90]-700">
          Already have an account?{" "}
          <a class="font-bold text-[#043C90]-700" href="/login">Login</a>
        </p>
      </div>
    </section>
  );
}
export default SignupPrimary;