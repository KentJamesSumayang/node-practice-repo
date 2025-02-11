const express = require('express');
const db = require('./db'); // Database connection file
const app = express();


app.use(express.json()); // Middleware to parse JSON

// Get all To-Dos
app.get('/tasks', async (req, res) => {
    const [tasks] = await db.query("SELECT * FROM tasks_tbl");
    res.json(tasks);
});

// Get a single To-Do by ID
app.get('/tasks/:id', async (req, res) => {
    const [task] = await db.query("SELECT * FROM tasks_tbl WHERE id = ?", [req.params.id]);
    task.length ? res.json(task[0]) : res.status(404).json({ message: "To-Do not found" });
});

// Create a new To-Do
app.post('/tasks', async (req, res) => {
    const data = req.body;
    const placeholders = Object.keys(data).map(() => "?").join(", ");
    const fields = Object.keys(data).map(field => `\`${field}\` = ?`).join(", ");
    const values = Object.values(data);
    const [result] = await db.query(`INSERT INTO tasks_tbl ${fields} VALUES ${placeholders}`, [...values]);
    const [newtask] = await db.query("SELECT * FROM task WHERE id = ?", [result.insertId]);
    res.status(201).json(newtask[0]);
});

// Update a To-Do
app.put('/tasks/:id', async (req, res) => {
    const updates = req.body;
    const fields = Object.keys(updates).map(field => `\`${field}\` = ?`).join(", ");
    const values = Object.values(updates);
    const [result] = await db.query(`UPDATE tasks_tbl SET ${fields} WHERE id = ?`, [...values, req.params.id]);
    result.affectedRows ? res.json({ message: "To-Do updated" }) : res.status(404).json({ message: "To-Do not found" });
});

// Delete a To-Do
app.delete('/tasks/:id', async (req, res) => {
    const [result] = await db.query("DELETE FROM tasks_tbl WHERE id = ?", [req.params.id]);
    result.affectedRows ? res.json({ message: "To-Do deleted" }) : res.status(404).json({ message: "To-Do not found" });
});

pool.query('SELECT 1')
    .then(() => {
      app.listen(port, () =>
        console.log(`app listening on port ${port}!`))
    })
    .catch(err => console.log('db connection failed. \n ' + err))
