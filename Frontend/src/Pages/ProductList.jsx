import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Axios from '../utils/axios'
import AxiosToastError from '../utils/AxiosToast'
import summaryApi from '../common/SummaryApi'
import { useEffect } from 'react'
import Loading from '../Components/Loading'
import CardProduct from '../Components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
const ProductList = () => {
  const [data , setData ] = useState([])
  const [page , setPage ] = useState(1)
  const [loading , setLoading ] = useState(false)
  const [totalPage , setTotalPage ] = useState(1)
  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [displaySubCategory , setDisplaySubCategory ] = useState([])
  const subCategoryName = params?.subCategory?.split("-").slice(0,-1)?.join(" ")


      const categoryId = params.category.split("-").slice(-1)[0]
      const subCategoryId = params.subCategory.split("-").slice(-1)[0]
  
    const fetchProductData = async()=>{


    try{
        setLoading(true)
        const response = await Axios({
            ...summaryApi.getProductByCategoryAndSubcategory,
            data : {
              categoryId :categoryId ,
              subCategoryId :subCategoryId ,
              page : page,
              limit : 10,
            }
        })

        const { data : responseData } = response

        if(responseData.success){

          if(responseData.page == 1){
            setData(responseData.data)
          }else{
            setData([...data,...responseData.data])
          }
          console.log(responseData)
          setTotalPage(responseData.totalCount)
          
        }
    }catch(error){
AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }
   useEffect(()=>{
    fetchProductData()
   },[params])

   useEffect(()=>{
    const sub = AllSubCategory.filter(s =>{
      const filterData = s.category.some(el =>{
        return el._id === categoryId
      })
      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub)
   },[params,AllSubCategory])
  return (
    <section className='sticky top-24 lg:top-20'>
      <div className='container sticky top-24 h-full mx-auto grid grid-cols-[90px_1fr] md:grid-cols-[200px_1fr] lg:grid-cols-[280px_1fr]'>
          {/* subCategory */}
          <div className='min-h-[88vh] max-h-[88vh] overflow-y-scroll p-2 grid gap-1 shadow-md scrollbarcustome bg-white py-2'>
          {
            displaySubCategory.map((s,index)=>{
            
                const link =`/${valideURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
              return (
                <Link to={link} className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 border-b lg:gap-4 box-border hover:bg-green-100 ${subCategoryId === s._id ? "bg-green-100":""}`}>
                    <div className='w-fit max-w-28 mx-auto bg-white lg:mx-0 rounded box-border'>
                      <img src={s.image} alt="subcategorys" 
                      className='w-14 lg:w-12 h-full lg:h-14 object-scale-down' />
                    </div>
                    <p className='-mt-6 lg:mt-0 text-xs text-center lg:text-base lg:text-left'>{s.name}</p>
                </Link>
              )
            })  
          }
          </div>

          {/* Product */}
          <div className='sticky top-20'>
           <div className='bg-white shadow-md p-4 z-10'>
            <h3 className='font-semibold'>{subCategoryName}</h3>
           </div>
           <div>

            <div className='min-h-[80vh] max-h-[80vh] overflow-y-auto relative'>
              <div className='grid grid-cols-1 p-4 gap-4 md:grid-cols-3 lg:grid-cols-4'>
                  {
                    data.map((p,index)=>{
                      return (
                          <CardProduct key={p._id+"produtSubCategory"+index} data={p}/>
                      )
                    })
                  }
              </div>
            </div>

            {
              loading  &&(
                <Loading />
              )
            }
           </div>
             
          </div>
      </div>
    </section>
  )
}

export default ProductList