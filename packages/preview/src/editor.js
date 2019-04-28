import * as o from './options';
import * as util from './util';

export var scene = null;
export var camera = null;
export var renderer = null;
export var light = null;
export var controls = null;
export var reload = () => {};
export var render = () => {};
export var cMesh = null;
export var clearAll = () => {};
export var objectsAdd = ( mesh ) => {
    //确定模型体积
    var box = new THREE.Box3().setFromObject( mesh );
    var size = box.getSize();
     //根据标准模型来缩放现有模型体积
    var scaling = (size.x / o.standard_x + size.y / o.standard_y + size.z / o.standard_z) / 3;
    mesh.scale.x = mesh.scale.y = mesh.scale.z = 1 / scaling;
    //重新计算模型体积
    box = new THREE.Box3().setFromObject( mesh );
    size = box.getSize();

    var mArea = ( o.width * o.height ) / ( size.y * size.x );
    //根据面积 和 标准面积再次缩放模型大小
    if( mArea < 200 ) {
        scaling /= mArea / 200;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1 / scaling;
        //重新计算模型体积
        box = new THREE.Box3().setFromObject( mesh );
        size = box.getSize();
    }

    //获取模型最大面,并rotate模型到最大面
    var aA = size.x * size.y,
        aB = size.y * size.z,
        aC = size.z * size.x;
    // b 面最大的情况
    if( aB > aA && aB > aC ){
        mesh.rotateY( o.deg90 );
    }
    // c 面最大的情况
    else if( aC > aA && aC > aB ){
        mesh.rotateX( o.deg90 );
    }
    //可能scene被设为null了：）
    if( scene ){
        scene.add( mesh );
        cMesh = mesh;
        o.resetMatrix = cMesh.matrix;
    }
    return true;
}

export function initialize () {
    var container = document.querySelector('.vue-preview-stage');
    //初始化场景
    scene = new THREE.Scene();
    //初始化摄像机
    camera = new THREE.PerspectiveCamera( 30, o.width / o.height, 0.1, o.far );
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 200;

    //初始化渲染器
    renderer = new THREE.WebGLRenderer({
        "antialias" : false,
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

    //创建灯光
    light = new THREE.HemisphereLight( 0xffffff, 0x000000, o.lightIntensity / 100 );
    scene.add( light );

	// light = new THREE.SpotLight( 0xffffff, 1.5 );
	// light.position.set( 0, 1500, 200 );
	// light.castShadow = true;
	// light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 70, 1, 200, 2000 ) );
	// light.shadow.bias = - 0.000222;
	// light.shadow.mapSize.width = 1024;
	// light.shadow.mapSize.height = 1024;
	// scene.add( light );

	// 创建网格
	var helper = new THREE.GridHelper( 2000, 100 );
	helper.position.y = - 199;
	helper.material.opacity = 0.25;
	helper.material.transparent = true;
	scene.add( helper );


	//创建控制器
    controls = new THREE.TrackballControls( camera, renderer.domElement );
    controls.minDistance = o.minDistance;
    controls.maxDistance = o.maxDistance;
    controls.addEventListener('change', render);

    reload = () => {
        let { width, height } = util.getCurSize();
        height -= o.extraHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize( width, height );
        render();
        controls.handleResize();
    }
    animate();
    function animate (){
        var at = requestAnimationFrame( animate );
        animate.at = at;
        controls.update();
    }
    window.removeEventListener( o.resizeEvt, reload );
    window.addEventListener( o.resizeEvt, reload );
    clearAll = () => {
        cancelAnimationFrame( animate.at );
        scene = camera = renderer = light = controls = cMesh = reload = animate = null;
    }
}
