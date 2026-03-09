const mongoose = require("mongoose");
const Order = require("../model/OrderPlaced");
const SellRequest = require("../model/SellRequest");
const ScrapListing = require("../model/ScrapListing");
const Inventory = require("../model/Inventory");

const createOrder = async (req, res) => {

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    const buyerId = req.userId;
    const { sellRequestId } = req.params;

    if (!sellRequestId) {
      return res.status(400).json({
        message: "sellRequestId is required"
      });
    }

    /* ---------------- FIND SELL REQUEST ---------------- */

    const sellRequest = await SellRequest
      .findById(sellRequestId)
      .session(session);

    if (!sellRequest) {
      return res.status(404).json({
        message: "Sell request not found"
      });
    }

    /* ----------- VERIFY BUYER OWNS THIS REQUEST ----------- */

    if (sellRequest.buyerId.toString() !== buyerId) {
      return res.status(403).json({
        message: "You are not authorized to accept this request"
      });
    }

    if (sellRequest.status !== "OPEN") {
      return res.status(400).json({
        message: "Sell request already processed"
      });
    }

    /* -------- VERIFY BUYER STILL BUYING THIS SCRAP -------- */

    const listing = await ScrapListing.findOne({
      buyerId,
      scrapType: sellRequest.scrapType,
      isActive: true
    }).session(session);

    if (!listing) {
      return res.status(400).json({
        message: "You are not buying this scrap type"
      });
    }

    const agreedRate = listing.ratePerKg;
    const totalAmount = agreedRate * sellRequest.quantity;

    /* ---------------- CREATE ORDER ---------------- */

    const order = await Order.create(
      [{
        sellRequestId: sellRequest._id,
        buyerId,
        sellerId: sellRequest.sellerId,
        scrapType: sellRequest.scrapType,
        quantity: sellRequest.quantity,
        agreedRate,
        totalAmount,
        status: "COMPLETED" // inventory updated instantly
      }],
      { session }
    );

    /* ------------- UPDATE SELL REQUEST ------------- */

    sellRequest.status = "ACCEPTED";
    await sellRequest.save({ session });

    /* ---------------- UPDATE INVENTORY ---------------- */

    let inventory = await Inventory.findOne({
      buyerId,
      scrapType: sellRequest.scrapType
    }).session(session);

    if (!inventory) {

      inventory = new Inventory({
        buyerId,
        scrapType: sellRequest.scrapType,
        totalQuantity: 0,
        averageCostPrice: 0,
        movements: []
      });

    }

    const newTotalQty =
      inventory.totalQuantity + sellRequest.quantity;

    const newAvgPrice =
      (
        (inventory.totalQuantity * inventory.averageCostPrice) +
        (sellRequest.quantity * agreedRate)
      ) / newTotalQty;

    inventory.totalQuantity = newTotalQty;
    inventory.averageCostPrice = newAvgPrice;

    inventory.movements.push({
      type: "IN",
      quantity: sellRequest.quantity,
      rate: agreedRate,
      totalAmount,
      partyId: sellRequest.sellerId
    });

    await inventory.save({ session });

    /* ---------------- COMMIT TRANSACTION ---------------- */

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Order created & inventory updated successfully",
      data: order[0]
    });

  } catch (error) {

    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      return res.status(409).json({
        message: "Order already exists for this sell request"
      });
    }

    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const getBuyerOrders = async (req, res) => {
  try {
    const buyerId = req.userId;
    const { status } = req.query; // optional filter

    const filter = { buyerId };

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("sellerId", "firstname shopname mobile")
      .sort({ createdAt: -1 });

    return res.json(orders);

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.userId;
    const { status } = req.query; // optional filter

    const filter = { sellerId };

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("buyerId", "firstname shopname mobile")
      .sort({ createdAt: -1 });

    return res.json(orders);

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { createOrder, getBuyerOrders, getSellerOrders };
