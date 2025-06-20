import React,{useEffect, useState} from 'react';
import Content from './contentSection/content.jsx';
import Sidebar from './sidebar.jsx';
import { useNavigate } from "react-router-dom";

const HomePage=() =>{
   const navigate=useNavigate();
   const [modal,setModal]=useState(false);

   useEffect(()=>{
      modal?document.body.style.overflowY='hidden':document.body.style.overflowY='auto';
      return ()=>{
        document.body.style.overflowY='auto';
      };
   },[modal]);

   const handleLogout=()=>{
      localStorage.removeItem("user");
      localStorage.removeItem("username"); // if you use this elsewhere
      localStorage.removeItem("useremail");
      navigate("/");
   };

   return(
    <div className="relative flex flex-col">
      {modal?
         <section className='fixed z-[10] w-full h-full bg-transparent backdrop-blur-sm flex justify-center items-center'>
            <button onClick={()=>setModal(false)}className='relative w-full h-full bg-black opacity-50 '></button>
            <div className='absolute z-[15] opacity-[100%] w-[250px] h-[150px] bg-gray-200 flex flex-col justify-between rounded-xl'>
               <section className='flex items-center h-full w-fulls'>
                   <p className='text-black text-[1.2rem] text-center'>Are you sure you want to logout?</p>
               </section>
               <section className='w-full p-[10px] flex space-x-[10px] border-t-[1px] border-gray-500'>
                  <button onClick={handleLogout} className='p-[5px] bg-gradient-to-r from-accent0 via-accent1 to-accent0 text-white w-full rounded-lg'>Yes</button>
                  <button onClick={()=>setModal(false)} className='p-[5px] bg-black text-white w-full rounded-lg'>No</button>
               </section>
            </div>
         </section>
         :<></>}
         <Sidebar modal={modal} setModal={setModal}></Sidebar>
         <Content></Content>
       </div>
   );
};

export default HomePage;