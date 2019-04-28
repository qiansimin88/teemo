import * as o from './options';

module.exports = {
    solid : function (){
        return new THREE.MeshBasicMaterial({ color : o.meshColor });
    },
    lambert : function (){
        return new THREE.MeshLambertMaterial({ color : o.meshColor });
    },
    d3 : function (){
        return new THREE.MeshPhongMaterial({ shininess: 50, shading: THREE.SmoothShading, color : o.meshColor });
    }
};  