/**
 * Y轴各种类型一个单位所占像素
 * @param type 类型 mb脉搏 xl心率 tw体温 tt疼痛
 * @param tbHeight
 * @returns {number}
 */
export function unitYPx (type, tbHeight = 14) {
  let px = 0
  switch (type) {
    case 'mb':
    case 'xl':
      px = tbHeight * 5 / 20
      break
    case 'wd':
      px = tbHeight * 5 / 1
      break
    case 'tt':
      px = tbHeight / 2
      break
  }

  return px
}

/**
 * y轴开始原点坐标数据
 * @param type
 * @returns {number}
 */
export function getOriginY (type) {
  let y = 0
  switch (type) {
    case 'mb':
    case 'xl':
      y = 0
      break
    case 'wd':
      y = 33
      break
    case 'tt':
      y = 0
      break
  }

  return y
}

/**
 * 两个日期差
 * @param beginDate 体温单开始七日期
 * @param endDate 结束日期
 * @param beginHour 结束日期的小时
 * @returns {number}
 */
export function getDateDiff (beginDate, endDate, beginHour) {
  beginHour = beginHour || 2

  // 判断是否是Date对象
  if (!(beginDate instanceof Date)) {
    beginDate = new Date(beginDate.replace(/-/g, '/'))
  }
  if (!(endDate instanceof Date)) {
    endDate = new Date(endDate.replace(/-/g, '/'))
  }
  return (endDate - beginDate) / (3600 * 1000 * 24)
}

/**
 * 获取元素坐标
 * @param svgHeight 总高度
 * @param td{height, width} 单元格
 * @param point 点数据
 * @param beginDate 体温单开始日期
 * @param type 点配型
 * @returns {{x: number, y: number, value: *, type: *, point: *}}
 */
export function getXY (svgHeight, td, point, beginDate, hours, type, flag) {
  let curDate = point.recordDate.split(' ')[0] + ' 00:00:00'
  let daysW = td.width * 6

  let hourIndex = getHourIndex(point.itemHour, hours || [])
  //
  let xPx = getDateDiff(beginDate, curDate) * daysW + td.width * hourIndex - td.width / 2

  let value = flag ? parseFloat(point.phValue) : parseFloat(point.signValue)
  // if(flag) console.log('1 - '+point.phValue, '2 - ' + point.signValue);
  // 一刻度是几个像素，y轴
  let uYPx = unitYPx(type)
  let oY = getOriginY(type) // y轴原点数值
  let yPx = Math.ceil(svgHeight - uYPx * (value - oY))

  return {
    x: xPx,
    y: yPx,
    value: parseFloat(point.signValue),
    type: point.itemValueType,
    point: point
  }
}

export function getHourIndex (h, hours) {
  for (let i = 0; i < hours.length; i++) {
    if (h === hours[i].takeTemperatureTime) {
      return i + 1
    }
  }
  return 1
}

/**
 * @method segmentsIntr  求二元一次方程的交点
 * @param {JSON} line1 线条1方程
 * @param {JSON} line2 线条2方程
 * @return 交点
 * */
export function segmentsIntr (line1, line2) {
  let a1 = line1.a
  let a2 = line2.a
  let b1 = line1.b
  let b2 = line2.b
  let x, y
  if (a2 === undefined || b2 === undefined) {
    x = line2.x
    y = a1 + b1 * x
  } else {
    x = (a1 - a2) / (b2 - b1)
    y = a1 + b1 * x
  }
  x = parseFloat(parseFloat(x).toFixed(4))
  y = parseFloat(parseFloat(y).toFixed(4))
  return {
    x: x,
    y: y
  }
}

/**
 * @method getDoundary 计算边界
 * @param point
 * @returns {{maxX: Number, minX: Number, maxY: Number, minY: Number}}
 */

export function getDoundary (point) {
  let maxX = +point[0].x
  let minX = +point[0].x
  let maxY = +point[0].y
  let minY = +point[0].y
  for (let i = 0; i < point.length; i++) {
    let pointX = +point[i].x
    let pointY = +point[i].y
    if (pointX > maxX) {
      maxX = pointX
    }
    if (pointX < minX) {
      minX = pointX
    }
    if (pointY > maxY) {
      maxY = pointY
    }
    if (pointY < minY) {
      minY = pointY
    }
  }
  return {
    maxX: parseFloat(parseFloat(maxX).toFixed(4)),
    minX: parseFloat(parseFloat(minX).toFixed(4)),
    maxY: parseFloat(parseFloat(maxY).toFixed(4)),
    minY: parseFloat(parseFloat(minY).toFixed(4))
  }
}

