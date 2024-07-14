import React from "react";
import logo from "../assets/logo.png"
function Footer(){
    return(
  <footer className="bg-[#09005F]">
  <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div>
        <div className="text-teal-600">
          <img src={logo} alt="logo" className="h-25 w-60" />
        </div>

        <p className="mt-10 max-w-xs text-white">
        Revolutionizing Hiring.<br></br> Streamline your process with <br></br>skilled interviewers, ensuring <br></br>seamless and effective <br></br>candidate evaluations for your <br></br>organization.
        </p>

      </div>

      <div className="grid grid-cols-1 gap-40 lg:col-span-2 lg:grid-cols-3">
        <div>
          <p className="text-xl text-white">Contact Us</p>

          <ul className="mt-10 space-y-4 text-sm">
            <li>
              <a href="#" className="text-white transition hover:opacity-75"> Sector 2, Dwarka, Delhi </a>
            </li>

            <li>
              <a href="#" className="text-white transition hover:opacity-75">info@interviewpro.com</a>
            </li>

            <li>
              <a href="#" className="text-white transition hover:opacity-75">011-27481234</a>
            </li>

            <li>
              <a href="#" className="text-white transition hover:opacity-75">+91-9643898100</a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xl text-white">Useful Links</p>

          <ul className="mt-10 space-y-4 text-sm">
            <li>
              <a href="/about" className="text-white transition hover:opacity-75"> About </a>
            </li>

            <li>
              <a href="/pricing" className="text-white transition hover:opacity-75"> Pricing </a>
            </li>

            <li>
              <a href="#" className="text-white transition hover:opacity-75"> Feedback </a>
            </li>

          </ul>
        </div>

        {/* <div>
          <p className="text-xl text-white">Solutions</p>

          <ul className="mt-10 space-y-4 text-sm">
            <li>
              <a href="#" className="text-white transition hover:opacity-75"> Startups </a>
            </li>

            <li>
              <a href="#" className="text-white transition hover:opacity-75"> IT Services </a>
            </li>

            <li>
              <a href="#" className="text-white transition hover:opacity-75"> Campuses </a>
            </li>

            <li>
              <a href="#" className="text-white transition hover:opacity-75"> Coding School </a>
            </li>
          </ul>
        </div> */}
      </div>
    </div>

    <p className="text-xs text-white">&copy; 2022. Interview Pro. All rights reserved.</p>
  </div>
</footer>
    )
}
export default Footer;