;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-back" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M761.133 140.771l-357.483 357.479 362.135 362.177c11.836 12.27 19.131 28.949 19.131 47.349 0 37.685-30.548 68.229-68.231 68.229-18.395 0-35.078-7.296-47.351-19.131l-0.018 0.022-409.357-409.397c-12.864-12.409-20.878-29.812-20.878-49.098 0-0.05 0.004-0.1 0.004-0.15 0-0.052-0.004-0.102-0.004-0.153 0-19.286 8.015-36.689 20.878-49.098l-0.018-0.022 409.549-409.197c12.257-11.751 28.878-18.983 47.197-18.983 37.683 0 68.231 30.546 68.231 68.229 0 20.695-9.231 39.232-23.785 51.745z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-sousuo" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M1014.264784 963.222836l-326.760785-326.761809c55.906232-67.220917 89.549436-153.647226 89.549436-247.944797 0-214.560489-174.020208-388.516229-388.516229-388.516229-214.560489 0-388.516229 173.95574-388.516229 388.516229 0 214.496021 173.95574 388.516229 388.516229 388.516229 93.974208 0 180.203018-33.448776 247.429052-88.964105L962.659504 1014.829139c14.448046 12.363573 36.11551 11.712751 49.720352-1.956559C1025.848599 999.144941 1026.628357 977.536828 1014.264784 963.222836L1014.264784 963.222836 1014.264784 963.222836zM386.065923 710.591301c-179.223715 0-324.546353-145.322638-324.546353-324.610821 0-179.2933 145.322638-324.610821 324.546353-324.610821s324.546353 145.317521 324.546353 324.610821C710.612276 565.203171 565.290662 710.591301 386.065923 710.591301L386.065923 710.591301 386.065923 710.591301zM386.065923 710.591301"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '</svg>'
  var script = function() {
    var scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  }()
  var shouldInjectCss = script.getAttribute("data-injectcss")

  /**
   * document ready
   */
  var ready = function(fn) {
    if (document.addEventListener) {
      if (~["complete", "loaded", "interactive"].indexOf(document.readyState)) {
        setTimeout(fn, 0)
      } else {
        var loadFn = function() {
          document.removeEventListener("DOMContentLoaded", loadFn, false)
          fn()
        }
        document.addEventListener("DOMContentLoaded", loadFn, false)
      }
    } else if (document.attachEvent) {
      IEContentLoaded(window, fn)
    }

    function IEContentLoaded(w, fn) {
      var d = w.document,
        done = false,
        // only fire once
        init = function() {
          if (!done) {
            done = true
            fn()
          }
        }
        // polling for no errors
      var polling = function() {
        try {
          // throws errors until after ondocumentready
          d.documentElement.doScroll('left')
        } catch (e) {
          setTimeout(polling, 50)
          return
        }
        // no errors, fire

        init()
      };

      polling()
        // trying to always fire before onload
      d.onreadystatechange = function() {
        if (d.readyState == 'complete') {
          d.onreadystatechange = null
          init()
        }
      }
    }
  }

  /**
   * Insert el before target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var before = function(el, target) {
    target.parentNode.insertBefore(el, target)
  }

  /**
   * Prepend el to target
   *
   * @param {Element} el
   * @param {Element} target
   */

  var prepend = function(el, target) {
    if (target.firstChild) {
      before(el, target.firstChild)
    } else {
      target.appendChild(el)
    }
  }

  function appendSvg() {
    var div, svg

    div = document.createElement('div')
    div.innerHTML = svgSprite
    svgSprite = null
    svg = div.getElementsByTagName('svg')[0]
    if (svg) {
      svg.setAttribute('aria-hidden', 'true')
      svg.style.position = 'absolute'
      svg.style.width = 0
      svg.style.height = 0
      svg.style.overflow = 'hidden'
      prepend(svg, document.body)
    }
  }

  if (shouldInjectCss && !window.__iconfont__svg__cssinject__) {
    window.__iconfont__svg__cssinject__ = true
    try {
      document.write("<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>");
    } catch (e) {
      console && console.log(e)
    }
  }

  ready(appendSvg)


})(window)