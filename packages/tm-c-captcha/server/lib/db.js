const redis = require('redis');

var DB = function( config ) {
    this.config = Object.assign( {}, config, {
        retry_strategy: function (options) {
            if (options.error && options.error.code === 'ECONNREFUSED') {
                // End reconnecting on a specific error and flush all commands with
                // a individual error
                return new Error('wx-sharing redis server refused the connection');
            }
            if (options.total_retry_time > 1000 * 60 * 60) {
                // End reconnecting after a specific timeout and flush all commands
                // with a individual error
                return new Error('wx-sharing redis retry time exhausted');
            }
            if (options.times_connected > 1000) {
                // End reconnecting with built in error
                return undefined;
            }
            if (options.attempt > 200) {
                // End reconnecting with built in error
                return undefined;
            }
            // reconnect after
            return Math.min(options.attempt * 1000, 5000);
        }
    })

    this.config.expire || ( this.config.expire = 120 );

    this.connect();
}

DB.prototype.connect = function() {
    var self = this;

    this.client = redis.createClient( this.config );

    this.client.on('ready', function() {
        console.log('captcha redis ready');
    });
    this.client.on('connect', function() {
        console.log('captcha redis connect');
    });
    this.client.on('reconnecting', function() {
        console.log('captcha redis reconnecting');
    });
    this.client.on('error', function(err) {
        console.log('captcha redis error', err);
    });
};

DB.prototype.set = function( key, val, cb ) {
    var self = this;
    
    if ( this.client ) {
        this.client.set( key, val, function(err) {
            if ( err ) return cb({ code: 'db_set', msg: err });

            self.client.expire( key, self.config.expire );
            cb( null )
        });
    } else {
        cb('client is undefined');
    }
};

DB.prototype.get = function( key, cb ) {
    if ( this.client ) {
        this.client.get( key, function(err, res) {
            if ( err ) cb({ code: 'db_get', msg: err });

            cb( null, res )
        });
    } else {
        cb('client is undefined');
    }
}

module.exports = DB;