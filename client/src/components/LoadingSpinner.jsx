import React from 'react';

const LoadingSpinner = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-32 w-32",
    large: "h-48 w-48"
  };

    return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-sm z-50">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]}`}
        style={{
          borderWidth: "10px",
          borderColor: "white",
          borderTopColor: "transparent", // makes it look like a spinning arc
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner; 