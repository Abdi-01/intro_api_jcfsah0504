// Membuat API menggunakan Express JS
const express = require('express');
const app = express();// untuk menngaktifkan/menjalakan module express
const PORT = 2013;
const fs = require('fs')
const cors = require('cors'); // memberikan hak akses kepada semua front-end

app.use(cors())
// untuk menerima data dari req.body client/front-end
app.use(express.json())

// untuk menerima req GET dari client/FE
app.get('/', (req, res) => {
    res.status(200).send('<h1>Express API</h1>')
})

// Import router yang sudah di conf pada directory routers
const { usersRouter } = require('./routers')

app.use('/users', usersRouter)

app.put('/users', (req, res) => {
    let data = JSON.parse(fs.readFileSync('./users.json'.toString()))
    // req.query : membaca data dari req.query parameter
    console.log(req.query.id)
    let idx = data.findIndex((value, index) => value.id == req.query.id)
    console.log(req.body)
    data[idx] = req.body;

    fs.writeFileSync('./users.json', JSON.stringify(data))
    res.status(200).send(fs.readFileSync('./users.json'))
})


app.listen(PORT, () => console.log("Server RUNNING :", PORT))