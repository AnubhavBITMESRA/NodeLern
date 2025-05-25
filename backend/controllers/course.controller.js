import { Course } from "../models/course.model.js"
import { v2 as cloudinary } from 'cloudinary'
import { Purchase } from "../models/purchase.model.js"
export const createCourse=async (req,res)=>{
    const adminId=req.adminId
    const {title,description,price}=req.body
    console.log(title,description,price)

    try {
        if(!title || !description || !price)
        {
            return res.status(401).json("All fields are required!")
        }

        const {image} = req.files
        if(!req.files || Object.keys(req.files).length===0){
            return res.staus(401).json({errors:"No file uplaoded"})
        }
        const allowedFormat = ["image/png","image/jpeg"]
        if(!allowedFormat.includes(image.mimetype)){
           return res.status(400).json({errors:"Invalid file format , only JPG and PNG are allowed"})
        }

        //cloudinary code
         const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
         if(!cloud_response || cloud_response.error){
            return res.status(400).json({errors:"Error uploading file to cloudinary"})
         }

          

        const courseData ={
            title,
            description,
            price,
            image:{
                public_id:cloud_response.public_id,
                url:cloud_response.url
            },
            creatorId:adminId
        }
      const response = await Course.create(courseData)
      res.status(201).json({message:"Course created successfully",response})
    } catch (error) {
        console.log(error)
        res.status(501).json({error:"Error creating course"})
    }
}

export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price } = req.body;

  try {
    // Step 1: Find the course
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res.status(404).json({ errors: "Sorry, course not found..!!" });
    }

    // Step 2: Check if current admin is the creator
    if (!courseSearch.creatorId || courseSearch.creatorId.toString() !== adminId.toString()) {
  return res.status(403).json({ errors: "You cannot update a course created by another admin!" });
}


    // Step 3: Prepare image
    let imageData = courseSearch.image; // keep existing image
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const allowedFormat = ["image/png", "image/jpeg"];
      if (!allowedFormat.includes(imageFile.mimetype)) {
        return res.status(400).json({ errors: "Invalid file format, only JPG and PNG allowed" });
      }

      // Upload to Cloudinary
      const cloud_response = await cloudinary.uploader.upload(imageFile.tempFilePath);
      if (!cloud_response || cloud_response.error) {
        return res.status(400).json({ errors: "Error uploading file to Cloudinary" });
      }

      imageData = {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      };
    }

    // Step 4: Update the course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        title,
        description,
        price,
        image: imageData,
      },
      { new: true }
    );

    res.status(200).json({ message: "Course updated successfully!!", course: updatedCourse });
  } catch (error) {
    console.log("Error in course updation", error);
    res.status(500).json({ errors: "Internal server error!" });
  }
};


export const deleteCourse = async (req, res) => {
  const { courseId } = req.params;
  const adminId = req.adminId;

  console.log("CourseId from params:", courseId);
  console.log("AdminId from middleware:", adminId);

  try {
    // First, find the course by ID to check its existence and creator
    const course = await Course.findById(courseId);
    console.log("Course found:", course);

    if (!course) {
      return res.status(404).json({ errors: "Sorry can't delete , course created by other admin!" });
    }

    console.log("Course creatorId:", course.creatorId?.toString());
    console.log("AdminId:", adminId);

    // Changed only this line for safe check
    if (!course.creatorId || course.creatorId.toString() !== adminId) {
      return res.status(403).json({ error: "You are not authorized to delete this course" });
    }

    // If authorized, delete the course
    await Course.findByIdAndDelete(courseId);

    res.status(200).json({ message: "Course deleted successfully!!" });
  } catch (error) {
    console.log("Error in deleting course:", error);
    res.status(500).json({ errors: "Internal server error" });
  }
};



export const getAllCourses = async(req,res)=>{
    try {
        const courses= await Course.find({})
        res.status(201).json({courses})
    } catch (error) {
        res.status(500).json({errors:"Could not get all the requested courses"})
        console.log("Error in getting courses",error)
    }
}

export const courseDetails = async(req,res)=>{
    const {courseId} = req.params
    try {
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(401).json({error:"Sorry no such course found!!"})
        }
        res.status(201).json({course})
    } catch (error) {
        res.status(500).json({errors:"Failed to fetch course details"})
        console.log("Error in getting course details",error)
    }
}

import Stripe from "stripe"
import  config  from "../config.js"
const stripe = new Stripe(config.STRIPE_SECRET_KEY)
console.log(config.STRIPE_SECRET_KEY)
export const buyCourses = async(req,res)=>{
    const {userId} = req
    const {courseId}=req.params
    try {
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(400).json({errors:"Sorry couldn't find the course you're looking for"})
        }
        const existingPurchase = await Purchase.findOne({userId,courseId})
        if(existingPurchase){
            return res.status(400).json({errors:"Course already bought!!!!!"})
        }

        //Stripe code
        const amount=course.price
          const paymentIntent = await stripe.paymentIntents.create({
             amount: amount,
             currency: "usd",
    
             payment_method_types:["card"],
              });
        
        res.status(201).json({message:"Course purchased successfully!!!..",course,course,
             clientSecret: paymentIntent.client_secret,})
    } catch (error) {
        res.status(500).json({errors:"Sorry error caught while buying course...Please try again!!"})
        console.log("Sorry error caught while buying course...Please try again!!",error)
    }
}