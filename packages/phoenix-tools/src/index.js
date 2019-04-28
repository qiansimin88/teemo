//tools.url.search


/*
    import { url } from 'tools';
    url.search('hello');
*/

import ossImageUtils from './ossImgUtil';
import ossImgUtilEn from './ossImgUtil_en';
import byteTranUtil from './byteTranUtil';
import dateTimeUtil from './dateTimeUtil';
import cross from './cross';   

function UriBuilder( url ) {
    var query;
    this.params = {};
    [ this.baseUrl, query ] = url.split("?");
    if (query) {
        query.split('&').forEach(function (v) {
        var [key, value] = v.split("=");
        this.params[key] = decodeURIComponent(value);
        }, this);
    }
    this.build = function() {
        var query = "";
        for (var key in this.params) {
        query += "&" + key + "=" + encodeURIComponent(this.params[key]);
        }
        return this.baseUrl + (query ? "?" + query.slice(1) : "");
    }
}

class Url {
    constructor (){
        this.uri = new UriBuilder( location.href );
        this.query = this.uri.params;
    }
    search ( key ){
        return this.uri.params[ key ];
    }
    build (){
        this.uri.build();
    }
    object2Query ( o ){
        var k = Object.keys( o );
        var options = k.map( l => {
            return l + '=' + o[ l ];
        });
        return options.join("&");
    }
}

export var url = new Url();
export var oss = ossImageUtils;
export var ossEn = ossImgUtilEn;
export var byte2Util = byteTranUtil;
export var dateUtil = dateTimeUtil;
export var crossUtil = cross;   
