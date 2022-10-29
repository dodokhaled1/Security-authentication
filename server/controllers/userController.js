
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

mongoose.connect('mongodb://localhost:27017/userDB')

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})
userSchema.plugin(encrypt, {secret: process.env.SECRET,
     encryptedFields: ['password'] })

const User = new mongoose.model('Users', userSchema)

exports.view = ("/", (req, res) => {
    res.render("../views/home")
  })
exports.loginpage = ("/login", (req, res) => {
    res.render("../views/login")
  })
exports.register = ("/register", (req, res) => {
    res.render("../views/register")
  })
exports.addUser = ("/register", (req, res)=>{

    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    })
     newUser.save((err)=>{
        if(err) throw err
         res.render('../views/secrets')   
    })
})
exports.login = ('/login', (req, res)=>{
  const email = req.body.email
  const password = req.body.password
    User.findOne({email: email}, (err, finduser)=>{
        if(err) throw err
        if(finduser){
            console.log(JSON.stringify(finduser));
            if(finduser.password === password){
                console.log("success");
                res.render('../views/secrets')
            } 
        } 
    }) 
}) 