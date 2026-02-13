import { useState } from 'react'
import { useGlobalContext } from '../Proveider/GlobalProvider'
import Axois from '../utils/axios'
import summaryApi from '../common/SummaryApi'
import toast from "react-hot-toast"
import AxoisToastError from '../utils/AxiosToast'
import Loading from '../Components/Loading'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { FaMinus,FaPlus } from 'react-icons/fa'


const AddToCartbtn = ({data}) => {
    const [ loading , setLoading ] = useState(false)
    const { fetchCartItem,updateCartItem,deleteCartItem } = useGlobalContext()
    const cartItem = useSelector(state => state.cartItem.cart)
    const [ isAvailableCart ,setIsAvailable ] = useState(false)
    const [qty , setQty ]= useState(0)
    const [cartItemDetails , setCartItemDetails ]  = useState()

  const handleAddToCart = async(e)=>{
  e.preventDefault()
  e.stopPropagation()
  try{
    setLoading(true)
    const response = await Axois({
      ...summaryApi.addToCart,
      data : {
        productId : data?._id
      }
    })
    const { data : responseData } = response
    if(responseData.success){
      toast.success(responseData.message)
      if(fetchCartItem){
        fetchCartItem()
      }
    }

  }catch(error){
    AxoisToastError(error)
  }finally{
    setLoading(false)
  }
  }

  // checking this item in cart or not

  useEffect(()=>{
    const checkingItem = cartItem.some(item => item.productId._id === data._id)
    setIsAvailable(checkingItem)
    const product = cartItem.find(item => item.productId._id === data._id)
    setQty(product?.quntity)
    setCartItemDetails(product)
    
  },[data,cartItem])

  const increseQty = async(e)=>{
    e.preventDefault()
    e.stopPropagation()

   const response = await updateCartItem(cartItemDetails?._id,qty+1)
   if(response.success){
    toast.success("Item Added")
   }
  }

  const decreseQty = async(e)=>{
    e.preventDefault()
    e.stopPropagation()
    if(qty === 1){
        deleteCartItem(cartItemDetails?._id)
    }else{
        const response = await updateCartItem(cartItemDetails?._id,qty-1)
        if(response.success){
          toast.success("Item Removed ")
        }
    }
  }

  return (
    <div className='w-full max-w-[150px]'>{
        isAvailableCart ?(
            <div className='flex h-full w-full'>
                <button onClick={decreseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded cursor-pointer flex items-center justify-center'><FaMinus/></button>
                <p className='flex-1 w-full px-1 flex items-center justify-center'>{qty}</p>
                <button onClick={increseQty} className='bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded cursor-pointer flex items-center justify-center'><FaPlus/></button>
            </div>
        ):(
            <button onClick={handleAddToCart} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 flex-1 w-full p-1 rounded cursor-pointer">
                {loading ? <Loading/> : "Add"  }
            </button>
        )}
        
        
    </div>
  )
}


export default AddToCartbtn