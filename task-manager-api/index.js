const express = require('express');
require('express-async-errors');
const db = require('./db'); // Database connection file
const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON

// global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Something went wrong.' });
  })

// Get all To-Dos
app.get('/tasks', async (req, res) => {
    const sql = "SELECT * FROM tasks_tbl";

    const [tasks] = await db.query(sql);

    tasks.length ? res.json(tasks) : res.status(404).json({ message: "Task not found" });
});

// Get a single To-Do by ID
app.get('/tasks/:id', async (req, res) => {
    const sql = "SELECT * FROM tasks_tbl WHERE id = ?";

    const [task] = await db.query(sql, [req.params.id]);

    task.length ? res.json(task[0]) : res.status(404).json({ message: "Task not found" });
});

// Create a new To-Do
app.post('/tasks', async (req, res) => {
    const data = req.body;

    const placeholders = Object.keys(data).map(() => "?").join(", ");
    const fields = Object.keys(data).map(field => `\`${field}\``).join(", ");
    const values = Object.values(data);

    const sql = `INSERT INTO tasks_tbl (${fields}) VALUES (${placeholders})`;

    const [result] = await db.query(sql, values);
    const [newtask] = await db.query("SELECT * FROM tasks_tbl WHERE id = ?", [result.insertId]);

    res.status(201).json(newtask[0]);
});

// Update a To-Do
app.put('/tasks/:id', async (req, res) => {

    const data = req.body;
    const id = req.params.id;

    const fields = Object.keys(data).map(field => `\`${field}\` = ?`).join(", ");
    const values = Object.values(data);

    const sql = `UPDATE tasks_tbl SET ${fields} WHERE id = ?`;

    const [result] = await db.query(sql, [...values, id]);
    const [newtask] = await db.query("SELECT * FROM tasks_tbl WHERE id = ?", [id]);

    result.affectedRows ? res.json({ message: "Task updated", data: newtask[0] }) : res.status(404).json({ message: "Task not found" });
});

// Delete a To-Do
app.delete('/tasks/:id', async (req, res) => {
    const id = req.params.id

    const sql = "DELETE FROM tasks_tbl WHERE id = ?";

    const [result] = await db.query(sql, [id]);

    result.affectedRows ? res.json({ message: "Task deleted" }) : res.status(404).json({ message: "Task not found" });
});

db.query('SELECT 1')
    .then(() => {
      app.listen(port, () =>
        console.log(`app listening on port ${port}!`))
    })
    .catch(err => console.log('db connection failed. \n ' + err))
