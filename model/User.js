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
    shopname: {
        type: String,
        default: null,
        trim: true,
        minlength: 5
    },
    shopImage: {
        type: String,
        required: false,
        trim: true
    },
    rating: {
        average: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0
        }
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

userSchema.index({ firstname: 1 });
userSchema.index({ shopname: 1 });
userSchema.index({ "address.city": 1 });
userSchema.index({ "address.pincode": 1 });
userSchema.index({ "address.city": 1, "address.pincode": 1 });

const userModel = mongoose.model('User', userSchema)

module.exports = userModel

