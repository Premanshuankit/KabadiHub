const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            // useUnifiedTopology: true,
            // useNewUrlParser: true
        },
        // console.log('coeecnted to MONGODB')
    )
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB