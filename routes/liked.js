const router = require("express").Router()
const LikedModel = require("../models/Liked")
const authChecker = require("../middlewares/authChecker")

router.get("/", authChecker, (req, res) => {
    const { id } = req.query
    if(!id){
        LikedModel.find({owner: req.userId}).then((products) => {
            if(!products) {
                return res.status(404).json({msg: "Not found"})
            }
            res.status(200).json({products})
        }).catch((err) => {
            res.status(500).json({msg: "Something went wrong"})
        })
    }else{
        LikedModel.findOne({product: id, owner: req.userId}).then((product) => {
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

    LikedModel.findById(id).then((likedProduct) => {
        if(likedProduct){
            return res.status(401).json({msg: "It's already in the liked box"})
        }
        const liked = new LikedModel({
            product: id,
            owner: req.userId
        })
    
        liked.save().then(() => {
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
    LikedModel.findOneAndDelete({product: id, owner: req.userId}).then((foundProduct) => {
        if(!foundProduct){
            return res.status(404).json({msg: "Not found"})
        }
        res.status(200).json({msg: "The liked product deleted"})
    }).catch((err) => {
        console.log(err)
        res.status(500).json({msg: "Something went wrong"})
    })
})

module.exports = router