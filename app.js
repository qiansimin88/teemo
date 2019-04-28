
'use strict';
const minas = require('node-minas');
const _ = require('lodash');

//minas config
var url = flatStr(process.env.config_url) || 'http://minas.3dker.cn/minas/config/fetchConfig';
var accessId = flatStr(process.env.access_id) || 'e549c511670e44d48cca7100c1f2f2fe';
var accessSecret = flatStr(process.env.access_secret) || 'MjAxNi0wNy0xMSAwMzozOTo1Njo4NDY2MzhjOWI3ZjVkYmQ0MjdlOWIzNmNiZDE0NTQ0NTRhZA==';
var mode = flatStr(process.env.NODE_ENV) || 'dev';
var runMode = flatStr(process.env.run_mode) || 'Develop';
var branchId = flatStr(process.env.branch_id) || -1;
var appName = flatStr(process.env.app_name) || 'phoneix';
var config = require('./build/config.js');
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
var NODE_ENV = process.env.NODE_ENV;
var port = process.argv[ 2 ] || 80;
var host = process.argv[ 3 ];

if(!host){
	host = NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
}

minas(url, {
	accessId: accessId,
	accessSecret: accessSecret,
	appName: appName,
	runMode: runMode,
	branchId: branchId
}).then(function(settings) {
	if(settings.panguAccessSecret) settings.panguAccessSecret += '==';

	_.assign(config,settings);

	if(NODE_ENV === 'production'){
		require('./build/production-server')(port, host);
	}else{
		require('./build/dev-server')(port, host, NODE_ENV);
	}
}).catch(function(e) {
	console.log(e.stack);
	process.exit(-1);
});
function flatStr(str) {
	if(str){
		if(str[0] === "'" || str[0] === '"') str = str.slice(1);
		var tail = str.length - 1;
		if(str[tail] === "'" || str[tail] === '"') str = str.slice(0,tail);
	}
	return str;
}