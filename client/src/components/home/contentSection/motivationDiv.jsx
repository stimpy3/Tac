import { useEffect, useState } from 'react';
import Aurora from '../../aurora.jsx';
import axios from 'axios';
const MotivationDiv = () => {
  const [quote, setQuote] = useState("");
  /*SAMPLE RESPONSE FROM API-response.data
  {
  "contents": "[{\"q\":\"Quote text...\",\"a\":\"Author...\"}, {\"q\":\"Another...\"}]",
  "status": {
    "url": "https://zenquotes.io/api/quotes",
    "content_type": "application/json; charset=utf-8",
    "http_code": 200,
    "response_time": 0.2
    } 
  }
   
  response.data.contents="[{\"q\":\"Quote text...\",\"a\":\"Author...\"}, {\"q\":\"Another...\"}]"
  That’s why you need to JSON.parse() it → to convert that string into a real JavaScript array of objects:

   */
  useEffect(() => {
  const fetchQuote = async () => {
    try {
      // Check cache inside effect
      const cached = localStorage.getItem("quotesData");

      if (cached) {
        const quotes = JSON.parse(cached);
        console.log("Loaded from cache", quotes);

        const random = Math.floor(Math.random() * quotes.length);
        if (quotes[0]?.q.includes("Too many requests")) {
          setQuote("Keep going — even the best APIs need a break sometimes 🚀");
        } else {
          setQuote(quotes[random].q);
        }
        return;//stop here if cache exists
      }

      //If no cache==fetch fresh
      const response = await axios.get(
        "https://api.allorigins.win/get?url=https://zenquotes.io/api/quotes"
      );

      const quotes = JSON.parse(response.data.contents);

      // Save to localStorage
      localStorage.setItem("quotesData", JSON.stringify(quotes));

      const random = Math.floor(Math.random() * quotes.length);
      if (quotes[0]?.q.includes("Too many requests")) {
        setQuote("Keep going — even the best APIs need a break sometimes 🚀");
      } else {
        setQuote(quotes[random].q);
      }
    } catch (error) {
      console.error("Fetching error:", error);
      setQuote("Could not load quote. Try refreshing!");
    }
  };

  fetchQuote();
}, []);
  
  

  //bg-[url('/topbarBG.png')] dark:bg-[url('/dtopbarBG.png')]
  return (
  <div className="relative h-[130px] w-full bg-daccentS dark:bg-daccentM rounded-xl flex items-center justify-center p-[0px] bg-cover border-[1px] border-accentBorder2 dark:border-daccentBorder2 overflow-hidden">
    <Aurora className="absolute" colorStops={["#8b3cfa", "#1cb0e6", "#4c008a"]} blend={10.0} amplitude={2.0} speed={1}/>
       <p className="absolute max-w-full text-white text-[1.2rem] text-center select-text px-4">
        {"\"" + quote + "\"" || "Loading quote..."}
       </p>
  </div>
);

};

export default MotivationDiv;
