module.exports = function ( dom ){
    var unit = 80;
    var step = 5;

    var size = {
        width : dom.clientWidth,
        height: dom.clientHeight
    };
    const aspect = size.width / size.height;

    //初始化场景 
    var scene = new THREE.Scene();
    //初始化摄像机
    var camera = new THREE.PerspectiveCamera( 50, 0.5 * aspect, 1, 10000 );
    camera.position.set( 110, -140, 220 );
    camera.up.set( 0, 0, 1 );

    //helper
    var boxHelper = new THREE.BoxHelper();
    boxHelper.material.linewidth = 1.2; 
    boxHelper.material.color.setHex(0x000000);
    boxHelper.material.depthFunc = THREE.AlwaysDepth;
    scene.add( boxHelper );

    //初始化灯光
    scene.add( new THREE.HemisphereLight( 0x443333, 0x111122 ) );
    addShadowedLight( 1, 1, 1, 0xffffff, 1.35 );
    addShadowedLight( 0.5, 1, -1, 0xffaa00, 1 );
    //初始化渲染器
    var renderer = createRenderer();    
    renderer.setSize( size.width , size.height );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( 0xEDF1F6 );
    renderer.sortObjects = false;
    renderer.autoUpdateScene = false;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.renderReverseSided = false;
    dom.appendChild( renderer.domElement );

    //初始化控制器
    var controls = new THREE.EditorControls( camera, dom );
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.addEventListener( 'change', render );  
    controls.focus( new THREE.Object3D() );
    
    //初始化地面
    createGrid();   
    //
    createRule();
    //渲染
    render();

    //重置摄像机
    function cameraReset (){
        camera.position.set( 110, -140, 220 );
        camera.up.set( 0, 0, 1 );
        camera.lookAt( scene.position );
        controls && controls.focus( new THREE.Object3D() );
    }
        
    function createRenderer (){
        return new THREE.WebGLRenderer({
            "antialias" : true,
            "precision" : "lowp",
            "alpha" : false,    
            "premultipliedAlpha" : true,
            "stencil" : true,
            "preserveDrawingBuffer" : true,
            "depth" : true,
            "logarithmicDepthBuffer" : true
        });
    }

    function render() {
        boxHelper.update();
        renderer.render( scene, camera );
    }

    function addShadowedLight( x, y, z, color, intensity ) {
        var d = 1;
        var directionalLight = new THREE.DirectionalLight( color, intensity );
        directionalLight.position.set( x, y, z );
        scene.add( directionalLight );
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -d;
        directionalLight.shadow.camera.right = d;
        directionalLight.shadow.camera.top = d;
        directionalLight.shadow.camera.bottom = -d;
        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 4;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.bias = -0.005;
    }   

    function createGrid (){
        //grid 正负75mm, 每格5mm
        let color = 0x999999;
        let geometry = new THREE.Geometry();
        for ( let i = - unit; i <= unit; i += step ) {
            geometry.vertices.push( new THREE.Vector3( - unit, i, 0 ) );
            geometry.vertices.push( new THREE.Vector3(   unit, i, 0 ) );
            geometry.vertices.push( new THREE.Vector3( i, - unit, 0 ) );
            geometry.vertices.push( new THREE.Vector3( i, unit, 0 ) );
        }   
        let material = new THREE.LineBasicMaterial({ color: color });
        let gridHelper = new THREE.LineSegments( geometry, material );
        scene.add( gridHelper );
        // 网格分界线
        step = 20; geometry = new THREE.Geometry();
        for ( let i = -unit; i <= unit; i += step ) {
            geometry.vertices.push( new THREE.Vector3( - unit, i, 0 ) );
            geometry.vertices.push( new THREE.Vector3( unit, i, 0 ) );
            geometry.vertices.push( new THREE.Vector3( i, - unit, 0 ) );
            geometry.vertices.push( new THREE.Vector3( i, unit, 0 ) );
        }
        var gridHelper2 = new THREE.LineSegments( geometry,
            new THREE.LineBasicMaterial({ color: color, linewidth: 2 }));
        scene.add( gridHelper2 );  
    }       

    function createRule (){
        let fontLoader = new THREE.FontLoader();
        fontLoader.load(process.env.CDN + '/statics/js/oberon_italic.js', ( font ) => {
            let fontMetrial = new THREE.MeshBasicMaterial({ color: 0x40bde6, transparent: true, opacity: 0.6 });
            let fixedY = -unit - 6, fixedX = unit + 5;
            let constuctLabel = ( text, pX, pY, radian = Math.PI / 2 ) => {
                let g = new THREE.TextGeometry( text, { font: font, size: 2, height: 0.1 } );
                let m = new THREE.Mesh( g, fontMetrial );
                m.position.set( pX, pY, 0  );
                m.rotateZ( radian );
                scene.add( m );
            }   
            constuctLabel( '0', fixedX, -1 );
            constuctLabel( '0', 1, fixedY );
            for ( let i = step, j = 1.2; i <= unit; i += step, j += 0.1 ) {
                constuctLabel( i, fixedX, i - j );
                constuctLabel( -i, fixedX, -i - j - 0.7 );
                constuctLabel( i, i + j - 0.7, fixedY );
                constuctLabel( -i, -i + j - 0.4, fixedY );
            }
            render();
        }); 
    }

    function resize() {
        camera.aspect = dom.clientWidth / dom.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( dom.clientWidth, dom.clientHeight );
    }

    window.addEventListener( 'resize', resize, false );

    return {
        scene: scene,
        controls: controls,
        camera: camera,
        render: render,
        renderer: renderer,
        boxHelper: boxHelper,
        cameraReset: cameraReset,
        resize: resize
    }
}