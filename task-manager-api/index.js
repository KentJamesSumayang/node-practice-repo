const express = require('express');
const db = require('./configs/db'); // Database connection file
const app = express();
const port = 3001;

app.use(express.json()); // Middleware to parse JSON
app.use(express.urlencoded({ extended: false }));

// global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Something went wrong.' });
})

const taskRoute = require("./routes/task.route")
app.use("/api/tasks", taskRoute)

// Get all To-Dos

// Get a single To-Do by ID

// Create a new To-Do

// Update a To-Do

// Delete a To-Do
app.delete('/tasks/:id', async (req, res) => {

});

db.query('SELECT 1')
    .then(() => {
      app.listen(port, () =>
        console.log(`app listening on port ${port}!`))
    })
    .catch(err => console.log('db connection failed. \n ' + err))
