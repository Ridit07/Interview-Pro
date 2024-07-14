import React from "react";
import "./LoginChoose.css";
import { Link } from "react-router-dom";

function LoginChoose() {
  return (
    <>
      <section id="login-choose">
        <div className="stat-title mt-[3rem]">Login</div>
        <div className="sub-desc text-[#043C90]">
          Choose the plan and interviewer that best fit your requirements.
        </div>
        <div className="plans">
          <div className="plan1">
            <div className="log-content">
                <div className="plan1-desc desc1 text-[#07080B] rounded-2xl">
                    <p>Optimize your Interview with us</p>
                </div>
              <div>
                <p className="plan-type">For Companies</p>
                {/* <p className="login-desc">Basic Plan</p> */}
              </div>
              <div className="features1 ">
                <p className="f text-center text-xl text-[#09005F] mt-[1.5rem]">
                  Utilize InterviewPro's platform to conduct interviews <br></br> asynchronously with screened interviewers. Access a detailed
                  candidate performance report in under 5 minutes.
                </p>
              </div>
            </div>

            <Link to="/signup2" className="primary logbutton  mb-[3rem]">
              Login
            </Link>
          </div>
          <div className="plan1">
            <div className="log-content">
            <div className="plan1-desc desc2 text-[#07080B] rounded-2xl">
                    <p>Get hired with us</p>
                </div>
              <div>
                <p className="plan-type">For Candidates</p>
                {/* <p className="login-desc">Basic Plan</p> */}
              </div>
              <div className="features1">
                <p className="f text-center text-xl text-[#09005F]  mt-[1.5rem]">
                  Discover the preferred platform relied upon by top-tier
                  companies across the industry for conducting their interviews
                  with unparalleled efficiency and effectiveness
                </p>
              </div>
            </div>
            <Link to="/condilogin" className="primary logbutton mb-[3rem]">
              Login
            </Link>
          </div>
          <div className="plan1">
            <div className="log-content">
            <div className="plan1-desc desc3 text-[#07080B] rounded-2xl">
                    <p>Grow and upskill with us</p>
                </div>
              <div>
                <p className="plan-type">For Interviewers</p>
                {/* <p className="login-desc">Basic Plan</p> */}
              </div>
              <div className="features1">
                <p className="f text-center text-xl text-[#09005F] mt-[1.5rem]">
                  Join the premier interview <br></br> platform in the market and <br></br>embark
                  on a journey of growth alongside us. Participate in interviews
                  with us and advance your career with our innovative platform
                </p>
              </div>
            </div>
            <Link to="/interlogin" className="primary logbutton mb-[3rem]">
              Login
            </Link>
          </div>
        </div>
        <p className="sub-desc">
          Don't have an account? 
          <Link to="/signprimary" className="text-blue-700">
             Register
          </Link>
          .
        </p>
      </section>
    </>
  );
}

export default LoginChoose;
