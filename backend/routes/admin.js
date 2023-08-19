const router = require("express").Router()
const ProductModel = require("../models/Product")
const BlogModel = require("../models/Blog")
const authChecker = require("../middlewares/authChecker")

router.get("/products", authChecker, (req, res) => {
    const { company } = req.user
    if(!company) {
        return res.status(401).json({msg: "You can't create product because you don't have company"})
    }
    ProductModel.find({owner: req.userId}).populate("owner", "_id, email").then((products) => {
        res.status(200).json({products})
    }).catch((err) => {
        res.status(500).json({msg: "Something went wrong"})
    })
})

router.post("/products/add", authChecker, (req, res) => {
    const { name, quantity, price, type } = req.body
    const { company } = req.user
    if(!company) {
        return res.status(401).json({msg: "You can't create product because you don't have company"})
    }
    if(!name || !quantity || !price || !type){
        return res.status(401).json({msg: "Complete all input"})
    }

    const product = new ProductModel({
        name,
        quantity,
        price,
        type,
        company,
        owner: req.userId
    })

    product.save().then(() => {
        res.status(201).json({msg: "Published successful"})
    }).catch((err) => {
        console.log(err)
        res.status(500).json({msg: "Something went wrong"})
    })
})

router.get("/product", authChecker, (req, res) => {
    const { company } = req.user
    const { id } = req.query
    if(!company) {
        return res.status(401).json({msg: "You can't create product because you don't have company"})
    }
    if(!id){
        return res.status(401).json({msg: "req.query is undefined"})
    }
    ProductModel.findOne({_id: id, owner: req.userId, company: req.user.company}).populate("owner", "_id, company").populate("company", "_id, name").then(product => {
        res.status(200).json({product})
    }).catch(err => {
        console.log(err)
        res.status(500).json({msg: "Something went wrong"})
    })
})

router.put("/product", authChecker, (req, res) => {
    const { company } = req.user
    const { id } = req.query
    const { name, quantity, price } = req.body
    if(!company) {
        return res.status(401).json({msg: "You can't create product because you don't have company"})
    }
    if(!id){
        return res.status(401).json({msg: "req.query is undefined"})
    }
    if(!name || !quantity || !price){
        return res.status(401).json({msg: "Complete all input"})
    }
    ProductModel.findOneAndUpdate({_id: id, owner: req.userId, company: req.user.company}, { name, quantity, price }).populate("owner", "_id, email, company").then(product => {
        res.status(200).json({product})
    }).catch(err => {
        res.status(500).json({msg: "Something went wrong"})
    })
})

router.delete("/product", authChecker, (req, res) => {
    const { company } = req.user
    const { id } = req.query
    if(!company) {
        return res.status(401).json({msg: "You can't create product because you don't have company"})
    }
    if(!id){
        return res.status(401).json({msg: "req.query is undefined"})
    }
    ProductModel.findByIdAndDelete({_id: id, owner: req.userId, company: req.user.company}).then((foundProduct) => {
        console.log(foundProduct)
        res.status(200).json({msg: "The product deleted"})
    }).catch((err) => {
        res.status(500).json({msg: "Something went wrong"})
    })
})

router.get("/blog", authChecker, async(req, res) => {
    try{
        const { id } = req.query
        const { company } = req.user
        if(!company) {
            return res.status(401).json({msg: "You can't create product because you don't have company"})
        }
        if(id){
            const response = await BlogModel.findOne({_id: id, owner: req.userId}).then((product) => {
                return product
            }).catch(err => {
                return err
            })
            res.status(200).json({response})
        }else{
            const response = await BlogModel.find({owner: req.userId}).then((products) => {
                return products
            }).catch(err => {
                return err
            })
            res.status(200).json({response})
        }
    }catch(err){
        res.status(500).json({msg: "Interval Server Error"})
    }
})

router.post("/blog", authChecker, async(req, res) => {
    try{
        const { title, text } = req.body
        const { company } = req.user
        if(!company) {
            return res.status(401).json({msg: "You can't create product because you don't have company"})
        }
        if(!title || !text ){
            return res.status(401).json({msg: "Complete all input"})
        }
        await BlogModel.create({
            title,
            text,
            owner: req.userId
        }).then(() => {
            res.status(200).json({msg: "Saved"})
        }).catch((err) => {
            res.status(500).json({msg: err})
        })
    }catch(err){
        res.status(500).json({msg: "Interval Server Error"})
    }
})

router.put("/blog", authChecker, async(req, res) => {
    try{
        const { title, text } = req.body
        const { company } = req.user
        const { id } = req.query
        if(!company) {
            return res.status(401).json({msg: "You can't create product because you don't have company"})
        }
        if(!id){
            return res.status(500).json({msg: "Id is not defined"})
        }
        if(!title || !text ){
            return res.status(401).json({msg: "Complete all input"})
        }
        await BlogModel.findOneAndUpdate({_id: id, owner: req.userId}, {
            title,
            text
        }).then(() => {
            res.status(200).json({msg: "Updated"})
        }).catch((err) => {
            res.status(500).json({msg: err})
        })
    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Interval Server Error"})
    }
})

router.delete("/blog", authChecker, async(req, res) => {
    try{
        const { company } = req.user
        const { id } = req.query
        if(!company) {
            return res.status(401).json({msg: "You can't create product because you don't have company"})
        }
        if(!id){
            return res.status(500).json({msg: "Id is not defined"})
        }
        await BlogModel.findOneAndRemove().then(() => {
            res.status(200).json({msg: "Deleted"})
        }).catch((err) => {
            res.status(500).json({msg: err})
        })
    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Interval Server Error"})
    }
})


module.exports = router