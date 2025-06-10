import React from 'react';
import { useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
 
const LandingPage=()=>{
    const navigate=useNavigate();
    useGSAP(()=>{

        gsap.from(".heading", {
         y: 700,         // starts 200px to the right
         duration: 2,
         delay:0.5,
         ease: "power3.out",
        });

        gsap.from(".phone", {
         y: 400,         // starts 200px to the right
         duration: 2,
         ease: "power3.out",
        });

         gsap.from(".rightDiv", {
         x: 200,         // starts 200px to the right
         scale:0,
         duration: 2,
         delay:1.5,
         ease: "power3.out",
        });

         gsap.from(".leftDiv", {
         x: -200,         // starts 200px to the right
         scale:0,
         duration: 2,
         delay:2,
         ease: "power3.out",
        });

    });
    return(
        <div className="h-screen overflow-y-auto snap-y snap-mandatory custom-scrollbar relative">
             <section className="visual h-[100vh] w-full bg-gradient-to-b from-accent0 to-gray-200 snap-start overflow-hidden flex flex-col items-center ">
                 <div className="absolute p-[10px] right-0">
                    <button className="login bg-black text-white py-[5px] w-[80px] text-[1.2rem] rounded-md
                     mr-[15px] hover:translate-y-[5px] transition duration-400"
                     onClick={()=>{navigate("/login");}}>Login</button>
                    <button className="signup bg-white text-black py-[5px] w-[80px] text-[1.2rem] rounded-md
                     hover:translate-y-[5px] transition duration-400"
                     onClick={()=>{navigate("/register");}}>Signup</button>
                </div>
                 <p className="heading text-[5rem] leading-none text-white text-center mt-[50px] inter">Work can be <br></br> engaging and efficient</p>
                 <div className="phone absolute aspect-[1/2] w-[280px] bg-[url('phone.svg')] bg-contain bg-no-repeat bottom-[-47%] left-[50%] translate-x-[-50%]"></div>
                 <div className="rightDiv absolute w-[200px] h-[100px] bg-gray-200 rounded-sm left-[58%] bottom-[30%] shadow-lg"></div>
                 <div className="leftDiv absolute w-[200px] h-[100px] bg-gray-200 rounded-sm left-[29%] bottom-[5%] shadow-lg"></div>
             </section>
             <section className="redirect h-[100vh] w-full bg-black text-white snap-start">vk</section>
        </div>
    );
};

export default LandingPage;