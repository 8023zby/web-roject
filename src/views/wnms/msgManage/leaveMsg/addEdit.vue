<!--
  文件描述：留言类型添加、编辑
  创建时间：2021/10/11 10:18
  创建人：pcl
-->
<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">  {{ detail.type==="add"?"添加留言类型":'修改留言类型' }}</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width: 600px">
        <el-form ref="form"
                 :model="form"
                 :rules="rulesForm"
                 label-width="130px"
        >
          <el-form-item label="留言类型"
                        prop="name">
            <el-input v-model="form.name"
                      placeholder="请输入"
                      maxlength="10"
                      class="elinput-400"></el-input>
          </el-form-item>
          <el-form-item label="留言描述">
            <el-input type="textarea"
                      v-model="form.remark"
                      placeholder="请输入"
                      resize="none"
                      maxlength="200"
                      class="elinput-400"
                      :rows="8"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="backHandler">取消</el-button>
      <el-button type="primary" @click="submit('form')" :loading="btnLoading">保存</el-button>
    </div>
  </div>
</template>

<script>
    // 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
    // 例如：import 《组件名称》 from '《组件路径》';
    // 例如：import uploadFile from '@/components/uploadFile/uploadFile'

    import { deepMergeLeft } from '@/assets/wnms/utils'
    import BaseQueryPageForm from '../../common/BaseQueryPageForm'
    import BaseEditForm from '../../common/BaseEditForm'
    import * as API from '@/api/wnms/msgManage/leaveMsg'
    import mixins from './mixin'

    export default {
        name: 'addEdit',
        // import引入的组件需要注入到对象中才能使用
        components: { },
        mixins: [BaseQueryPageForm, mixins, BaseEditForm],
        props: {
            detail: {
                required: false,
                type: Object,
                default: () => { }
            }
        },
        data() {
            const form = this.initForm()
            const rulesForm = this.initRules()
            // 这里存放数据
            return {
                btnLoading: false,
                form: form,
                rulesForm: rulesForm
            }
        },
        // 监听属性 类似于data概念
        computed: {},
        // 方法集合
        methods: {
            submit (formName) {
                this.btnLoading = true
                this.submitHandler(formName)
            },
            customSubmitHandler () {
                if (this.detail.type === 'add') {
                    API.Add(this.form).then(data => {
                        this.btnLoading = false
                        this.IsSuccess(data, () => {
                            this.backHandler()
                        })
                    }).catch(() => {
                        this.btnLoading = false
                    })
                } else {
                    API.Edit(this.form).then(data => {
                        this.btnLoading = false
                        this.IsSuccess(data, () => {
                            this.backHandler()
                        })
                    }).catch(() => {
                        this.btnLoading = false
                    })
                }
            },
            submitSuccessHandler (data) {
                if (data.status === 200) {
                    this.optionSuccessHandler()
                    this.backHandler()
                }
            },
            backHandler () {
                this.$emit('option-changed', 'list', this.detail)
            }
        },
        // 监控data中的数据变化
        watch: {},
        // 生命周期 - 创建完成（可以访问当前this实例）
        created() {

        },
        // 生命周期 - 挂载完成（可以访问DOM元素）
        mounted() {
          // 点击的时候是add
           // let selectData = selectDeptInfoData()
            if (this.detail.type === 'add') {
                deepMergeLeft(this.form, this.initForm())
            } else {
                this.form.id = this.detail.row.id
                deepMergeLeft(this.form, this.detail.row)
            }
            this.$nextTick(() => {
                this.$refs['form'].clearValidate()
            })
        },
        beforeCreate() {
        }, // 生命周期 - 创建之前
        beforeMount() {
        }, // 生命周期 - 挂载之前
        beforeUpdate() {
        }, // 生命周期 - 更新之前
        updated() {
        }, // 生命周期 - 更新之后
        beforeDestroy() {
        }, // 生命周期 - 销毁之前
        destroyed() {
        }, // 生命周期 - 销毁完成
        activated() {
        } // 如果页面有keep-alive缓存功能，这个函数会触发
    }
</script>

<style lang="scss">
</style>
<style scoped lang="scss">
    //@import url(); 引入公共css类
</style>
