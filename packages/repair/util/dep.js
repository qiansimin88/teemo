export function loadTHREE (){
    return new Promise(( resolve, reject ) => {
        if( window.THREE ){
            return resolve( window.THREE );
        }
        require(['../assets/three.js'], ( THREE ) => {
            window.THREE = THREE;       
            THREEPlugins(); 
            resolve( window.THREE );    
        });  
    });
};  

export function loadSTLLoader (){
    return new Promise(( resolve, reject ) => {
        if( window.THREE && window.THREE.STLLoader ){
            resolve( window.THREE.STLLoader );
        } else {
            require(['../assets/loader/STLLoader.js'], resolve);
        }
    });
};   

export function loadSTLExporter (){
    return new Promise(( resolve, reject ) => {
        if( window.THREE && window.THREE.STLExporter ){
            resolve( window.THREE.STLExporter );
        } else {
            require(['../assets/exporter/STLExporter.js'], resolve);
        }
    });
};

export function loadEditorControl (){
    return new Promise(( resolve, reject ) => {
        if( window.THREE && window.THREE.EditorControls ){
            resolve( window.THREE.EditorControls );
        } else {
            require(['../assets/EditorControls.js'], resolve);
        }
    });
};  

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