import React, { useState } from 'react'
import { FaRegEyeSlash ,FaRegEye } from "react-icons/fa6"
import toast, { Toaster } from 'react-hot-toast';
import { baseURL } from '../common/SummaryApi';
import Axios from '../utils/axios';
import summaryApi from '../common/SummaryApi';
import AxoisToastError from '../utils/AxiosToast';
import {Link, useNavigate } from 'react-router-dom';


const Register = () => {
    const [data , setData] = useState({
        name : "",
        email : "",
        password : "",
        confirmPassword : ""
    })
    const[showPassword , setShowPassword ] = useState(false)
    const[showconfirmPassword , setShowConfirmPassword ] = useState(false)
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

        if(data.password !== data.confirmPassword){
        toast.error("password and confirm password must be same")
        return 
        }

        try{
            const response = await Axios({
            ...summaryApi.register,
            data : data
        })
            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data.success){
                toast.success(response.data.message)
                setData({
                    name : "",
                    email : "",
                    password : "",
                    confirmPassword : ""
                })
                navigate('/login')
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
        <p>Welcome to Binkeyit</p>
        <form className='grid gap-2 mt-6'onSubmit={handleSubmit}>
            <div className='grid gap-1'>
                <label htmlFor="name">Name :</label>
                <input 
                id='name'
                type="text"
                autoFocus
                name='name'
                placeholder='Enter your Name' 
                className='bg-blue-50 p-2 border rounded outline-none focus:border-[var(--color-primary-200)]'
                value={data.name} onChange={handleChange}
                />
            </div>
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
            </div>

             <div className='grid gap-1'>
                <label htmlFor="confirmPassword">Confirm Password :</label>
                <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-[var(--color-primary-200)]'>
                <input 
                id='confirmPassword'
                type = {showconfirmPassword ? "text" : "password"}
                name='confirmPassword'
                placeholder='Enter your Confirm Password' 
                className='w-full outline-none bg-white mr-1'
                value={data.confirmPassword} onChange={handleChange}
                />
                <div onClick={()=>setShowConfirmPassword(preve => !preve)} className='cursor-pointer'>
                    {
                        showconfirmPassword ?(
                            <FaRegEye />
                        ):(
                            <FaRegEyeSlash />
                        )
                    }
                </div>
                </div>
            </div>
            <button className={` ${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"}   text-white py-2 rounded font-semibold my-2 tracking-wide `}>Register</button>
        </form>
        <p>
            Already have account ? <Link to={'/login'} className='font-semibold text-green-700 hover:text-green-800 cursor-pointer'>Login</Link>
        </p>
    </div>
  </section>
  )
}

export default Register