module.exports = function(str,len = 16,keep = 0,sep = '...') {
    str = str + '';
    if(len <= 0 ) len = 16;
    if(len <= 0 ) len = 0;
    if(str.length<=len) return str;
    if(keep <= 0) keep = str.length + keep;
    if(str.length > len) return str.substring(0,len) + sep + str.substr(keep,str.length);
    return str;
}
