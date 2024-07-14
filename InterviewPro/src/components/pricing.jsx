import React from "react";
import "./pricing.css";
function Pricing() {
  return (
    <section id="pricing">
      <div className="stat-title mt-[4rem]">Pricing</div>
      <div>
        Choose the plan and interviewer that best fit your requirements.
      </div>
      <div className="plans mt-[5rem]">
        <div className="plan">
          <div className="content">
            <div>
              <p className="plan-type">FAANG</p>
              <p className="plan-desc">
                Interviewers who have built the best tech products in the world
              </p>
            </div>
            <img
              class="object-cover w-28 h-28 rounded-full pricing-image"
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&h=764&q=100"
              alt=""
            ></img>
            <p className="plan-desc plan-desc1">Interview starts at</p>
            <div className="pricing">
              <span className="price">Rs. 3600/-</span>
            </div>
            <hr></hr>
            <div className="features">
              <p className="f">
                <li>
                  Interviewers from companies like Meta, Amazon, Apple, Google &
                  Netflix
                </li>
              </p>
              <div className="feature">
                <div className="check">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p>
                  <li>Outsource your interviewing</li>
                </p>
              </div>
              <div className="feature">
                <div className="check">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p>
                  <li>
                    Detailed report & recording after the interview is done
                  </li>
                </p>
              </div>
              <div className="feature">
                <div className="check">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p>
                  <li>
                    38 minutes to schedule an interview, 5 minutes to share the
                    report
                  </li>
                </p>
              </div>
            </div>
          </div>
          <button className="primary signup">Sign Up Now</button>
        </div>
        <div className="plan">
          <div className="content">
            <div>
              <p className="plan-type">Hypergrowth</p>
              <p className="plan-desc">
                Interviewers from product companies that build for scale. They
                are well versed with multiple skills
              </p>
            </div>
            <img
              class="object-cover w-28 h-28 rounded-full pricing-image"
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            ></img>
            <p className="plan-desc plan-desc1">Interview starts at</p>
            <div className="pricing">
              <span className="price">Rs. 3200/-</span>
            </div>
            <hr></hr>
            <div className="features">
              <p className="f">
                <li>
                  Interviewers from companies like Uber, Flipkart, Walmart etc.
                </li>
              </p>
              <div className="feature">
                <div className="check">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p>
                  <li>Outsource your interviewing</li>
                </p>
              </div>
              <div className="feature">
                <div className="check">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p>
                  <li>
                    Detailed report & recording after the interview is done
                  </li>
                </p>
              </div>
              <div className="feature">
                <div className="check">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p>
                  <li>
                    38 minutes to schedule an interview, 5 minutes to share the
                    report
                  </li>
                </p>
              </div>
            </div>
          </div>
          <button className="primary signup">Sign Up Now</button>
        </div>
        <div className="plan">
          <div className="content">
            <div>
              <p className="plan-type">Startups</p>
              <p className="plan-desc">
              Interviewers from product companies
that are well versed with multiple
skills.
              </p>
            </div>
            <img
              class="object-cover w-28 h-28 rounded-full pricing-image"
              src="https://images.unsplash.com/photo-1499470932971-a90681ce8530?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
              alt=""
            ></img>
            <p className="plan-desc plan-desc1">Interview starts at</p>
            <div className="pricing">
              <span className="price">Rs. 2800/-</span>
            </div>
            <hr></hr>
            <div className="features">
              <p className="f">
                <li>Interviewers from early staged startups.</li>
              </p>
              <div className="feature">
                <div className="check">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p>
                  <li>Outsource your interviewing</li>
                </p>
              </div>
              <div className="feature">
                <div className="check">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p>
                  <li>
                    Detailed report & recording after the interview is done
                  </li>
                </p>
              </div>
              <div className="feature">
                <div className="check">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p>
                  <li>
                    38 minutes to schedule an interview, 5 minutes to share the
                    report
                  </li>
                </p>
              </div>
            </div>
          </div>
          <button className="primary signup">Sign Up Now</button>
        </div>
        <div className="plan">
          <div className="content">
            <div>
              <p className="plan-type">IT Services</p>
              <p className="plan-desc">
              Interviewers used to the IT Services
work and have trained themselves by
working on different projects .
              </p>
            </div>
            <img
              class="object-cover w-28 h-28 rounded-full pricing-image"
              src="https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
            ></img>
            <p className="plan-desc plan-desc1">Interview starts at</p>
            <div className="pricing">
              <span className="price">Rs. 1300/-</span>
            </div>
            <hr></hr>
            <div className="features">
              <p className="f">
                <li>
                  Interviewers from companies like Sapient, Accenture, TCS, etc.
                </li>
              </p>
              <div className="feature">
                <div className="check">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p>
                  <li>Outsource your interviewing</li>
                </p>
              </div>
              <div className="feature">
                <div className="check">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p>
                  <li>
                    Detailed report & recording after the interview is done
                  </li>
                </p>
              </div>
              <div className="feature">
                <div className="check">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p>
                  <li>
                    38 minutes to schedule an interview, 5 minutes to share the
                    report
                  </li>
                </p>
              </div>
            </div>
          </div>
          <button className="primary signup">Sign Up Now</button>
        </div>
      </div>
    </section>
  );
}
export default Pricing;
