import React from "react";
import Spline from '@splinetool/react-spline';
const LoginVisual = () => {
  return (
    <div className=" w-1/2 h-full bg-gray-900 box-border rounded-lg max-mobXL:w-full max-mobXL:h-[30%] max-mobXL:bg-[url('./logo.png')] max-mobXL:max-w-sm max-mobXL:bg-gray-200 max-mobXL:bg-contain max-mobXL:bg-no-repeat max-mobXL:bg-center">
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
