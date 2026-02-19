const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        match: /^[0-9]{10}$/
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        }
    },
    roles: {
        type: Map,
        of: Number,
        default: { Seller: 1984 }
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: { flattenMaps: true },
    toObject: { flattenMaps: true }
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel

