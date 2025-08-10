current file structure for our backend
server/
├── index.js              ← Main backend file (Express server)
└── models/
    └── user.js       ← Mongoose schema/model for users

Dependencies you're using:
1. express – for creating a web server
2. mongoose – to connect and interact with MongoDB
3. cors – to allow requests from a frontend (e.g., React app on a different port)
4. userModel – your MongoDB model to store users (users)

Q. What is an Express server?
An Express server is just a Node.js server using the Express.js library.
Node.js lets you run JavaScript on the backend (outside the browser).
Express.js makes it easier to handle HTTP requests (like GET, POST, etc.).
So your index.js file is an Express server.
It:
Listens for incoming requests (app.listen)
Handles routes like /register
Sends responses
🔁 You can think of it as a middleman between your frontend (React) and your database (MongoDB).


Q. What is a web server?
A web server is a general term. It is any program that:
Accepts HTTP requests
Sends back HTTP responses

Example:
When you type google.com, a web server sends back the HTML of Google’s homepage.
When your React app calls http://localhost:3001/register, your Express server (a kind of web server) handles that.
So:
Web server = general concept
Express server = a specific web server built using Express.js


Q. Why did you make a models folder?
Reason:
To organize your code.
You created the folder to store your Mongoose model, which defines the structure of data in MongoDB.
Instead of putting everything in index.js, it's better to separate parts like:
models/ → all your data models (e.g., users, products, etc.)
routes/ (later) → all your route logic
controllers/ (optional later) → separate the logic that handles each route


Q. Will you expand models/ soon?
Most likely: Yes, if your project grows.
Examples:
You add a Product model: models/product.js
You add a Message model for chat: models/message.js
You add a Post model for blogs: models/post.js
Even if you don’t add more models right now, having the folder from the start keeps your project clean and scalable.


Q. What is a Port? (Technical-first Explanation)
In networking, a port is a 16-bit number (from 0 to 65535) that identifies a specific process or service on a device (like a server or your local computer).

When you run a server (like an Express app), it listens on a specific port to accept incoming TCP or HTTP connections.

 TCP (Transmission Control Protocol):
-It's like a phone call between two computers.
-Ensures the message is delivered, complete, and in order.
-It's low-level — doesn't care what you're sending, just that it arrives safely.
-Used by many things — including HTTP.

Q--✅ HTTP (HyperText Transfer Protocol):
-It's like how a browser talks to a website.
-Runs on top of TCP.
-Sends requests like:
-"Get me this webpage"
-"Post this form"
-It’s high-level — understands web concepts like URLs, methods (GET, POST), headers, etc.

TCP = Reliable delivery system.
HTTP = Language of the web, uses TCP to move data.

Analogy:
Layer	Role
TCP	    The delivery truck (ensures packages arrive intact)
HTTP	The package inside — says “this is a request for a webpage”


Q. Why do we need ports?
A single computer can run multiple network services(A network service is any software or program running on a computer that communicates over a network 
(like the internet or a local network).
Each of these services “listens” for incoming data — and responds to requests. e.g. a database, a web server, a file server).
 The IP address tells which machine to reach, and the port number tells which service on that machine to reach.

 Summary:
-Even on a single computer, services talk over network protocols, which need:
-IP address (usually 127.0.0.1)
-Port number
-Without an IP, the networking system can't function — even if everything is local.

For example:
localhost:3001 → Express server
localhost:5173 → React frontend (Vite dev server)
localhost:27017 → MongoDB
Each service listens on a unique port to avoid conflict.

You can remember it like:
IP address = building address
Port = room number in the building

Express server = person inside a specific room who responds to knocks (requests)


Q--✅ What is CORS?
CORS stands for Cross-Origin Resource Sharing.
It’s a security feature built into browsers that controls whether one website can request data from another website.

Q--🔒 Why is it needed?
To protect users from attacks.
Imagine you're logged into your banking site, and you visit a sketchy website. Without CORS, that sketchy site could secretly send requests to your bank and steal your data.
CORS stops this by saying:
"Only certain trusted websites (called origins) are allowed to access this data."

Q--What's an origin in CORS, THE O IN CORS?
An origin is made of:
Protocol (like http or https)
Domain (the main website name, like example.com)
Port (the number after a colon, like :3000, used to run multiple services on one IP)
http://localhost:3000 → one origin  
http://localhost:5173 → another origin (different port)
Even if they run on the same computer, they are treated as different origins.

