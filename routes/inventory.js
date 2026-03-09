const express = require('express')
const router = express.Router()

const verifyJwt = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../config/roles_list')
const {completeOrder, sellToFactory, getInventory} = require('../controllers/inventoryController')

router.get('/', verifyJwt, getInventory)
router.post('/:orderId', verifyJwt, verifyRoles(ROLES_LIST.Buyer), completeOrder)
router.post('/:id/toFactory', verifyJwt, verifyRoles(ROLES_LIST.Buyer), sellToFactory)

module.exports = router