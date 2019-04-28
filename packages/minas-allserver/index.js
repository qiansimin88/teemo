'use strict';
const request = require('request');
const Service = require('node-dubbo-comsumer');


//minas config
var url = flatStr(process.env.config_url) || 'http://minas.3dker.cn/minas/config/fetchConfig';
var accessId = flatStr(process.env.access_id) || 'e549c511670e44d48cca7100c1f2f2fe';
var accessSecret = flatStr(process.env.access_secret) || 'MjAxNi0wNy0xMSAwMzozOTo1Njo4NDY2MzhjOWI3ZjVkYmQ0MjdlOWIzNmNiZDE0NTQ0NTRhZA==';
var runMode = flatStr(process.env.run_mode) || 'Develop';
var branchId = flatStr(process.env.branch_id) || -1;
// var appName = util.flatStr(process.env.app_name) || 'phoneix_homepage';


function minas ( url, form ) {
    return new Promise((resolve, reject) => {
        url = url || '';
        form = form || {};
        if (url.indexOf('http') < 0 && url.indexOf('https') < 0) {
            return reject(new Error(`${url} Url Error`));
        }
        request.post(url, {
            form: form
        }, function(err, res, body) {
            if (err) {
                return reject(err);
            }
            try {
                body = JSON.parse(body);
            } catch (e) {
                return reject(e);
			}
			let pbody = '';
			let item = {};
            body.ret = body.ret || [];
            body.ret.forEach(function(v, k) {
				if (v.deleted === 'n') {
					item[v.keyName] = v.keyValue
				}
				// pbody = pbody + v.keyName + '=' + v.keyValue + '\n';
			});
			let rs = item;
			console.log( rs );
            resolve(rs);
        });
    });
};

/**
 * parse body to json
 */
function parse(body) {
	let rs = {};
	body = body.split(/\n/);
	body.forEach(function(v, k) {
		let t = v.split('=');
		if (t.length == 2) {
			// rs[t[0]] = t[1];
			let key = t[0];
			let value = t[1];
			let deps = key.split('.');
			let temp = rs;

			deps = deps.filter(function(item) {
				return (item !== '' && item);
			});

			for (var i = 0; i < deps.length; i++) {
				if (deps[i] === '' || !deps[i]) continue;

				if (i + 1 === deps.length) {
					temp[deps[i]] = value;
				} else {
					if (!temp[deps[i]]) temp[deps[i]] = {};
					temp = temp[deps[i]];
				}
			}
		}
	});
	return dateTypeConvert(rs);
}

/**
 * recur json convert type
 */
function dateTypeConvert(json) {
	json = json || {};
	if (typeof json !== 'object') {
		return type(json);
	}
	for (var i in json) {
		if (json.hasOwnProperty(i)) {
			if (typeof json[i] === 'object') {
				json[i] = dateTypeConvert(json[i]);
			}
			json[i] = type(json[i]);
		}
	}
	return json;
}

/**
 * convert string to number,array,boolean
 */
function type(item) {
	item = item || '';
	/**
	 * number
	 */
	if (!isNaN(Number(item)) && item !== '') {
		item = Number(item);
	}


	/**
	 * array
	 */
	if (item[0] === '[' && item[item.length - 1] === ']') {
		let ar = new Array();
		item = item.slice(1,item.length - 1) + ',';

		let begin = 0;
		let stack = new Array();
		for (var i = 0; i < item.length; i++) {
			let c = item[i];
			if (c === '[') {
				stack.push('[');
				continue;
			}
			if(c === ']'){
				stack.pop();
				/**
				 * the last unit add ',',to contunue the algorithm
				 */
			}
			if (c === ',' && stack.length === 0) {
				if (item.slice(begin, i ) !== ''){
					let r = type(item.slice(begin, i));
					ar.push(r);
				}
				begin = i + 1;
			}
		}
		item = ar;
	}

	/**
	 * boolean
	 */
	if (item === 'false' || item === 'true') item = item === 'false' ? false : true;

	/**
	 * string ,remove the redundant ' or "
	 */
	if(typeof item === 'string'){
		item = item.trim();
		if(item[0] === '\'' || item[0] === '"'){
			item = item.slice(1,item.length);
		}

		if(item[item.length-1] === '\'' | item[item.length-1] === '"'){
			item = item.slice(0,item.length - 1);
		}
	}

	/**
	 * if the string is eql null or undefined ,then convert it!
	 */
	if(item === 'null') item = null;
	if(item === 'undefined') item = undefined;
	return item;
}

function getServices(settings) {
    var services = {};
    var conf = {};
    for (let name in settings) {
        let set = settings[name];
        if (typeof set === "object" && set.path && set.env && set.conn) {
            services[name] = new Service(set);
        } else {
            conf[name] = set;
        }
    }

    return {
        services: Object.assign(services),
        conf: conf
    }
}


function flatStr( str ) {
	if( str ){
		if(str[0] === "'" || str[0] === '"') str = str.slice(1);
		var tail = str.length - 1;
		if(str[tail] === "'" || str[tail] === '"') str = str.slice(0,tail);
	}
	return str;
}


var done = false;


//注册
function loadConfig( app, appName ) {
    if( typeof appName === 'string' ) {
        app.use( '/' + appName, function ( req, res, next ) {
            requestMinas( appName )
                .then( _ => {
                    res.send( _ );
                } );
        } );
    }else if ( appName instanceof Array  ) {
        appName.map( _ => {
            app.use( '/' + _, function ( req, res, next ) {
                requestMinas( appName )
                .then( $ => {
                    res.send( $ );
                } );
            } );
        } );
    }

function requestMinas ( appName ) {
    return minas( url, {
        accessId: accessId,
        accessSecret: accessSecret,
        appName: appName,
        runMode: runMode,
        branchId: branchId
    } ).then( settings => {
        console.log( 44444 );
        console.log( settings );
        return settings;
    } );
}

    // if (done) return Promise.resolve(config);
    // return minas(url, {
    //     accessId: accessId,
    //     accessSecret: accessSecret,
    //     appName: appName,
    //     runMode: runMode,
    //     branchId: branchId
    // }).then(settings => {
    //     done = true;
    //     if (settings.panguAccessSecret) settings.panguAccessSecret += '==';
    //     console.log( settings );
    //     //挂载minas配置及services
    //     //@all, 所有minas配置包含services
    //     //@services, 所以在mianas配置都会自动加载
    //     const st = getServices(settings);
    //     _.assign(config, {
    //         all: settings,
    //         services: st.services,
    //         conf: st.conf
    //     });
    //     return config;
    // });
}



module.exports = loadConfig;