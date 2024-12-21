// 打印样式和展示样保持一致 scss -> css
//@page 设置margin:0：不让打印显示页眉页脚功能
export default `
@page { size: #portrait#;margin:5px auto 0;}
.temperature_sheet_print_container {
  margin: 0 auto;
  display: inline-block;
  font-size: 12px;
  color: #000;
}

.tableSvg {
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 12px;
}
.tableSvg tr td {
  border: 1px solid black;
  text-align: center;
  box-sizing: border-box;
  line-height: 1.5;
  padding: 0;
}
.tableSvg tr td.hx {
  height: 35px;
}
.tableSvg tr td.tt span {
  display: inline-block;
  padding: 2px;
}
.tableSvg tr td img {
  width: 14px;
}
.tableSvg tr .text-top {
  vertical-align: top;
}
.tableSvg tr .text-bottom {
  vertical-align: bottom;
}
.tableSvg tr.height {
  height: 15px;
}
.tableSvg tr.height td {
  line-height: 1;
}
.tableSvg tr.height td.borderL {
  border-left: 2px solid black;
}
.tableSvg tr.height td.borderB {
  border-bottom: 2px solid black;
}
.tableSvg tr.height td.borderR {
  border-right: 2px solid red;
}
.tableSvg tr.height td.borderRB {
  border-right: 2px solid black;
}
.tableSvg tr.height td.borderT {
  border-top: 2px solid black;
}
.tableSvg tr.hour td {
  line-height: 1.5;
}

.svg-tips {
  width: 15px;
  position: absolute;
  right: 0;
  top: 0;
  transform: translateY(50%);
}
.svg-tips table {
  width: 100%;
  font-size: inherit;
  text-align: center;
}
.svg-tips td {
  height: 100px;
}

.text_scale {
  position: relative;
}
.text_scale > span {
  display: inline-block;
  position: absolute;
  top: 0;
  left: 50%;
  transform: scale(0.7) translateX(-70%);
}`
