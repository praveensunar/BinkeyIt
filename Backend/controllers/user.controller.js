import UserModel from '../Models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTamplate from '../utils/verifyEmailTemplate.js'
import sendEmail from '../config/sendEmail.js'
import dotenv from 'dotenv'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import generatedRefreshToken from '../utils/generatedRefreshToken.js'
import uploadImageCloudinary from '../utils/uploadimageCloudinary.js'
dotenv.config()
// register new user
export async function registerUserController(request , response){
    try{
        console.log("BODY ===> ",request.body)
        const { name, email, password} = request.body || {};
        if(!name || !email || !password){
            return response.status(400).json({
                message : "provide email ,name ,password",
                error : true,
                success: false
            })

        }

    const user = await UserModel.findOne({email})

    if(user){
        return response.json({
            message : "Already register email",
            error : true,
            success : false 
            })
        }

        //password is converting into hashpassword for security 
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(password,salt)

        const  payload = {
            name,
            email,
            password : hashPassword
        }

        //save the new user data in userModel
        const newUser = new UserModel(payload)
        const save = await newUser.save()
        
        //sending  verify mail  tamplate to new register user
        const verifyemailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`

        const verifyEmail = await sendEmail({
            sendTo : email,
            subject : "verify email from binkeyit",
            html : verifyEmailTamplate({
                name,
                url : verifyemailUrl
            })
        })

        return response.json({
            message : "User Register Successfully",
            error : false,
            success : true,
            data : save
        })
    }
catch (error){
    return response.status(500).json({
        message : error.message || error,
        error : true,
        success : false
    })
}
}

//verifying email
export async function  verifyEmailcontroller(request,response){
    try{
        const {code} = request.body

        const  user = await UserModel.findOne({_id : code})

        if(user){
            return response.status(400).json({
                message : " invalid code",
                error : true,
                success : false
            })
        }
    const updateUser = await UserModel.updateOne({_id : code},{verify_email : true })
    return response.json({
        message : "verify  email done",
        error : false,
        success : true
    })

    }catch(error){
        return response.status(500).json({
            message : error .message || error,
            error : true,
            success : true
        })
    }
}

//login controller 
export async function loginController(request , response){
    try{
        const { email ,password } = request.body
        if(!email || !password){
            return response.status(400).json({
                message : "provide Email and Password.",
                error : true,
                success : false
            })
        }

        //checking the email is register or not

        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "User not Register",
                error : true,
                success : false
            })
        }

        //checking the user Account is Active or not
        if(user.status !== "Active"){
            return response.status(400).json({
                message : "Contect to Admin",
                error : true,
                success : false
            }) 
        }

        const checkPassword = await bcryptjs.compare(password ,user.password)

        if(!checkPassword){
            return response.status(400).json({
                message : "check your Password",
                error : true,
                success : false
            }) 
        }
        const accesstoken = await generatedAccessToken(user._id)
        const refreshtoken = await generatedRefreshToken(user._id)

        
        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        response.cookie('accessToken',accesstoken,cookiesOption)
        response.cookie('refreshToken',refreshtoken,cookiesOption)

        return response.json({
            message : "Login Successfully",
            error : false,
            success : true,
            data : {
                accesstoken,
                refreshtoken
            }
        })

    }catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false

        })
    }
}

//logout controller

export async function logoutController(request , response){
    try{
        const userid = request.userId // middleware
        const cookiesOption = {
            httpOnly : true,
            secure : true,
            sameSite : "None"
        }
        response.clearCookie("accessToken",cookiesOption)
        response.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userid,{
            refresh_Token : ""
        })

        return response.json({
            message : "Logout Successfully",
            error : false,
            success : true,
        })

    }catch(error){
        return response.status(500).json({
            message: error.message  || error,
            error : true,
            success : false
        })
    }
}

//upload user avatar 
export async function uploadAvatar(request,response){
    try{
       const userId = request.userId // auth middleware

        const image = request.file // multer middleware

         

        if(!image){
             return response.status(400).json({
            message : "image not provided",
            error : true,
            success : false
        });
        }
         
        
      const upload = await uploadImageCloudinary(image)
      const updateUsar = await UserModel.findByIdAndUpdate(userId,{
            avatar : upload.url
        }
        )
      return response.json({
        message : "upload Profile successfully ",
        success : true,
        data : {
            _id : userId,
            avatar : upload.url
        }
      })

    }catch(error){
        console.log("UPLOAD AVATAR ERROR" ,error)

        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}