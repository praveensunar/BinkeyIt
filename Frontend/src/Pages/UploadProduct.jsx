import React, { useEffect, useState } from 'react'
import { IoMdCloudUpload } from "react-icons/io";
import UploadImage from '../utils/UploadImage';
import Loading from '../Components/Loading';
import ViewImage from '../Components/ViewImage';
import { MdDelete } from "react-icons/md";
import {useSelector } from 'react-redux'
import { IoClose } from 'react-icons/io5'
import AddField from '../Components/AddField';
import Axios from '../utils/axios';
import summaryApi from '../common/SummaryApi';
import AxoisToastError from '../utils/AxiosToast'
import successAlert from '../utils/successAlert';


const UploadProduct = () => {
  const [data , setData] = useState({
    name : "",
    image : [],
    category : [],
    subCategory : [],
    unit : "",
    stock :"",
    price : "",
    discount : "",
    description : "",
    more_details : {},
    
  })

  const [imageLoading , setImageLoading] =useState(false)
  const [viewImageURL , setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const[selectCategory , setSelectCategory]= useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)
  const [selectSubCategory ,setSelectSubCategory] =useState("")

  const [openAddField ,setOpenAddField] = useState(false)
  const [fieldName , setFieldName] = useState("")


  
  const handleChange =(e)=>{
    const {name,value}=e.target

    setData((preve)=>{
      return{
      ...preve,
      [name] : value
      }
    })
  }

  const handleUploadImage= async(e)=>{
    const file = e.target.files[0]  
    if(!file){
      return 
    }
    setImageLoading(true)
    const response = await UploadImage(file)

    const { data : ImageResponse } =  response
    const imageUrl = ImageResponse.data.url
    setData((preve)=>{
      return {
      ...preve,
      image : [...preve.image,imageUrl]
      }
    })
    setImageLoading(false)
  }
  const handleDeleteImage = async(index)=>{
  data.image.splice(index,1)
  setData((preve)=>{
    return{
      ...preve
    } 
  })

  }
  const handleRemoveCategory = async(index)=>{
    data.category.splice(index,1)
    setData((preve)=>{
      return{
        ...preve,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
      }
    })
  }

  const handleRemoveSubCategory = async(index)=>{
    data.subCategory.splice(index,1)
    setData((preve)=>{
      return{
        ...preve,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
      }
    })
  }

  const handleAddField = ()=>{
    setData((preve)=>{
    return {
        ...preve,
        more_details : {
        ...preve.more_details,
        [fieldName] : ""
        }
         }

    })
    setFieldName("")
    setOpenAddField(false)
  }
  
  const handleSubmit = async(e)=>{
    e.preventDefault()
   try{
    const response = await Axios({
      ...summaryApi.createProduct,
      data : data
    })
    const {data : responseData} = response
    
    if(responseData.success){
        successAlert(responseData.message)
        setData({
          name : "",
          image : [],
          category : [],
          subCategory : [],
          unit : "",
          stock :"",
          price : "",
          discount : "",
          description : "",
          more_details : {},
        })
    }
   }catch(error){
    AxoisToastError(error)
   }
  }
  
  return (
    <section>
        <div className='p-2 shadow-md bg-white flex items-center justify-between'>
            <h2 className='font-semibold'>Upload Product</h2>
        </div>
        <div className='grid p-3'>
          <form  className='grid gap-4' onSubmit={handleSubmit}>
            <div className='grid gap-1'>
              <label htmlFor="name">Name</label>
              <input 
              type="text"
              id='name'
              value={data.name}
              placeholder='Enter product name'
              name='name'
             className='bg-blue-50 p-2 outline-none border focus:border-[var(--color-primary-200)] rounded'
              onChange={handleChange}
              required 
              />
            </div>

            <div className='grid gap-1'>
              <label htmlFor="description">Description</label>
              <textarea 
              type="text"
              id='description'
              value={data.description}
              placeholder='Enter product description'
              name='description'
             className='bg-blue-50 p-2 outline-none border focus:border-[var(--color-primary-200)] rounded resize-none'
              onChange={handleChange}
              required
              multiple
              rows={2}
              />
            </div>

            <div className='grid gap-1'>
              <p>Image</p>
              <div>
              <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center'>
                <div className='flex justify-center items-center flex-col cursor-pointer'>
                  {
                    imageLoading ? <Loading/> : (
                      <>
                      <IoMdCloudUpload size={35}/>
                      <p>Upload Image</p>
                      </>
                    )
                  }
                      
                </div>
                <input 
                type="file"
                id='productImage'
                className='hidden'
                accept='image/*'
                onChange={handleUploadImage}
                 />
              </label>
              {/** display uploaded images */}
              <div className='flex flex-wrap gap-4'>
              {
                data.image.map((img , index)=>{
                  return(
                    <div key={img+index} className='h-20 w-20 mt-1 min-w-20 bbg-blue-50 border relative group'>
                        
                      <img 
                      src={img} 
                      alt={img} 
                      className='w-full h-full object-scale-down cursor-pointer'
                      onClick={()=>setViewImageURL(img)} />
                      <div onClick={()=>handleDeleteImage(index)} className='absolute top-0 right-0 rounded bg-red-500 text-white hidden group-hover:block cursor-pointer p-1 m-1 '>
                        <MdDelete />
                    </div>

                    </div>
                    
                  )
                })
              }
              </div>
              </div>
            </div>

            <div className='grid gap-1'>
              <label>Category</label>
              <div>
              <select value={selectCategory} onChange={(e)=>{
                const value = e.target.value
                const category = allCategory.find(el =>el._id === value)
                console.log("value ",category)

                setData((preve)=>{
                  return{
                    ...preve,
                    category : [...preve.category,category]
                  }
                })
                setSelectCategory("")
              }} className='bg-blue-50 border w-full p-2 rounded focus:border-[var(--color-primary-200)] outline-none'>
                <option value="" className='text-neutral-600' >Select Category</option>
                {
                  allCategory.map((c,index)=>{
                    return (
                      <option key={c?._id} value={c?._id}>{c.name}</option>
                    )
                  })
                }
              </select>
             <div className='flex flex-wrap gap-3'>
               {
                data.category.map((c,index)=>{
                  return(
                    <div key={c._id+index+"productSection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                      <p>{c.name}</p>
                      <div className='hover:text-red-600 cursor-pointer' onClick={()=>handleRemoveCategory(index)}>
                        <IoClose size={20}/>
                      </div>
                    </div>
                  )
                })
              }
             </div>

              </div>
            </div>

            <div className='grid gap-1'>
              <label>
                Sub Category</label>
              <div>
              <select value={selectSubCategory} onChange={(e)=>{
                const value = e.target.value
                const subCategory = allSubCategory.find(el =>el._id === value)
                console.log("value ",subCategory)

                setData((preve)=>{
                  return{
                    ...preve,
                    subCategory : [...preve.subCategory,subCategory]
                  }
                })
                setSelectSubCategory("")
              }} className='bg-blue-50 border w-full p-2 rounded focus:border-[var(--color-primary-200)] outline-none'>
                <option value="" className='text-neutral-600'>Select Sub Category</option>
                {
                  allSubCategory.map((c,index)=>{
                    return (
                      <option key={c?._id} value={c?._id}>{c.name}</option>
                    )
                  })
                }
              </select>
             <div className='flex flex-wrap gap-3'>
               {
                data.subCategory.map((c,index)=>{
                  return(
                    <div key={c._id+index+"productSection"} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                      <p>{c.name}</p>
                      <div className='hover:text-red-600 cursor-pointer' onClick={()=>handleRemoveSubCategory(index)}>
                        <IoClose size={20}/>
                      </div>
                    </div>
                  )
                })
              }
             </div>

              </div>
            </div>

            <div className='grid gap-1'>
              <label htmlFor="unit">Unit</label>
              <input 
              type="text"
              id='unit'
              value={data.unit}
              placeholder='Enter product Unit'
              name='unit'
             className='bg-blue-50 p-2 outline-none border focus:border-[var(--color-primary-200)] rounded'
              onChange={handleChange}
              required 
              />
            </div>


             <div className='grid gap-1'>
              <label htmlFor="stock">Number of Stock</label>
              <input 
              type="number"
              id='stock'
              value={data.stock}
              placeholder='Enter product stock'
              name='stock'
             className='bg-blue-50 p-2 outline-none border focus:border-[var(--color-primary-200)] rounded'
              onChange={handleChange}
              required 
              />
            </div>

            <div className='grid gap-1'>
              <label htmlFor="price">Price</label>
              <input 
              type="number"
              id='price'
              value={data.price}
              placeholder='Enter product price'
              name='price'
             className='bg-blue-50 p-2 outline-none border focus:border-[var(--color-primary-200)] rounded'
              onChange={handleChange}
              required 
              />
            </div>

            <div className='grid gap-1 '>
              <label htmlFor="discount">Discount</label>
              <input 
              type="number"
              id='discount'
              value={data.discount}
              placeholder='Enter product discount'
              name='discount'
             className='bg-blue-50 p-2 outline-none border focus:border-[var(--color-primary-200)] rounded'
              onChange={handleChange}
              required 
              />
            </div>


              {/* add more fields */}
              <div>
              {
              Object?.keys(data?.more_details).map((k,index)=>{
                return(
                 <div key={k} className='grid gap-1'>
              <label htmlFor={k}>{k}</label>
              <input 
              type="text"
              id={k}
              value={data?.more_details[k]}
              name='discount'
             className='bg-blue-50 p-2 outline-none border focus:border-[var(--color-primary-200)] rounded'
              onChange={(e)=>{
                          const value = e.target.value
                          setData((preve)=>{
                                return{
                                ...preve,
                                more_details : {
                                            ...preve.more_details,
                                            [k] : value
                                              }
                                }
                      })
              }}
              required 
              />
            </div>
                )
              })
              }
              </div>
            <div onClick={()=>setOpenAddField(true)} className='hover:bg-[var(--color-primary-200)] bg-white py-1 px-3 w-32 text-center border border-[var(--color-primary-200)] hover:text-neutral-900 font-semibold rounded'>
              Add Fields
            </div>
            <button className='bg-[var(--color-primary-100)] hover:bg-[var(--color-primary-200)] py-2 font-semibold rounded'>
              Submit
              </button>
          </form>
        </div>
        {
          viewImageURL && (
            <ViewImage url={viewImageURL} close={()=>setViewImageURL("")}/>
          )
        }
        {
          openAddField &&(
            <AddField value={fieldName}
            onChange={(e)=>setFieldName(e.target.value)}
            submit={handleAddField} 
            close={()=>setOpenAddField(false)}/>
          )
        }
        </section>
  )
}

export default UploadProduct