const express = require('express');
const pool = require('./db');
const app = express();
const PORT = 3000;

app.use(express.json());

//Get all tasks
app.get("/tasks", async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM todos');
        res.status(200).json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
     }
});

//create a new task
app.post("/tasks", async(req, res) => {
    try {
        const {description, completed = false } = req.body;
        const result = await pool.query('INSERT INTO todos (description, completed) VALUES ($1, $2) RETURNING *',[description, completed]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Update a task
app.put("/tasks/:id", async(req, res) => {
    try {
        const { id }=req.params;
        const { description, completed }=req.body;
        const result  =await pool.query('UPDATE todos SET description = $1, completed = $2 WHERE id = $3 RETURNING *',[description, completed, id]);
        if(result.rows.length ===0){
            return res.status(404).send("Task not found");
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//Delete a task
app.delete("/tasks/:id", async (req, res) => {
    try{
        const {id} =req.params;
        const result = await pool.query('DELETE FROM todos WHERE id= $1', [id]);
        if(result.rowCount ===0) {
            return res.status(404).send("Task not found.");
        }
        req.status(204).send();
    } catch(err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
//Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

