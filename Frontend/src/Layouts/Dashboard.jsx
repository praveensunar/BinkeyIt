import React from 'react'
import UserMenu from '../Components/UserMenu'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <section className='bg-white'>
        <div className='container mx-auto p-3 lg:grid grid-cols-[250px_1fr]'>
            {/* left for menu  */}
            <div className='py-4 sticky top-24 overflow-auto hidden lg:block'>
                <UserMenu/>
            </div>
            {/* right fot content */}
            <div className='bg-white p-4 '>
                <Outlet/>
            </div>
        </div>
    </section>
  )
}

export default Dashboard