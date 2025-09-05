import React from "react";

const LoadingSpinner = ({ size = "medium" }) => {
  const sizeMap = {
    small: 50,
    medium: 100,
    large: 150,
  };

  const dimension = sizeMap[size] || sizeMap.medium; // fallback to medium

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div
        className="loader"
        style={{ width: `${dimension}px`, height: `${dimension}px` }}
      ></div>

      <style>{`
        .loader {
          width: 100px;
          aspect-ratio: 1;
          padding: 10px;
          box-sizing: border-box;
          display: grid;
          background: #000000;
          filter: blur(5px) contrast(20);   
        }
        .loader:before,
        .loader:after{ 
          content: "";
          grid-area: 1/1; 
          width: 40px;
          height: 40px;
          background: #ffffff;
          animation: l7 2s infinite;
        }
        .loader:after{ 
          animation-delay: -1s;
        }
        @keyframes l7{
          0%   {transform: translate(   0,0)}
          25%  {transform: translate(100%,0)}
          50%  {transform: translate(100%,100%)}
          75%  {transform: translate(   0,100%)}
          100% {transform: translate(   0,0)}
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
