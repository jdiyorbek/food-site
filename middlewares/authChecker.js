const jwt = require("jsonwebtoken")
const { JWT_KEY } = require("../keys")
const UserSchema = require("../models/User")

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ err: "You dont have account" })
    }
    const token = authorization
    jwt.verify(token, JWT_KEY, (err, payload) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ err: "You don't have account" })
        }

        const { id } = payload
        UserSchema.findById(id)
            .then((userData) => {
                req.userId = userData._id
                req.user = userData
                next()
            })
            .catch((err) => {
                res.status(404).json({msg: "Not found"})
            })
    })
}