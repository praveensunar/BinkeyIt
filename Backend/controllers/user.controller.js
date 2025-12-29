import UserModel from '../Models/user.model.js'
import bcryptjs from 'bcryptjs'
import verifyEmailTamplate from '../utils/verifyEmailTemplate.js'
import sendEmail from '../config/sendEmail.js'
import dotenv from 'dotenv'
import generatedAccessToken from '../utils/generatedAccessToken.js'
import generatedRefreshToken from '../utils/generatedRefreshToken.js'
import uploadImageCloudinary from '../utils/uploadimageCloudinary.js'
import generatedOtp from '../utils/generatedOTP.js'
import forgotPasswordOtpTemplate from '../utils/forgotPasswordTemplate.js'
import { request, response } from 'express'
import jwt from 'jsonwebtoken'
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

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })
        
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
 // update user details 
 export async function updateUserDetails(request , response){
    try{
        const userId = request.userId // auth middleware
        const { name ,email,mobile,password} = request.body

        let hashPassword = ""
        if(password){
            const salt = await bcryptjs.genSalt(10)
            hashPassword = await bcryptjs.hash(password,salt)
        }
        
        const updateUser = await UserModel.updateOne({_id : userId},{
            ...(name && { name : name}),
            ...(email && { email : email}),
            ...(mobile && { mobile : mobile}),

            ...(password && { password : hashPassword })

        })
        return response.json({
            message : "Updated user Successfully",
            error :false,
            success : true,
            data : updateUser
        })

    }catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })  
    }
 }

 //Forgot password 

 export async function forgotPasswordController( request , response){
    try{
        const { email } = request.body
        const  user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
            message : "email not available",
            error : true,
            success : false 
        })
        } 
        
        const  otp = generatedOtp()
        const expireTime = new Date() + 60 * 60 * 1000 // expire in 1 hr
        const update = await UserModel.findByIdAndUpdate(user._id,{
            forgot_passsword_otp : otp,
            forgot_passsword_expiry : new Date(expireTime).toISOString()
        })

        await sendEmail({
            sendTo : email,
            subject : "forget password from Blinkeyit",
            html : forgotPasswordOtpTemplate({
                name : user.name,
                otp : otp
            })
        })
        return response.json({
            message : "check your Email",
            error : false,
            success : true 
        })
    }catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false 
        })
    }
 }

 // Verify forgot password otp 
 export async function verifyForgotPasswordOtp( request , response){
    try{
        const { email ,otp } = request.body

        if(!email || !otp){
            return response.status(400).json({
                message : "Provide requied field email , otp",
                error : true,
                success : false
            })
        }
        
        const user = await UserModel.findOne({ email })

        if(!user){
            return response.status(400).json({
                message : "Email not Available",
                error : true,
                success : false
            })
        }

        const currentTime = new Date().toISOString()
        if(user.forgot_passsword_expiry < currentTime){
            return response.status(400).json({
                message : "OTP is Expired",
                error : true,
                success : false
            })
        }

        if(otp !== user.forgot_passsword_otp){
            return response.status(400).json({
                message : "Invaild otp",
                error : true,
                success : false
            })
        }
        const updateUser = await UserModel.findByIdAndUpdate(user._id,{
            forgot_passsword_otp : "",
            forgot_passsword_expiry : ""
        })

        return response.json({
            message : "Verify otp successfully",
                error : false,
                success : true
        })


    }catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
 }

// reset password 

export async function resetPassword(request ,response){
    try{
        console.log("BODY =>", request.body);
        const { email , newPassword ,confirmPassword } = request.body
         
        if(!email || !newPassword || !confirmPassword){
            return response.status(400).json({
                message : " provide required fields email , newPassword , ConfirmPassword"
            })
            
        }

        const user = await UserModel.findOne({ email })
        if(!user){
            return response.status(400).json({
                message : "Email is not Available",
                error : true,
                success :  false
            })
        }

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message : "newPassword and confirmPassword Must be Same.",
                error : true,
                success : false
            })
        }
        const salt = await bcryptjs.genSalt(10)
        const hashPassword = await bcryptjs.hash(newPassword,salt)
        const update = await UserModel.findByIdAndUpdate(user._id,{
            password :hashPassword 
        })
        return response.json({
            message : "Password updated Successfully",
            error : false,
            success : true
        })
    }catch(error){
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }

}

// refresh token  controler 

export async function refreshToken(request, response) {
  try {
    const refreshToken =
      request.cookies?.refreshToken ||
      request.headers?.authorization?.split(" ")[1];

    if (!refreshToken) {
      return response.status(401).json({
        message: "Invalid or missing refresh token",
        error: true,
        success: false
      });
    }

    console.log("refreshToken =>", refreshToken);

    // TODO: verify token here (jwt.verify)

    const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)

    if(!verifyToken){
        return response.status(401).json({
            message : "token is expired",
            error : true,
            success : false
        })
    }

    console.log("verify Token",verifyToken)
    const userId = verifyToken?._id

    const newAccessToken = await generatedAccessToken(userId)
    const cookiesOption ={
        httpOnly : true,
        secure : true,
        sameSite : "None"
    }

    response.cookie('accessToken',newAccessToken,cookiesOption)
    return response.json({
      message: "new Access Token Generated",
      error: false,
      success: true,
      data : {
        accesstoken : newAccessToken
      }
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

//get login user details
export async function userDetails(request,response){
    try{
        const userId = request.userId

        const user = await UserModel.findById(userId).select('-password -refresh_Token')

        return response.json({
            message : 'user details',
            data : user,
            error : false,
            success : true
        })
    } catch(error){
        return response.status(500).json({
            message : "Something is Wrong",
            error : true,
            success : false
        })
    }
}
