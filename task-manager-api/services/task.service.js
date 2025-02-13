const db = require("../configs/db")

module.exports.getTasks = async () => {
    const sql = "SELECT * FROM tasks_tbl";
    const [result] = await db.query(sql);
    return result;
}

module.exports.getTask = async (id) => {
    const sql = "SELECT * FROM tasks_tbl WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    return result;
}

module.exports.createTask = async (fields, placeholders, values) => {
    const sql = `INSERT INTO tasks_tbl (${fields}) VALUES (${placeholders})`;
    const [result] = await db.query(sql, values);
    const [newTasks] = await db.query("SELECT * FROM tasks_tbl WHERE id = ?", [result.insertId]);
    return newTasks;
}

module.exports.updateTask = async (id, fields, values) => {
    const sql = `UPDATE tasks_tbl SET ${fields} WHERE id = ?`;
    await db.query(sql, [...values, id]); 

    const check_sql = "SELECT * FROM tasks_tbl WHERE id = ?";
    const [rows] = await db.query(check_sql, [id]); 

    console.log(typeof(id));

    return rows.length > 0 ? rows[0] : null; 
};

module.exports.deleteTask = async (id) => {
    const sql = "DELETE FROM tasks_tbl WHERE id = ?";
    const [result] = await db.query(sql, [id]);
    return result;
}