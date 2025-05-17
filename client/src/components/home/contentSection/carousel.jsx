/* Virtaul DOM need when we have A real DOM
Efficiency: Manipulating the real DOM is slow because the browser has to reflow
 and repaint the page after every update. This process can be time-consuming,
  especially when updating multiple elements or complex UIs.

Avoiding Unnecessary Re-renders: The Virtual DOM helps minimize unnecessary updates
 by performing a "diffing" process to check which part of the UI needs to change.
  It allows React to update only the parts of the real DOM that actually need it.

useState vs useRef
useState: Displays the value on screen and triggers re-render when updated.
Example: setCount(count + 1);

useRef: Stores the value silently without re-rendering.
Example: refCount.current += 1;
Use useRef() when you want to store something across renders...
without causing re-renders, making it ideal for storing things like DOM references, 
timers, or other mutable values that don't require a UI update

If you mistakenly try to use useState for things that don’t need re-rendering
(like DOM elements or non-UI data), you could end up in a situation where the
 component re-renders more often than needed, causing unnecessary re-computation or UI updates.

React may re-render the component, but if you're modifying the DOM directly(document.queryselector etc)
outside React’s control, it could lead to unexpected behavior,like styles not being updated,
or DOM elements being out of sync with the state
 */

import React,{useState,useRef} from 'react' //go inside one pair of curly braces, separated by commas

const Carousel=()=>{
  const [topics,setTopics]=useState([]);//default hold empty array like useState(0) sets default 0
  const addTopic=()=>{
    setTopics([...topics,{title:"New Topic"}]); 
    /*Without the {}, you might be trying to add undefined or just an empty element,
     which doesn't have the expected structure for your rendering logic (e.g., 
     mapping over topics.map).
     React expects something valid to update the UI correctly, 
     so setTopics([...topics]) will not update the state properly 
     without adding a value like {} or something valid.

     example setTopics([...topics, "New Topic"]);This would add a string
     But using {} (an empty object) is often preferred because:
     It's a valid object and is more flexible. You can later add properties 
     (like title, progress, etc.) to that object.
     Strings or other types like numbers are harder to work with because they don't
    allow for expansion (like adding title or progress).
  */
   };

  const carouselRef=useRef(null); /*useRef(null) initializes the reference with
   null because, initially, there’s no DOM element assigned to the reference
   Initially, carouselRef.current is null because the div hasn't been rendered yet
   */
  // Scroll left function
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -160, //scrollBy() method requires an object with left, top theres no such right or bottom
        behavior: 'smooth', // Smooth scrolling effect
      });
    }
  };

  // Scroll right function
  const scrollRight = () => {
    if (carouselRef.current) { /*If you attempt to use carouselRef.current.scrollBy(...) before 
      React has updated carouselRef.current (i.e., before the component is mounted), 
      it will be null, and trying to call methods on null would result in an error. */
      carouselRef.current.scrollBy({
        left: 160, // Adjust this value to control how much it scrolls
        behavior: 'smooth', // Smooth scrolling effect
      });
    }
  };


  return(
    <div className="flex flex-col h-[40%] w-full p-0">{/* heading(buttons and headin)+items */}
      <div className='flex items-center w-full h-fit justify-between'>
         <div className='flex mr-[10px]'><p className='text-[1.5rem] w-fit whitespace-nowrap'>Progress Tracker</p><button onClick={addTopic} className='flex items-center justify-cente ml-[5px]  text-[1.5rem] text-gray-700 hover:text-blue-500'>+</button></div>
         <div className="h-[1px] w-full bg-gray-500"></div> {/* partition line */}
         <div className='ml-[10px] min-w-[60px]'> {/* left right button container */}
         <button onClick={scrollLeft} className='border-[1px] border-gray-500 shadow-lg w-[25px] rounded-full bg-gray-300 mr-[5px] hover:bg-blue-500 hover:border-none hover:text-white transition-colors duration-400'>&lt;</button>
         <button onClick={scrollRight} className='border-[1px] border-gray-500 shadow-lg w-[25px] rounded-full bg-gray-300 hover:bg-blue-500 hover:border-none hover:text-white transition-colors duration-400'>&gt;</button>
         </div>
       </div>
       <div ref={carouselRef} data-label='carouselContainer'className='carousel-container overflow-x-auto scrollbar-hide flex w-full h-full py-[10px]'>
        { topics.map((_,index)=>{
             return(
              <div key={index} className="flex flex-col card-base bg-white min-w-[150px] text-black p-4 my-2 mr-[20px] rounded">
                <p className='w-full h-fit'>New Topic</p>
                <div className='w-full h-fit'></div>
              </div>
             );
         })
        }
       </div>  
    </div>
  );
};

export default Carousel;