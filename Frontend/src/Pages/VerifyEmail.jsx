import React, { useEffect, useState } from 'react'
import Axios from '../utils/axios'
import summaryApi from '../common/SummaryApi'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const VerifyEmail = () => {
    const [loading, setLoading] = useState(true)
    const location = useLocation()
    const navigate = useNavigate()

    const verifyEmail = async () => {
        try {
            setLoading(true)
            const urlParams = new URLSearchParams(location.search)
            const code = urlParams.get('code')

            if (!code) {
                toast.error("Invalid verification link")
                navigate("/login")
                return
            }

            const response = await Axios({
                ...summaryApi.verifyEmail,
                data: { code }
            })

            if (response.data.success) {
                toast.success(response.data.message)
                navigate("/login")
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        verifyEmail()
    }, [location.search])

    return (
        <div className='flex items-center justify-center min-h-[70vh]'>
            {loading ? (
                <div className='flex flex-col items-center gap-3'>
                    <div className='w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin'></div>
                    <p className='text-lg font-semibold'>Verifying your email...</p>
                </div>
            ) : (
                <p className='text-lg'>Email verification process complete.</p>
            )}
        </div>
    )
}

export default VerifyEmail
