const SellRequest = require('../model/SellRequest')

const createSellRequest = async ({ sellerId, scrapType, quantity }) => {

    const sellRequest = await SellRequest.create({
        sellerId,
        scrapType: scrapType.trim().toLowerCase(),
        quantity,
        // pickupAddress,
        status: 'OPEN'
    })

    return sellRequest
}

module.exports = { createSellRequest }

