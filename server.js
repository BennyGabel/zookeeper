const express = require('express');
// const { animals } = require('./data/animals')

const app = express()

   /***************** IMPORTANT ******************/
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
/***************** IMPORTANT ******************/

const PORT = process.env.PORT || 3001;

// app.get('/api/animals', (req, res) => {
//   res.send('Hello!');
// })

//app.listen(3001, () => {console.log('API servr now on port 3001!')});
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
})

function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = []

  let filteredResults = animalsArray;

  if (query.personalityTraits) {
    // Save personalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save.
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
    // Loop through each trait in the personalityTraits array:
    personalityTraitsArray.forEach(trait => {
      // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
      filteredResults = filteredResults.filter(
        animal => animal.personalityTraits.indexOf(trait) !== -1
      );
    });
  }

  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  
  // alert("name",query.name)
  // console.log("name",query.name)
  // console.log(filteredResults.filter)
  
  console.log(query,query.diet, query.species, query.name)     // { species: 'gorilla', name: 'Terry' } undefined gorilla Terry


  return filteredResults;
}

function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}

app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.send(404)
  }
});
  
app.get('/api/animals', (req, res) => {
   let results = animals;
   if (req.query) {
     results = filterByQuery(req.query, results);
   }
    res.json(results);
});
  
app.post('/api/animals', (req, res) => {
  // req.body is where our incoming content will be
  console.log(req.body)
  res.json(req.body)
});

const{ animals } = require('./data/animals');


// to trun from heroku:  https://hidden-meadow-99059.herokuapp.com/api/animals?name
