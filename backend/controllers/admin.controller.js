import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "jsonwebtoken"
import config from "../config.js";
import { Admin } from "../models/admin.model.js";

export const signup = async(req,res)=>{
    const {firstName,lastName,email,password}= req.body


   const adminSchema = z.object({
    firstName:z.string().min(5,{message:"firstName must be at least 5 chars long!!"}),
    lastName:z.string().min(3,{message:"lastName must be at least 3 chars long!!"}),
    email:z.string().email(),
    password:z.string().min(6,{message:"password must be at least 6 char long!!"})
   })
   const validatedAdmin = adminSchema.safeParse(req.body)
   if(!validatedAdmin.success){
      return res.status(401).json({errors:validatedAdmin.error.issues.map(err=>err.message)})
   }

   const hashedPassword = await bcrypt.hash(password,10)

   try {
     const existingAdmin = await Admin.findOne({email})
     if(existingAdmin){
         return res.status(401).json({errors:"Admin already exists"})
     }
     

     const newAdmin = new Admin({
         firstName,
         lastName,
         email,
         password:hashedPassword,
     })
     await newAdmin.save()
     res.status(201).json({message:"Admin created successfully",newAdmin})
   } catch (error) {
    res.status(500).json({errors:"Error occured during Signup ....Please try again!!"})
    console.log("Error in signup",error)
   }
}

export const login = async(req,res)=>{
    const {email,password}=req.body

    try {
        const admin = await Admin.findOne({email})
        if (!admin) {
      return res.status(401).json({ errors: "Invalid credentials..!!" });
    }
        const isPasswordCorrect=await bcrypt.compare(password,admin.password)

        if(!admin || !isPasswordCorrect){
            return res.status(401).json({errors:"Invalid credentials..!!"})
        }

    //jwt code

    const token = jwt.sign({
        id:admin._id,
    },config.JWT_ADMIN,{expiresIn:"1d"})

       const cookieOptions={
        expires:new Date(Date.now() + 24*60*60*1000),
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        sameSite:"Strict"
       }
    
        res.cookie("jwt",token,cookieOptions)
        res.status(201).json({message:"Login successfull",admin,token,cookieOptions})
    } catch (error) {
        res.status(500).json({errors:"Error in login please provide correct credentials!!"})
        console.log("Error in login please provide correct credentials...",error)
    }
}

export const logout = async(req,res)=>{
    try {

        res.clearCookie("jwt")
        res.status(200).json({message:"Admin logged out successfully...!!"})
    } catch (error) {
     res.status(500).json({errors:"Error in logging out!!"})
     console.log("Error while logging out",error)   
    }
}