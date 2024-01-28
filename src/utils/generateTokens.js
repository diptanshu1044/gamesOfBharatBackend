import { User } from "../models/user.model.js"
import { ApiError } from "./ApiError.js"

const generateAccessAndRefreshToken = async(userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken

    //the option is requied otherwise we need to send the "requied" fields again
    await user.save({
      validateBeforeSave: false
    })

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, "Something went wrong while generating Access and Refresh Token")
  }
}

export { generateAccessAndRefreshToken }