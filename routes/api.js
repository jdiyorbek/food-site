const router = require("express").Router()
const ProductModel = require("../models/Product")
const BlogModel = require("../models/Blog")

router.get("/products", async (req, res) => {
    try {
        let type = req.query.type || "All"
        const page = parseInt(req.query.page) - 1 || 0
        const limit = parseInt(req.query.limit) || 5
        const search = req.query.search || ""

        const typeOption = [
			"fruit",
			"vegetable"
		];

        type === "All" ? (
            type = [...typeOption]
        ) : (
            type = req.query.type.split(",")
        )

            

        const response = await ProductModel
            .find({
                type: {$in: [...type]},
                name: {$regex: search, $options: 'i'}
            },)
            .skip(page * limit)
            .limit(limit)
            .then(products => {
                return products
            }).catch(err => {
                res.status(500).json({msg: err})
            })
        
        res.status(200).json({response})
    }catch(err){
        res.status(500).json({msg: "Internal Server Error"})
    }
})


router.get("/blog", async(req, res) => {
    try{
        const { id } = req.query
        if(id){
            const response = await BlogModel.findById(id).populate("owner", "firstName lastName company").then((product) => {
                return product
            }).catch(err => {
                return err
            })
            res.status(200).json({response})
        }else{
            const response = await BlogModel.find(id).populate("owner", "firstName lastName company").then((products) => {
                return products
            }).catch(err => {
                return err
            })
            res.status(200).json({response})
        }
    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Interval Server Error"})
    }
})

module.exports = router