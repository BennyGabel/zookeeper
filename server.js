const express = require('express');
// const { animals } = require('./data/animals')

const app = express()
const fs = require('fs')
const path = require('path')


   /***************** IMPORTANT ******************/
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
/***************** IMPORTANT ******************/

app.use(express.static('public'));   // [BG] Add the web browser address as main (current) directory.... Provides a file path to a location in our application 
                                     // [BG] express.static is middleware
                                     // [BG] This code sets the public sub-directory as root path

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}`);
})

/* 22.10.26 */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
}); 
/* 22.10.26 */



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

/* 22.10.26 */
function validateAnimal(animal) {
  // Validate information entered
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}

function createNewAnimal(body, animalsArray) {
  // console.log(body);
  // our function's main code will go here!

  const animal = body;
  animalsArray.push(animal);  
  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({animals:animalsArray}, null, 2)
    // In the expression:     JSON.stringify({animals:animalsArray}, null, 2)
    // null means we dont want to edit any of our existing data
    // 2    means we want to create white space between our values to make it more readable
  )

  // console.log('***' + animalsArray);  /* BG's TEST*/


  // return finished code to post route for response
  // return body;
  return animal;
} 
/* 22.10.26 */



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
  // console.log(req.body)                          // Remmed out on 22.10.26
  req.body.id = animals.length.toString();          // Line added on 22.10.26

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {                                     // Got to validate entry, before creating the animal
    res.status(400).send('The animal is not properly formatted.');
  } else {
    // add animal to json file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    res.json(req.body)
  }

});

const{ animals } = require('./data/animals');


// to trun from heroku:  https://hidden-meadow-99059.herokuapp.com/api/animals?name
