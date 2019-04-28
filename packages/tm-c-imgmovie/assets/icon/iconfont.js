;(function(window) {

  var svgSprite = '<svg>' +
    '' +
    '<symbol id="icon-youjiantou" viewBox="0 0 1024 1024">' +
    '' +
    '<path d="M510.10586 405.231301"  ></path>' +
    '' +
    '<path d="M743.661174 486.304781c1.031493-2.170432 1.6158-4.504594 1.7519-6.932899 0.040932-0.475837 0.052189-0.945535 0.059352-1.420349-0.007163-0.474814-0.01842-0.943488-0.059352-1.419326-0.1361-2.428306-0.720408-4.764514-1.7519-6.935969-0.074701-0.167822-0.162706-0.331551-0.2415-0.49835-0.314155-0.610914-0.623193-1.217734-1.01205-1.792832-0.99977-1.713015-2.155083-3.369747-3.6399-4.855588L376.166335 99.849102c-8.370645-8.370645-21.236674-9.074679-28.738531-1.572822l-67.49216 67.49216c-7.500834 7.500834-6.797823 20.367887 1.572822 28.737508l283.445584 283.445584L281.508465 761.397117c-8.370645 8.370645-9.074679 21.236674-1.572822 28.738531l67.49216 67.49216c7.501858 7.500834 20.367887 6.797823 28.738531-1.572822l362.601388-362.601388c1.485841-1.485841 2.641153-3.14462 3.640923-4.858658 0.38681-0.572028 0.695848-1.176802 1.00898-1.785669C743.496421 486.640426 743.586472 486.476697 743.661174 486.304781z"  ></path>' +
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