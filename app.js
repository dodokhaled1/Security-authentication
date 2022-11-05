require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const session = require('express-session') 
const passport = require('passport')

const app = express()

app.use(session({
    secret: 'This is our little secret',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

const routes = require('./server/routers/user')
app.use('/', routes)

app.listen('8000', ()=>{
    console.log('Server is running on port 8000')
})