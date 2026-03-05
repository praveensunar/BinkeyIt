import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { handleAddItemCart } from '../Store/cartProduct'

import { useGlobalContext } from '../Proveider/GlobalProvider'


const Success = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { deleteAllCartItem, fetchOrder } = useGlobalContext()

  useEffect(() => {
    deleteAllCartItem()
    dispatch(handleAddItemCart([]))
    fetchOrder()
  }, [])
  return (
    <section className="h-[68vh] flex items-center justify-center px-4">

      <div className='m-2 w-full max-w-md bg-green-300 p-4 py-5 rounded mx-auto flex flex-col items-center justify-center gap-5'>
        <p className='text-green-800 font-bold text-lg text-center'>{Boolean(location?.state?.text) ? location?.state?.text : "Payment"} Successfully</p>
        <Link to="/" className='border border-green-900 px-4 py-1 cursor-pointer hover:bg-green-900 hover:text-white text-green-900 transition-all font-semibold rounded'>Go to Home</Link>
      </div>
    </section>
  )
}

export default Success