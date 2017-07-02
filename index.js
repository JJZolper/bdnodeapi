var request = require('request');
var elasticsearch = require('elasticsearch');
var express = require('express');
var swaggerJSDoc = require('swagger-jsdoc');

var routes = require('./routes/doctor_search');

var app = express();
var port = process.env.PORT || 8080;
// local
var hostname = '';
if(process.env.HEROKU_APP_NAME === undefined)
{
  hostname = 'localhost:' + port;
}
// prod
else
{
  var appname = process.env.HEROKU_APP_NAME;
  hostname = appname + '.herokuapp.com';
}
app.locals.hostname = hostname;

// swagger definition
var swaggerDefinition = {
  info: {
    title: 'Better Doctor Node API',
    version: '1.0.0',
    description: '',
  },
  host: hostname,
  basePath: '/',
};

// options for the swagger docs
var swaggeroptions = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['routes/*.js'],
};

// initialize swagger-jsdoc
var swaggerSpec = swaggerJSDoc(swaggeroptions);

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use('/', routes);

// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Enable cross site sharing so jjzolper.com can reach heroku
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*// console.log(process.env);
var connectionString = process.env.SEARCHBOX_URL;

var client = new elasticsearch.Client({
    host: connectionString
});*/

/*
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
*/

app.set('port', (port));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;


