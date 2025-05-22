
const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const employeeModel=require('./models/employee') //LOOK AT ./models/employee.js file for explantion on this
/*require() is a built-in function in Node.js.
=> It is used to import code from:
=> other files (your own code),
installed libraries (like Express, Mongoose, etc.).

Because require() returns an object or a function, or a class — depending on what the module exports
this is stored it in a variable to use its features.
*/

const app=express()
/*app is just a variable name you gave 
and when you wrote const express = require("express"), express became a function.
Now you're calling that function using express()
It returns an Express application object — this object is your server so variable app is your server object.
Now you can use app(the server object we named as app) to:
1. Route: A path (URL) on your server that responds to client requests.(app.post get etc..)
2. Middleware: A function that processes requests before they reach the route handler.(app.use)
              Root handler (or route handler) is just a fancy term for the function you write to handle a specific route
              example:
                   app.get("/", (req, res) => {
                                 res.send("Hello world!");
                                 });
            The function (req, res) => { res.send("Hello world!"); } is the route handler (or root handler if the route is /).

3. Start listening:Tells the server to wait and respond to incoming client requests on a specific port.(app.listen)
Think of app as your backend server instance.
*/

/*
Q. Why do we need a router when we already have an app?
The app can handle routes directly, but as your project grows, all routes in one file 
get messy and hard to maintain.
Think of the app as the big main place where everything happens.
The router lets you split routes into smaller pieces — each piece handles related routes together.
 
const express = require('express');
const router = express.Router();  // create a router object

router.get('/', (req, res) => {
  res.send('Users home page');
});

module.exports = router;

WE haven't use drouter yet as project is small 
you can see we used app.post and not router.post
*/

app.use(express.json())
// express.json() is built-in middleware that tells the server:
// "If the incoming request has JSON data (like { "username": "john" }), convert it into a JS object"
// This process is called parsing (parse = break down the raw string into usable JS object)
//.use() is a method on the Express app (or router) that adds middleware functions to your server(app in this case)
// Without this, req.body will be undefined when you send JSON data from frontend

app.use(cors())
// Allows requests from different origins (example: your frontend runs on localhost:5173 and backend on localhost:3001)
// Without this line, your frontend would be blocked from talking to the backend due to CORS policy
//cross origin Resource Sharing 

mongoose.connect("mongodb://localhost:27017/tac")
// Connects your backend to a local MongoDB database named "tac"
// mongoose.connect returns a promise, so you can also add .then()/.catch() if you want to confirm connection

//register route
app.post('/register',(req,res)=>{
       // This route runs when a POST request is made to /register
       // The data sent from frontend will be in req.body (because of express.json())
       // 1. 'register' here is the URL path (route) you defined.
     //    It's NOT a keyword, you choose it yourself based on what you want the route to do.
     //    For example, it could be '/login' or '/add-employee' or anything else.

     // 2. 'req' stands for 'request' — it represents the data the client (frontend) sends to your server.
     //    The data sent in POST request is accessed using req.body (because of app.use(express.json()))
     //    This means the client sends JSON, Express parses it, and gives you a JavaScript object here.

     // 3. 'res' stands for 'response' — it’s how your server sends data back to the client.
    employeeModel.create(req.body)
     // create() is a Mongoose function that adds the data to MongoDB
     // 4. employeeModel.create(req.body)
     //    'req.body' is a normal JavaScript object (not raw JSON string) containing the employee data.
     //    create() saves this object to the MongoDB database.
     //    It returns a Promise (an async operation).
    .then(employees=>res.json(employees))
     // 5. .then(employees => res.json(employees))
     //    After saving, 'then' runs with the saved data (still a JS object).
     //    res.json() converts that JS object into JSON format and sends it back to the client.
     //    We send it back so the client knows the data was saved successfully and can see what was saved.
     // If it works, send back the saved data as JSON
    .catch(err=>res.json(err))
    // If there’s an error, send the error back as JSON
    // 6. .catch(err => res.json(err))
    //    If an error happens, send the error as JSON back to the client so it knows something went wrong.
});

