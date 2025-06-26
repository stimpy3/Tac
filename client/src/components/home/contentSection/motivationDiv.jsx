import { useEffect, useState } from 'react';
import Aurora from '../../aurora.jsx';
const MotivationDiv = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Using allorigins proxy with correct headers
    fetch('https://api.allorigins.win/get?url=https://zenquotes.io/api/quotes')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(data => {
        const quotes = JSON.parse(data.contents); // Parse the response body
        console.log("Fetched data:", quotes); // Check in console
        const random = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[random].q); // Set random quote
      })
      .catch(error => {
        console.error("Fetching error:", error);
        setQuote("Could not load quote. Try refreshing!");
      });
  }, []);
  //bg-[url('/topbarBG.png')] dark:bg-[url('/dtopbarBG.png')]
  return (
  <div className="realtive h-[130px] w-full bg-daccentS dark:bg-daccentM rounded-xl flex items-center justify-center p-[0px] bg-cover border-[1px] border-accentBorder2 dark:border-daccentBorder2 overflow-hidden">
    <Aurora className="absolute" colorStops={["#8b3cfa", "#1cb0e6", "#4c008a"]} blend={10.0} amplitude={2.0} speed={1}/>
    <p className="absolute z-[5] w-[70%] text-white text-[1.2rem] text-center select-text">
      {"\"" + quote + "\"" || "Loading quote..."}
    </p>
  </div>
);

};

export default MotivationDiv;
