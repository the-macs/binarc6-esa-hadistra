require('dotenv').config()

const port = 3000

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const session = require('express-session')

const { MemoryStore } = require('express-session')
const sessionStorage = new MemoryStore()

const indexRoute = require('./src/routes/index.route')

const secret = 'jakut-klonop-2022'

const reroute = require('./src/middlewares/reroute.middleware')

// Untuk return json / API
// app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.set('view engine', 'ejs')
app.use(express.static('public'))

app.set('views', './src/views')

app.use(expressLayouts)

app.use(session({
    secret: process.env.JWT_SECRET || secret, // salt
    resave: false,
    store: sessionStorage,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 10000
    }
}))

// Routee
app.use(indexRoute)

app.use(reroute.escape404)
// Running Server
app.listen(process.env.PORT || port, () => {
    console.log('Server Running ...')
})