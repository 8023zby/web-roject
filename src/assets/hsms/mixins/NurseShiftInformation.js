/**
 * 通用的增删改查用到的方法和变量
 */
import { AxiosApi } from '../../../api/hsms';
import { MsgShow } from '../js/Message';
import BaseManage from './BaseManage';
import moment from 'moment';
export default {
  extends: BaseManage,
  data () {
    return {
      selectShow: false,
      dutyData: [], // 所有的班次数据
      selectedData: [],
      userData: [],
      exportDesc: false,
      delKey: {},
      tableVis: false,
      flag: true
    };
  },
  methods: {
    // 请求列表
    getData (formSearchData) {
      if (!formSearchData) {
        formSearchData = this.formSearchData;
      }
      this.loading = true;
      AxiosApi(this.url + '/' + formSearchData.businessType, {}, 'GET', formSearchData).then(res => {
        if (res.data.flag === 'false') {
          this.flag = false;
        } else {
          this.flag = true;
        }
        this.loading = false;
        let { data, desc } = res;
        if (desc === 'true') {
          this.exportDesc = true;
        } else {
          this.exportDesc = false;
        }
        // 排班流水的多返回了一层，做下特殊处理
        if (this.url === '/hsms/web-hs/schedule') {
          data = data.data;
        }
        // 排班规则的时候 服务器计算的时间有问题 需要重新计算一下时间 把对应的周几统一起来
        if (data && this.url !== '/hsms/web-hs/schedule') {
          data = this.dealDate(data);
        }
        this.dealData(data || []);
      });
    },
    // 复制排班
    copyData () {
      AxiosApi('/hsms/web-hs/schedule/' + this.formSearchData.businessType + '/copy', {
        beginDate: this.formSearchData.beginDate,
        endDate: this.formSearchData.endDate
      }).then(res => {
        this.loading = false;
        let { data, desc, status } = res;
        if (status !== 200) {
          MsgShow('warning', desc);
          return;
        }
        this.dealData(data || []);
      });
    },
    // 编辑排班规则
    setDuty () {
      this.selectShow = true;
    },
    // 数据处理
    dealData (data) {
      let dutyObj = {};
      let curWeek = this.weekData;
      let lastWeek = this.lastWeekData;
      let userData = this.userData;
      let tbData = [];
      let itemData = {};
      this.selectedData = [];
      // 上周排班，在[本周排班]编辑时，[参考上周排班]时使用
      if (this.lastWeekTableData && this.lastWeekTableData) {
        this.lastWeekTableData.map(item => {
          item.scheduleList.map(v => {
            let bedList = [];
            v.shiftList.map(shiftItem => {
              if (shiftItem.bedLevelList) {
                bedList = bedList.concat(shiftItem.bedLevelList);
              }
            });
            bedList = Array.from(new Set(bedList));
            dutyObj[item.accountId + v.scheduleDate] = {
              shiftList: v.shiftList || [],
              bedList: bedList || []
            };
          });
        });
      }
      data.forEach((item, index) => {
        // 数据处理 日期下边的班次集合
        item.scheduleList.map(v => {
          let bedList = [];
          // 班次集合
          v.shiftList.map(shiftItem => {
            if (shiftItem.bedLevelList) {
              bedList = bedList.concat(shiftItem.bedLevelList);
            }
          });
          bedList = Array.from(new Set(bedList));
          dutyObj[item.accountId + v.scheduleDate] = {
            shiftList: v.shiftList || [],
            bedList: bedList || []
          };
        });
      });
      // 处理用户接口与班次接口对应关系
      userData.forEach((item, index) => {
        itemData = {};
        // 如果用户已经删除则跳过
        if (this.delKey[item.empId]) {
          return true;
        }
        itemData['empKey'] = item.empKey;
        itemData['accountName'] = item.empName;
        itemData['accountId'] = item.empId;
        // 不允许修改的班次日期
        let notAllowEdit = [];
        // 处理员工的年假，层级，存假
        if (this.otherColumn) {
          this.otherColumn.level.map(v => {
            if (v.accountId === item.empId) itemData['level'] = v.hierarchyName;
          });
          this.otherColumn.annual.map(v => {
            if (v.accountId === item.empId) {
              itemData['annualLeave'] = v.workOvertime || 0;
              itemData['annualCount'] = v.holidayBalance || 0;
            }
          });
          this.otherColumn.holiday.map(v => {
            if (v.accountId === item.empId) {
              itemData['arrearsHour'] = v.holidayBalance || 0;
            }
          });
        }
        data.map(v => {
          if (v.accountId === item.empId) {
            // 工作时长
            itemData['weekWorkHour'] = v.weekWorkHour || 0;
            v.scheduleList.map(schedule => {
              // 前端是否允许编辑
              if (schedule.allowEdit === false) {
                notAllowEdit.push(schedule.scheduleDate);
              }
            });
          }
        });
        // 不能编辑的班次日期
        itemData['notAllowEdit'] = notAllowEdit;

        // 上周数据
        if (lastWeek) {
          lastWeek.map((lastWeekItem, i) => {
            itemData[lastWeekItem.id] = dutyObj[item.empId + lastWeekItem.id] ? dutyObj[item.empId + lastWeekItem.id].shiftList : [];
            itemData[lastWeekItem.id + '__bedList'] = dutyObj[item.empId + lastWeekItem.id] ? dutyObj[item.empId + lastWeekItem.id].bedList : [];
          });
        }
        // 本周数据
        for (let i = 0; i < curWeek.length; i++) {
          // curWeek[i] 的格式 {
          //   date: "27/9",
          //   id: "2021-09-27",
          //   name: "星期一",
          //   week: "星期一"
          // }
          itemData[curWeek[i].id] = dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].shiftList : [];
          itemData[curWeek[i].id + '__bedList'] = dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].bedList : [];
          let shiftList = dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].shiftList : '';
          // 循环处理班次数据， 处理成shift-manage组件、存储结构需要结构
          if (shiftList && shiftList.length) {
            shiftList.map((shiftItem, shiftIndex) => {
              // 排班规则
              if (this.typeStr === 'rule') {
                this.selectedData.push({
                  // deptId: dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].deptId : '',
                  accountId: item.empId,
                  dutyWeek: curWeek[i].id,
                  dutyDate: curWeek[i].id,
                  empKey: item.empKey,
                  accountName: item.empName,
                  shiftName: shiftItem.shiftDetail.shiftName,
                  shiftId: shiftItem.shiftDetail.shiftId,
                  sort: i + 1,
                  shiftSort: shiftItem.shiftSort || shiftIndex
                });
              } else { // 本周排班
                this.selectedData.push({
                  // deptId: dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].deptId : '',
                  accountId: item.empId,
                  dutyDate: curWeek[i].id,
                  empKey: item.empKey,
                  accountName: item.empName,
                  shiftName: shiftItem.shiftDetail.shiftName,
                  shiftId: shiftItem.shiftDetail.shiftId,
                  sort: i + 1,
                  shiftSort: shiftItem.shiftSort || shiftIndex
                });
              }
            });
          } else {
            if (this.typeStr === 'rule') {
              this.selectedData.push({
                // deptId: dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].deptId : '',
                accountId: item.empId,
                dutyWeek: curWeek[i].id,
                dutyDate: curWeek[i].id,
                empKey: item.empKey,
                accountName: item.empName,
                shiftName: '',
                shiftId: '',
                sort: i + 1,
                shiftSort: 1
              });
            } else {
              this.selectedData.push({
                // deptId: dutyObj[item.empId + curWeek[i].id] ? dutyObj[item.empId + curWeek[i].id].deptId : '',
                accountId: item.empId,
                dutyDate: curWeek[i].id,
                empKey: item.empKey,
                accountName: item.empName,
                shiftName: '',
                shiftId: '',
                sort: i + 1,
                shiftSort: 1
              });
            }
          }
        }
        tbData.push(itemData);
      });
      // el-table列表使用的数
      console.log(tbData, this.tableData, 'zzzzzzzzzc');
      this.tableData = tbData;
      this.tableVis = true;
    },
    // 处理日期
    dealDate (data) {
      // 当前时间
      var nowDay = moment().format('YYYY-MM-DD');
      // 当前周
      let weekNowday = moment(nowDay).format('E');
      const weekMap = new Map();
      // 获取本周周一至周六的日期
      for (let i = 1; i <= 6; i++) {
        let lastWeekday = moment(nowDay).subtract(weekNowday - i, 'days').format('YYYY-MM-DD');
        weekMap.set(i, lastWeekday);
      }
      // 获取本周周天的日期
      let sunday = moment(nowDay).subtract(weekNowday - 7, 'days').format('YYYY-MM-DD');// 周日日期
      if (weekNowday === 7) {
        sunday = moment(nowDay).add(weekNowday - 7, 'days').format('YYYY-MM-DD');// 周日日期
      }
      weekMap.set(7, sunday);
      for (let item_data of data) {
        if (item_data.scheduleList.length > 0) {
          for (let item of item_data.scheduleList) {
            if (item.scheduleDate) {
              // 根据日期获取对应的是周几
              let weekOfday = moment(item.scheduleDate).format('E');
              // 把对应的周几的日期换成本周对应的周几的日期
              item.scheduleDate = weekMap.get(Number(weekOfday));
            }
          }
        }
      }
      return data;
    }
  }
};
