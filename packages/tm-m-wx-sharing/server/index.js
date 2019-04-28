var wxTicket = require('./wxTicket');
var DB = require('./db');
var SHA = require('sha1');

// config = {
//     host: config.redisHost,
//     port: config.redisPort,
//     password: config.redisPassword,
//     appId: appId,
//     appSecret: appSecret
// };

module.exports = function( config ) {
    if ( !config.appId 
        || !config.appSecret 
        || !config.host
        || !config.port
        || !config.password ) {
        console.warn('Error: appId & appSecret & redisHost & redisPort & redisPassword required');
        return;
    }

    var createNonceStr = function() {
        return Math.random().toString(36).substr(2, 15);
    };

    var createTimestamp = function() {
        return parseInt(new Date().getTime() / 1000) + '';
    };

    var raw = function(args) {
        var keys = Object.keys(args);
        keys = keys.sort()
        var newArgs = {};
        keys.forEach(function(key) {
            newArgs[key.toLowerCase()] = args[key];
        });

        var string = '';
        for (var k in newArgs) {
            string += '&' + k + '=' + newArgs[k];
        }
        string = string.substr(1);
        return string;
    };

    var wxcfg = {
        appId: config.appId,
        appSecret: config.appSecret
    };

    var db = new DB({
        host: config.host,
        port: config.port,
        password: config.password
    });

    return {
        wxSign: function( url ) {
            return new Promise( function(resolve, reject) {
                wxTicket( db, wxcfg ).then(function(ticket) {
                    var data = {
                        jsapi_ticket: ticket,
                        nonceStr: createNonceStr(),
                        timestamp: createTimestamp(),
                        url: url
                    };

                    data.signature = SHA( raw(data) );

                    resolve({
                        appId: wxcfg.appId,
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.signature
                    });
                }).catch(function(err) {
                    reject(err)
                });
            });
        }
    }
};
