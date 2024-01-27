import { Schema, model } from "mongoose"

const gameSchema = new Schema({
  name: {
    type: String,
    requied: true,
    unique: true,
    index: true,
  },
  description: {
    type: String,
    requied: true,
  },
  gameAvatar: {
    type: String,
    requied: true,
  },
  gameImages: [String],
  price: {
    type: Number,
    requied: true,
    default: 0,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  }
}, {
  timestamps: true
})

export const Game = model("Game", gameSchema)