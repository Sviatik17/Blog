const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;
const dataFilePath = 'data.json';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

app.get('/articles', (req, res) => {
    const articles = readDataFile();
    res.json(articles);
});
app.post('/admin/add-article', (req, res) => {
    const { title, content } = req.body;
    const newArticle = { title, content };
    const articles = readDataFile();
    articles.push(newArticle);
    writeDataFile(articles);
    res.redirect('/');
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})


function readDataFile() {
    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error readind data file', error.message);
        return [];
    }
}

function writeDataFile(data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(dataFilePath, jsonData, 'utf8');
    } catch (error) {
        console.error(`Error writing data file`, error.message);
    }
}