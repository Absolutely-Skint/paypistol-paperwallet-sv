var env  = require('dotenv').config({ path: "./.env_localhost" });
// var env  = require('dotenv').config({ path: "./.env_production" });
console.log("********************************************************************");
console.log("MODE: " + process.env.MODE);
console.log("********************************************************************");

/********************************************************************
 * Includes
 /********************************************************************/
var createError         = require('http-errors');
var express             = require('express');
var path                = require('path');
var http                = require('http');
var https               = require('https');
const compression       = require('compression');
const fs                = require('fs');

// view engine setup
var app = express();

// Setup global locals
app.locals.HOST_URL =  process.env.HOST_PATH;
app.use(compression());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/********************************************************************
 * Setup Localsiation
 /********************************************************************/
 var i18n = require('i18n');

 i18n.configure({
   locales:['en', 'ko'], 
   directory: __dirname + '/locales', 
   defaultLocale: 'en',
   cookie: 'lang',
   register: global
 });


app.use(i18n.init);


/********************************************************************
 * Setup Views
 /********************************************************************/
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname, { dotfiles: 'allow' } ));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/********************************************************************
 * Routes
 /********************************************************************/
app.use('/',                        require('./routes/index'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.get('/*', function (req, res, next) {

	if (req.url.indexOf("/img/") === 0 || req.url.indexOf("/css/") === 0 || req.url.indexOf("/js/") === 0  ) {
	   res.setHeader("Cache-Control", "public, max-age=2592000");
	   res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
	}
	next();
  });


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.MODE === 'localhost' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Listen both http & https ports
const httpServer = process.env.MODE === 'localhost' ? http.createServer(app) : http.createServer((req, res) => {
	res.writeHead(301,{Location: `https://${req.headers.host}${req.url}`});
	res.end();
});


httpServer.listen(process.env.HTTP_PORT, () => {
    console.log('HTTP Server running on port ' + process.env.HTTP_PORT);
});

if(process.env.MODE === 'production')
{
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert:  fs.readFileSync(process.env.SSL_CERT)
    };
    
    const httpsServer = https.createServer(options, app);
    httpsServer.listen(process.env.HTTPS_PORT, () => {
        console.log('HTTPS Server running on port ' + process.env.HTTPS_PORT);
    });
}

module.exports = app;