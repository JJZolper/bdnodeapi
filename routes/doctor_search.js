var request = require('request');
var elasticsearch = require('elasticsearch');
var express = require('express');
var router = express.Router();
/**
 * @swagger
 * /api/v1/doctors/search:
 *   get:
 *     description: Returns the doctor information to the caller
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: name
 *         in: query
 *         description: The name of the doctor to search for
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the doctor information
 */

// console.log(process.env);
var connectionString = process.env.SEARCHBOX_URL;

var client = new elasticsearch.Client({
    host: connectionString
});

router.get('/api/v1/doctors/search', function (req, resp, next) {

  console.log(req.query);

  var name = req.query.name;

  console.log(name);

  const api_key = '0e0a2cf386c18f688b9dc56ed67238bd';
  const options = {  
      url: 'https://api.betterdoctor.com/2016-03-01/doctors?name=' + name + '&user_key=' + api_key,
      method: 'GET',
      headers: {
          'Accept': 'application/json',
          'Accept-Charset': 'utf-8',
      }
  };

  request(options, function(err, res, body) {  
      let json = JSON.parse(body);
      var uid = json['data'][0]['uid'];
      var document = json['data'][0];
      console.log("The uid of this doctor request is: " + uid);

      // Check if the doctor information already exists in our data store.
      client.get({
        index: 'person',
        type: 'doctor',
        id: uid
      }, function (error, response) {
        if(error)
        {
          
          client.index({
            index: 'person',
            type: 'doctor',
            id: uid,
            body: document
          }, function (error, response) {
            if(error)
            {
              console.log(error);
            }
            else {
              console.log("The new doctor document was created: " + JSON.stringify(response));
              resp.send(JSON.stringify(document));
            }

          });

        }
        else {
          console.log("The doctor with that uid already exists.");
          resp.json(document);
        }
      });

  });

})

module.exports = router;

