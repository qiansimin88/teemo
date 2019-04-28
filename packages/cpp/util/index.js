var padding = 30;
var isFullScreen = false;
var ua = navigator.userAgent;

// scale

const swu = 50;
const shu = Math.ceil(50 * 720 / 1080);
const max_sprite_width = 1080;
const max_sprite_height = 720;
const min_sprite_width = 375;
const min_sprite_height = 250;
export var cw = 0;
export var ch = 0;

export function resetScale (){
    cw = 0;
    ch = 0;
};

//增加scale
export function enlargeScale ( sw, sh ){
    if( sw + swu > max_sprite_width || sh + shu > max_sprite_height ) return;
    cw += swu;
    ch += shu;
};

//减少scale
export function shrinkdownScale ( sw, sh ){
    if( sw - swu < min_sprite_width || sh - shu < min_sprite_height ) return;
    cw -= swu;
    ch -= shu;
};

//util

export function isMobile (){
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        isIphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        isAndroid = ua.match(/(Android)\s+([\d.]+)/);
    return isIphone || isAndroid;
}

export function updateFullScreen (){
    isFullScreen = !isFullScreen;
}

export function closeFullScreen (){
    isFullScreen = false;
}

export function openFullScreen (){
    isFullScreen = true;
}

export function imagePath ( id ){
    var s = screen();

    s.cWidth += cw;
    s.cHeight += ch;    

    s.cWidth = Math.ceil( s.cWidth );
    s.cHeight = Math.ceil( s.cHeight );

    return function ( x, y ){
        return `${process.env.CDN}/preview/${id}/${x}_${y}@${s.cWidth}w_${s.cHeight}h.jpg`;
    }
} 

export function screen (){
    var w = document.body.clientWidth;
    var h = document.body.clientHeight;
    var aspect = w / h;

    //非全屏状态
    //container 宽度为浏览器宽度的70%, ,有 15 * 2 padding的白色边框
    //高度按照屏幕的aspect生成
    if( !isFullScreen ){
        w *= 0.7;
        h = w / aspect;
        padding = 30;
    //全屏状态下
    //container 宽高占满100%, 白色边框消失
    } else {
        padding = 0;
    }

    return {
        width: Math.ceil(w),
        height: Math.ceil(h),
        cWidth: Math.ceil(w - padding), //canvas宽高为container宽高减去padding的值
        cHeight: Math.ceil(h - padding),
        aspect: aspect
    }
}


// 经度[0,355],维度[0,355]
const limit = {
    min: {
        x: 0, 
        y: 0
    },
    max: {
        x: 355,
        y: 355
    }
};

//限定不超出x, y最大值
export function normalize ( x, y ){
    var nx = x;
    var ny = y;

    if( nx < limit.min.x ){
        nx = limit.max.x;
    }
    else if( nx > limit.max.x ){
        nx = limit.min.x;
    }
    else {
        nx = x;
    }

    if( ny < limit.min.y ){
        ny = limit.max.y;
    } 
    else if( ny > limit.max.y ){
        ny = limit.min.y;
    } 
    else {
        ny = y;
    }
    return {
        x: nx,
        y: ny
    };
}