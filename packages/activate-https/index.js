const https = require('https');
const fs = require('fs');
const path = require('path');
const staticRoot = path.resolve(__dirname, './openssl');
const prod = process.env.NODE_ENV === 'production';
const protocol = 'https';
const colors = require('colors');

function activateHttps(app, port, host){
	if(prod) return;
	if(!app) throw new Error('activate-https required a instance of express(it look like "app")');
	port = port || 443;

	https.createServer({
		key: fs.readFileSync(path.resolve(staticRoot, 'private.pem')),
		cert: fs.readFileSync(path.resolve(staticRoot, 'certificate.pem'))
	}, app).listen(port);

	console.log(`${'注意: '.red}Listening at ${colors.red(protocol)}://${host}:${colors.green(port)}`);
}

module.exports = activateHttps;