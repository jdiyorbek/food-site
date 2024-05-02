const jwt = require("jsonwebtoken")
const JWT_KEY = require("../keys")

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    // const decoded = jwt.verify(JWT_KEY, authorization)
    // console.log(decode)
    if(authorization){
        return res.status(200).json({msg: "You have account"})
    }
    next()
}