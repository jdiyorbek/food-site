const router = require("express").Router()
const ProductSchema = require("../models/Product")
const authChecker = require("../middlewares/authChecker")

router.get("/", (req, res) => {
    res.status(200).json("get")
})

router.post("/add", authChecker, (req, res) => {
    const { name, quantity, price } = req.body
    // console.log(req.userId)
    if(!name || !quantity || !price){
        return res.status(401).json({msg: "Complete all input"})
    }

    const product = new ProductSchema({
        name,
        quantity,
        price,
        owner: req.userId
    })

    product.save().then(() => {
        res.status(200).json({msg: "Published successful"})
    }).catch((err) => {
        res.status(500).json({msg: "Something went wrong"})
    })
})

router.delete("/", (req, res) => {
    res.status(200).json("delete")
})

module.exports = router