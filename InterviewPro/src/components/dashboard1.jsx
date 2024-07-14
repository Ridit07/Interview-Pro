import React from "react";
import "./dashboard.css";
import { FcGoogle } from "react-icons/fc";
import { SiTcs } from "react-icons/si";
import { SiSap } from "react-icons/si";
import { SiAccenture } from "react-icons/si";
import { MdDownload } from "react-icons/md";

function Dashboard1() {
  return (
    <>
      <nav
        x-data="{ isOpen: false }"
        class="relative bg-white shadow dark:bg-white"
      >
        <div class="h-[10vh] p-2">
          <div class="flex flex-col md:flex-row justify-between md:items-center">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <a href="#">
                  <h2 className="ml-[1rem] font-bold text-black text-xl">Dashboard</h2>
                </a>

                <div class="hidden mx-10 md:block">
                  <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        class="w-5 h-5 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    </span>

                    <input
                      type="text"
                      class="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-white-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
                      placeholder="Search"
                    />
                  </div>
                </div>
              </div>

              <div class="flex lg:hidden">
                <button
                  type="button"
                  class="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                  aria-label="toggle menu"
                >
                  <svg
                    x-show="!isOpen"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 8h16M4 16h16"
                    />
                  </svg>

                  <svg
                    x-show="isOpen"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div class="flex items-center gap-x-2">
              <div>
                <h1 class="text-xl font-semibold text-black-800 capitalize dark:text-black-800">
                  Ridit Jain
                </h1>
              </div>
              <img
                class="object-cover w-16 h-16 rounded-full"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
                alt=""
              />
            </div>
          </div>
        </div>
      </nav>

      <div class="space-y-6">
        <div class="mt-6 ml-6 flex items-center gap-x-2">
          <img
            class="object-cover w-16 h-16 rounded"
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=faceare&facepad=3&w=688&h=688&q=100"
            alt=""
          />

          <div>
            <h1 class=" text-xl font-semibold text-black-800 capitalize dark:text-black-800">
              Hi, Ridit!
            </h1>
          </div>
        </div>

        <div>
          <h1 class="mb-4 p-4 text-xl font-semibold text-black-800 bg-[#F2F2F7] capitalize dark:text-black-800">
            Current | <span class="text-gray-500">Completed</span>
          </h1>
        </div>
      </div>
      <section class="">
        <div className="flex flex-column justify-evenly">
          <div class="relative mt-4 md:mt-0">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                class="w-5 h-5 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </span>

            <input
              type="text"
              class="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-lg dark:bg-white-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-300"
              placeholder="Search"
            />
          </div>
          <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
            <button className="inline-block border-e px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative">
              Role
            </button>

            <button
              className="inline-block px-4 py-2 text-gray-700 hover:bg-gray-50 focus:relative"
              title="View Orders"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>
            </button>
          </span>
          <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
            <button className="inline-block border-e px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative">
              Type
            </button>

            <button
              className="inline-block px-4 py-2 text-gray-700 hover:bg-gray-50 focus:relative"
              title="View Orders"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>
            </button>
          </span>
          <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
            <button className="inline-block border-e px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative">
              Date
            </button>

            <button
              className="inline-block px-4 py-2 text-gray-700 hover:bg-gray-50 focus:relative"
              title="View Orders"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>
            </button>
          </span>
          <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
            <button className="inline-block border-e px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative">
              Status
            </button>

            <button
              className="inline-block px-4 py-2 text-gray-700 hover:bg-gray-50 focus:relative"
              title="View Orders"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>
            </button>
          </span>

          <div class="relative inline-block ml-40">
            <button class="relative z-10 flex items-center p-2 text-sm text-gray-600 bg-white border border-transparent rounded-md hover:border-[#191064] hover:ring-opacity-40 dark:hover:ring-opacity-40 hover:ring-blue-300 dark:hover:ring-blue-400 hover:ring dark:text-white dark:bg-[#191064] focus:outline-none">
              <span class="mx-1">Sort By</span>
              <svg
                class="w-5 h-5 mx-1"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15.713L18.01 9.70299L16.597 8.28799L12 12.888L7.40399 8.28799L5.98999 9.70199L12 15.713Z"
                  fill="currentColor"
                ></path>
              </svg>
            </button>

            <div class="absolute right-0 z-20 w-56 py-2 mt-2 overflow-hidden origin-top-right bg-white rounded-md shadow-xl dark:bg-gray-800 invisible hover:visible">
              <a
                href="#"
                class="flex items-center p-3 -mt-2 text-sm text-gray-600 transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <img
                  class="flex-shrink-0 object-cover mx-1 rounded-full w-9 h-9"
                  src="https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?ixid=MnwxMjA3fDB8MHxzZWFyY2h8N3x8d29tYW4lMjBibHVlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=face&w=500&q=200"
                  alt="jane avatar"
                />
                <div class="mx-1">
                  <h1 class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Jane Doe
                  </h1>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    jandoe@exampl.com
                  </p>
                </div>
              </a>

              <hr class="border-gray-200 dark:border-gray-700" />

              <a
                href="#"
                class="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                view profile
              </a>

              <a
                href="#"
                class="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Settings
              </a>

              <a
                href="#"
                class="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Keyboard shortcuts
              </a>

              <hr class="border-gray-200 dark:border-gray-700" />

              <a
                href="#"
                class="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Company profile
              </a>

              <a
                href="#"
                class="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Team
              </a>

              <a
                href="#"
                class="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Invite colleagues
              </a>

              <hr class="border-gray-200 dark:border-gray-700" />

              <a
                href="#"
                class="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Help
              </a>
              <a
                href="#"
                class="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Sign Out
              </a>
            </div>
          </div>

          <a
            className="inline-block rounded-full border border-[#191064] p-3 text-[#191064] hover:bg-[#191064] hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
            href="#"
          >
            <span className="sr-only"> Download </span>

            <MdDownload className="size-6" />
          </a>
        </div>

        <div class="flex flex-col mt-6">
          <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div class="overflow-hidden">
                <table class="min-w-full divide-y divide-gray-300 dark:divide-black-800">
                  <thead class="bg-white-50 dark:bg-white-800">
                    <tr>
                      <th
                        scope="col"
                        class="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        <div class="flex items-center gap-x-3 ml-[12rem]">
                          <span>Name</span>
                        </div>
                      </th>

                      <th
                        scope="col"
                        class="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        <button class="flex items-center gap-x-2">
                          <span>Role</span>
                        </button>
                      </th>

                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        <button class="flex items-center gap-x-2">
                          <span>Type</span>
                        </button>
                      </th>

                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Time
                      </th>

                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Duration
                      </th>

                      <th
                        scope="col"
                        class="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200 dark:divide-gray-300 dark:bg-white-900">
                    <tr>
                      <td class="px-4 py-4 text-sm font-medium text-black-700 whitespace-nowrap">
                        <div class="inline-flex items-center gap-x-3">
                          <div class="flex items-center gap-x-2">
                            <FcGoogle class="object-cover w-10 h-10 rounded-full mr-24 ml-12" />
                            <div>
                              <h2 class="font-bold text-black-800 dark:text-black ">
                                Google
                              </h2>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div class="inline-flex items-center px-3 py-1 gap-x-2">
                          <h2 class="text-sm font-bold text-black-800">
                            Front End
                          </h2>
                        </div>
                      </td>
                      <td class="font-bold px-4 py-4 text-sm text-black-500 dark:text-black-800 whitespace-nowrap">
                        Assignment
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 class="font-bold text-gray-700 dark:text-black">
                            Jan 2, 2022
                          </h4>
                          <p class="font-bold text-gray-500 dark:text-gray-400">
                            12:00 AM IST
                          </p>
                        </div>
                      </td>
                      <td class="px-4 py-4 text-sm text-black-500 font-bold dark:text-black-800 whitespace-nowrap">
                        1 hr
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <td class="py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div class="inline-flex items-center px-3 py-1 gap-x-2 ">
                            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>

                            <h2 class="text-sm font-normal text-emerald-500">
                              Being Evaluated
                            </h2>
                          </div>
                        </td>
                      </td>
                    </tr>

                    <tr>
                      <td class="px-4 py-4 text-sm font-medium text-black-700 whitespace-nowrap">
                        <div class="inline-flex items-center gap-x-3">
                          <div class="flex items-center gap-x-2">
                            <SiTcs class="object-cover w-10 h-10 mr-24 ml-12" />
                            <div>
                              <h2 class="font-bold text-black-800 dark:text-black ">
                                TCS
                              </h2>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div class="inline-flex items-center px-3 py-1 gap-x-2">
                          <h2 class="text-sm font-bold text-black-800">
                            Back End
                          </h2>
                        </div>
                      </td>
                      <td class="font-bold px-4 py-4 text-sm text-black-500 dark:text-black-800 whitespace-nowrap">
                        Pair Programming
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 class="font-bold text-gray-700 dark:text-black">
                            Jan 2, 2022
                          </h4>
                          <p class="font-bold text-gray-500 dark:text-gray-400">
                            12:00 AM IST
                          </p>
                        </div>
                      </td>
                      <td class="px-4 py-4 text-sm text-black-500 font-bold dark:text-black-800 whitespace-nowrap">
                        1 hr
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <td class="py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          <div class="inline-flex items-center px-3 py-1 gap-x-2 ">
                            <span class="h-1.5 w-1.5 rounded-full bg-orange-500"></span>

                            <h2 class="text-sm font-normal text-orange-500">
                              Upcoming
                            </h2>
                          </div>
                        </td>
                      </td>
                    </tr>

                    <tr>
                      <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div class="inline-flex items-center gap-x-3">
                          <div class="flex items-center gap-x-2">
                            <SiSap class="object-cover w-10 h-10 mr-24 ml-12" />
                            <div>
                              <h2 class="font-bold text-gray-800 dark:text-black">
                                SAP
                              </h2>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-12 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div class="inline-flex items-center px-3 py-1 gap-x-2">
                          <h2 class="text-sm font-bold text-black-800">
                            Back End
                          </h2>
                        </div>
                      </td>
                      <td class="font-bold px-4 py-4 text-sm text-black-500 dark:text-black-800 whitespace-nowrap">
                        Pair Programming
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 class="font-bold text-gray-700 dark:text-black">
                            Jan 2, 2022
                          </h4>
                          <p class="font-bold text-gray-500 dark:text-gray-400">
                            12:00 AM IST
                          </p>
                        </div>
                      </td>
                      <td class="px-4 py-4 text-sm text-black-500 font-bold dark:text-black-800 whitespace-nowrap">
                        2. hr
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <button class="px-12 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#191064] rounded-full hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80">
                          Start
                        </button>
                      </td>
                    </tr>

                    <tr>
                      <td class="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                        <div class="inline-flex items-center gap-x-3">
                          <div class="flex items-center gap-x-2">
                            <SiAccenture class="object-cover w-10 h-10 mr-24 ml-12" />
                            <div>
                              <h2 class="font-bold text-gray-800 dark:text-black">
                                Accenture
                              </h2>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="px-12 py-4 text-sm font-bold text-gray-700 whitespace-nowrap">
                        <div class="inline-flex items-center px-3 py-1 gap-x-2">
                          <h2 class="text-sm font-bold text-black-800">
                            Back End
                          </h2>
                        </div>
                      </td>
                      <td class="font-bold px-4 py-4 text-sm text-black-500 dark:text-black-800 whitespace-nowrap">
                        Technical Interview
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <div>
                          <h4 class="font-bold text-gray-700 dark:text-black">
                            Jan 2, 2022
                          </h4>
                          <p class="font-bold text-gray-500 dark:text-gray-400">
                            12:00 AM IST
                          </p>
                        </div>
                      </td>
                      <td class="px-4 py-4 text-sm text-black-500 font-bold dark:text-black-800 whitespace-nowrap">
                        1.5 hr
                      </td>
                      <td class="px-4 py-4 text-sm whitespace-nowrap">
                        <button class="px-12 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#191064] rounded-full hover:bg-gray-500 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-80">
                          Start
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export default Dashboard1;