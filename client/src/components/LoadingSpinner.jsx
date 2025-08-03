import React from 'react';

const LoadingSpinner = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-32 w-32",
    large: "h-48 w-48"
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`animate-spin rounded-full border-b-2 border-gray-900 ${sizeClasses[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner; 