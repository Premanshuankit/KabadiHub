const express = require('express')
const router = express.Router()
const { createListing, getAllListing, getAllListingByBuyerId, updateListing, createAllListing } = require('../controllers/scrapListing')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../config/roles_list')
const verifyJwt = require('../middleware/verifyJWT')

router.post('/', verifyJwt, verifyRoles(ROLES_LIST.Buyer), createListing)
router.get('/', verifyJwt, verifyRoles(ROLES_LIST.Buyer), getAllListing)
router.get('/:buyerId', verifyJwt, verifyRoles(ROLES_LIST.Buyer), getAllListingByBuyerId)
router.put('/:id', verifyJwt, verifyRoles(ROLES_LIST.Buyer), updateListing)
router.post('/createAllListing', verifyJwt, verifyRoles(ROLES_LIST.Buyer), createAllListing)

module.exports = router