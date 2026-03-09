const Order = require('../model/OrderPlaced')
const Inventory = require('../model/Inventory')
const logger = require('../utils/logger')

const getInventory = async (req, res) => {

  try {

    const buyerId = req.userId
    console.log('buyerId from getInventory', buyerId)

    const inventory = await Inventory.find({ buyerId })
      .select("scrapType totalQuantity averageCostPrice").lean()

    res.json(inventory)

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch inventory" })
  }

}

const completeOrder = async (req, res) => {
  try {

    const { orderId } = req.params
    const buyerId = req.user.id   // safer than req.userId

    const order = await Order.findById(orderId)

    if (!order)
      return res.status(404).json({ message: "Order not found" })

    if (order.status !== "SCHEDULED")
      return res.status(400).json({ message: "Order already processed" })

    // ensure buyer owns the order
    if (order.buyerId.toString() !== buyerId)
      return res.status(403).json({ message: "Unauthorized" })

    let inventory = await Inventory.findOne({
      buyerId,
      scrapType: order.scrapType
    })

    // create inventory if not exists
    if (!inventory) {
      inventory = new Inventory({
        buyerId,
        scrapType: order.scrapType,
        totalQuantity: 0,
        averageCostPrice: 0,
        movements: []
      })
    }

    const newTotalQty = inventory.totalQuantity + order.quantity

    const newAvg =
      ((inventory.totalQuantity * inventory.averageCostPrice) +
        (order.quantity * order.agreedRate)) / newTotalQty

    inventory.totalQuantity = newTotalQty
    inventory.averageCostPrice = newAvg

    inventory.movements.push({
      type: "IN",
      quantity: order.quantity,
      rate: order.agreedRate,
      totalAmount: order.totalAmount,
      partyId: order.sellerId,
      orderId: order._id
    })

    await inventory.save()

    order.status = "COMPLETED"
    await order.save()

    res.json({
      message: "Order completed & inventory updated",
      inventory
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}


// const completeOrder = async (req, res) => {

//     const { orderId } = req.params
//     const buyerId = req.userId

//     const order = await Order.findById(orderId)
//     console.log('order', order)
//     logger.info(`order, ${order}`)
//     if (!order || order.status !== 'SCHEDULED')
//         return res.status(400).json({ message: "Invalid order" })

//     let inventory = await Inventory.findOne({
//         buyerId,
//         scrapType: order.scrapType
//     })

//     if (!inventory) {
//         inventory = await Inventory.create({
//             buyerId,
//             scrapType: order.scrapType,
//             totalQuantity: 0,
//             averageCostPrice: 0
//         })
//     }

//     // Calculate new average cost
//     const newTotalQty = inventory.totalQuantity + order.quantity

//     const newAvg =
//         ((inventory.totalQuantity * inventory.averageCostPrice) +
//         (order.quantity * order.agreedRate))
//         / newTotalQty

//     inventory.totalQuantity = newTotalQty
//     inventory.averageCostPrice = newAvg

//     inventory.movements.push({
//         type: 'IN',
//         quantity: order.quantity,
//         rate: order.agreedRate,
//         totalAmount: order.totalAmount,
//         partyId: order.sellerId
//     })

//     await inventory.save()

//     order.status = 'COMPLETED'
//     await order.save()

//     res.json({ message: "Order completed & inventory updated" })
// }

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



module.exports = { getInventory, completeOrder, sellToFactory }
