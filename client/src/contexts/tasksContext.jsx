// src/context/TasksContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  //fetching the schedules here itself
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/schedules`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data.map(task => ({
                  ...task,
                  startTime: task.startTime,
                  endTime: task.endTime
                })));
      } catch (err) {
        console.error('Failed to fetch schedules:', err);
      }
    };
    fetchSchedules();
  }, []);

  return (
    <TasksContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TasksContext.Provider>
  );
};
