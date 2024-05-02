const router = require("express").Router()
const authChecker = require("../middlewares/authChecker")
const UserModel = require("../models/User")
const CompanyModel = require("../models/Company")

router.get("/", authChecker,  async(req, res) => {
    const { id } = req.query
    if(id){
        UserModel.findById(id).then(user => {
            res.status(200).json({user})
        }).catch((err) => {
            res.status(404).json({msg: "Not found"})
        })
    }else{
        UserModel.findById(req.userId).then(user => {
            res.status(200).json({user})
        }).catch((err) => {
            res.status(404).json({msg: "Not found"})
        })
    }
})

router.post("/create-company", authChecker,  async(req, res) => {
    if(req.user.company){
        return res.status(401).json({msg: "You have company"})
    }
    const { name, tel, type } = req.body
    await CompanyModel.create({
            name,
            tel,
            type,
            owner: req.userId
        }).then(comp => {
            UserModel.findByIdAndUpdate(req.userId, {company: comp._id}).then(user => {
                res.status(200).json({msg: "Company was created"})
            }).catch(err => {
                res.status(500).json({msg: err})
            })
        })
})

module.exports = router