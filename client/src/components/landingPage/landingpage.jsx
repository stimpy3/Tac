import React from 'react';
import TopSection from './topsection';
import LandingContent from './contentPart/landingContent.jsx';
import Footer from './footer';

const LandingPage=()=>{
    return(
        <div className="flex flex-col w-full h-fit">
            <TopSection/>
            <LandingContent/>
            <Footer/>
        </div>
    );
};

export default LandingPage;