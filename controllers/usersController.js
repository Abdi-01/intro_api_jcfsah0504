const fs = require('fs')

module.exports = {
    getDataUsers: (req, res) => {
        let data = JSON.parse(fs.readFileSync('./users.json').toString())
        res.status(200).send(data)
    },
    addUsers: (req, res) => {
        let data = JSON.parse(fs.readFileSync('./users.json').toString());
        console.log(req.body);
        // req.body : digunakan untuk membaca data dari req.body client
        req.body.id = data.length + 1;
        console.log(req.body);

        data.push(req.body);

        fs.writeFileSync('./users.json', JSON.stringify(data))
        res.status(200).send(fs.readFileSync('./users.json'))
    },
    editUsers: (req, res) => {
        let data = JSON.parse(fs.readFileSync('./users.json').toString())

        let idx = data.findIndex((val, index) => val.id == req.params.id)

        for (let properti in data[idx]) {
            for (let bodyProperti in req.body) {
                if (properti == bodyProperti) {
                    data[idx][properti] = req.body[bodyProperti]
                }
            }
        }

        fs.writeFileSync('./users.json',JSON.stringify(data))
        res.status(200).send(fs.readFileSync('./users.json'))
    }
}