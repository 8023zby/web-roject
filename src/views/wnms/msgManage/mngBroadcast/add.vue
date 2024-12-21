<!--
  文件描述：音频管理-添加页  播出单添加
      主样式class：edit-page-new
  创建时间：2020/4/22 09:31
  创建人：Administrator
-->
<template>
  <div class="typt-list-main">
    <div class="typt-tit-cls">
      <div class="typt-tit-logo"></div>
      <div class="typt-tit-content">{{ detail.type === 'edit'?'编辑':'添加' }}播出单</div>
    </div>
    <div class="typt-add-container">
      <div class="typt-add-form" style="width: 100%">
        <el-form ref="formContent" :model="formContent" :rules="rules" label-width="130px">
          <el-form-item label="播出单名称:" prop="broadcaseName">
            <el-input v-model.trim="formContent.broadcaseName" type="text" size="small" class="elinput-300" maxlength="16" />
          </el-form-item>
          <el-form-item label="音频:" prop="audioFilesDoList">
            <el-select v-model="formContent.audioFilesDoList" multiple placeholder="请选择" size="small" class="elinput-300" style="min-height:34px;line-height: 34px;" :disabled="formContent.deptId?false:true">
              <el-option v-for="item in audioList" :key="item.id" :label="item.audioName" :disabled="item.audioStatus === 0" :value="item.id">{{item.audioStatus === 0? "(转化中)"+item.audioName: item.audioName}}
              </el-option>
            </el-select>
            <el-button type="primary" style="margin-left: 16px;" size="small" @click="uploadNewVideo">上传新音频</el-button>
          </el-form-item>
          <el-form-item label="播放类型:" prop="playType">
            <el-radio v-model="formContent.playType" :label="0">时间段播放</el-radio>
            <el-radio v-model="formContent.playType" :label="1">次数播放</el-radio>
            <el-radio v-model="formContent.playType" :label="2">非定时播放</el-radio>
          </el-form-item>
          <!--  -->
          <template v-if="formContent.playType==0">
            <el-form-item v-for="(item, index) in playTime" prop="playTime" :key="index" :label="index == 0 ? '时间段:' : `时间段${index+1}:`">
              <el-time-picker v-model="playTime[index][0]" value-format="HH:mm" format="HH:mm" :clearable="false" size="small" class="elinput-300" placeholder="开始时间" :picker-options="{
                                start: '00:00',
                                step: '00:01',
                                end: '23:59'
                              }" />&nbsp;&nbsp;至&nbsp;&nbsp;
              <el-time-picker v-model="playTime[index][1]" value-format="HH:mm" format="HH:mm" :clearable="false" placeholder="结束时间" size="small" class="elinput-300" :picker-options="{
                                start: '00:00',
                                step: '00:01',
                                end: '23:59'
                              }" />
              <span class="small-btn" style="margin-left: 15px;">
                <el-button v-if="(playTime.length < 3) && (index === 0)" type="primary" icon="el-icon-plus" title="添加" circle @click="addOption" size="small" class="button-model-add" />
                <el-button v-if="index >= 1" type="danger" icon="el-icon-minus" title="删除" circle @click="delOption(item)" size="small" class="button-model-del" />
              </span>
            </el-form-item>
          </template>

          <template v-if="formContent.playType==1">
            <el-form-item v-for="(item, index) in playTime" :key="index" label>
              <div class="label-border-mngBroadcast">
                <div class="d-time page-d-time">
                  <span style="color:#F56C6C;position: absolute;left: 5px;">*</span>
                  <span class="span-label page-span-label">开始时间:</span>
                  <el-time-picker v-model="playTime[index][0]" value-format="HH:mm" format="HH:mm" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间" />
                </div>
                <div class="d-time page-d-time">
                  <span class="span-label  page-span-label">播放次数:</span>
                  <el-input v-model.trim="playTime[index][1]" type="number" style="width: 220px" placeholder="次数" />
                </div>
                <div class="small-btn page-d-time">
                  <el-button v-if="(playTime.length < 3) && (index === 0)" type="primary" icon="el-icon-plus" title="添加" circle @click="addOption" size="small" class="button-model-add" />
                  <el-button v-if="index >= 1" type="danger" icon="el-icon-minus" title="删除" circle @click="delOption(item)" size="small" class="button-model-del" />
                </div>
              </div>
            </el-form-item>
          </template>
          <!--  -->
          <el-form-item label="播放床位:" :prop="rooms.length>0?'':'reBroadcaseBedDoList'">
            <div class="btn-demo-mngBroadcast">
              <el-button type="primary" plain size="small" @click="handleCheckAllChangeBed(1)">全选</el-button>
              <el-button type="primary" plain size="small" @click="handleCheckAllChangeBed(0)">反选</el-button>
            </div>

            <div class="checkbox-demo-mngBroadcast">
              <el-checkbox-group v-model="beds" @change="handleCheckedArrChangeBed">
                <el-checkbox v-for="item in bedList" :key="item.bedId" :label="item.bedId" :value="item.bedId">{{item.bedName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>

          <el-form-item label="播放房间:" :prop="beds.length>0?'':'reBroacastRoomDoList'">
            {{ formContent.rooms }}
            <div class="btn-demo-mngBroadcast">
              <el-button type="primary" plain size="small" @click="handleCheckAllChangeRoom(1)">全选</el-button>
              <el-button type="primary" plain size="small" @click="handleCheckAllChangeRoom(0)">反选</el-button>
            </div>
            <div class="checkbox-demo-mngBroadcast">
              <el-checkbox-group v-model="rooms" @change="handleCheckedArrChangeRoom">
                <el-checkbox v-for="item in roomList" :key="item.roomId" :label="item.roomId" :value="item.roomId">{{item.roomName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="typt-add-footer">
      <el-button @click="$emit('option-changed', 'list')">取 消</el-button>
      <el-button type="primary" @click="(detail.type === 'edit' ? editHandler(detail.row.id) : addHandler())">保 存</el-button>
    </div>

    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <add-bell ref="refAffBell" v-if="addbellVisiable" @closeAdd="closeAddBell"></add-bell>
    </slot>
  </div>
</template>

<script>
import "./mngBroadcast.scss";
import mixin from "../mngClock/mixin";
import BaseQueryPageForm from "../../common/BaseQueryPageForm";
import addBell from "./AudioManagement/add";

import {
  queryDetailsApi,
  addApi,
  editApi,
  queryBedListApi,
  queryRoomListApi,
  createManifest,
  delManifest
} from "@/api/wnms//msgManage/mngBroadcast";

export default {
  mixins: [mixin, BaseQueryPageForm],
  components: { addBell },
  props: {
    detail: {
      required: false,
      type: Object,
      default: () => {}
    }
  },
  data() {
    const validatebroadcaseName = (rule, value, callback) => {
      console.log(this.checkSpecialKey(value));
      if (!this.checkSpecialKey(value)) {
        callback(new Error("名称不能含有特殊字符！"));
      } else {
        callback();
      }
    };
    var playTimeva = (rule, value, callback) => {
      callback();
    };
    return {
      oldBroadcaseName: "", //旧的播放丹名称
      addbellVisiable: false,
      // 验证方法
      rules: {
        deptId: [
          {
            required: true,
            message: "请选择护理单元",
            trigger: "change"
          }
        ],
        broadcaseName: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          },
          {
            min: 1,
            max: 16,
            message: "请输入16位以内",
            trigger: "blur"
          },
          { validator: validatebroadcaseName, trigger: "blur" }
        ],
        audioFilesDoList: [
          {
            required: true,
            message: "请选择音频",
            trigger: "change"
          }
        ],
        playType: [
          {
            required: true,
            message: "请选择播放类型",
            trigger: "change"
          }
        ]
      },
      //
      checkAllBed: false,
      checkAllRoom: false,
      isIndeterminateBed: false,
      isIndeterminateRoom: false,
      // 类型
      audioType: "broadcast",
      // 中转数据
      beds: [],
      rooms: [],
      playTime: [["", ""]],
      // 表单内容
      formContent: {
        deptId: this.selectDeptInfo(),
        broadcaseName: "",
        audioFilesDoList: [],
        playType: 0,
        playTimeList: "",
        reBroacastRoomDoList: [],
        reBroadcaseBedDoList: []
      }
    };
  },
  computed: {
    // 监听是:时间段播放OR次数播放
    isType() {
      return this.formContent.playType === 0;
    }
  },
  watch: {
    // playTime: function (val) {
    //   this.formContent.playTimeList = JSON.stringify(val)
    // },
    'formContent.playType': function () {
      this.playTime = [['', this.isType ? '' : '1']]
    },
    isType: function(val) {
      this.playTime = [["", val ? "" : "1"]];
    },

    // 监听重新组装 床位 / 房间 数据
    bedList: function(data) {
      this.formContent.reBroadcaseBedDoList = this.checkedBedMoreHandler(
        this.beds
      );
    },
    roomList: function(data) {
      this.formContent.reBroacastRoomDoList = this.checkedRoomMoreHandler(
        this.rooms
      );
    },
    beds: function(data) {
      this.formContent.reBroadcaseBedDoList = this.checkedBedMoreHandler(
        this.beds
      );
    },
    rooms: function(data) {
      this.formContent.reBroacastRoomDoList = this.checkedRoomMoreHandler(
        this.rooms
      );
    }
  },
  mounted() {
    // 获取音频列表
    this.getAudioList();

    // 获取床位列表
    this.queryBedListHandler(this.selectDeptInfo());
    // 获取房间列表
    this.queryRoomListHandler(this.selectDeptInfo());
    // 编辑时回显数据
    if (this.detail.row) {
      queryDetailsApi(this.detail.row.id).then(response => {
        this.formContent.deptId = response.data.deptId;
        this.formContent.broadcaseName = response.data.broadcaseName;
        this.oldBroadcaseName = this.formContent.broadcaseName;
        this.formContent.audioFilesDoList = this.detail.row.audioFilesDoList.map(
          item => item.audioId
        );
        this.formContent.playType = response.data.playType;
        console.log("播放类型：" + response.data.playType);
        if (Number(response.data.playType) === 1) {
          this.$nextTick(() => {
            this.playTime =
              response.data.playTimeList !== ""
                ? new Function("return " + response.data.playTimeList)()
                : [["", this.isType ? "" : "0"]];
          });
        } else {
          this.playTime =
            response.data.playTimeList !== ""
              ? new Function("return " + response.data.playTimeList)()
              : [["", this.isType ? "" : "0"]];
        }

        let bedNames = [];
        if (response.data.bedNames) {
          for (let v of response.data.bedNames.values()) {
            if (v.bedId) bedNames.push(v.bedId);
          }
        }

        this.beds = bedNames;

        let roomNames = [];
        if (response.data.roomNames) {
          for (let v of response.data.roomNames.values()) {
            if (v.roomId) roomNames.push(v.roomId);
          }
        }
        this.rooms = roomNames;
      });

      // 回显是否全选
      this.$nextTick(function() {
        setTimeout(() => {
          if (this.beds.length === this.bedList.length) {
            this.checkAllBed = true;
          }
          if (this.rooms.length === this.roomList.length) {
            this.checkAllRoom = true;
          }
        }, 150);
      });
    }
  },
  methods: {
    // 获取音频列表
    getAudioList() {
      this.queryAudioListHandler(
        {
          isPage: 0,
          deptIds: this.selectDeptInfo(),
          audioType: this.audioType
        },
        () => {
          for (let v of this.audioList) {
            if (Number(v.audioStatus === 0)) {
              this.getJieXiStatus(v, () => {
                this.getAudioList();
              });
            }
          }
        }
      );
    },
    closeAddBell(type) {
      this.addbellVisiable = false;
      if (type && type === "refresh") this.getAudioList();
    },
    // 上传新音频
    uploadNewVideo() {
      let _this = this;
      _this.addbellVisiable = true;
      _this.$nextTick(() => {
        this.$refs.refAffBell.detail.type = "add";
        this.$refs.refAffBell.detail.audioType = "broadcast";
        this.$refs.refAffBell.init();
      });
    },
    checkSpecialKey(str) {
      var specialKey =
        "[`~!#$^&*()=|{}':;'\\[\\].<>/?~！#￥……&*（）——-|{}【】‘；：”“'。，、？]‘'";
      for (var i = 0; i < str.length; i++) {
        if (specialKey.indexOf(str.substr(i, 1)) !== -1) {
          return false;
        }
      }
      return true;
    },
    /**
     * @获取床位列表
     */
    queryBedListHandler(deptIds) {
      queryBedListApi({
        pageHelper: 2,
        page: this.page,
        size: this.size,
        // orderBy: 'sort asc',
        deptIds
      }).then(response => {
        this.bedList = response.data;
        if (this.bedList !== null && this.detail.type !== "edit") {
          this.beds = this.bedList.map(item => item.bedId);
        }
      });
    },
    /**
     * @获取房间列表
     */
    queryRoomListHandler(deptIds) {
      queryRoomListApi({
        pageHelper: 2,
        page: this.page,
        size: this.size,
        // orderBy: 'sort asc',
        deptIds
      }).then(response => {
        this.roomList = response.data;
        if (this.roomList !== null && this.detail.type !== "edit") {
          this.rooms = this.roomList.map(item => item.roomId);
        }
      });
    },

    // 比较两个时间段是否有重叠
    checkTime(a, b, x, y) {
      if (y <= a || b <= x) {
        return false;
      } else {
        return true;
      }
    },
    valiTime() {
      // 0 时间段 === 时间段不能重合，不能不选，结束时间要大于起始时间
      // 1 定时 === 次数大于0，时间不能有相同
      if (this.formContent.playType === 0) {
        let isoverlap = false; // 是否有重叠
        for (let i = 0; i < this.playTime.length; i++) {
          if (
            this.playTime[i][0] === "" ||
            this.playTime[i][1] === "" ||
            this.playTime[i][0] === null ||
            this.playTime[i][1] === null
          ) {
            this.$message({
              type: "error",
              message: "请选择时间段！"
            });
            return false;
          }
          if (
            new Date(this.playTime[i][0] + " :00") >
              new Date(this.playTime[i][1] + " :00") ||
            this.playTime[i][0] === this.playTime[i][1]
          ) {
            this.$message({
              type: "error",
              message: "结束时间需晚于开始时间！"
            });
            return false;
          }
          if (i === 1) {
            if (!isoverlap) {
              isoverlap = this.checkTime(
                this.playTime[0][0],
                this.playTime[0][1],
                this.playTime[1][0],
                this.playTime[1][1]
              );
            }
          } else if (i === 2) {
            if (!isoverlap) {
              isoverlap = this.checkTime(
                this.playTime[0][0],
                this.playTime[0][1],
                this.playTime[1][0],
                this.playTime[1][1]
              );
            }
            if (!isoverlap) {
              isoverlap = this.checkTime(
                this.playTime[0][0],
                this.playTime[0][1],
                this.playTime[2][0],
                this.playTime[2][1]
              );
            }
            if (!isoverlap) {
              isoverlap = this.checkTime(
                this.playTime[2][0],
                this.playTime[2][1],
                this.playTime[1][0],
                this.playTime[1][1]
              );
            }
          }
        }
        if (isoverlap) {
          this.$message({
            type: "error",
            message: "时间段有重叠，请检查！"
          });
          return false;
        }
      } else if (this.formContent.playType === 1) {
        let isoverlap = false; // 是否有相同时间
        for (let i = 0; i < this.playTime.length; i++) {
          if (
            this.playTime[i][0] === "" ||
            this.playTime[i][0] === null ||
            this.playTime[i][1] === "" ||
            this.playTime[i][1] === null
          ) {
            this.$message({
              type: "error",
              message: "时间、次数不能为空！"
            });
            return false;
          }
          if (Number(this.playTime[i][1]) < 1) {
            this.$message({
              type: "error",
              message: "次数需大于0！"
            });
            return false;
          }
          if (i === 1) {
            if (!isoverlap) {
              isoverlap = this.playTime[0][0] === this.playTime[1][0];
            }
          } else if (i === 2) {
            if (!isoverlap) {
              isoverlap = this.playTime[0][0] === this.playTime[1][0];
            }
            if (!isoverlap) {
              isoverlap = this.playTime[0][0] === this.playTime[2][0];
            }
            if (!isoverlap) {
              isoverlap = this.playTime[1][0] === this.playTime[2][0];
            }
          }
        }
        if (isoverlap) {
          this.$message({
            type: "error",
            message: "有相同时间，请检查！"
          });
          return false;
        }
      }
      return true;
    },
    /**
     * @添加播出单
     */
    addHandler() {
      let timeCheck = this.valiTime();
      if (!timeCheck) return;

      this.formContent.playTimeList = JSON.stringify(this.playTime);
      this.$refs["formContent"].validate(valid => {
        if (valid) {
          // 处理播放音频名称
          let audio_files = [];
          for (let v of this.formContent.audioFilesDoList.values()) {
            let au = this.audioList.find((item, index) => {
              return item.id === v;
            });
            audio_files.push(au.fileUrl);
          }
          console.log(audio_files);

          createManifest({
            manifest_name:
              this.formContent.broadcaseName +
              "#*yh*#" +
              this.formContent.deptId,
            audio_files: audio_files
          })
            .then(res => {
              console.log("音视频保存播放单返回参数：", res);
              if (res.status === 200) {
                addApi(this.formContent)
                  .then(response => {
                    // 返回列表
                    this.IsSuccess(response, () => {
                      this.$emit("option-changed", "list");
                    });
                  })
                  .catch(e => {
                    this.FailA10();
                  });
              }
            })
            .catch(eFest => {
              console.log(eFest, "播放单添加到视音频组失败！！");
            });
        } else {
          return false;
        }
      });
    },

    /**
     * @编辑播出单
     */
    editHandler(param) {
      let timeCheck = this.valiTime();
      if (!timeCheck) return;

      this.formContent.playTimeList = JSON.stringify(this.playTime);

      this.$refs["formContent"].validate(valid => {
        if (valid) {
          // 先删除，再添加
          delManifest({
            manifest_name:
              this.oldBroadcaseName + "#*yh*#" + this.formContent.deptId
          }).then(res => {
            console.log("音视频删除播放单返回参数：", res);
            if (res.status === 200) {
              // 处理播放音频名称
              let audio_files = [];
              for (let v of this.formContent.audioFilesDoList.values()) {
                let au = this.audioList.find((item, index) => {
                  return item.id === v;
                });
                audio_files.push(au.fileUrl);
              }
              console.log(audio_files);

              createManifest({
                manifest_name:
                  this.formContent.broadcaseName +
                  "#*yh*#" +
                  this.formContent.deptId,
                audio_files: audio_files
              })
                .then(res => {
                  console.log("音视频保存播放单返回参数：", res);
                  if (res.status === 200) {
                    editApi({
                      id: param,
                      ...this.formContent
                    })
                      .then(response => {
                        // 返回列表
                        this.IsSuccess(response, () => {
                          this.$emit("option-changed", "list");
                        });
                      })
                      .catch(e => {
                        this.FailA10();
                      });
                  }
                })
                .catch(eFest => {
                  console.log(eFest, "播放单添加到视音频组失败！！");
                });
            }
          });
        } else {
          return false;
        }
      });
    },

    /**
     * A10接口调用失败，需将调用视音频接口删除对应数据
     * @constructor
     */
    FailA10() {
      delManifest({
        manifest_name:
          this.formContent.broadcaseName + "#*yh*#" + this.formContent.deptId
      }).then(res => {
        console.log("音视频删除播放单返回参数：", res);
        if (res.status === 200) {
        }
      });
    },
    // [床位] 单选和复选 获取 id 和 name
    checkedBedMoreHandler(data) {
      const newObj = [];

      // 循环把数据取出来然后放到form里面
      data.forEach((val, index, item) => {
        this.bedList.forEach((bval, index) => {
          if (val === bval.bedId) {
            newObj.push({
              bedId: bval.bedId,
              bedName: bval.bedName
            });
          }
        });
      });

      return newObj;
    },

    // [房间] 单选和复选 获取 id 和 name
    checkedRoomMoreHandler(data) {
      const newObj = [];

      // 循环把数据取出来然后放到form里面
      data.forEach((val, index, item) => {
        this.roomList.forEach((bval, index) => {
          if (val === bval.roomId) {
            newObj.push({
              roomId: bval.roomId,
              roomName: bval.roomName
            });
          }
        });
      });

      return newObj;
    },

    // 添加选项
    addOption() {
      // 增加数据
      this.playTime.push(["", this.isType ? "" : "1"]);
    },

    // 删除选项
    delOption(item) {
      var index = this.playTime.indexOf(item);
      if (index !== -1) {
        this.playTime.splice(index, 1);
      }
    },

    // 床位全选
    handleCheckAllChangeBed(val) {
      if (val === 0) {
        let j = this.beds.join(",");
        this.beds = [];

        for (let v of this.bedList.values()) {
          if (j.indexOf(v.bedId) < 0) {
            this.beds.push(v.bedId);
          }
        }
      } else {
        this.beds = this.bedList.map(item => item.bedId);
      }
      this.isIndeterminateBed = false;
    },
    // 床位多选
    handleCheckedArrChangeBed(value) {
      const checkedCount = value.length;
      this.checkAllBed = checkedCount === this.bedList.length;
      this.isIndeterminateBed =
        checkedCount > 0 && checkedCount < this.bedList.length;
      this.clearValidate("formContent");
    },

    // 房间全选
    handleCheckAllChangeRoom(val) {
      if (val === 0) {
        let j = this.rooms.join(",");
        this.rooms = [];

        for (let v of this.roomList.values()) {
          if (j.indexOf(v.roomId) < 0) {
            this.rooms.push(v.roomId);
          }
        }
      } else {
        this.rooms = this.roomList.map(item => item.roomId);
      }
      this.isIndeterminateRoom = false;
    },
    // 房间单选
    handleCheckedArrChangeRoom(value) {
      const checkedCount = value.length;
      this.checkAllRoom = checkedCount === this.roomList.length;
      this.isIndeterminateRoom =
        checkedCount > 0 && checkedCount < this.roomList.length;
      this.clearValidate("formContent");
    },

    // 时间范围组件联动限制
    pickerOptionsStart(index) {
      return {
        selectableRange:
          (index !== 0
            ? this.playTime[index - 1][1] === ""
              ? this.playTime[0][1]
              : this.playTime[index - 1][1]
            : "00:00:00") +
          " - " +
          (this.playTime[index][1] === ""
            ? "23:59:00"
            : this.playTime[index][1])
      };
    },
    pickerOptionsEnd(index) {
      return {
        selectableRange:
          (index !== 0
            ? this.playTime[index][0] === ""
              ? this.playTime[index - 1][1]
              : this.playTime[index][0]
            : this.playTime[index][0] === ""
            ? "00:00:00"
            : this.playTime[index][0]) +
          " - " +
          "23:59:00"
      };
    },

    // 清除表单验证
    clearValidate(refs) {
      this.$nextTick(() => {
        this.$refs[refs].clearValidate();
      });
    }
  }
};
</script>
<style lang="scss">
@import "@/assets/wnms/css/self_common.scss";
</style>
<style lang="scss" scoped>
//@import url(); 引入公共css类
// 多选框的容器样式
.checkbox-demo-mngBroadcast {
  width: 94%;
  max-height: 190px;
  border: 1px solid #ebe7e9;
  padding: 6px 10px;
  overflow-y: scroll;
  margin-top: 15px;
  .el-checkbox {
    min-width: 110px;
  }
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  height: 3px !important;
  width: 3px !important;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  border-radius: 10px;
  background-color: #f5f5f5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  background: #bababa;
}
.btn-demo-mngBroadcast {
  .el-button--primary,
  .el-button--primary:focus,
  .el-button--primary:visited,
  .el-button--primary:hover {
    background-color: #ecf5ff !important;
    border-color: #1e87f0 !important;
    color: #409eff;
  }
}
span.page-span-label {
  padding-left: 15px;
  padding-right: 5px;
}
div.page-d-time {
  display: inline-block;
  padding-right: 10px;
}
</style>
