import React, { useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import Axios from '../utils/axios'
import summaryApi from '../common/SummaryApi'
import AxoisToastError from '../utils/AxiosToast'
import {updateAvatar} from '../Store/userSlice'
import { IoClose } from "react-icons/io5";

const UserProfileAvatar = ({close}) => {
    const user = useSelector(state =>state.user)
    const dispatch = useDispatch()
    const [loading ,setLoading] = useState(false)
    const handleSubmit = (e)=>{
        e.preventDefault()
    }
    const handleUploadAvatar = async(e)=>{
        const file = e.target.files[0]

        if(!file){
            return
        }
        const formData = new FormData()
        formData.append('avatar',file)
        
        setLoading(true)
        try{
            const response = await Axios({
            ...summaryApi.uploadAvatar,
            data : formData
        })
        const {data : responseData} = response
        dispatch(updateAvatar(responseData.data.avatar))       
        console.log(response)
        }catch(error){
                AxoisToastError(error)
        }finally{
        setLoading(false)
        }
    }
  return (
    <section className='fixed top-0 bottom-0 left-0 right-0 bg-neutral-900/60 p-4 flex items-center justify-center'>
        <div className='bg-white max-w-sm w-full rounded  p-4 flex flex-col justify-between items-center'>
            <button onClick={close} className='text-neutral-800 w-fit block ml-auto '>
                <IoClose size={25}/>
            </button>
            <div className='w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
                        {
                            user.avatar ? (
                                <img src={user.avatar} alt={user.name} className='w-full h-full' />
                            ):(
            
                                <FaRegUserCircle size={65} />
                            )
                        }
                    
                    </div>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor='uploadProfile'>
                            <div className=' cursor-pointer border border-[#ffc929] hover:bg-[#ffbf00] px-4 py-1 rounded mt-3 text-sm'>
                            {
                                loading ? "Loading..." : "Upload"
                            }
                            </div>
                        </label>
                        <input onChange={handleUploadAvatar} type="file"  id='uploadProfile' className='hidden'/>
                    </form>
                    
        </div>
    </section>
  )
}

export default UserProfileAvatar