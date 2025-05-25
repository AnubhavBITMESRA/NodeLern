import express from "express"
import { buyCourses, courseDetails, createCourse, deleteCourse, getAllCourses, updateCourse } from "../controllers/course.controller.js"
import userMiddleware from "../middlewares/user.middleware.js"
import adminMiddleware from "../middlewares/admin.middleware.js"
const router = express.Router()

router.post("/create",adminMiddleware,createCourse)
router.put("/update/:courseId",adminMiddleware,updateCourse)
router.delete("/delete/:courseId",adminMiddleware,deleteCourse)
router.get("/courses",getAllCourses)
router.get("/:courseId",courseDetails)
router.post("/buy/:courseId",userMiddleware,buyCourses)
export default router