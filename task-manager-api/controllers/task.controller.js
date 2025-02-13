const service = require("../services/task.service")

const getTasks = async (req, res) => {
    const tasks = await service.getTasks();
    tasks.length ? res.json(tasks) : res.status(404).json({ message: "Tasks are empty" });
}

const getTask = async (req, res) => {
    const id = req.query.id
    const task = await service.getTask(id)
    task.length ? res.json(task[0]) : res.status(404).json({ message: "Task not found" });
}

const createTask = async (req, res) => {
    const data = req.body;
    const placeholders = Object.keys(data).map(() => "?").join(", ");
    const fields = Object.keys(data).map(field => `\`${field}\``).join(", ");
    const values = Object.values(data);
    const new_task = await service.createTask(fields, placeholders, values)
    res.status(201).json(new_task[0]);
}

const updateTask = async (req, res) => {
    const data = req.body;
    const id = req.query.id;
    const fields = Object.keys(data).map(field => `\`${field}\` = ?`).join(", ");
    const values = Object.values(data);
    const result = await service.updateTask(id, fields, values);
    result ? res.json({ message: "Task updated", data: result }) : res.status(404).json({ message: "Task not found" });
}

const deleteTask = async (req, res) => {
    const id = req.query.id
    const result = await service.deleteTask(id)
    result ? res.json({ message: "Task deleted" }) : res.status(404).json({ message: "Task not found" });
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask }
