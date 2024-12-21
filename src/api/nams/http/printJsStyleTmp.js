const assStyle='\n' +
  '  .layui-inline,img {\n' +
  '    display:inline-block;\n' +
  '    vertical-align:middle\n' +
  '  }\n' +
  '  h1,h2,h3,h4,h5,h6 {\n' +
  '    font-weight:400\n' +
  '  }\n' +
  '  .layui-edge,.layui-header,.layui-inline,.layui-main {\n' +
  '    position:relative\n' +
  '  }\n' +
  '  .layui-body,.layui-edge,.layui-elip {\n' +
  '    overflow:hidden\n' +
  '  }\n' +
  '  .layui-btn,.layui-edge,.layui-inline,img {\n' +
  '    vertical-align:middle\n' +
  '  }\n' +
  '  .layui-btn,.layui-disabled,.layui-icon,.layui-unselect {\n' +
  '    -moz-user-select:none;\n' +
  '    -webkit-user-select:none;\n' +
  '    -ms-user-select:none\n' +
  '  }\n' +
  '  .layui-elip,.layui-form-checkbox span,.layui-form-pane .layui-form-label {\n' +
  '    text-overflow:ellipsis;\n' +
  '    white-space:nowrap\n' +
  '  }\n' +
  '  .layui-breadcrumb,.layui-tree-btnGroup {\n' +
  '    visibility:hidden\n' +
  '  }\n' +
  '  blockquote,body,button,dd,div,dl,dt,form,h1,h2,h3,h4,h5,h6,input,li,ol,p,pre,td,textarea,th,ul {\n' +
  '    margin:0;\n' +
  '    padding:0;\n' +
  '    -webkit-tap-highlight-color:rgba(0,0,0,0)\n' +
  '  }\n' +
  '  a:active,a:hover {\n' +
  '    outline:0\n' +
  '  }\n' +
  '  img {\n' +
  '    border:none\n' +
  '  }\n' +
  '  li {\n' +
  '    list-style:none\n' +
  '  }\n' +
  '  table {\n' +
  '    border-collapse:collapse;\n' +
  '    border-spacing:0\n' +
  '  }\n' +
  '  h4,h5,h6 {\n' +
  '    font-size:100%\n' +
  '  }\n' +
  '  button,input,optgroup,option,select,textarea {\n' +
  '    font-family:inherit;\n' +
  '    font-size:inherit;\n' +
  '    font-style:inherit;\n' +
  '    font-weight:inherit;\n' +
  '    outline:0\n' +
  '  }\n' +
  '  pre {\n' +
  '    white-space:pre-wrap;\n' +
  '    white-space:-moz-pre-wrap;\n' +
  '    white-space:-pre-wrap;\n' +
  '    white-space:-o-pre-wrap;\n' +
  '    word-wrap:break-word\n' +
  '  }\n' +
  '  body {\n' +
  '    line-height:24px;\n' +
  '    font:14px Helvetica Neue,Helvetica,PingFang SC,Tahoma,Arial,sans-serif\n' +
  '  }\n' +
  '  hr {\n' +
  '    height:1px;\n' +
  '    margin:10px 0;\n' +
  '    border:0;\n' +
  '    clear:both\n' +
  '  }\n' +
  '  a {\n' +
  '    color:#333;\n' +
  '    text-decoration:none\n' +
  '  }\n' +
  '  a:hover {\n' +
  '    color:#777\n' +
  '  }\n' +
  '  a cite {\n' +
  '    font-style:normal;\n' +
  '    *cursor:pointer\n' +
  '  }\n' +
  '  .layui-border-box,.layui-border-box * {\n' +
  '    box-sizing:border-box\n' +
  '  }\n' +
  '  .layui-box,.layui-box * {\n' +
  '    box-sizing:content-box\n' +
  '  }\n' +
  '  .layui-clear {\n' +
  '    clear:both;\n' +
  '    *zoom:1\n' +
  '  }\n' +
  '  .layui-clear:after {\n' +
  '    content:\'\\20\';\n' +
  '    clear:both;\n' +
  '    *zoom:1;\n' +
  '    display:block;\n' +
  '    height:0\n' +
  '  }\n' +
  '  .layui-inline {\n' +
  '    *display:inline;\n' +
  '    *zoom:1\n' +
  '  }\n' +
  '  .layui-edge {\n' +
  '    display:inline-block;\n' +
  '    width:0;\n' +
  '    height:0;\n' +
  '    border-width:6px;\n' +
  '    border-style:dashed;\n' +
  '    border-color:transparent\n' +
  '  }\n' +
  '  .layui-edge-top {\n' +
  '    top:-4px;\n' +
  '    border-bottom-color:#999;\n' +
  '    border-bottom-style:solid\n' +
  '  }\n' +
  '  .layui-edge-right {\n' +
  '    border-left-color:#999;\n' +
  '    border-left-style:solid\n' +
  '  }\n' +
  '  .layui-edge-bottom {\n' +
  '    top:2px;\n' +
  '    border-top-color:#999;\n' +
  '    border-top-style:solid\n' +
  '  }\n' +
  '  .layui-edge-left {\n' +
  '    border-right-color:#999;\n' +
  '    border-right-style:solid\n' +
  '  }\n' +
  '  .layui-disabled,.layui-disabled:hover {\n' +
  '    color:#d2d2d2!important;\n' +
  '    cursor:not-allowed!important\n' +
  '  }\n' +
  '  .layui-circle {\n' +
  '    border-radius:100%\n' +
  '  }\n' +
  '  .layui-show {\n' +
  '    display:block!important\n' +
  '  }\n' +
  '  .layui-hide {\n' +
  '    display:none!important\n' +
  '  }\n' +
  '  @font-face {\n' +
  '    font-family:layui-icon;\n' +
  '    src:url(/public/static/nams/layui/font/iconfont.eot?v=250);\n' +
  '    src:url(/public/static/nams/layui//font/iconfont.eot?v=250#iefix) format(\'embedded-opentype\'),url(/public/static/nams/layui/font/iconfont.woff?v=250) format(\'woff\'),url(/public/static/nams/layui/font/iconfont.ttf?v=250) format(\'truetype\'),url(/public/static/nams/layui/font/iconfont.svg?v=250#layui-icon) format(\'svg\')\n' +
  '  }\n' +
  '  .layui-icon {\n' +
  '    font-family:layui-icon!important;\n' +
  '    font-size:16px;\n' +
  '    font-style:normal;\n' +
  '    -webkit-font-smoothing:antialiased;\n' +
  '    -moz-osx-font-smoothing:grayscale\n' +
  '  }\n' +
  '  .layui-icon-reply-fill:before {\n' +
  '    content:"\\e611"\n' +
  '  }\n' +
  '  .layui-icon-set-fill:before {\n' +
  '    content:"\\e614"\n' +
  '  }\n' +
  '  .layui-icon-menu-fill:before {\n' +
  '    content:"\\e60f"\n' +
  '  }\n' +
  '  .layui-icon-search:before {\n' +
  '    content:"\\e615"\n' +
  '  }\n' +
  '  .layui-icon-share:before {\n' +
  '    content:"\\e641"\n' +
  '  }\n' +
  '  .layui-icon-set-sm:before {\n' +
  '    content:"\\e620"\n' +
  '  }\n' +
  '  .layui-icon-engine:before {\n' +
  '    content:"\\e628"\n' +
  '  }\n' +
  '  .layui-icon-close:before {\n' +
  '    content:"\\1006"\n' +
  '  }\n' +
  '  .layui-icon-close-fill:before {\n' +
  '    content:"\\1007"\n' +
  '  }\n' +
  '  .layui-icon-chart-screen:before {\n' +
  '    content:"\\e629"\n' +
  '  }\n' +
  '  .layui-icon-star:before {\n' +
  '    content:"\\e600"\n' +
  '  }\n' +
  '  .layui-icon-circle-dot:before {\n' +
  '    content:"\\e617"\n' +
  '  }\n' +
  '  .layui-icon-chat:before {\n' +
  '    content:"\\e606"\n' +
  '  }\n' +
  '  .layui-icon-release:before {\n' +
  '    content:"\\e609"\n' +
  '  }\n' +
  '  .layui-icon-list:before {\n' +
  '    content:"\\e60a"\n' +
  '  }\n' +
  '  .layui-icon-chart:before {\n' +
  '    content:"\\e62c"\n' +
  '  }\n' +
  '  .layui-icon-ok-circle:before {\n' +
  '    content:"\\1005"\n' +
  '  }\n' +
  '  .layui-icon-layim-theme:before {\n' +
  '    content:"\\e61b"\n' +
  '  }\n' +
  '  .layui-icon-table:before {\n' +
  '    content:"\\e62d"\n' +
  '  }\n' +
  '  .layui-icon-right:before {\n' +
  '    content:"\\e602"\n' +
  '  }\n' +
  '  .layui-icon-left:before {\n' +
  '    content:"\\e603"\n' +
  '  }\n' +
  '  .layui-icon-cart-simple:before {\n' +
  '    content:"\\e698"\n' +
  '  }\n' +
  '  .layui-icon-face-cry:before {\n' +
  '    content:"\\e69c"\n' +
  '  }\n' +
  '  .layui-icon-face-smile:before {\n' +
  '    content:"\\e6af"\n' +
  '  }\n' +
  '  .layui-icon-survey:before {\n' +
  '    content:"\\e6b2"\n' +
  '  }\n' +
  '  .layui-icon-tree:before {\n' +
  '    content:"\\e62e"\n' +
  '  }\n' +
  '  .layui-icon-upload-circle:before {\n' +
  '    content:"\\e62f"\n' +
  '  }\n' +
  '  .layui-icon-add-circle:before {\n' +
  '    content:"\\e61f"\n' +
  '  }\n' +
  '  .layui-icon-download-circle:before {\n' +
  '    content:"\\e601"\n' +
  '  }\n' +
  '  .layui-icon-templeate-1:before {\n' +
  '    content:"\\e630"\n' +
  '  }\n' +
  '  .layui-icon-util:before {\n' +
  '    content:"\\e631"\n' +
  '  }\n' +
  '  .layui-icon-face-surprised:before {\n' +
  '    content:"\\e664"\n' +
  '  }\n' +
  '  .layui-icon-edit:before {\n' +
  '    content:"\\e642"\n' +
  '  }\n' +
  '  .layui-icon-speaker:before {\n' +
  '    content:"\\e645"\n' +
  '  }\n' +
  '  .layui-icon-down:before {\n' +
  '    content:"\\e61a"\n' +
  '  }\n' +
  '  .layui-icon-file:before {\n' +
  '    content:"\\e621"\n' +
  '  }\n' +
  '  .layui-icon-layouts:before {\n' +
  '    content:"\\e632"\n' +
  '  }\n' +
  '  .layui-icon-rate-half:before {\n' +
  '    content:"\\e6c9"\n' +
  '  }\n' +
  '  .layui-icon-add-circle-fine:before {\n' +
  '    content:"\\e608"\n' +
  '  }\n' +
  '  .layui-icon-prev-circle:before {\n' +
  '    content:"\\e633"\n' +
  '  }\n' +
  '  .layui-icon-read:before {\n' +
  '    content:"\\e705"\n' +
  '  }\n' +
  '  .layui-icon-404:before {\n' +
  '    content:"\\e61c"\n' +
  '  }\n' +
  '  .layui-icon-carousel:before {\n' +
  '    content:"\\e634"\n' +
  '  }\n' +
  '  .layui-icon-help:before {\n' +
  '    content:"\\e607"\n' +
  '  }\n' +
  '  .layui-icon-code-circle:before {\n' +
  '    content:"\\e635"\n' +
  '  }\n' +
  '  .layui-icon-water:before {\n' +
  '    content:"\\e636"\n' +
  '  }\n' +
  '  .layui-icon-username:before {\n' +
  '    content:"\\e66f"\n' +
  '  }\n' +
  '  .layui-icon-find-fill:before {\n' +
  '    content:"\\e670"\n' +
  '  }\n' +
  '  .layui-icon-about:before {\n' +
  '    content:"\\e60b"\n' +
  '  }\n' +
  '  .layui-icon-location:before {\n' +
  '    content:"\\e715"\n' +
  '  }\n' +
  '  .layui-icon-up:before {\n' +
  '    content:"\\e619"\n' +
  '  }\n' +
  '  .layui-icon-pause:before {\n' +
  '    content:"\\e651"\n' +
  '  }\n' +
  '  .layui-icon-date:before {\n' +
  '    content:"\\e637"\n' +
  '  }\n' +
  '  .layui-icon-layim-uploadfile:before {\n' +
  '    content:"\\e61d"\n' +
  '  }\n' +
  '  .layui-icon-delete:before {\n' +
  '    content:"\\e640"\n' +
  '  }\n' +
  '  .layui-icon-play:before {\n' +
  '    content:"\\e652"\n' +
  '  }\n' +
  '  .layui-icon-top:before {\n' +
  '    content:"\\e604"\n' +
  '  }\n' +
  '  .layui-icon-friends:before {\n' +
  '    content:"\\e612"\n' +
  '  }\n' +
  '  .layui-icon-refresh-3:before {\n' +
  '    content:"\\e9aa"\n' +
  '  }\n' +
  '  .layui-icon-ok:before {\n' +
  '    content:"\\e605"\n' +
  '  }\n' +
  '  .layui-icon-layer:before {\n' +
  '    content:"\\e638"\n' +
  '  }\n' +
  '  .layui-icon-face-smile-fine:before {\n' +
  '    content:"\\e60c"\n' +
  '  }\n' +
  '  .layui-icon-dollar:before {\n' +
  '    content:"\\e659"\n' +
  '  }\n' +
  '  .layui-icon-group:before {\n' +
  '    content:"\\e613"\n' +
  '  }\n' +
  '  .layui-icon-layim-download:before {\n' +
  '    content:"\\e61e"\n' +
  '  }\n' +
  '  .layui-icon-picture-fine:before {\n' +
  '    content:"\\e60d"\n' +
  '  }\n' +
  '  .layui-icon-link:before {\n' +
  '    content:"\\e64c"\n' +
  '  }\n' +
  '  .layui-icon-diamond:before {\n' +
  '    content:"\\e735"\n' +
  '  }\n' +
  '  .layui-icon-log:before {\n' +
  '    content:"\\e60e"\n' +
  '  }\n' +
  '  .layui-icon-rate-solid:before {\n' +
  '    content:"\\e67a"\n' +
  '  }\n' +
  '  .layui-icon-fonts-del:before {\n' +
  '    content:"\\e64f"\n' +
  '  }\n' +
  '  .layui-icon-unlink:before {\n' +
  '    content:"\\e64d"\n' +
  '  }\n' +
  '  .layui-icon-fonts-clear:before {\n' +
  '    content:"\\e639"\n' +
  '  }\n' +
  '  .layui-icon-triangle-r:before {\n' +
  '    content:"\\e623"\n' +
  '  }\n' +
  '  .layui-icon-circle:before {\n' +
  '    content:"\\e63f"\n' +
  '  }\n' +
  '  .layui-icon-radio:before {\n' +
  '    content:"\\e643"\n' +
  '  }\n' +
  '  .layui-icon-align-center:before {\n' +
  '    content:"\\e647"\n' +
  '  }\n' +
  '  .layui-icon-align-right:before {\n' +
  '    content:"\\e648"\n' +
  '  }\n' +
  '  .layui-icon-align-left:before {\n' +
  '    content:"\\e649"\n' +
  '  }\n' +
  '  .layui-icon-loading-1:before {\n' +
  '    content:"\\e63e"\n' +
  '  }\n' +
  '  .layui-icon-return:before {\n' +
  '    content:"\\e65c"\n' +
  '  }\n' +
  '  .layui-icon-fonts-strong:before {\n' +
  '    content:"\\e62b"\n' +
  '  }\n' +
  '  .layui-icon-upload:before {\n' +
  '    content:"\\e67c"\n' +
  '  }\n' +
  '  .layui-icon-dialogue:before {\n' +
  '    content:"\\e63a"\n' +
  '  }\n' +
  '  .layui-icon-video:before {\n' +
  '    content:"\\e6ed"\n' +
  '  }\n' +
  '  .layui-icon-headset:before {\n' +
  '    content:"\\e6fc"\n' +
  '  }\n' +
  '  .layui-icon-cellphone-fine:before {\n' +
  '    content:"\\e63b"\n' +
  '  }\n' +
  '  .layui-icon-add-1:before {\n' +
  '    content:"\\e654"\n' +
  '  }\n' +
  '  .layui-icon-face-smile-b:before {\n' +
  '    content:"\\e650"\n' +
  '  }\n' +
  '  .layui-icon-fonts-html:before {\n' +
  '    content:"\\e64b"\n' +
  '  }\n' +
  '  .layui-icon-form:before {\n' +
  '    content:"\\e63c"\n' +
  '  }\n' +
  '  .layui-icon-cart:before {\n' +
  '    content:"\\e657"\n' +
  '  }\n' +
  '  .layui-icon-camera-fill:before {\n' +
  '    content:"\\e65d"\n' +
  '  }\n' +
  '  .layui-icon-tabs:before {\n' +
  '    content:"\\e62a"\n' +
  '  }\n' +
  '  .layui-icon-fonts-code:before {\n' +
  '    content:"\\e64e"\n' +
  '  }\n' +
  '  .layui-icon-fire:before {\n' +
  '    content:"\\e756"\n' +
  '  }\n' +
  '  .layui-icon-set:before {\n' +
  '    content:"\\e716"\n' +
  '  }\n' +
  '  .layui-icon-fonts-u:before {\n' +
  '    content:"\\e646"\n' +
  '  }\n' +
  '  .layui-icon-triangle-d:before {\n' +
  '    content:"\\e625"\n' +
  '  }\n' +
  '  .layui-icon-tips:before {\n' +
  '    content:"\\e702"\n' +
  '  }\n' +
  '  .layui-icon-picture:before {\n' +
  '    content:"\\e64a"\n' +
  '  }\n' +
  '  .layui-icon-more-vertical:before {\n' +
  '    content:"\\e671"\n' +
  '  }\n' +
  '  .layui-icon-flag:before {\n' +
  '    content:"\\e66c"\n' +
  '  }\n' +
  '  .layui-icon-loading:before {\n' +
  '    content:"\\e63d"\n' +
  '  }\n' +
  '  .layui-icon-fonts-i:before {\n' +
  '    content:"\\e644"\n' +
  '  }\n' +
  '  .layui-icon-refresh-1:before {\n' +
  '    content:"\\e666"\n' +
  '  }\n' +
  '  .layui-icon-rmb:before {\n' +
  '    content:"\\e65e"\n' +
  '  }\n' +
  '  .layui-icon-home:before {\n' +
  '    content:"\\e68e"\n' +
  '  }\n' +
  '  .layui-icon-user:before {\n' +
  '    content:"\\e770"\n' +
  '  }\n' +
  '  .layui-icon-notice:before {\n' +
  '    content:"\\e667"\n' +
  '  }\n' +
  '  .layui-icon-login-weibo:before {\n' +
  '    content:"\\e675"\n' +
  '  }\n' +
  '  .layui-icon-voice:before {\n' +
  '    content:"\\e688"\n' +
  '  }\n' +
  '  .layui-icon-upload-drag:before {\n' +
  '    content:"\\e681"\n' +
  '  }\n' +
  '  .layui-icon-login-qq:before {\n' +
  '    content:"\\e676"\n' +
  '  }\n' +
  '  .layui-icon-snowflake:before {\n' +
  '    content:"\\e6b1"\n' +
  '  }\n' +
  '  .layui-icon-file-b:before {\n' +
  '    content:"\\e655"\n' +
  '  }\n' +
  '  .layui-icon-template:before {\n' +
  '    content:"\\e663"\n' +
  '  }\n' +
  '  .layui-icon-auz:before {\n' +
  '    content:"\\e672"\n' +
  '  }\n' +
  '  .layui-icon-console:before {\n' +
  '    content:"\\e665"\n' +
  '  }\n' +
  '  .layui-icon-app:before {\n' +
  '    content:"\\e653"\n' +
  '  }\n' +
  '  .layui-icon-prev:before {\n' +
  '    content:"\\e65a"\n' +
  '  }\n' +
  '  .layui-icon-website:before {\n' +
  '    content:"\\e7ae"\n' +
  '  }\n' +
  '  .layui-icon-next:before {\n' +
  '    content:"\\e65b"\n' +
  '  }\n' +
  '  .layui-icon-component:before {\n' +
  '    content:"\\e857"\n' +
  '  }\n' +
  '  .layui-icon-more:before {\n' +
  '    content:"\\e65f"\n' +
  '  }\n' +
  '  .layui-icon-login-wechat:before {\n' +
  '    content:"\\e677"\n' +
  '  }\n' +
  '  .layui-icon-shrink-right:before {\n' +
  '    content:"\\e668"\n' +
  '  }\n' +
  '  .layui-icon-spread-left:before {\n' +
  '    content:"\\e66b"\n' +
  '  }\n' +
  '  .layui-icon-camera:before {\n' +
  '    content:"\\e660"\n' +
  '  }\n' +
  '  .layui-icon-note:before {\n' +
  '    content:"\\e66e"\n' +
  '  }\n' +
  '  .layui-icon-refresh:before {\n' +
  '    content:"\\e669"\n' +
  '  }\n' +
  '  .layui-icon-female:before {\n' +
  '    content:"\\e661"\n' +
  '  }\n' +
  '  .layui-icon-male:before {\n' +
  '    content:"\\e662"\n' +
  '  }\n' +
  '  .layui-icon-password:before {\n' +
  '    content:"\\e673"\n' +
  '  }\n' +
  '  .layui-icon-senior:before {\n' +
  '    content:"\\e674"\n' +
  '  }\n' +
  '  .layui-icon-theme:before {\n' +
  '    content:"\\e66a"\n' +
  '  }\n' +
  '  .layui-icon-tread:before {\n' +
  '    content:"\\e6c5"\n' +
  '  }\n' +
  '  .layui-icon-praise:before {\n' +
  '    content:"\\e6c6"\n' +
  '  }\n' +
  '  .layui-icon-star-fill:before {\n' +
  '    content:"\\e658"\n' +
  '  }\n' +
  '  .layui-icon-rate:before {\n' +
  '    content:"\\e67b"\n' +
  '  }\n' +
  '  .layui-icon-template-1:before {\n' +
  '    content:"\\e656"\n' +
  '  }\n' +
  '  .layui-icon-vercode:before {\n' +
  '    content:"\\e679"\n' +
  '  }\n' +
  '  .layui-icon-cellphone:before {\n' +
  '    content:"\\e678"\n' +
  '  }\n' +
  '  .layui-icon-screen-full:before {\n' +
  '    content:"\\e622"\n' +
  '  }\n' +
  '  .layui-icon-screen-restore:before {\n' +
  '    content:"\\e758"\n' +
  '  }\n' +
  '  .layui-icon-cols:before {\n' +
  '    content:"\\e610"\n' +
  '  }\n' +
  '  .layui-icon-export:before {\n' +
  '    content:"\\e67d"\n' +
  '  }\n' +
  '  .layui-icon-print:before {\n' +
  '    content:"\\e66d"\n' +
  '  }\n' +
  '  .layui-icon-slider:before {\n' +
  '    content:"\\e714"\n' +
  '  }\n' +
  '  .layui-icon-addition:before {\n' +
  '    content:"\\e624"\n' +
  '  }\n' +
  '  .layui-icon-subtraction:before {\n' +
  '    content:"\\e67e"\n' +
  '  }\n' +
  '  .layui-icon-service:before {\n' +
  '    content:"\\e626"\n' +
  '  }\n' +
  '  .layui-icon-transfer:before {\n' +
  '    content:"\\e691"\n' +
  '  }\n' +
  '  .layui-main {\n' +
  '    width:1140px;\n' +
  '    margin:0 auto\n' +
  '  }\n' +
  '  .layui-header {\n' +
  '    z-index:1000;\n' +
  '    height:60px\n' +
  '  }\n' +
  '  .layui-header a:hover {\n' +
  '    transition:all .5s;\n' +
  '    -webkit-transition:all .5s\n' +
  '  }\n' +
  '\n' +
  '  .layui-form-label,.layui-form-mid,.layui-form-select,.layui-input-block,.layui-input-inline,.layui-textarea {\n' +
  '    position:relative\n' +
  '  }\n' +
  '  .layui-bg-red {\n' +
  '    background-color:#FF5722!important\n' +
  '  }\n' +
  '  .layui-bg-orange {\n' +
  '    background-color:#FFB800!important\n' +
  '  }\n' +
  '  .layui-bg-green {\n' +
  '    background-color:#009688!important\n' +
  '  }\n' +
  '  .layui-bg-cyan {\n' +
  '    background-color:#2F4056!important\n' +
  '  }\n' +
  '  .layui-bg-blue {\n' +
  '    background-color:#1E9FFF!important\n' +
  '  }\n' +
  '  .layui-bg-black {\n' +
  '    background-color:#393D49!important\n' +
  '  }\n' +
  '  .layui-bg-gray {\n' +
  '    background-color:#eee!important;\n' +
  '    color:#666!important\n' +
  '  }\n' +
  '  .layui-badge-rim,.layui-colla-content,.layui-colla-item,.layui-collapse,.layui-elem-field,.layui-form-pane .layui-form-item[pane],.layui-form-pane .layui-form-label,.layui-input,.layui-layedit,.layui-layedit-tool,.layui-quote-nm,.layui-select,.layui-tab-bar,.layui-tab-card,.layui-tab-title,.layui-tab-title .layui-this:after,.layui-textarea {\n' +
  '    border-color:#e6e6e6\n' +
  '  }\n' +
  '  .layui-timeline-item:before,hr {\n' +
  '    background-color:#e6e6e6\n' +
  '  }\n' +
  '  .layui-text {\n' +
  '    line-height:22px;\n' +
  '    font-size:14px;\n' +
  '    color:#666\n' +
  '  }\n' +
  '  .layui-text h1,.layui-text h2,.layui-text h3 {\n' +
  '    font-weight:500;\n' +
  '    color:#333\n' +
  '  }\n' +
  '  .layui-text h1 {\n' +
  '    font-size:30px\n' +
  '  }\n' +
  '  .layui-text h2 {\n' +
  '    font-size:24px\n' +
  '  }\n' +
  '  .layui-text h3 {\n' +
  '    font-size:18px\n' +
  '  }\n' +
  '  .layui-text a:not(.layui-btn) {\n' +
  '    color:#01AAED\n' +
  '  }\n' +
  '  .layui-text a:not(.layui-btn):hover {\n' +
  '    text-decoration:underline\n' +
  '  }\n' +
  '  .layui-text ul {\n' +
  '    padding:5px 0 5px 15px\n' +
  '  }\n' +
  '  .layui-text ul li {\n' +
  '    margin-top:5px;\n' +
  '    list-style-type:disc\n' +
  '  }\n' +
  '  .layui-text em,.layui-word-aux {\n' +
  '    color:#999!important;\n' +
  '    padding:0 5px!important\n' +
  '  }\n' +
  '  .layui-btn {\n' +
  '    display:inline-block;\n' +
  '    height:38px;\n' +
  '    line-height:38px;\n' +
  '    padding:0 18px;\n' +
  '    background-color:#009688;\n' +
  '    color:#fff;\n' +
  '    white-space:nowrap;\n' +
  '    text-align:center;\n' +
  '    font-size:14px;\n' +
  '    border:none;\n' +
  '    border-radius:2px;\n' +
  '    cursor:pointer\n' +
  '  }\n' +
  '  .layui-btn:hover {\n' +
  '    opacity:.8;\n' +
  '    filter:alpha(opacity=80);\n' +
  '    color:#fff\n' +
  '  }\n' +
  '  .layui-btn:active {\n' +
  '    opacity:1;\n' +
  '    filter:alpha(opacity=100)\n' +
  '  }\n' +
  '  .layui-btn+.layui-btn {\n' +
  '    margin-left:10px\n' +
  '  }\n' +
  '  .layui-btn-container {\n' +
  '    font-size:0\n' +
  '  }\n' +
  '  .layui-btn-container .layui-btn {\n' +
  '    margin-right:10px;\n' +
  '    margin-bottom:10px\n' +
  '  }\n' +
  '  .layui-btn-container .layui-btn+.layui-btn {\n' +
  '    margin-left:0\n' +
  '  }\n' +
  '  .layui-table .layui-btn-container .layui-btn {\n' +
  '    margin-bottom:9px\n' +
  '  }\n' +
  '  .layui-btn-radius {\n' +
  '    border-radius:100px\n' +
  '  }\n' +
  '  .layui-btn .layui-icon {\n' +
  '    margin-right:3px;\n' +
  '    font-size:18px;\n' +
  '    vertical-align:bottom;\n' +
  '    vertical-align:middle\\9\n' +
  '  }\n' +
  '  .layui-btn-primary {\n' +
  '    border:1px solid #C9C9C9;\n' +
  '    background-color:#fff;\n' +
  '    color:#555\n' +
  '  }\n' +
  '  .layui-btn-primary:hover {\n' +
  '    border-color:#009688;\n' +
  '    color:#333\n' +
  '  }\n' +
  '  .layui-btn-normal {\n' +
  '    background-color:#1E9FFF\n' +
  '  }\n' +
  '  .layui-btn-warm {\n' +
  '    background-color:#FFB800\n' +
  '  }\n' +
  '  .layui-btn-danger {\n' +
  '    background-color:#FF5722\n' +
  '  }\n' +
  '  .layui-btn-checked {\n' +
  '    background-color:#5FB878\n' +
  '  }\n' +
  '  .layui-btn-disabled,.layui-btn-disabled:active,.layui-btn-disabled:hover {\n' +
  '    border:1px solid #e6e6e6;\n' +
  '    background-color:#FBFBFB;\n' +
  '    color:#C9C9C9;\n' +
  '    cursor:not-allowed;\n' +
  '    opacity:1\n' +
  '  }\n' +
  '  .layui-btn-lg {\n' +
  '    height:44px;\n' +
  '    line-height:44px;\n' +
  '    padding:0 25px;\n' +
  '    font-size:16px\n' +
  '  }\n' +
  '  .layui-btn-sm {\n' +
  '    height:30px;\n' +
  '    line-height:30px;\n' +
  '    padding:0 10px;\n' +
  '    font-size:12px\n' +
  '  }\n' +
  '  .layui-btn-sm i {\n' +
  '    font-size:16px!important\n' +
  '  }\n' +
  '  .layui-btn-xs {\n' +
  '    height:22px;\n' +
  '    line-height:22px;\n' +
  '    padding:0 5px;\n' +
  '    font-size:12px\n' +
  '  }\n' +
  '  .layui-btn-xs i {\n' +
  '    font-size:14px!important\n' +
  '  }\n' +
  '  .layui-btn-group {\n' +
  '    display:inline-block;\n' +
  '    vertical-align:middle;\n' +
  '    font-size:0\n' +
  '  }\n' +
  '  .layui-btn-group .layui-btn {\n' +
  '    margin-left:0!important;\n' +
  '    margin-right:0!important;\n' +
  '    border-left:1px solid rgba(255,255,255,.5);\n' +
  '    border-radius:0\n' +
  '  }\n' +
  '  .layui-btn-group .layui-btn-primary {\n' +
  '    border-left:none\n' +
  '  }\n' +
  '  .layui-btn-group .layui-btn-primary:hover {\n' +
  '    border-color:#C9C9C9;\n' +
  '    color:#009688\n' +
  '  }\n' +
  '  .layui-btn-group .layui-btn:first-child {\n' +
  '    border-left:none;\n' +
  '    border-radius:2px 0 0 2px\n' +
  '  }\n' +
  '  .layui-btn-group .layui-btn-primary:first-child {\n' +
  '    border-left:1px solid #c9c9c9\n' +
  '  }\n' +
  '  .layui-btn-group .layui-btn:last-child {\n' +
  '    border-radius:0 2px 2px 0\n' +
  '  }\n' +
  '  .layui-btn-group .layui-btn+.layui-btn {\n' +
  '    margin-left:0\n' +
  '  }\n' +
  '  .layui-btn-group+.layui-btn-group {\n' +
  '    margin-left:10px\n' +
  '  }\n' +
  '  .layui-btn-fluid {\n' +
  '    width:100%\n' +
  '  }\n' +
  '  .layui-input,.layui-select,.layui-textarea {\n' +
  '    height:38px;\n' +
  '    line-height:1.3;\n' +
  '    line-height:38px\\9;\n' +
  '    border-width:1px;\n' +
  '    border-style:solid;\n' +
  '    background-color:#fff;\n' +
  '    border-radius:2px\n' +
  '  }\n' +
  '  .layui-input::-webkit-input-placeholder,.layui-select::-webkit-input-placeholder,.layui-textarea::-webkit-input-placeholder {\n' +
  '    line-height:1.3\n' +
  '  }\n' +
  '  .layui-input,.layui-textarea {\n' +
  '    display:block;\n' +
  '    width:100%;\n' +
  '    padding-left:10px\n' +
  '  }\n' +
  '  .layui-input:hover,.layui-textarea:hover {\n' +
  '    border-color:#D2D2D2!important\n' +
  '  }\n' +
  '  .layui-input:focus,.layui-textarea:focus {\n' +
  '    border-color:#C9C9C9!important\n' +
  '  }\n' +
  '  .layui-textarea {\n' +
  '    min-height:100px;\n' +
  '    height:auto;\n' +
  '    line-height:20px;\n' +
  '    padding:6px 10px;\n' +
  '    resize:vertical\n' +
  '  }\n' +
  '  .layui-select {\n' +
  '    padding:0 10px\n' +
  '  }\n' +
  '  .layui-form input[type=checkbox],.layui-form input[type=radio],.layui-form select {\n' +
  '    display:none\n' +
  '  }\n' +
  '  .layui-form [lay-ignore] {\n' +
  '    display:initial\n' +
  '  }\n' +
  '  .layui-form-item {\n' +
  '    margin-bottom:15px;\n' +
  '    clear:both;\n' +
  '    *zoom:1\n' +
  '  }\n' +
  '  .layui-form-item:after {\n' +
  '    content:\'\\20\';\n' +
  '    clear:both;\n' +
  '    *zoom:1;\n' +
  '    display:block;\n' +
  '    height:0\n' +
  '  }\n' +
  '  .layui-form-label {\n' +
  '    float:left;\n' +
  '    display:block;\n' +
  '    padding:9px 15px;\n' +
  '    width:80px;\n' +
  '    font-weight:400;\n' +
  '    line-height:20px;\n' +
  '    text-align:right\n' +
  '  }\n' +
  '  .layui-form-label-col {\n' +
  '    display:block;\n' +
  '    float:none;\n' +
  '    padding:9px 0;\n' +
  '    line-height:20px;\n' +
  '    text-align:left\n' +
  '  }\n' +
  '  .layui-form-item .layui-inline {\n' +
  '    margin-bottom:5px;\n' +
  '    margin-right:10px\n' +
  '  }\n' +
  '  .layui-input-block {\n' +
  '    margin-left:110px;\n' +
  '    min-height:36px\n' +
  '  }\n' +
  '  .layui-input-inline {\n' +
  '    display:inline-block;\n' +
  '    vertical-align:middle\n' +
  '  }\n' +
  '  .layui-form-item .layui-input-inline {\n' +
  '    float:left;\n' +
  '    width:190px;\n' +
  '    margin-right:10px\n' +
  '  }\n' +
  '  .layui-form-text .layui-input-inline {\n' +
  '    width:auto\n' +
  '  }\n' +
  '  .layui-form-mid {\n' +
  '    float:left;\n' +
  '    display:block;\n' +
  '    padding:9px 0!important;\n' +
  '    line-height:20px;\n' +
  '    margin-right:10px\n' +
  '  }\n' +
  '  .layui-form-danger+.layui-form-select .layui-input,.layui-form-danger:focus {\n' +
  '    border-color:#FF5722!important\n' +
  '  }\n' +
  '  .layui-form-select .layui-input {\n' +
  '    padding-right:30px;\n' +
  '    cursor:pointer\n' +
  '  }\n' +
  '  .layui-form-select .layui-edge {\n' +
  '    position:absolute;\n' +
  '    right:10px;\n' +
  '    top:50%;\n' +
  '    margin-top:-3px;\n' +
  '    cursor:pointer;\n' +
  '    border-width:6px;\n' +
  '    border-top-color:#c2c2c2;\n' +
  '    border-top-style:solid;\n' +
  '    transition:all .3s;\n' +
  '    -webkit-transition:all .3s\n' +
  '  }\n' +
  '  .layui-form-select dl {\n' +
  '    display:none;\n' +
  '    position:absolute;\n' +
  '    left:0;\n' +
  '    top:42px;\n' +
  '    padding:5px 0;\n' +
  '    z-index:899;\n' +
  '    min-width:100%;\n' +
  '    border:1px solid #d2d2d2;\n' +
  '    max-height:300px;\n' +
  '    overflow-y:auto;\n' +
  '    background-color:#fff;\n' +
  '    border-radius:2px;\n' +
  '    box-shadow:0 2px 4px rgba(0,0,0,.12);\n' +
  '    box-sizing:border-box\n' +
  '  }\n' +
  '  .layui-form-select dl dd,.layui-form-select dl dt {\n' +
  '    padding:0 10px;\n' +
  '    line-height:36px;\n' +
  '    white-space:nowrap;\n' +
  '    overflow:hidden;\n' +
  '    text-overflow:ellipsis\n' +
  '  }\n' +
  '  .layui-form-select dl dt {\n' +
  '    font-size:12px;\n' +
  '    color:#999\n' +
  '  }\n' +
  '  .layui-form-select dl dd {\n' +
  '    cursor:pointer\n' +
  '  }\n' +
  '  .layui-form-select dl dd:hover {\n' +
  '    background-color:#f2f2f2;\n' +
  '    -webkit-transition:.5s all;\n' +
  '    transition:.5s all\n' +
  '  }\n' +
  '  .layui-form-select .layui-select-group dd {\n' +
  '    padding-left:20px\n' +
  '  }\n' +
  '  .layui-form-select dl dd.layui-select-tips {\n' +
  '    padding-left:10px!important;\n' +
  '    color:#999\n' +
  '  }\n' +
  '  .layui-form-select dl dd.layui-this {\n' +
  '    background-color:#5FB878;\n' +
  '    color:#fff\n' +
  '  }\n' +
  '  .layui-form-checkbox,.layui-form-select dl dd.layui-disabled {\n' +
  '    background-color:#fff\n' +
  '  }\n' +
  '  .layui-form-selected dl {\n' +
  '    display:block\n' +
  '  }\n' +
  '  .layui-form-checkbox,.layui-form-checkbox *,.layui-form-switch {\n' +
  '    display:inline-block;\n' +
  '    vertical-align:middle\n' +
  '  }\n' +
  '  .layui-form-selected .layui-edge {\n' +
  '    margin-top:-9px;\n' +
  '    -webkit-transform:rotate(180deg);\n' +
  '    transform:rotate(180deg);\n' +
  '    margin-top:-3px\\9\n' +
  '  }\n' +
  '  :root .layui-form-selected .layui-edge {\n' +
  '    margin-top:-9px\\0/IE9\n' +
  '  }\n' +
  '  .layui-form-selectup dl {\n' +
  '    top:auto;\n' +
  '    bottom:42px\n' +
  '  }\n' +
  '  .layui-select-none {\n' +
  '    margin:5px 0;\n' +
  '    text-align:center;\n' +
  '    color:#999\n' +
  '  }\n' +
  '  .layui-select-disabled .layui-disabled {\n' +
  '\n' +
  '    border-color:#eee!important\n' +
  '  }\n' +
  '  .layui-select-disabled .layui-edge {\n' +
  '    border-top-color:#d2d2d2\n' +
  '  }\n' +
  '  .layui-form-checkbox {\n' +
  '    position:relative;\n' +
  '    height:30px;\n' +
  '    line-height:30px;\n' +
  '    margin-right:10px;\n' +
  '    padding-right:30px;\n' +
  '    cursor:pointer;\n' +
  '    font-size:0;\n' +
  '    -webkit-transition:.1s linear;\n' +
  '    transition:.1s linear;\n' +
  '    box-sizing:border-box\n' +
  '  }\n' +
  '  .layui-form-checkbox span {\n' +
  '    padding:0 10px;\n' +
  '    height:100%;\n' +
  '    font-size:14px;\n' +
  '    border-radius:2px 0 0 2px;\n' +
  '    background-color:#d2d2d2;\n' +
  '    color:#fff;\n' +
  '    overflow:hidden\n' +
  '  }\n' +
  '  .layui-form-checkbox:hover span {\n' +
  '    background-color:#c2c2c2\n' +
  '  }\n' +
  '  .layui-form-checkbox i {\n' +
  '    position:absolute;\n' +
  '    right:0;\n' +
  '    top:0;\n' +
  '    width:30px;\n' +
  '    height:28px;\n' +
  '    border:1px solid #d2d2d2;\n' +
  '    border-left:none;\n' +
  '    border-radius:0 2px 2px 0;\n' +
  '    color:#fff;\n' +
  '    font-size:20px;\n' +
  '    text-align:center\n' +
  '  }\n' +
  '  .layui-form-checkbox:hover i {\n' +
  '    border-color:#c2c2c2;\n' +
  '    color:#c2c2c2\n' +
  '  }\n' +
  '  .layui-form-checked,.layui-form-checked:hover {\n' +
  '    border-color:#5FB878\n' +
  '  }\n' +
  '  .layui-form-checked span,.layui-form-checked:hover span {\n' +
  '    background-color:#5FB878\n' +
  '  }\n' +
  '  .layui-form-checked i,.layui-form-checked:hover i {\n' +
  '    color:#5FB878\n' +
  '  }\n' +
  '  .layui-form-item .layui-form-checkbox {\n' +
  '    margin-top:4px\n' +
  '  }\n' +
  '  .layui-form-checkbox[lay-skin=primary] {\n' +
  '    height:auto!important;\n' +
  '    line-height:normal!important;\n' +
  '    min-width:18px;\n' +
  '    min-height:18px;\n' +
  '    border:none!important;\n' +
  '    margin-right:0;\n' +
  '    padding-left:28px;\n' +
  '    padding-right:0;\n' +
  '    background:0 0\n' +
  '  }\n' +
  '  .layui-form-checkbox[lay-skin=primary] span {\n' +
  '    padding-left:0;\n' +
  '    padding-right:15px;\n' +
  '    line-height:18px;\n' +
  '    background:0 0;\n' +
  '    color:#666\n' +
  '  }\n' +
  '  .layui-form-checkbox[lay-skin=primary] i {\n' +
  '    right:auto;\n' +
  '    left:0;\n' +
  '    width:16px;\n' +
  '    height:16px;\n' +
  '    line-height:16px;\n' +
  '    border:1px solid #d2d2d2;\n' +
  '    font-size:12px;\n' +
  '    border-radius:2px;\n' +
  '    background-color:#fff;\n' +
  '    -webkit-transition:.1s linear;\n' +
  '    transition:.1s linear\n' +
  '  }\n' +
  '  .layui-form-checkbox[lay-skin=primary]:hover i {\n' +
  '    border-color:#5FB878;\n' +
  '    color:#fff\n' +
  '  }\n' +
  '  .layui-form-checked[lay-skin=primary] i {\n' +
  '    border-color:#5FB878!important;\n' +
  '    background-color:#5FB878;\n' +
  '    color:#fff\n' +
  '  }\n' +
  '  .layui-checkbox-disbaled[lay-skin=primary] span {\n' +
  '    background:0 0!important;\n' +
  '    color:#c2c2c2\n' +
  '  }\n' +
  '  .layui-checkbox-disbaled[lay-skin=primary]:hover i {\n' +
  '    border-color:#d2d2d2\n' +
  '  }\n' +
  '  .layui-form-item .layui-form-checkbox[lay-skin=primary] {\n' +
  '    margin-top:10px\n' +
  '  }\n' +
  '  .layui-form-switch {\n' +
  '    position:relative;\n' +
  '    height:22px;\n' +
  '    line-height:22px;\n' +
  '    min-width:35px;\n' +
  '    padding:0 5px;\n' +
  '    margin-top:8px;\n' +
  '    border:1px solid #d2d2d2;\n' +
  '    border-radius:20px;\n' +
  '    cursor:pointer;\n' +
  '    background-color:#fff;\n' +
  '    -webkit-transition:.1s linear;\n' +
  '    transition:.1s linear\n' +
  '  }\n' +
  '  .layui-form-switch i {\n' +
  '    position:absolute;\n' +
  '    left:5px;\n' +
  '    top:3px;\n' +
  '    width:16px;\n' +
  '    height:16px;\n' +
  '    border-radius:20px;\n' +
  '    background-color:#d2d2d2;\n' +
  '    -webkit-transition:.1s linear;\n' +
  '    transition:.1s linear\n' +
  '  }\n' +
  '  .layui-form-switch em {\n' +
  '    position:relative;\n' +
  '    top:0;\n' +
  '    width:25px;\n' +
  '    margin-left:21px;\n' +
  '    padding:0!important;\n' +
  '    text-align:center!important;\n' +
  '    color:#999!important;\n' +
  '    font-style:normal!important;\n' +
  '    font-size:12px\n' +
  '  }\n' +
  '  .layui-form-onswitch {\n' +
  '    border-color:#5FB878;\n' +
  '    background-color:#5FB878\n' +
  '  }\n' +
  '  .layui-checkbox-disbaled,.layui-checkbox-disbaled i {\n' +
  '    border-color:#e2e2e2!important\n' +
  '  }\n' +
  '  .layui-form-onswitch i {\n' +
  '    left:100%;\n' +
  '    margin-left:-21px;\n' +
  '    background-color:#fff\n' +
  '  }\n' +
  '  .layui-form-onswitch em {\n' +
  '    margin-left:5px;\n' +
  '    margin-right:21px;\n' +
  '    color:#fff!important\n' +
  '  }\n' +
  '  .layui-checkbox-disbaled span {\n' +
  '    background-color:#e2e2e2!important\n' +
  '  }\n' +
  '  .layui-checkbox-disbaled:hover i {\n' +
  '    color:#fff!important\n' +
  '  }\n' +
  '  [lay-radio] {\n' +
  '    display:none\n' +
  '  }\n' +
  '  .layui-form-radio,.layui-form-radio * {\n' +
  '    display:inline-block;\n' +
  '    vertical-align:middle\n' +
  '  }\n' +
  '  .layui-form-radio {\n' +
  '    line-height:28px;\n' +
  '    margin:6px 10px 0 0;\n' +
  '    padding-right:10px;\n' +
  '    cursor:pointer;\n' +
  '    font-size:0\n' +
  '  }\n' +
  '  .layui-form-radio * {\n' +
  '    font-size:14px\n' +
  '  }\n' +
  '  .layui-form-radio>i {\n' +
  '    margin-right:8px;\n' +
  '    font-size:22px;\n' +
  '    color:#c2c2c2\n' +
  '  }\n' +
  '  .layui-form-radio>i:hover,.layui-form-radioed>i {\n' +
  '    color:#5FB878\n' +
  '  }\n' +
  '  .layui-radio-disbaled>i {\n' +
  '    color:#e2e2e2!important\n' +
  '  }\n' +
  '  .layui-form-pane .layui-form-label {\n' +
  '    width:110px;\n' +
  '    padding:8px 15px;\n' +
  '    height:38px;\n' +
  '    line-height:20px;\n' +
  '    border-width:1px;\n' +
  '    border-style:solid;\n' +
  '    border-radius:2px 0 0 2px;\n' +
  '    text-align:center;\n' +
  '    background-color:#FBFBFB;\n' +
  '    overflow:hidden;\n' +
  '    box-sizing:border-box\n' +
  '  }\n' +
  '  .layui-form-pane .layui-input-inline {\n' +
  '    margin-left:-1px\n' +
  '  }\n' +
  '  .layui-form-pane .layui-input-block {\n' +
  '    margin-left:110px;\n' +
  '    left:-1px\n' +
  '  }\n' +
  '  .layui-form-pane .layui-input {\n' +
  '    border-radius:0 2px 2px 0\n' +
  '  }\n' +
  '  .layui-form-pane .layui-form-text .layui-form-label {\n' +
  '    float:none;\n' +
  '    width:100%;\n' +
  '    border-radius:2px;\n' +
  '    box-sizing:border-box;\n' +
  '    text-align:left\n' +
  '  }\n' +
  '  .layui-form-pane .layui-form-text .layui-input-inline {\n' +
  '    display:block;\n' +
  '    margin:0;\n' +
  '    top:-1px;\n' +
  '    clear:both\n' +
  '  }\n' +
  '  .layui-form-pane .layui-form-text .layui-input-block {\n' +
  '    margin:0;\n' +
  '    left:0;\n' +
  '    top:-1px\n' +
  '  }\n' +
  '  .layui-form-pane .layui-form-text .layui-textarea {\n' +
  '    min-height:100px;\n' +
  '    border-radius:0 0 2px 2px\n' +
  '  }\n' +
  '  .layui-form-pane .layui-form-checkbox {\n' +
  '    margin:4px 0 4px 10px\n' +
  '  }\n' +
  '  .layui-form-pane .layui-form-radio,.layui-form-pane .layui-form-switch {\n' +
  '    margin-top:6px;\n' +
  '    margin-left:10px\n' +
  '  }\n' +
  '  .layui-form-pane .layui-form-item[pane] {\n' +
  '    position:relative;\n' +
  '    border-width:1px;\n' +
  '    border-style:solid\n' +
  '  }\n' +
  '  .layui-form-pane .layui-form-item[pane] .layui-form-label {\n' +
  '    position:absolute;\n' +
  '    left:0;\n' +
  '    top:0;\n' +
  '    height:100%;\n' +
  '    border-width:0 1px 0 0\n' +
  '  }\n' +
  '  .layui-form-pane .layui-form-item[pane] .layui-input-inline {\n' +
  '    margin-left:110px\n' +
  '  }\n' +
  '  @media screen and (max-width:450px) {\n' +
  '    .layui-form-item .layui-form-label {\n' +
  '      text-overflow:ellipsis;\n' +
  '      overflow:hidden;\n' +
  '      white-space:nowrap\n' +
  '    }\n' +
  '    .layui-form-item .layui-inline {\n' +
  '      display:block;\n' +
  '      margin-right:0;\n' +
  '      margin-bottom:20px;\n' +
  '      clear:both\n' +
  '    }\n' +
  '    .layui-form-item .layui-inline:after {\n' +
  '      content:\'\\20\';\n' +
  '      clear:both;\n' +
  '      display:block;\n' +
  '      height:0\n' +
  '    }\n' +
  '    .layui-form-item .layui-input-inline {\n' +
  '      display:block;\n' +
  '      float:none;\n' +
  '      left:-3px;\n' +
  '      width:auto;\n' +
  '      margin:0 0 10px 112px\n' +
  '    }\n' +
  '    .layui-form-item .layui-input-inline+.layui-form-mid {\n' +
  '      margin-left:110px;\n' +
  '      top:-5px;\n' +
  '      padding:0\n' +
  '    }\n' +
  '    .layui-form-item .layui-form-checkbox {\n' +
  '      margin-right:5px;\n' +
  '      margin-bottom:5px\n' +
  '    }\n' +
  '  }.layui-layedit {\n' +
  '     border-width:1px;\n' +
  '     border-style:solid;\n' +
  '     border-radius:2px\n' +
  '   }\n' +
  '  .layui-layedit-tool {\n' +
  '    padding:3px 5px;\n' +
  '    border-bottom-width:1px;\n' +
  '    border-bottom-style:solid;\n' +
  '    font-size:0\n' +
  '  }\n' +
  '  .layedit-tool-fixed {\n' +
  '    position:fixed;\n' +
  '    top:0;\n' +
  '    border-top:1px solid #e2e2e2\n' +
  '  }\n' +
  '  .layui-layedit-tool .layedit-tool-mid,.layui-layedit-tool .layui-icon {\n' +
  '    display:inline-block;\n' +
  '    vertical-align:middle;\n' +
  '    text-align:center;\n' +
  '    font-size:14px\n' +
  '  }\n' +
  '  .layui-layedit-tool .layui-icon {\n' +
  '    position:relative;\n' +
  '    width:32px;\n' +
  '    height:30px;\n' +
  '    line-height:30px;\n' +
  '    margin:3px 5px;\n' +
  '    color:#777;\n' +
  '    cursor:pointer;\n' +
  '    border-radius:2px\n' +
  '  }\n' +
  '  .layui-layedit-tool .layui-icon:hover {\n' +
  '    color:#393D49\n' +
  '  }\n' +
  '  .layui-layedit-tool .layui-icon:active {\n' +
  '    color:#000\n' +
  '  }\n' +
  '  .layui-layedit-tool .layedit-tool-active {\n' +
  '    background-color:#e2e2e2;\n' +
  '    color:#000\n' +
  '  }\n' +
  '  .layui-layedit-tool .layui-disabled,.layui-layedit-tool .layui-disabled:hover {\n' +
  '    color:#d2d2d2;\n' +
  '    cursor:not-allowed\n' +
  '  }\n'+
  '  .mobanHtml{\n' +
  '   span div{display:inline-block}\n' +
  '  .layui-input, .layui-select, .layui-textarea{\n' +
  '    height: 28px;\n' +
  '  }\n' +
  '  .layui-input_tc{text-align:center}\n' +
  '  .layui-form-label{\n' +
  '    padding: 4px 5px 4px 14px;\n' +
  '    width:auto;\n' +
  '    line-height:22px;\n' +
  '  }\n' +
  '  .ass-remark-div{\n' +
  '    margin-bottom:-10px;\n' +
  '    margin-right:0;\n' +
  '    display:inline-block;\n' +
  '    position:relative;\n' +
  '  }\n' +
  '  .layui-form-item .layui-form-checkbox[lay-skin=primary]{margin-top:0}\n' +
  '  .layui-form-radio{margin-top:0px}\n' +
  '  .labelDiv{float:left;width:auto;display:block;}\n' +
  '  .disLabel{color:#999}\n' +
  '  .layui-form div.lh35{line-height:28px;}\n' +
  '  .layui-form div.optDiv :after {\n' +
  '  }\n' +
  '  .bind-ass-tit{margin-left:20px;text-align:right;}\n' +
  '  .bind-ass-tit145{min-width:145px;}\n' +
  '  .ass_score{width:80px;}\n' +
  '  .ass_res{width:220px;}\n' +
  '  .mobalElement{margin:2px auto}\n' +
  '  /*.ass_act_but{width:80px}*/\n' +
  '  .layui-form-label-r {\n' +
  '    float: right;\n' +
  '    display: block;\n' +
  '    padding: 4px 5px;\n' +
  '    width: auto;\n' +
  '    font-weight: 400;\n' +
  '    line-height: 20px;\n' +
  '    text-align: left;\n' +
  '  }\n' +
  '  .layui-form-item .layui-input-inline{width:auto;}\n' +
  '  .layui-input-block{min-height:auto}\n' +
  '  .but_area{min-width:100px}\n' +
  '  .layui-form-item .layui-inline{margin-bottom:0px}\n' +
  '\n' +
  '  ul{margin:0;padding:0;width:149px;display:inline-block;border-right:1px solid #c0c0c0;}\n' +
  '  ul.ul_w_125{width:118px;}\n' +
  '  ul.ul_w_155{width:154px;}\n' +
  '  ul.ul_w_165{width:164px;}\n' +
  '  ul.ul_w_165{width:164px;}\n' +
  '  ul.ul_w_75{width:77px;float:left}\n' +
  '  ul.ul_no_r_border{border-right:none}\n' +
  '  ul li{list-style:none; height:35px;border-bottom:1px solid #c9c9c9;display:block;width:100%; vertical-align:middle;line-height:30px;}\n' +
  '  ul li.t_c{text-align:center}\n' +
  '  ul.put_is_modi{box-shadow:#FF3300 0px 0px 10px inset;}\n' +
  '  ul.post_is_modi{box-shadow:#0066FF 0px 0px 10px inset;}\n' +
  '  ul.put_is_modi li{ background-color: #FFF1E3}\n' +
  '  ul.post_is_modi li{ background-color: #EBFFD9}\n' +
  '  /*ul.isModi li{ background-color: #F0F7FF}*/\n' +
  '  .label-score {\n' +
  '    text-align: center;\n' +
  '    background-color: #1E9FFF;\n' +
  '    color:#EAF7FF;\n' +
  '    overflow: hidden;\n' +
  '    box-sizing: border-box;\n' +
  '    float:right;\n' +
  '    padding-left:5px;\n' +
  '    height:28px;\n' +
  '    cursor:pointer;\n' +
  '  }\n' +
  '  .label-score:hover {\n' +
  '    color:#fff;\n' +
  '    background-color: #48B1FF;\n' +
  '  }\n' +
  '  .layui-form-checkbox[lay-skin=primary] i{text-indent:0}\n' +
  '  /*防跌倒增加*/\n' +
  '  table{border:1px solid #c9c9c9; background-color: rgb(255, 255, 255); text-align: left; border-collapse: collapse;margin:0 auto;}\n' +
  '  table.td_p_l_10 tr td{padding-left:10px;}\n' +
  '  table  tr td.pl_none{padding-left:0px;}\n' +
  '  td{line-height:35px;font-size:14px;}\n' +
  '  table.ass_10002 tr td,table.ass_10003 tr td{padding:0 0 0 5px;line-height:150%;height:35px;}\n' +
  '  table.ass_take_care_by_self tr td{line-height:150%;height:35px;padding:0}\n' +
  '  table.w960,div.w960{width:950px;}\n' +
  '  table.ass_pain{border:none; border-style:none;margin-top:30px}\n' +
  '  table.ass_pain tr td{ line-height:50px;}\n' +
  '\n' +
  '  table.ass_vte tr td{padding:0 0 0 10px;line-height:150%;height:35px;}\n' +
  '  table.ass_vte  tr td.pl_none{padding-left:0px;}\n' +
  '\n' +
  '  td.td_textM{text-align:center}\n' +
  '  td#loop_container{\n' +
  '    padding:0;\n' +
  '    vertical-align: top;\n' +
  '  }\n' +
  '  td.fontW600,.fontW600{font-weight:600}\n' +
  '  table.ass_10003 tr td.titleV{line-height:120%;}\n' +
  '  div.w900{width:900px;margin:20px auto;}\n' +
  '  div.w1000{width:1000px;margin:20px auto;}\n' +
  '  div.fl{float:left}\n' +
  '  div.fr{float:right}\n' +
  '  div.clear{clear:both}\n' +
  '  div.list{margin:10px 0 10px 0;}\n' +
  '  div.list div.mobalElement{margin-left:10px;margin-right:10px;}\n' +
  '  div.ass_title{font-weight: 600;margin-top:30px;}\n' +
  '  div.interval{width:100%;border-bottom:1px dashed #c9c9c9;margin-bottom:20px;margin-top:10px;}\n' +
  '  /*专供VTE-大出血并发症相关*/\n' +
  '  .radioTmp .layui-form-radio {padding-right:0;width:100%}\n' +
  '  .radioTmp .layui-form-radio i{float:left}\n' +
  '  .radioTmp .layui-form-radio div{float:left;width: 100%;width:-moz-calc(100% - 35px); width:calc(100% - 35px);}\n' +
  '\n' +
  '  .checkTmp .layui-form-checkbox {padding-right:0;width:100%}\n' +
  '  .checkTmp .layui-form-checkbox i{float:left;}\n' +
  '  .checkTmp .layui-form-checkbox span{padding-right:0;float:left;display:inline-block;white-space:normal}\n' +
  '  .checkTmp .layui-form-label{padding-top:0;}\n' +
  '  .layui-icon-close,layui-icon-tips{color:#FF6666}\n' +
  '  table.lh28 tr td{ line-height:28px;}\n' +
  '\n' +
  '\n' +
  '  }\n' +
  '';
