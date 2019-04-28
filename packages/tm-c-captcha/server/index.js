var gen = require( './lib/gen' );
var db = require( './lib/db' );

var Captcha = function( config ) {
    if ( !config ) return console.error( 'config should not be undefind' );
    this.db = new db( config );
};

// data = { x: x, y: y }
Captcha.prototype.check = function( token, data ) {
    var self = this;
    
    return new Promise( function(resolve, reject) {
        if ( !data || !data.x || !data.y ) return reject( false );
        
        self.db.get( token, function( err, res ) {
            if ( err ) return reject(err);

            try {
                res = JSON.parse( res );
            } catch ( err ) {
                return reject({ code: 'db_get', msg: err });
            };

            if ( !res || !res.x || !res.y || !res.date ) {
                return reject({ code: 'db_get', msg: 'captcha is none' });
            }

            var now = new Date().getTime();

            // 验证码生成与检查，小于500毫秒，非人为
            if ( ( now - res.date ) < 500 ) {
                reject( false )
            } else if ( 
                // 误差为: 2
                Math.abs( res.x - data.x ) <= 2 && 
                Math.abs( res.y - data.y ) <= 2 ) {
                resolve( true );
            } else {
                reject( false );
            }
        });
    });
};

Captcha.prototype.generate = function() {
    var self = this;

    return new Promise( function(resolve, reject) {
        gen( function( err, ret, record ) {
            if ( err ) return reject( err );

            self.db.set( record.token, JSON.stringify({
                x: record.x, 
                y: record.y,
                date: new Date().getTime()
            }), 
            function( err ) {
                if ( err ) {
                    reject( err );
                } else {
                    resolve( ret );
                }
            });
        });
    });
};

// for test
// var cap = new Captcha({
//     host:'174.3.4.254',
//     port:'6379',
//     password:'o9i8u7y6'
// });

module.exports = Captcha;