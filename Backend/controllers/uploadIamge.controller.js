import uploadImageCloudinary from "../utils/uploadimageCloudinary.js"

const uploadImageController = async(request,response)=>{
    try{
        const file = request.file
        
        const uploadImage = await uploadImageCloudinary(file)

        return response.json({
            message : "upload done",
            data : uploadImage,
            error : false,
            success : true

        })
    }catch(error){
         return response.status(500).json({
            messsage : error.message || error,
            error : true,
            success : false
    })
    }
}

export default uploadImageController