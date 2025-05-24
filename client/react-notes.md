Areas to explore more:-
-react routers
-use effect hook
-------------------------------------------------------------------------------------------------

BASICALLY EXPLAINING WHY/WHEN WE NEED USESTATE IN REACT------------------------------------------
🧠 React's "Declarative UI" System
React works with a declarative approach to building UIs. This means that:

You describe what the UI should look like at any given moment based on some data (like an array, a string, a number, or any other state).

React reactively updates the UI when that data changes.

🚨 The Core Concept: React's Virtual DOM
React uses something called the Virtual DOM, which is an in-memory representation of the real DOM (the actual UI on the screen).

When the UI changes (e.g., a user clicks a button), React compares the new state with the previous state of the Virtual DOM (this process is called "reconciliation"). After comparing, React efficiently updates the real DOM to reflect only the changes (not the entire page).

💡 So why do we need useState?
Initial Render (Static UI):
When you first write your UI in React, it’s static — meaning, it’s just rendered once based on the initial values of the state.

User Interaction:
When the user clicks something (like a button or a link), you want to change something on the page — like showing a popup or adding an item to a list. You need state to track changes (like whether the popup is shown or hidden).

React and the Virtual DOM:
React doesn’t know about changes unless the state changes. When you update the state, React knows that the UI needs to change, and it re-renders the components based on the new state.

🚀 Why useState and Dynamic Behavior?
Without useState, React wouldn’t know when to update the UI.

If you click a button or type something in an input, and you don’t use state, React won’t notice the change and the UI won’t update.

With useState, React tracks the state variable, and when that state changes (like when the user clicks a button), React automatically updates the UI to reflect the new state.
--------------------------------------------------------------------------------------------------
SOMETIME WE WHEN USING onClick we do onClick={func1} or sometimes onClick={()=>func1(dd)}

Without arguments: Use onClick={functionName} to directly reference the function.

With arguments: Use onClick={() => functionName(arg)} to pass arguments or include extra logic, preventing immediate execution during render because the arguement might not have the correct 
value because we immediately re-render.
--------------------------------------------------------------------------------------------------
USEEFFECT IN REACT

React is responsible for rendering your UI — the stuff inside your components.
But things like 
-scrolling the page
-updating the document.body
- working with timers
- or calling APIs 
happen outside of React’s render system.


useState → Stores and updates data (state)
Think of it like memory for your component.
You use it when:
-You want to store some value (like a number, string, object).
-You want the UI to re-render when that value changes.


useEffect → Runs code in response to something changing
Think of it like: “when something happens, do something.”
You use it when:
-You want to respond to a change (like a button click, or a modal opening).
-You need to do something outside of rendering, like:
-Fetching data
-Changing the page title
-Listening to scroll or keyboard events
-Editing the document.body (like disabling scroll)

SYNTAX-----------------------------------------------

useEffect(() => {
  // code here runs when `show` changes
}, [show]);

What it means:
React will run the useEffect code whenever show changes.
In your case, that means:
When show goes from false → true (overlay opens)
Or from true → false (overlay closes)

If you left this DEPENEDENCY ARRAY empty ([]), it would 
run only once — when the component first mounts. But we
 want it to re-run every time show changes.
---------------------------------------------------------

USEEFFECT CLEANUP
useEffect runs after the component renders. Sometimes, you want to do something when the component unmounts or when the effect needs to be cleaned up.

To handle this, React allows you to return a cleanup function from within useEffect
Cleanup Flow:
useEffect runs when the component mounts (or when dependencies change).
The cleanup function runs when the component unmounts.

SYNTAX-----------------------
return function cleanup() {
  // Cleanup logic here
};

OR

return () => {
  // Cleanup logic here
};
------------------------------
--------------------------------------------------------------------------------------------------
REACT GROUPS

Common states with group:
1. group-hover: → when parent is hovered
2. group-focus: → when parent is focused
3. group-active: → when parent is active
4. group-disabled: → when parent is disabled
etc....

It allows child elements to react to parent states, which is not normally possible with regular CSS unless you write custom selectors.

--------------------------------------------------------------------------------------------------
