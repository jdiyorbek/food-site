const { model, Schema } = require("mongoose")
const { ObjectId } = Schema.Types

const cartSchema = new Schema({ 
    product: {
        type: ObjectId,
        ref: "Product",
    },
    owner: {
        type: ObjectId,
        ref: "User",
    }
})

module.exports = model("Cart", cartSchema)