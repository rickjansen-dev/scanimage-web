var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

function startScanning( socket, fileName, resolution, colorMode ) {
	// start the scan and report any progress on the supplied socket	
	var jpegFileStream = fs.createWriteStream('../scans/' + fileName, {
		flags : 'a'
	});

	var spawn = require('child_process').spawn, scanimage = spawn('scanimage', [
			'--mode', colorMode, '--resolution', resolution, '--progress' ]);
	pnmtojpeg = spawn('pnmtojpeg');
	
	scanimage.stdout.pipe(pnmtojpeg.stdin);
	 
	scanimage.stderr.on('data', function (data) { 
			//console.log('(si)stderr: ' + data); 
			socket.emit('progressEvent',String(data));
		});
	 
	 scanimage.on('close', function (code) { 
		 if (code !== 0) { 
			 console.log('scanimage exited with code ' + code); 
		 }
		 
		 pnmtojpeg.stdin.end(); 
		 socket.emit('scanDoneEvent','1');
	 });
	  
	 pnmtojpeg.stdout.pipe(jpegFileStream);
	  
}




// app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

app.get('/', function(req, res) {
	res.sendfile('index.html');
});

app.get('/scanimage-client.js', function(req, res) {
	res.sendfile('scanimage-client.js');
});

app.get('/scanimage.css', function(req, res) {
	res.sendfile('scanimage.css');
});

io.on('connection', function(socket) {
	console.log('got connection.');
	socket.on('parameterEvent', function(data) {
		console.log('parameters received. initiate scanning...');
		
		console.log('filename: ' + data.fileName + ', resolution: ' + data.resolution + ', colormode: ' + data.colorMode);
		
		startScanning(socket, data.fileName, data.resolution, data.colorMode);
	});
	socket.on('stopScanEvent', function(data) {
		console.log('stop scan event received. Trying to abort...');

	});
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});

