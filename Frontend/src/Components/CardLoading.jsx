import React from 'react'

const CardLoading = () => {
  return (
    <div className='border grid gap-1 lg:gap-3 rounded min-w-36 lg:min-w-52 py-2 lg:p-4 cursor-pointer bg-white animate-pulse'>
        <div className='rounded min-h-24 bg-blue-100'>

        </div>
        <div className='bg-blue-100 p-2 lg:p-3 rounded w-20'>
        </div>
        <div className='bg-blue-100 p-2 lg:p-3 rounded'>
        </div>
        <div className='bg-blue-100 p-2 lg:p-3 rounded w-14'>
        </div>

        <div className='flex items-center justify-between gap-3'>
            <div className='bg-blue-100 p-2 lg:p-3 rounded'>
            </div>
            <div className='bg-blue-100 p-2 lg:p-3 rounded'>
            </div>
        </div>
    </div>
  )
}

export default CardLoading