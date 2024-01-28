import { asyncHandler } from '../utils/asyncHandler.js'
import { UserValidator } from '../utils/userValidation.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { generateAccessAndRefreshToken } from '../utils/generateTokens.js'
import fs from 'fs'

//All User Controllers



//Register User
const registerUser = asyncHandler(async (req, res) => {
  
  // get user details from frontend
  const { username, password, email, fullName } = req.body;
 
  // validation 
  const result = UserValidator.safeParse({ username, password, email, fullName })
  if (!result.success) {
    throw new ApiError(400, result.error.errors);
  }
  
  // check if user already exists: username, email
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  })
  
  if(existingUser) {
    fs.unlinkSync(req.file.path)
    throw new ApiError(409, "User already exists");
  }
  
  // check if avatar is sent
  const avatarLocalPath = req.file.path

  // cloudinary opeartions
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  
  // create user object - create db entry 
  const user = await User.create({
    username,
    fullName,
    email,
    avatar: avatar ? avatar.url : "",
    password
  })
  
  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select("-password -refreshToken")
  
  // check for user creation
  if(!createdUser) {
    throw new ApiError(500, "Something went wrong registering a user")
  }
  
  // return response
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered Successfully")
  )
})



//Login User
const loginUser = asyncHandler( async(req, res) => {
  // req.body -> data
  const { username, email, password } = req.body;

  // username/email based login
  if(!(username || email)) {
    throw new ApiError(400, "Email or username is requied")
  }

  // check if user exists: username
  const existingUser = await User.findOne({
    $or: [{username}, {email}]
  })

  if(!existingUser) {
    throw new ApiError(404, "User doesnt exist");
  }

  // check if password is correct
  const checkPassword = await existingUser.isPasswordCorrect(password)

  if(!checkPassword) {
    throw new ApiError(401, "Invalid User Credentials")
  }

  // access and refreshToken 
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser._id)

  // send cookies
  const loggedInUser = User.findById(existingUser._id).select("-password -refreshToken")
  const options = {
    httpOnly: true,
    secure: true,
  }

  //Final return
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
      }, "User logged in successfully")
    )
})



//Logout User
const logoutUser = asyncHandler( async(req, res) => {
  //remove refreshToken from DB
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    }
  )

  //remove refreshToken from cookies
  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, {}, "User Logged Out")
    )
})

export { registerUser, loginUser, logoutUser }