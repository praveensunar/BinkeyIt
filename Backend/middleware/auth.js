import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const auth = async (request, response, next) => {
  try {
    const token =
      request.cookies.accessToken ||
      request?.headers?.authorization?.split(" ")[1]

    if (!token) {
      return response.status(401).json({
        message: "You have Not Login",
        error: true,
        success: false
      })
    }

    const decode = jwt.verify(
      token,
      process.env.SECRET_KEY_ACCESS_TOKEN
    )

    request.userId = decode.id
    next()

  } catch (error) {
    return response.status(401).json({
      message: "You have Not Login",
      error: true,
      success: false
    })
  }
}

export default auth