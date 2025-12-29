import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaRegEyeSlash ,FaRegEye } from "react-icons/fa6"
import toast, { Toaster } from 'react-hot-toast';
import summaryApi, { baseURL } from '../common/SummaryApi';
import Axios from '../utils/axios';
import AxoisToastError from '../utils/AxiosToast';

const ResetPasswod = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [data ,setData] = useState({
        email : "",
        newPassword : "",
        confirmPassword : ""
  })
    const[showPassword , setShowPassword ] = useState(false)
    const[showConfirmPassword,setShowConfirmPassword] = useState(false)
  const valideValue = Object.values(data).every(el => el)

  useEffect(()=>{
    if(!(location?.state?.data?.success)){
        navigate("/")
    }
    if(location?.state?.email){
      setData((preve)=>{
        return{
          ...preve,
          email : location?.state?.email
        }
      })
    }
  },[])
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


        if(data.newPassword !== data.confirmPassword){
          toast.error("New password and Confirm password Must be same.")

          return
        }
        try{
            const response = await Axios({
            ...summaryApi.resetPassword,
            data : data
        })
            if(response.data.error){
                toast.error(response.data.message)
            }
            if(response.data.success){
                toast.success(response.data.message)
                navigate('/login')
                setData({
                    email : "",
                    newPassword : "",
                    confirmPassword : ""
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
    <p className='font-semibold text-lg'>Enter your Password</p>
        <form className='grid gap-2 py-2'onSubmit={handleSubmit}>
            <div className='grid gap-1'>
                <label htmlFor="newPassword">New Password :</label>
                            <div className='bg-blue-50 p-2 border rounded flex items-center focus-within:border-[var(--color-primary-200)]'>
                                    <input 
                                      id='newPassword'
                                      type = {showPassword ? "text" : "password"}
                                      name='newPassword'
                                      placeholder='Enter your New Password'  
                                      className='w-full outline-none bg-white mr-1'
                                      value={data.newPassword} onChange={handleChange}
                                    />
                                  <div onClick={()=>setShowPassword(preve => !preve)} className='cursor-pointer'>
                                    {
                                        showPassword ? (
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
                                      type = {showConfirmPassword ? "text" : "password"}
                                      name='confirmPassword'
                                      placeholder='Enter your Confirm Password'  
                                      className='w-full outline-none bg-white mr-1'
                                      value={data.confirmPassword} onChange={handleChange}
                                    />
                                  <div onClick={()=>setShowConfirmPassword(preve => !preve)} className='cursor-pointer'>
                                    {
                                        showConfirmPassword ? (
                                            <FaRegEye />
                                        ):(
                                            <FaRegEyeSlash />
                                        )
                                    }
                                  </div>
                           </div>
            </div> 
            <button className={` ${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500"}   text-white py-2 rounded font-semibold my-2 tracking-wide `}>Change Password</button>
        </form>
        <p>
            Already have account ? <Link to={'/login'} className='font-semibold text-green-700 hover:text-green-800 cursor-pointer'>login</Link>
        </p>
    </div>
  </section>
  )
}

export default ResetPasswod
