import React from 'react';
import { useRef, useEffect } from "react";
import { TrendingUp,Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
 
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
           x: 200,
           scale:0,
           duration: 1,
           delay:1,
           ease: "power3.out",
       });

       gsap.from(".leftDiv", {
           x: -200,
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

           gsap.to(".rightDiv", { x: -xMove * 0.1, y: -yMove * 0.1 });
           gsap.to(".leftDiv",  { x: -xMove * 0.1, y: -yMove * 0.1 });
           gsap.to(".phone",    { x: -xMove * 0.7, y: -yMove * 0.7 });
           gsap.to(".heading",  { x: -xMove * 1.5, y: -yMove * 1.5 });
       };

       const handleMouseLeave = () => {
           if (!parallaxEnabled.current) return;

           gsap.to([".rightDiv", ".leftDiv", ".phone", ".heading"], {
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
    

    return(
        <div className="h-screen overflow-y-auto snap-y snap-mandatory custom-scrollbar">
             <section className="parallaxSection relative h-[100vh] w-full bg-gradient-to-b from-accent0 to-gray-200 snap-start overflow-hidden flex flex-col items-center ">
                 <div className="absolute p-[10px] right-0">
                    <button className="login bg-black text-white py-[5px] w-[80px] text-[1.2rem] rounded-md
                     mr-[15px] hover:translate-y-[5px] transition duration-400"
                     onClick={()=>{navigate("/login");}}>Login</button>
                    <button className="signup bg-white text-black py-[5px] w-[80px] text-[1.2rem] rounded-md
                     hover:translate-y-[5px] transition duration-400"
                     onClick={()=>{navigate("/register");}}>Signup</button>
                </div>
                 <p className="heading absolute text-[5rem] leading-none text-white text-center top-[6%] inter">Work can be <br></br> engaging and efficient</p>
                 <div className="phone absolute aspect-[1/2] w-[280px] bg-[url('/phone.svg')] bg-contain bg-no-repeat bottom-[-45%] left-[50%] translate-x-[-50%]"></div>
                 <div className="flex items-end rightDiv absolute w-[200px] h-[100px] bg-gray-200 rounded-lg left-[58%] bottom-[30%] shadow-lg  border-[1px] border-gray-400">
                    <div className="bg-[url('graph.png')] bg-cover bg-no-repeat h-[50px] w-full"> </div>
                    <p className="absolute left-[5px] top-[5px] bg-black rounded-md text-white px-[6px] py-[3px] w-fit flex items-center border-[1px] border-gray-500">June</p>
                    <div className="trendSection flex-col absolute right-[5px] top-[5px]">
                    <p className="flex text-[0.9rem] items-center">4%&nbsp;<TrendingUp className="text-green-500"/></p>
                    <p className="text-[0.7rem] text-gray-500 leading-none">since may</p>
                    </div>
                 </div>
                 <div className="leftDiv absolute w-[200px] h-[100px] bg-gray-200 rounded-lg left-[29%] bottom-[5%] shadow-lg p-[10px] border-[1px] border-gray-400">
                   <section className="w-full h-[40px] flex">
                       <div className="pfp w-[40px] aspect-square rounded-full bg-gray-500 bg-[url('/pfp.png')] bg-cover bg-no-repeat border-[1px] border-gray-400"></div>
                       <p className='flex items-center w-full text-[1.2rem] pl-[10px]'>Hello Liam!</p>
                   </section>
                   <section data-label="bar&labelcontainer" className="h-[calc(100%-40px)] w-full flex flex-col justify-evenly ">
                     <p data-label="progress info" className="progressInfo w-full text-[0.8rem] text-gray-500">Your Progress &nbsp;
                     <span className="percent text-accent0 leading-none"></span></p>
                     <div data-label="totalbar" className="total h-[10px] w-full bg-gray-300 rounded-full overflow-hidden">
                        <div data-label="filled" className="filled h-full w-[60%] bg-accent1"></div>
                     </div>
                   </section>
                 </div>
                 <div className='absolute bottom-[30px] right-[30px] flex items-center'>
                   <button onClick={() => window.open('https://github.com/stimpy3/Tac', '_blank')} className="w-[50px] aspect-square shadow-lg flex items-center justify-center  bg-white p-[10px] rounded-full hover:bg-black hover:text-white transition-all hover:w-[55px] duration-300">
                      <Github className='w-full h-full'/>
                   </button>
                 </div>
             </section>
        </div>
    );
};

export default LandingPage;