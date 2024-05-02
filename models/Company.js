const { model, Schema } = require("mongoose")
const { ObjectId } = Schema.Types

const companySchema = new Schema({ 
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: false
    },
    tel: {
        type: String,
        required: true
    }, 
    owner: {
        type: ObjectId,
        ref: "User"
    }
})

module.exports = model("Company", companySchema)