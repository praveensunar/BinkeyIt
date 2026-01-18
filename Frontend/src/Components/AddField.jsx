import React from 'react'
import { IoClose } from 'react-icons/io5'

const AddField = ({close ,value,onChange,submit}) => {
  return (
    <section className='fixed left-0 right-0 top-0 bottom-0 bg-neutral-900/70 z-50 flex justify-center items-center p-4'>
        <div className=' bg-white rounded p-4 w-full max-w-md'>
          <div className='flex items-center justify-between gap-3'>
            <h1 className='font-semibold'>Add Field</h1>
            <button onClick={close} className='hover:text-red-600 cursor-pointer'>                                               
            <IoClose size={25}/>
            </button>
          </div>

          <input 
          type="text" 
          className='bg-blue-50 my-3 w-full p-2 outline-none border focus-within:border-[var(--color-primary-100)]' 
          placeholder='Enter field name'
          value={value}
          onChange={onChange} />

            <button
            onClick={submit}
            className='bg-[var(--color-primary-200)] hover:bg-[var(--color-primary-100)]  px-4 py-2 rounded mx-auto w-fit block  '> Add Field</button>
        </div>

    </section>
  )
}

export default AddField