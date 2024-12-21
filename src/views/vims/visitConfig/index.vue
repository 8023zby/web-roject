<!--
 * @Author: 刘慧
 * @Owner: 刘慧
 * @Date: 2022-05-24 09:53:17
 * @LastEditTime: 2022-09-07 17:11:30
 * @LastEditors: 刘慧
 * @Description:
 * @FilePath: \yarward-vims-frontEnd\src\views\vims\visitConfig\index.vue
-->
<template>
  <div class="typt-list-main">
    <div class="typt-add-container" style="max-height: 700px">
      <div class="typt-add-form config-form">
        <el-form :model="formData" :rules="rules" ref="form" label-width="130px" style="width: 470px">
          <el-form-item label="远程探视：" prop="enableVisit">
            <el-switch v-uni="uniKey+'yuanchengtanshi'" v-model="formData.enableVisit" active-color="#1D86EF" inactive-color="#EDEDED" :active-value="true" :inactive-value="false" />
          </el-form-item>
          <div v-show="formData.enableVisit">
            <!-- <el-form-item label="预约功能：" prop="isOrder">
              <el-switch v-uni="uniKey+'yuyuegongneng'" v-model="formData.isOrder" active-color="#1D86EF" inactive-color="#EDEDED" :active-value="1" :inactive-value="0" />
            </el-form-item> -->
            <el-form-item label="亲友认证：" prop="isHostAudit">
              <el-switch v-uni="uniKey+'qinyourenzheng'" v-model="formData.isHostAudit" active-color="#1D86EF" inactive-color="#EDEDED" :active-value="true" :inactive-value="false" />
            </el-form-item>
            <el-form-item label="主机转接：" prop="isHostTransfer">
              <el-switch v-uni="uniKey+'zhujizhuanjie'" v-model="formData.isHostTransfer" active-color="#1D86EF" inactive-color="#EDEDED" :active-value="true" :inactive-value="false" />
            </el-form-item>
            <el-form-item label="亲属上限：" prop="visitMaxCount">
              <el-input v-uni="uniKey+'qinshushangxian'" v-model.number="formData.visitMaxCount" style="width: 250px"></el-input>
              &nbsp; 人
            </el-form-item>
            <el-form-item label="单次探视时长：" prop="visitDuration" class='duration-item'>
              <span style="color: #666666;margin-right: 10px">超过</span>
              <el-select v-model="formData.visitDuration" v-uni="uniKey+'dancitanshishichang'">
                <el-option label="10" :value="10"></el-option>
                <el-option label="15" :value="15"></el-option>
                <el-option label="20" :value="20"></el-option>
                <el-option label="30" :value="30"></el-option>
              </el-select>
              <span style="color: #666666;margin-left: 10px">分钟后自动挂断</span>
            </el-form-item>
            <el-form-item label="探视时间："  class="vistTime">
              <div v-for="(item,index) in visitDateList" :key="index">
                <el-col :span="24" style="margin-bottom: 20px">
                  <el-time-picker format="HH:mm" value-format="HH:mm:ss" style="width: 250px" align="center" is-range v-model="visitDateList[index]" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围">
                  </el-time-picker>
                  <i class="el-icon-circle-plus-outline plus" @click="addVisitDate(index)"></i>
                  <i v-if="index !==0" class="el-icon-remove-outline remove" @click="removeVisitDate(index)"></i>
                </el-col>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer btn-footer">
      <el-button type="primary" @click="submitForm" :loading="btnLoding" v-uni="uniKey+'save'">保存</el-button>
    </div>
  </div>
</template>

