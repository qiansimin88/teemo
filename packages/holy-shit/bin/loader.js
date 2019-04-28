import * as deps from './dep';
import * as editor from './editor';
import * as o from './options';
import axios from 'axios';

const FILE_BROKEN = "无法读取文件,文件可能已经损坏!";
const NETWORK_ERROR = "请检查您的互联网连接是否正常";

export default class {
    constructor ( file, from = 'local', progressCb ){
        var FileConstructor = from === 'local' ? FileRead : FileRemoteRead;
        this.fr = new FileConstructor( file, progressCb );
        return this.fr.then( mesh  => { 
            return Promise.resolve(editor.normalizeMesh( mesh ));
        });     
    }   
}   

class Loader {  
    constructor ( type ){
        type = type.toUpperCase();
        this.loader = new THREE[ type + 'Loader' ]();
        this.material = new THREE.MeshPhongMaterial({ shininess: 50, shading: THREE.SmoothShading, color : o.meshColor });
    }
    local ( contents ){
        return this.load( this.loader.parse( contents ) ); 
    }
    download ( url, progressCb ){
        return new Promise((resolve, reject) => {
            axios.get( url, {
                responseType: 'arraybuffer',
                onDownloadProgress ( event ) {
                    progressCb( event.loaded );
                }   
            }).then( mesh => {  
                resolve(this.local( mesh.data ));
            }).catch( e => {
                reject( e );
            }); 
        });
    }   
}       

//通过stl loader加载模型
class STLLoader extends Loader {
    constructor (){
        super('stl');
    }
    load ( geometry ){  
        geometry = normalizeGeometry( geometry );
        geometry.sourceType = "stl";
        geometry.verticesNeedUpdate = false;
        geometry.center();
        geometry.computeVertexNormals();        
        geometry.computeFaceNormals();
        return new THREE.Mesh( geometry, this.material );
    }
}

class OBJLoader extends Loader {
    constructor (){ 
        super('obj');
    }
    load ( object ){    
        object = object.children[ 0 ];
        object.geometry = normalizeGeometry( object.geometry );
        object.geometry.center();
        return new THREE.Mesh( object.geometry, this.material );
    }  
}   

class FileRemoteRead {
    constructor ( file, progressCb ){
        return this.load( file, progressCb );
    }
    load ( file, progressCb ){
        var extension = file.type || getExtension( file.name ); 
        return new Promise(( resolve, reject ) => {
            //根据模型类型选择哪种读取方式
            switch( extension ){
                case 'stl' : {
                    deps.loadSTLLoader().then(()=> {
                        //优先使用remote字段
                        resolve((new STLLoader()).download( file.remote || file.name, loaded => {
                            progressCb(parseInt(((loaded / file.size) * 100)));    
                        }));        
                    }); 
                    break;
                }   
                case 'obj' : {  
                    deps.loadOBJLoader().then(() => {
                        resolve((new OBJLoader()).download( file.remote || file.name ));
                    });
                    break;
                }
                case 'json': {
                    break;  
                }           
            }
        });
    }
}

//读取本地文件
class FileRead {
    constructor ( file ){
        this.reader = new FileReader(); 
        this.load( file );
        return new Promise(( resolve, reject ) => {
            this.reader.addEventListener('load', e => {
                let contents = e.target.result;
                try {       
                    switch ( this.extension ) { 
                        case 'obj':
                            deps.loadOBJLoader().then(() => {
                                resolve((new OBJLoader()).local( contents ));
                            }); 
                            break;  
                        case 'stl':
                            deps.loadSTLLoader().then(() => {
                                resolve((new STLLoader()).local( contents ));
                            }); 
                            break;              
                    }   
                } catch ( e ){  
                    return reject({   
                        "message" : e.message === "NETWORK ERROR" ? NETWORK_ERROR : FILE_BROKEN
                    });
                }
            }, false );  
            this.reader.addEventListener( 'progress', () => {
            });
        });
    }
    load ( file ){
        this.extension = getExtension( file.name ) || file.type;
        //根据模型类型选择哪种读取方式
        switch( this.extension ){
            case 'stl' : {
                if ( !!this.reader.readAsBinaryString ) {
                    this.reader.readAsBinaryString( file );
                } else {
                    this.reader.readAsArrayBuffer( file );
                }
                break;      
            }
            case 'obj' : 
            case 'json': {
                this.reader.readAsText( file );
                break;
            }       
        }
    }   
}   

function getExtension ( name ){
    var re = name.match( /\.(\w+)$/i )[ 1 ];
    return re && re.toLowerCase();  
}       

function normalizeGeometry ( geo ){
    return geo instanceof THREE.BufferGeometry 
            ? ( new THREE.Geometry ).fromBufferGeometry( geo )   
            : geo;  
}       