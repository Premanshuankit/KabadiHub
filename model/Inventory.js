const mongoose = require('mongoose')
const SCRAP_TYPES = require('../config/scrapTypes')

// const inventorySchema = new mongoose.Schema(
//     {
//         buyerId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User',
//             required: true
//         },

//         scrapType: {
//             type: String,
//             required: true,
//             trim: true,
//             lowercase: true,
//             enum: SCRAP_TYPES.map(item => item.type)
//         },

//         totalQuantity: {
//             type: Number,
//             required: true,
//             min: 0,
//             default: 0
//         },

//         averageCostPrice: {
//             type: Number,
//             required: true,
//             min: 0,
//             default: 0
//         }
//     },
//     {
//         timestamps: true
//     }
// )

const inventorySchema = new mongoose.Schema({

    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    scrapType: {
        type: String,
        required: true,
        lowercase: true
    },

    totalQuantity: {
        type: Number,
        default: 0
    },

    averageCostPrice: {
        type: Number,
        default: 0
    },

    movements: [
        {
            type: {
                type: String,
                enum: ['IN', 'OUT'],  // IN = purchase, OUT = factory sale
                required: true
            },
            quantity: Number,
            rate: Number,
            totalAmount: Number,
            partyId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            partyName: String,
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]

}, { timestamps: true })


// Prevent duplicate inventory per buyer per scrapType
inventorySchema.index({ buyerId: 1, scrapType: 1 }, { unique: true })

module.exports = mongoose.model('Inventory', inventorySchema)
