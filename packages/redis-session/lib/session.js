const redis = require('redis');
const tools = require('./tools');

/**
 * @param config {host,port,password,expire(in seconds)}
 */
function Session(config){
	this._config = Object.assign({}, config, {retry_strategy});
	this.connect();
}

Session.prototype.get = function(userId, token){
	userId = (userId || '').toString();
	if(!userId || !token) return Promise.resolve(null);
	return new Promise((resolve, reject) => {
		this._redis.get(userId, function(err, session){
			if(err) return reject(err);
			try{
				session = JSON.parse(session) || {};
			}catch (e){
				session = {};
			}

			var exist = false;
			if(!session[userId] || typeof session[userId] !== 'object') return resolve(null);
			Object.keys(session[userId]).forEach(login_type => {
				if(exist) return;
				if(session[userId] && session[userId][login_type] && session[userId][login_type] === token) {
					return exist = true;
				}
			});

			return exist ? resolve(session) : resolve(null);
		});
	});
};

Session.prototype.view = function(userId){
	return new Promise((resolve, reject) => {
		this._redis.get(userId, function (err, session) {
			if (err) return reject(err);
			try {
				session = JSON.parse(session) || {};
			} catch (e) {
				session = null;
			}

			return resolve(session);
		});
	});
};

Session.prototype.set = function(param){
	var self = this;
	return new Promise((resolve, reject) => {
		if(typeof param !== 'object') return reject(new Error('Session set need an Object'));
		var err = tools.checkNull(param, {
			token: 'token must be required',
			userId: 'userId must be required',
			login_type: 'login_type must be required'
		});

		if(err) return reject(new Error(err));

		this.view(param.userId).then(session => {
			insert(session);
			return resolve(session);
		});

		function insert(session){
			session = session || {};

			session[param.userId] = session[param.userId] || {};

			session.userId = param.userId;

			session[param.userId][param.login_type] = param.token;

            var _expire = self._config.expire;

            self._redis.get('EXPIRE_FROM_MINAS', function( err, expire ){

                if (err) return reject(err);
                try {
                    _expire = _expire || expire;
                } catch (e) {}

                if( ~~_expire ){
                    self._redis.set(param.userId, JSON.stringify(session),'EX' , ~~_expire);
                }else{
                    self._redis.set(param.userId, JSON.stringify(session));
                }

			});


		}
	});
};

Session.prototype.clean = function(userId){
	this._redis.set(userId, '');
	return Promise.resolve();
};

Session.prototype.connect = function(){
	return new Promise((resolve, reject) => {
		this._redis = redis.createClient(this._config);
		this._redis.on('error', (err) => {
			console.log('redis err: ', err);
			reject(err);
		});
		this._redis.on('ready', () => {
			console.log('redis ready!');
			if ( this._config.expire ){
                this._redis.set('EXPIRE_FROM_MINAS', this._config.expire);
                console.log('set EXPIRE_FROM_MINAS：', this._config.expire);
            }
			resolve();
		});

		this._redis.on('reconnecting', () => {
			console.log('redis reconnecting...');
		});
	});
};

Session.prototype.quit = function(msg){
	if(msg) console.warn(msg);
	this._redis.quit();
	return Promise.resolve();
};

function retry_strategy(options){
	if (options.error && options.error.code === 'ECONNREFUSED') {
		// End reconnecting on a specific error and flush all commands with a individual error
		console.log('redis: The server refused the connection');
		return new Error('The server refused the connection');
	}
	if (options.total_retry_time > 1000 * 60 * 60) {
		// End reconnecting after a specific timeout and flush all commands with a individual error
		return new Error('Retry time exhausted');
	}
	if (options.times_connected > 1000) {
		// End reconnecting with built in error
		return undefined;
	}
	// reconnect after
	return Math.min(options.attempt * 100, 3000);
}

module.exports = Session;
