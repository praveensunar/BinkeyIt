import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import UploadImage from '../utils/UploadImage'
import toast from 'react-hot-toast'
import Axios from '../utils/axios'
import summaryApi from '../common/SummaryApi'
import AxoisToastError from '../utils/AxiosToast'

const UploadCategoryModel = ({ close, fetchData }) => {
  const [data, setData] = useState({
    name: '',
    image: ''
  })

  const [loading, setLoading] = useState(false)

  // 🔹 Input change
  const handleOnchange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // 🔹 Image upload
  const handleUploadCategoryImage = async (e) => {
    const file = e.target.files[0]
    if (!file || loading) return

    try {
      setLoading(true)
      const res = await UploadImage(file)

      if (!res || res.status !== 200) {
        toast.error(res?.data?.message || 'Image upload failed')
        return
      }

      setData((prev) => ({
        ...prev,
        image: res.data.data.url
      }))
    } catch (error) {
      toast.error('Image upload failed')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Submit category
  const handleSubmit = async (e) => {
    e.preventDefault()

    // ✅ Validation FIRST
    if (!data.name || !data.image) {
      toast.error('Name and Image are required')
      return
    }

    try {
      setLoading(true)

      const response = await Axios({
        ...summaryApi.addCategory,
        data
      })

      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || 'Category added successfully')
        setData({ name: '', image: '' })
        fetchData()
        close()
      }
    } catch (error) {
      AxoisToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="fixed inset-0 p-4 bg-neutral-800/60 flex justify-center items-center z-50">
      <div className="bg-white max-w-4xl w-full p-4 rounded shadow-lg">
        {/* Header */}
        <div className="flex items-center mb-3">
          <h1 className="font-semibold text-lg">Add Category</h1>
          <button onClick={close} className="ml-auto">
            <IoClose size={25} />
          </button>
        </div>

        {/* Form */}
        <form className="grid gap-4" onSubmit={handleSubmit}>
          {/* Category Name */}
          <div className="grid gap-1">
            <label htmlFor="categoryName">Name</label>
            <input
              className="bg-blue-50 p-2 border rounded border-blue-100 focus:border-[var(--color-primary-200)] outline-none"
              type="text"
              id="categoryName"
              placeholder="Enter category name"
              value={data.name}
              name="name"
              onChange={handleOnchange}
            />
          </div>

          {/* Image Upload */}
          <div className="grid gap-1">
            <label>Image</label>
            <div className="flex gap-4 flex-col lg:flex-row items-center">
              <div className="border bg-blue-50 h-36 w-full lg:w-36 flex items-center justify-center rounded">
                {data.image ? (
                  <img
                    src={data.image}
                    alt="category"
                    className="w-full h-full object-scale-down"
                  />
                ) : (
                  <p className="text-sm text-neutral-500">No Image</p>
                )}
              </div>

              <label htmlFor="uploadCategoryImage">
                <div
                  className={`${
                    !data.name
                      ? 'bg-gray-300'
                      : 'border-[var(--color-primary-200)] hover:bg-[var(--color-primary-100)]'
                  } border rounded px-4 py-2 cursor-pointer font-medium`}
                >
                  {loading ? 'Loading...' : 'Upload Image'}
                </div>

                <input
                  disabled={!data.name || loading}
                  onChange={handleUploadCategoryImage}
                  type="file"
                  id="uploadCategoryImage"
                  className="hidden"
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading || !data.name || !data.image}
            className={`${
              data.name && data.image
                ? 'bg-[var(--color-primary-100)] hover:bg-[var(--color-primary-200)]'
                : 'bg-gray-300'
            } py-2 rounded font-semibold`}
          >
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default UploadCategoryModel
