const Order = require('../model/OrderPlaced')
const SellRequest = require('../model/SellRequest')
const ScrapListing = require('../model/ScrapListing')

const createOrder = async (req, res) => {
    try {

        const buyerId = req.userId
        const { sellRequestId } = req.params

        if (!sellRequestId) {
            return res.status(400).json({
                message: "sellRequestId is required"
            })
        }

        // Find Sell Request
        const sellRequest = await SellRequest.findById(sellRequestId)
        
        console.log("sellRequestId:", sellRequestId)
        console.log("Type:", typeof sellRequestId)

        if (!sellRequest) {
            return res.status(404).json({
                message: "Sell request not found"
            })
        }

        // Ensure sell request is still OPEN
        if (sellRequest.status !== 'OPEN') {
            return res.status(400).json({
                message: "Sell request is not available"
            })
        }

        // Find buyer listing for same scrapType
        const listing = await ScrapListing.findOne({
            buyerId,
            scrapType: sellRequest.scrapType,
            isActive: true
        })

        if (!listing) {
            return res.status(400).json({
                message: "You are not buying this scrap type"
            })
        }

        // Calculate price
        const agreedRate = listing.ratePerKg
        const totalAmount = agreedRate * sellRequest.quantity

        // Create Order
        const order = await Order.create({
            sellRequestId: sellRequest._id,
            buyerId,
            sellerId: sellRequest.sellerId,
            scrapType: sellRequest.scrapType,
            quantity: sellRequest.quantity,
            agreedRate,
            totalAmount,
            status: 'SCHEDULED'
        })

        // Update sell request status
        sellRequest.status = 'ACCEPTED'
        await sellRequest.save()

        return res.status(201).json({
            message: "Order created successfully",
            data: order
        })

    } catch (error) {

        // Handle duplicate order (because of unique index)
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Order already exists for this sell request"
            })
        }

        return res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}

module.exports = { createOrder }
