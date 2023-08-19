const express = require("express")
const app = express()
const mongoose = require("mongoose")
const { MONGO_KEY } = require("./keys")

mongoose.connect(MONGO_KEY)
mongoose.connection.on("connected", () => {
    console.log("Mongo OK")
})
mongoose.connection.on("error", () => {
    console.log("Mongo X")
})

app.use(express.json())

app.use("/auth", require("./routes/auth"))
app.use("/admin", require("./routes/admin"))
app.use("/liked", require("./routes/liked"))
app.use("/cart", require("./routes/cart"))
app.use("/api", require("./routes/api"))

app.listen(5000, () => {
    console.log("Running")
})