Q--What triggers CORS?
Suppose you're building a frontend React app at: -> http://localhost:5173 
And your backend API is running at: -> http://localhost:3000

These are different origins, so when your frontend tries to fetch data from the backend,
the browser blocks it unless the backend says:
Access-Control-Allow-Origin: http://localhost:5173

Q--How to fix CORS (as a developer)
You fix CORS by changing settings on your backend — not in your frontend.
Example for Node.js (Express):

 browser won’t let a request complete unless the backend responds with the right CORS headers:
 this header -> Access-Control-Allow-Origin    
 using this code:

const cors = require("cors");
app.use(cors({
  origin: "http://localhost:5173"  // Allow requests from this origin
}));























const express=require("express")  //require() is used to import code or packages into your file.
const mongoose=require("mongoose") //Mongoose is a JavaScript library that helps you interact with MongoDB
//  (a NoSQL database) easily from Node.js.
const cors=require("cors") //It imports the CORS (Cross-Origin Resource Sharing) middleware into your Node.js backend.
const cookieParser = require("cookie-parser");//cookies for fetching user name
const userModel=require('./models/user') 

//LOOK AT ./models/user.js file for explantion on this
/*require() is a built-in function in Node.js.
=> It is used to import code from:
=> other files (your own code),
installed libraries (like Express, Mongoose, etc.).

Because require() returns an object or a function, or a class — depending on what the module exports
this is stored it in a variable to use its features.
*/

const app=express();
/*app is just a variable name you gave 
and when you wrote const express = require("express"), express became a function.
Now you're calling that function using express()
It returns an Express application object — this object is your server so variable app is your server object.
Now you can use app(the server object we named as app) to:
1. Route: A path (URL) on your se  rver that responds to client requests.(app.post get etc..)
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

WE haven't use router yet as project is small 
you can see we used app.post and not router.post
*/

app.use(express.json());
/*
app.use(express.json()); // converts JSON from frontend into JS object (req.body)
// What app.use(express.json()) does:
-It adds a middleware that:
-Listens to any incoming request with a Content-Type: application/json
-Takes the raw JSON bodyParses it into a JavaScript object
-Puts that object into req.body automatically

//Whenever your frontend sends data using fetch() or axios.post(), the browser includes this in the request headers: Headers are extra bits of information sent along with an HTTP request or response.
They are not the actual data (like a password or an image), but metadata — information about the request or response.
example:-
Content-Type: application/json // application/json is an HTTP header that tells the server: “the data I’m sending you is in JSON format.”
This way, the backend knows how to read the body (whether to parse it as JSON, form-data, plain text, etc.).

🛠️ Examples of HTTP headers
Header Name	What It Means
Content-Type	Format of the body (e.g. application/json)
Authorization	Contains a token or credentials to access protected data
Cookie	Sends stored cookies to the server
User-Agent	Info about browser/device making the request
Accept	What response formats the client can handle (text/html, etc.)
Origin	The domain (origin) where the request came from*/

// express.json() is built-in middleware that tells the server:
// "If the incoming request has JSON data (like { "username": "john" }), convert it into a JS object"
// This process is called parsing (parse = break down the raw string into usable JS object)
//.use() is a method on the Express app (or router) that adds middleware functions to your server(app in this case)
// Without this, req.body will be undefined when you send   JSON data from frontend

/* 1--------------
app.use(cors())
*/ //Allow any website to send requests to me — I’ll respond---unsafe!!!!
//Only allows basic CORS
//Does NOT allow cookies or auth headers to pass between frontend & backend
//to allow that we do


/* 2----------------
app.use(cors({
  origin: 'http://localhost:5173', //origin tells your backend Only accept requests from this frontend for security
  credentials: true  //The credentials: true option in cors configuration allows the server to accept cookies and
  }));               //  authentication headers from the frontend (like Authorization, Cookie, etc.).


*/

/*3---------------*/

app.use(cookieParser());//used for fetching name using cookies


const allowedOrigins = [
  "http://localhost:5173",
  "https://stay-tac.netlify.app"
];

//origin → this is the website (frontend) making the request
//callback → this is how you tell CORS “yes” or “no” for that origin
/*
   !origin
This means:
“If the origin is missing or empty”
This can happen in special cases:
When you're using tools like Postman, curl, or server-to-server requests that don’t set an origin.*/

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);   //Means: ✅ “Allow this origin.”
    } else {
      callback(new Error("Not allowed by CORS")); //Means: ❌ “Block this origin.”
    }
  },
  credentials: true
}));
// Allows requests from different origins (example: your frontend runs on localhost:5173 and backend on localhost:3001)
// Without this line, your frontend would be blocked from talking to the backend due to CORS policy
//cross origin Resource Sharing 

