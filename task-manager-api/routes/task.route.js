const express = require('express');
const router = express.Router();
require('express-async-errors');
const {getTasks, getTask, createTask, updateTask, deleteTask} = require("../controllers/task.controller")

router.get("/", getTasks);
router.get("/get", getTask);
router.post("/", createTask)
router.put("/edit", updateTask)
router.delete("/delete", deleteTask)

module.exports = router;