//实现全选
export function checkAllFun() {
  var _this = this;
  this.checkArr = [];
  if (this.cheackAllChecked) {
    this.List.forEach(function (item, index) {
      if (index >= 0) {
        _this.checkArr.push(item.id);
      }
    });
  }
}

//实现反选
export function reverseChecked() {
  var changeArr = [];
  this.List.forEach(function (item, index) {
    if (index >= 0) {
      changeArr.push(item.id);
    }
  });
  this.removeByValue(changeArr, this.checkArr);
}

//反选过滤函数
export function removeByValue(changearr, checkarr) {
  var _this = this;
  for (var j = 0; j < checkarr.length; j++) {
    for (var i = 0; i < changearr.length; i++) {
      if (changearr[i] === checkarr[j]) {
        changearr.splice(i, 1);
        break;
      }
    }
  }
  this.checkArr = changearr;
  if (changearr.length <= _this.checkCompleteArr.length) {
    this.cheackAllChecked = false;
  }
  if (changearr.length === _this.checkCompleteArr.length) {
    this.cheackAllChecked = true;
  }
}

//选项的change事件
export function changevalue() {
  var _this = this;
  if (this.checkArr.length <= _this.checkCompleteArr.length) {
    this.cheackAllChecked = false;
  }
  if (this.checkArr.length === _this.checkCompleteArr.length) {
    this.cheackAllChecked = true;
  }
}
//全选或反选用到的完整数组值
// mounted() {
//   var _this = this;
//   this.List.forEach(function (item, index) {
//     if (index >= 0) {
//       _this.checkCompleteArr.push(item.id);
//     }
//   });
// }
