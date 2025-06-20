import React, { useState } from 'react';
/*Older React (before React 17)
You always had to import React, because:
JSX (<div>) gets compiled to React.createElement(...)
So without React, your code would throw an error. */

const TopBar=() =>{
   //google sign in accessing from local storage
   const user = JSON.parse(localStorage.getItem("user"));
  // console.log(user.name); // "Sohan Bhadalkar"
  //console.log(user.picture); // Profile picture URL
   const useremail = localStorage.getItem("useremail")||(user?.email ?? "");
   const username = localStorage.getItem("username")||(user?.name ?? "");
   /*|| (OR operator): Returns the first truthy value.
   If left exists done, returns that.
   If it gives null / "" / undefined → it checks the right side.
   /*

   ?. Optional Chaining on objects:- Safely accesses a property or function
   obj?.prop
   obj?.method()
   arr?.[index]
   const user = null;
   console.log(user?.name); // → undefined (safe)

   ?? Nullish Coalescing
     a ?? b
     Returns a if it's not null/undefined, else returns b.
     only checks if the left-hand side is null or undefined.
     It does not force a fallback value — if both are undefined, the result stays undefined.

   */

   const today=new Date();
   const day=today.toLocaleDateString("en-US", {
    weekday: "short",
  });
   const date=today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long", // Optional: makes it "Apr"
    day: "numeric",
  });
  const randomColor=["bg-accent1","bg-[#a1cbcf]","bg-[#8ca3dc]","bg-[#b4b4e4]","bg-[#9d91c2]"];
  const[userColor,setUserColor]=useState([randomColor[Math.floor(Math.random() * 5)]]);
 


   return(
    <div className="w-100% h-[100px] bg-gray-200 pl-[20px] flex py-[0px] justify-between">
        {/*label and date*/}
        <div className="flex flex-col justify-center">
            <h1 className="text-[1.5rem]">Welcome {username.split(" ")[0]} 👋</h1>
            <p className="text-[1rem] text-gry-500"><span className="text-gray-500 text-[0.9rem]">{date}</span></p>
        </div>

        {/*profile
         <i class="fa-solid fa-laptop-file"></i> <i class="fa-solid fa-person-rays"></i> <i class="fa-solid fa-hashtag"></i>
        */
        }
        <div className="h-full w-10% flex items-center ">
            <i className="fa-solid fa-bell text-gray-400  text-[1.4rem]"></i>
            <div className="h-[60px] w-[220px] bg-white flex ml-[20px] items-center rounded-full pl-[5px] border-[1px] border-gray-400">
             {/*Default Google profile pics follow a pattern like:
                 https://lh3.googleusercontent.com/a/default-user=s96-c */
              ( user && user?.picture && (!user?.picture?.includes("default-user")) )? (
                <div
                    data-label="UserIcon"
                    className="w-[50px] h-[50px] rounded-full border-[1px] border-gray-400 shadow-lg overflow-hidden">
                    <img src={user.picture} alt="User" className="w-full h-full object-cover"
                     onError={(e) => { //for gooogle login/register without pfp
                     e.target.onerror = null;  //This line removes the onerror handler after 
                     // it runs once. It prevents infinite loops in case something goes wrong inside the
                     // handler itself. example e.target.onerror = () => { doSomething(); }
                     //If inside doSomething() you again set the image’s src the onerror would fire again, possibly forever.
                     e.target.style.display = "none"; // hide broken image
                     e.target.parentElement.innerHTML = `
                       <div class="flex items-center justify-center text-[1.4rem] text-white w-full h-full ${userColor}">
                         ${username && username[0] ? username[0].toUpperCase() : `<i class='fa-solid fa-user'></i>`}
                      </div>`;
                 }}/> </div> ) 
                : //for normal login register
                ( <div data-label="UserIcon" className={`flex items-center justify-center text-[1.4rem] text-white w-[50px] h-[50px] ${userColor} rounded-full border-[1px] border-gray-400 shadow-lg`}>
                    {username && username[0] ? username[0].toUpperCase() : <i className="fa-solid fa-user"></i>}
                   </div> )
                }

                <section className="w-[150px] h-full flex justify-center items-center">
                     <section className="pl-[5px] w-full h-full flex flex-col justify-center items-start overflow-hidden"> 
                       <p className="mr-[5px] text-[0.9rem] mb-[2px]">{(username.length>15)?username.slice(0,10)+"...":username}</p>
                       <p className="text-gray-500 text-[0.6rem]">{useremail}</p>
                     </section> 
                    <button><i className="fa-solid fa-angle-down"></i></button>
                </section>
            </div>
        </div>
    </div>
   );
};

export default TopBar;