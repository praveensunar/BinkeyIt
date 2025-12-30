import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRegUserCircle } from "react-icons/fa";
import UserProfileAvatar from '../Components/UserProfileAvatar';
import Axios from '../utils/axios';
import summaryApi from '../common/SummaryApi';
import AxoisToastError from '../utils/AxiosToast';
import toast from 'react-hot-toast';
import { setUserDetails } from '../Store/userSlice';
import fetchUserDetails from '../utils/fetchUserDetails';

const Profile = () => {
    const user = useSelector(state =>state.user)
    const [openProfileAvatarEdit , setProfileAvatarEdit] = useState(false)
    const [userData ,setUserData] = useState({
        name : user.name,
        email : user.email,
        mobile : user.mobile,
    })
    const [loading ,setLoading] = useState(false)
    const dispatch =useDispatch()
    useEffect(()=>{
            setUserData({
             name : user.name || "",
            email : user.email || "",
            mobile : user.mobile || "",
            })
        },[user])
    const handleOnChange = (e)=>{
        const {name,value} = e.target
        setUserData((preve)=>{
            return{
                  ...preve,
                  [name] : value
            }
        })
    }
       const handleSubmit = async(e)=>{
        e.preventDefault()

        try{
            setLoading(true)
           const response = await Axios({
            ...summaryApi.updateUserDetails,
            data : userData
           })
           const {data : responseData } =response

           if(responseData.success){
            toast.success(responseData.message)
            const userData = await fetchUserDetails()
            dispatch(setUserDetails(userData.data))
           }
        }catch(error){

            AxoisToastError(error)

        }finally{
            setLoading(false)
        }
       }
  return (
    <div>

        {/* profile upload and display image */}
        <div className='w-20 h-20 flex items-center justify-center rounded-full overflow-hidden drop-shadow-sm'>
            {
                user.avatar ? (
                    <img src={user.avatar} alt={user.name} className='w-full h-full' />
                ):(

                    <FaRegUserCircle size={65} />
                )
            }
        
        </div>
        <button onClick={()=>setProfileAvatarEdit(true)} className='text-sm min-w-20 border border-[#ffc929] hover:bg-[#ffbf00] px-3 py-1 rounded-full mt-3'>Edit</button>
        {
            openProfileAvatarEdit && (
                <UserProfileAvatar close={()=>setProfileAvatarEdit(false)}/>
            )
        }
<form className='my-4 grid gap-4' onSubmit={handleSubmit}>
    <div className='grid'>
        <label htmlFor="name">Name</label>
        <input 
        type="text"
        id='name'
        onChange={handleOnChange}
        name='name'
        required
        placeholder='Enter your name'
        className='p-1 bg-blue-50 outline-none border focus-within:border-[#ffbf00] rounded capitalize'
        value={userData.name} />
    </div>
    <div className='grid'>
        <label htmlFor="email">Email</label>
        <input 
        type="text"
         required
        onChange={handleOnChange}
        name='email'
        id='email'
        placeholder='Enter your email'
        className='p-1 bg-blue-50 outline-none border focus-within:border-[#ffbf00] rounded'
        value={userData.email} />
    </div>
    <div className='grid'>
        <label htmlFor="mobile">Mobile</label>
        <input 
        type="text"
        onChange={handleOnChange}
        id='mobile'
         required
        name='mobile'
        placeholder='Enter your mobile no'
        className='p-1 bg-blue-50 outline-none border focus-within:border-[#ffbf00] rounded'
        value={userData.mobile} />
    </div>
    <button className='border px-p4 py-2 font-semibold hover:bg-[#ffbf00] hover:text-neutral-900 border-[#ffbf00] text-[#ffbf00] rounded'>{
        loading ? " Loading..." : "Submit"
        }</button>
</form>

            
    </div>
  )
}

export default Profile