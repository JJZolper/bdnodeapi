var request = require('request');
var elasticsearch = require('elasticsearch');
var express = require('express');
var fs = require('fs');
var app = express();

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

app.get('/', function(req, resp) {

  var result = [];

  client.search({
      index: 'person',
      type: 'doctor',
      body: {
          query: {
              match: {
                uid: "ebfca2b339d1e5e23ce0af3ab1c886f4"
              }
          }
      }
  }).then(function (data) {
      // console.log(data);
      // console.log(data.hits.hits);
      result = data.hits.hits;
      resp.send(JSON.stringify(result[0]));
  }, function (err) {
      console.log(err.message);
  });

});

const api_key = '0e0a2cf386c18f688b9dc56ed67238bd';
const options = {  
    url: 'https://api.betterdoctor.com/2016-03-01/doctors?name=Mike%20Nichols&user_key=' + api_key,
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
    }
};

app.get('/api/v1/doctors/search', function(req, resp) {

  request(options, function(err, res, body) {  
      let json = JSON.parse(body);
      let result = json['data'];

      /*
      fs.writeFile("./sample.txt", JSON.stringify(json['data']), (err) => {
          if (err) {
              console.error(err);
              return;
          };
          console.log("File has been created");
      });
      */

      console.log(json['data'][0]);
      console.log(json['data'][0]['uid']);

      var id = json['data'][0]['uid'];
      var document = json['data'][0];

      client.index({
        index: 'person',
        type: 'doctor',
        id: id,
        body: document
      }, function (error, response) {
        console.log(response);
      });

      resp.send("Success!")

  });

});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function isNotEmptyObject(obj) {
  if(Object.keys(obj).length > 0){
    return true;
  }
}

