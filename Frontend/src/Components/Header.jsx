import React from 'react'
import logo from '../assets/logo.png'
import Search from '../Components/search'
import { Link, useLocation } from 'react-router-dom'
import { FaRegCircleUser } from "react-icons/fa6";
import useMobile from '../Hooks/useMobile';

const Header = () => {
    const [isMobile] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    console.log("isMobile",isMobile)
  return (
    <header className='h-24 lg:h-20 lg:shadow-md sticky top-0 flex flex-col justify-center gap-1'>
        {
            !(isSearchPage && isMobile) && (
                <div className='container mx-auto flex items-center px-2 justify-between'>
  {/* logo */}
    <div className='h-full'>
        <Link to={"/"} className='h-full flex justify-center items-center'>
            <img src={logo} alt="logo" width={170} height={60} className='hidden lg:block' />
                {/*Mobile view */}
            <img src={logo} alt="logo" width={120} height={60} className='lg:hidden '  />
        </Link>
    </div>
        {/*search */}
        <div className='hidden lg:block'>
            <Search/>
        </div>

        {/**login and my cart */}
        <div className=''>
            <button className='text-neutral-600 lg:hidden'>
                <FaRegCircleUser size={26} />
            </button>
            <div className='hidden lg:block'>
                login and my cart
            </div>
        </div>
        </div>
            )
        }
        
        <div className='container mx-auto px-2 lg:hidden'>
            <Search/>
        </div>
      
    </header>
  )
}

export default Header