window.onload = function () {
  let jsFiles = window.GLOBAL_CONFIG.JS_FILES || []
  let csssFiles = window.GLOBAL_CONFIG.CSS_FILES || []
  for(var i=0;i<jsFiles.length;i++){
	DynamciLoadUtil.loadJS(jsFiles[i])
  }
  for(var i=0;i<csssFiles.length;i++){
	DynamciLoadUtil.loadCSS(csssFiles[i])
  }
  DynamciLoadUtil.loadTitle()
  DynamciLoadUtil.loadFav()
}
// 动态引入js和css文件
var DynamciLoadUtil = {
  // 动态加载外部js文件，并执行回调
  loadJS: function (url, callback) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    if (typeof callback === 'function') {
      script.onload = script.onreadystatechange = function () {
        if (!this.readyState || this.readyState === 'loaded' ||
          this.readyState === 'complete') {
          callback()
          script.onload = script.onreadystatechange = null
        }
      }
    }
    document.body.appendChild(script)
    // document.getElementsByTagName('body')[0].appendChild(script);
  },
  // 行内方式动态加载js代码
  loadJSText: function (jsText) {
    var script = document.createElement('script')
    script.type = 'text/javascript'
    try {
      // Firefox,Safari,Chrome,Opera支持
      script.appendChild(document.createTextNode(jsText))
    } catch (ex) {
      // IE早期的浏览器，需要使用script的text属性来指定js代码
      script.text = jsText
    }
    document.body.appendChild(script)
  },
  // 动态加载外部CSS文件
  loadCSS: function (url) {
    var link = document.createElement('link')
    link.rel = 'stylesheet'
    link.type = 'text/css'
    link.url = url
    document.getElementsByTagName('head')[0].appendChild(link)
  },
  // 使用<style>标签包含嵌入式CSS
  loadCSSText: function (cssText) {
    var style = document.createElement('style')
    style.type = 'text/css'
    try {
      // Firefox,Safari,Chrome,Opera支持
      style.appendChild(document.createTextNode(cssText))
    } catch (ex) {
      // IE早期浏览器，需要使用style元素的styleSheet属性的cssText属性
      style.styleSheet.cssText = cssText
    }
  },
  // 设置标题
  loadTitle: function () {
    document.title = window.GLOBAL_CONFIG.SYSTEM_NAME || '亚华智慧医院系统'
  },
  // 设置ICON
  loadFav: function () {
    document.getElementById('icon_yarward').href = window.GLOBAL_CONFIG.FAV_ICON || './static/passport/img/favicon.ico'
  }
}
