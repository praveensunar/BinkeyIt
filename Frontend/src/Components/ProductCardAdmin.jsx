import React, { useState } from 'react'
import EditProductAdmin from './EditProductAdmin'
import { IoClose } from 'react-icons/io5'
import summaryApi from '../common/SummaryApi'
import Axios  from '../utils/axios'
import AxoisToastError from '../utils/AxiosToast'
import toast from 'react-hot-toast'

const ProductCardAdmin = ({ data ,fetchProductData }) => {
  const [editOpen , SetEditOpen ] = useState(false)
  const [openDelete , setOpenDelete] = useState(false)
  
  const handleDelete = async()=>{
    try{
      const response = await Axios({
        ...summaryApi.deleteProduct,
        data : {
          _id : data._id
        }
      })

      const {data : responseData } = response

      if(responseData.success){
        toast.success(responseData.message)
        if(fetchProductData){
          fetchProductData()
        }
        setOpenDelete(false)
      }

    }catch(error){
      AxoisToastError(error)
    }

  }
  
  return(
  
  <div className="w-36 bg-white rounded-lg shadow-sm hover:shadow-md transition p-3 flex flex-col gap-2">
  
  <div className="w-full h-28 flex items-center justify-center bg-slate-50 rounded">
    <img
      src={data?.image?.[0]}
      alt={data?.name}
      className="max-w-full max-h-full object-contain"
    />
  </div>


  <p
    className="text-sm font-medium text-gray-800 line-clamp-2"
    title={data?.name}
  >
    {data?.name}
  </p>

 
  <p
    className="text-xs text-slate-500 font-semibold truncate"
    title={data?.unit}
  >
    {data?.unit}
  </p>
  <div className='grid grid-cols-2 gap-3 py-2'>
    <button onClick={()=>SetEditOpen(true)} className='border px-1 py-1 text-sm rounded border-green-600 bg-green-100 text-green-800 hover:bg-green-200'>Edit</button>
    <button onClick={()=>{setOpenDelete(true)}} className='border px-1 py-1 text-sm rounded border-red-600 bg-red-100 text-red-800 hover:bg-red-200'>Delete</button>
  </div>
    {
      editOpen &&(

        <EditProductAdmin fetchProductData={fetchProductData} data={data} close={()=>SetEditOpen(false)}/>
      )
    }
    
    { openDelete && (
            <section className='fixed top-0 bottom-0 right-0 left-0 bg-neutral-600/70 z-50 flex justify-center items-center p-4'>
              <div className='bg-white p-4 w-full max-w-md rounded'>
                <div className='flex items-center justify-between gap-4'>
                  <h3 className='font-semibold'>Permanent Delete</h3>
                  <button onClick={()=>setOpenDelete(false)} className=' text-black cursor-pointer hover:text-red-600'>
                    <IoClose size={25}/>
                    </button>
                </div>
                <p className='my-2'>Are you sure want to delete permanent?</p>

                <div className='flex justify-end gap-5 py-4'>
                  <button onClick={()=>setOpenDelete(false)} className='border px-3 py-1 rounded border-red-500 bg-red-100 text-red-500 hover:bg-red-200 cursor-pointer'>Cancel</button>
                  <button onClick={handleDelete} className='border px-3 py-1 rounded border-green-500 bg-green-100 text-green-500 hover:bg-green-200 cursor-pointer'>Delete</button>
                </div>
              </div>
            </section>
          )
    }

</div>

  )
}

export default ProductCardAdmin