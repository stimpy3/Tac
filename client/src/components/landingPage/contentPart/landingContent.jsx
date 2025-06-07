import React from 'react';
import { gsap } from "gsap";
import { useRef, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger); // ← This is required

const LandingContent=()=>{

 const txtRef=useRef(null);
  const circleRef=useRef(null);
 useEffect(() => {
   const txtDiv = txtRef.current;
   gsap.to(txtDiv, {
      opacity: 1,
      duration: 1,
      scrollTrigger: {
        trigger: txtRef.current,
        start: "top 80%",  // when top of text hits 80% viewport height
        end: "top 40%",
        toggleActions: "play none none none",
        markers: true, // optional for debugging
      }
    });

  const txt = txtRef.current.querySelectorAll("p"); // 👈 all <p> elements inside
  gsap.to(txt, {
    opacity: 1,
    duration: 1.2,
    delay: 0.3,
    y:-20,
    stagger: 0.3,
    scrollTrigger: {
      trigger: txtRef.current,
      start: "top 80%",
      end: "top 40%",
      toggleActions: "play none none none",
      markers: true,
    },
  });

   const circle = circleRef.current;
    gsap.to(circle, {
    opacity: 1,
    scale:3,
    stagger: 0.3,
    scrollTrigger: {
      trigger: circleRef.current,
      start: "top 80%",
      end: "top 40%",
      toggleActions: "play none none none",
      scrub:true,
      markers: true,
    },
  });

  }, []);


return(
<div data-label="parentContentContainer"className="w-full h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none]">
     <div data-label="snap1" ref={txtRef} className="snap-start overflow-hidden flex flex-col justify-between items-center pt-[80px] opacity-0 w-full h-[100vh] bg-gradient-to-t from-accent1 via-gray-300 via-white-400 to-gray-200">
       <div  className="flex flex-col justify-between items-center font-ubuntu">
       <p className="text-[3.5rem] font-md leading-none opacity-0">Work can be </p>
       <p  className="text-[3.5rem] font-md leading-none opacity-0">engaging and <span className="text-gray-600">efficient.</span></p>
       <p className="text-gray-600 text-[0.8rem] mt-[20px] opacity-0">TAC is designed to streamline your tasks, organize your schedule, and boost your focus — all in one place.</p>
       <p className="text-gray-600 text-[0.8rem] opacity-0 mb-[20px]"> Manage your day effortlessly and get more done with less stress.</p>
       <div className="bottom-0 relative w-[250px] h-[400px] bg-[url('phone.png')] bg-contain bg-no-repeat" > </div>
      </div>
     </div>
     <div data-label="snap2" className="snap-end w-full h-[100vh] bg-gray-800 flex justify-center items-center">
          <div ref={circleRef} className="rounded-full w-[100px] h-[100px] bg-green-500"></div>
     </div>
     <div data-label="snap3" className="snap-start w-full h-[100vh] bg-blue-400">

     </div>
</div>
);
};

export default LandingContent;

