import React from 'react'
import { Link } from 'react-router-dom'

const Cancel = () => {
  return (
    <section className="h-[68vh] flex items-center justify-center px-4">
    <div  className='m-2 w-full max-w-md bg-red-300 p-4 py-5 rounded mx-auto flex flex-col items-center justify-center gap-5'>
        <p className='text-red-800 font-bold text-lg text-center'>Order Cancel</p>
        <Link to="/" className='border border-red-900 px-4 py-1 cursor-pointer hover:bg-red-900 hover:text-white text-red-900 transition-all font-semibold rounded'>Go to Home</Link>
    </div>
    </section>
  )
}

export default Cancel