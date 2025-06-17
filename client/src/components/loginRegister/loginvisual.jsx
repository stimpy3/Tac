import React from "react";
import Spline from '@splinetool/react-spline';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const LoginVisual = () => {

  useGSAP(()=>{
       const tl = gsap.timeline({ delay: 0.5 });
       tl.from(".logo", {
           y: -300,
           duration: 1.5,
           delay:0.5,
           ease: "bounce",
       })
  });

  return (
    <div className="flex w-1/2 h-full bg-[#250f3e] box-border rounded-lg max-mobXL:w-full max-mobXL:h-full  max-mobXL:max-w-sm max-mobXL:bg-transparent max-mobXL:justify-center max-mobXL:items-center">
          <div className="logo hidden max-mobXL:flex w-[100px] aspect-square rounded-[20px] bg-gradient-to-b from-black to-gray-800 items-center justify-center p-[10px]">
             <div className="bg-[url('/logo2white.png')] bg-contain w-[95%] aspect-square"></div>
          </div>
          <div className="hidden  min-[860px]:block w-full h-full rounded-lg overflow-hidden">
              <Spline scene="https://prod.spline.design/dR-t4UMgNWpTeBxl/scene.splinecode" />
          </div>
          <div className="hidden min-[530px]:block min-[860px]:hidden w-full h-full rounded-lg overflow-hidde">
              <Spline
        scene="https://prod.spline.design/TekLIaIkV-S4AxPS/scene.splinecode" 
      />
          </div>   
    </div>
  );
};

export default LoginVisual;
