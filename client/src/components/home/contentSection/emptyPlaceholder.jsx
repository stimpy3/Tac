import React from 'react';
import Lottie from 'lottie-react';
import emptyAnimation from '../../../assets/empty.json';

const EmptyPlaceholder = () => {
  return (
    <div className="w-full h-[200px] flex flex-col items-center justify-center">
      <Lottie animationData={emptyAnimation} loop={true}  className="w-[40%] h-[70%]"/>
      <p className='text-[1.5rem]'>your goals deserve clarity.</p>
    </div>
  );
};

export default EmptyPlaceholder;