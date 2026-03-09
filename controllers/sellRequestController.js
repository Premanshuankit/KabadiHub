const sellRequestService = require('../services/sellRequestService')
const SellRequest = require("../model/SellRequest");
const ScrapListing = require("../model/ScrapListing");
const logger = require('../utils/logger');
const mongoose = require('mongoose')

const createSellRequest = async (req, res) => {
    try {
      
        const sellerId = req.userId   // from verifyJwt
        const { scrapType, quantity, buyerId } = req.body
        console.log('sellerId', sellerId)
        console.log('scrapType', scrapType)
        console.log('quantity', quantity)
        console.log('buyerId', buyerId)

        if (!scrapType || !quantity || !buyerId) {
            return res.status(400).json({
                message: "scrapType, quantity and buyerId are required"
            })
        }

        if (quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be greater than 1"
            })
        }

        if (sellerId === buyerId) {
            return res.status(400).json({
                message: "You cannot sell to yourself",
            });
        }

        const sellRequest = await sellRequestService.createSellRequest({
            sellerId,
            buyerId,
            scrapType,
            quantity
        })
        logger.info('Sell request created successfully', sellRequest)
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

const getSellerRequests = async (req, res) => {
  try {
    const sellerId = req.userId;

    const requests = await SellRequest.find({ sellerId })
      .populate("buyerId", "firstname shopname mobile")
      .sort({ createdAt: -1 });

    console.log('sellerId from getSellerRequests', requests)
    return res.json(requests);

  } catch (error) {
    return res.status(500).json({
      message: "Server error getSellerRequests",
      error: error.message,
    });
  }
};

const getIncomingRequests = async (req, res) => {
  try {

    // const buyerId = req.userId;
    const buyerId = new mongoose.Types.ObjectId(req.userId);

    const requests = await SellRequest.aggregate([
      {
        $match: {
          buyerId: buyerId,
          status: "OPEN"
        }
      },

      // join seller details
      {
        $lookup: {
          from: "users",
          localField: "sellerId",
          foreignField: "_id",
          as: "seller"
        }
      },

      { $unwind: "$seller" },

      // join listing to get rate
      {
        $lookup: {
          from: "scraplistings",
          let: { scrapType: "$scrapType", buyerId: "$buyerId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$scrapType", "$$scrapType"] },
                    { $eq: ["$buyerId", "$$buyerId"] },
                    { $eq: ["$isActive", true] }
                  ]
                }
              }
            }
          ],
          as: "listing"
        }
      },

      { $unwind: { path: "$listing", preserveNullAndEmptyArrays: true } },

      // calculate total
      {
        $addFields: {
          ratePerKg: "$listing.ratePerKg",
          totalAmount: {
            $multiply: ["$quantity", "$listing.ratePerKg"]
          }
        }
      },

      {
        $project: {
          scrapType: 1,
          quantity: 1,
          status: 1,
          ratePerKg: 1,
          totalAmount: 1,
          "seller.firstname": 1,
          "seller.mobile": 1,
          createdAt: 1
        }
      },

      { $sort: { createdAt: -1 } }
    ]);

    res.json(requests);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

const rejectSellRequest = async (req, res) => {
  try {
    const buyerId = req.userId;
    const { id } = req.params;

    const sellRequest = await SellRequest.findById(id);

    if (!sellRequest) {
      return res.status(404).json({
        message: "Sell request not found",
      });
    }

    // Ensure only correct buyer can reject
    if (sellRequest.buyerId.toString() !== buyerId) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (sellRequest.status !== "OPEN") {
      return res.status(400).json({
        message: "Request already processed",
      });
    }

    sellRequest.status = "REJECTED";
    await sellRequest.save();

    return res.json({
      message: "Sell request rejected",
      data: sellRequest,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { createSellRequest, getSellerRequests, getIncomingRequests, rejectSellRequest }