/*Q. Bonus: What is an API?
Your backend Express server acts as an API (Application Programming Interface).
An API is a set of rules and paths that allows your frontend and backend to talk by sending and receiving data.
When frontend calls /register, it’s calling an API endpoint that handles registration. 
here the path i register and rules are what to do wen we get a post request*/


//login route

app.listen(3001,()=>{
    console.log("server is running")
    //app.listen:- It starts your Express server and tells it to listen for incoming requests.
    /*3001 → This is the port number your backend server will use. TOO KNOW MORE ON PORTS SEE backend.md file
      The function () => { console.log("server is running") } runs once when the server starts. */
    // Starts the server on port 3001
    // Now you can visit http://localhost:3001 from tools like Postman or your frontend
    /*
     When you run this:

                app.listen(3001, () => {
                                 console.log("server is running")
                                       });

          It tells your computer's operating system (OS):         
          “I want to open port 3001 and wait for incoming HTTP requests on that port.”

          So now, your Express app is the owner of port 3001.
          That’s what “binds to port” means:
          The Express server reserves port 3001 and says:
          “I’m handling everything that comes to this port.”

           What happens when a request is made?
           Let’s say a browser (or Postman) sends a request to:
            http://localhost:3001/register
            Here's what happens step-by-step:
            1. The request goes to localhost (your own computer).
            2. The OS sees that the request is for port 3001.
            3. The OS checks if any program is listening on port 3001.
            4. It finds your Express app bound to that port.
            5. It delivers the request to Express.
            6. Express checks your route:
            /register and processes it (in your .post('/register', ...) code).
            */
})

/*
Q. Why does the client need a response back?
When the client sends a request (like sending user data with POST /register), it expects to know what happened.

The response tells the client:
If the data was saved successfully
Or if there was an error
Or any other useful info (like the saved user’s ID)
Without a response, the client wouldn’t know if it should show a success message, an error, or retry.
This communication is called request-response — the client asks, the server replies.

If you ignore sending a response back, here’s what happens:
The client will keep waiting for a response until it times out (because every HTTP request expects some reply).
The user might see the app freeze or nothing happen, because the frontend never gets confirmation.
Your server connection stays open longer than needed, which wastes resources and can cause problems under load.
Browsers or clients may show errors like “Request timed out” or “No response from server.”
It breaks the communication loop — the client can’t know if the action succeeded or failed.



Q. Why send response as JSON? Why JSON format?
JSON is a text format that looks like JavaScript objects but is language-independent.

It's the standard for APIs
(API = Application Programming Interface — a way for different programs or parts of programs to talk to each other using defined rules and formats.)
Even if you don’t call external APIs now, your Express server acts as an API for your frontend — it provides data and accepts requests following rules.
JSON makes it easy for the client (like a browser or React app) to parse the response and use it as data.
JSON is lightweight and easy to read/write for both humans and machines.
When you use res.json(), Express:
Converts your JS object to JSON text
Sets Content-Type: application/json header so the client knows it’s JSON
Sends it back so client-side code can use it directly */

/*Q. Why is app.listen() written after everything else? Shouldn’t it be first?

Answer:
No, app.listen() should be at the end because:
It starts the server.
You must define your routes and middleware before starting the server — otherwise, 
the server will start without knowing how to handle requests.
Think of app.listen() like turning on the radio — you first set up the playlist
 (routes, middleware), then hit play (listen).*/


/*summary
// 1. Import required libraries and files
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const employeeModel = require('./models/employees'); // our MongoDB model

// 2. Create server object
const app = express(); // app is now our server object

// 3. Middleware
app.use(express.json()); // converts JSON from frontend into JS object (req.body)
app.use(cors());         // handles cross-origin requests (frontend and backend ports are different)

// 4. Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yourDBname");

// 5. Define API routes
app.post('/register', (req, res) => {
    employeeModel.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

// 6. Start the server
app.listen(3001, () => {
    console.log("Server running on port 3001");
});
*/ 