import React, { useState } from 'react'
import banner from '../assets/banner.jpg'
import bannerMobile from '../assets/banner-mobile.jpg'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { Link, useNavigate } from 'react-router-dom'
import CategoryWiseProductDisplay from '../Components/CategoryWiseProductDisplay'

const Home = () => {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const navigate = useNavigate()

  const handleRedirectProductList = (id, cat) => {
    console.log("category:", id, cat)

    const subcategory = subCategoryData.find(sub => {
      const filterData = sub.category.some(c => {
        return c._id == id
      })
      return filterData ? true : null

    })
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
    navigate(url)

  }
  return (

    <section className='bg-white'>
      <div className='container mx-auto'>
        <div className={`w-full h-full  bg-blue-50 min-h-48 rounded ${!banner && "animate-pulse"}`}>
          <img src={banner} alt="Banner" className='w-full h-full hidden lg:block' />

          <img src={bannerMobile} alt="Banner" className='w-full h-full lg:hidden' />

        </div>

        <div className='container mx-auto grid grid-cols-5 lg:grid-cols-10 md:grid-cols-8 gap-2'>

          {
            loadingCategory ? (
              new Array(20).fill(null).map((c, index) => {
                return (
                  <div key={index + "loadingCagtegory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                    <div className='bg-blue-100 min-h-20 rounded'></div>
                    <div className='bg-blue-100 h-8 rounded'></div>
                  </div>
                )
              })
            ) :
              (
                categoryData.map((cat, index) => {
                  return (
                    <div key={cat._id + "displayCategory"} className='w-full h-full' onClick={() => handleRedirectProductList(cat._id, cat.name)}>
                      <div>
                        <img src={cat.image}
                          className='w-full object-scale-down'
                        />
                      </div>
                    </div>
                  )
                })

              )
          }
        </div>
      </div>
      {/* display category product */}
      {
        categoryData.map((c, index) => {
          return (
            <CategoryWiseProductDisplay key={c?._id + "categorywishProduct"} id={c?._id} name={c?.name} />

          )
        })
      }


    </section>
  )
}

export default Home