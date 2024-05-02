const router = require("express").Router()
const UserModel = require("../models/User")
const unAuthChecker = require("../middlewares/unAuthChecker")
const jwt = require("jsonwebtoken")
const { JWT_KEY } = require("../keys")
const sendMail = require("../middlewares/sendMail")
const CompanyModel = require("../models/Company")

router.post("/login", unAuthChecker, (req, res) => {
    const { email, password } = req.body
    if(!email || !password){
        return res.status(401).json({msg: "Complete all input"})
    }
    UserModel.findOne({email}).then((foundUser) => {
        const { id } = foundUser
        if(!foundUser.active) {
            return res.status(401).json({msg: "This account is not active"})
        }
        if(foundUser.tried >= 3) {
            return res.status(401).json({msg: "This account is blocked"})
        }
        if(foundUser.password == password) {
            jwt.sign({id}, JWT_KEY, (err, token) => {
                if(err){ 
                    return res.status(500).json({msg: "Something went wrong"})
                }
                res.status(200).json({token})
            })
        }else{
            UserModel.findByIdAndUpdate(id, {tried: (foundUser.tried + 1)}).then(() => {
                res.status(401).json({msg: "Email or password is wrong"})
            }).catch((err) => {
                res.status(401).json({msg: "Email or password is wrong."})
            })
        }
    }).catch((err) => {
        res.status(401).json({msg: "Email or password is wrong"})
    })
})

router.post("/signup", (req, res) => {
    console.log(req.body)
    const {firstName, lastName, email, password, company} = req.body 
    if(!firstName || !lastName || !email || !password){
        return res.status(401).json({msg: "Complete all input"})
    }
    UserModel.findOne({email: email}).then((foundUser) => {
        if(foundUser) {
            return res.status(401).json({msg: "This account is already registed"})
        }
        

        const verCode = `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`
        sendMail(email, verCode)

        if(company && comType && comTel) {
            const comp = new CompanyModel({
                name: company,
                type: comType,
                tel: comTel,
                owner: req.userId
            })

            comp.save().then(() => {
                res.status
            })
        }

        const user = new UserModel(company ? {
            firstName,
            lastName,
            email,
            company,
            password,
            verCode
        } : 
        {
            firstName,
            lastName,
            email,
            password,
            verCode
        })

        user.save().then(() => {
            res.status(200).json({msg: "Saved successful"})
        })
    })
    
})

router.post("/verify", (req, res) => {
    const { id, code } = req.query
    if(!code || !id){
        return res.status(401).json({msg: "id and code is required"})
    }
    UserModel.findById(id).then((user) => {
        if(user.verCode == code) {
            UserModel.findByIdAndUpdate(id, {active: true, verCode: -1}).then(() => {
                res.status(200).json({msg: "Your account is activeted"})
            }).catch((err) => {
                res.status(500).json({msg: "Something went wrong"})
            })
        }else{
            res.status(400).json({msg: "Your verCode is wrong"})
        }
    }).catch((err) => {
        res.status(404).json({msg: "Not found"})
    })
})

// router.post("/recovery", () => {
//     const { email, vercode, id }
// })

module.exports = router