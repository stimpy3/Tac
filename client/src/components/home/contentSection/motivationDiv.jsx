import { useEffect, useState } from 'react';
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

  return (
    <div className="h-[110px] w-full bg-black rounded-xl flex items-center justify-center p-[20px] bg-[url('/topbarBG.png')] bg-cover">
      <p className="text-white text-[1.2rem] text-center select-text">{"\""+quote+"\"" || "Loading quote..."}</p>
    </div>
  );
};

export default MotivationDiv;
