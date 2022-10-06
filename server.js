const express = require('express');

const app = express()

app.listen(3001, () => {console.log('API servr now on port 3001!')});

app.get('/api/animals', (req, res) => {
    // res.send('Hello!'); 

    let result = animals;
    console.log(req.query)
    res.json(animals);
})

const{ animals } = require('./data/animals');
