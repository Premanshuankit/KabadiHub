const mongoose = require('mongoose')
const SCRAP_TYPES = require('../config/scrapTypes')

const sellRequestSchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        scrapType: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            enum: SCRAP_TYPES
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        // pickupAddress: {
        //     type: String,
        //     required: true,
        //     trim: true
        // },

        status: {
            type: String,
            enum: ['OPEN', 'ACCEPTED', 'COLLECTED'],
            default: 'OPEN'
        }
    },
    {
        timestamps: true
    }
)

const sellRequestModel = mongoose.model('SellRequest', sellRequestSchema)

module.exports = sellRequestModel