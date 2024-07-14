import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import linkedin from "../assets/linkedin.png";
import abstraction from "../assets/Abstraction.png";
import logo from "../assets/logo.png";


function Interlogin(){
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
  
    const handleLogin = async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = {
        email: formData.get('email'),
        password: formData.get('password_confirmation')
      };
  
      try {
        const response = await fetch('http://localhost:5000/api/interviewer_login', {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
  
        const jsonData = await response.json();
        if (response.ok) {
          localStorage.setItem("interviewer_id", jsonData.interviewer_id);
          localStorage.setItem("interviewer_name", jsonData.interviewer_name);
          localStorage.setItem("interviewer_email", jsonData.interviewer_email);
          localStorage.setItem("interviewer_company", jsonData.interviewer_company);
  
          navigate("/dashboard4");
        } else {
          console.error('Login Failed:', jsonData.error);
          setErrorMessage("Wrong email or password. Please try again.");
        }
      } catch (error) {
        console.error('Network Error:', error);
        setErrorMessage("Network error. Please try again later.");
      }
    };




    return (
      <section className="bg-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
  
          <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
  
            <img
              alt=""
              src={abstraction}
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
  
            <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-white" href="/home">
              <span className="sr-only">Home</span>
              <img src={logo} alt="Logo" className="h-12 w-100" />
            </a>
  
              <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                Welcome to InterviewPro
              </h2>
  
             
            </div>
          </section>
  
          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <div className="relative -mt-16 block lg:hidden">
                <a
                  className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                  href="#"
                >
                  <span className="sr-only">Home</span>
                  <svg
                    className="h-8 sm:h-10"
                    viewBox="0 0 28 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
              
              <h2 className="mt-0 text-2xl font-bold text-[#09005F] sm:text-3xl md:text-4xl">
                Login as a Interviewer
              </h2>
  
              <h2 className="mt-6 text-lg font-bold text-black sm:text-3xl md:text-4xl">
                Get into your Account
              </h2>
  
              <div className="flex justify-between ">
                <a
                  href="#"
                  class="flex items-center justify-center mt-4 mr-5 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text--200 hover:bg-white-500 dark:hover:bg-blue-600"
                >
                  <div class="px-4 py-2">
                    <svg class="w-6 h-6" viewBox="0 0 40 40">
                      <path
                        d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                        fill="#FFC107"
                      />
                      <path
                        d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                        fill="#FF3D00"
                      />
                      <path
                        d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                        fill="#4CAF50"
                      />
                      <path
                        d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                        fill="#1976D2"
                      />
                    </svg>
                  </div>
  
                  <span class="w-5/6 px-4 py-3 font-bold text-center">
                    Sign in with Google
                  </span>
                </a>
                <a
                  href="#"
                  class="flex items-center justify-center mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <div class="px-4 py-2">
                    <img
                      class="w-6 h-6"
                      viewBox="0 0 40 40"
                      src={linkedin}
                      alt="linkedin"
                    />
                  </div>
  
                  <span class="w-5/6 px-4 py-3 font-bold text-center">
                    Sign in with LinkedIn
                  </span>
                </a>
              </div>
  
              <form className="mt-8 grid grid-cols-6 gap-6" onSubmit={handleLogin} > 
              {/* onSubmit={handleLogin} */}
  
  <div className="col-span-6">
    <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
      Work Email Address
    </label>
    <input
      type="email"
      id="Email"
      name="email"
      className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
    />
  </div>
 
  <div className="col-span-6">
    <label htmlFor="PasswordConfirmation" className="block text-sm font-medium text-gray-700">
      Password
    </label>
    <input
      type="password"
      id="PasswordConfirmation"
      name="password_confirmation"
      className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
    />
  </div>
  <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
    <button type="submit"
      className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-[#032d6c]"
    >
      Login IN
    </button>
  </div>
</form>
{errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}

            </div>
          </main>
        </div>
      </section>
    );
}
export default Interlogin;