const express = require('express');
const router = express.Router();
const { usersController } = require('../controllers')

router.get('/get-users', usersController.getDataUsers)
router.post('/add', usersController.addUsers)
router.patch('/update/:id', usersController.editUsers)

module.exports = router