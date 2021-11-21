const http = require('http');// untuk membuat server
const url = require('url'); // untuk membaca data request dari user
const fs = require('fs'); // management file

const PORT = 2012;

// inisialisasi server
const server = http.createServer((req, res) => {
    console.log("req url :", req.url);
    console.log("req http method :", req.method);

    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    }

    if (req.url == "/") {
        if (req.method == "GET") {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end("<h1>Welcome to Node API</h1>")
        }
    } else if (req.url.includes("/users")) {
        // JSON.parse = merubah format data string atau buffer menjadi format data object
        // membaca/mengakses isi file users.json
        // untuk disimpan kedalam variable dataUsers
        let dataUsers = JSON.parse(fs.readFileSync('./users.json'))
        console.table(dataUsers);
        if (req.method == "GET") {
            res.writeHead(200, headers)
            //JSON.stringify = merubah format data object menjadi format data string/buffer
            res.end(JSON.stringify(dataUsers))
        } else if (req.method == "POST") {
            let body = [];
            // on = untuk membaca event dari request
            // data = untuk membaca bagian data request
            req.on('data', (chunk) => {
                // menampung buffer
                body.push(chunk)
            }).on('end', () => {
                // merubah data buffer menjadi data object
                body = JSON.parse(Buffer.concat(body).toString())
                // penambahan property id kedalam data request.body
                // dan memasukkan data id lanjutan
                console.log(body)
                // cara 1
                body.id = dataUsers[dataUsers.length - 1].id + 1
                // cara 2
                // body.id = dataUsers.length + 1
                // menambahkan request body kedalam dataUsers
                dataUsers.push(body)
                // menulis ulang file users.json dengan dataUsers
                fs.writeFileSync('./users.json', JSON.stringify(dataUsers))
                // megirimkan response data yang terbaru
                res.writeHead(200, headers)
                res.end(fs.readFileSync('./users.json'))
            })
        } else if (req.method == "PUT") {
            // Mendapat parameter data id yang mau diupdate berdasarkan req.query
            let queryId = url.parse(req.url, true).query.id
            // Menampung data baru dari request body
            let body = [];
            req.on('data', (chunk) => {
                console.log(chunk);
                body.push(chunk);
            }).on('end', () => {
                // merubah data buffer pada variable body menjadi data object
                console.log("sebelum JSON Parse", body)
                body = JSON.parse(Buffer.concat(body).toString())
                console.log("setelah JSON Parse", body)
                // menggunakan queryId untuk mencari index dari dataUsers
                let idx = dataUsers.findIndex((value, index) => value.id == queryId);
                console.log(idx)
                // menimpa data user yang lama dengan data yang baru
                console.log("sebulum ditimpa", dataUsers[idx])
                dataUsers[idx] = body;
                console.log("setelah ditimpa", dataUsers[idx])
                // menulis ulang file users.json dengan dataUsers
                fs.writeFileSync('./users.json', JSON.stringify(dataUsers))
                // megirimkan response data yang terbaru
                res.writeHead(200, headers)
                res.end(fs.readFileSync('./users.json'))
            })
        } else if (req.method == "PATCH") {
            // Mendapat parameter data id yang mau diupdate berdasarkan req.query
            // Mendapatkan data yang baru dari req.body
            // Mencari idx data yang ingin dirubah berdasarkan req.query
            // mencari property yang sama antara data yang baru dengan dataUsers yang ingin dirubah. Menggunkan looping object
            // jika porpertinya sama, maka datanya harus diperbarui
            // jika sudah diperbarui, tulis ulang pada users.json
            // kirimkan responnya
            // Mendapat parameter data id yang mau diupdate berdasarkan req.query
            let queryId = url.parse(req.url, true).query.id
            // Menampung data baru dari request body
            let body = [];
            req.on('data', (chunk) => {
                body.push(chunk)
            }).on('end', () => {
                // merubah data buffer pada variable body menjadi data object
                console.log("sebelum JSON Parse", body)
                body = JSON.parse(Buffer.concat(body).toString())
                console.log("setelah JSON Parse", body)
                // menggunakan queryId untuk mencari index dari dataUsers
                let idx = dataUsers.findIndex((value, index) => value.id == queryId);
                console.log(idx)
                //✔️ mencari property yang sama antara data yang baru dengan dataUsers yang ingin dirubah. Menggunkan looping object
                //✔️ jika porpertinya sama, maka datanya harus diperbarui
                for (let properti in dataUsers[idx]) {
                    for (let bodyProperti in body) {
                        console.log("cek nama property", properti, bodyProperti)
                        if (properti == bodyProperti) {
                            dataUsers[idx][properti] = body[bodyProperti]
                        }
                    }
                }
                // menulis ulang file users.json dengan dataUsers
                fs.writeFileSync('./users.json', JSON.stringify(dataUsers))
                // megirimkan response data yang terbaru
                res.writeHead(200, headers)
                res.end(fs.readFileSync('./users.json'))
            })
        } else if (req.method == "DELETE") {
            // mendapatkan id dari req.query yg dikirim user
            let queryId = url.parse(req.url, true).query.id
            // mencari index dataUsers yang ingin dihapus, berdasarkan data id dari req.query
            let idx = dataUsers.findIndex((value, index) => value.id == queryId);
            // menghapus data array berdasarkan index yg sudah ditemukan
            dataUsers.splice(idx, 1);
            // menulis ulang data pada file users.json
            fs.writeFileSync('./users.json', JSON.stringify(dataUsers))
            // mengirimkan response kepada client atau front end
            res.writeHead(200,headers);
            res.end(fs.readFileSync("./users.json"))
        }
    } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>PAGE NOT FOUND 404</h1>")
    }

})


// menjalankan server
server.listen(PORT, () => console.log("Node SERVER Ready at PORT :", PORT))