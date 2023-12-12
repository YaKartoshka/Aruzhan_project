const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const port = process.env.PORT || 4000

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "sql10.freemysqlhosting.net",
    user: "sql10669897",
    password: "tkJJuyBCNm",
    database: 'sql10669897'
});

con.connect(function (err) {
    if (err) throw err;
    console.log("База данных работает!");
});

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// -- used packages --
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

app.use("/public", express.static(__dirname + "/public"));
app.set("trust proxy", true);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res, next) => {

    res.render('index');
});

app.get('/form', (req, res, next) => {

    res.render('form');
});

app.get('/admin', (req, res, next) => {

    res.render('admin');
});


app.post('/zapis/add', (req, res) => {
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const phone_number = req.body.phone_number;

    const sql = 'INSERT INTO appointments (first_name, last_name, phone_number) VALUES (?, ?, ?)';
    const values = [
        first_name,
        last_name,
        phone_number
    ];

    con.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Data inserted successfully');
            res.status(200).send('Data inserted successfully');
        }
    });
});

app.get('/zapis/get', (req, res) => {
    const sql = 'SELECT * FROM appointments';

    con.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});

app.get('/forms/sum', (req, res) => {
    const sql = 'SELECT COUNT(*) as sum FROM forms';

    con.query(sql, (err, results) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});

app.get('/create', (req,res)=>{
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS appointments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone_number VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  con.query(createTableQuery, (err, results) => {
    if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).send('Internal Server Error');
    } else {
        res.json(200);
    }
});
})

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
});