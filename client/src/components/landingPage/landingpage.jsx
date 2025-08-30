import React from 'react';
import { useRef, useEffect } from "react";
import { TrendingUp,Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from 'axios';
 
const LandingPage=()=>{
    const navigate=useNavigate();
     const parallaxEnabled = useRef(false);
   
   useGSAP(()=>{
       gsap.from(".heading", {
           y: 700,
           duration: 1,
           delay:0.5,
           ease: "power3.out",
       });

       gsap.from(".phone", {
           y: 400,
           duration: 1,
           ease: "power3.out",
           
       });

       gsap.from(".rightDiv", {
           scale:0,
           duration: 1,
           delay:1,
           ease: "power3.out",
       });

       gsap.from(".leftDiv", {
           scale:0,
           duration: 1,
           delay:1.3,
           ease: "power3.out",
       });
       
      const counter = { val: 0 }; //just define an object
       gsap.to(counter,{
        val:60,
        duration:1,
        delay:1.5,
        ease: "linear",
        onUpdate: () => { //onUpdate is a function that runs every time the animation updates
                          //Each time counter.val changes (GSAP animates it), onUpdate is triggered
        const el = document.querySelector(".percent");
        el.innerText = `${Math.floor(counter.val)}%`;
        }
       });


       gsap.from(".filled", {
           width:"0px",
           duration: 1,
           delay:1.5,
           ease: "linear",
           onComplete: () => {
               parallaxEnabled.current = true;
           }
       });
   });

   useGSAP(() => {
       const parallaxSection = document.querySelector(".parallaxSection");
       if (!parallaxSection) return;

       const handleMouseMove = (e) => {
           if (!parallaxEnabled.current) return;

           const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
           const yMove = (e.clientY / window.innerHeight - 0.5) * 40;
           gsap.to(".phone",    { x: -xMove * 0.7, y: -yMove * 0.7 });
           gsap.to(".heading",  { x: -xMove * 1.5, y: -yMove * 1.5 });
       };

       const handleMouseLeave = () => {
           if (!parallaxEnabled.current) return;

           gsap.to([".phone", ".heading"], {
               x: 0,
               y: 0,
               duration: 0.5,
               ease: "power2.out",
           });
       };

       parallaxSection.addEventListener("mousemove", handleMouseMove);
       parallaxSection.addEventListener("mouseleave", handleMouseLeave);

       return () => {
         // Cleanup code runs when component unmounts
         //In your case, the component will unmount when:
         // User navigates away from the landing page:
           parallaxSection.removeEventListener("mousemove", handleMouseMove);
           parallaxSection.removeEventListener("mouseleave", handleMouseLeave);
           /*Dead event listeners keep running even after component is gone
             Multiple listeners firing for the same event
             Wasted CPU cycles */
       };
   });

   BACKEND_URL=import.meta.env.VITE_BACKEND_URL||"http://localhost:5000";
   useEffect(()=>{
    const warmUpServer = async () => {
    try{
      await axios.get(`${BACKEND_URL}/warmup`);
      console.log("Server is awake");
    }
    catch (err) {
        console.log("Warmup request failed:", err);
      }
    }
    warmUpServer();
   },[]);
    

return (
  <div className="h-screen overflow-y-auto snap-y snap-mandatory custom-scrollbar">
    <section className="parallaxSection relative h-[100vh] w-full bg-gradient-to-b from-accent0 to-gray-200 snap-start overflow-hidden flex flex-col items-center justify-end">
      
      {/* Login & Signup Buttons */}
      <div className="absolute p-[10px] top-0 right-0">
        <button
          className="login bg-black text-white py-[10px] px-[5px] w-[80px] text-[1.3rem] rounded-md mr-[15px] hover:translate-y-[5px] transition duration-400"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="signup bg-white text-black py-[9px] px-[5px] w-[80px] text-[1.3rem] rounded-md text-center hover:translate-y-[5px] transition duration-400"
          onClick={() => navigate("/register")}
        >
          Signup
        </button>
      </div>

      {/* Heading */}
      <div className="w-full h-[calc(100%-390px)] flex justify-center items-center max-[575px]:mt-[62px]">
        <p className="heading mt-[20px] mb-[20px] text-[5rem] leading-none text-white text-center inter 
          min-[2201px]:text-[9rem] min-[2201px]:top-[6%] max-[2200px]:top-[4%] min-[2000px]:text-[7rem] min-[1400px]:text-[6rem]
          max-[575px]:text-[4rem]  max-[365px]:text-[3.3rem]">
          Work can be <br /> engaging and efficient
        </p>
      </div>

      {/* Phone and Decorative Cards */}
      <div className="phone-divs h-[350px] relative w-[557px] flex justify-center items-start px-[10px] bottom-[-8%] max-[575px]:w-[350px] max-[365px]:w-[300px]">

        {/* Phone SVG */}
        <div className="phone absolute aspect-[1/2] w-[280px] top-[0] bg-[url('/phone.svg')] bg-contain bg-no-repeat max-[575px]:w-full"></div>

        {/* Right Floating Card */}
        <div className="rightDiv flex items-end absolute w-[200px] aspect-[2/1] bg-gray-200 rounded-lg right-[10px] top-[15%] shadow-lg border-[1px] border-gray-400 max-[575px]:hidden">
          <div className="bg-[url('/graph.png')] bg-cover bg-no-repeat h-[50%] w-full"></div>
          <p className="absolute left-[5px] top-[5px] bg-black rounded-md text-white px-[6px] py-[3px] w-fit flex items-center border-[1px] border-gray-500">
            June
          </p>
          <div className="trendSection flex-col absolute right-[5px] top-[5px]">
            <p className="flex text-[0.9rem] items-center leading-none h-fit">
              4%&nbsp;<TrendingUp className="text-green-500" />
            </p>
            <p className="text-[0.7rem] text-gray-500 leading-none">since may</p>
          </div>
        </div>

        {/* Left Floating Card */}
        <div className="leftDiv absolute w-[200px] aspect-[2/1] bg-gray-200 rounded-lg left-[10px] bottom-[20%] shadow-lg p-[10px] border-[1px] border-gray-400 max-[575px]:hidden">
          <section className="w-full h-[50%] flex">
            <div className="pfp h-full aspect-square rounded-full bg-gray-500 bg-[url('/pfp.png')] bg-cover bg-no-repeat border-[1px] border-gray-400"></div>
            <p className="flex items-center w-full text-[1.2rem] pl-[10px]">Hello Liam!</p>
          </section>
          <section className="h-[50%] w-full flex flex-col justify-center">
            <p className="w-full text-[0.8rem] text-gray-500 leading-none mb-[5px]">
              Your Progress &nbsp;
              <span className="percent text-accent0 leading-none"></span>
            </p>
            <div className="total h-[10px] w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="filled h-full w-[60%] bg-accent1"></div>
            </div>
          </section>
        </div>
      </div>

      {/* GitHub Button */}
      <button
        onClick={() => window.open('https://github.com/stimpy3/Tac', '_blank')}
        className="w-[50px] aspect-square shadow-lg flex items-center justify-center bg-white p-[10px] absolute bottom-[30px] right-[30px] rounded-full hover:bg-black hover:text-white transition-all hover:scale-[1.2] duration-300 
        max-[575px]:bottom-[10px] max-[575px]:right-[10px] max-[830px]:w-[70px] max-[830px]:p-[15px]"
      >
        <Github className="w-full h-full" />
      </button>
    </section>
  </div>
);


};

export default LandingPage;