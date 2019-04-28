import loader from './loader';
import config from './config';
import * as util from './util';
import material from './material';

const FILE_BROKEN = "无法读取文件,文件可能已经损坏!";
const NETWORK_ERROR = "请检查您的互联网连接是否正常";

var types = '(' + config.fileType.join("|") + ')';
var typeRe = new RegExp(`\.${types}$`, "i");

function loaderType ( name ){
    var $type = name.match( typeRe );
    return $type && $type[ 1 ];
}

function getExtension ( name ){
    return name.match( /\.(\w+)$/i )[ 1 ];
}

//from local
function fileLoader ( file, callback, progressCallback = () => {} ){
    let reader = new FileReader();
    let size = file.size;
    let extension = getExtension( file.name );
	extension = extension.toLowerCase();
    reader.addEventListener( 'load', e => {
        let contents = e.target.result;
        try {
            switch ( extension ) {
                case 'obj':
                    callback(util.loadOBJModel( contents ));
                    break;
                case 'stl':
                    callback(util.loadSTLModel( contents ));
                    break;
            }
        } catch ( e ){
            return callback({
               "message" : e.message === "NETWORK ERROR" ? NETWORK_ERROR : FILE_BROKEN
            });
        }
    }, false );

   reader.addEventListener( 'progress', progressCallback );

    //根据模型类型选择哪种读取方式
    switch( extension ){
        case 'stl' : {
            if ( !!reader.readAsBinaryString ) {
                reader.readAsBinaryString( file );
            } else {
                reader.readAsArrayBuffer( file );
            }
            break;
        }
        case 'obj' :
        case 'json': {
            reader.readAsText( file );
            break;
        }
    }
}

module.exports = ( file, progressCallback, from = 'local' ) => {
    var t = null;
    var method = '';
    if( file.type ){
        t = file.type.toUpperCase();
    } else {
        t = loaderType( file.name ).toUpperCase();
    }
    return new Promise(( resolve, reject ) => {
        //loadSTLLoader or loadOBJLoader
        method = t === 'STL' ? 'loadSTLLoader' : 'loadOBJLoader';
        util[method]().then(() => {
            if( from === 'local' ){
                fileLoader( file, resolve, progressCallback );
            } else {
                //from net name === url
                util[`load${t}ModelFromNet`]( file.remote, resolve, progressCallback );
            }
        });
    });
}
