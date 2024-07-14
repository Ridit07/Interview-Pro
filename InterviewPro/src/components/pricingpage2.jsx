import React from "react";
import "./pricing.css";
import { useNavigate } from "react-router-dom";


const plans = [
  { type: "FAANG", desc: "Interviewers who have built the best tech products in the world", price: "Rs. 3600/-", imgSrc: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90oy1wYWgefHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&h=764&q=100" },
  { type: "Hypergrowth", desc: "Interviewers from product companies that build for scale", price: "Rs. 3200/-", imgSrc: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWgefHx8fGVufDB8fHx8fA%3D%3D" },
  { type: "Startups", desc: "Interviewers from product companies that are well versed with multiple skills.", price: "Rs. 2800/-", imgSrc: "https://images.unsplash.com/photo-1499470932971-a90681ce8530?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90oy1wYWgefHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" },
  { type: "IT Services", desc: "Interviewers used to the IT Services work and have trained themselves by working on different projects", price: "Rs. 1300/-", imgSrc: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90oy1wYWgefHx8fGVufDB8fHx8fA%3D%3D" }
];

function Pricingpage2() {
  const navigate = useNavigate();

  const handlePlanSelect = (index) => {
    // Assuming your backend endpoint is set up at this URL
    const apiUrl = "http://localhost:5000/api/select_plan";
    fetch(apiUrl, {
      method: "POST",
      credentials: 'include' ,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ planId: index + 1 }) // Send the plan index incremented by 1
    })
    .then(response => response.json())
    .then(data => console.log("Plan selected:", data))
    .catch(error => console.error('Error:', error));

    navigate("/dashboard6");

  };

  return (
    <section id="pricing">
      <div className="stat-title mt-[4rem]">Pricing</div>
      <div>Choose the plan and interviewer that best fit your requirements.</div>
      <div className="plans mt-[5rem]">
        {plans.map((plan, index) => (
          <div key={index} className="plan">
            <div className="content">
              <p className="plan-type">{plan.type}</p>
              <p className="plan-desc">{plan.desc}</p>
              <img className="object-cover w-28 h-28 rounded-full pricing-image" src={plan.imgSrc} alt=""></img>
              <p className="plan-desc plan-desc1">Interview starts at</p>
              <div className="pricing"><span className="price">{plan.price}</span></div>
              <hr />
              <ul className="features">
                <li>Outsource your interviewing</li>
                <li>Detailed report & recording after the interview is done</li>
                <li>38 minutes to schedule an interview, 5 minutes to share the report</li>
              </ul>
              <button className="primary signup" onClick={() => handlePlanSelect(index)}>Choose this</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pricingpage2;
