import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { priceWithDiscount } from '../utils/PriceWithDiscount'
const CardProduct = ({ data }) => {
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`

  return (
    <Link
      to={url}
      className="border rounded min-w-36 lg:min-w-52 
                 h-[260px] lg:h-[320px] 
                 flex flex-col p-2 lg:p-4 cursor-pointer bg-white"
    >
      {/* Image */}
      <div className="h-20 lg:h-32 flex items-center justify-center overflow-hidden">
        <img
          src={data.image[0]}
          alt={data.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Badge */}
      <div className='flex items-center gap-1'>
        <div className="bg-green-50 text-green-600 rounded text-xs px-2 w-fit mt-2">
        10 min
      </div>
      <div>
          {
          Boolean(data.discount) && (
            <p className='text-green-700 bg-green-100 px-2 w-fit text-xs mt-2 rounded'>{data.discount}% Discount</p>
          )
        }
        </div>
      </div>

      {/* Name */}
      <div className="font-medium text-sm lg:text-base line-clamp-2 mt-1">
        {data.name}
      </div>

      {/* Unit */}
      <div className=" w-fit gap-1 px-2 lg:text-base text-sm text-gray-500 line-clamp-2">
        {data.unit}
        
      </div>

      {/* Price + Button (Stick to Bottom) */}
      <div className=" px-2 lg:px-0 mt-auto flex items-center justify-between gap-1 lg:gap-3 text-sm lg:text">
        <div className='flex items-center gap-1'>
          <div className="font-semibold">
          {DisplayPriceInRupees(priceWithDiscount(data.price,data.discount))}
        </div>
        
        </div>
        <div className=''>
          {
            data.stock == 0 ?(
              <p className='text-sm text-red-500 text-centre' >Out of Stack</p>
            ):(
              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
          Add
        </button>
            )
          }
        
        </div>
      </div>
    </Link>
  )
}

export default CardProduct