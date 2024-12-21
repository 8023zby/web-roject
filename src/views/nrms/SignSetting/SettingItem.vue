<template>
  <div v-loading="loading" class="container">
    <div class="toolbar">
      <!-- 搜索条件 -->
      <div class="search_form">
        <el-form :inline="true" :model="search_from" ref="search_form">
          <el-form-item prop="signItemName" label="体征项名称">
            <el-input
              v-model="search_from.signItemName"
              clearable
              placeholder=""
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="体温单中是否开启" prop="isTemperatureDisplay">
            <el-select
              v-model="search_from.isTemperatureDisplay"
              clearable
              placeholder=""
              autocomplete="off"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="体征中是否开启" prop="isSignDisplay">
            <el-select
              v-model="search_from.isSignDisplay"
              clearable
              placeholder=""
              autocomplete="off"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="searchForm"
            >搜索
            </el-button>
            <el-button type="gray" icon="el-icon-refresh" @click="resetForm()"
            >重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table">
      <el-table
        :data="item_data"
        row-key="itemId"
        border
        stripe
        highlight-current-row
        height="100%"
      >
        <!-- <el-table-column type="index" label="序号" align="center" width="50"></el-table-column> -->
        <el-table-column prop="signItemName" label="体征项名称" min-width="80"></el-table-column>
        <el-table-column prop="signItemUnit" label="体征项单位" min-width="80"></el-table-column>
        <el-table-column prop="isTemperatureDisplay" label="体温单是否开启" min-width="80">
          <template slot-scope="scope">
            <template v-if="scope.row.canUpdate === true">
              <el-switch
                v-model="scope.row.isTemperatureDisplay"
                :active-value="true"
                :inactive-value="false"
                @change="handleOpenTemperatureEnable($event, scope.row, scope.$index)"
              >
              </el-switch>
            </template>
            <template v-else>
              <span>{{scope.row.isTemperatureDisplay === true ? '开启' : '关闭'}}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="displayRule" label="体温单显示规则" min-width="80">
          <template slot-scope="scope">
            <template v-if="scope.row.canUpdate === true">
              <el-button type="text" @click="showSettingItemWin(scope.row)"
              >设置
              </el-button>
            </template>
            <template v-else>
              <span>{{sign_config.item_display_rule[scope.row.displayRule]}}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="isSignDisplay" label="体征中是否开启" min-width="80">
          <template slot-scope="scope">
            <template v-if="scope.row.canUpdate === true">
              <el-switch
                v-model="scope.row.isSignDisplay"
                :active-value="true"
                :inactive-value="false"
                @change="handleOpenSignEnable($event, scope.row, scope.$index)"
              >
              </el-switch>
            </template>
            <template v-else>
              <span>{{scope.row.isSignDisplay === true ? '开启' : '关闭'}}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="250">
          <template slot-scope="scope">
            <template v-if="scope.row.canUpdate === true">
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'top')"
              >置顶
              </el-button>
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'up')"
              >上移
              </el-button>
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'down')"
              >下移
              </el-button>
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'bottom')"
              >置尾
              </el-button>
              <el-button
                type="text"
                @click="itemSort(scope.$index, scope.row, 'assign')"
              >指定位置
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 规则设置表单 -->
    <el-dialog
      title="规则设置"
      :visible.sync="settingDialogVisible"
      width="400px">

      <el-form
        :model="setting_item_form"
        :rules="rules"
        ref="sign_form"
        label-width="130px"
        label-suffix=":"
      >
        <el-form-item label="体征项名称" prop="signItemName">
          {{setting_item_form.signItemName}}
        </el-form-item>
        <el-form-item label="体征项单位" prop="signItemUnit">
          {{setting_item_form.signItemUnit}}
        </el-form-item>
        <el-form-item label="体温单中是否开启" prop="isTemperatureDisplay">
          <el-radio-group v-model="setting_item_form.isTemperatureDisplay">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="体温单显示规则" prop="displayRule">
          <el-select
            v-model="setting_item_form.displayRule"
            placeholder=""
            autocomplete="off"
          >
            <el-option label="" value=""></el-option>
            <el-option label="始终显示" value="1"></el-option>
            <el-option label="有值显示" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="体征中是否开启" prop="isSignDisplay">
          <el-radio-group v-model="setting_item_form.isSignDisplay">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="settingItem">确认</el-button>
        <el-button @click="settingDialogVisible = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { ApiSignItemSetting } from "../../../api/nrms/index";
  import { sign as sign_config } from "../../../assets/nrms/common/item_config";

  export default {
    name: "setting_item",
    data() {
      return {
        sign_config,
        loading: false,
        item_data: [],
        //搜索表单
        search_status: false,
        search_from: {
          itemCode: "",
          isSignDisplay: "",
          isTemperatureDisplay: ""
        },
        settingDialogVisible: false,
        setting_item_form: {
          signApplyId: "",
          isTemperatureDisplay: false,
          isSignDisplay: false,
          displayRule: "",
        },
        rules: {}
      };
    },
    created() {
      this.getItemData();
    },
    activated() {
      this.getItemData();
    },
    methods: {
      getItemData() {
        this.loading = true;
        ApiSignItemSetting.selectItem(this.search_from)
          .then(res => {
            this.item_data = res.data || [];
            this.loading = false;
          })
          .catch(res => {
            this.loading = false;
            this.$message.error(res.message);
          });
      },
      //编辑
      showSettingItemWin(data) {
        this.settingDialogVisible = true;
        Object.assign(this.setting_item_form, data);
      },
      settingItem() {
        ApiSignItemSetting.itemSetting([this.setting_item_form])
          .then(() => {
            this.settingDialogVisible = false;
            this.$message.success('设置成功！');
            this.getItemData()
          })
          .catch(res => {
            this.$message.error(res.message);
          });
      },
      searchForm() {
        if (this.search_from.itemCode || this.search_from.isTemperatureDisplay || this.search_from.isSignDisplay) {
          this.search_status = true;
        }
        this.getItemData();
      },
      resetForm() {
        this.search_status = false;
        this.$refs.search_form.resetFields();
        this.getItemData();
      },
      handleOpenTemperatureEnable(val, row, index) {
        ApiSignItemSetting.itemSetting([{
          signApplyId: row.signApplyId,
          isTemperatureDisplay: val
        }])
          .then(() => {
            row.isTemperatureDisplay = val;
            this.item_data[index] = row;
          })
          .catch(res => {
            row.isTemperatureDisplay = !val;
            this.$message.error(res.message);
          });
      },
      handleOpenSignEnable(val, row, index) {
        ApiSignItemSetting.itemSetting([{
          signApplyId: row.signApplyId,
          isSignDisplay: val
        }])
          .then(() => {
            row.isSignDisplay = val;
            this.item_data[index] = row;
          })
          .catch(res => {
            row.isSignDisplay = !val;
            this.$message.error(res.message);
          });
      },
      itemSort(current_index, current_data, type) {
        if (this.search_status) {
          this.search_status = false;
          this.resetForm();
          return false;
        }
        let _item_data = this.item_data;
        if (type === "up") {
          if (current_index == 0) {
            this.$message.warning("已经是第一个！");
            return;
          }
          let prev_index = current_index - 1;
          let prev_data = _item_data[prev_index];
          if(prev_data.canUpdate !== true){
            this.$message.warning("已经是第一个！");
            return;
          }
          //交换位置
          _item_data[current_index] = prev_data;
          _item_data[prev_index] = current_data;

          this.updateSort(_item_data);
        } else if (type === "down") {
          if (current_index == _item_data.length - 1) {
            this.$message.warning("已经是最后一个！");
            return;
          }
          let next_index = current_index + 1;
          let next_data = _item_data[next_index];

          //交换位置
          _item_data[current_index] = next_data;
          _item_data[next_index] = current_data;

          this.updateSort(_item_data);
        } else if (type === "top") {
          if (current_index == 0) {
            this.$message.warning("已经是第一个！");
            return;
          }
          //获取能够排序的最前一个元素
          let tindex = null;
          for (let i = 0; i < _item_data.length; i++) {
            let _d = _item_data[i];
            if(_d['canUpdate'] === true){
              tindex = i;
              break
            }
          }
          if(tindex === current_index){
            this.$message.warning("已经是第一个！");
            return;
          }

          let current_data = _item_data.splice(current_index, 1);
          _item_data.splice(tindex, 0, current_data[0]);

          this.updateSort(_item_data);
        } else if (type === "bottom") {
          if (current_index == _item_data.length - 1) {
            this.$message.warning("已经是最后一个！");
            return;
          }
          let current_data = _item_data.splice(current_index, 1);
          _item_data.push(current_data[0]);

          this.updateSort(_item_data);
        } else if (type === "assign") {
          let tindex = null;
          for (let i = 0; i < _item_data.length; i++) {
            let _d = _item_data[i];
            if(_d['canUpdate'] === true){
              tindex = i;
              break
            }
          }
          this.$prompt("跳转至", "指定位置", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            inputPattern: /^\d+$/,
            inputPlaceholder: `请输入数字序号(${tindex + 1}-${_item_data.length})`,
            inputErrorMessage: `请输入数字序号(${tindex + 1}-${_item_data.length})`
          }).then(({ value }) => {
            value = value <= tindex ? tindex + 1 : value;
            value = value > _item_data.length ? _item_data.length : value;

            let current_data = _item_data.splice(current_index, 1);
            _item_data.splice(value - 1, 0, current_data[0]);

            this.updateSort(_item_data);
          });
        }
      },
      //给后台更新数据
      updateSort(item_data) {
        let sort_data = [];
        //重新排序
        for (let i = 0; i < item_data.length; i++) {
          let _d = item_data[i];
          _d['sort'] = i + 1;
          sort_data.push({ signApplyId: _d['signApplyId'], sort: i + 1 });
        }

        ApiSignItemSetting.itemSetting(sort_data)
          .then(() => {
            this.item_data = JSON.parse(JSON.stringify(item_data));
          })
          .catch(res => {
            this.$message.error(res.message);
          });
      }
    }
  };
</script>

<style lang="scss" type="text/scss" scoped>
  .container {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    height: 100%;
  }
  .toolbar {
    padding: 0 20px;
    .operation {
      margin-bottom: 10px;
    }
  }
  .table {
    flex: 1;
    height: 0;
    overflow: hidden;
  }
</style>
