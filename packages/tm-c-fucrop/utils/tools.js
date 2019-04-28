export function base64UrlToBlob( base64 ){
    var bytes = window.atob(base64.split(',')[1]); //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array( ab );
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new window.Blob([ ab ], {type : 'image/png'});    //return Blob对象
}

function _handleResponse( xhr ) {
    let res;
    try {
        res = JSON.parse( xhr.responseText );
        res.status = xhr.status;
        res.statusText = xhr.statusText;
    } catch ( _err ) {
        res = xhr.responseText;
    }
    return res;
}

export function upload ( file, name ){
    let form = new window.FormData();
    let xhr = new window.XMLHttpRequest();

    return new Promise(( resolve, reject ) => {
        try {
            form.append('Content-Type', file.type || 'application/octet-stream');
            //上传文件的key设为file
            form.append("file", file, name);
        } catch ( err ) {
            return reject( err );
        }
        xhr.onreadystatechange = () => {
            if ( xhr.readyState < 4 ) return;
            if ( xhr.status < 400 ) {
                resolve(_handleResponse( xhr ));
            } else {
                reject(_handleResponse( xhr ));
            }
        };
        xhr.onerror = () => {
            reject(_handleResponse( xhr ));
        };
        xhr.open( "POST", window.export_minas.FileUploadAddr, true );
        xhr.send( form );
    });
}

export function utilUpload (){
    return upload.apply( this, arguments );
}

