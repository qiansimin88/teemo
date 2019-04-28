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