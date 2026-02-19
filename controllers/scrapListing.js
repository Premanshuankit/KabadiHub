const ScrapListing = require('../model/ScrapListing')

const createListing = async (req, res) => {
    try {
        // Get buyerId from authenticated user
        const buyerId = req.userId
        console.log("buyerId:", buyerId)

        const { scrapType, ratePerKg } = req.body
        // const { scrapType, ratePerKg, minimumQuantity } = req.body

        // Basic validation
        if (!scrapType || !ratePerKg) {
            return res.status(400).json({
                message: "scrapType, ratePerKg are required"
            })
        }

        if (ratePerKg <= 0) {
            return res.status(400).json({
                message: "ratePerKg must be greater than 0"
            })
        }

        // Check if buyer already has listing for this scrapType
        const match = await ScrapListing.findOne({
            buyerId,
            scrapType: scrapType.toLowerCase()
        })

        if (match) {
            return res.status(409).json({
                message: "Listing for this scrap type already exists"
            })
        }

        const listing = await ScrapListing.create({
            buyerId,
            scrapType: scrapType.toLowerCase(),
            ratePerKg
        })

        return res.status(201).json({ message: "Listing created successfully", data: listing })

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message
        })
    }
}

const getAllListing = async (req, res) => {
    const allScrapListing = await ScrapListing.find()
    if (!allScrapListing) {
        return res.status(204).json({ 'messgae': 'no ScrapListing found'})
    }
    res.json(allScrapListing)
}

const updateListing = async (req, res) => {
    const { id } = req.params
    const { ratePerKg } = req.body
    if ( !id || !ratePerKg ) {
        return res.status(400).json({ 'message': 'ID parameter and ratePerKg is required'})
    }

    const listing = await ScrapListing.findById(id).exec()
    if (!listing) {
        return res.status(404).json({
            message: `No listing matches ID ${id}`
        })
    }
    // if (req.body?.ratePerKg) listing.ratePerKg = req.body.ratePerKg;
    listing.ratePerKg = ratePerKg
    const result = await listing.save()
    res.json(result);
}

module.exports = { createListing, getAllListing, updateListing } 
