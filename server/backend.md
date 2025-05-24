current file structure for our backend
server/
├── index.js              ← Main backend file (Express server)
└── models/
    └── employee.js       ← Mongoose schema/model for employees

Dependencies you're using:
1. express – for creating a web server
2. mongoose – to connect and interact with MongoDB
3. cors – to allow requests from a frontend (e.g., React app on a different port)
4. employeeModel – your MongoDB model to store users (employees)

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
models/ → all your data models (e.g., employees, products, etc.)
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


Q. Why do we need ports?
A single computer can run multiple network services (e.g. a database, a web server, a file server). The IP address tells which machine to reach, and the port number tells which service on that machine to reach.

For example:
localhost:3001 → Express server
localhost:5173 → React frontend (Vite dev server)
localhost:27017 → MongoDB
Each service listens on a unique port to avoid conflict.

You can remember it like:
IP address = building address
Port = room number in the building

Express server = person inside a specific room who responds to knocks (requests)