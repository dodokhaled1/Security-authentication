require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')

const app = express()

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

const routes = require('./server/routers/user')
app.use('/', routes)

app.listen('8000', ()=>{
    console.log('Server is running on port 8000')
})