import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import UploadImage from '../utils/UploadImage'
import toast from 'react-hot-toast'
import Axios from '../utils/axios'
import summaryApi from '../common/SummaryApi'
import AxoisToastError from '../utils/AxiosToast'


const EditCategory = ({ close, fetchData,data : categoryData}) => {
    const [data, setData] = useState({
        _id : categoryData._id,
        name: categoryData.name,
        image: categoryData.image 
      })
    const [loading ,setLoading]=useState(false)
      // 🔹 Input change
      const handleOnchange = (e) => {
        const { name, value } = e.target
    
        setData((prev) => ({
          ...prev,
          [name]: value
        }))
      }

      const handleUploadCategoryImage = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setLoading(true)
        const res = await UploadImage(file)
    
        // ✅ safety checks
        if (!res || res.status !== 200) {
          toast.error(res?.data?.message || 'Image upload failed')
          return
        }
        setLoading(false)
        setData((prev) => ({
          ...prev,
          image: res.data.data.url
        }))
      }

        const handleSubmit = async(e) => {
          e.preventDefault()
      
          try{
            setLoading(true)
            const response = await Axios({
              ...summaryApi.updateCategory,
              data : data
            })
            const  responseData =response?.data
            if (response.status === 200 || response.status === 201) {
            toast.success(responseData.message || 'Category added successfully')
            close()
            fetchData()
          }
          }catch(error){
            AxoisToastError(error)
      
          }finally{
            setLoading(false)
          }
      
          if (!data.name || !data.image) {
            toast.error('Name and Image are required')
            return
          }
      
          // submit category API here later
          console.log('Category Data:', data)
        }
  return (
   <section className='fixed inset-0 p-4 bg-neutral-800/60 flex justify-center items-center'>
         <div className='bg-white max-w-4xl w-full p-4 rounded'>
           <div className='flex items-center'>
             <h1 className='font-semibold'> Update Category</h1>
             <button onClick={close} className='ml-auto cursor-pointer hover:text-red-500'>
               <IoClose size={25} />
             </button>
           </div>
   
           <form className='my-3 grid gap-2' onSubmit={handleSubmit}>
             {/* Category Name */}
             <div className='grid gap-1'>
               <label htmlFor='categoryName'>Name</label>
               <input
                 className='bg-blue-50 p-2 border rounded border-blue-100 focus-within:border-[var(--color-primary-200)] outline-none'
                 type='text'
                 id='categoryName'
                 placeholder='Enter the Category Name'
                 value={data.name}
                 name='name'
                 onChange={handleOnchange}
               />
             </div>
   
             {/* Image Upload */}
             <div className='grid gap-1'>
               <p>Image</p>
               <div className='flex gap-4 flex-col lg:flex-row items-center'>
                 <div className='border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded'>
                   {data.image ? (
                     <img
                       src={data.image}
                       alt='category'
                       className='w-full h-full object-scale-down'
                     />
                   ) : (
                     <p className='text-sm text-neutral-500'>No Image</p>
                   )}
                 </div>
   
                 <label htmlFor='uploadCategoryImage'>
                   <div
                     className={`${
                       !data.name ? 'bg-gray-300' : 'border-[var(--color-primary-200)] hover:bg-[var(--color-primary-100)] '
                     } border rounded p-1 cursor-pointer font-medium`}
                   >
                    {
                        loading ? "Longing..." : "Upload Image"
                    }
                   </div>
                   <input
                     disabled={!data.name}
                     onChange={handleUploadCategoryImage}
                     type='file'
                     id='uploadCategoryImage'
                     className='hidden'
                     accept='image/*'
                   />
                 </label>
               </div>
             </div>
             <button className={`${data.name && data.image ? "bg-[var(--color-primary-100)] hover:bg-[var(--color-primary-200)] " : "bg-gray-300 "} py-2 font-semibold`}>{loading ? "Updating...": "Update Category"}
   
             </button>
           </form>
         </div>
       </section>
  )
}

export default EditCategory