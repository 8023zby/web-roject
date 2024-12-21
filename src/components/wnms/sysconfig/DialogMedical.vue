<!--
  文件描述：医护信息选择弹窗
  创建时间：2021/3/22 11:35
  创建人：PCL
-->
<template>
  <el-dialog
    title="医护信息"
    :visible.sync="Dialogvisible"
    width="60%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div style="max-height: 600px;overflow-y: auto;">
      <el-tree
        id="showDialogMedicalTreeForm"
        ref="showDialogMedical-treeForm"
        props="{label:userFullName}"
        :data="content_data"
        :default-expand-all="true"
        highlight-current
        accordion
        show-checkbox
        :check-strictly="true"
        check-on-click-node
        node-key="empId"
        @check="handleClick"
        :default-expanded-keys="ExpandedKeys"
        :default-checked-keys="CheckedKeys"
      ></el-tree>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取消</el-button>
        <el-button type="primary" @click="chooseContent">保存</el-button>
      </span>
  </el-dialog>
</template>

<script>
    // 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
    // 例如：import 《组件名称》 from '《组件路径》';
    // 例如：import uploadFile from '@/components/uploadFile/uploadFile'
    import * as API from '@/api/wnms/msgManage/systemConfig'

    export default {
        name: 'DialogMedical',
        // import引入的组件需要注入到对象中才能使用
        components: {},
        props: {},
        data() {
            // 这里存放数据
            return {
              content_data: [],
              ExpandedKeys: [], //树，默认展开节点
              CheckedKeys: [], //树，默认选中节点
              Dialogvisible: false,
              SingleChoice: false //是否单选
            }
        },
        // 监听属性 类似于data概念
        computed: {},
        // 方法集合
        methods: {
          init(Obj) {
            console.log('加载医护选择弹窗')
            if (Obj) {
              this.SingleChoice = Obj.SingleChoice
            }
            // 获取医护信息
            API.getMedicalCareList(Obj.deptId).then(response => {
              if (response.data) {
                this.content_data = []
                for (let v of response.data) {
                  if (v.empName) this.content_data.push(Object.assign({ label: v.empName }, v))
                }

                this.Dialogvisible = true
                this.$nextTick(() => {
                  this.$refs['showDialogMedical-treeForm'].setCheckedNodes([])
                  if (Obj.check) {
                    this.CheckedKeys = Obj.check
                  }
                })
              }
            }).finally(() => {
            })
          },
          // 取消
          cancel() {
            this.Dialogvisible = false
          },
          chooseContent() {
            let check = this.$refs['showDialogMedical-treeForm'].getCheckedNodes()
            if (check.length === 0) {
              this.$message.error("未选择人员！")
              return
            }
            let arr = []
            for (let v of check.values()) {
              arr.push({
                empId: v.empId,
                empName: v.empName
              })
            }
            this.$emit('chooseMedical', arr)
            this.Dialogvisible = false
          },
          // 点击树选择
          handleClick(data, checked, node) {
            // 单选，需要处理选中项
            if (this.SingleChoice) {
              if (checked) {
                this.$refs['showDialogMedical-treeForm'].setCheckedNodes([data])
              }
            } else {

            }
          }
        },
        // 监控data中的数据变化
        watch: {},
        // 生命周期 - 创建完成（可以访问当前this实例）
        created() {

        },
        // 生命周期 - 挂载完成（可以访问DOM元素）
        mounted() {

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

<style scoped lang="scss">
    //@import url(); 引入公共css类
</style>
