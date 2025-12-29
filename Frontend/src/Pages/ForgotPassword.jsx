import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { baseURL } from '../common/SummaryApi';
import Axios from '../utils/axios';
import summaryApi from '../common/SummaryApi';
import AxoisToastError from '../utils/AxiosToast';
import {Link, useNavigate } from 'react-router-dom';


const ForgotPassword = () => {
    const [data , setData] = useState({
        email : "",
    })
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
    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            const response = await Axios({
            ...summaryApi.forgotPassword,
            data : data
        })
            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data.success){
                toast.success(response.data.message)
                navigate('/verify-forgot-password-otp',{
                    state : data
                })
                setData({
                    email : ""
                })
                
            }
        console.log("response",response)
        
    }catch(error){
            AxoisToastError(error)
        }
       
    }

  return (
  <section className='w-full container mx-auto px-2'>
    <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
    <p className='font-semibold text-lg'>Forgot Password</p>
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
            <button className={` ${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"}   text-white py-2 rounded font-semibold my-2 tracking-wide `}>Send OTP</button>
        </form>
        <p>
            Already have account ? <Link to={'/login'} className='font-semibold text-green-700 hover:text-green-800 cursor-pointer'>login</Link>
        </p>
    </div>
  </section>
  )
}

export default ForgotPassword