/*
 *  前言 本方法是为了通用使用方法而生，大家有任何通用方法可以放到此处
 */
// 持久化数据
// localStorage.setItem('empInfo', JSON.stringify(empInfo))
// localStorage.setItem('deptInfo', JSON.stringify(deptInfo))
// localStorage.setItem('orgInfo', JSON.stringify(orgInfo))
// localStorage.setItem('jobInfo', JSON.stringify(jobInfo))
// localStorage.setItem('dataDeptInfoList', JSON.stringify(dataDeptInfoList))
// localStorage.setItem('authorityList', JSON.stringify(authorityList))
// console.log(getStorageUser('dataDeptInfoList'))

import getStorageUser from '@/assets/hpms/utils/storageUser'
import { Message } from 'element-ui'

/*
 * 获取护理单元ID
 */
export function selectDeptInfo () {
  // 获取当前用户下的护理单元
  const nurseUnitList = getStorageUser('selectDeptInfo')
  if (nurseUnitList === null || nurseUnitList === '') {
    Message({
      typt: 'error',
      message: '当前护理单位为空,请选择护理单元！！！！'
    })
    return false
  }
  return nurseUnitList.deptId
}

/*
 * 获取护理单元
 */
export function selectDeptInfoData () {
  // 获取当前用户下的护理单元
  const nurseUnitList = getStorageUser('selectDeptInfo')

  if (nurseUnitList === null || nurseUnitList === '') {
    Message({
      typt: 'error',
      message: '当前护理单位为空,请选择护理单元！！！！'
    })
    return false
  }

  return nurseUnitList
}

/*
 * 获取数据后，把数据组织成select格式试用于各种数据格式
 * 1 arr 数据
 * 2 labelName, labelValue (数据中的值：value)
 * 3 label value(数据中的名称：key)
 */

export function getSelectData ({
  arr,
  labelName,
  labelValue,
  label = 'label',
  value = 'value'
}) {
  const n = []
  for (let item of arr) {
    n.push({
      [label]: item[labelName],
      [value]: item[labelValue]
    })
  }
  return n
}

/*
 * 动态传入多个参数
 * data 对象值，params 参数
 *  {
     data: nurseUnitList,
      params: {
        zhaichong1: 'createTime',
        zhaichong2: 'deptName',
        zhaichong3: 'orgId',
        zhaichong4: 'deptId',
        zhaichong5: 'parentId'
      }
    }
 *
 */

/**
  * 通用el-select 组装
  * @param {data} [array] - 是组数
  * @param {Array}[params] 可传多参数，值。比如是在上面数组中有的key 详细看例子
  * @example 调用示例
  *
    this.Category = newGetSelectData({
    data: [{ value: 1, name: '视频' }, { value: 0, name: '图文' }], // 数组
    params: {
      value: 'value', // el-select 中的value 的值
      label: 'name', // el-select 中的label  名称
      // 也可以自定义值 例如
      zhaichong1: 'createTime',
      zhaichong2: 'deptName',
      zhaichong3: 'orgId'
    }
  })
**/

export function newGetSelectData ({
  data,
  params
}) {
  const n = data.map((varlue, index) => {
    const o = {}
    for (let item in params) {
      o[item] = varlue[params[item]]
    }
    return o
  })
  return n
}

/**
  * 通用列表对照
  * @param {Array} [array] - 是组数还是对象
  * @param {String} [id] - 当是数组的时候需要把要比对的值传入,对象的时候且不需要
  * @param {String} [value] - 数组中要比对字段的key,传入对象且不需要
  * @param {String}[label] 数组中要比对字段的value
  * @param {boolean}[flag] 是组数还是对象，数组默认true,对象 需要传入flase
  * @example 调用示例
  * formatter([{name:'1',id:1},{name:'2',id:2}], 2, {value: 'id', label:'name' })
  * formatter({name:'1',id:1}, null, {label:'name',flag:false }
**/
export function formatter (
  array,
  id, {
    value = 'value',
    label = 'label',
    flag = true
  }) {
  if (flag) {
    for (let a of array) {
      if (Object.is(a[value], id)) {
        return a[label]
      }
    }
  } else {
    return array[label]
  }
}

/**
  * 数组对象是否有重复数据
  * @param {Array} [array] - 组数
  * @param {Array} [array] - 去重字段
  * @example 调用示例
  * formatter([{name:'1',id:1},{name:'2',id:2}], 2, {value: 'id', label:'name' })
  * formatter({name:'1',id:1}, null, {label:'name',flag:false }
**/
export function dataReduce (array, value) {
  let obj = {}
  let reduce = array.reduce((cur, next) => {
    obj[next.value] ? '' : (obj[next.value] = true && cur.push(next))
    return cur
  }, []) // 设置cur默认类型为数组，并且初始值为空的数组
  return reduce
}
