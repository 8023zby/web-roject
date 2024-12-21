<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo" />
      <div class="typt-tit-content">{{ detail.type==="add"?"新建素材":'修改素材' }}</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width:40rem">
        <el-form ref="form" :model="form" label-width="140px">
          <el-form-item label="IP地址">
            <el-input
              v-model.trim="form.ip"
              style="width:20rem"
              disabled="disabled"
              class="inputwidth"
            />
          </el-form-item>

          <el-form-item label="备注">
            <el-input
              type="textarea"
              v-model="form.remark"
              placeholder="请输入内容"
              maxlength="20"
              :rows="2"
              style="width:20rem"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="typt-add-footer">
        <el-button type="primary" @click="submitHandler('form')">提交</el-button>
        <el-button @click="backHandler">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BaseEditForm from '../../common/BaseEditForm'
import { deepMergeLeft } from '@/assets/wnms/utils'
import * as deviceApi from '../api/device'
import mixins from './mixins'

export default {
  components: {},
  mixins: [BaseEditForm, mixins],
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => { }
    }
  },
  data () {
    const form = this.initForm()
    return {
      form: form,
      cudeptid: ''
    }
  },
  mounted () {
    deepMergeLeft(this.form, this.detail.row)
    // 获取deptid
    this.cudeptid = this.detail.row.deptId
    this.$nextTick(() => {
      this.$refs['form'].clearValidate()
    })
  },
  methods: {
    customSubmitHandler () {
      deviceApi.Edit(this.form).then(data => {
        this.submitSuccessHandler(data)
      })
    },
    submitSuccessHandler (data) {
      if (data.status === 200) {
        this.optionSuccessHandler()
        if (this.cudeptid == '') {
          this.optionSuccessHandler('error', '无法获取科室！！！！')
        }
        this.backHandler()
      }
    },
    backHandler () {
      let data = { deptId: this.cudeptid, type: 'list' }
      this.$emit('option-changed', 'list', data)
    },
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.btn-area {
  padding: 20px 0px 10px 0px;
}
.query-area > div {
  margin-right: 50px;
}

.inputwidth {
  width: 30rem;
}
.textarea {
  width: 30rem;
}
</style>
