var express = require('express');
var Service = require('node-dubbo-comsumer');
var bodyParser = require('body-parser');
var path = require('path');
var api = require('./api'); //不要删!
var appConfig = require('./config');
var app = express();
var fallback = require('connect-history-api-fallback');

var view_path = path.resolve(__dirname, '../dist');
var project = require('../server/project');
if( !project.host ) project.host = "";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(fallback({
	index: project.host + '/index.html'
}));
app.use(project.host || '/', express.static(view_path, {index: [project.host + '/index.html']}));
app.use(require('./session')(api.DataService, appConfig.secret));

Service.done(function(){
	app.use(project.host + '/gateway',Service.gatway( path.resolve(__dirname,'./server.js') ) );
})

module.exports = function start(port, host){
	app.listen(port, host, function (err) {
		if ( err ) return console.log( err );
		console.log('Listening at http://' + host + ':' + port);
	});
}

