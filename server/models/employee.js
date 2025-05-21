const mongoose=require('mongoose')

const employeeSchema= new mongoose.Schema({
    username:String,
    password:String
}) 

const employeeModel=mongoose.model("employees",employeeSchema)
module.exports=employeeModel
