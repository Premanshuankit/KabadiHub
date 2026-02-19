require('dotenv').config()
const express = require('express')
const app = express()

const routerRegister = require('./routes/register')
const routerAuth = require('./routes/auth')
const routerListing = require('./routes/listing')
// const routerRefresh = require('./routes/api/refresh')
// const routerLogout = require('./routes/api/logout')
const verifyJwt = require('./middleware/verifyJWT')
// const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')

// connect to DB
connectDB()

app.use(express.json())
// app.use(cookieParser())

app.use('/register', routerRegister)
app.use('/auth', routerAuth)
app.use('/listing', routerListing)
// app.use('/refresh', routerRefresh)
// app.use('/logout', routerLogout)

app.use(verifyJwt)

const PORT = process.env.PORT || 3000
mongoose.connection.once('open', () => {
    console.log('connected to DB from server.js')

    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`)
    })
})
