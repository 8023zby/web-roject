const style = `
@page { size: portrait; }
.label {
  width: 500px;
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

.top, .bottom {
  height: 45px;
  line-height: 45px;
  display: flex;
  flex-direction: row;
  align-content: space-between;
  border: 1px solid #333333;
}

.bedNo,.patientName,.id,.frequencyCode,.frequencyExecuteTime,.printDate{
    flex: 1;
    flex-basis: 0%;
    overflow: hidden;
    padding-left: 10px;
    padding-right: 10px;
  }
  .id{
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; // 指定行数
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    line-height: 22px;
  }

.middle {
  height: 260px;
  border-left: 1px solid #333333;
  border-right: 1px solid #333333;
  padding: 10px;
}
.middle .middle_top {
  height: 130px;
}
.middle .middle_top .item {
  height: 40px;
  line-height: 40px;
}
.middle .middle_bottom {
  height: 130px;
}
.middle .middle_bottom .left {
  width: 350px;
  float: left;
}
.middle .middle_bottom .left div {
  height: 40px;
  line-height: 40px;
}
.middle .middle_bottom .left div .item:nth-child(1) {
  display: inline-block;
  padding-right: 15px;
}
.middle .middle_bottom .left div .item:nth-child(2) {
  display: inline-block;
  padding-right: 15px;
}
.middle .middle_bottom .right {
  float: left;
}
.middle .middle_bottom .right .qrImg {
  width: 100px;
  height: 100px;
}`
export default style
