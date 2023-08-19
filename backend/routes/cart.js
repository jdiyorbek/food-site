const router = require("express").Router()
const CartModel = require("../models/Cart")
const authChecker = require("../middlewares/authChecker")

router.get("/", authChecker, (req, res) => {
    const { id } = req.query
    if(!id){
        CartModel.find({owner: req.userId})
        .populate("owner", "_id, email")
        .populate("product", "_id, name, price,, quantity").then((products) => {
            if(!products) {
                return res.status(404).json({msg: "Not found"})
            }
            res.status(200).json({products})
        }).catch((err) => {
            res.status(500).json({msg: "Something went wrong"})
        })
    }else{
        CartModel.findOne({product: id, owner: req.userId})
        .populate("owner", "_id, email")
        .populate("product", "_id, name, price,, quantity").then((product) => {
            if(!product) {
                return res.status(404).json({msg: "Not found"})
            }
            res.status(200).json({product})
        }).catch((err) => {
            res.status(500).json({msg: "Something went wrong"})
        })
    }
})

router.post("/add", authChecker, (req, res) => {
    const { id } = req.query
    if(!id){
        return res.send({msg: "Id is undefined"})
    }

    CartModel.findById(id).then((addedProduct) => {
        if(addedProduct){
            return res.status(401).json({msg: "It's already in the cart"})
        }
        const addedCart = new CartModel({
            product: id,
            owner: req.userId
        })
    
        addedCart.save().then(() => {
            res.status(200).json({msg: "Saved succesful"})
        }).catch((err) => {
            res.status(500).json({msg: "Something went wrong"})
        })
    }).catch((err) => {
        res.status(500).json({msg: "Something went wrong"})
    })

    
})

router.delete("/", authChecker, (req, res) => {
    const { id } = req.query
    if(!id){
        return res.send({msg: "Id is undefined"})
    }
    CartModel.findOneAndRemove({product: id, owner: req.userId}).then((foundProduct) => {
        console.log(foundProduct)
        res.status(200).json({msg: "The product deleted"})
    }).catch((err) => {
        res.status(500).json({msg: "Something went wrong"})
    })
})

module.exports = router