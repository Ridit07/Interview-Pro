import React from "react";
import { Link } from "react-router-dom";
import about1 from "../assets/about1.png";
import about2 from "../assets/about2.png";
import about3 from "../assets/about3.png";
import about4 from "../assets/about4.png";
import about5 from "../assets/about5.png";
import ridit_pic from "/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/src/assets/ridit_pic.jpeg";
import Lavanya_pic from "/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/src/assets/Lavanya_pic.jpeg";
import akj_pic from "/Users/riditjain/Downloads/Interview-Pro-main/InterviewPro/src/assets/akj_pic.jpeg";

function About() {
  return (
    <>
      <div className="bg-[#f1f4f5]">
        <h2 className="pt-28 text-center text-2xl font-bold text-[#09005F] sm:text-3xl md:text-4xl">
          Who We Are
        </h2>
        <div className="flex justify-center items-center">
          <p className="w-[45rem] mr-[6rem] text-justify text-xl font-semibold mt-6">
            We are the innovative solution born from a critical gap within the
            software industry's hiring landscape. Our purpose is clear: to
            revolutionize technical hiring, ensuring fairness and efficiency
            throughout the process. Recognizing the challenges faced by
            companies in sourcing skilled tech talent while navigating biases,
            we've engineered a groundbreaking platform. By seamlessly
            integrating advanced technologies like Natural Language Processing
            (NLP) and Deep Learning (DL), we offer a remote-friendly interview
            experience that levels the playing field for all candidates. Our
            focus extends beyond mere recruitment; we strive to simplify the
            entire journey, making it equally beneficial for companies and
            applicants. With innovation at our core, we are shaping a future
            where technical hiring is synonymous with integrity, inclusivity,
            and excellence.
          </p>

          <img
            className="m-0 pb-10 object-cover w-[35rem] h-[35rem] rounded-xl"
            src={about1}
            alt=""
          />
        </div>
      </div>

      <h2 className="my-[3rem] text-center text-2xl font-bold text-[#09005F] sm:text-3xl md:text-4xl">
        Meet Our Team
      </h2>

      {/* Updated Team Section */}
      <div className="flex justify-center items-center">
        <div>
          <img
            className="object-cover mx-[3rem] w-[24rem] h-[18rem] rounded-xl"
            src={ridit_pic}
            alt="Ridit Jain"
          />
          <h2 className="my-[1rem] text-center text-large font-bold text-[#09005F]">
            Ridit Jain
          </h2>
        </div>

        <div>
          <img
            className="object-cover mx-[3rem] w-[24rem] h-[18rem] rounded-xl"
            src={Lavanya_pic}
            alt="Lavanya Anand"
          />
          <h2 className="my-[1rem] text-center text-large font-bold text-[#09005F]">
            Lavanya Anand
          </h2>
        </div>

        <div>
          <img
            className="object-cover mx-[3rem] w-[24rem] h-[18rem] rounded-xl"
            src={akj_pic}
            alt="Akshay Kumar Jain"
          />
          <h2 className="my-[1rem] text-center text-large font-bold text-[#09005F]">
            Akshay Kumar Jain
          </h2>
        </div>
      </div>
    </>
  );
}

export default About;

