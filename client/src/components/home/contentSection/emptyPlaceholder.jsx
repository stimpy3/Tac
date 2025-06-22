import React from 'react';
import Lottie from 'lottie-react';
import emptyAnimation from '../../../assets/empty.json';

const EmptyPlaceholder = () => {
  return (
  <div className="w-full h-[200px] flex flex-col items-center justify-center">
    <Lottie animationData={emptyAnimation} loop={true} className="w-[40%] h-[70%]" />
    <p className='text-[1.5rem] text-accentS3 dark:text-daccentS3'>Waiting on you!</p>
  </div>
);

};

export default EmptyPlaceholder;