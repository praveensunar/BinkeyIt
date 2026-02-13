import { createContext , useContext, useState  } from "react";
import Axios from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../Store/cartProduct";
import { useEffect } from "react";
import summaryApi from '../common/SummaryApi'
import AxiosToastError from "../utils/AxiosToast";
import toast from "react-hot-toast";
import { priceWithDiscount } from "../utils/PriceWithDiscount";

export const GlobalContext = createContext(null)

export const useGlobalContext = ()=> useContext(GlobalContext)

const GlobalProvider = ({children})=>{
    const dispatch = useDispatch()
    const [ totalQty ,setTotalQty ] = useState(0)
    const [ totalPrice,setTotalPrice ] = useState(0)
    const [notDiscountTotalPrice , setNotDiscountTotalPrice ] = useState(0)
    const cartItem =useSelector(state => state.cartItem.cart)


    const fetchCartItem = async()=>{
          try{
            const response = await Axios({
              ...summaryApi.getCartItem
            })
            const { data : responseData } = response
    
            if(responseData.success){
              dispatch(handleAddItemCart(responseData.data))
            }
          }catch(error){
            console.log(error)
          }
      }
    
    const updateCartItem = async(id , qty)=>{
        try {
            const response = await Axios({
                ...summaryApi.updateCartItemQty,
                data : {
                   _id : id ,
                   qty : qty  
                }
            })
            const { data : responseData } = response
            if(responseData.success){
                // toast.success(responseData.message)   
                fetchCartItem()
                return responseData
            }
        }catch(error){
            AxiosToastError(error)
            return error
        }
    } 

    const deleteCartItem = async(cardId)=>{
        try{
            const response = await Axios({
                ...summaryApi.deleteCartItem,
                data : {
                    _id : cardId
                }
            })
            const {data : responseData} = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchCartItem()
            }

        }catch(error){
           AxiosToastError(error)
        }
    }
    
      useEffect(()=>{
        fetchCartItem()
      },[])

      useEffect(()=>{
              const qty = cartItem.reduce((preve,curr)=>{
                  return preve + curr.quntity
              },0)
              setTotalQty(qty)
              
              const tPrice = cartItem.reduce((preve,curr)=>{
                  return preve + (priceWithDiscount(
                    curr.productId.price,
                    curr.productId.discount)
                     * curr.quntity)
              },0)
              setTotalPrice(tPrice)
              
              const notDiscountPrice = cartItem.reduce((preve,curr)=>{
                  return preve + (curr?.productId?.price * curr.quntity)
              },0)
              setNotDiscountTotalPrice(notDiscountPrice)
      
              
          },[cartItem])

    return(
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            totalQty,
            totalPrice,
            notDiscountTotalPrice
            }}>
            {children}
        </GlobalContext.Provider>

    )
}

export default GlobalProvider