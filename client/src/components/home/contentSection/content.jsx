import React from 'react';
import TopBar from '../topbar.jsx';
import RightSide from './rightContainer.jsx';
import MotivationDiv from './motivationDiv.jsx';
import Carousel from './carousel.jsx';

const Content=()=>{
return(
<section className=" w-[calc(100%-100px)] h-screen ml-[100px] "> 
   <TopBar></TopBar>
   <div className="flex w-full min-h-[calc(100%-120px)]">
      <div className="flex flex-col w-[75%] h-fit">   
        <MotivationDiv/>
        <Carousel/>
      </div>
      <RightSide/>
   </div>
</section>
);
};

export default Content;