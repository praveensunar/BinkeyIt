import React from 'react'
import { IoClose } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../Proveider/GlobalProvider'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { FaCaretRight } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import AddToCartbtn from './AddToCartbtn'
import { priceWithDiscount } from '../utils/PriceWithDiscount'
import ImageEmptyCart from "../assets/empty_cart.png"
import toast from 'react-hot-toast'

const DisplayCartItem = ({ close }) => {

    const { notDiscountTotalPrice, totalPrice, totalQty } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()

    const redirectTochechout = () => {
        if (user?._id) {
            navigate("/checkout")
            if (close) close()
            return
        }
        toast("Please login")
    }

    return (
        <section className='bg-neutral-900/70 fixed inset-0 z-50'>

            {/* Cart Drawer */}
            <div className='bg-white w-full max-w-sm h-full ml-auto flex flex-col'>

                {/* Header */}
                <div className='flex items-center justify-between p-4 shadow-md'>
                    <h2 className='font-semibold'>Cart</h2>

                    <button
                        className='cursor-pointer hover:text-red-500'
                        onClick={close}
                    >
                        <IoClose size={25} />
                    </button>
                </div>

                {/* Scrollable Cart Content */}
                <div className='flex-1 overflow-y-auto bg-blue-50 p-3 flex flex-col gap-4'>

                    {
                        cartItem[0] ? (
                            <>

                                {/* Savings */}
                                <div className='flex items-center px-4 py-2 bg-blue-100 text-blue-500 rounded-full justify-between'>
                                    <p>Your total Savings</p>
                                    <p>
                                        {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}
                                    </p>
                                </div>

                                {/* Cart Items */}
                                <div className='bg-white rounded-lg p-4 grid gap-5'>

                                    {
                                        cartItem.map((item) => (
                                            <div
                                                key={item._id + "cartItemDisplay"}
                                                className='flex w-full gap-3 items-center'
                                            >

                                                {/* Product Image */}
                                                <div className='w-16 h-16 min-w-16 border rounded'>
                                                    <img
                                                        src={item?.productId?.image[0]}
                                                        className='w-full h-full object-contain'
                                                    />
                                                </div>

                                                {/* Product Info */}
                                                <div className='flex-1 text-xs'>
                                                    <p className='line-clamp-2'>
                                                        {item?.productId?.name}
                                                    </p>

                                                    <p className='text-neutral-400'>
                                                        {item?.productId?.unit}
                                                    </p>

                                                    <p className='font-semibold'>
                                                        {DisplayPriceInRupees(
                                                            priceWithDiscount(
                                                                item?.productId?.price,
                                                                item?.productId?.discount
                                                            )
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Quantity Button */}
                                                <AddToCartbtn data={item?.productId} />

                                            </div>
                                        ))
                                    }

                                </div>

                                {/* Bill Details */}
                                <div className='bg-white p-4 border rounded space-y-2 text-sm'>

                                    <h3 className='font-semibold'>Bill Details</h3>

                                    <div className='flex justify-between'>
                                        <p>Items total</p>

                                        <p className='flex gap-2'>
                                            <span className='line-through text-neutral-400'>
                                                {DisplayPriceInRupees(notDiscountTotalPrice)}
                                            </span>

                                            <span>
                                                {DisplayPriceInRupees(totalPrice)}
                                            </span>
                                        </p>
                                    </div>

                                    <div className='flex justify-between'>
                                        <p>Quantity total</p>
                                        <p>{totalQty} Items</p>
                                    </div>

                                    <div className='flex justify-between'>
                                        <p>Delivery Fee</p>
                                        <p className='text-green-600 font-medium'>FREE</p>
                                    </div>

                                </div>

                                {/* Grand Total */}
                                <div className='font-semibold flex items-center justify-between bg-white p-3 rounded'>
                                    <p>Grand Total</p>
                                    <p>{DisplayPriceInRupees(totalPrice)}</p>
                                </div>

                            </>
                        ) : (

                            /* Empty Cart */
                            <div className='flex flex-col justify-center items-center h-full gap-4'>

                                <img
                                    src={ImageEmptyCart}
                                    className='w-40 object-contain'
                                />

                                <Link
                                    to={"/"}
                                    onClick={close}
                                    className='bg-green-600 px-4 py-2 text-white rounded hover:bg-green-700'
                                >
                                    Shop Now
                                </Link>

                            </div>

                        )
                    }

                </div>

                {/* Sticky Checkout Section */}
                {
                    cartItem[0] && (

                        <div className='p-3 border-t bg-white sticky bottom-0'>

                            <div className='bg-green-700 text-white px-4 font-bold text-base py-4 rounded flex items-center justify-between'>

                                <div>
                                    {DisplayPriceInRupees(totalPrice)}
                                </div>

                                <button
                                    onClick={redirectTochechout}
                                    className='flex items-center gap-1 hover:text-yellow-200'
                                >
                                    Proceed
                                    <FaCaretRight size={20} />
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