import * as o from './options';
import material from './material';
import * as editor from './editor';

var str = Object.prototype.toString;
var colorPickerOptions = {
    layout : 'hex',
    submit : 0
};

export function nextTick ( cb ){
    //解决 setImmediate 兼容问题
    //所有模型解析相关统一调用 setImmediate 函数， 尽快释放UI线程
    return setImmediate( cb ) || (( handle ) => {
      let args = Array.prototype.slice.call(arguments,1);
      let invoke = () => { handle.apply( this, args ); };
      if( window.Promise )  
        Promise.resolve().then(invoke); 
      else if( !-[1,] ){
        let head = document.documentElement.firstChild;
        let script = document.createElement("script");
        script.onreadystatechange = () => {
          script.onreadystatechange = null;
          head.removeChild( script );
          invoke();
        };
        head.appendChild( script );
      }else setTimeout( invoke );
    })( cb );
}

export function bit2Mb ( size ){
    return size / 1e6;
}

export function fullScreenChange (){
    if( 'onwebkitfullscreenchange' in document ){
        return 'webkitfullscreenchange';
    } else if( 'onmozfullscreenchange' in document ){
        return 'mozfullscreenchange';
    } else {
        return 'fullscreenchange'; 
    }
}

export function getCurSize (){  
    var isNotFull = o.fullScreenScore % 2 === 0;
    var scale = isNotFull ? 0.9 : 1;    
    return {    
        width: document.body.clientWidth * scale,
        height: document.body.clientHeight * scale
    }       
};  

export function isFile ( f ){
    return "[object File]" === str.call( f );
};

export function isSTL ( name ){
    return /\.stl$/i.test( name );  
};

export function isOBJ ( name ){
    return /\.obj$/i.test( name );  
};

export function isModel ( name ){
    return isSTL( name ) || isOBJ( name );  
}   

function normalizeGeometry ( geo ){
    return geo instanceof THREE.BufferGeometry 
            ? ( new THREE.Geometry ).fromBufferGeometry( geo )   
            : geo;  
}   

function _loadSTLModel ( geometry ){
    geometry = normalizeGeometry( geometry );
    geometry.sourceType = "stl";
    geometry.verticesNeedUpdate = false;
    geometry.center();
    geometry.computeVertexNormals();    
    geometry.computeFaceNormals();
    return new THREE.Mesh( geometry, material.lambert() );  
}

function _loadOBJModel ( object ){
    object.geometry = normalizeGeometry( object.geometry );
    object.geometry.center();
    return new THREE.Mesh( object.geometry, material.lambert() );
}   

export function loadOBJModel ( contents ){
    return _loadOBJModel( new THREE.OBJLoader().parse( contents ).children[0] );
}
    
export function loadOBJModelFromNet ( url, callback, progress ){
    let loader = new THREE.OBJLoader();
    loader.load( url, ( object ) =>  {
        callback( _loadOBJModel( object.children[ 0 ] ));
    }, progress );      
} 

export function loadSTLModel ( contents ){
    return _loadSTLModel( new THREE.STLLoader().parse( contents ) );
}   

export function loadSTLModelFromNet ( url, callback, progress ){
    let loader = new THREE.STLLoader();
    loader.load( url, geometry => {
        callback(_loadSTLModel( geometry ));
    }, progress );
}   

export function getModelSize ( mesh ){
    var box = new THREE.Box3().setFromObject( mesh );
    var size = box.getSize();  
    return {    
        x : size.x.toFixed(2),
        y : size.y.toFixed(2),
        z : size.z.toFixed(2)
    }
}

