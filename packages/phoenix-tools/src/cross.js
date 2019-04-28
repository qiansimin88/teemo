var isClient = typeof global === 'undefined';

const cr = isClient ? location.hostname : '//3dker.cn/';
const hp = {
    'localhost': '//develop.3dker.cn/',
    'develop.admin.3dker.cn' : '//develop.3dker.cn/',
    'daily.admin.3dker.cn': '//daily.3dker.cn/',
    'test.admin.3dker.cn': '//test.3dker.cn/',
    'admin.3dker.cn': '//3dker.cn/'         
};

module.exports = ( url ) => {
    if( url.charAt( 0 ) === '/' ) url = url.slice( 1 );
    return ( hp[ cr ] || '//3dker.cn/' ) + url;
}   