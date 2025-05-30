import React,{useState,useRef,useEffect, use} from 'react';
import Sidebar from '../home/sidebar'; 
import Calendar from '../calendar';
import {CalendarDays,CalendarOff,ChevronRight,ChevronLeft} from 'lucide-react';

const TimeTable=()=>{
  const [showCalender,setShowCalendar]=useState(false);
  const [leftDistance, setLeftDistance] = useState(0);
  const contentRef=useRef(null);

  const handleCalender=()=>{
      setShowCalendar(prev=>!prev);
  };//pok
  let width=100;

  const lines = Array.from({ length: 23 }, (_, i) => (
                     <div key={i} data-label="verticalLines" className="absolute z-[5px] min-w-[0.5px] h-[calc(100%+40px)] bg-gray-400"
                      style={{ left: `${(i+1) * width - 1}px` }}/>));


  const handleLeftScroll=()=>{
    if(contentRef.current){
      contentRef.current.scrollBy({
        left:-360,
        behavior:'smooth',
      });
    }
  };

  const handleRightScroll=()=>{
    if(contentRef.current){
      contentRef.current.scrollBy({
        left:360,
        behavior:'smooth',
      });
    }
  };

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const minsSinceMidnight = hours * 60 + minutes;
    const left = +(minsSinceMidnight * (width / 60)).toFixed(2);
    setLeftDistance(left); //cant just write set state in body gotta wrap it in a function or useEfect
    /*If you do setState directly in the body of a React component (outside of hooks like useEffect),
     it causes an infinite render loop. Here’s why:
      -React renders your component.
      -In the component body, you call setState.
      -Calling setState schedules a re-render.
      -React renders again.
      -Again, setState is called in the component body.
      -This repeats endlessly until React stops it with an error: "Too many re-renders."
      useEffect(() => { ... }) runs after every render (initial + updates).
      useEffect(() => { ... }, []) runs only once after first render. */
  }, []);

  useEffect(() => {
  if (contentRef.current) {
    contentRef.current.scrollLeft=leftDistance-200;
  }
}, [leftDistance]);

  


    return(
        <div className='w-screen h-screen bg-gray-500 flex '>
          <Sidebar/>
          <div data-label='outerRightContainer' className=' w-[calc(100%-85px)] ml-[85px] bg-gray-200  p-[15px] flex justify-center '>
              <div data-label='timeTableContainer'  className='h-[516px] w-[98%] flex relative border-[1px] border-gray-400'>
              <div className={`min-w-[130px] h-full  flex flex-col items-center border-r-[1px] border-gray-400`}> 
                <section className='flex justify-betweenitems-center w-full min-h-[40px] bg-gray-300 border-b-[1px] border-gray-400'>
                   <button className='text-gray-600 w-full h-full px-[10px]' onClick={handleCalender}>{(showCalender)?<CalendarDays/>:<CalendarOff/>}</button>
                   <section data-label='scrollContainer' className='px-[10px] border-l-[1px] border-gray-400 w-[90px] h-full flex items-center justify-around text-[1.5rem]'>
                      <button onClick={handleLeftScroll} className='rounded-full h-[80%] aspect-square bg-gray-100 flex items-center justify-center border-[1px] border-gray-400'><ChevronLeft/></button>
                      <button onClick={handleRightScroll} className='rounded-full h-[80%] aspect-square bg-gray-100 flex items-center justify-center border-[1px] border-gray-400'><ChevronRight/></button>
                   </section>
                </section>

                 { (showCalender)? 
                 <div className='absolute top-[40px] left-[-5px] z-10'>
                   <Calendar/>
                 </div>
                 :
                 <div className='hidden'>
                   <Calendar/>
                 </div>
                 }
                 <section data-label='daysNameContainer' className='h-[476px] w-full bg-blue-500 flex flex-col items-center text-white text-[1.2rem]'>
                    <div className='h-[68px] w-full flex items-center justify-center border-b-[1px] border-white'>Mon</div>
                    <div className='h-[68px] w-full flex items-center justify-center border-b-[1px] border-white'>Tue</div>
                    <div className='h-[68px] w-full flex items-center justify-center border-b-[1px] border-white'>Wed</div>
                    <div className='h-[68px] w-full flex items-center justify-center border-b-[1px] border-white'>Tue</div>
                    <div className='h-[68px] w-full flex items-center justify-center border-b-[1px] border-white'>Fri</div>
                    <div className='h-[68px] w-full flex items-center justify-center  border-b-[1px] border-white'>Sat</div>
                    <div className='h-[68px] w-full flex items-center justify-center'>Sun</div>
                 </section>
              </div>

              <div data-label='contentContainer' ref={contentRef} className='min-w-[900px] overflow-y-hidden overflow-x-hidden h-full bg-gray-200 flex flex-col relative'>
                <div data-label="currentLineContainer" className="absolute z-[6px] w-fit h-[480px] bottom-0 flex flex-col items-center"   style={{ left: `${leftDistance-6}px` }}>
                   <div data-label="currentLineCircle" className="w-[12px] h-[12px] border-[3px] border-blue-500 bg-transparent rounded-full"></div>
                   <div data-label="currentLine" className="h-full w-[3px] bg-blue-500"></div>
                </div>    
                {lines}
                <section data-label='timeContainer' className='w-[2400px] min-h-[40px] bg-gray-300 flex border-gray-400 border-b-[1px]'>
                    <div className='w-[100px] flex flex-col items-center justify-center'>12-1<span className='text-[0.5rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>1-2<span className='text-[0.5rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>2-3<span className='text-[0.5rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>3-4<span className='text-[0.5rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>4-5<span className='text-[0.5rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>5-6<span className='text-[0.5rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>6-7<span className='text-[0.5rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>7-8<span className='text-[0.5rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>8-9<span className='text-[0.5rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>9-10<span className='text-[0.5rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>10-11<span className='text-[0.5rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>11-12<span className='text-[0.5rem]'>AM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>12-1<span className='text-[0.5rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>1-2<span className='text-[0.5rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>2-3<span className='text-[0.5rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>3-4<span className='text-[0.5rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>4-5<span className='text-[0.5rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>5-6<span className='text-[0.5rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>6-7<span className='text-[0.5rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>7-8<span className='text-[0.5rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>8-9<span className='text-[0.5rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>9-10<span className='text-[0.5rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center'>10-11<span className='text-[0.5rem]'>PM</span></div>
                    <div className='w-[100px] flex flex-col items-center justify-center '>11-12<span className='text-[0.5rem]'>PM</span></div>

                </section>
                <section data-label='planContainer' className='flex flex-col w-[2400px] h-[476px] border-b-[1px]'>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-gray-400 py-[10px]'>
                      <div className='h-full w-[90%] bg-blue-300 rounded'></div>
                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-gray-400 py-[10px]'>

                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-gray-400 py-[10px]'>

                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-gray-400 py-[10px]'>

                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-gray-400 py-[10px]'>

                    </div>
                    <div className='h-[68px] w-full flex items-center border-b-[1px] border-gray-400 py-[10px]'>
                      <div className='h-full w-[90%] bg-blue-300 rounded'></div>
                    </div>
                    <div className='h-[68px] w-full flex items-center py-[10px]'>
                      <div className='h-full w-[90%] bg-blue-300 rounded'></div>  
                    </div>
                    
                </section>
              </div>
              
               
          </div>
          </div>
      </div>
    );
    
};

export default TimeTable;