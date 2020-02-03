var express = require('express'),
    router = express.Router();

const jsonfile = require('jsonfile');
const file = 'data.json'
const BackupFileName = '_backup.json'

var uploadCount = 0;

function NeedsBackup(data) {
  if (uploadCount == 10) {
    uploadCount = 0;
    const now = new Date();
    jsonfile.writeFile(now.toString() + BackupFileName, data)
    .then(result => {
      console.log('Backup written');
    })
    .catch(err => {
      console.error(err);
    });
  }
  uploadCount = uploadCount + 1;
}

router.get('/', (req, res) => {
  jsonfile.readFile(file, function (err, bookArray) {
    if (err) { 
      console.error(err) 
    }
    else {
      res.status(200).json(bookArray); 
    }
  })
});

router.post('/', (req, res) => {
  NeedsBackup(req.body);
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