var express = require('express');
var swaggerJSDoc = require('swagger-jsdoc');
var routes = require('./routes/doctor_search');
var app = express();

// Enable cross site sharing so jjzolper.com can reach heroku
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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
app.get('/', function(req, res) {
  res.redirect('/api-docs');
});

// serve swagger
app.get('/swagger.json', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('404 Not Found');
  err.status = 404;
  next(err);
});

app.set('port', (port));
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;


