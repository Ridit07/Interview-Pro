import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { PiStack } from "react-icons/pi";
// import { LiaLaptopCodeSolid } from "react-icons/lia";
// import { GoFileCode } from "react-icons/go";
// import { TbDatabaseCog } from "react-icons/tb";
// import { TbDeviceMobileCode } from "react-icons/tb";
import Pricingpage2 from "./pricingpage2";
import { useNavigate } from "react-router-dom";



function reqInterview5() {
  const navigate = useNavigate();
  const [candidateName, setCandidateName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");  
  const [resume, setResume] = useState(null);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("candidateName", candidateName);
    formData.append("phoneNumber", phoneNumber);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("resume", resume);

    fetch("http://localhost:5000/api/save_candidate_data", {   
                                
      method: "POST",
      credentials: 'include' ,
      body: formData,
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

    navigate("/pricing2");
    };


  return (
    <section>
      <div className="bg-white">
        <h3 className="ml-4 font-bold text-xl mt-[0.6rem] mb-4 text-[#043C90]">Add Candidate</h3>
        <hr></hr>
        <h4 className="m-4 font-bold text-large text-[#043C90]">Candidate Name</h4>
        <input type="text" placeholder="Full Name" className="block m-4 w-[45rem] rounded-2xl h-11 bg-[#d9dadd] text-[#09005F]" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
        <h4 className="m-4 font-bold text-large text-[#043C90]">Phone Number</h4>
        <input type="text" placeholder="Phone Number" className="block m-4 w-[45rem] rounded-2xl h-11 bg-[#d9dadd] text-[#09005F]" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        <h4 className="m-4 font-bold text-large text-[#043C90]">Email Address</h4>
        <input type="email" placeholder="Email Address" className="block m-4 w-[45rem] rounded-2xl h-11 bg-[#d9dadd] text-[#09005F]" value={email} onChange={(e) => setEmail(e.target.value)} />
        <h4 className="m-4 font-bold text-large text-[#043C90]">Password</h4>
        <input type="password" placeholder="Password" className="block m-4 w-[45rem] rounded-2xl h-11 bg-[#d9dadd] text-[#09005F]" value={password} onChange={(e) => setPassword(e.target.value)} />
        <h4 className="m-4 font-bold text-large text-[#043C90]">Resume</h4>
        <input type="file" className="block w-[45rem] px-3 py-2 m-4 text-[#09005F] bg-white border border-[#09005F] rounded-2xl" onChange={(e) => setResume(e.target.files[0])} />






        
        <button onClick={handleSubmit} className="ml-[19rem] mt-2 mb-6 px-14 py-3 font-medium tracking-wide text-large text-white capitalize transition-colors duration-300 transform bg-[#191064] rounded-full hover:bg-gray-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80">Done</button>
      </div>
    </section>
  );
}
export default reqInterview5;
