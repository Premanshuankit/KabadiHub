const mongoose = require('mongoose')
const logger = require('../utils/logger')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            // useUnifiedTopology: true,
            // useNewUrlParser: true
        },
        // console.log('coeecnted to MONGODB')
    )
    } catch (error) {
        console.error("MongoDB connection error:", error.message)
        logger.info(error.message)
        process.exit(1)
    }
}

module.exports = connectDB