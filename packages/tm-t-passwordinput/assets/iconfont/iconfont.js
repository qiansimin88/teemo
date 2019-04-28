;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-daijiance" viewBox="0 0 1441 1024">' +
    '' +
    '<path d="M721.073 337.068c21.659 20.795 35.171 50.027 35.171 82.446 0 63.139-51.185 114.316-114.316 114.316-56.202 0-102.906-40.566-112.505-94.016-11.265 23.724-17.572 50.273-17.572 78.285 0 101.013 81.891 182.919 182.919 182.919s182.919-81.891 182.919-182.919c0-92.082-68.045-168.282-156.615-181.031zM1294.904 454.678c0 0-240.814-376.394-599.188-376.394s-599.188 376.394-599.188 376.394c-27.345 33.963-27.345 89.549 0 123.518 0 0 240.814 376.394 599.188 376.394 358.378 0 599.188-376.394 599.188-376.394 27.345-33.963 27.345-89.549 0-123.518zM683.349 815.337c-157.838 0-285.797-127.959-285.797-285.797s127.959-285.797 285.797-285.797 285.797 127.959 285.797 285.797-127.959 285.797-285.797 285.797z"  ></path>' +
    '' +
    '</symbol>' +
    '' +
    '<symbol id="icon-biyanbukejian" viewBox="0 0 2253 1024">' +
    '' +
    '<path d="M1881.903 254.97c-29.002-25.925-73.526-23.438-99.462 5.555-114.049 127.558-339.331 256.197-585.666 256.197-246.334 0-471.698-128.637-585.666-256.114-25.933-29.021-70.481-31.527-99.503-5.595-29.021 25.933-31.527 70.481-5.595 99.502 54.042 58.929 115.896 110.187 183.838 152.343l-60.838 149.275c-10.074 23.395-6.733 50.407 8.735 70.644s40.656 30.55 65.875 26.969c25.221-3.578 46.541-20.495 55.768-44.237l55.285-135.599c98.498 44.559 203.908 71.895 311.647 80.813v138.915c0 38.91 31.542 70.452 70.452 70.452s70.452-31.542 70.452-70.452v-138.915c107.721-8.98 213.105-36.371 311.565-80.978l55.285 135.766c14.74 36.026 55.894 53.282 91.92 38.542s53.281-55.894 38.542-91.919l-60.92-149.193c67.943-42.154 129.798-93.411 183.839-152.343 12.502-13.936 18.941-32.274 17.9-50.965-1.043-18.693-9.481-36.202-23.453-48.661v0z"  ></path>' +
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