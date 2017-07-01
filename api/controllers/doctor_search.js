'use strict';

var request = require('request');
var elasticsearch = require('elasticsearch');

module.exports = {
  doctor_search: doctor_search
};

console.log(process.env);
var connectionString = process.env.SEARCHBOX_URL;

var client = new elasticsearch.Client({
    host: connectionString
});

function doctor_search(req, resp) {

  var name = req.swagger.params.name.value;

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

}
