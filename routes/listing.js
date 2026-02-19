const express = require('express')
const router = express.Router()
const { createListing, getAllListing, updateListing } = require('../controllers/scrapListing')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../config/roles_list')
const verifyJwt = require('../middleware/verifyJWT')

router.post('/', verifyJwt, verifyRoles(ROLES_LIST.Buyer), createListing)
router.get('/', verifyJwt, verifyRoles(ROLES_LIST.Buyer), getAllListing)
router.put('/:id', verifyJwt, verifyRoles(ROLES_LIST.Buyer), updateListing)

module.exports = router