import React, { useEffect, useState } from 'react'
import CardLoading from '../Components/CardLoading'
import summaryApi from '../common/SummaryApi'
import Axios from '../utils/axios'
import AxiosToastError from '../utils/AxiosToast'
import CardPrduct from '../Components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLocation } from 'react-router-dom'
import noDataImage from '../assets/nothing_here_yet.webp'

const SearchPage = () => {
  const [data,setData] = useState([])
  const [ loading , setLoading ] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [ page , setPage] = useState(1)
  const [totalPage , setTotalPage ] = useState(1)
  const parsams = useLocation()
  const searchText = parsams?.search?.slice(3)


  const fetchData = async()=>{
    try{
      setLoading(true)
      const response = await Axios({
        ...summaryApi.searchProduct,
        data :{
          search : searchText,
          page : page
      }
      })

      const { data : responseData } = response

      if(responseData.success){
          if(responseData.page == 1){
            setData(responseData.data)
          }else{
            setData((preve)=>{
              return [
                ...preve,
                ...responseData.data
              ]
            })
          }
          setTotalPage(responseData.totalPage)
      }
    }catch(error){
      AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchData()
  },[page,searchText])
  const handleFetchMore = ()=>{
    if(totalPage > page){
      setPage(preve => preve + 1)
    }
  }

  return (
    <section>
      <div className='container mx-auto p-4'>
        <p className='font-semibold'>Search Result : {data.length} </p>

        <InfiniteScroll 
        dataLength={data.length}
        hasMore={true}
        next={handleFetchMore}>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-4 gap-4'>

        {
          data.map((p,index)=>{
              return (
                <CardPrduct data={p} key={p?._id+"searchProduct"+index} />
              )  
          })
        }

        



          {
            loading && (
      loadingArrayCard.map((_,index)=>{

        return (
          <CardLoading key={"loadingsearchpage"+index}/>
        )
      })
    )
          }

        </div>
         </InfiniteScroll>

         {
          //no data
          !data[0] && !loading && (
            <div className='flex flex-col justify-center items-center w-full mx-auto '>
              <img src={noDataImage}
              className='w-full h-full max-w-xs max-h-xs block' />
              <p className='font-semibold my-2'>No Data Found</p>
            </div>
          )
        }

      </div>
    </section>
  )
}

export default SearchPage