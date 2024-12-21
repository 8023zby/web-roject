const style = `
@page { size: portrait; }

table {
  margin: 0 auto;
  width: 1050px;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 12px;
}

.tableTrStyle td {
  border: 1px solid black;
}
td{
    padding: 0 5px;
    text-align: center;
  }
tbody td, .thead td {
  height: 30px;
}

.text_left {
  text-align: left;
}

.hospital, .title, .dept {
  border: none;
  padding: 5px;
  font-weight: bold;
}

.patient .patient-main {
  display: flex;
  justify-content: space-around;
}

.line-form {
  height: 35px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.line-form2 {
  height: 35px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.line-form-allergyHistory {
  flex-basis: 50% !important;
  text-align: left;
}

.line-form-pastHistory {
  flex: 1 !important;
  text-align: left;
}

.dept {
  font-weight: inherit;
}
.dept div {
  display: flex;
}
.dept div div:first-child {
  width: 200px;
}

.hospital {
  font-size: 16px;
}

.title {
  font-size: 20px;
}

.statistic div {
  display: flex;
  justify-content: space-between;
}

.page td {
  border-left: none;
  border-right: none;
  border-bottom: none;
  text-align: left;
}

.page td div {
  display: flex;
  justify-content: space-between;
}`
export default style