<script>
import api from '../../../api/vims/api';
let visitMaxCountValidate = (rule, value, callback) => {
  if (/^\d{1,2}$/.test(value)) {
    callback();
  } else {
    callback(new Error('请输入0-99的数字'));
  }
};
let deptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {};
export default {
  data () {
    return {
      uniKey: 'tanshipeizhi_',
      btnLoding: false,
      visitDateList: [['09:00:00', '18:00:00']], // 后端接口希望接收带s的，省去后端拼接
      value: true,
      formData: {
        enableVisit: false, // 远程探视
        isHostAudit: false, // 亲友认证
        isHostTransfer: false, // 主机转接
        visitMaxCount: 5, // 亲属上限
        visitDuration: 15 // 探视时长
      },
      rules: {
        visitMaxCount: [{ validator: visitMaxCountValidate, trigger: ['blur'] }]
      }
    };
  },
  mounted () {
    this.getVisitConfig();
  },
  methods: {
    submitForm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saveVisitConfig();// 保存
        }
      });
    },
    getVisitConfig () {
      api.getConfig({
        orgId: deptInfo.orgId,
        deptId: deptInfo.deptId
      }).then(data => {
        this.formData = data;
        this.visitDateList = [];
        let mVisitTimes = JSON.parse(data.visitTime);
        if (mVisitTimes.length > 0) {
          mVisitTimes.forEach((item) => {
            const { startTime, endTime } = item;
            this.visitDateList.push([startTime, endTime]);
          });
        }
      }).catch(err => {
        console.error('getConfig error:', err);
      });
    },
    saveVisitConfig () {
      let mDateList = [];
      let errorMessage = '';

      for (let i = 0; i < this.visitDateList.length; i++) {
        mDateList.push({
          'startTime': this.visitDateList[i][0],
          'endTime': this.visitDateList[i][1]
        });
      }
      for (let i = 0; i < mDateList.length; i++) {
        if (mDateList[i - 1]) {
          if (mDateList[i].startTime < mDateList[i - 1].endTime) {
            errorMessage = '探视时间段开始时间不能小于上一时间段的结束时间！';
            break;
          }
          if ((mDateList[i].startTime === mDateList[i - 1].startTime) && (mDateList[i].endTime === mDateList[i - 1].endTime)) {
            errorMessage = '不能有重复的探视时间段';
            break;
          }
        }
      }

      if (errorMessage) {
        this.$message({ type: 'error', message: errorMessage });
        return false;
      }
      const { enableVisit, isHostAudit, visitDuration, visitMaxCount, isHostTransfer } = this.formData;
      let params = {
        enableVisit,
        isHostAudit,
        isHostTransfer,
        visitDuration,
        visitMaxCount,
        list: mDateList,
        deptId: deptInfo.deptId,
        orgId: deptInfo.orgId
      };
      this.btnLoding = true;
      api.updateConfig(params).then(() => {
        this.getVisitConfig();
        this.$message({ type: 'success', message: '更新成功' });
      }).catch((err) => {
        console.error('updateConfig api error: ', err);
      }).finally(() => {
        this.btnLoding = false;
      });
    },

    addVisitDate (index) {
      if (this.visitDateList.length >= 5) {
        return this.$message({ type: 'error', message: '探视时间段不能超过五个' });
      }
      if (!this.visitDateList[index]) {
        return this.$message({ type: 'error', message: '探视时间不能为空' });
      }
      if (index !== 0) {
        if (this.visitDateList[index][0] < this.visitDateList[index - 1][1]) {
          this.$message({ type: 'error', message: '探视时间段开始时间不能小于上一时间段的结束时间！' });
          return;
        }
      }
      this.visitDateList.push([
        this.visitDateList[this.visitDateList.length - 1][1],
        this.visitDateList[this.visitDateList.length - 1][1]
      ]);
    },
    removeVisitDate (index) {
      this.visitDateList.splice(index, 1);
    }
  }
};
</script>
<style lang="scss" scoped>
  .config-form{
    display: flex;
    justify-content: center;
  }
  .plus{
    font-size: 26px;
    color:#1e87f0;
    margin-left: 12px;
    vertical-align: middle;
    cursor: pointer;
  }
  .remove{
    font-size: 26px;
    color:#f56c6c;
    margin-left: 14px;
    vertical-align: middle;
    cursor: pointer;
  }
  .btn-footer{
    border: none;
  }
  .duration-item{
    /deep/ .el-input{
      width: 130px;
    }
  }
  .vistTime{
    /deep/ .el-range-separator{
      box-sizing: initial !important;
    }
  }
</style>
