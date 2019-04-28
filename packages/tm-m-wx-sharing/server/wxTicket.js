var request = require('superagent');
var wxToken = require('./wxToken');

module.exports = function( db, wxcfg ) {
    return new Promise( function(resolve, reject) {
        db.get('__wx_ticket__', function(err, res) {
            if ( err || !res ) {
                console.log( 'db_get_cached_ticket', err || 'No wx_ticket at redis');

                wxToken( db, wxcfg ).then( function( token ) {
                    request
                        .get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+ token +'&type=jsapi' )
                        .set('Accept', 'application/json')
                        .end( function(err, res) {
                            if (err) {
                                reject({ code: 'wx_request_ticket', msg: err });
                                return;
                            }

                            res = res.body;
                            if ( !res || !res.ticket ) {
                                reject({ code: 'wx_request_ticket', msg: res });
                            } else {
                                db.set('__wx_ticket__', res.ticket, function(err) {
                                    console.log('db_set_new_ticket', err );
                                });

                                resolve( res.ticket );
                            }
                        });
                }).catch( function(err) {
                    reject(err);
                });
            } else {
                console.log('db_get_cached_ticket_successfully')
                resolve( res );
            }
        });
    });
};