//当模型含有pisition属性,或children里含有position属性,
//数据结构是一个大数组,按照x,y,z的顺序排列下来
//所以每9个数为一个三角形
export function surfacePositionWay ( vf ){

    var surfaceArea = 0 ;

    for( var i = 0, len = vf.length - 3; i < len; i+= 3 ){

        var x1 = vf[ i ].x,
            y1 = vf[ i ].y,
            z1 = vf[ i ].z;

        var x2 = vf[ i + 1 ].x,
            y2 = vf[ i + 1 ].y,
            z2 = vf[ i + 1 ].z;

        var x3 = vf[ i + 2 ].x,
            y3 = vf[ i + 2 ].y,
            z3 = vf[ i + 2 ].z;

        var ax = x2 - x1,
            bx = x3 - x1,

            ay = y2 - y1,
            by = y3 - y1,

            az = z2 - z1,
            bz = z3 - z1;

        //表面积计算公式
        var tp1 = ay * bz - az * by,
            tp4 = tp1 * tp1,
            tp2 = az * bx - ax * bz,
            tp5 = tp2 * tp2,
            tp3 = ax * by - ay * bx,
            tp6 = tp3 * tp3;

        surfaceArea += Math.sqrt( tp4 + tp5 + tp6 );
    }

    return surfaceArea;
}




//当模型含有vertex属性,或children里含有vertex属性,
//数据结构是一个大数组,其内容为object { x : 1, y : 1, z : 1 }
//所以每3个数为一个三角形
function surfaceVertexWay (){

    var surfaceArea = 0 ;
    var vf = _info.verticesArray;

    for( var i = 0, len = vf.length; i < len; i += 3 ){

        var x1 = vf[i].x,
            y1 = vf[i].y,
            z1 = vf[i].z;

        var x2 = vf[i+1].x,
            y2 = vf[i+1].y,
            z2 = vf[i+1].z;

        var x3 = vf[i+2].x,
            y3 = vf[i+2].y,
            z3 = vf[i+2].z;

        var ax = x2 - x1,
            bx = x3 - x1,

            ay = y2 - y1,
            by = y3 - y1,

            az = z2 - z1,
            bz = z3 - z1;

        var tp1 = ay * bz - az * by,
            tp4 = tp1 * tp1,
            tp2 = az * bx - ax * bz,
            tp5 = tp2 * tp2,
            tp3 = ax * by - ay * bx,
            tp6 = tp3 * tp3;

        surfaceArea += Math.sqrt( tp4 + tp5 + tp6 );
    }

    return surfaceArea;
}

function getMeshSurfaceArea (){

    if( !_info.unknow && _info.ways == "position" ){
        return surfacePositionWay().toFixed(2);
    } else if(  !_info.unknow && _info.ways == "vertices" ){
        return surfaceVertexWay().toFixed(2);
    } else {
        return "未知";
    }
}


function getMeshVolume (){
    return ( _info.size.x * _info.size.y * _info.size.z ).toFixed( 2 );
}

function getMeshDensity (){
    return ( getMeshVolume() / _info.vertices ).toFixed( 2 );
}

function THREEPlugins (){
    THREE.Object3D.prototype.clear = function(){
        let children = this.children;
        for(let i = children.length-1;i>=0;i--){
            let child = children[i];
            if( child instanceof THREE.Mesh ){
                child.clear();
                this.remove( child );
            }
        }
    };
}

export function loadTHREE (){
    return new Promise(( resolve, reject ) => {
        if( window.THREE ) return resolve( window.THREE );
        require(['../assets/three.js'], THREE => {
            window.THREE = THREE;       
            THREEPlugins(); 
            resolve( window.THREE );    
        });  
    });
};

export function loadControl (){
    return new Promise(( resolve, reject ) => {
        if( window.THREE && window.THREE.TrackballControls ){
            resolve( true );        
        } else {
            require(['../assets/controls/TrackballControls.js'], resolve);
        }
    });     
};

export function loadSTLLoader (){
    return new Promise(( resolve, reject ) => {
        if( window.THREE && window.THREE.STLLoader ){
            resolve( true );
        } else {
            require(['../assets/loader/STLLoader.js'], resolve);
        }
    });
};   
export function loadOBJLoader (){
    return new Promise(( resolve, reject ) => {
        if( window.THREE && window.THREE.OBJLoader ){
            resolve( true );
        } else {
            require(['../assets/loader/OBJLoader.js'], resolve);
        }
    });
};  

export function loadColorPick (){
    return new Promise(( resolve, reject ) => {
        if( window.ColorPicker ){
            resolve( true );        
        } else {
            require(['../assets/colpick.js'], resolve);
        }       
    });
}
