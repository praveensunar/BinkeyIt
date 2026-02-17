import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import AddAddress from '../Components/AddAddress'
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import EditAddress from '../Components/EditAddress';
import summaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import Axios from '../utils/axios';
import AxiosToastError from '../utils/AxiosToast';
import { useGlobalContext } from '../Proveider/GlobalProvider';

const Address = () => {
  const addressList = useSelector(state=>state.addresses.addressList)
  const [openAddress , setOpenAddress] = useState()
  const [openEdit ,setOpenEdit] = useState(false)
  const [editData , setEditData ] = useState({})
  const { fetchAddress } = useGlobalContext()

  const handleDisableAddress = async(_id)=>{
    try{
      const response = await Axios({
        ...summaryApi.disapleAddress,
        data :{
          _id : _id
        }
      })
      if(response.data.success){
        toast.success("removed Address")
        if(fetchAddress){
          fetchAddress()
        }
      }
    }catch(error){
      AxiosToastError(error)

    }
  }
  return (
    <section>
      <div className='bg-white shadow-md p-2 flex items-center justify-between'>
        <h2 className='font-semibold'>Address</h2>
        <button onClick={()=>setOpenAddress(true)} className='text-sm font-semibold border px-3 py-1 rounded hover:bg-[#FEBE05] cursor-pointer '>Add Address</button>
      </div>
      <div className='bg-blue-50 p-2 grid gap-4'>
                    {
                        addressList.map((address,index)=>{
                            return(
                            
                                <div key={address._id} className={`border rounded p-3 text-sm lg:text-md flex gap-3 bg-white ${!address.status && "hidden"}`}>  
                                    
                                    <div className='w-full'>
                                    <p>{address.address_line}</p>
                                    <p>{address.city}</p>
                                    <p>{address.state}</p>
                                    <p>{address.country} - {address.pincode}</p>
                                    <p>{address.mobile}</p>
                                    </div>

                                    <div className='flex items-start justify-center gap-4 '>
                                    <button onClick={()=>{setOpenEdit(true) ,setEditData(address)}}>
                                      <MdEdit size={20}className='hover:text-green-400 cursor-pointer'/>
                                    </button>

                                    <button onClick={()=>handleDisableAddress(address._id)} className='px-2'>
                                      <MdDelete size={20} className='hover:text-red-400 cursor-pointer'/>
                                    </button>
                                    </div>

                                </div>
                            )
                        })
                    }
                    <div onClick={()=>setOpenAddress(true)} className='h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer'>
                    Add Address
                    </div>
                </div>
                {
                  openAddress && (
                    <AddAddress close={()=>setOpenAddress(false)}/>
                  )
                }

                {
                  openEdit && (
                    <EditAddress data={editData} close={()=>setOpenEdit(false)} />
                  )
                }
                
    </section>
  )
}

export default Address