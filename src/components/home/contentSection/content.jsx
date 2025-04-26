import React from 'react';
import TopBar from '../topbar.jsx';
import RightSide from './rightContainer.jsx';
import MotivationDiv from './motivationDiv.jsx';
import Carousel from './carousel.jsx';

const Content=()=>{
return(
<section className=" w-[calc(100%-160px)] h-screen bg-gray-200 ml-[160px] "> 
   <TopBar></TopBar>
   <div className="flex w-full h-fit">
      <div className="flex flex-col w-[75%] h-[600px]">   
        <MotivationDiv/>
        <Carousel/>
      </div>
      <RightSide/>
   </div>
</section>
);
};

export default Content;