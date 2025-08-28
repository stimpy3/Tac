import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const NotifContext = createContext();

//making custom hook for easier usage of context in other components
export const useNotif = () => useContext(NotifContext);//it is a function because we need to call it to get the context value
//no direct assignment ,had to  usea function because we need to call it to get the context value

export const NotifProvider = ({ children }) => {
  const [notifCount, setNotifCount] = useState(0);
  const [notifArr, setNotifArr] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const fetchNotif = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(`${BACKEND_URL}/deadlines`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      const today = new Date();

      const notif = data.filter((event) => {
        const eventDate = new Date(event.date);
        return (
          today.getFullYear() === eventDate.getFullYear() &&
          today.getMonth() === eventDate.getMonth() &&
          today.getDate() === eventDate.getDate()
        );
      });

      setNotifArr(notif.map((e) => e.name));
      setNotifCount(notif.length);
    } catch (err) {
      console.error("Failed to fetch deadlines:", err);
    }
  };

  // Fetch once on mount
  useEffect(() => {
    fetchNotif();
  }, []);

  return (
    <NotifContext.Provider value={{ notifCount, setNotifCount, notifArr, setNotifArr, fetchNotif }}>
      {children}
    </NotifContext.Provider>
  );
};