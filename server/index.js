const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")
const employeeModel=require('./models/employee')

const app=express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost:27017/tac")

app.post('/register',(req,res)=>{
    employeeModel.create(req.body)
    .then(employees=>res.json(employees))
    .catch(err=>res.json(err))
});

app.listen(3001,()=>{
    console.log("server is running")
})
