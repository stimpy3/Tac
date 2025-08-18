// Load Mongoose library (used to connect and work with MongoDB)
const mongoose=require('mongoose')

// Create a schema (structure) for user data
// This defines what fields an user will have in the database
const userSchema= new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    picture:String, // For Google OAuth users
}) 

// Create a Mongoose model from the schema
//IN OUR CASE OUR DATABASE IS CALLED tac and collection is users
//can have various collections like customers, produts etc...
//our user collection has many documents (each user info group like username password form one document)
// "users" is the name of the MongoDB collection this model will work with
// The model is like a class that gives us functions to create, read, update, delete users

/* WHY USE A MODEL
1. Created from a schema, but does more than just hold structure.
2. Gives you built-in functions to work with the database easily (create, read, update, delete).
3. Translates your JavaScript calls into MongoDB queries.
4. Manages connection between your code and MongoDB collection.
5. Allows you to add custom methods or hooks on your data later (optional advanced features). */

//Those functions are built into the model. You don't have to write the SQL-like code yourself.
//so this userModel is more like a class which has mnay inbuilt functions like CRUD
//so dont need to write SQL
const userModel=mongoose.model("users",userSchema)
//NOW userModel collection this model will work with
//The model is like a class that gives us functions to create, read, update, delete users
// Export the model so it can be used in other files (like index.js)
module.exports=userModel
/*
Q. What is module.exports?
Each JavaScript file in Node.js is treated as a separate module. By default, everything
within a module is private to that file. To make certain parts of your module accessible
to other files, you assign them to module.exports.
For example, if you have a file math.js with a function add, you can export it like this:

// math.js
function add(a, b) {
  return a + b;
}

module.exports = add;
*/


