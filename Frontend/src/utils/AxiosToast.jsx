import toast from "react-hot-toast"

const AxoisToastError = (error)=>{

    toast.error(
        error?.response?.data?.message
    )
}


export default AxoisToastError
