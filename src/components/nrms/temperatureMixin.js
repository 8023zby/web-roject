import moment from 'moment'
export default {
  data () {
    return {
      // 表头数据
      autoHead: {
        tplId: '',
        formName: '',
        tplHtml: '<div>loading</div>',
        tplData: {}
      }
    }
  },
  computed: {
    newCurWeekDate: function () {
      let arr = []
      for (let i = 0; i < this.curWeekDate.length; i++) {
        const p = this.curWeekDate[i - 1] ? this.curWeekDate[i - 1] : ''
        const c = this.curWeekDate[i]
        const pYY = moment(p).format('YYYY')
        const pMM = moment(p).format('MM')
        const cYY = moment(c).format('YYYY')
        const cMM = moment(c).format('MM')
        if (p && pYY === cYY) {
          if (pMM === cMM) {
            const cDD = moment(c).format('DD')
            arr.push(cDD)
          } else {
            const cMMDD = moment(c).format('YYYY-MM-DD')
            arr.push(cMMDD)
          }
        } else {
          arr.push(c)
        }
      }
      return arr
    }
  },
  methods: {
    // 获取坐标
    getXY (point, beginDate, type, flag) {
      let curDate = point.recordDate.split(' ')[0] + ' 00:00:00'
      let daysW = this.td.width * this.hours.length

      let hourIndex = this.getHourIndex(point.itemHour)
      // 计算x轴坐标 :天 + 测量时间 + 半个格子(居中)
      let xPx = this.getDateDiff(beginDate, curDate) * daysW + this.td.width * hourIndex - this.td.width / 2

      let value = flag ? parseFloat(point.phValue) : parseFloat(point.signValue)
      // 一刻度是几个像素，y轴
      let uYPx = this.unitYPx(type)
      // y轴每种体征项在画布上开始原点坐标
      let oY = 0
      oY = this.getOriginY(type)
      // 计算y周坐标
      let yPx = Math.ceil(this.svgHeight - uYPx * (value - oY))
      // 减去疼痛等级处增加的两行所占高度
      if (this.relationType === '2' || this.relationType === '5' || this.relationType === '6') {
        if (type === 'tt') {
          yPx -= 15
        } else {
          yPx -= 30
        }
      }

      return {
        x: xPx,
        y: yPx,
        value: parseFloat(point.signValue),
        type: point.itemValueType,
        point: point
      }
    },
    /**
     * 获取测量时间的索引
     * @param h
     * @param hours
     * @returns {number}
     */
    getHourIndex (h) {
      for (let i = 0; i < this.hours.length; i++) {
        if (h === this.hours[i].measuringTime) {
          return i + 1
        }
      }
      return 1
    },
    /**
     * 两个日期相差几天
     * @param beginDate 体温单开始日期
     * @param endDate 结束日期
     * @returns {number}
     */
    getDateDiff (beginDate, endDate) {
      // 判断是否是Date对象
      if (!(beginDate instanceof Date)) {
        beginDate = new Date(beginDate.replace(/-/g, '/'))
      }
      if (!(endDate instanceof Date)) {
        endDate = new Date(endDate.replace(/-/g, '/'))
      }
      return (endDate - beginDate) / (3600 * 1000 * 24)
    },
    /**
     * Y轴 每种体征项一个单位所占像素， 比如: 1°C 占5个格子
     * @param type 类型 mb脉搏 xl心率 tw体温 tt疼痛
     * @param tbHeight
     * @returns {number}
     */
    unitYPx (type) {
      let px = 0
      switch (type) {
        case 'mb':
        case 'xl':
          px = this.td.height * 5 / 20
          break
        case 'wd':
          px = this.td.height * 5 / 1
          break
        case 'tt':
          px = this.td.height / 2
          break
      }

      return px
    },
    /**
     * y轴每种体征项在画布上开始原点坐标
     * @param type
     * @returns {number}
     */
    getOriginY (type) {
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
    },
    /**
     * @method splitGroup 根据事件时间把所有数据分组
     * @param {Array} eventsTime 事件时间集合
     * @param {Array} point 所有的数据
     * @returns [[{point},...], [{point},...]]
     */
    splitGroup (eventsTime, points) {
      // 没有请假事件
      if (eventsTime.length === 0) {
        return [points]
      }
      // 按请假事件分组 根据请假事件的数量，判断分组数量
      let groupArray = []
      let groupRule = [] // 缓存分组规则
      let groupNum = eventsTime.length + 1 // 分组数量
      for (let i = 0; i < groupNum; i++) { // 计算分组规则
        groupRule[i] = {}
        if (i === 0) {
          groupRule[i].min = eventsTime[i]
        } else if (i === groupNum - 1) {
          groupRule[i].max = eventsTime[i - 1]
        } else {
          groupRule[i].min = eventsTime[i - 1]
          groupRule[i].max = eventsTime[i]
        }
      }

      // 将录入信息根据事件分组
      for (let i = 0; i < groupRule.length; i++) {
        let min = groupRule[i].min
        let max = groupRule[i].max
        groupArray[i] = [] // 初始化
        for (let j = 0; j < points.length; j++) {
          let time = points[j].recordDate.split(' ')[0] + ' ' + points[j].itemHour + ':00:00'
          if (this.judgeIn(time, min, max)) {
            groupArray[i].push(points[j])
          }
        }
      }
      return groupArray
    },
    /**
     * 查看日期时刻是否有心率
     *
     * @param xlPoints
     * @param dateHour
     * @returns {boolean}
     */
    hasXlByDateHour (xlPoints, dateHour) {
      // debugger
      for (let i = 0; i < xlPoints.length; i++) {
        let xl = xlPoints[i]
        const xlDateHour = xl.recordDate.split(' ')[0] + ' ' + xl.itemHour + ':00'
        if (xlDateHour === dateHour) {
          return true
        }
      }
      return false
    },
    /**
     * 根据心率>180 或者 每天时刻点为空分组心率和脉搏
     * 用于画多边形用
     *
     * @param xlPoint 心率所有点
     * @param mbPoints 脉搏所有点
     * @param weekDate 当前周的日期
     * @param hours 时刻点
     * 开始日期
     */
    splitGroupXlMb (xlPoints, mbPoints, weekDate, hours, beginDate) {
      // 获取脉搏
      function getXl (mb) {
        for (let i = 0; i < xlPoints.length; i++) {
          let xl = xlPoints[i]
          if (xl.recordDate === mb.recordDate && xl.itemHour === mb.itemHour && xl.itemType === mb.itemType) {
            return xl
          }
        }
        return null
      }

      let index = 0
      let group = []
      let xlGroup = []
      let mbGroup = []
      for (let i = 0; i < mbPoints.length; i++) {
        let mb = mbPoints[i]
        let xl = getXl(mb)
        // 心率和脉搏同时存在， 心率小于180
        if (!xl || xl.signValue > 180) {
          if (xlGroup.length > 0) {
            if (!group[index]) {
              group[index] = []
            }
            group[index] = {
              xl: xlGroup,
              mb: mbGroup
            }
            index++
            xlGroup = []
            mbGroup = []
          }
        } else {
          xlGroup.push(this.getXY(xl, beginDate, 'xl'))
          mbGroup.push(this.getXY(mb, beginDate, 'mb'))
        }
      }
      // 剩余的放入
      if (xlGroup.length > 0) {
        if (!group[index]) {
          group[index] = []
        }
        group[index] = {
          xl: xlGroup,
          mb: mbGroup
        }
      }

      console.log('group ', group)

      return group
      // console.log('dateHours  ', dateHours)
    },
    /**
     * 根据脉搏合并心率 *废弃*
     * 在脉搏和心率一样时，护士会只录入脉搏，为了在图上能正确显示这里加个合并，
     * 把只有脉搏没有心率的时刻点，增加上心率
     *
     * @param mbPoints
     * @param xlPoints
     * @returns {*}
     */
    mergeXlPointByMb (mbPoints, xlPoints) {
      const has = (mb) => {
        for (let i = 0; i < xlPoints.length; i++) {
          let xl = xlPoints[i]
          if (mb.recordDate === xl.recordDate && mb.itemHour === xl.itemHour && mb.itemType === xl.itemType) {
            return true
          }
        }
        return false
      }
      // 脉搏和心率，如果只存在脉搏不存在心率，则把脉搏复制一份为心率，
      for (let i = 0; i < mbPoints.length; i++) {
        let mb = mbPoints[i]
        const h = has(mb)
        if (!h) {
          const newMb = JSON.parse(JSON.stringify(mb))
          mb.itemCode = 'xinlv'
          xlPoints.splice(i, 0, newMb)
        }
      }

      console.log('merged ', mbPoints, xlPoints)
      return xlPoints
    },
    /**
     * @method judgeIn 判断当前时间是否处于某个时间段
     * @param {String} curTime 当前时间
     * @param {String} minTime 最小时间
     * @param {String} maxTime 最大时间
     * @return {Boolean}
     */
    judgeIn (curTime, minTime, maxTime) {
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
      return false
    },
    /**
     * 体征项的值否不是空
     * @param data
     * @returns {boolean}
     */
    isEmpty (data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i] && data[i].signValue) {
          return false
        }
      }
      return true
    },
    /**
     * @method getDoundary 计算边界
     * @param point
     * @returns {{maxX: Number, minX: Number, maxY: Number, minY: Number}}
     */

    getDoundary (point) {
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
    },
    /**
     * @getBlueLineFuncs 获取蓝斜线方法
     * @param {Number/Float} b 斜度
     * @returns {Array}
     */
    getBlueLineFuncs (b) {
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
    },
    /**
     * @method segmentsIntr  求二元一次方程的交点
     * @param {JSON} line1 线条1方程
     * @param {JSON} line2 线条2方程
     * @return 交点
     * */
    segmentsIntr (line1, line2) {
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
    },
    /**
     * @method lineX 根据两点求二元一次方程
     * @param {JSON} point1 点1{x:"",y:""}
     * @param {JSON} point2 点2{x:"",y:""}
     * @return {JSON} a为常数，b为系数, 返回x为垂直于x轴的直线，返回Y为垂直于y轴的直线
     * */
    lineX (point1, point2) {
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
    },
    /**
     * @method numToChinese 将阿拉伯数字转换成中文数字
     * @param {Array} numArray 阿拉伯数字数组
     * @param {Array} chineseArray 中文数字数组
     * @return
     */
    numToChinese (numArray, chineseArray) {
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
    },
    /**
     * @method getPolygon 获取多边形
     * @param {Array} mbPoints 脉搏点
     * @param {Array} xlPoints 心率点
     * 脉搏短绌即在同一单位时间内，脉率少于心率
     */
    getPolygon (mbPoints, xlPoints) {
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
          let curMbX = this.getParseFloat(mbArray[j].x, 4)
          let curMbY = this.getParseFloat(mbArray[j].y, 4)
          if (mbArray[j + 1] !== undefined) {
            let nextMbX = this.getParseFloat(mbArray[j + 1].x, 4)
            let nextMbY = this.getParseFloat(mbArray[j + 1].y, 4)
            let line1 = this.lineX({ 'x': curMbX, 'y': curMbY }, { 'x': nextMbX, 'y': nextMbY })
            for (let h = 0; h < xlArray.length; h++) {
              let curXlX = this.getParseFloat(xlArray[h].x, 4)
              let curXlY = this.getParseFloat(xlArray[h].y, 4)
              if (xlArray[h + 1] !== undefined) {
                let nextXlX = this.getParseFloat(xlArray[h + 1].x, 4)
                let nextXlY = this.getParseFloat(xlArray[h + 1].y, 4)
                let line2 = this.lineX({ 'x': curXlX, 'y': curXlY }, { 'x': nextXlX, 'y': nextXlY })
                let interX = this.segmentsIntr(line1, line2).x
                let interY = this.segmentsIntr(line1, line2).y
                // 交点在心率线段上
                if (h === xlArray.length - 2 && j === xlArray.length - 2) {
                  // console.log(segmentsIntr(line1,line2))
                }
                let xlBool = interX >= curXlX && interX <= nextXlX && (interY >= curXlY && interY <= nextXlY || interY <= curXlY && interY >= nextXlY)
                // 交点在脉搏线段上
                let mbBool = interX >= curMbX && interX <= nextMbX && (interY >= curMbY && interY <= nextMbY || interY <= curMbY && interY >= nextMbY)
                if (xlBool && mbBool) {
                  intersectionArray[i].push(this.segmentsIntr(line1, line2))
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
            // newPoint.push(newMbpoint[0])
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
    },
    /**
     * @method getParseFloat 将浮点数保留多少位小数
     * @param {String/Float} number 数字
     * @param {String/Float} sub 保留多少位小数
     */
    getParseFloat (number, sub) {
      return parseFloat(parseFloat(number).toFixed(sub))
    }
  },
  /**
   * @method lineX 根据两点求二元一次方程
   * @param {JSON} point1 点1{x:"",y:""}
   * @param {JSON} point2 点2{x:"",y:""}
   * @return {JSON} a为常数，b为系数, 返回x为垂直于x轴的直线，返回Y为垂直于y轴的直线
   * */
  lineX (point1, point2) {
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
}
