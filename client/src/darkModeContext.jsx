
/*
Part 1: What does DarkModeContext (which is the context object we made) hold?
You created it using:
const DarkModeContext = createContext();

That gives you this context object:
{
  Provider: <React.Provider />,  // gives data to children
  Consumer: <React.Consumer />   // reads data (for old class components)
}
So — by itself, DarkModeContext holds nothing useful
until you wrap something with its .Provider:

<DarkModeContext.Provider value={{ mode, setMode }}>
  {children}
</DarkModeContext.Provider>
Here, the value={...} is where you inject the actual data — you're saying:
“Hey React, everyone inside this tree can access { mode, setMode }.”
*/

/*
✅ Named Export
-export const X = ...
-Must import with { X }
-Allows multiple exports per file
-Import name must match

✅ Default Export
-export default X
-Import with any name (e.g., import Y from)
-Only one default per file
-Import name can be anything
 */
import { createContext, useContext, useEffect, useState } from "react";

const DarkModeContext = createContext(); //context useContext
//This creates a context object — basically a container to hold shared state or logic.

//DarkModeProvider--You can name it anything you want.
export const DarkModeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem("mode");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    localStorage.setItem("mode", mode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", mode);
  }, [mode]);

  return (
    //DarkModeContext.Provider is the React component used to inject a value
    <DarkModeContext.Provider value={{ mode, setMode }}> {/*value={...} is the object we want to make globally available 
    means whatever components are wrapped inside can access the context*/}
      {children}
    </DarkModeContext.Provider>
    /* children is a react special prop, it has to be named this only, but its also not a keyword
    children is not a JavaScript keyword,
      but it is a special prop name that React automatically passes to components. */
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
/* useContext(DarkModeContext); means Give me the value that was passed to <DarkModeContext.Provider value={...}>.”
So if this is your provider:
<DarkModeContext.Provider value={{ mode, setMode }}>
Then:
useContext(DarkModeContext)

returns:
{ mode, setMode }

Part 3: What does this custom hook do?
export const useDarkMode = () => useContext(DarkModeContext);
This is just a shortcut.

Instead of writing:
const { mode, setMode } = useContext(DarkModeContext);
every time, now you can write:
const { mode, setMode } = useDarkMode();
That’s it.
You made a custom, reusable hook that simply wraps useContext.

You're creating a custom React hook named useDarkMode.
This is just a normal arrow function — but by convention:
-Hooks start with use
-So React knows it's a hook (and can enforce hook rules)
*/
