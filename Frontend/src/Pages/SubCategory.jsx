import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../Components/UploadSubCategoryModel'
import AxoisToastError from '../utils/AxiosToast'
import Axios from '../utils/axios'
import summaryApi from '../common/SummaryApi'
import DisplayTable from '../Components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../Components/ViewImage'
import { HiPencil } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import EditSubCategory from '../Components/EditSubCategory'
import ConfirmBox from '../Components/ConfirmBox'
import toast from 'react-hot-toast'


const SubCategory = () => {

  const [openSubCategory,setOpenSubCategory] = useState(false)
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL ,setImageURL] = useState("")
  const [openEdit,setOpenEdit] = useState(false)
  const [editData,setEditData] = useState({
    _id :""
  })
  const [deleteSubCategory,setDeleteSubCategory] = useState({
    _id : ""
  })
  const [openConfirmDelete , setOpenConfirmDelete] = useState(false)
  const fetchSubCategory = async()=>{
    try{
      setLoading(true)
      const response = await Axios({
        ...summaryApi.getSubCategory
      })
      const {data : responseData} = response

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
    fetchSubCategory()
  },[])

  const column =[
    columnHelper.accessor('name',{
      header : "Name"
    }),
    columnHelper.accessor('image',{
      header : "Image",
      cell : ({row})=>{
        return <div className='flex justify-center items-center '>
        <img
              src={row.original.image}
              alt={row.original.name}
              className='w-8 h-8 cursor-pointer'
              onClick={()=>{
                setImageURL(row.original.image)
              }}
              />
        </div>
      }
    }),
    columnHelper.accessor('category',{
      header : "Category",
      cell : ({row})=>{
        return (
          <>
          {
            row.original.category.map((c,index)=>{
              return (
                <p key={c._id+"table"} className="shadow-md px-1 inline-block">{c.name}</p>
              )
            })
          }
          </>
        )
      }
    }),
    columnHelper.accessor("_id",{
      header : "Action",
      cell : ({row})=>{
        return (
          <div className='flex justify-center items-center gap-3'>
            <button onClick={()=>{setOpenEdit(true),setEditData(row.original) }}  className='p-2 bg-green-100 rounded-full hover:text-green-600'>
            <HiPencil size={20}/>
            </button>
            <button onClick={()=>{setOpenConfirmDelete(true),setDeleteSubCategory(row.original)}} className='p-2 bg-red-100  text-red-500 rounded-full hover:text-red-600'>
            <MdDelete size={20}/>
            </button>
          </div>
        )
      }

    })
  ]

  const handleDeleteSubCategory = async()=>{
    try{
            const response = await Axios({
                ...summaryApi.deleteSubCategory,
                data : deleteSubCategory
            })
            const {data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                fetchSubCategory()
                setOpenConfirmDelete(false)
                setDeleteSubCategory({_id:""})
            }
        }catch(error){
            AxoisToastError(error)

        }
    }
  

  
  return (
     <section>
        <div className='p-2 shadow-md bg-white flex items-center justify-between'>
            <h2 className='font-semibold'>Sub Category</h2>
            <button onClick={()=>setOpenSubCategory(true)} className='text-sm font-semibold border px-3 py-1 rounded hover:bg-[#FEBE05] '>Add Sub Category</button>
        </div> 
        <div className='overflow-auto w-full max-w-[95vw]'>
          <DisplayTable data={data}
          column={column}/>
        </div>

        {
          openSubCategory && (
            <UploadSubCategoryModel close={()=>setOpenSubCategory(false)} fetchData={fetchSubCategory}/>
          )
        }

        {
          ImageURL &&(
          <ViewImage url={ImageURL} close={()=>setImageURL("")}/>
          )
        }{
          openEdit &&(
          <EditSubCategory data={editData} close={()=>setOpenEdit(false)} fetchData={fetchSubCategory }/>
          )
        }
        {
          openConfirmDelete &&(
            <ConfirmBox close={()=>setOpenConfirmDelete(false) } cancel={()=>setOpenConfirmDelete(false)} confirm={handleDeleteSubCategory}/>
          )

        }
        </section>
        
  )
}

export default SubCategory