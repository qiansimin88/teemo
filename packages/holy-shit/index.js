import * as editor from './bin/editor';
import * as dep from './bin/dep';
import * as o from './bin/options';
import Loader from './bin/loader';
import { nextTick, calcVol } from './bin/util';

var ctx = document.createElement('div');
ctx.style.display = 'none';
document.body.appendChild( ctx );       
var isInit = false; 

function modelCalc ( mesh ){
    //按照3dzao的算法来吧...
    var box = mesh.geometry.boundingBox;
    var sizes = {
        x: ( box.max.x - box.min.x ),
        y: ( box.max.y - box.min.y ),
        z: ( box.max.z - box.min.z )
    };      
    const ret = calcVol([ mesh.geometry.vertices, mesh.geometry.faces ]);
    return {
        sizes: {
            x : sizes.x.toFixed(3),
            y : sizes.y.toFixed(3),
            z : sizes.z.toFixed(3)
        },
        area: ret.area.toFixed(2), //表面积
        vol: ret.vol.toFixed(2) //体积   
    };
}   

module.exports = {      
    load ( files ){
        return dep.loadTHREE().then(() => { 
            //每一个页面只生成一个实例
            if( !isInit ){  
                isInit = true;  
                editor.initialize( ctx ); 
            } 
            return Promise.resolve( this.shot( [ files ] ));          
        });     
    },      
    calc: modelCalc,           
    shot ( files ){
        var originFiles = files;
        //这里用闭包的原因是缓存originFiles信息不被篡改  
        return function ( width = 80, height = 80, callback = () => {}, progressCb = () => {} ) {   
            o.width = width;
            o.height = height;  
            editor.reload();        
            var shotTasks = originFiles.map(f => {
                return new Promise(( resolve, reject ) => {
                    //优先判断remote字段
                    new Loader( f, (!!f.remote || isRemote( f.name )) ? 'remote' : 'local', progressCb).then(({ mesh, size }) => {
                        var { area, vol, sizes } = modelCalc( mesh );

                        //保存4张图
                        //这样稳：）
                        editor.scene.clear();
                        editor.render();        

                        editor.scene.add( mesh );
                        editor.render();
                        //:)    

                        var base64Collects = [];
                        var st = slice4Pic( mesh );

                        base64Collects.push( st( 'x', 0 ) );    
                        base64Collects.push( st( 'x', 90 ) );
                        base64Collects.push( st( 'y', 90 ) );
                        base64Collects.push( st( 'z', 90 ) );
                        
                        //返回name, 和对应的base64方便对应关系  
                        resolve({   
                            base64: base64Collects,
                            volume: sizes,          
                            area: area,
                            vol: vol,   
                            type: f.type,   
                            name: f.name,   
                            size: size    //这里取原始模型的size     
                        });         
                    })
                    .catch( reject );        
                });
            });         
            return Promise.all(shotTasks).then(data => {
                data.forEach(( chunk, index ) => {
                    return callback( null, chunk );
                }); 
            }, reason => {  
                return callback( reason );
            });
        }
    },   
    destory (){
    }
}       

function slice4Pic ( mesh ){
    var t = mesh;   
    return ( direction, deg ) => {  
        t.rotation[ direction ] += deg;
        editor.render();    
        var base64 = ctx.children[ 0 ].toDataURL();
        t.rotation[ direction ] -= deg;
        return base64;
    }
}   

function isRemote ( name ){
    return /^http(s):\/\//.test( name );
}  