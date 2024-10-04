const { authentication } = require("../../middlewares/auth");
const { createTask, getTasks, updateTask, createComments } = require("./task.controller");

const router = require("express").Router();

// POST /api/tasks: Create a new task (Admin can assign users).
// GET /api/tasks: List tasks. Users see only their tasks; Admin sees all.
// PUT /api/tasks/:id: Update task status (User or Admin).
// POST /api/tasks/:id/comment: Comment on tasks (real-time updates).

router.post("/tasks", authentication, createTask)
router.get("/tasks", authentication, getTasks) //?role=user
router.put("/tasks/:id", authentication, updateTask)
router.post("/tasks/:id/comment", authentication,  createComments)

module.exports = {taskRouter: router}