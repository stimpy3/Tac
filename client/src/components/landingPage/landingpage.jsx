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
    

    return(
        <div className="h-screen overflow-y-auto snap-y snap-mandatory custom-scrollbar">
             <section className="parallaxSection relative h-[100vh] w-full bg-gradient-to-b from-accent0 to-gray-200 snap-start overflow-hidden flex flex-col items-center justify-end">
                    <div className="absolute p-[10px] top-0 right-0  
                    2xl:p-[20px] ">
                       <button className="login bg-black text-white py-[5px] w-[80px] text-[1.2rem] rounded-md
                        mr-[15px] hover:translate-y-[5px] transition duration-400
                        2xl:text-[3rem] 2xl:w-[180px] 2xl:px-[10px] 2xl:mr-[20px] "
                        onClick={()=>{navigate("/login");}}>Login</button>
                       <button className="signup bg-white text-black py-[5px] w-[80px] text-[1.2rem] rounded-md text-center
                        hover:translate-y-[5px] transition duration-400
                        2xl:text-[3rem] 2xl:w-[180px] 2xl:px-[10px]"
                        onClick={()=>{navigate("/register");}}>Signup</button>
                   </div>
                    <p className="heading absolute text-[5rem] leading-none text-white text-center top-[3%] inter 
                    min-[2201px]:text-[9rem] min-[2201px]:top-[6%] max-[2200px]:top-[4%] min-[2000px]:text-[7rem] min-[1400px]:text-[6rem]
                    max-[450px]:text-[2.5rem] max-[450px]:top-[100px] max-[830px]:text-[3rem] max-[830px]:top-[60px]">Work can be <br></br> engaging and efficient</p>
                    <div className="h-[400px] relative w-[557px] flex justify-center items-start  px-[10px]
                    2xl:w-[1244px] max-[450px]:w-[303px] max-[830px]:w-[464px]">
                    <div className="phone absolute aspect-[1/2] w-[280px]  bottom-[-55%] bg-[url('/phone.svg')] bg-contain bg-no-repeat 
                     max-[450px]:w-[240px] max-[450px]:bottom-[-35%] max-[830px]:w-[250px] max-[830px]:bottom-[-35%]"></div>
                    <div className="rightDiv flex items-end absolute w-[200px] aspect-[2/1] bg-gray-200 rounded-lg right-[10px] top-[25%] shadow-lg  border-[1px] border-gray-400
                    2xl:w-[450px] max-[450px]:w-[120px] max-[830px]:w-[160px]">
                       <div className="bg-[url('/graph.png')] bg-cover bg-no-repeat h-[50%] w-full"> </div>
                       <p className="absolute left-[5px] top-[5px] bg-black rounded-md text-white px-[6px] py-[3px] w-fit flex items-center border-[1px] border-gray-500
                       2xl:text-[2.5rem] 2xl:left-[15px] 2xl:top-[15px] max-[450px]:text-[0.7rem]">June</p>
                      <div className="trendSection flex-col absolute right-[5px] top-[5px]
                       2xl:top-[15px] 2xl:right-[15px] ">
                          <p className="flex text-[0.9rem] items-center leading-none h-fit
                          2xl:text-[2.5rem] max-[450px]:text-[0.7rem] max-[450px]:leading-[0.7]">4%&nbsp;<TrendingUp className="text-green-500
                          2xl:scale-[1.5] max-[450px]:scale-[0.7]"/></p>
                          <p className="text-[0.7rem] text-gray-500 leading-none
                          2xl:text-[1.5rem] max-[450px]:text-[0.5rem]">since may</p>
                       </div>
                    </div>
                    <div className="leftDiv absolute w-[200px] aspect-[2/1] bg-gray-200 rounded-lg left-[10px] bottom-[5%] shadow-lg p-[10px] border-[1px] border-gray-400
                     2xl:w-[450px] 2xl:p-[15px] max-[450px]:w-[120px] max-[830px]:w-[160px]">
                      <section className="w-full h-[50%] flex">
                          <div className="pfp h-full aspect-square rounded-full bg-gray-500 bg-[url('/pfp.png')] bg-cover bg-no-repeat border-[1px] border-gray-400
                          "></div>
                          <p className='flex items-center w-full text-[1.2rem] pl-[10px]
                          2xl:text-[2.5rem] 2xl:pl-[20px] max-[450px]:text-[0.8rem]'>Hello Liam!</p>
                      </section>
                      <section data-label="bar&labelcontainer" className="h-[50%] w-full flex flex-col justify-center ">
                        <p data-label="progress info" className="progressInfo w-full text-[0.8rem] text-gray-500 leading-none mb-[5px]
                        2xl:text-[1.8rem] 2xl:mb-[5px] max-[450px]:text-[0.5rem] max-[450px]:mb-[2px]">Your Progress &nbsp;
                        <span className="percent text-accent0 leading-none"></span></p>
                        <div data-label="totalbar" className="total h-[10px] w-full bg-gray-300 rounded-full overflow-hidden
                        2xl:h-[20px] max-[450px]:h-[5px]">
                           <div data-label="filled" className="filled h-full w-[60%] bg-accent1"></div>
                        </div>
                      </section>
                    </div>
                 </div>

                   <button onClick={() => window.open('https://github.com/stimpy3/Tac', '_blank')} className="w-[50px] aspect-square shadow-lg flex items-center justify-center  bg-white p-[10px] absolute bottom-[30px] right-[30px] rounded-full hover:bg-black hover:text-white transition-all hover:scale-[1.2] duration-300
                   2xl:w-[130px] 2xl:p-[26px] max-[450px]:w-[40px] max-[450px]:p-[7px] max-[830px]:bottom-[10px] max-[830px]:right-[10px]">
                      <Github className='w-full h-full'/>
                   </button>

             </section>
        </div>
    );
};

export default LandingPage;