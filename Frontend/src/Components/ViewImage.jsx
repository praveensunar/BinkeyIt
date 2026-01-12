import React from 'react'
import { IoClose } from 'react-icons/io5'

const ViewImage = ({ url, close }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-3 sm:px-6">
      
      <div className="relative bg-amber-50 rounded-lg shadow-lg 
                      w-full sm:w-[90%] md:w-[70%] lg:w-[50%] 
                      max-h-[90vh] p-3 sm:p-4">

        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 
                     text-gray-700 hover:text-red-500"
        >
          <IoClose size={26} />
        </button>

        {/* Image */}
        <div className="flex items-center justify-center h-[70vh] sm:h-[75vh]">
          <img
            src={url}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-md"
          />
        </div>

      </div>
    </div>
  )
}

export default ViewImage
