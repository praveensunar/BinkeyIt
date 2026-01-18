import { Outlet } from "react-router-dom"
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from "react";
import fetchUserDetails from "./utils/fetchUserDetails";
import { setUserDetails } from './Store/userSlice';
import { setAllCategory,setAllSubCategory } from "./Store/productSlice";
import { useDispatch } from "react-redux";
import Axios from './utils/axios'
import summaryApi from './common/SummaryApi'


function App() {

  const dispatch = useDispatch()

  const fetchUser = async()=>{
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }



  const fetchCategory = async()=>{
        try{
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
            // setLoading(false)
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
            // setLoading(false)
        }

    }

  useEffect(()=>{
   fetchUser()
   fetchCategory()
   fetchSubCategory()
  },[])
  return (
    <>
   <Header/>
     <main className="min-h-[78vh] ">
      <Outlet/>
     </main>
     <Footer/>
     <Toaster/>
     </>
  )
}

export default App
