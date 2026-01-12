import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import UploadImage from '../utils/UploadImage'
import toast from 'react-hot-toast'
import Axios from '../utils/axios'
import AxoisToastError from '../utils/AxiosToast'
import { useSelector } from 'react-redux'
import summaryApi from '../common/SummaryApi'

const EditSubCategory = ({ close, data,fetchData }) => {
  const [subCategoryData, setSubCategoryData] = useState({
    _id: data._id,
    name: data.name,
    image: data.image,
    category : data.category || []
  })
  const allCategory = useSelector(state => state.product.allCategory)

  const [loading, setLoading] = useState(false)

  // 🔹 Input change
  const handleOnchange = (e) => {
    const { name, value } = e.target
    setSubCategoryData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // 🔹 Image upload
  const handleUploadSubCategoryImage = async (e) => {
    const file = e.target.files[0]
    if (!file || loading) return

    try {
      setLoading(true)
      const res = await UploadImage(file)

      if (!res || res.status !== 200) {
        toast.error(res?.data?.message || 'Image upload failed')
        return
      }

      setSubCategoryData((prev) => ({
        ...prev,
        image: res.data.data.url
      }))
    } catch (error) {
      toast.error('Image upload failed')
    } finally {
      setLoading(false)
    }
  }
  

  const handleRemoveCategorySelected = (categoryId)=>{
    const index = subCategoryData.category.findIndex(el => el._id === categoryId)
    subCategoryData.category.splice(index,1)
    setSubCategoryData((preve) => {
        return{
            ...preve
        }
    })
  }

  // 🔹 Submit category
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const response = await Axios({
        ...summaryApi.updateSubCategory,
       data : subCategoryData
      })
      const { data : responseData } = response
    
      console.log("sub category :",responseData)
      if (responseData.success) {
        toast.success(responseData.message)
        
        if(close){
          close()
        }
        if(fetchData){
            fetchData()
        }
      }
    } catch (error) {
      AxoisToastError(error)
    } finally {
      setLoading(false)
    }
  }
  console.log('sub category EditSubCategory',data)

  return (
    <section className="fixed inset-0 p-4 bg-neutral-800/60 flex justify-center items-center z-50">
      <div className="bg-white max-w-4xl w-full p-4 rounded shadow-lg">
        {/* Header */}
        <div className="flex items-center mb-3">
          <h1 className="font-semibold text-lg">Edit Sub Category</h1>
          <button onClick={close} className="ml-auto">
            <IoClose size={25} />
          </button>
        </div>

        {/* Form */}
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {/* Category Name */}
          <div className="grid gap-1">
            <label htmlFor="name">Name</label>
            <input
              className="bg-blue-50 p-2 border rounded border-blue-100 focus:border-[var(--color-primary-200)] outline-none"
              type="text"
              id="name"
              placeholder="Enter sub category name"
              value={subCategoryData.name}
              name="name"
              onChange={handleOnchange}
            />
          </div>

          {/* Image Upload */}
          <div className="grid gap-1">
            <label>Image</label>
            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded">
                {subCategoryData.image ? (
                  <img
                    src={subCategoryData.image}
                    alt="subcategory"
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">No Image</p>
                )}
              </div>

              <label htmlFor="uploadSubCategoryImage">
                <div
                  className={`${
                    !subCategoryData.name
                      ? 'bg-gray-300'
                      : 'border-[var(--color-primary-200)] hover:bg-[var(--color-primary-100)]'
                  } border rounded px-4 py-2 cursor-pointer font-medium`}
                >
                  {loading ? 'Loading...' : 'Upload Image'}
                </div>

                <input
                  disabled={!subCategoryData.name || loading}
                  onChange={handleUploadSubCategoryImage}
                  type="file"
                  id="uploadSubCategoryImage"
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* selecter for category */} 
        <div className='grid gap-1 '>
            <label> Select Category</label>
                    <div className='border focus-within:border-[var(--color-primary-200)] rounded  '>

                    {/* display value */}
                    <div className='flex flex-wrap gap-2'>
                            {
                                subCategoryData.category.map((cat,index)=>{
                                    return(
                                        <p key={cat._id+"selectedValue"} className='bg-white shadow-md px-1 m-1 flex items-center gap-2'>
                                            {cat.name}
                                            <div className='cursor-pointer hover:text-red-500'onClick={()=>handleRemoveCategorySelected(cat._id)}><IoClose size={20}/></div>
                                            </p>
                                    )
                                })
                            }

                    </div>

                    {/* select category */}
                    <select className='w-full p-2 bg-transparent outline-none border'
                    onChange={(e)=>{
                        const value = e.target.value
                        const categoryDetail = allCategory.find(el => el._id == value)
                        setSubCategoryData((preve)=>{
                            return{
                                ...preve,
                                category : [...preve.category,categoryDetail]
                            }
                        })
                    }}>
                        <option value={""}>Seclect Category</option>
                        {
                            allCategory.map((category , index)=>{
                                return(
                                    <option value={category?._id} key={category._id+"subcategory"}>{category?.name}</option>
                                )
                            })
                        }
                    </select>
                    </div>
        </div>       
          

          {/* Submit Button */}
          <button
            disabled={loading || !subCategoryData.name || !subCategoryData.image}
            className={`${
              subCategoryData?.name && subCategoryData?.image && subCategoryData?.category[0]
                ? 'bg-[var(--color-primary-100)] hover:bg-[var(--color-primary-200)]'
                : 'bg-gray-300'
            } py-2 rounded font-semibold px-4`}
          >
            {loading ? 'Adding...' : 'Update'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default EditSubCategory