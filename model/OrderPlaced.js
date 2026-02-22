const mongoose = require('mongoose')
const SCRAP_TYPES = require('../config/scrapTypes')

const orderSchema = new mongoose.Schema(
    {
        sellRequestId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SellRequest',
            required: true
        },

        buyerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

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
            enum: SCRAP_TYPES.map(item => item.type)
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        agreedRate: {
            type: Number,
            required: true,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: ['SCHEDULED', 'COLLECTED', 'COMPLETED', 'CANCELLED'],
            default: 'SCHEDULED'
        }
    },
    {
        timestamps: true
    }
)

orderSchema.index({ sellRequestId: 1 }, { unique: true })

module.exports = mongoose.model('Order', orderSchema)
