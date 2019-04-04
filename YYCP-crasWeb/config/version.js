var lowVersion = false
var regStr_chrome = /chrome\/[\d.]+/gi ;
var agent = window.navigator.userAgent
  if (agent.indexOf("Chrome") == -1) {
    lowVersion=true
  } else {
    var version = agent.match(regStr_chrome)
    var verNum = version[0].replace('Chrome/','')
    var num = verNum.split('.')[0]
    if (parseInt(num)<49) {
      lowVersion=true
    } else {
      lowVersion=false
    }
  }
  if(lowVersion){
    var appDom=  document.getElementById('app')

    appDom.innerHTML='<div class="low-version-ct">'+
    '<h1>您当前的谷歌浏览器版本过低，或者非谷歌浏览器。请升级版本,或切换至谷歌浏览器</h1>'+
    '<ul>'+
      '<li><a href="/uploads/chrome/ChromeSetup_32.exe">谷歌浏览器32位-(点击下载)</a></li>'+
      '<li><a href="/uploads/chrome/ChromeSetup_64.exe">谷歌浏览器64位-(点击下载)</a></li>'+
   ' </ul>'+
  '</div>'
  }