const Order = require('../model/OrderPlaced')
const Inventory = require('../model/Inventory')
const logger = require('../utils/logger')

// const completeOrder = async (req, res) => {
//     try {

//         const { orderId } = req.params
//         const buyerId = req.userId

//         const order = await Order.findById(orderId)

//         if (!order) {
//             return res.status(404).json({
//                 message: "Order not found"
//             })
//         }

//         // Ensure only buyer who created order can complete it
//         if (order.buyerId.toString() !== buyerId) {
//             return res.status(403).json({
//                 message: "Not authorized / different buyer"
//             })
//         }

//         if (order.status !== 'SCHEDULED') {
//             return res.status(400).json({
//                 message: "Order cannot be completed"
//             })
//         }

//         // Update inventory

//         const existingInventory = await Inventory.findOne({
//             buyerId,
//             scrapType: order.scrapType
//         })

//         if (existingInventory) {

//             // Calculate new average cost
//             const newTotalQuantity =
//                 existingInventory.totalQuantity + order.quantity

//             const newAverageCost =
//                 (
//                     (existingInventory.totalQuantity * existingInventory.averageCostPrice) +
//                     (order.quantity * order.agreedRate)
//                 ) / newTotalQuantity

//             existingInventory.totalQuantity = newTotalQuantity
//             existingInventory.averageCostPrice = newAverageCost

//             await existingInventory.save()

//         } else {

//             await Inventory.create({
//                 buyerId,
//                 scrapType: order.scrapType,
//                 totalQuantity: order.quantity,
//                 averageCostPrice: order.agreedRate
//             })
//         }

//         // Update order status
//         order.status = 'COMPLETED'
//         await order.save()

//         return res.json({
//             message: "Order completed and inventory updated successfully"
//         })

//     } catch (error) {
//         return res.status(500).json({
//             message: "Server error",
//             error: error.message
//         })
//     }
// }

const completeOrder = async (req, res) => {

    const { orderId } = req.params
    const buyerId = req.userId

    const order = await Order.findById(orderId)
    console.log('order', order)
    logger.info(`order, ${order}`)
    if (!order || order.status !== 'SCHEDULED')
        return res.status(400).json({ message: "Invalid order" })

    let inventory = await Inventory.findOne({
        buyerId,
        scrapType: order.scrapType
    })

    if (!inventory) {
        inventory = await Inventory.create({
            buyerId,
            scrapType: order.scrapType,
            totalQuantity: 0,
            averageCostPrice: 0
        })
    }

    // Calculate new average cost
    const newTotalQty = inventory.totalQuantity + order.quantity

    const newAvg =
        ((inventory.totalQuantity * inventory.averageCostPrice) +
        (order.quantity * order.agreedRate))
        / newTotalQty

    inventory.totalQuantity = newTotalQty
    inventory.averageCostPrice = newAvg

    inventory.movements.push({
        type: 'IN',
        quantity: order.quantity,
        rate: order.agreedRate,
        totalAmount: order.totalAmount,
        partyId: order.sellerId
    })

    await inventory.save()

    order.status = 'COMPLETED'
    await order.save()

    res.json({ message: "Order completed & inventory updated" })
}

const sellToFactory = async (req, res) => {
    try {

        const buyerId = req.userId
        const { id } = req.params   // 👈 inventory id from URL
        const { quantity, sellingRate, factoryName } = req.body

        if (!id || !quantity || !sellingRate || !factoryName) {
            return res.status(400).json({
                message: "Inventory ID, quantity, sellingRate and factoryName are required"
            })
        }

        const inventory = await Inventory.findById(id)

        if (!inventory) {
            return res.status(404).json({
                message: "Inventory not found"
            })
        }

        // 🔐 Ensure buyer owns this inventory
        if (inventory.buyerId.toString() !== buyerId) {
            return res.status(403).json({
                message: "Not authorized"
            })
        }

        if (inventory.totalQuantity < quantity) {
            return res.status(400).json({
                message: "Insufficient stock"
            })
        }

        const totalAmount = sellingRate * quantity

        // Deduct stock
        inventory.totalQuantity -= quantity

        // Add movement
        inventory.movements.push({
            type: 'OUT',
            quantity,
            rate: sellingRate,
            totalAmount,
            partyName: factoryName
        })

        await inventory.save()

        return res.json({
            message: "Sold to factory successfully",
            remainingStock: inventory.totalQuantity
        })

    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message
        })
    }
}



module.exports = { completeOrder, sellToFactory }
