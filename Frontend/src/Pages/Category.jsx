import React, { useState } from 'react'
import UploadCategoryModel from '../Components/UploadCategoryModel'
import { useEffect } from 'react'
import Loading from '../Components/Loading'
import NoData from '../Components/NoData'
import Axios from '../utils/axios'
import summaryApi from '../common/SummaryApi'
import EditCategory from '../Components/EditCategory'
import ConfirmBox from '../Components/ConfirmBox'
import toast from 'react-hot-toast'
import AxoisToastError from '../utils/AxiosToast'
import { useSelector } from 'react-redux'

const Category = () => {
    const [openUploadCategory,setOpenUploadCategory] = useState(false)
    const [loading,setLoading] = useState(false)
    const [categoryData ,setCategoryData] = useState([])
    const [openEdit , setOpenEdit] = useState(false)
    const [editData ,setEditData] = useState({
        name : "",
        image : ""
    })
     const [openConfirmDelete , setOpenConfirmDelete] = useState(false)

     const [deleteCategory ,setDeleteCategory] = useState({
        _id : ""
     })
     const allCategory = useSelector(state => state.product.allCategory)

     const fetchCategory = async () => {
  try {
    setLoading(true)

    const response = await Axios({
      ...summaryApi.getCategory
    })

    const { data: responseData } = response

    if (responseData.success) {
      setCategoryData(responseData.data)
    }
  } catch (error) {
    AxoisToastError(error)
  } finally {
    setLoading(false)
  }
}
    useEffect(() => {
  fetchCategory()
}, [])

 
    const handleDeleteCategory = async()=>{
        try{
            const response = await Axios({
                ...summaryApi.deleteCategory,
                data : deleteCategory
            })
            const {data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                setOpenConfirmDelete(false)
                fetchCategory()
            }
        }catch(error){
            AxoisToastError(error)

        }
    }
  return (
    <section>
        <div className='p-2 shadow-md bg-white flex items-center justify-between'>
            <h2 className='font-semibold'>Category</h2>
            <button onClick={()=>setOpenUploadCategory(true)} className='text-sm font-semibold border px-3 py-1 rounded hover:bg-[#FEBE05] '>Add Category</button>
        </div>
        {
            !categoryData[0] && !loading && (
                <NoData/>
            )
        }
        <div className='p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'>
            {
            categoryData.map((category)=>{
                return(
                    <div key={category._id} className='w-32 h-56 rounded shadow-md'>
                        <img src={category.image} alt={category.name} className='w-full object-scale-down' />
                        <div className='flex items-center h-9 gap-2'>
                            <button onClick={()=>{setOpenEdit(true),setEditData(category)}}  className='flex-1 bg-green-100 hover:bg-green-200 text-green-600 font-medium py-1'>Edit</button>
                            <button onClick={()=>{setOpenConfirmDelete(true) ,setDeleteCategory(category)}} className='flex-1 bg-red-100 hover:bg-red-200 text-red-600 font-medium py-1'>Delete</button>
                        </div>
                    </div>
                )
            })
        }
        </div>
            {
                loading && (
                    <Loading/>
                )
            }


        {
            openUploadCategory && (
                <UploadCategoryModel fetchData={fetchCategory} close={()=>setOpenUploadCategory(false)}/>
            )
        }
        {
            openEdit && (
                <EditCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchCategory} />
            )
        }
        { openConfirmDelete && (
            <ConfirmBox close={()=>setOpenConfirmDelete(false) } cancel={()=>setOpenConfirmDelete(false)} confirm={handleDeleteCategory}/>
        )
        }
    </section>
  )
}

export default Category