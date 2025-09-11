import React from 'react';
import TopBar from '../topbar.jsx';
import RightSide from './rightContainer.jsx';
import MotivationDiv from './motivationDiv.jsx';
import TodaySchedule from './todaySchedule.jsx';
import Carousel from './carousel.jsx';

const Content=()=>{
return(
<section className=" w-[calc(100%-70px)] max-[675px]:w-[100%] pr-[35px] h-full ml-[70px] max-[985px]:pr-[15px] max-[675px]:px-[20px] max-[675px]:ml-[0px]"> 
   <TopBar></TopBar>
   <div className="flex w-full min-h-[calc(100%-120px)] max-[985px]:flex-col">
      <div className="flex flex-col w-[calc(100%-250px)] h-fit px-[20px] max-[985px]:px-[0px] max-[985px]:w-full">   
        <MotivationDiv/>
        <TodaySchedule/>
        <Carousel/>
      </div>
      <RightSide/>
   </div>
</section>
);
};

export default Content;