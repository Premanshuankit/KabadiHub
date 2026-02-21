const mongoose = require('mongoose')
const SCRAP_TYPES = require('../config/scrapTypes')

const scrapListingSchema = new mongoose.Schema(
    {
        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        scrapType: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            enum: SCRAP_TYPES.map(item => item.type)
        },

        ratePerKg: {
            type: Number,
            required: true,
            min: 0
        },

        // minimumQuantity: {
        //     type: Number,
        //     required: true,
        //     min: 1
        // },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

const scrapListingModel = mongoose.model('ScrapListing', scrapListingSchema)

module.exports = scrapListingModel
