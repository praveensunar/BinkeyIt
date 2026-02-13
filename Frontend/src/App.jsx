import { Outlet } from "react-router-dom"
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from "react";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from './Store/userSlice';
import { setAllCategory,setAllSubCategory, setLoadingCategory } from "./Store/productSlice";
import { useDispatch } from "react-redux";
import Axios from './utils/axios'
import summaryApi from './common/SummaryApi'
import { handleAddItemCart } from "./Store/cartProduct";
import GlobalProvider from './Proveider/GlobalProvider.jsx'
import CartMobileLink from "./Components/CartMobile.jsx";

function App() {

  const dispatch = useDispatch()
  

  const fetchUser = async()=>{
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }



  const fetchCategory = async()=>{
        try{
          dispatch(setLoadingCategory(true))
        const response = await Axios({
            ...summaryApi.getCategory
        })
        const {data : responseData} = response
        if(responseData.success){
          dispatch(setAllCategory(responseData.data))
            // setCategoryData(responseData.data)
        }
        }catch(error){

        }finally{
            dispatch(setLoadingCategory(false))
        }

    }

     const fetchSubCategory = async()=>{
        try{
          
        const response = await Axios({
            ...summaryApi.getSubCategory
        })
        const {data : responseData} = response
        if(responseData.success){
          dispatch(setAllSubCategory(responseData.data))
            // setCategoryData(responseData.data)
        }
        }catch(error){

        }finally{
        
            
        }

    }


  


  useEffect(()=>{
   fetchUser()
   fetchCategory()
   fetchSubCategory()
  //  fetchCartItem()
  },[])
  return (
    <GlobalProvider>
   <Header/>
     <main className="min-h-[78vh] ">
      <Outlet/>
     </main>
     <Footer/>
     <Toaster/>
    <CartMobileLink/>
     
     </GlobalProvider>
  )
}

export default App
