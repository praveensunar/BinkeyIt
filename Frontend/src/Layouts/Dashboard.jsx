import React from 'react'
import UserMenu from '../Components/UserMenu'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <section className='bg-white'>
        <div className='container mx-auto p-3 lg:grid grid-cols-[250px_1fr]'>
            {/* left for menu  */}
            <div className='py-4 sticky top-24 max-h-[calc(100vh-96px)] overflow-auto hidden lg:block border-r'>
                <UserMenu/>
            </div>
            {/* right fot content */}
            <div className='bg-white min-h-[75vh]'>
                <Outlet/>
            </div>
        </div>
    </section>
  )
}

export default Dashboard