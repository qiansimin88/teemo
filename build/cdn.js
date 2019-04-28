var fs = require("fs-extra");
var d = new Date - 0;
var argh = require('argh');
var argv = argh(process.argv);

//env
var env = process.env.NODE_ENV;
var isProduction = env === 'Production';

//supprt argv 
var cdn_pre_flag = argv.cdn_pre_flag;   //项目名称
var cdn_path = argv.cdn_path;   //alicdn地址  
var cdnKeyPrefix = cdn_pre_flag + '/' + d;
var defaultCDNBase = cdn_path + cdnKeyPrefix;

function writeCDNConfig (){
    fs.outputFileSync('./build/cdn.ready.json', JSON.stringify({
        time : d,	
        oss_secretAccessKey: argv.oss_secretAccessKey || 'P8CB1r5u7lvfzIrYKON78shh1lLotW',
        oss_accessKeyId: argv.oss_accessKeyId || 'aaV8vktEUjP2XudO',
        oss_endpoint: argv.oss_endpoint || 'http://oss-cn-hangzhou.aliyuncs.com',
        bucket_img: argv.bucket_img || '3dkerimage',
        defaultCDNBase : defaultCDNBase,
        cdnKeyPrefix : cdnKeyPrefix
    }, null, 4));	
}

function writeLessConfig (){
    var tpl = isProduction ? ( '"' + defaultCDNBase + '";' ) : '"";';
    var globalLessTpl = `
        @cdn_host:${tpl}
    `;
    fs.outputFileSync('./views/assets/global.less', globalLessTpl);
}

if( isProduction ){
    writeCDNConfig();
}
writeLessConfig();  



