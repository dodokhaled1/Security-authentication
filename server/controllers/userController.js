const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const findOrCreate = require('mongoose-findorcreate')

mongoose.connect('mongodb://localhost:27017/userDB') 

const userSchema = new mongoose.Schema({
    username: String, 
    password: String,
    googleId: String,
    secret: String
})
userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

const User = new mongoose.model('Users', userSchema)
passport.use(User.createStrategy())

passport.serializeUser(function(user, done){
    done(null, user.id)
})
passport.deserializeUser(function(id, done){
    User.findById(id, (err, user)=>{
        done(err, user)
    })
})
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://localhost:8000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user)
    })
  }
))
exports.view = ("/", (req, res) => {
    res.render("../views/home")
})
exports.googleAuth = passport.authenticate('google', {scope: ["profile"]})

exports.authSecrets = passport.authenticate('google',
 {failureRedirect: ["../views/login"]}, (req, res)=>{
    res.redirect("../views/secrets")
})
exports.loginpage = ("/login", (req, res) => {
    res.render("../views/login")
})
exports.register = ("/register", (req, res) => {
     res.render("../views/register")
})
exports.secrets = ("/secrets", (req, res)=>{
  User.find({"secret": {$ne: null}}, (err, foundUsers)=>{
    if (err) throw err
      if (foundUsers) {
        console.log(foundUsers);
        res.render("../views/secrets", {usersWithSecrets: foundUsers})
      }
   })
})
exports.addUser = ("/register", (req, res)=>{
    User.register({username: req.body.username}, req.body.password,
         (err, newuser)=>{
        if(err){
        console.log(err)
        res.redirect("../views/register")
        } else { 
            passport.authenticate("local") (req, res, ()=>{
               res.redirect("/secrets")
           })
        }
    })
})
exports.login = ('/login', (req, res)=>{
    const user = new User({
        username: req.body.username,
        password: req.body.password
     })
      req.login(user, (err)=>{
        if (err) throw err
         passport.authenticate("local")(req, res, ()=>{
          res.redirect('/secrets')
         })
     })
 })
exports.getToSecret = ('/submit', (req, res)=>{
      if (req.isAuthenticated()){
        res.render("../views/submit")
      } else {
        res.redirect("/login")
      }
    })
exports.submit = ("/submit", (req, res)=>{
      const submittedSecret = req.body.secret
        User.findById(req.user.id, (err, foundUser)=>{
          if (err) throw err
            if (foundUser) {
              foundUser.secret = submittedSecret
              foundUser.save(()=>{
                res.redirect("/secrets")
              })
            }
         })
      })
exports.logout = ("/logout", (req, res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  })
})







    /*bcrybt.hash(req.body.password, saltRounds, (err, hash)=> {
        const newUser = new User({
            email: req.body.email,
            password: hash
        })
         newUser.save((err)=>{
            if(err) throw err
             res.render('../views/secrets')   
        })
    })
    const email = req.body.email
  const password = req.body.password
    User.findOne({email: email}, (err, finduser)=>{
        if(err) throw err
        if(finduser){
            bcrybt.compare(password, finduser.password, function(err, result) {
                if(result){
                    res.render('../views/secrets')
                } 
            })
           }
        })*/