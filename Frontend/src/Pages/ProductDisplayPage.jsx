import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import summaryApi from '../common/SummaryApi'
import Axios from '../utils/axios'
import AxiosToastError from '../utils/AxiosToast'
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../Components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { priceWithDiscount } from '../utils/PriceWithDiscount'

const ProductDisplayPage = () => {
  const { product } = useParams()
  const productId = product?.split('-').pop()

  const [data, setData] = useState({
    name: '',
    image: [],
  })
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)

  const imageContainer = useRef(null)

  const fetchProductDetails = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...summaryApi.getProductDetails,
        data: { productId },
      })

      if (response?.data?.success) {
        setData(response.data.data)
        setActiveImage(0)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (productId) fetchProductDetails()
  }, [productId])

  const handleScrollRight = () => {
    imageContainer.current.scrollBy({ left: 220, behavior: 'smooth' })
  }

  const handleScrollLeft = () => {
    imageContainer.current.scrollBy({ left: -220, behavior: 'smooth' })
  }

  if (loading) {
    return <div className="text-center p-10">Loading...</div>
  }

  return (
    <section className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-white">
      {/* LEFT SECTION */}
      <div>
        {/* MAIN IMAGE */}
        {data.image?.length > 0 && (
          <div className="w-full min-h-56 max-h-56 lg:min-h-[65vh] lg:max-h-[65vh]">
            <img
              src={data.image[activeImage]}
              alt={data.name}
              className="w-full h-full object-scale-down"
            />
          </div>
        )}

        {/* DOT INDICATOR */}
        <div className="flex justify-center gap-3 mt-4">
          {data.image?.map((_, index) => (
            <div
              key={index}
              onClick={() => setActiveImage(index)}
              className={`w-3 h-3 rounded-full cursor-pointer ${
                index === activeImage ? 'bg-slate-400' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        {/* THUMBNAILS */}
        <div className="relative mt-4">
          <div
            ref={imageContainer}
            className="flex gap-3 sm:gap-4 overflow-x-scroll scrollbar-none scroll-smooth px-8"
          >
            {data.image?.map((img, index) => (
              <div
                key={index}
                onClick={() => setActiveImage(index)}
                className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                  cursor-pointer rounded border shadow
                  ${
                    index === activeImage
                      ? 'border-green-500'
                      : 'border-transparent'
                  }`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ))}
          </div>

          {/* LEFT ARROW */}
          <button
            onClick={handleScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2
              bg-white p-2 rounded-full shadow z-20 hover:bg-gray-100"
          >
            <FaAngleLeft />
          </button>

          {/* RIGHT ARROW */}
          <button
            onClick={handleScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2
              bg-white p-2 rounded-full shadow z-20 hover:bg-gray-100"
          >
            <FaAngleRight />
          </button>
        </div>

        {/* DESCRIPTION */}
        <div className="my-4 grid gap-3">
          <div>
            <p className="font-semibold">Description</p>
            <p>{data.description}</p>
          </div>
          <div>
            <p className="font-semibold">Unit</p>
            <p>{data.unit}</p>
          </div>

          {data?.more_details &&
            Object.keys(data.more_details).map((key, index) => (
              <div key={index}>
                <p className="font-semibold">{key}</p>
                <p>{data.more_details[key]}</p>
              </div>
            ))}
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="p-4 lg:pl-7">
        <p className="bg-green-400 w-fit rounded-full px-3 py-1 text-sm">
          10 Min
        </p>

        <h2 className="text-2xl font-semibold mt-2">{data.name}</h2>
        <p>{data.unit}</p>

        <Divider />

        <p>Price</p>
        <div className="flex items-center gap-4 mt-2">
          <div className="border border-green-500 px-4 py-2 rounded bg-green-50">
            <p className="font-semibold text-xl">
              {DisplayPriceInRupees(
                priceWithDiscount(data.price, data.discount)
              )}
            </p>
          </div>

          {data.discount > 0 && (
            <>
              <p className="line-through">
                {DisplayPriceInRupees(data.price)}
              </p>
              <p className="text-green-600 font-semibold">
                {data.discount}% OFF
              </p>
            </>
          )}
        </div>

        {data.stock === 0 ? (
          <p className="text-red-500 my-4">Out of Stock</p>
        ) : (
          <button className="my-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded">
            Add
          </button>
        )}

        <h2 className="font-semibold mt-6">Why shop from binkeyit?</h2>

        {[image1, image2, image3].map((img, i) => (
          <div key={i} className="flex gap-4 my-4">
            <img src={img} alt="" className="w-20 h-20" />
            <div className="text-sm">
              <p className="font-semibold">
                {i === 0
                  ? 'Round The Clock Delivery'
                  : i === 1
                  ? 'Best Prices & Offers'
                  : 'Wide Assortment'}
              </p>
              <p>
                {i === 0
                  ? 'Get items delivered anytime.'
                  : i === 1
                  ? 'Best prices directly from manufacturers.'
                  : 'Choose from thousands of products.'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProductDisplayPage
