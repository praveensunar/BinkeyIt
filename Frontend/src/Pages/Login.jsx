import React, { useState } from 'react'
import { FaRegEyeSlash ,FaRegEye } from "react-icons/fa6"
import toast, { Toaster } from 'react-hot-toast';
import { baseURL } from '../common/SummaryApi';
import Axios from '../utils/axios';
import summaryApi from '../common/SummaryApi';
import AxoisToastError from '../utils/AxiosToast';
import {Link, useNavigate } from 'react-router-dom';


const Login = () => {
    const [data , setData] = useState({
        email : "",
        password : "",
    })
    const[showPassword , setShowPassword ] = useState(false)
    const navigate = useNavigate()
   
    const handleChange = (e)=>{
        const { name ,value } = e.target

        setData((preve)=>{
            return {
                ...preve,
                [name] : value
            }
        })
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            const response = await Axios({
            ...summaryApi.login,
            data : data
        })
            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data.success){
                toast.success(response.data.message)
                localStorage.setItem('accessToken',response.data.data.accessToken)
                localStorage.setItem('refreshToken',response.data.data.resfreshToken)
                setData({
                    email : "",
                    password : "",
                })
                navigate('/')
            }
        console.log("response",response)
        
    }catch(error){
            AxoisToastError(error)
        }
       
    }
const valideValue = Object.values(data).every(el => el)
  return (
  <section className='w-full container mx-auto px-2'>
    <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>

        <form className='grid gap-2 py-2'onSubmit={handleSubmit}>
            <div className='grid gap-1'>
                <label htmlFor="email">Email :</label>
                <input 
                id='email'
                type="email"
                name='email' 
                placeholder='Enter your Email' 
                className='bg-blue-50 p-2 border rounded outline-none focus:border-[var(--color-primary-200)]'
                value={data.email} onChange={handleChange}
                />
            </div>
            <div className='grid gap-1'>
                <label htmlFor="password">Password :</label>
                <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-[var(--color-primary-200)]'>
                    <input 
                id='password'
                type = {showPassword ? "text" : "password"}
                name='password'
                placeholder='Enter your Password'  
                className='w-full outline-none bg-white mr-1'
                value={data.password} onChange={handleChange}
                />
                <div onClick={()=>setShowPassword(preve => !preve)} className='cursor-pointer'>
                    {
                        showPassword ?(
                            <FaRegEye />
                        ):(
                            <FaRegEyeSlash />
                        )
                    }
                </div>
                </div>
                <Link to={"/forgot-password"} className='block ml-auto hover:text-[var(--color-primary-200)]'>Forgot password ?</Link>
            </div>

            <button className={` ${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"}   text-white py-2 rounded font-semibold my-2 tracking-wide `}>Login</button>
        </form>
        <p>
            Don't have account? <Link to={'/register'} className='font-semibold text-green-700 hover:text-green-800 cursor-pointer'>Register</Link>
        </p>
    </div>
  </section>
  )
}

export default Login