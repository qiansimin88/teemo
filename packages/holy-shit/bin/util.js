export function isSTL ( name ){
    return /\.stl$/i.test( name );  
};

export function isOBJ ( name ){
    return /\.obj$/i.test( name );  
};

export function isModel ( name ){
    return isSTL( name ) || isOBJ( name );  
}   

export function normalizeGeometry ( geo ){
    return geo instanceof THREE.BufferGeometry 
            ? ( new THREE.Geometry ).fromBufferGeometry( geo )   
            : geo;  
}   

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

export function uuid() {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''), 
        uuid = new Array(36), 
        rnd=0, 
        r;

    for (let i = 0; i < 36; i++) {
        if (i==8 || i==13 ||  i==18 || i==23) {
            uuid[i] = '-';
        } else if (i==14) {
            uuid[i] = '4';
        } else {
            if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
    }
    
    return uuid.join('');
}

function signedVolumeOfTriangle ( point1, point2, point3 ) {
        var v321 = point3.x * point2.y * point1.z;
        var v231 = point2.x * point3.y * point1.z;
        var v312 = point3.x * point1.y * point2.z;
        var v132 = point1.x * point3.y * point2.z;
        var v213 = point2.x * point1.y * point3.z;
        var v123 = point1.x * point2.y * point3.z;
        return (1.0 / 6.0) * (-v321 + v231 + v312 - v132 - v213 + v123);
    }

function signedSurfaceOfTriangle ( point1, point2, point3 ) {
    var ax = point2.x - point1.x;
    var ay = point2.y - point1.y;
    var az = point2.z - point1.z;
    var bx = point3.x - point1.x;
    var by = point3.y - point1.y;
    var bz = point3.z - point1.z;       
    var cx = ay * bz - az * by;
    var cy = az * bx - ax * bz;
    var cz = ax * by - ay * bx;
    return 0.5 * Math.sqrt(cx * cx + cy * cy + cz * cz);
}

export function calcVol(data) {
    var vol = 0;    
    var area = 0;   
    var faces = data[ 1 ];
    var vertices = data[ 0 ];

    for (var i = 0, len = data[1].length; i < len; i++) {     
        vol += signedVolumeOfTriangle( vertices[ faces[i].a ], vertices[ faces[i].b ], vertices[ faces[i].c ]);
        area += signedSurfaceOfTriangle( vertices[ faces[i].a ], vertices[ faces[i].b ], vertices[ faces[i].c ]);
    }
    vol = vol / 1000;
    area = area / 100;
    return {
        vol: vol, 
        area: area
    };  
}