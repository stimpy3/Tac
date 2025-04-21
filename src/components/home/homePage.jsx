import React from 'react';
import Content from './contentSection/content.jsx';
import Sidebar from './sidebar.jsx';

const HomePage=() =>{
   return(
    <div className="flex flex-col">
         <Sidebar></Sidebar>
         <Content></Content>
       </div>
   );
};

export default HomePage;