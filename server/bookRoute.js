var express = require('express'),
    router = express.Router();

const jsonfile = require('jsonfile');
const file = 'data.json'

router.get('/', (req, res) => {
  jsonfile.readFile(file)
  .then( bookArray => {
    res.status(200).json(bookArray)
  })
  .catch(err => {
    jsonfile.writeFileSync(file, []);
    res.status(200).json([]);
  });
});

router.post('/', (req, res) => {
  jsonfile.writeFile(file, req.body)
    .then(result => {
      console.log('Written to Database');
      res.status(200).send("Updated database");
    })
    .catch(err => {
      console.error(err);
      res.status(404).send("Fail to update the database");
    });
})

module.exports = router;