(function(window){var svgSprite="<svg>"+""+'<symbol id="fuavatar-confirm" viewBox="0 0 1024 1024">'+""+'<path d="M935.844729 218.083947c-24.820292-22.337751-63.070454-20.329001-85.448114 4.530177L404.897192 717.767434 160.660608 501.415944c-24.859177-22.338774-63.111386-20.327978-85.488023 4.530177-22.376637 24.817222-20.329001 63.070454 4.490268 85.447091l289.556769 256.465093c24.819269 22.337751 63.110363 20.326954 85.488023-4.5312l485.665215-539.795043C962.711634 278.713816 960.703907 240.421698 935.844729 218.083947z"  ></path>'+""+"</symbol>"+""+'<symbol id="fuavatar-close" viewBox="0 0 1024 1024">'+""+'<path d="M595.548858 512.500397 939.898557 168.152744c23.211654-23.211654 23.211654-60.84067 0-84.052325-23.211654-23.208585-60.84067-23.208585-84.049255 0L511.49858 428.450119l-339.696726-339.696726c-22.932292-22.935362-60.116169-22.935362-83.047438 0-22.935362 22.932292-22.935362 60.116169 0 83.050508l339.695702 339.694679L84.101443 855.848279c-23.211654 23.211654-23.211654 60.84067 0 84.049255 23.211654 23.211654 60.84067 23.211654 84.049255 0l344.349699-344.348676L851.323219 934.370657c22.932292 22.935362 60.116169 22.935362 83.047438 0 22.935362-22.932292 22.935362-60.116169 0-83.047438L595.548858 512.500397z"  ></path>'+""+"</symbol>"+""+"</svg>";var script=function(){var scripts=document.getElementsByTagName("script");return scripts[scripts.length-1]}();var shouldInjectCss=script.getAttribute("data-injectcss");var ready=function(fn){if(document.addEventListener){if(~["complete","loaded","interactive"].indexOf(document.readyState)){setTimeout(fn,0)}else{var loadFn=function(){document.removeEventListener("DOMContentLoaded",loadFn,false);fn()};document.addEventListener("DOMContentLoaded",loadFn,false)}}else if(document.attachEvent){IEContentLoaded(window,fn)}function IEContentLoaded(w,fn){var d=w.document,done=false,init=function(){if(!done){done=true;fn()}};var polling=function(){try{d.documentElement.doScroll("left")}catch(e){setTimeout(polling,50);return}init()};polling();d.onreadystatechange=function(){if(d.readyState=="complete"){d.onreadystatechange=null;init()}}}};var before=function(el,target){target.parentNode.insertBefore(el,target)};var prepend=function(el,target){if(target.firstChild){before(el,target.firstChild)}else{target.appendChild(el)}};function appendSvg(){var div,svg;div=document.createElement("div");div.innerHTML=svgSprite;svgSprite=null;svg=div.getElementsByTagName("svg")[0];if(svg){svg.setAttribute("aria-hidden","true");svg.style.position="absolute";svg.style.width=0;svg.style.height=0;svg.style.overflow="hidden";prepend(svg,document.body)}}if(shouldInjectCss&&!window.__iconfont__svg__cssinject__){window.__iconfont__svg__cssinject__=true;try{document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>")}catch(e){console&&console.log(e)}}ready(appendSvg)})(window)