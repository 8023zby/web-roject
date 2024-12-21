// 时间方法
export const DateFormate = {
  // 根据日期获取今年第几周
  getWeekOfYear (time) {
    let today;
    if (!time) {
      today = new Date();
    } else {
      today = new Date(time);
    }
    let nowDate = new Date(today);
    let firstDay = new Date(today);
    firstDay.setMonth(0);//设置1月
    firstDay.setDate(1);//设置1号
    let diffDays = Math.ceil((nowDate - firstDay)/(24*60*60*1000));
    let week = Math.ceil(diffDays/7);
    return week === 0 ? 1 : week;
  },
  // 格式化时间
  getNowFormatDate (date) {
    if (!date) {
      date = new Date();
    }
    let seperator1 = '-';
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = '0' + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate;
    }
    let currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  // 计算当前时间的周一
  getMonDate: function (time) {
    let d = new Date();
    if (!time) {
      d = new Date();
    } else {
      d = new Date(time);
    }

    let day = d.getDay();
    let date = d.getDate();
    if (day === 1) {
      return d;
    }
    if (day === 0) {
      d.setDate(date - 6);
    } else {
      d.setDate(date - day + 1);
    }
    return d;
  },
  // 获取时间
  getSunDay (index, time) {
    if (time === '') {
      time = DateFormate.getNowFormatDate();
    }
    let d = DateFormate.getMonDate(time);
    let sunday = '';
    for (let i = 0; i < 7; i++) {
      if (i !== index) {
        d.setDate(d.getDate() + 1);
        continue;
      }
      let Y = d.getFullYear();
      let M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1);
      let D = (d.getDate() > 9 ? d.getDate() : '0' + d.getDate());
      sunday = Y + '-' + M + '-' + D;
      d.setDate(d.getDate() + 1);
    }
    return sunday;
  },
  // 获取周几
  getDayName: function (day) {
    day = parseInt(day);
    if (isNaN(day) || day < 0 || day > 6) {
      return false;
    }
    let weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return weekday[day];
  },
  // 返回周一到周日
  getCurWeek (time) {
    let d = DateFormate.getMonDate(time);
    let arr = [];
    for (let i = 0; i < 7; i++) {
      let Y = d.getFullYear();
      let M = (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1);
      let D = (d.getDate() > 9 ? d.getDate() : '0' + d.getDate());
      arr.push({
        id: Y + '-' + M + '-' + D,
        name: Y + '年' + M + '月' + D + '日 <br/>（' + DateFormate.getDayName(d.getDay()) + '）',
        date: d.getDate() + '/' + (d.getMonth() + 1),
        week: DateFormate.getDayName(d.getDay())
      });
      d.setDate(d.getDate() + 1);
    }
    return arr;
  },
  // 月份获取=================
  getMonDays (date) {
    let allDay = 0;
    let arr = date.split('-');
    let _year = arr[0];
    let num = arr[1];
    num = parseInt(num);
    switch (num) {
      case 1: allDay = 31;
        break;
      case 2:
        if (DateFormate.runNian(_year)) { allDay = 29; }
        else { allDay = 28; }
        break;
      case 3: allDay = 31;
        break;
      case 4: allDay = 30;
        break;
      case 5: allDay = 31;
        break;
      case 6: allDay = 30;
        break;
      case 7: allDay = 31;
        break;
      case 8: allDay = 31;
        break;
      case 9: allDay = 30;
        break;
      case 10: allDay = 31;
        break;
      case 11: allDay = 30;
        break;
      case 12: allDay = 31;
        break;
    }
    return allDay;
  },
  // 获取当前月开始结束时间
  getEtime (date) {
    let allDay = 0;
    let arr = date.split('-');
    let _year = arr[0];
    let num = arr[1];
    num = parseInt(num);
    switch (num) {
      case 1: allDay = 31;
        break;
      case 2:
        if (DateFormate.runNian(_year)) { allDay = 29; }
        else { allDay = 28; }
        break;
      case 3: allDay = 31;
        break;
      case 4: allDay = 30;
        break;
      case 5: allDay = 31;
        break;
      case 6: allDay = 30;
        break;
      case 7: allDay = 31;
        break;
      case 8: allDay = 31;
        break;
      case 9: allDay = 30;
        break;
      case 10: allDay = 31;
        break;
      case 11: allDay = 30;
        break;
      case 12: allDay = 31;
        break;
    }
    return allDay;
  },
  // 判断是否是闰年
  runNian (_year) {
    if (_year % 400 === 0 || (_year % 4 === 0 && _year % 100 !== 0)) {
      return true;
    } else { return false; }
  },
  // 判断某年某月的1号是星期几
  getFirstDay (_year, _month) {
    let allDay = 0;
    let i = 1;
    let y = _year - 1;
    allDay = y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) + 1;
    for (; i < _month; i++) {
      switch (i) {
        case 1: allDay += 31;
          break;
        case 2:
          if (DateFormate.runNian(_year)) { allDay += 29; } else { allDay += 28; }
          break;
        case 3: allDay += 31; break;
        case 4: allDay += 30; break;
        case 5: allDay += 31; break;
        case 6: allDay += 30; break;
        case 7: allDay += 31; break;
        case 8: allDay += 31; break;
        case 9: allDay += 30; break;
        case 10: allDay += 31; break;
        case 11: allDay += 30; break;
        case 12: allDay += 31; break;
      }
    }
    return allDay % 7;
  }
};
// canvas 划线
export const line = (id, width, color) => {
  let table = document.getElementById(id);
  let xpos = table.clientWidth;
  let ypos = table.clientHeight;
  let canvas = document.getElementById('line');
  if (canvas.getContext) {
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, xpos, ypos); // 清空画布，多个表格时使用
    ctx.fill();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.beginPath();

    ctx.moveTo(0, 0);
    ctx.lineTo(xpos, ypos);

    ctx.stroke();
    ctx.closePath();
    document.getElementById(id).style.backgroundImage = 'url("' + ctx.canvas.toDataURL() + '")';
  }
};
// 为空就过滤
export const filterData = (data) => {
  let temp = {};
  for (let p in data) {
    if (data[p] === '') {
      continue;
    }
    temp[p] = data[p];
  }
  return temp;
};
