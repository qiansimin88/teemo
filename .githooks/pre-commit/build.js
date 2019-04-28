#!/usr/bin/env node
console.log('git钩子');
var fs = require('fs-extra');
var gulp = require("gulp");
var path = require("path");
var root = path.join(process.cwd(), '/packages');
var exclude = /node_modules\//i;    
var exec = require('child_process').exec;
var p = 'package.json';

//过滤非README.MD文件及node_modules里的md文件
var files = fs.walkSync( root );   
files = files.filter(function ( f ){
    return /README\.md/i.test( f ) && !exclude.test( f );
});     

var rst = {};
//获取项目名及对应的markdown文件路径
files.map(function ( f ){
    var t = f.match(/\/packages\/(.+)\//i)[ 1 ];
    var lastl = f.lastIndexOf('/');
    var selfPkg = f.slice( 0, lastl + 1 ) + p;
    try {
        var pkg = fs.readJsonSync( selfPkg ); 
        rst[ pkg.name ] = {     
            "href" : f.replace( root, '' ),
            "name" : pkg.name,
            "version" : pkg.version,
            "author" : pkg.author || "雷锋",  
            "description" : pkg.description,
            "es6plugins" : pkg.es6plugins || false,
            "license" : pkg.license || "MIT"    
        }           
    } catch ( e ){}     
});
//写入docx.json文件
fs.outputFileSync('./docx.json', JSON.stringify( rst, 0, 4 ));
//将docx.json文件加入git 提交记录
exec('git add ./docx.json');            