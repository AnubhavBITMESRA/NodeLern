import logo from "../../public/logo.webp"
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from "axios"
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";
import {BACKEND_URL} from "../utils/utils.js"
function Home() {

  const [courses, setCourses] = useState([])
  const [isloggedIn,setIsLoggedIn] = useState(false)

  useEffect(()=>{
    const user = localStorage.getItem("user")
    if(user){
      setIsLoggedIn(true)
    }else{
      setIsLoggedIn(false)
    }
  },[])


  const handleLogout = async ()=>{
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`,{
        withCredentials:true
      })
      toast.success(response.data.message)
      localStorage.removeItem("user")
      setIsLoggedIn(false)
    } catch (error) {
      toast.error(error.response.data.errors|| "Error in logging out!!")
    }
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true
        })
        console.log(response.data.courses)
        setCourses(response.data.courses)
      } catch (error) {
        console.log("Error in fetching courses!!")
      }
    }
    fetchCourses()
  }, [])

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className='bg-gradient-to-r from-black to-blue-950'>
      <div className='min-h-screen text-white container mx-auto'>
        <header className='flex items-center justify-between p-6'>
          <div className='flex items-center space-x-4'>
            <img src={logo} alt="" className='w-10 h-10 rounded-full' />
            <h1 className='text-2xl text-pink-500 font-bold'>NodeLern </h1>
          </div>
          <div className='space-x-4'>
            {isloggedIn? (
              <button onClick={handleLogout}
              className="bg-transparent text-white py-2 px-4 border border-white rounded"
              
              >
              Logout
              </button>
            ):(<>
            <Link  to={"/login"}
            
            className="bg-transparent text-white py-2 px-4 border border-white rounded "
            >
              Login
            </Link>
            <Link
             to={"/signup"}
            className="bg-transparent text-white py-2 px-4 border border-white rounded "
            >
            
            Signup
            </Link>
            
            </>)}
          </div>
        </header>

        <section className='text-center py-20'>
          <h1 className='text-4xl font-semibold text-pink-500'>NodeLern</h1>
          <br />
          <p className='text-gray-500'>Level up your skills with industry-relevant courses built by top professionals!!</p>
          <div className='space-x-4 mt-8'>
            <Link to={'/courses'} className='bg-orange-500 text-white py-3 px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black'>Explore Courses

            </Link >
            <Link to={"https://www.youtube.com/@LearnCodingOfficial"} className='bg-white text-black py-3 px-6 rounded font-semibold hover:bg-orange-500 duration-300 hover:text-white'>Course Videos

            </Link >
          </div>
        </section>

        <section className="px-2">
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="px-3"> {/* spacing between slides */}
                <div className="relative transition-transform duration-300 transform hover:scale-105 my-4">
                  <div className="bg-gray-900 rounded-lg overflow-hidden p-4 min-h-[280px] flex flex-col items-center justify-between">
                    <img className="h-32 w-full object-contain" src={course.image?.url} alt="" />
                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-white">{course.title}</h2>
                      <button className="mt-4 bg-pink-500 text-white py-2 px-4 rounded-full hover:bg-orange-500 duration-300">
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        <hr className="border-white my-6" /> {/* visible line */}

        <footer className="py-8 text-white">
          <div className='grid grid-cols-1 md:grid-cols-3'>
            <div className="flex flex-col items-center md:items-center">
              <div className='flex items-center space-x-4'>
                <img src={logo} alt="" className='w-10 h-10 rounded-full' />
                <h1 className='text-2xl text-pink-500 font-bold'>NodeLern </h1>
              </div>

              <div className="mt-3 ml-2 md:ml-8">
                <p className="mb-2">Follow us</p>
                <div className="flex space-x-4">
                  <a href="#"><FaFacebook className="text-2xl hover:text-blue-400 duration-300" /></a>
                  <a href="#"><FaInstagram className="text-2xl hover:text-pink-500 duration-300" /></a>
                  <a href="#"><FaTwitter className="text-2xl hover:text-blue-500 duration-300" /></a>
                </div>
              </div>
            </div>

            <div className="items-center flex flex-col">
              <h3 className="text-lg font-semibold mb-4">connects</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">youtube-learn coding</li>
                <li className="hover:text-white cursor-pointer duration-300">telegram-learn coding</li>
                <li className="hover:text-white cursor-pointer duration-300">Github-learn coding</li>
              </ul>
            </div>

            <div className="items-center flex flex-col">
              <h3 className="text-lg font-semibold mb-4">copyrights &#169; 2025</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">Terms & Conditions</li>
                <li className="hover:text-white cursor-pointer duration-300">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer duration-300">Refund & Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default Home
