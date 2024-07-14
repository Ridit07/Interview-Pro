import React from "react";
function How2() {
    return (
        <>
            <h2 className='mt-[6rem] text-5xl text-[#032D6C] font-bold text-center w-full mt-5'>Shorten your Interview Process</h2>
            <p className="text-center text-xl mt-5 mb-[5rem] text-[#043C90]">Screen, interview and shortlist the best candidates all in one place</p>
            <div className="ml-[12rem] m-10 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-0">

                <div className="plan2 w-[35rem]">
                    <div className="log-content">
                        <div>
                            <p className="plan-type mt-[4rem] ">Outsource <br></br> Interviews</p>
                            {/* <p className="login-desc">Basic Plan</p> */}
                        </div>
                        <div className="features1 ">
                            <p className="f text-center text-2xl text-[#032D6C] mt-[4rem] ml-[3rem] mr-[3rem]">
                                Efficiently outsource interviews to streamline hiring processes, ensuring quality candidates and saving valuable time for your company's growth
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section2  */}
                <div className="plan2 w-[35rem]">
                    <div className="log-content">
                        <div>
                            <p className="plan-type mt-[4rem]">Report <br></br> Generation</p>
                            {/* <p className="login-desc">Basic Plan</p> */}
                        </div>
                        <div className="features1 ">
                            <p className="f text-center text-2xl text-[#032D6C] mt-[4rem] ml-[3rem] mr-[3rem]">
                            Our website enables dynamic report generation, transforming raw data into clear, insightful reports, enhancing decision-making with customizable, real-time analytics and visualizations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default How2;