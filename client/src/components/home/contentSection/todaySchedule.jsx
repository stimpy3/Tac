import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, SquarePen, CircleHelp } from 'lucide-react';
import Tooltip from "../../tooltip";
import gsap from "gsap";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const getToken = () => localStorage.getItem("token");

const TodaySchedule = () => {
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch today's schedule from backend
  useEffect(() => {
    const fetchTodaySchedule = async () => {
      setLoading(true);
      setError(null);
      try {
        const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
        const token = getToken();
        const res = await axios.get(`${BACKEND_URL}/schedules?day=${today}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTodaysTasks(res.data);
      } catch (err) {
        setError("Failed to fetch today's schedule");
        setTodaysTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTodaySchedule();
  }, []);

  const hoursCurr = new Date().getHours();
  const minutesCurr = new Date().getMinutes();

  const scheduleRef = useRef(null);
  const handleLeftScroll = () => {
    if (scheduleRef.current) {
      scheduleRef.current.scrollBy({
        left: -360,
        behavior: 'smooth',
      });
    }
  };

  const handleRightScroll = () => {
    if (scheduleRef.current) {
      scheduleRef.current.scrollBy({
        left: 360,
        behavior: 'smooth',
      });
    }
  };

  let width = 100;
  const [leftDistance, setLeftDistance] = useState(0);

  useEffect(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const minsSinceMidnight = hours * 60 + minutes + 6.64;
    const left = +(minsSinceMidnight * (width / 60)).toFixed(2);
    setLeftDistance(left);
  }, []);

  useEffect(() => {
    if (scheduleRef.current) {
      scheduleRef.current.scrollLeft = leftDistance - 200;
    }
  }, [leftDistance]);

  return (
    <div className="relative todaysScheduleContainer flex flex-col w-full h-fit mt-[30px] rounded-xl bg-accentM dark:bg-daccentM shadow-none">
      <div data-label="lable&ScrollBtnContainer" className='absolute h-[60px] w-[60%]'>
        <div data-label="INNERlable&ScrollBtnContainer" className='flex items-center justify-between w-full h-[60px] bg-accentS dark:bg-daccentS rounded-br-xl pb-[5px] pr-[20px]'>
          <div data-label="labelContainer" className='flex mr-[10px] h-full items-center'>
            <p className='mr-[5px] flex items-center text-[1.5rem] text-accentTxt dark:text-daccentTxt w-fit h-full whitespace-nowrap'>
              Today's Schedule
            </p>
            <Tooltip text="Need to edit in the schedule section to see today's schedule">
              <CircleHelp className="text-accentS3 dark:text-daccentS3 cursor-pointer" />
            </Tooltip>
          </div>
          <div data-label="btnContainer" className='ml-[10px] min-w-[80px] h-full flex items-center'>
            <button onClick={handleLeftScroll} className='flex items-center justify-center border-[1px] border-gray-500 shadow-lg w-[35px] aspect-square rounded-full bg-accentS2 dark:bg-daccentS2 text-accentTxt dark:text-daccentTxt mr-[5px] hover:bg-accent1 dark:hover:bg-accent1 hover:text-white transition-colors duration-400'><ChevronLeft /></button>
            <button onClick={handleRightScroll} className='flex items-center justify-center border-[1px] border-gray-500 shadow-lg w-[35px] aspect-square rounded-full bg-accentS2 dark:bg-daccentS2 text-accentTxt dark:text-daccentTxt hover:bg-accent1 dark:hover:bg-accent1 hover:text-white transition-colors duration-400'><ChevronRight /></button>
          </div>
        </div>
      </div>
      <div data-label="topLeftCurveContainer" className="bg-accentS dark:bg-daccentS w-[10px] h-[10px] absolute left-[60%]">
        <div data-label="topLeftCurve" className="w-[10px] h-[10px] rounded-tl-xl bg-accentM dark:bg-daccentM"></div>
      </div>
      <div data-label="topBottomLeftCurveContainer" className="bg-accentS dark:bg-daccentS w-[15px] h-[15px] absolute top-[60px] left-[0px]">
        <div data-label="topBottomLeftCurve" className="w-[15px] h-[15px] rounded-tl-xl  bg-accentM dark:bg-daccentM"></div>
      </div>
      <div data-label="schedulerContainer" className="h-[150px] w-full  flex flex-col">
        <div data-label="topDescContainer" className="flex h-[60px] w-[100%] p-[10px] pb-[0px] ">
          <div data-label="description" className="flex items-center justify-between p-[5px] ml-[calc(60%+12px)] bg-accentS2 dark:bg-daccentS2 w-full h-full rounded-[7px]">
            <p className="text-accentTxt w-full dark:text-daccentTxt text-[1rem] flex justify-center">Task Description</p>
            <div className="flex items-center min-w-[130px] border-l-[2px] border-daccentS3">
              <div className="ml-[10px] w-[30px] h-[30px] rounded-full bg-accent1 relative overflow-hidden">
                <div className="absolute inset-0 bg-accent2 [clip-path:polygon(50%_50%,100%_50%,100%_0)]"></div>
              </div>
              <p className="text-accentTxt dark:text-daccentTxt text-[0.7rem] ml-[5px]"> 2hrs 31mins left</p>
            </div>
          </div>
        </div>
        <div ref={scheduleRef} data-label="bottomScheduleContainer" className="w-full h-[calc(150px-60px)] px-[10px] py-[30px] scrollbar-hide overflow-auto relative">
          <div data-label="currentLineContainer" className="group absolute z-[6] w-fit h-[calc(150px-60px)] bottom-0 flex flex-col items-center" style={{ left: `${leftDistance - 6.5}px` }}>
            <div data-label="currentLineCircle" className="w-[12px] h-[12px] top-[50%] border-[3px] border-accent2 bg-transparent rounded-full"></div>
            <div data-label="currentLine" className="h-full w-[3px] bg-accent2"></div>
            <div data-label="tooltip" className="absolute p-[5px] bg-daccentM dark:bg-accentM text-daccentTxt dark:text-accentTxt text-[0.7rem] whitespace-nowrap flex flex-col rounded-sm z-[10] opacity-0 group-hover:opacity-70 pointer-events-none transition-opacity" style={{ left: 6, top: 12 }}>
              <p className="text-[0.7rem]">{((Number(hoursCurr) < 12) ?
                (((hoursCurr == 0) ? hoursCurr + 12 : hoursCurr) + ":" + String(minutesCurr).padStart(2, '0') + " AM")
                :
                (((hoursCurr == 12) ? hoursCurr : hoursCurr - 12) + ":" + String(minutesCurr).padStart(2, '0') + " PM"))
              }
              </p>
            </div>
          </div>
          <div data-label="scheduleLineContainer" className="w-[2400px] h-full relative">
            <div className="w-fit h-full flex rounded-lg overflow-hidden relative">
              {
                todaysTasks.map((task, index) => {
                  if (!task.startTime || !task.endTime) {
                    return null;
                  }
                  try {
                    const [shours, sminutes] = task.startTime.split(":").map(Number);
                    const startTimeInMins = shours * 60 + sminutes;

                    const [ehours, eminutes] = task.endTime.split(":").map(Number);
                    const endTimeInMins = ehours * 60 + eminutes;

                    const widthPx = (endTimeInMins - startTimeInMins) * (100 / 60);
                    const leftPx = startTimeInMins * (100 / 60);

                    const colors = [
                      "#8B7CB6", "#B084C7", "#E8A5C4", "#F4D1E8", "#A8D0F0",
                      "#9BB5E6", "#D3E4CD", "#F6EAC2", "#FAD9C1"
                    ];

                    return (
                      <div
                        key={task._id || `task-${index}`}
                        className="absolute group"
                        style={{
                          left: `${leftPx}px`,
                          width: `${widthPx}px`,
                          height: "40px",
                          zIndex: 2,
                          backgroundColor: 'lime'
                        }}
                      >
                        <div
                          data-label="visual"
                          className="h-full rounded-lg border-2 border-black"
                          style={{ backgroundColor: colors[index % colors.length] }}
                        >
                        </div>
                        <div
                          data-label="tooltip"
                          className="absolute p-[5px] bg-daccentM dark:bg-accentM text-daccentTxt dark:text-accentTxt text-[0.8rem] flex flex-col rounded-sm z-[10] opacity-0 group-hover:opacity-90 whitespace-nowrap pointer-events-none transition-opacity"
                          style={{ left: 0, top: -20 }}
                        >
                          <p>
                            {task.name.length > 15
                              ? task.name.slice(0, 15) + "..."
                              : task.name + ":"}
                          </p>
                          <p>
                            {(Number(shours) < 12
                              ? (shours === 0 ? shours + 12 : shours) +
                                ":" +
                                String(sminutes).padStart(2, "0") +
                                " AM"
                              : (shours === 12 ? shours : shours - 12) +
                                ":" +
                                String(sminutes).padStart(2, "0") +
                                " PM") +
                              "-" +
                              (Number(ehours) < 12
                                ? task.endTime + " AM"
                                : (ehours === 12 ? ehours : ehours - 12) +
                                  ":" +
                                  String(eminutes).padStart(2, "0") +
                                  " PM")}
                          </p>
                        </div>
                      </div>
                    );
                  } catch (error) {
                    console.error("Error rendering task:", error, task);
                    return null;
                  }
                })
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default TodaySchedule;