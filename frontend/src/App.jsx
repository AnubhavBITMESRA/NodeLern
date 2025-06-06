import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from "react-hot-toast"
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Courses from './components/Courses'
import Buy from './components/Buy'
import Purchases from './components/Purchases'
import AdminSignup from './admin/AdminSignup'
import AdminLogin from './admin/AdminLogin'
import Dashboard from './admin/Dashboard'
import CourseCreate from './admin/CourseCreate'
import UpdateCourse from './admin/UpdateCourse'
import OurCourses from './admin/OurCourses'

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAdmin = localStorage.getItem("admin");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  // ✅ Minimal fix without removing anything
  if (user === null && localStorage.getItem("user")) {
    setUser(JSON.parse(localStorage.getItem("user")));
  }

  return (
    <div>
      <Routes>
        {/* User routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/buy/:courseId' element={<Buy />} />
        <Route path='/purchases' element={user ? <Purchases /> : <Navigate to="/login" />} />

        {/* Admin routes */}
        <Route path='/admin/signup' element={<AdminSignup />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={admin ? <Dashboard /> : <Navigate to="/admin/login" />} />
        <Route path='/admin/create-course' element={<CourseCreate />} />
        <Route path='/admin/update-course/:id' element={<UpdateCourse />} />
        <Route path='/admin/our-courses' element={<OurCourses />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
