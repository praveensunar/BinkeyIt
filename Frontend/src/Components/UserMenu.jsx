import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Divider from './Divider'

const UserMenu = () => {
    const user = useSelector((state)=> state.user)
  return (
    <div>
        <div className='font-semibold'>My Account</div>
        <div className='text-sm capitalize'>{user.name || user.mobile}</div>
        
        <Divider/>

        <div className='text-sm grid gap-1'>
            <Link to={""} className='px-2 hover:text-amber-300'>My Orders</Link>
            <Link to={""} className='px-2 hover:text-amber-300'>Save Address</Link>
        </div>
        <button className='text-left px-2 hover:text-red-300'>Log Out</button>
    </div>
  )
}

export default UserMenu