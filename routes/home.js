const express = require('express')
const router = express.Router()
const {handleHome} = require('../controllers/homeController')

router.get('/', handleHome)

module.exports = router