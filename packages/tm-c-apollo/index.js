var EventEmitter = require('events').EventEmitter;
var request = require('request');
var url = require('url');
var utils = require('./utils');
var protocol = 'http://';

var Apollo = function(options){
	options = options || {};

	if(!utils.hasProtocol(options.server)) options.server = protocol + options.server;

	this._server = options.server;
	this._appId = options.appId;
	this._clusterName = options.clusterName;
	this._namespaceName = options.namespaceName;
	this._refreshing = false;
	this._notificationId = -1;

	/*这部分保留，有必要的话将来会用require('os').networkInterfaces();来实现*/
	this._ip = options.ip;

	this._url = `${this._server}/configfiles/json/${this._appId}/${this._clusterName}/${this._namespaceName}`;

	this._notificationUrl = '';

	if(this._ip) this._url += `?ip=${this._ip}`;
};

// mixin(Apollo, EventEmitter.prototype, false);
Apollo.prototype = EventEmitter.prototype;

Apollo.prototype.get = function(){
	this._method = 'GET';
	return this._run();
};

Apollo.prototype.post = function(){
	this._method = 'POST';
	return this._run();
};

Apollo.prototype._run = function(){
	if(!this.refreshing) {
		this._refreshing = true;
		this.refresh();
	}

	return new Promise((resolve, reject) => {
		request({
			method: this._method,
			uri: this._url
		}, (err, res, body) => {
			if(err) resolve({});

			return resolve(body);
		});
	});
};

Apollo.prototype.refresh = function(){
	utils.makeNotifications.call(this);

	return new Promise((resolve, reject) => {
		request({
			method: this._method,
			uri: this._notificationUrl,
			timeout: 60 * 1000
		}, (err, res, body) => {
			if(err) {
				resolve({});
			}

			this.emit('test', {
				status: res.statusCode,
				body: body
			});

			switch (res.statusCode){
				case 200:
					this._notificationId = body[0].notificationId;
					this.get().then(config => {
						this.emit('update', config);
					});

					break;
				default:
					this.refresh();
			}
		});
	});
};

module.exports = Apollo;