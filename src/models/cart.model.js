import { Schema, model } from "mongoose"

const cartSchema = new Schema({
  items: [{
    type: Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  price: {
    type: Number,
    requied: true,
  }
}, {
  timestamps: true,
})

export const Cart = model("Cart", cartSchema)