const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./key.pem', 'utf-8'),
  cert: fs.readFileSync('./server.crt', 'utf-8')
};
fs.readFile('./index.html', function(err,html){
    https.createServer(options, function (req, res) {
        res.writeHead(200, {"Content-Type" : "text/html"});
        res.write(html);
        res.end();
    })
}).listen(8000);