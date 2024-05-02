const { Schema, model } = require("mongoose")
const { ObjectId } = Schema.Types

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    company: {
        type: ObjectId,
        ref: "Company",
        required: true
    },
    owner: {
        type: ObjectId,
        ref: "User",
        required: true
    }
})

module.exports = model("Product", productSchema)