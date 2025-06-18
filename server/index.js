const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const employeeModel = require('./models/employee')

const app = express()

app.use(express.json())
app.use(cookieParser())

const allowedOrigins = [
  "http://localhost:5173",
  "https://stay-tac.netlify.app"
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true
}))

mongoose.connect("mongodb://localhost:27017/tac")

app.post('/register', (req, res) => {
  employeeModel.create(req.body)
    .then(employees => res.json(employees))
    .catch(err => res.json(err))
})

app.post("/login", (req, res) => {
  const { email, password } = req.body
  employeeModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password == password) {
          res.json("Success")
        } else {
          res.json("password Incorrect")
        }
      } else {
        res.json("no such record exists")
      }
    })
})

app.listen(3001, () => {
  console.log("server is running")
})
