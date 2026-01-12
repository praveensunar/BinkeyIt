import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Divider from './Divider'
import Axios from '../utils/axios'
import summaryApi from '../common/SummaryApi'
import { logout } from '../Store/userSlice'
import toast, { Toaster } from 'react-hot-toast';
import AxoisToastError from '../utils/AxiosToast'
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'
const UserMenu = ({close}) => {
    const user = useSelector((state)=> state.user)
    const dispatch =useDispatch()
    const navigate = useNavigate()

    const handleLogout = async()=>{
        try{
          const response = await Axios({
            ...summaryApi.logout
          })
          if(response.data.success){
           if(close) {
            close()
          }
              dispatch(logout())
              localStorage.clear()
              toast.success(response.data.message)
              navigate("/")
          }
        }catch(error){
         AxoisToastError(error)
        }
    }

    const  handleClose = ()=>{
      if(close){
        close()
      }
    }
  return (
    <div>
        <div className='font-semibold'>My Account</div>
        <div className='text-sm capitalize flex gap-2 items-center'>
          <span className='max-w-52 text-ellipsis line-clamp-1'>{user.name || user.mobile}<span className='ml-2 font-semibold  text-red-500'>{(user.role === "ADMIN" ? "[Admin]" : "")}</span></span>
        <Link onClick={handleClose}  to={"/dashboard/profile"} className='hover:text-yellow-300'>
        <HiOutlineExternalLink size={15}/>
        </Link>
        </div>
        <Divider/>

        <div className='text-sm grid gap-1'>
          {
            isAdmin(user.role) &&(
          <Link onClick={handleClose} to={"/dashboard/category"} className='px-2 hover:bg-orange-300 py-1'>Category</Link>
            )
          }

          {
            isAdmin(user.role) &&(
              <Link onClick={handleClose} to={"/dashboard/subcategory"} className='px-2 hover:bg-orange-300 py-1'>Sub Category</Link>
            )
          }

          {
            isAdmin(user.role) &&(
              <Link onClick={handleClose} to={"/dashboard/product"} className='px-2 hover:bg-orange-300 py-1'>Product Admin</Link>  
            )
          }

          {
            isAdmin(user.role) &&(
              <Link onClick={handleClose} to={"/dashboard/upload-product"} className='px-2 hover:bg-orange-300 py-1'>Upload Product</Link>
            )
          }
            <Link onClick={handleClose} to={"/dashboard/myorders"} className='px-2 hover:bg-orange-300 py-1'>My Orders</Link>
            <Link onClick={handleClose} to={"/dashboard/address"} className='px-2 hover:bg-orange-300 py-1'>Save Address</Link>
        </div>
        <button onClick={handleLogout} className='text-left px-2 hover:bg-orange-300 py-1 w-full'>Log Out</button>
    </div>
  )
}

export default UserMenu