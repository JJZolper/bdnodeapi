var SwaggerExpress = require('swagger-express-mw');
var request = require('request');
var elasticsearch = require('elasticsearch');
var express = require('express');
var fs = require('fs');
var app = express();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

// console.log(process.env);
var connectionString = process.env.SEARCHBOX_URL;

var client = new elasticsearch.Client({
    host: connectionString
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const api_key = '0e0a2cf386c18f688b9dc56ed67238bd';
const options = {  
    url: 'https://api.betterdoctor.com/2016-03-01/doctors?name=Heather%20Fenimore&user_key=' + api_key,
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
    }
};

app.get('/api/v1/doctors/search', function(req, resp) {

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
          resp.send(JSON.stringify(document));
        }
      });

  });

});

/*
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
*/

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
  });

});


