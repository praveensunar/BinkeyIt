import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import AxoisToastError from '../utils/AxiosToast'
import Axios from '../utils/axios'
import summaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { useNavigate } from 'react-router-dom'
import { FaAngleLeft ,FaAngleRight } from 'react-icons/fa6';
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({id,name}) => {
    const [data,setData ] = useState([])
    const [loading , setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state =>state.product.allSubCategory)
    const navigate = useNavigate()
    const loadingCardNumber = new Array(6).fill(null)
    
    const fetchCategoryWiseProduct = async()=>{
        try{
            setLoading(true)
            const response = await Axios({
                ...summaryApi.getProductByCategory,
                data : {
                    id : id
                }
            })
            const { data : responseData } = response
            if(responseData.success){
                setData(responseData.data)
            }
            
        }catch(error){
            AxoisToastError(error)
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        fetchCategoryWiseProduct()
    },[])

    const handleScrollRight = ()=>{
        containerRef.current.scrollLeft +=200
    }
    const handleScrollLeft = ()=>{
        containerRef.current.scrollLeft -=200
    }

    
    

  
  const handleRedirectProductList =(i)=>{
  

    const subcategory = subCategoryData.find(sub =>{
      const filterData = sub.category.some(c =>{
        return c._id == id
      })
      return filterData ? true : null

    })
      const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`
      return url

  }


const redirectURL = handleRedirectProductList()
  return (
    <div>
        <div className='container mx-auto p-4 flex items-center justify-between gap-4 '>
                  <h3 className='font-semibold text-lg md:text-xl'>{name}</h3>
                  <Link to={redirectURL} className='text-green-600 hover:text-green-400'>See All</Link>
        </div>
            <div className='flex items-center gap-4 md:gap-6 lg:gap-8 container mx-auto px-4 overflow-x-scroll scroll-smooth scroll-none 'ref={containerRef}>
            { loading &&
                loadingCardNumber.map((_,index)=>{
                    return(
                        <CardLoading  key={"categorywishProductDisplay123"+index} />
                    )
                })
            }
            {
                data.map((p,index)=>{
                    return(
                        <CardProduct data={p} key={p._id+"categorywishProductDisplay"+index}/>
                    )
                })
            }
            <div className='w-full left-0 right-0 absolute container mx-auto px-2 hidden lg:flex justify-between'>
                <button onClick={handleScrollLeft} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full text-lg '>
                    <FaAngleLeft/>
                </button>

                <button onClick={handleScrollRight} className='z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 rounded-full text-lg '>
                    <FaAngleRight/>
                </button>
            </div>
    
    </div>
            
    </div>
  )
}

export default CategoryWiseProductDisplay