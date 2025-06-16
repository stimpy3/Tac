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
    <div className="flex w-1/2 h-full bg-gray-900 box-border rounded-lg max-mobXL:w-full max-mobXL:h-full  max-mobXL:max-w-sm max-mobXL:bg-transparent max-mobXL:justify-center max-mobXL:items-center">
          <div className="logo hidden max-mobXL:flex w-[100px] aspect-square rounded-[20px] bg-black items-center justify-center p-[10px]">
             <div className="bg-[url('/logo2white.png')] bg-contain w-[95%] aspect-square"></div>
          </div>
          <div className="hidden  min-[860px]:block w-full h-full">
             <Spline scene="https://prod.spline.design/0hZY-3NNNmabkdyt/scene.splinecode" />
          </div>
          <div className="hidden min-[530px]:block min-[860px]:hidden w-full h-full">
             <Spline scene="https://prod.spline.design/9W2iGZM2QaYitw7w/scene.splinecode" />
          </div>   
    </div>
  );
};

export default LoginVisual;
