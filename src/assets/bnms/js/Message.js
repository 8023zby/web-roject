import { Message } from 'element-ui'
/**
 * 提示操作
 */
export const MsgShow = (type = 'success', msg = '成功', time = 1000, showClose = false) => {
  Message({
    showClose: showClose,
    type: type,
    message: msg,
    duration: time
  })
}
/**
 * 通用的增删改成返回格式
 * data 返回数据
 * msg 提示次
 * fun 回调方法
 * obj 把对象自己传过来，防止this丢失
 * **/
export const ResultMsg = (data, msg, fun, obj) => {
  let status = data.status || ''
  let desc = data.desc || ''
  if (status === 200) {
    MsgShow('success', `${msg}成功！`)
    setTimeout(() => {
      fun && fun.call(obj)
    }, 1200)
  } else if (desc !== '') {
    MsgShow('error', desc, 3000)
    return false
  } else {
    MsgShow('error', `${msg}失败！`)
  }
}
