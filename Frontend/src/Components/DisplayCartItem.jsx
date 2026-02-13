import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { useGlobalContext } from '../Proveider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import AddToCartbtn from './AddToCartbtn'
import { priceWithDiscount } from '../utils/PriceWithDiscount'
import ImageEmptyCart from "../assets/empty_cart.png"

const DisplayCartItem = ({close}) => {
    const {notDiscountTotalPrice,totalPrice,totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart )
  return (
    <section className='bg-neutral-900/70 fixed top-0 bottom-0 right-0 left-0 z-50'>
        <div className='bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto'>
            <div className='flex items-center justify-between p-4 shadow-md gap-3'>
                <h2 className='font-semibold'>Cart</h2>
                <Link to={'/'} className='lg:hidden'>
                <button className='cursor-pointer hover:text-red-500' onClick={close}><IoClose size={25}/></button>
                </Link>
                <button className='cursor-pointer hover:text-red-500 hidden lg:block' onClick={close}><IoClose size={25}/></button>
            </div>

            <div className='lg:min-h-[80vh] min-h-[75vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4'>
                {/* display items */}
                {
                    cartItem[0] ? (
                        <>
                            <div className='flex items-center px-4 py-2 bg-blue-100 text-blue-500 rounded-full justify-between'>
                                <p> Your total Savings</p>
                                <p>{DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}</p>
                            </div>
                                <div className='bg-white rounded-lg p-4 grid gap-5 overflow-auto'>
                                {
                                    cartItem[0] && (
                                        cartItem.map((item , index)=>{
                                            return (
                                                <div className='flex w-full gap-4'>
                                                    <div className='w-20 h-18 min-h-16 min-w-16 border'>
                                                        <img src={item?.productId?.image[0]}
                                                        className='object-scale-down'/>
                                                    </div>
                                                    <div className='w-full max-w-sm text-xs'>
                                                        <p className='text-xs text-ellipsis line-clamp-2'>{item?.productId?.name}</p>
                                                        <p className='text-neutral-400'>{item.productId.unit}</p>
                                                        <p className='font-semibold'>{DisplayPriceInRupees(priceWithDiscount(item?.productId?.price,item?.productId?.discount))}</p>
                                                    </div>
                                                    <div>
                                                        <AddToCartbtn data={item?.productId} />
                                                    </div>
                                                </div>
                                            )
                                        })
                                    )
                                }
                                
                            </div> 

                            <div className='bg-white p-4 border rounded'>
                                <h3 className='font-semibold'>Bill Details</h3>
                                <div className='flex gap-4 justify-between ml-1 text-sm'>
                                    <p>Items total</p>
                                    <p className='flex items-center gap-2 text-neutral-600'><span className='line-through text-neutral-400'>{DisplayPriceInRupees(notDiscountTotalPrice)}</span><span>{DisplayPriceInRupees(totalPrice)}</span></p>
                                </div>

                                <div className='flex gap-4 justify-between ml-1 text-sm'>
                                    <p>Quntity total</p>
                                    <p className='flex items-center gap-2 text-neutral-600'>{totalQty} Item</p>
                                </div>

                                <div className='flex gap-4 justify-between ml-1 text-sm'>
                                    <p>Quntity total</p>
                                    <p className='flex items-center gap-2 text-neutral-600'>Free</p>
                                </div>

                            
                            </div>
                            <div className='font-semibold flex items-center justify-between bg-white p-2 rounded'>
                                    <p>Grand Total : </p>
                                    <p>{DisplayPriceInRupees(totalPrice)}</p>
                                </div>
                        </>

                    ):(
                       <div className='flex flex-col justify-center items-center '>
                        <img src={ImageEmptyCart}
                        className='w-full h-full object-scale-down'/>
                        <Link to={"/"} onClick={close} className='bg-green-600 px-4 py-2 text-white rounded hover:bg-green-700'>Shop Now</Link>
                        
                       </div> 
                    )
                }
                   
            </div>
            {
                cartItem[0] && (

                        <div className='p-2'>
                            <div className='bg-green-700 text-neutral-100 px-4 font-bold text-base py-4 sticky bottom-4 rounded flex items-center gap-4 justify-between'>
                            <div>
                                {DisplayPriceInRupees(totalPrice)}
                            </div>

                            <button className='flex items-center hover:text-yellow-200 cursor-pointer'>
                                Proceed
                                <span><FaCaretRight size={25}/></span>

                            </button>
                            </div>
                        </div>
                )

            }
            

        </div>
    </section>
  )
}

export default DisplayCartItem