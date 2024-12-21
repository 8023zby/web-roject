<!--
  文件描述： 自动提醒中选择问卷的组件
  创建时间：2021/5/8 10:49
  创建人：PCL
-->
<template>
  <el-dialog
    title="调查问卷"
    :visible.sync="Dialogvisible"
    width="60%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div style="max-height: 600px;overflow-y: auto;">
      <el-tree
        id="showDialogTreeFormQuestionnaire"
        ref="showDialog-treeForm"
        :data="content_data"
        :default-expand-all="true"
        highlight-current
        accordion
        show-checkbox
        :check-strictly="true"
        check-on-click-node
        node-key="paperId"
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
    import * as API from '@/api/wnms//msgManage/msgWarn'
    export default {
        name: 'dialog-choiceQuestionnaire',
        // import引入的组件需要注入到对象中才能使用
        components: {},
        data() {
            // 这里存放数据
            return {
              treeCheckedObj: {
                checked: "",
                whileName: "",
                label: ""
              },
              treeCheckedArray: [], // 多选时，选中的值
              content_data: [],
              ExpandedKeys: [], //树，默认展开节点
              CheckedKeys: [], //树，默认选中节点
              Dialogvisible: false,
              SingleChoice: true //是否单选
            }
        },
        // 监听属性 类似于data概念
        computed: {},
        // 方法集合
        methods: {
          init(Obj) {
            console.log('加载调查问卷选择弹窗',Obj)
            if (Obj) {
              this.SingleChoice = Obj.SingleChoice
            }
            let selectDept = JSON.parse(localStorage.getItem('orgInfo'))
            this.content_data = []
            // 获取问卷信息
            API.getQuestionnaireList({ nurseUnitId: Obj.nurseUnitId, orgId: selectDept.orgId }).then(response => {
              if (response.data) {
                this.content_data = response.data
                for (let v of this.content_data) {
                  if (v.title) v.label = v.title
                  if (v.children) {
                    for (let vv of v.children) {
                      if (vv.title)vv.label = vv.title
                    }
                  }
                }
                // this.content_data = response.data

                this.Dialogvisible = true
                this.$nextTick(() => {
                  this.$refs['showDialog-treeForm'].setCheckedNodes([])
                  if (Obj.check) {
                    this.CheckedKeys = [Obj.check]
                    this.treeCheckedObj.checked = Obj.check
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
            let arr
            if (this.SingleChoice) {
              if (!this.treeCheckedObj.checked) {
                this.$message.error("未选择问卷！")
                return
              }
              arr = [{ paperId: this.treeCheckedObj.checked, title: this.treeCheckedObj.label }]
            } else {
              if (this.treeCheckedArray.length === 0) {
                this.$message.error("未选择问卷！")
                return
              }
              arr = this.treeCheckedArray
            }

            this.$emit('callBack', JSON.stringify(arr))
            this.Dialogvisible = false
          },
          // 点击树选择
          handleClick(data, checked, node) {
            if (data.children) return
            this.treeCheckedArray = []
            for (let vv of checked.checkedNodes.values()) {
              let o = {
                paperId: vv.paperId,
                title: vv.title
              }
              this.treeCheckedArray.push(o)
            }
            // 单选，需要处理选中项
            if (this.SingleChoice) {
              if (checked.checkedKeys.length === 0) {
                this.$refs['showDialog-treeForm'].setCheckedNodes([]);
                this.treeCheckedObj = {
                  checked: "",
                  whileName: "",
                  label: ""
                };
              } else {
                this.$refs['showDialog-treeForm'].setCheckedNodes([data]);
                this.treeCheckedObj.label = data.label;
                this.treeCheckedObj.checked = data.paperId;
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

<style lang="scss">
    //@import url(); 引入公共css类
    #showDialogTreeFormQuestionnaire {
      >.el-tree-node{
        >.el-tree-node__content{
          .el-checkbox{
            display: none !important;
          }
        }
      }
    }
</style>
