var express = require('express')
var app = express();

var PORT = 8080;

app.get('/', function (req, res) {
	console.log('REQUEST RECEIVED')
	res.send('The application is now up and running');
})

var server = app.listen(process.env.PORT || PORT, function () {

	var host = server.address().address
	var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

});
