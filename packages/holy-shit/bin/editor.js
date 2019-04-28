import * as o from './options';
import * as util from './util';

export var scene = null;
export var camera = null;   
export var renderer = null;
export var light = null;
export var render = () => {};   
export var reload = () => {};
export var normalizeMesh = ( mesh ) => {
    //确定模型体积
    var box = new THREE.Box3().setFromObject( mesh );
    var size = box.getSize();
     //根据标准模型来缩放现有模型体积
    var scaling = (size.x / o.standard_x + size.y / o.standard_y + size.z / o.standard_z) / 3;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1 / scaling;
    return {
        mesh: mesh,
        size: size  //原始大小  
    }            
}

export function initialize ( container ) {
    //初始化场景
    scene = new THREE.Scene();  
    //初始化摄像机
    camera = new THREE.PerspectiveCamera( 45, o.width / o.height, 0.1, o.far );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 200;
    
    //初始化渲染器
    renderer = new THREE.WebGLRenderer({
        "antialias" : true,
        "precision" : "lowp",
        "alpha" : false,
        "premultipliedAlpha" : true,
        "stencil" : true,
        "preserveDrawingBuffer" : true,
        "depth" : true,
        "logarithmicDepthBuffer" : true 
    }); 
    renderer.setSize( o.width, o.height );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( o.clearColor ); 
    renderer.sortObjects = false;   
    renderer.autoUpdateScene = false;   
    container.appendChild( renderer.domElement );
    renderer.domElement.style.cssText += ';display:block;'; 
    render = () => {
        renderer.clear(); 
        renderer.render( scene, camera );
    }      
    reload = () => {
        camera.aspect = o.width / o.height;
        camera.updateProjectionMatrix();    
        renderer.setSize( o.width, o.height );   
        render(); 
    }   
    //创建灯光
    light = new THREE.HemisphereLight( 0xffffff, 0x000000, o.lightIntensity / 100 );   
    scene.add( light );    
}
