import { Schema, model } from "mongoose";

const orderTypeSchema = new Schema({
  order: {
    type: Schema.Types.ObjectId,
    refPath: 'orderType'
  },
  orderType: {
    type: String,
    enum: ['Game', 'Cart']
  }
})

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderDetails: {
    type: orderTypeSchema,
    required: true,
  }
}, {
  timestamps: true,
})

export const Order = model("Order", orderSchema)