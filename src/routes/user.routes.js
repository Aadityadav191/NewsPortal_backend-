const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById } = require('../controllers/user.controller.js');

// Get all users
router.get('/users', getAllUsers);

// Get a single user by ID
router.get('/users/:id', getUserById);

// Update a user by ID
// router.put('/users/:id', updateUser);

// Delete a user by ID
// router.delete('/users/:id', deleteUser);

module.exports = router;