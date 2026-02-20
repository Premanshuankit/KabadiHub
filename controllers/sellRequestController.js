const sellRequestService = require('../services/sellRequestService')

const createSellRequest = async (req, res) => {
    try {

        const sellerId = req.userId   // from verifyJwt

        // const { scrapType, quantity, pickupAddress } = req.body
        const { scrapType, quantity } = req.body

        if (!scrapType || !quantity) {
            return res.status(400).json({
                message: "scrapType, quantity are required"
            })
        }

        if (quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be greater than 1"
            })
        }

        const sellRequest = await sellRequestService.createSellRequest({
            sellerId,
            scrapType,
            quantity
        })

        res.status(201).json({
            message: "Sell request created successfully",
            data: sellRequest
        })

    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

module.exports = { createSellRequest }
