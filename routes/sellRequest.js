const express = require('express')
const router = express.Router()

const verifyJwt = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')
const ROLES_LIST = require('../config/roles_list')
const {createSellRequest} = require('../controllers/sellRequestController')

router.post('/', verifyJwt, verifyRoles(ROLES_LIST.Seller), createSellRequest)

module.exports = router