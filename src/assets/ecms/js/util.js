
// 时间格式
export function valueTimeArr(valueTime) {
   let arr= [];
  if(valueTime == null){
    arr = ['',''];
  } else if( valueTime.length === 0){
    arr = ['',''];
  } else {
    arr = [valueTime[0],valueTime[1]];
  }
  return arr
}
