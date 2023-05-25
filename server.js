const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* =========== DEFAULT ROUTE =========== */
app.get('/', (req, res) => {
    return res.send({
        error: true,
        message: "wattup 'cuh"
    });
});

/* =========== CONNECTION CONFIG =========== */
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'manjaro',
    password: 'thisispassword',
    database: 'crudl'
});

/* =========== CONNECT TO DATABASE =========== */
db.connect();


/* =========== RETRIEVE ALL USERS =========== */
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.status(200).send({ error: false, data: results, message: 'users list' });
    });
});


/* =========== RETRIEVE USER BY ID =========== */
app.get('/users/:id', (req, res) => {
    const user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'id is required'});
    }

    db.query('SELECT * FROM users WHERE id=?', user_id, (error, results, fields) => {
        if (error) throw error;

        if (results.length < 1) {
            return res.status(404).send({ error: true, message: 'user not found'});
        }

        return res.status(200).send({ error: false, data: results[0], message: 'users list' });
    })
});


/* =========== ADD A NEW USER =========== */
app.post('/users', (req, res) => {
    const user = req.body.user;
    if (!user) {
        return res.status(400).send({ error: true, message: 'user data is required' });
    }

    db.query("INSERT INTO users SET ? ", { user: user }, function (error, results, fields) {
        if (error) throw error;
        return res.status(201).send({ error: false, data: results, message: 'success adding a user' });
    });
});


/* =========== ALTER USER BY ID =========== */
app.patch('/users', (req, res) => {
    const user_id = req.body.id;
    const user = req.body.user;
    if (!user_id || !user) {
        return res.status(400).send({ error: true, message: 'user data and id are required' });
    }

    db.query('UPDATE users SET user = ? WHERE id = ?', [user, user_id], (error, results, fields) => {
        if (error) throw error;
        return res.status(200).send({ error: false, data: results, message: 'success altering a user' });
    });
});


/* =========== DELETE USER  =========== */
app.delete('/users', (req, res) => {
    const user_id = req.body.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'id is required' });
    }

    db.query('DELETE FROM users WHERE id = ?', [user_id], (error, results, fields) => {
        if (error) throw error;
        return res.status(204).send({ error: false, message: 'success removing a user' });
    });
});


/* =========== SET PORT  =========== */
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Node app is running on port ${PORT}`)
});

module.exports = app;