/**
 * @getBlueLineFuncs 获取蓝斜线方法
 * @param {Number/Float} b 斜度
 * @returns {Array}
 */
export function getBlueLineFuncs (b) {
  b = b || -4
  let blueLineFuncs = []
  // 计算蓝斜线可能显示的最大区域，即根据系数，计算常数的最小值，和最大值
  let svgW = 15 * 42
  let svgH = 14 * 55
  let disI = parseInt(b) * 3
  if (b < 0) {
    let a1 = 0
    let a2 = svgH - b * svgW
    for (let i = a1; i < a2; i = i + 16) { //
      blueLineFuncs.push({ a: i, b: b })
    }
  } else {
    let a1 = -(svgW / b)
    let a2 = svgH
    for (let i = a1; i < a2; i = i + 16) {
      blueLineFuncs.push({ a: i, b: b })
    }
  }
  return blueLineFuncs
}

/**
 * @method splitGroup 根据请假事件分组
 * @param {Array} leaveEvent 请假事件
 * @param {Array} point 录入信息
 */
export function splitGroup (leaveEvent, point) {
  // 没有请假事件
  if (leaveEvent.length === 0) {
    return [point]
  }
  // 按请假事件分组 根据请假事件的数量，判断分组数量
  let groupArray = []
  let groupRule = [] // 缓存分组规则
  let groupNum = leaveEvent.length + 1 // 分组数量
  for (let i = 0; i < groupNum; i++) { // 计算分组规则
    groupRule[i] = {}
    if (i === 0) {
      groupRule[i].min = leaveEvent[i]
    } else if (i === groupNum - 1) {
      groupRule[i].max = leaveEvent[i - 1]
    } else {
      groupRule[i].min = leaveEvent[i - 1]
      groupRule[i].max = leaveEvent[i]
    }
  }

  // 将录入信息根据请假事件分组
  for (let i = 0; i < groupRule.length; i++) {
    let min = groupRule[i].min
    let max = groupRule[i].max
    groupArray[i] = [] // 初始化
    for (let j = 0; j < point.length; j++) {
      let time = point[j].recordDate.split(' ')[0] + ' ' + point[j].itemHour + ':00:00'
      if (judgeIn(time, min, max)) {
        groupArray[i].push(point[j])
      }
    }
  }
  return groupArray
}

/**
 * @method judgeIn 判断当前时间是否处于某个时间段
 * @param {String} curTime 当前时间
 * @param {String} minTime 最小时间
 * @param {String} maxTime 最大时间
 * @return {Boolean}
 */
export function judgeIn (curTime, minTime, maxTime) {
  curTime = new Date(curTime.replace(/-/g, '/'))
  minTime = minTime ? new Date(minTime.replace(/-/g, '/')) : 0
  maxTime = maxTime ? new Date(maxTime.replace(/-/g, '/')) : 0
  if (!minTime && maxTime) { // 最小时间未定义，则返回是否大于最大值
    if (curTime > maxTime) {
      return true
    }
  }
  if (minTime && !maxTime) {
    if (curTime <= minTime) {
      return true
    }
  }
  if (minTime && maxTime) {
    if (curTime > minTime && curTime <= maxTime) {
      return true
    }
  }
}

/**
 * @method getPolygon 获取多边形
 * @param {Array} mbPoints 脉搏点
 * @param {Array} xlPoints 心率点
 * 脉搏短绌即在同一单位时间内，脉率少于心率
 */
