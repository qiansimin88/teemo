import { uuid, nextTick } from './util';
/*
@method importScripts
Feature      Chrome  Firefox (Gecko) Internet Explorer   Opera   Safari
Basic support   4   3.5 (1.9.1)         (Yes)              11.5    4

@method web worker
Feature       Chrome  Firefox (Gecko) Internet Explorer   Opera   Safari (WebKit)
Basic support   4      Unknown (3.5)     10.0               10.6       4
*/

// so 能用webgl能浏览器基本都可以多线程
//每次页面打开,浏览器都会为其分配一个线程，称之为Renderer线程
//webWorker(dedicated)线程属于renderer线程

/*  
    浏览器线程依赖远程加载js, 所以在初始化的时候线程池就不能创建空线程了
    一个计算量很大的线程，也会导致主线程卡住 wtf，目前没找到解决方案 
    所以max child thread 暂定为 1, 后续线程都排队吧
*/

/*
    目前同时启用4个线程会大幅度优化性能，超过4个反而性能会下降
*/

/*
    已尝试单独启用一个线程 bspify three mesh, 但是Function无法通过postMessage传递
*/

let MAX_THREAD = 4;
let ACTIVE_THREAD = 0;
let THREAD_QUEUE = [];  //多线程队列
let MAX_CACHE_QUEUE = 4; //最大缓存线程

export default class ThreadPool {
    constructor() {
        this.threadsCache = {};  //多线程缓存
    }   
    //创建线程, 并不会执行
    QueueUserWorkItem ( url ) {
        //存在当前线程则返回,不会重复加载远程js
        if( !!this.threadsCache[ url ] ){
            return this.threadsCache[ url ];
        }   
        return (function ( scope ){
            let thread = new Worker( url );     
            console.log( 'thread', thread ); 
            //缓存此线程
            scope.threadsCache[ url ] = thread;     
            //监听此线程的通信
            thread.onmessage = ({ data }) => {
                thread[ data.tid ]( data.err, data.message );
                delete thread[ data.tid ];  
                //子线程运行完毕，active - 1
                ACTIVE_THREAD -= 1;
                //仍有任务在队列中
                if( THREAD_QUEUE.length > 0 ){  
                    //取出栈底的线程
                    let THREAD = THREAD_QUEUE.shift();  
                    //运行线程
                    THREAD[ 'thread' ][ 'execute' ]( THREAD[ 'message' ], THREAD[ 'callback' ] );
                }
            }       
            thread.addEventListener("error", e => {  
                console.log("Line #" + e.lineno + " - " + e.message + " in " + e.filename); 
                thread.terminate();
            }, false);          
            thread.execute = scope.execute;
            return thread;
        })( this ); 
    } 
    execute ( message, callback = () => {} ){
        //激活线程大于 MAX，后续排队
        if( ACTIVE_THREAD >= MAX_THREAD ){
            //进入多线程队列
            THREAD_QUEUE.push({
                thread : this,
                message : message,
                callback : callback
            });  
            return; 
        }   
        //未满足最大线程，则当前激活线程数 + 1, 开始run
        ACTIVE_THREAD += 1;
        let tid = uuid();
        this.postMessage({  
            tid : tid,
            message : message
        }); 
        this[ tid ] = callback;   
    }
    destory (){
        //销毁全部线程
        let threadURLs = Object.keys( this.threadsCache );
        threadURLs.forEach( url => {
            this.threadsCache[ url ].terminate();
        });
        //清除缓存
        delete this.threadsCache;
    }
}






















