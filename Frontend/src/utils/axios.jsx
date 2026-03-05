import axios from "axios";
import summaryApi, { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL: baseURL,
    withCredentials: true
})

Axios.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accessToken")

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)


Axios.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        let originRequest = error.config

        if (error.response?.status === 401 && !originRequest.retry && !originRequest.url.includes('/api/user/refresh-token')) {
            originRequest.retry = true

            const refreshToken = localStorage.getItem("refreshToken")

            if (refreshToken) {
                const newAccessToken = await refreshAccessToken(refreshToken)

                if (newAccessToken) {
                    originRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return Axios(originRequest)
                }
            }
        }

        return Promise.reject(error)
    }
)

const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await Axios({
            ...summaryApi.resfreshToken,
            headers: {
                Authorization: `Bearer ${refreshToken}`
            }
        })
        const accessToken = response?.data?.data?.accessToken
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken)
        }
        return accessToken

    } catch (error) {
        console.log("Error in refreshAccessToken", error)
    }
}

export default Axios