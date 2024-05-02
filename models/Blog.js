const { model, Schema } = require("mongoose")
const { ObjectId } = Schema.Types

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    view: {
        type: Number,
        required: false,
        default: 0
    },
    publishedAt: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: ObjectId,
        ref: "User",
        required: true
    }
})

module.exports = model("Blog", blogSchema)