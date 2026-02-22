const express = require('express')
const router = express.Router()

const verifyJwt = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../config/roles_list')
const {createOrder} = require('../controllers/orderPlacedController')

router.post('/:sellRequestId', verifyJwt, verifyRoles(ROLES_LIST.Seller, ROLES_LIST.Buyer), createOrder)

module.exports = router