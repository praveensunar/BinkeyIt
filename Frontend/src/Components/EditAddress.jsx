import React from 'react'
import { useForm  } from 'react-hook-form'
import summaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import Axios from '../utils/axios'
import AxiosToastError from '../utils/AxiosToast'
import { IoClose } from 'react-icons/io5'
import { useGlobalContext } from '../Proveider/GlobalProvider'

const EditAddress = ({close,data}) => {
   const { register , handleSubmit,reset } = useForm(
    {
        defaultValues : {
                    _id : data._id,
                    userId : data.userId,
                    address_line : data.address_line,
                    city : data.city,
                    state : data.state,
                    country : data.country,
                    pincode : data.pincode,
                    mobile : data.mobile
        }
    }
   )
    const { fetchAddress } = useGlobalContext()

    const onSubmit = async(data)=>{
        try{
            const  response = await Axios({
                ...summaryApi.updateAddress,
                data :{
                    ...data,
                    address_line : data.address_line,
                    city : data.city,
                    state : data.state,
                    country : data.country,
                    pincode : data.pincode,
                    mobile : data.mobile
                }
            })

            const {data : responseData } = response

            if(responseData.success){
                toast.success(responseData.message)
                if(close){
                    close()
                    reset()
                    fetchAddress()
                }
            }
        }catch(error){
            AxiosToastError(error)
        }

    }
  return (
    <section className='bg-black/70 fixed right-0 left-0 bottom-0 top-0 z-50 overflow-auto h-screen'>
        <div className='bg-white p-4 w-full max-w-md mt-8 mx-auto rounded'>
            <div className='flex justify-between items-center gap-3'>
                    <h1 className='font-semibold'>Edit Address</h1>
                    <button className='cursor-pointer hover:text-red-500' onClick={close}><IoClose size={25}/></button>
                </div>
                <form className='mt-4 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
                    <div className='grid gap-1'>
                    <label htmlFor='addressline'>Address Line :</label>
                    <input type="text" id='addressline' className='border bg-blue-50 p-2 rounded '
                    {...register('address_line',{required : true})}
                     />
                    </div>

                    <div className='grid gap-1'>
                    <label htmlFor='city'>City :</label>
                    <input type="text" id='city' className='border bg-blue-50 p-2 rounded '
                    {...register('city',{required : true})}
                     />
                    </div>

                    <div className='grid gap-1'>
                    <label htmlFor='state'>State :</label>
                    <input type="text" id='state' className='border bg-blue-50 p-2 rounded '
                    {...register('state',{required : true})}
                     />
                    </div>

                    <div className='grid gap-1'>
                    <label htmlFor='pincode'>Pincode :</label>
                    <input type="text" id='pincode' className='border bg-blue-50 p-2 rounded '
                    {...register('pincode',{required : true})}
                     />
                    </div>

                    <div className='grid gap-1'>
                    <label htmlFor='country'>Country :</label>
                    <input type="text" id='country' className='border bg-blue-50 p-2 rounded '
                    {...register('country',{required : true})}
                     />
                    </div>

                    <div className='grid gap-1'>
                    <label htmlFor='mobile'>Mobile No :</label>
                    <input type="text" id='mobile' className='border bg-blue-50 p-2 rounded '
                    {...register('mobile',{required : true})}
                     />
                    </div>
                    <button className='bg-[var(--color-primary-100)] hover:bg-yellow-500 w-full py-2 cursor-pointer rounded font-semibold' type='submit'>Update</button>

                </form>

        </div>

    </section>
  )
}

export default EditAddress