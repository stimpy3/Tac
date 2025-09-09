import React from "react";

const LoadingSpinner = ({ size = "medium" }) => {
  const sizeMap = {
    small: 50,
    medium: 100,
    large: 150,
  };

  const dimension = sizeMap[size] || sizeMap.medium; // fallback to medium

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-50">
      <div
        className="loader"
        style={{ width: `${dimension}px`, height: `${dimension}px` }}
      ></div>

      <style>{`
        .loader {
          width: ${dimension}px;
          aspect-ratio: 1;
          padding: 10px;
          box-sizing: border-box;
          display: grid;
          background: #000000;
          filter: blur(5px) contrast(20);   
        }
        .loader:before,
        .loader:after { 
          content: "";
          grid-area: 1/1; 
          width: 40px;
          height: 40px;
          background: #ffffff;
          animation: l7 2s infinite;
        }
        .loader:after { 
          animation-delay: -1s;
        }
        @keyframes l7 {
          0%   {transform: translate(0,0)}
          25%  {transform: translate(100%,0)}
          50%  {transform: translate(100%,100%)}
          75%  {transform: translate(0,100%)}
          100% {transform: translate(0,0)}
        }

        /* Shiny text effect */
        .loader_text {
          font-size: 0.9rem;
          font-family: "Share Tech", sans-serif;
          font-weight: 400;
          background: linear-gradient(
            90deg,
            #555,
            #fff,
            #555
          );
          background-size: 200% auto;

          /* cross-browser background-clip */
          background-clip: text;
          -webkit-background-clip: text;
          -moz-background-clip: text;

          color: transparent;
          -webkit-text-fill-color: transparent;
          -moz-text-fill-color: transparent;

          animation: shine 3s linear infinite;
        }

        @keyframes shine {
          from { background-position: 200% center; }
          to   { background-position: -200% center; }
        }
      `}</style>

      <p className="loader_text">Waking up free-tier server 💤</p>
    </div>
  );
};

export default LoadingSpinner;
