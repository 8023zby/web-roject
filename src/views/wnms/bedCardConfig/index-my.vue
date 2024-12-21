<!--
  文件描述：床头卡模板配置页面
  创建时间：2021/1/28 8:49
  创建人：PCL
-->
<template>
  <div class="typt-list-container">
    <hr />

    <!--左右按钮 === START-->
    <div class="typt-list-add-div">
      <el-button
        type="warning"
        icon="el-icon-plus"
        size="small"
        @click="add"
      >添加</el-button>
      <!--右侧区域按钮-->
      <div class="action_div">
      </div>
    </div>
    <!--左右按钮 === END-->

    <!--表格主体 ==== START-->
    <el-table
      v-loading="yh_loading"
      :data="dataList"
      :header-cell-style="{'background': '#f9f9f9'}"
      height="98%"
      stripe
    >
      <el-table-column label="序号" prop="id" type="index" width="80" align="center">
      </el-table-column>
      <el-table-column label="模板名称" prop="label" align="center" />
      <el-table-column
        label="模板地址"
        prop="path"
        align="center"
        :show-overflow-tooltip="true"
        width="300"
      />
      <el-table-column label="缩略图" align="center" width="180">
        <!--任务定时类型（IMMEDIATE：即时，ABSOLUTE：绝对定时，RELATIVE：相对定时）-->
        <template slot-scope="scope">
          <div
            style=""
          >
            <img :src="scope.row.image" style="width: 120px;" alt="">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" align="center" >
        <template slot-scope="scope">
          <div
            style=""
          >
            {{scope.row.type === 'bedHead'?'床头':'床旁'}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <span
            class="el-button-text-color"
            @click="modify(scope.row)"
          >编辑</span>

          <span class="el-text-danger" @click="deletec(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <!--表格主体 ==== END-->

    <!--分页条-->
    <!--<pagination
      :pagination="pagination"
      @page-size-changed="pageSizeChangeHandler"
      @page-changed="pageChangeHandler"
    />-->
    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <!--编辑弹窗-->
      <el-dialog
        :visible.sync="dialogSortVisible"
        title="添加/编辑"
        :close-on-click-modal="false"
        :show-close="false"
        :close-on-press-escape="false"
      >
        <div style="height: 500px;overflow-y: auto;">
          <el-container class="edit-page-new">
            <slot name="main">
              <el-form ref="formMsg" :model="cardfrom" label-width="125px">
                <el-form-item label="模板名称:" prop="label">
                  <el-input v-model="cardfrom.label" class="elinput-300" placeholder="请输入"/>
                </el-form-item>
                <el-form-item label="模板路径:" prop="path">
                  <el-input v-model="cardfrom.path" class="elinput-300" placeholder="请输入"/>
                </el-form-item>
                 <el-form-item label="缩略图:" prop="image" style="height:auto;">
                   <el-upload
                     class="cardfrom-image"
                     action='#'
                     :show-file-list="false"
                     :auto-upload="true"
                     accept=".png"
                     :http-request="httpRequest"
                   >
                     <img v-if="cardfrom.image" :src="cardfrom.image" class="cardfrom-image-avatar">
                     <i v-else class="el-icon-plus cardfrom-image-icon"></i>
                     <div slot="tip" class="el-upload__tip">只能上传png文件，且不超过50kb</div>
                   </el-upload>

                </el-form-item>
                <el-form-item label="类型:" prop="type">
                  <el-radio v-model="cardfrom.type" label="bedHead">床头</el-radio>
                  <el-radio v-model="cardfrom.type" label="bedSide">床旁</el-radio>
                </el-form-item>
              </el-form>
            </slot>
          </el-container>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSortVisible=false">取消</el-button>
          <el-button type="primary" @click="editSave">确认</el-button>
        </div>
      </el-dialog>
    </slot>
  </div>
</template>

<script>
    import * as bedCardConfigApi from '@/api/wnms/bedCardConfig/'
    import BaseQueryPageForm from "../common/BaseQueryPageForm";
    export default {
        name: 'index',
        mixins: [BaseQueryPageForm],
        // import引入的组件需要注入到对象中才能使用
        data() {
            // 这里存放数据
            return {
              isEdit: false,
              yh_loading: false,
              dialogSortVisible: false,
              dataList: [],
              cardfrom: {
                label: '',
                path: '',
                image: '',
                type: ''
              }
            }
        },
        // 监听属性 类似于data概念
        computed: {},
        // 方法集合
        methods: {
          /* 获取列表 */
          executeQueryPage () {
            this.yh_loading = true
            bedCardConfigApi.queryList().then(data => {
             this.dataList = data.data
            }).finally(() => {
              this.yh_loading = false
            })
          },
          add() {
            this.cardfrom = {
              label: '',
              path: '',
              image: '',
              type: ''
            }
            this.dialogSortVisible = true
            this.isEdit = false
          },
          modify(row) {
            this.cardfrom = {
              label: row.label,
              path: row.path,
              image: row.image,
              type: row.type,
              id: row.id
            }
            this.dialogSortVisible = true
            this.isEdit = true
          },
          deletec(row) {
            console.log(row)
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              showClose: false
            }).then(() => {
              bedCardConfigApi.Delete(row.id).then(response => {
                // 刷新列表
                this.executeQueryPage()
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            })
          },
          editSave() {
            if (this.isEdit) {
              bedCardConfigApi.Edit(this.cardfrom).then(response => {
                // 返回闹钟类型列表
                this.IsSuccess(response, () => {
                  this.dialogSortVisible = false
                  this.executeQueryPage()
                })
              })
            } else {
              bedCardConfigApi.Add(this.cardfrom).then(response => {
                // 返回闹钟类型列表
                this.IsSuccess(response, () => {
                  this.dialogSortVisible = false
                  this.executeQueryPage()
                })
              })
            }
          },
          getBase64(file) {
            return new Promise((resolve, reject) => {
              let reader = new FileReader();
              let fileResult = "";
              reader.readAsDataURL(file);
              //开始转
              reader.onload = function() {
                fileResult = reader.result;
              };
              //转 失败
              reader.onerror = function(error) {
                reject(error);
              };
              //转 结束  咱就 resolve 出去
              reader.onloadend = function() {
                resolve(fileResult);
              };
            });
          },
          httpRequest(data) {
            //这是限制上传文件类型
            const isPFX = data.file.type === "image/png";
            const isLt2M = data.file.size / 1024 < 50;

            if (!isPFX) {
              this.$message.error("上传文件只能是 png 格式!");
            } else if (!isLt2M) {
              this.$message.error("上传文件大小不能超过 50k!");
            } else {
              // 转base64
              this.getBase64(data.file).then(resBase64 => {
                this.cardfrom.image = resBase64
              })
              this.$message.success('文件上传成功');
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
          this.executeQueryPage()
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
    .cardfrom-image .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .cardfrom-image .el-upload:hover {
      border-color: #409EFF;
    }
    .cardfrom-image-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .cardfrom-image-avatar {
      width: 178px;
      height: 178px;
      display: block;
    }

</style>
