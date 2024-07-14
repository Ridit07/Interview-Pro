import React from "react";
import Navbar from "../components/navbar";
import How from "../components/how";
import How2 from "../components/how2";
import Footer from "../components/footer";
import Hero from "../components/hero";
import FeedbackHome from "../components/feedbackhome";
function Homepage(){
    return(
        <>
        <Navbar/>
        <Hero/>
        <How/>
        <How2/>
        <FeedbackHome/>
        <Footer/>
        </>
    )
}
export default Homepage;