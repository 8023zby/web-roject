import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
// vue-router 3.1.0+ push/replace cause NavigationDuplicated error
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

let routers = []
let specRouter = []
let finalRouters = []
const requireRouter = require.context(
  // 其组件目录的相对路径
  '../../router',
  // 是否查询其子目录
  true,
  // 匹配基础文件名的正则表达式
  /(router.js|Router.js)$/
)
requireRouter.keys().forEach(fileName => {
  // 获取动态路由
  const componentConfig = requireRouter(fileName)
  const item = componentConfig.default
  if (fileName.indexOf('Router') > -1) {
    specRouter = [...specRouter, ...item]
  } else {
    routers = [...routers, ...item]
  }
})

// 形成最后的路由
finalRouters = [
  {
    path: '/main',
    name: 'main',
    component: () => import('../../views/passport/Main.vue'),
    children: routers
  }
]
finalRouters = [...finalRouters, ...specRouter]
let router = new Router({
  routes: finalRouters
})
// 地址错误增加跳转404页面
router.beforeEach((to, from, next) => {
  let authorityList = localStorage.getItem('authorityList') || ''
  let toPath = to.path
  let toQuery = to.query
  let fromPath = from.path
  let meta = to.meta || {}
  let noPrevent = meta.noPrevent || ''
  let tag = meta.tag || ''
  if ((fromPath === '/' || tag === 'spec') && toPath !== '/main') {
    localStorage.setItem('toPath', toPath)
    localStorage.setItem('toQuery', JSON.stringify(toQuery))
  } else {
    localStorage.setItem('toPath', '')
  }
  if (noPrevent === 'yes' || to.path === '/login' || to.path === '/loginNew' || to.path === '/' || to.path === '/changePassword' || to.path === '/phone/login' || to.path === '/userReg' || to.path === '/passport_systemApply' || to.path === '/errorInfo' || to.path === '/authInfo') {
    next()
  } else if (authorityList === '') {
    router.push('/login')
    return false
  } else if (to.matched.length === 0) {
    next('/errorInfo')
  } else {
    next()
  }
})
export default router
