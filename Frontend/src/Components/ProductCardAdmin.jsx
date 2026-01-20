import React from 'react'

const ProductCardAdmin = ({ data }) => {
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

</div>

  )
}

export default ProductCardAdmin