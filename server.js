require('dotenv').config()
require('newrelic')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')

const corsOptions = require('./config/corsOptions')
const routerRegister = require('./routes/register')
const routerAuth = require('./routes/auth')
const routerListing = require('./routes/listing')
const routerSeller = require('./routes/sellRequest')
const routerOrder = require('./routes/orderPlaced')
const routerInventory = require('./routes/inventory')
// const routerRefresh = require('./routes/api/refresh')
// const routerLogout = require('./routes/api/logout')
const verifyJwt = require('./middleware/verifyJWT')
// const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')

// connect to DB
connectDB()

app.use(cors(corsOptions));
app.use(express.json())
// app.use(cookieParser())

app.use('/register', routerRegister)
app.use('/auth', routerAuth)
app.use('/listing', routerListing)
app.use('/seller', routerSeller)
app.use('/order', routerOrder)
app.use('/inventory', routerInventory)
// app.use('/refresh', routerRefresh)
// app.use('/logout', routerLogout)

app.use(verifyJwt)

const PORT = process.env.PORT || 3000
mongoose.connection.once('open', () => {
    console.log('connected to DB from server.js')
    logger.info('Database connected successfully relic message', {
        service: 'scrap-api',
        event: 'database_connection'
    })
    app.listen(PORT, () => {
        console.log(`listening to port ${PORT}`)
        logger.info(`Server started successfully relic message ${PORT}`)
    })
})
