import React from 'react';
import TopBar from '../topbar.jsx';
import RightSide from './rightContainer.jsx';
import MotivationDiv from './motivationDiv.jsx';
import TodaySchedule from './todaySchedule.jsx';
import Carousel from './carousel.jsx';

const Content=()=>{
return(
<section className=" w-[calc(100%-70px)] pr-[35px] h-full ml-[70px] "> 
   <TopBar></TopBar>
   <div className="flex w-full min-h-[calc(100%-120px)]">
      <div className="flex flex-col w-[calc(100%-250px)] h-fit px-[20px]">   
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