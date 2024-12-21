<!-- 门灯管理 -->
<template>
  <div class="doorlamp-main-view" v-loading="isLoading">
    <div v-if="!loadErr">
      <div class="control-btns">
				<div class="control-btns-box">
					<el-form class="typt-list-search" :inline="true">
						<el-form-item label="科室:">
							<treeselect
								v-model="selectDeptId"
								:multiple="false"
								:options="dataTree"
								:normalizer="normalizer"
								@select="onSelect"
								:default-expand-level="2"
								:clearable="false"
								placeholder="请选择科室"
							/>
						</el-form-item>
						<!-- <el-form-item>
							<el-button @click="queryHandler" type="primary" icon="el-icon-search" size="small">搜索</el-button>
						</el-form-item> -->
					</el-form>
				</div>
        <el-button type="primary" @click="onNavTo('/doorLampSetup')">门灯颜色配置</el-button>
      </div>
      <el-row :gutter="20">
        <el-col
          v-for="item in roomList"
          :key="item.roomId"
          :xl="8"
          :lg="12"
          :md="12"
          :sm="24"
          :xs="24"
        >
          <div class="item">
            <div class="item-room">
              <i class="el-icon-s-home"></i>
              <span class="door-no">{{ item.roomName }}</span>
            </div>
            <div class="item-lamp">
              <div class="item-lamp-title">门灯：</div>
              <el-input
                class="item-lamp-input"
                v-model="item.doorLightName"
                placeholder="请填写门灯编号"
              ></el-input>
            </div>
          </div>
        </el-col>
      </el-row>

      <div class="btn-view" v-if="!isLoading">
        <el-button type="primary" v-if="roomList && roomList.length > 0" @click="onSave">保存</el-button>
				<div v-else style="color: #ccc;margin-top:50px;font-size:16px">暂无数据</div>
      </div>
    </div>
    <div class="error-view" v-else>
      <i class="el-icon-bangzhu"></i>
      <div>数据加载错误...</div>
    </div>
  </div>
</template>

<script>
import * as API from "@/api/wnms/msgManage/doorLamp";
import * as API2 from "@/api/wnms/msgManage/systemConfig"
import deptInsideMenu from '@/components/wnms/deptInsideMenu/deptInsideMenu'
import Treeselect from "@riophae/vue-treeselect"
export default {
  components: { Treeselect },
  data() {
    return {
      isLoading: true,
      loadErr: false, //加载出错
      roomList: [], //房间列表，主要展示列表
      lampDataList: [], //对应门灯数据列表
			selectDeptId: '',
			dataTree: []
    };
  },
  async mounted() {
		this.getdepts()
  },
  methods: {
    onNavTo(path) {
      // console.log(this.$route, 'pppppppppp')
      this.$router.push({ path: path, query: { deptId: this.selectDeptId, parentName: this.$route.name } })
      // this.$router.push(path);
    },
    //保存门灯数据
    async onSave() {
      this.isLoading = true;
      //未填门灯编号的房间要过滤掉
      let saveList = [];
      this.roomList.forEach((item) => {
        if (item.doorLightName) {
					saveList.push({
            roomId: item.roomId,
            doorLightName: item.doorLightName,
            nurseUnitId: this.selectDeptId
          });
				}
      });

      let res = await API.saveRoomLampList(saveList);
      console.log(res);
      this.isLoading = false;
    },
    //根据门灯id获取绑定的门灯编号
    onGetLampByRoomId(roomId) {
      let res = "";
      this.lampDataList.forEach((item) => {
        if (item.roomId == roomId) res = item.doorLightName;
      });
      return res;
    },
		async queryHandler() {
		 try {
      let deptInfo = JSON.parse(window.localStorage.getItem("deptInfo"));
      deptInfo.deptId = this.selectDeptId || deptInfo.deptId
      let list = []; //房间数据列表，查询的数据先在此筛选合并
      //房间列表
      let listRes = await API.roomList(this.selectDeptId)
      if (listRes.status == 200) {
        //绑定房间列表
        list = listRes.data.list;
      }

      //房间绑定的门灯列表
      let lampRes = await API.roomLampList(deptInfo.deptId);
      if (lampRes.status == 200) {
        //绑定房间对应门灯
        this.lampDataList = lampRes.data;

        //将门灯编号绑定到对应的房间
        list.forEach((item) => {
          item.doorLightName = this.onGetLampByRoomId(item.roomId);
        });

        //将处理好的数据交给vue
        this.roomList = list;
      }
    } catch (e) {
      console.error("数据加载错误:", e);
      this.loadErr = true;
    } finally {
      this.isLoading = false; //数据加载完成
    }
	},
	/*获取护理单元*/
    async getdepts () {
      const deptId = this.$route.params && this.$route.params.deptId ? this.$route.params.deptId : null
      const selectDeptInfo = JSON.parse(localStorage.getItem('selectDeptInfo')) || {}
      let res = await API2.getdepts()
      if (res.status === 200 && res.data !== null) {
        this.dataTree = res.data.list
        this.selectDeptId = deptId || selectDeptInfo.deptId || this.dataTree[0].deptId
        console.log('病房门灯获取护理单元===', this.selectDeptId)
      }
      this.queryHandler()
    },
		normalizer (node) {
      return {
        id: node.deptId,
        label: node.deptName,
        children:
          node.children && node.children.length > 0 ? node.children : undefined
      }
    },
		onSelect (node, ins) {
      this.selectDeptId = node.deptId
      this.queryHandler()
    }
  }
};
</script>
<style lang='scss' scoped>
div,
span {
  font-size: 14px;
}

.doorlamp-main-view {
  padding: 10px 20px;
  box-sizing: border-box;
  min-height: 500px;

  .item {
    display: flex;
    flex: 1;
    margin: 10px 0;
    box-shadow: 0 0 12px 2px rgba(0, 0, 0, 0.1);
    border-radius: 7px;

    .item-room {
      width: 130px;
      height: 50px;
      display: flex;
      align-items: center;

      i {
        width: 50px;
        height: 50px;
        display: block;
        font-size: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #409eff;
      }
      .door-no {
        font-size: 16px;
        width: 74px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .item-lamp {
      display: flex;
      align-items: center;
      flex: 1;
      padding-right: 10px;
      box-sizing: border-box;

      .item-lamp-title {
        min-width: 50px;
        color: #888;
      }

      .item-lamp-input {
        flex: 1;
      }
    }
  }

  .btn-view {
    display: flex;
    justify-content: center;
    padding: 10px 0 100px 0;
  }
}

.error-view {
  padding: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  i {
    font-size: 50px;
    color: #409eff;
  }

  div {
    color: #888;
    margin-top: 20px;
  }
}

.control-btns {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}
/deep/ .el-form-item {
	margin-bottom: 0;
}
/deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
	margin-bottom: 0;
}
/deep/.el-form-item__content {
	width: 182px;
}
</style>