mongoose.connect("mongodb://localhost:27017/tac");
// Connects your backend to a local MongoDB database named "tac"
// mongoose.connect returns a promise, so you can also add .then()/.catch() if you want to confirm connection



//register route
app.post('/register',(req,res)=>{
       // This route runs when a POST request is made to /register
       // The data sent from frontend will be in req.body (because of express.json())
       // 1. 'register' here is the URL path (route) you defined.
     //    It's NOT a keyword, you choose it yourself based on what you want the route to do.
     //    For example, it could be '/login' or '/add-user' or anything else.

     // 2. 'req' stands for 'request' — it represents the data the client (frontend) sends to your server.
     //    The data sent in POST request is accessed using req.body (because of app.use(express.json()))
     //    This means the client sends JSON, Express parses it, and gives you a JavaScript object here.

     // 3. 'res' stands for 'response' — it’s how your server sends data back to the client.
    userModel.create(req.body)
     // create() is a Mongoose function that adds the data to MongoDB
     // 4. userModel.create(req.body)
     //    'req.body' is a normal JavaScript object (not raw JSON string) containing the user data.
     //    create() saves this object to the MongoDB database.
     //    It returns a Promise (an async operation).
    .then(users=>res.json(users))
     // 5. .then(users => res.json(users))
     //    After saving, 'then' runs with the saved data (still a JS object).
     //    res.json() converts that JS object into JSON format and sends it back to the client.
     //    We send it back so the client knows the data was saved successfully and can see what was saved.
     // If it works, send back the saved data as JSON
    .catch(err=>res.json(err))
    // If there’s an error, send the error back as JSON
    // 6. .catch(err => res.json(err))
    //    If an error happens, send the error as JSON back to the client so it knows something went wrong.
});


//login rvcxoute
app.post("/login",(req,res)=>{
  const {email,password}=req.body;//req.body hold js objects (json to js object with help of app.use(epress.json()))
  //All Mongoose query methods like findOne(), find(), save(), update(), etc., return a Promise.
  //That’s why you use .then() or await to handle their results asynchronously.
   userModel.findOne({email:email}).then(user=>{ 
    //user is the document returned by MongoDB via Mongoose.
    //It is a JavaScript object representing the user record that matched the query.


    //Both .then() and await handle asynchronous operations.
    //When you use async/await, you don’t need .then() because await 
    // waits for the Promise to resolve and directly gives you the result.
    if(user){
      if(user.password==password){
        res.json("Success");
      }
      else{
        res.json("password Incorrect")
        console.log("wrong password");
      }
    }
    else{
      res.json("no such record exists");
      console.log("no record");
    }
  })
})


/*  login route part using await and async JUST FOR REFERENCE
app.post("/login", async (req, res) => {
  const { email, password } = req.body; // req.body is a JS object (parsed from JSON via app.use(express.json()))

  try {
    // Await the Promise returned by findOne()
    const user = await userModel.findOne({ email: email });

    if (user) {
      if (user.password === password) {
        res.json("Success");
      } else {
        res.json("password Incorrect");
        console.log("wrong password");
      }
    } else {
      res.json("no such record exists");
      console.log("no record");
    }
  } catch (error) {
    // Handle any possible errors from the DB query
    console.error(error);
    res.status(500).json("Internal server error");
  }
}); */




/*Q. Bonus: What is an API?
Your backend Express server acts as an API (Application Programming Interface).
An API is a set of rules and paths that allows your frontend and backend to talk by sending and receiving data.
When frontend calls /register, it’s calling an API endpoint that handles registration. 
here the path is register and rules are what to do when we get a post request*/



app.listen(3001,()=>{
    console.log("server is running");
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
});

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
const userModel = require('./models/users'); // our MongoDB model

// 2. Create server object
const app = express(); // app is now our server object



// 3. Middleware
app.use(express.json());
app.use(cors());         // handles cross-origin requests (frontend and backend ports are different)




// 4. Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yourDBname");

// 5. Define API routes
app.post('/register', (req, res) => {
    userModel.create(req.body)
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

// 6. Start the server
app.listen(3001, () => {
    console.log("Server running on port 3001");
});
*/ 