export function getPolygon (mbPoints, xlPoints) {
  // console.log(mbPoints, xlPoints)
  let polygonArray = []
  let intersectionArray = [] // 缓存交点数组
  for (let i = 0; i < mbPoints.length; i++) {
    intersectionArray[i] = []
    let mbArray = mbPoints[i]
    let xlArray = xlPoints[i]
    // 如果不存在脉搏大于心率的点则不绘制多边形
    if (mbArray.length === 0 || xlArray.length === 0) {
      return polygonArray
    }
    for (let j = 0; j < mbArray.length; j++) {
      let curMbX = getParseFloat(mbArray[j].x, 4)
      let curMbY = getParseFloat(mbArray[j].y, 4)
      if (mbArray[j + 1] !== undefined) {
        let nextMbX = getParseFloat(mbArray[j + 1].x, 4)
        let nextMbY = getParseFloat(mbArray[j + 1].y, 4)
        let line1 = lineX({ 'x': curMbX, 'y': curMbY }, { 'x': nextMbX, 'y': nextMbY })
        for (let h = 0; h < xlArray.length; h++) {
          let curXlX = getParseFloat(xlArray[h].x, 4)
          let curXlY = getParseFloat(xlArray[h].y, 4)
          if (xlArray[h + 1] !== undefined) {
            let nextXlX = getParseFloat(xlArray[h + 1].x, 4)
            let nextXlY = getParseFloat(xlArray[h + 1].y, 4)
            let line2 = lineX({ 'x': curXlX, 'y': curXlY }, { 'x': nextXlX, 'y': nextXlY })
            let interX = segmentsIntr(line1, line2).x
            let interY = segmentsIntr(line1, line2).y
            // 交点在心率线段上
            if (h === xlArray.length - 2 && j === xlArray.length - 2) {
              // console.log(segmentsIntr(line1,line2))
            }
            let xlBool = interX >= curXlX && interX <= nextXlX && (interY >= curXlY && interY <= nextXlY || interY <= curXlY && interY >= nextXlY)
            // 交点在脉搏线段上
            let mbBool = interX >= curMbX && interX <= nextMbX && (interY >= curMbY && interY <= nextMbY || interY <= curMbY && interY >= nextMbY)
            if (xlBool && mbBool) {
              intersectionArray[i].push(segmentsIntr(line1, line2))
            }
          }
        }
      }
    }
  }
  // 根据交点计算多边形
  for (let i = 0; i < intersectionArray.length; i++) {
    let interArray = intersectionArray[i]
    let xlPoint = xlPoints[i]
    let mbPoint = mbPoints[i]
    if (interArray.length === 0) { // 不存在交点
      // 判断是否所有脉搏小于心率的点,按x坐标分组
      let coor = {}
      for (let j = 0; j < xlPoint.length; j++) {
        let x = xlPoint[j].x
        let y = xlPoint[j].y
        coor[x] = coor[x] || []
        coor[x]['xl'] = y
      }
      for (let j = 0; j < mbPoint.length; j++) {
        let x = mbPoint[j].x
        let y = mbPoint[j].y
        coor[x] = coor[x] || []
        coor[x]['mb'] = y
      }
      let isMore = true
      for (let j in coor) {
        if (coor[j].xl && coor[j].mb) {
          if (coor[j].xl > coor[j].mb) {
            isMore = false
            break
          }
        }
      }
      if (isMore) { // 存在脉搏短促
        let newXlpoint = xlPoint
        let newMbpoint = mbPoint
        let newPoint
        newXlpoint.reverse()
        newPoint = newMbpoint.concat(newXlpoint)
        newPoint.push(newMbpoint[0])
        polygonArray.push(newPoint)
      }
    }
    // 存在交点，绘制交点前的多边形
    // console.log(intersectionArray)
    if (interArray.length > 0 && mbPoint.length > 0) {
      // 获取第一个交点前脉搏、心率点
      let mbArray = []
      let xlArray = []
      let firstInter = interArray[0]
      let firstInterX = interArray[0].x
      for (let k = 0; k < mbPoint.length; k++) {
        let moreX = mbPoint[k].x
        if (moreX <= firstInterX) {
          mbArray.push(mbPoint[k])
        }
      }
      for (let k = 0; k < xlPoint.length; k++) {
        let moreX = xlPoint[k].x
        if (moreX <= firstInterX) {
          xlArray.push(xlPoint[k])
        }
      }
      if (mbArray.length > 0 || xlArray.length > 0) {
        mbArray.push(firstInter)
        xlArray.reverse()
        mbArray = mbArray.concat(xlArray)
        mbArray.push(mbArray[0])
        polygonArray.push(mbArray)
      }
    }
    // 存在多个交点
    for (let f = 0; f < interArray.length; f++) {
      if (interArray[f] && interArray[f + 1] !== undefined) {
        let enterX = interArray[f].x
        let enterNextX = interArray[f + 1].x
        let morePointArray = [] // 保存相邻的两个 交点（心率）
        let lessPointArray = [] // 保存相邻的两个 交点（脉搏）
        for (let j = 0; j < mbPoint.length; j++) {
          let moreX = mbPoint[j].x
          if (moreX >= enterX && moreX <= enterNextX) {
            morePointArray.push(mbPoint[j])
          }
        }
        for (let j = 0; j < xlPoint.length; j++) {
          let moreX = xlPoint[j].x
          if (moreX >= enterX && moreX <= enterNextX) {
            lessPointArray.push(xlPoint[j])
          }
        }
        if (morePointArray.length > 0) { // 存在心率大于脉搏的点
          morePointArray.unshift(interArray[f])
          lessPointArray.reverse()
          morePointArray.push(interArray[f + 1])
          morePointArray = morePointArray.concat(lessPointArray)
          morePointArray.push(interArray[f])
          polygonArray.push(morePointArray)
        }
      } else if (interArray[f] && interArray[f + 1] === undefined) {
        // 获取最后的节点
        let morePointArray = [] // 保存相邻的两个 交点（心率）
        let lessPointArray = [] // 保存相邻的两个 交点（脉搏）
        let enterX = interArray[f].x
        for (let j = 0; j < mbPoint.length; j++) {
          let moreX = mbPoint[j].x
          if (moreX > enterX) {
            morePointArray.push(mbPoint[j])
          }
        }
        for (let j = 0; j < xlPoint.length; j++) {
          let moreX = xlPoint[j].x
          if (moreX > enterX) {
            lessPointArray.push(xlPoint[j])
          }
        }
        if (morePointArray.length > 0 && lessPointArray.length > 0) { // 存在心率大于脉搏的点
          morePointArray.unshift(interArray[f])
          lessPointArray.reverse()
          morePointArray = morePointArray.concat(lessPointArray)
          morePointArray.push(interArray[f])
          polygonArray.push(morePointArray)
        }
      }
    }
  }
  return polygonArray || []
}

