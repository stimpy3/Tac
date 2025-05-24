import React from 'react';

const Footer=()=>{
   return(
   <div className="w-full h-[300px] bg-black px-[40px] py-[25px] flex items-center justify-center">
      <section data-label="leftContainer" className="w-[30%] min-w-fit flex flex-col">
        <div className="text-white min-w-[150px] w-fit min-h-[70px] bg-[url('/logowhitetext.png')] bg-contain bg-no-repeat"></div>
        <div data-label="SocialContainer" className="mt-[20px] pl-[5px] h-[40px] text-white flex w-[200px] justify-between items-center text-[1.4rem] transition duration-300 ">
            <div className="h-full w-[40px] rounded-full bg-[#3d3d3d] flex items-center justify-center hover:text-[2.2rem]  hover:bg-transparent transition-all duration-300"><i class="fa-brands fa-github"></i></div>
            <div className="h-full w-[40px] rounded-full bg-[#3d3d3d] flex items-center justify-center hover:text-[2.2rem]  hover:bg-transparent transition-all duration-300"><i class="fa-brands fa-youtube"></i></div>
            <div className="h-full w-[40px] rounded-full bg-[#3d3d3d] flex items-center justify-center hover:text-[2.2rem]  hover:bg-transparent transition-all duration-300"><i class="fa-brands fa-instagram"></i></div>
            <div className="h-full w-[40px] rounded-full bg-[#3d3d3d] flex items-center justify-center hover:text-[2.2rem]  hover:bg-transparent transition-all duration-300"><i class="bi bi-facebook"></i></div>
        </div>
      </section>
      <section data-label="rightContainer" className="w-[70%] flex flex-col justify-center items-center">
           <div className="text-white text-[3rem] h-[72px] flex justify-center items-center overflow-hidden">
                      <p>Built using</p>
                      <div className="flex flex-col h-[100%]">
                           <div className="px-[10px]">React&nbsp;<i class="fa-brands fa-react text-[#00D8FF]"></i></div>
                           <div className="px-[10px]">tailwind&nbsp;</div> 
                      </div>                                          
           </div>
           <p className="text-[#6b6b6b] text-[1.5rem] w-fit">Made by Sohan Bhadalkar</p>
      </section>
   </div>
   );
};

export default Footer;