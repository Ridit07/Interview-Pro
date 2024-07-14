import React, { useState } from 'react';
import { PiQuotes } from "react-icons/pi";

const feedbackData = [
    {
        text: "My university experience has been outstanding, thanks to the dedicated faculty, diverse opportunities, and a supportive community. It's where I've grown academically and personally, making lifelong connections along the way.",
        name: "Mia Brown",
        role: "Graduate of 2022, Department of CSE",
        imageUrl: "https://images.unsplash.com/photo-1499470932971-a90681ce8530?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    },
    {
        text: "This incredible institution has provided me with invaluable knowledge, lifelong friendships, and a sense of empowerment that will undoubtedly shape my future endeavors. The dedication of the faculty and the vibrant campus life have made my journey here truly remarkable.",
        name: "Olivia Wilson",
        role: "Graduate of 2021, Department of Environmental Studies",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        text: "The university's diverse course offerings and hands-on learning opportunities have prepared me well for my future career. I'm grateful for the supportive faculty and vibrant campus life that made my time here truly memorable.",
        name: "Emily Johnson",
        role: "Graduate of 2023, Department of Business Administration",
        imageUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1886&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        text: "My experience at this university has been nothing short of transformative. The nurturing environment and comprehensive resources have empowered me to explore my passion, develop critical thinking skills, and forge lasting connections.",
        name: "Michael Thompson",
        role: "Graduate of 2022, Department of Psychology",
        imageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    }
];

function FeedbackHome() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleLeftArrowClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? feedbackData.length - 1 : prevIndex - 1));
    };

    const handleRightArrowClick = () => {
        setCurrentIndex((prevIndex) => (prevIndex === feedbackData.length - 1 ? 0 : prevIndex + 1));
    };

    const currentFeedback = feedbackData[currentIndex];

    return (
        <>
            <h2 className='mt-[7rem] text-4xl text-[#09005F] font-bold text-center w-full'>Feedback</h2>
            <h2 className='mt-[1.5rem] text-xl text-[#043C90] font-lg text-center w-full'>The shareholders we have helped so far</h2>
            <section className="bg-white dark:bg-white-900">
                <div className="container px-6 py-4 mx-auto">
                    <div className="flex justify-center mx-auto">
                        <PiQuotes className='h-20 w-10' />
                    </div>
                    <div className="flex items-start ml-[15.5rem] max-w-6xl mx-auto mt-6">
                        <button
                            title="left arrow"
                            className="mr-[4rem] hidden p-2 text-gray-800 transition-colors duration-300 border rounded-full rtl:-scale-x-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 lg:block hover:bg-gray-100"
                            onClick={handleLeftArrowClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div>
                            <p className="flex items-center text-center text-[#344054] font-bold lg:mx-8 w-[45rem]">
                                {currentFeedback.text}
                            </p>
                            <div className="flex flex-col items-center justify-center mt-8 mb-[2rem]">
                                <img className="object-cover rounded-full w-14 h-14" src={currentFeedback.imageUrl} alt="" />
                                <div className="mt-4 text-center">
                                    <h1 className="font-semibold text-[#09005F]">{currentFeedback.name}</h1>
                                    <span className="text-sm text-[#344054]">{currentFeedback.role}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            title="right arrow"
                            className="ml-[4rem] hidden p-2 text-gray-800 transition-colors duration-300 border rounded-full rtl:-scale-x-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 lg:block hover:bg-gray-100"
                            onClick={handleRightArrowClick}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
}

export default FeedbackHome;