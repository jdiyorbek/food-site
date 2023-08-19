module.exports = (to, code) => {
    const nodemailer = require("nodemailer")

    const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: "jdiyorbek16092005@gmail.com",
            pass: "kbhcngxbgabkqyht"
        }
    })

    const optionMailer = {
        from: "jdiyorbek16092005@gmail.com",
        to: to,
        subject: "Verification code",
        text: `Your code: ${code}`
    }

    return transporter.sendMail(optionMailer, (err, info) => {
        if(err){
            console.log(err)
        }else{
            console.log(info)
        }
    })
}