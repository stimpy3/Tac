 Good Practices in React Coding

1. Always check if an element exists when accessing the DOM directly
When using document.querySelector or similar DOM methods, always check if the element exists before using it.

js----------------------
const el = document.querySelector(".percent");
if (el) {
  el.innerText = "60%";
}
------------------------
Why?
React may conditionally render components.
During certain phases, the element may not exist yet.
This can lead to runtime errors like Cannot read properties of null.
Especially important when using querySelector, getElementById, etc., and not useRef.

