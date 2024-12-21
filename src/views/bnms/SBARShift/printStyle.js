const style = `table {
  margin: 0 auto;
  width: 750px;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 12px;
}

td {
  border: 1px solid black;
}
td.td-left {
  text-align: center;
}
td.td-right {
  padding: 15px;
}
td .line-form {
  height: 35px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.label {
  min-width: 60px;
  display: inline-block;
}

.checkbox {
  padding: 0 10px;
}

input[type=text] {
  margin: 0 10px;
  border: 1px solid #666;
  height: 20px;
  padding: 3px
}

.hospital, .title, .patient {
  border: none;
  text-align: center;
}

.hospital {
  font-size: 16px;
}

.title {
  font-size: 20px;
}

.patient {
  padding: 10px;
}
.patient > div {
  display: flex;
  justify-content: space-around;
}
.patient input {
  width: 86px;
}`
export default style
