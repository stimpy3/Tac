// const jwt = require("jsonwebtoken");

// export function verifyToken(token) {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch {
//     return null;
//   }
// }
//THE ABOVE IS ES SYNTAX, BELOW IS COMMONJS SYNTAX

/*
 What is jsonwebtoken?
 jsonwebtoken (often abbreviated as JWT) is a Node.js library you install via npm install jsonwebtoken.
 It lets you create and verify JSON Web Tokens (JWTs).
 JWTs are a way to securely send data (like user ID, email, or roles) between a server and a client.
 */
const jwt = require("jsonwebtoken");

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);//Takes the token (string) and the secret key (JWT_SECRET from your .env file).
    /*
    If the token is valid (not expired, not tampered with):
    → It returns the decoded payload inside the token.
    (For example, something like { id: "12345", email: "test@gmail.com", iat: 1234567890 }).
     */
  } catch { //If the token is invalid (expired, tampered with, etc.):
    // It catches the error and returns null.
    // This is useful for checking if a token is valid or not.
    return null;
  }
}

module.exports = { verifyToken };
/*
In Node.js, every file is treated as a module.
If you want to use something from one file in another, you must export it.
module.exports is the object that defines what gets exported.
So this:
module.exports = { verifyToken };

is the same as:
module.exports = {
  verifyToken: verifyToken
};
 */

/*
SYNTAX:
jwt.verify(token, secretOrPublicKey, [options, callback])

1)token → the JWT string you’re verifying (e.g. "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...").
2)secretOrPublicKey → the key used to sign the token originally:
  -For HS256 (default), this is your process.env.JWT_SECRET.
  -For RS256, it’s a public key.
3)options → optional (like ignoring expiration).
4)callback → if you don’t use callback, it throws errors on failure (like in your code).
 */

/*
What is process.env?
process = a global object in Node.js that gives info about the running app.
.env = a property on it that stores environment variables.
So, process.env = “the place where all your environment variables live”.
 */