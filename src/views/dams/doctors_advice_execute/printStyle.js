const style = `
@page { size: auto;margin:0 auto; }
table {
  margin: 0 auto;
  width: 750px;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 12px;
}

td {
  text-align: center;
  border: 1px solid black;
}

tbody td, .thead {
  height: 35px;
}

tbody td div {
  text-align: left;
  padding: 0 5px;
}

.advice {
  padding-right: 30px;
  position: relative;
}
.advice img {
  position: absolute;
  top: 3px;
  right: 10px;
}

.hospital, .title, .patient {
  border: none;
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
}`
export default style