/**
 * @method getParseFloat 将浮点数保留多少位小数
 * @param {String/Float} number 数字
 * @param {String/Float} sub 保留多少位小数
 */
export function getParseFloat (number, sub) {
  return parseFloat(parseFloat(number).toFixed(sub))
}

/**
 * @method lineX 根据两点求二元一次方程
 * @param {JSON} point1 点1{x:"",y:""}
 * @param {JSON} point2 点2{x:"",y:""}
 * @return {JSON} a为常数，b为系数, 返回x为垂直于x轴的直线，返回Y为垂直于y轴的直线
 * */
export function lineX (point1, point2) {
  let x1 = point1.x
  let x2 = point2.x
  let y1 = point1.y
  let y2 = point2.y
  if (x2 - x1 === 0) {
    return { x: x1 }
  }
  // 求系数
  let b = (y2 - y1) / (x2 - x1)
  // 求常数
  let a = y1 - b * x1
  return {
    a: a,
    b: b
  }
}

/**
 * @method numToChinese 将阿拉伯数字转换成中文数字
 * @param {Array} numArray 阿拉伯数字数组
 * @param {Array} chineseArray 中文数字数组
 * @return
 * */
export function numToChinese (numArray, chineseArray) {
  let finalStr = ''
  if (numArray.length === 1) {
    finalStr = chineseArray[parseInt(numArray[0])]
    return finalStr
  } else {
    if (numArray[0] === '1') {
      if (numArray[1] === '0') {
        finalStr += '十'
      } else {
        finalStr += '十' + chineseArray[parseInt(numArray[1])]
      }
    } else {
      if (numArray[1] === '0') {
        finalStr += chineseArray[parseInt(numArray[0])] + '十'
      } else {
        finalStr += chineseArray[parseInt(numArray[0])] + '十' + chineseArray[parseInt(numArray[1])]
      }
    }
  }
  return finalStr
}
