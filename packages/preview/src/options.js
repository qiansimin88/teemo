import * as util from './util';

export var far = 1000;
export var clearColor = 0xcccccc; //渲染色彩
export var antialias = true; //抗锯齿
export var lightColor = 0x31343d; //默认光线颜色
export var lightIntensity = 100; //默认光线强度
export var meshColor = 0xffffff; //模型颜色
export var speed = 0.05;   //gui控制模型的速度(上下 / 左右)
export var distanceSpeed = 20;  //gui控制模型的速度(远 / 近)
export var minDistance = 10; //摄像机最小距离
export var maxDistance = 900; //摄像机最大距离
export var rotateSpeed = 1; //控制器旋转速度
export var zoomSpeed = 1;  //鼠标滚轮控制缩放的速度
export var panSpeed = 1; //控制摄像机上下左右平移的速度
export var isInFullScreen = false; //当前是否在全屏状态下
export var isInBarOpen = false;  //下方信息栏是否显示
export var fullScreenScore = 0; //全屏纪录
export var files = { v: [] };  //文件缓存
export var filesPn = 0; //当前分页数量
export var extraHeight = 0;

var size = util.getCurSize();

export var width = size.width;
export var height = size.height;

export const deg90 = 90 / 180 * Math.PI;
export const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

export const standard_x = 92;                       //模型的标准x
export const standard_y = 93;                       //......y
export const standard_z = 33;                       //......z
export const standard_scale = 0.06;
export const standard_far = 1000;

export var resetMatrix = { v: null };
