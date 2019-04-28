var gm = require('gm');
var path = require('path');

var orignalFile = path.resolve( __dirname, '../output/orignal.png' ),
    cropingFile = path.resolve( __dirname, '../output/croping.png' ),
    cropedFile = path.resolve( __dirname, '../output/croped.png' ),
    maskFile = path.resolve( __dirname, '../assets/mask.png' ),
    assetsDir = path.join( __dirname, '../assets/' );

var Random = require('random-js');
var engine = Random.engines.mt19937().autoSeed();
var random = new Random( engine );

module.exports = function( cb ) {
    // 验证码唯一标识
    var token = random.uuid4();
    // 图片随机取一张
    var img = random.integer( 1, 13 );
    // 图片重置的宽高，截取宽高
    // 截取的起始坐标
    var x = random.integer( 40, 260 ),
        y = random.integer( 0, 60 );

    // 前端验证码对象，token唯一标识
    var ret = { 
        token: token,
        pos: { x: 10, y: y }, // 方块初始位置好
        orignal: '', // 原图
        croping: '', // 裁剪的方块
        croped: ''   // 裁剪后的剩余图片
    };
    // 数据库中记录, 与前端保持一致的token
    var record = { token: token, x: x, y: y };

    var ctx = gm( assetsDir + img + '.png' ).resize( 300, 100, '!' );

    ctx.write( orignalFile, function(err) {
        if (err) return cb({ code: 'orignal-file', msg: err });

        var count = 0;
        var fn = function( who ) {
            return function( err, buffer ) {
                if ( err ) return cb({ code: who, msg: err });

                ret[ who ] = 'data: image/png;base64,' + buffer.toString('base64');

                if ( ++count === 3 ) cb( null, ret, record );
            }
        }

        gm( orignalFile ).toBuffer( fn( 'orignal' ) );

        gm( orignalFile )
        .crop( 40, 40, x, y )
        .fill( 'transparent' )
        .stroke( '#ffff00', 2 )
        .drawRectangle( 0, 0, 39, 39 )
        .toBuffer( fn( 'croping' ) );

        gm( orignalFile )
        .composite( maskFile )
        .geometry( '+' + x + '+' + y )
        .toBuffer( fn( 'croped' ) );
    });

    // orignal
    // ctx.write( orignalPath, function(err) {
    //     if ( err ) console.log('orignal err', err);
    // });

    // croping and croped
    // ctx.crop( region, region, x, y )
    //     .fill( 'transparent' )
    //     .stroke( '#ffff00', 1 )
    //     .drawRectangle( 0, 0, 39, 39 )
    //    .write( cropingPath, function(err) {
    //         if ( err ) return console.error('croped err', err);

    //         gm( orignalPath )
    //         .composite( path.resolve( __dirname, '../assets/mask.png' ) )
    //         .geometry( '+' + x + '+' + y )
    //         .write( cropedPath, function(err) {
    //             if (err) console.error('croped err', err);
    //         });
    //     });
}
