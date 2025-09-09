import React,{useEffect, useState} from 'react';
import Content from './contentSection/content.jsx';
import Sidebar from './sidebar.jsx';
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";

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
      logout(); // This will clean up all tokens and redirect to login
   };

   return(
  <div className="relative flex flex-col dark:bg-daccentS h-auto min-h-[100vh]">
    {modal ? (
      <section className='fixed z-[10] w-full h-full bg-transparent backdrop-blur-sm flex justify-center items-center'>
        <div className='absolute inset-0' onClick={() => setModal(false)}></div>
        <div className='absolute z-[15] opacity-[100%] w-[250px] h-[150px] bg-accentS dark:bg-daccentS flex flex-col justify-between rounded-xl 
        border-[1px] border-gray-500 dark:border-daccentBorder2'>
          <section className='flex items-center h-full w-fulls'>
            <p className='text-accentTxt dark:text-daccentTxt text-[1.2rem] text-center'>
              Are you sure you want to logout?
            </p>
          </section>
          <section className='w-full p-[10px] flex space-x-[10px] border-t-[1px] border-gray-500 dark:border-daccentBorder2'>
            <button onClick={handleLogout} className='p-[5px] bg-gradient-to-r from-accent0 via-accent1 to-accent0 text-white w-full rounded-lg'>
              Yes
            </button>
            <button onClick={() => setModal(false)} className='p-[5px] bg-black dark:bg-daccentM text-white w-full rounded-lg'>
              No
            </button>
          </section>
        </div>
      </section>
    ) : <></>}
    <Sidebar modal={modal} setModal={setModal}></Sidebar>
    <Content></Content>
  </div>
);

};

export default HomePage;
