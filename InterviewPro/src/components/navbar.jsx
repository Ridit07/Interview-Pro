import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`bg-white fixed top-0 w-full z-10 transition-colors duration-300 ${
        isScrolled ? "bg-gray-800" : ""
      }`}
    >
      <div className="lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <Link to="/home" className="block text-teal-600 h-50">
              <span className="sr-only">Home</span>
              <img src={logo} alt="Logo" className="h-12 w-100" />
            </Link>
          </div>
          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-20 text-sm">
                <li>
                  <Link
                    className={`text-[#09005F] text-lg transition-colors duration-300 `}
                    to="/about"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    className={`text-[#09005F] text-lg transition-colors duration-300`}
                    to="/pricing"
                  >
                    Pricing
                  </Link>
                </li>
                {/* <li>
                  <Link
                    className={`text-[#09005F] text-lg transition-colors duration-300 `}
                    to="/login1"
                  >
                    Feedback
                  </Link>
                </li> */}
                <li>
                  <Link
                    className={`text-[#09005F] text-lg transition-colors duration-300`}
                    to="/contact"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <Link
                className={`rounded-xl bg-[#09005F] px-5 py-2.5 text-sm font-medium text-white shadow transition-colors duration-300`}
                to="/login"
              >
                Login
              </Link>
              <div className="hidden sm:flex">
                <Link
                  className={`rounded-xl bg-[#09005F] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-300`}
                  to="/signprimary"
                >
                  Sign Up
                </Link>
              </div>
            </div>
            <div className="block md:hidden">
              <button
                className={`rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 ${
                  isScrolled ? "bg-gray-700 text-white" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;