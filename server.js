require('dotenv').config()

const express = require('express')
const app = express()
const routes = require('./routes.js')
const path = require('path')
const ejs = require('ejs')
const mongoose = require('mongoose')
const helmet = require('helmet')
const csrf = require('csurf')
const middlewares = require('./src/middlewares/middleware.js')

mongoose.set("strictQuery", false)
mongoose.connect(process.env.connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('conect db')
        app.emit('ok')
    })
    .catch(e => console.log(e))

const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')

app.use(helmet())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.resolve(__dirname, 'public')))

const sessionOptions = session({
    secret: 'aaa',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24*7,
        httpOnly: true
    },
    store: MongoStore.create({ mongoUrl: process.env.connectionString})
})

app.use(sessionOptions)
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(csrf())

app.use(middlewares.middlewareGlobal)
app.use(middlewares.checkError)
app.use(middlewares.csrfMid)

app.use(routes)

app.on('ok', () =>{
    app.listen(8080, () => { console.log('http://localhost:8080') })
}) 
