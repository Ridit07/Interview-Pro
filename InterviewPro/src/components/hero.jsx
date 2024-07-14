import React from 'react'
import { Link } from "react-router-dom";
import { PiStack } from "react-icons/pi";
import { LiaLaptopCodeSolid } from "react-icons/lia";
import { GoFileCode } from "react-icons/go";
import { TbDatabaseCog } from "react-icons/tb";
import { TbDeviceMobileCode } from "react-icons/tb";
import bggif from "../assets/bggif.gif"

function Hero() {
  return (
    <>
      <header>
        <div className="w-full bg-center bg-cover h-[42rem]" style={{  backgroundImage: `url(${bggif})` }}>
          <div className="flex items-center justify-center w-full h-full bg-gray-900/40">
            <div className="text-center h-[20rem]">
              <h2 className="m-8 font-semibold text-white lg:text-3xl">Welcome to InterviewPro </h2>
              <h1 className="m-8 font-semibold text-white lg:text-6xl">Elevate Your Hiring Journey <br />
                with Expert Interview Support!</h1>
              <Link to="/signprimary">
              <button className="w-full px-20 py-3 mt-4 text-sm font-medium text-[#09005F] capitalize transition-colors duration-300 transform bg-white lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">Choose the role</button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="top-[36.5rem] absolute grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-20">
        <article
          className="ml-[3.3rem] h-[10rem] w-[13rem] justify-center rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6"
        >
          <div className='ml-8 mt-2'>
            <LiaLaptopCodeSolid className='ml-2.5 h-20 w-20' />
            <div className="">
              <span className="text-2xl font-semibold text-[#09005F]">Frontend</span>
            </div>
          </div>
        </article>

        <article
          className="ml-[3.3rem] h-[10rem] w-[13rem] justify-center rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6"
        >
          <div className='ml-9 mt-2'>
            <GoFileCode className='mt-3 mb-3 ml-4 h-16 w-16' />
            <div className="">
              <span className="text-2xl font-semibold text-[#09005F]">Backend</span>
            </div>
          </div>
        </article>

        <article
          className="ml-[3.3rem] h-[10rem] w-[13rem] justify-center rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6"
        >
          <div className='ml-8 mt-2'>
            <PiStack className='ml-5 h-16 w-16' />
            <div className="mt-4">
              <span className="text-2xl font-semibold text-[#09005F]">Full Stack</span>
            </div>
          </div>
        </article>

        <article
          className="ml-[3.3rem] h-[10rem] w-[13rem] justify-center rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6"
        >
          <div className='ml-2 mt-2'>
            <TbDatabaseCog className='ml-10 h-16 w-16' />
            <div className="mt-4">
              <span className="text-2xl font-semibold text-[#09005F]">Data Science</span>
            </div>
          </div>
        </article>

        <article
          className="ml-[3.3rem] h-[10rem] w-[13rem] justify-center rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6"
        >
          <div className='ml-8 mt-2'>
            <TbDeviceMobileCode className='ml-4 h-16 w-16' />
            <div className="mt-4">
              <span className="text-2xl font-semibold text-[#09005F]">App Dev</span>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}

export default Hero