import React from 'react'
import summaryApi from '../common/SummaryApi'
import { useState } from 'react'
import AxiosToastError from '../utils/AxiosToast'
import Axios from '../utils/axios'
import { useEffect } from 'react'
import Loading from '../Components/Loading'
import ProductCardAdmin from '../Components/ProductCardAdmin'
import { IoSearchOutline } from "react-icons/io5";

const ProductAdmin = () => {
  const [productData , setProductData] = useState([])
  const [page ,setPage] = useState(1)
  const [totalPageCount ,setTotalPageCount] = useState(1)
  const [loading ,setLoading ] = useState(false)
  const [search , setSearch] = useState("")

  const fetchProductData = async()=>{
    try{
      setLoading(true)
      const response = await Axios({
        ...summaryApi.getProduct,
        data : {
          page : page,
          limit :12,
          search : search
        }
      })
      const {data : responseData } = response
      if(responseData.success){
        setTotalPageCount(responseData.totalNoPage)
        setProductData(responseData.data)
      }
    }catch(error){
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{
    fetchProductData()
  },[page])

  const handleNext = ()=>{
    if(page < totalPageCount){

      setPage(preve => preve + 1)
    } 
  }

  const handlePrevious = ()=>{
    if(page > 1){

      setPage(preve => preve - 1 )
    }
  }

  const handleOneChange = (e)=>{
    const { value } = e.target
    setSearch(value)
    setPage(1)
  }
  useEffect(()=>{
    let flat = true
    const interval = setTimeout(()=>{
      if(flat){
        fetchProductData()
        flat = false
      }
    },300);

    return ()=>{
      clearInterval(interval)
    }
  },[search])

  return (
   <section>
    <div className='p-2 shadow-md bg-white flex items-center justify-between gap-4'>
  
            <h2 className='font-semibold'>Product</h2>
            <div className='h-full min-w-24 max-w-56 w-full ml-auto px-4 py-2 bg-blue-50 flex items-center gap-3 border rounded focus-within:border-[var(--color-primary-200)]'>
                <IoSearchOutline size={25}/>
              <input type="text"
              onChange={handleOneChange}
              value={search}
              placeholder='Search Product here....'
              className=' h-full w-full outline-none bg-transparent'
              />
            </div>
        </div>


      <div className='p-4 bg-blue-50'>

      <div className='min-h-[55vh]'>

          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {
              productData.map((p,index)=>{
                return (
                  <ProductCardAdmin data={p} key={p._id} />
                )
              })
            }
          </div>  


      </div>

          

          <div className='flex justify-between my-4'>

            <button onClick={handlePrevious} className='border border-[var(--color-primary-200)] px-4 py-1 hover:bg-[var(--color-primary-200)]'>Previous</button>
            <button  className='w-full bg-slate-100'>{page}/{totalPageCount}</button>
            <button onClick={handleNext} className='border border-[var(--color-primary-200)] px-4 py-1 hover:bg-[var(--color-primary-200)]'>Next</button>
          </div>

      </div>

        
     {
      loading && (
        <Loading/>
      )
     }
   </section>
  )
}

export default ProductAdmin