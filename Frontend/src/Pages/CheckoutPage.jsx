import React, { useState } from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { useGlobalContext } from '../Proveider/GlobalProvider'
import AddAddress from '../Components/AddAddress'
import { useSelector } from 'react-redux'
import AxiosToastError from '../utils/AxiosToast'
import Axios from '../utils/axios'
import summaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'


const CheckoutPage = () => {
    const { notDiscountTotalPrice, totalPrice, totalQty, fetchCartItem, fetchOrder } = useGlobalContext()
    const [openAddress, setOpenAddress] = useState(false)
    const addressList = useSelector(state => state.addresses.addressList)
    const [selectAddress, setSelectAddress] = useState(0)
    const cartItemList = useSelector(state => state.cartItem.cart)
    const navigate = useNavigate()



    const handleCashOnDelivery = async () => {

        try {
            const response = await Axios({
                ...summaryApi.cashOnDelivery,
                data: {
                    list_items: cartItemList,
                    totalQty: totalQty,
                    addressId: addressList[selectAddress]?._id,
                    totalAmt: totalPrice,
                    subTotalAmt: totalPrice
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
                if (fetchOrder) {
                    fetchOrder()
                }
                navigate('/success', {
                    state: {
                        text: "Order"
                    }
                })
            }
        } catch (error) {
            AxiosToastError(error)
        }
    }

    const handleOnlinePayment = async () => {
        try {
            toast.loading("Loading...")
            const response = await Axios({
                ...summaryApi.payment_url,
                data: {
                    list_items: cartItemList,
                    totalQty: totalQty,
                    addressId: addressList[selectAddress]?._id,
                    totalAmt: totalPrice,
                    subTotalAmt: totalPrice
                }
            })

            const { data: responseData } = response

            if (responseData.url) {
                window.location.href = responseData.url
            }
            if (fetchOrder) {
                fetchOrder()
            }

        } catch (error) {
            AxiosToastError(error)
        }
    }
    return (
        <section className='bg-blue-50 p-4'>
            <div className='container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between'>

                <div className='w-full'>
                    {/* address */}
                    <h3 className='font-semibold text-lg'>Choose your Address</h3>

                    <div className='bg-white p-2 grid gap-4'>
                        {
                            addressList.map((address, index) => {
                                return (
                                    <label htmlFor={"address" + index} className={!address.status && "hidden"}>
                                        <div className='border rounded p-3 text-sm lg:text-md flex gap-3 hover:bg-blue-50'>
                                            <div>
                                                <input id={"address" + index} type="radio" value={index} name='address' onChange={(e) => setSelectAddress(e.target.value)} />
                                            </div>
                                            <div>
                                                <p>{address.address_line}</p>
                                                <p>{address.city}</p>
                                                <p>{address.state}</p>
                                                <p>{address.country} - {address.pincode}</p>
                                                <p>{address.mobile}</p>
                                            </div>
                                        </div>
                                    </label>
                                )
                            })
                        }
                        <div onClick={() => setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
                            Add Address
                        </div>
                    </div>


                </div>

                <div className='w-full max-w-md bg-white py-4 px-2  '>
                    {/* summary */}
                    <h3 className='font-semibold text-lg'>Summary</h3>
                    <div className='bg-white p-4'>
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
                        <div className='font-semibold flex items-center justify-between bg-white p-2 rounded'>
                            <p>Grand Total : </p>
                            <p>{DisplayPriceInRupees(totalPrice)}</p>
                        </div>


                    </div>

                    <div className='w-full flex flex-col gap-4'>
                        <button onClick={handleOnlinePayment} className='py-2 px-4 bg-green-500 text-white hover:bg-green-600 rounded cursor-pointer font-semibold'>Online Payment</button>
                        <button onClick={handleCashOnDelivery} className='py-2 px-4 border-2 border-green-500 font-semibold text-green-600 hover:bg-green-600 hover:text-white rounded cursor-pointer'>Cash On Delivery</button>
                    </div>
                </div>

            </div>
            {
                openAddress && (
                    <AddAddress close={() => setOpenAddress(false)} />
                )
            }

        </section>
    )
}

export default CheckoutPage