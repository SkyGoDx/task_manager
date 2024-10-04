const bcrypt = require('bcryptjs');
const { createNewUser, userLogin, getAllUsers } = require('./user.controller');

// User Management (Admin Only):

// POST /api/users: Create a new user (set role as Admin or User).
// GET /api/users: List all users (for task assignment).

const router = require("express").Router();
router.get("/users", getAllUsers)
router.post("/login", userLogin)
router.post("/users", createNewUser)

module.exports = {userRouter: router}