var bonsai_url = process.env.BONSAI_URL; 

var request = require('request');
var elasticsearch = require('elasticsearch');
var express = require('express');
var app = express();

var client = new elasticsearch.Client({host: bonsai_url, log: 'trace'});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, resp) {
  client.get({
    index: 'user',
    type: 'doctor'
  }, function (error, resp) {
    console.log(resp);
  });
});

const api_key = '0e0a2cf386c18f688b9dc56ed67238bd';
const options = {  
    url: 'https://api.betterdoctor.com/2016-03-01/doctors?name=mike%20Nichols&user_key=' + api_key,
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

      client.create({
        index: 'user',
        type: 'doctor',
        id: json['data']['uid'],
        body: json['data']
      }, function (error, response) {
        // ...
      });
      console.log(json['data']);
  });



});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


