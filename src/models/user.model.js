import { Schema, model } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
  username: {
    type: String,
    requied: true,
    unique: true,
    lowercase: [true, "Username should be in lowercase"],
    trim: true,
    index: true,
  },
  email: {
    type: String,
    requied: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullName: {
    type: String,
    requied: true,
    trim: true,
  },
  // phoneNumber: {
  //   type: Number,
  //   requied: true,
  //   unique: true,
  // },
  avatar: {
    type: String,
    requied: false,
  },
  buyHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    }
  ],
  password: {
    type: String,
    requied: [true, "Password is requied"],
  },
  refreshToken: {
    type: String,
  }
}, {
  timestamps: true
})

userSchema.pre("save", async function(next) {
  if(!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
  return jwt.sign({
    _id: this._id,
    email: this.email,
    username: this.username,
    fullName: this.fullName,
    role: 'User'
  },
  process.env.ACCESS_TOKEN_SECRET,
  {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  })
}

userSchema.methods.generateRefreshToken = function() {
  return jwt.sign({
    _id: this._id,
  },
  process.env.REFRESH_TOKEN_SECRET,
  {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  })
}

export const User = model("User", userSchema);