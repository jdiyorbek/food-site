const { model, Schema } = require("mongoose")
const { ObjectId } = Schema.Types

const userSchema = new Schema({ 
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    company: {
        type: ObjectId,
        ref: "Company",
        required: false
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    tried:{
        type: Number,
        required: true,
        default: 0
    },
    verCode: Number
})

module.exports = model("User", userSchema)