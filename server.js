var express = require('express');
const fs = require('fs');
var http = require('http');
var https = require('https');

var server = express();
const options = {
    key: fs.readFileSync('./key.pem', 'utf-8'),
    cert: fs.readFileSync('./server.crt', 'utf-8')
  };




var port        = 8000




// fs.readFile('./index.html', function(err,html){
//     https.createServer(options, function (req, res) {
//         res.writeHead(200, {"Content-Type" : "text/html"});
//         res.write(html);
//         res.end();
//     })
// }).listen(8000);




////////////////////////////////////////////////////////////
// APP: Init server & comms
////////////////////////////////////////////////////////////
exports.serverInit = function(args)
{
  /////////////////////////// Express server setup


  // TODO: 
  //   check request lengths (not to break header)
  //   http://stackoverflow.com/questions/19917401/node-js-express-request-entity-too-large
  // TODO:
  /*   ----> Add ability to serve pre-gzipped files (example below)
  server.use(function(req, res, next) {
           if (requested-file-is-index.html) {
             req.url = "/static/index.html.gz";
             res.setHeader('Content-Encoding', 'gzip');
             res.setHeader('Content-Type', 'text/html; charset=utf-8');
           }
           next();
       });
  */
  server.enable('etag', 'weak');
  server.all('/*', function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Methods", "*")
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
  });
  
 

  server.use(function(req, res, next) 
  {   
    if(req.url.indexOf('.manifest') != -1) {
      res.header('Content-Type', 'text/cache-manifest');
      res.header('Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 'Thu, 01 Jan 1970 00:00:01 GMT');
      next();
      return;
    } 
  
    if(req.url.match(/(.png|.jpg|.jpeg|.svg|.woff|.woff2|.ttf|.otf|.eot)/)) {
      res.header('Cache-Control', 'max-age=691200');
    } else {
      res.header('Cache-Control', 'max-age=0, no-cache, no-store, must-revalidate');
      res.header('Pragma', 'no-cache');
      res.header('Expires', 'Thu, 01 Jan 1970 00:00:01 GMT');
    }
    next();
  });

  /// Set the default index from 'setting.json' -- if null do not allow it ///
  server.get('/', function(req, res) { res.sendFile('./index.html'); });
  
  //// set the limit in 'settings.json' -- if null do not configure it ///
  server.use(bodyParser.json({limit:'20mb'}));
  server.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

  /// set which folders are being included in 'settings.json' -- if null do not include anything ///
  server.use(express.static());

  var httpServer = http.createServer(server);
  var httpsServer = https.createServer(options,server);

  httpServer.listen(80);
  httpsServer.listen(port, function(){
    console.log("startup: server started @ port " + port);
  });


}