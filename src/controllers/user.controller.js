import { asyncHandler } from '../utils/asyncHandler.js'
import { UserValidator } from '../utils/userValidation.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'

//All User Controllers
const registerUser = asyncHandler(async (req, res) => {
  
  // get user details from frontend
  const { username, password, email, fullName } = await req.body;
  
  // validation 
  const result = UserValidator.safeParse({ username, password, email, fullName })
  if (!result.success) {
    throw new ApiError(400, result.error.errors);
  }
  
  // check if user already exists: username, email
  const existingUser = User.findOne({
    $or: [{ username }, { email }]
  })
  
  if(existingUser) {
    throw new ApiError(409, "User already exists");
  }
  
  // check if avatar is sent
  const avatarLocalPath = await req.files?.avatar[0]?.path
  
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

export { registerUser }