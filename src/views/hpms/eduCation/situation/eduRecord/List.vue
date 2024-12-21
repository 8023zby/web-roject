<!--宣教记录列表页面
2020-11-23 PCL
列表页删除功能设置为始终可用，点击删除的时候，如果是已发布宣教，则先撤回，后删除。

-->

<template>
  <layout-aside v-loading="loading">
    <div slot="aside">
      <patient-list @initPatient="initPatient" @activeNameChange="activeNameChange" initRowType="in" initRowIndex="0" />
    </div>
    <div slot="main">
      <layout-list>

        <!-- 查询条件 -->
        <div slot="query" class="query-items">
          <el-form :inline="true" :model="search_from" ref="search_form">
            <el-form-item label="创建时间" prop="startTime">
              <el-date-picker type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="search_from.startTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="至" prop="endTime">
              <el-date-picker type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" v-model="search_from.endTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="宣教内容" prop="educationProject">
              <el-input clearable v-model="search_from.eduName" placeholder="宣教内容" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="创建者" prop="educationProject">
              <el-input clearable v-model="search_from.creater" placeholder="创建者" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="typt-search-btn">
                <el-button type="primary" class="el-button-radius" icon="el-icon-search" @click="searchForm" size="small">搜索</el-button>
                <el-button type="text" @click="resetForm">重置</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <!-- 操作按钮 -->
        <div slot="left_btn" class="tool-bar">
          <el-button type="warning" icon="el-icon-plus" @click="addEducation" size="small" :disabled="!actionUse">添加
          </el-button>
        </div>
        <div slot="right_btn" class="tool-bar">
          <el-button type="primary" size="small" @click="evaluate" :disabled="!actionUse">评价
          </el-button>
          <!--<el-button type="primary" v-print="'#myHtmlElement'" size="small"  :disabled="!actionUse" style="background:#13ce67 !important;border-color: #13ce67 !important;"-->
          <!--&gt;打印-->
          <!--</el-button>-->
          <el-button type="primary" @click="printing()" size="small" style="background:#13ce67 !important;border-color: #13ce67 !important;">打印
          </el-button>
        </div>
        <div slot="main" class="main-list typt-list-container">
          <el-table ref="table" highlight-current-row stripe :row-key="getRowKeys" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" :data="table_data" style="width: 100%" height="100%">
            <el-table-column type="selection" width="50" align="center"></el-table-column>
            <!-- <el-table-column type="index" label="序号" width="70" align="center">
              <template slot-scope="scope">
                <span>{{(search_from.page - 1) *search_from.size + scope.$index + 1}}</span>
              </template>
            </el-table-column> -->
            <el-table-column prop="eduType" width="100" align="center" label="宣教类型">
              <template slot-scope="scope">
                <span>{{switchEduType[scope.row.eduType]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="eduName" show-overflow-tooltip min-width="180" label="宣教内容">
            </el-table-column>
            <el-table-column prop="eduTarget" width="100" label="宣教对象">
              <template slot-scope="scope">
                <span>{{switchEduTarget[scope.row.eduTarget]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="eduWay" width="100" label="宣教方式">
              <template slot-scope="scope">
                <span>{{switchEduWay[scope.row.eduWay]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="readState" width="100" label="阅读状态">
            </el-table-column>
            <el-table-column prop="createUser" width="100" label="创建者">
            </el-table-column>
            <el-table-column prop="createTime" width="110" align="center" label="创建时间">
              <template slot-scope="scope">
                {{scope.row.createTime.split(' ')[0]}}
                <br>
                {{scope.row.createTime.split(' ')[1]}}
              </template>
            </el-table-column>

            <el-table-column prop="commentMessage" width="120" label="效果评价">
            </el-table-column>
            <el-table-column prop="commentUser" width="100" label="评价者">
            </el-table-column>
            <el-table-column prop="commentTime" width="110" align="center" label="评价时间">
            </el-table-column>
            <el-table-column width="100" align="center" label="打卡详情">
              <template slot-scope="scope">
                <el-button @click="getDetails(scope.row)" type="text">查看
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="160" align="center">
              <template slot-scope="scope">
                <el-button @click="cancelEducation(scope.row)" type="text" v-if="scope.row.state === 1 && scope.row.isEnable === 1" :disabled="!actionUse">
                  撤回
                </el-button>
                <el-button @click="cancelEducation(scope.row)" type="text" :disabled="scope.row.state === 0 || scope.row.isEnable === 0" v-if="scope.row.state === 0 || scope.row.isEnable === 0 ">
                  <span style="color:#d1d2d3">撤回</span>
                </el-button>
                <el-button @click="eduView(scope.row)" type="text">预览
                </el-button>
                <el-button type="text" :disabled="scope.row.state === 1 && scope.row.isEnable === 1" v-if="scope.row.state === 1 && scope.row.isEnable === 1"> <span style="color:#d1d2d3">编辑</span>
                </el-button>
                <el-button @click="editEducation(scope.row)" type="text" :disabled="!actionUse" v-if="scope.row.state === 0 || (scope.row.state === 1 && scope.row.isEnable === 0)">编辑
                </el-button>
                <!--<el-button
                        type="text"
                        style="color:#F56C6C;"
                        :disabled="scope.row.state === 1 && scope.row.isEnable === 1"
                        v-if="scope.row.state === 1 && scope.row.isEnable === 1"
                > <span style="color:#d1d2d3">删除（已发布）</span>
                </el-button>-->
                <el-button type="text" :style="actionUse?'color:#F56C6C;':''" @click="deleteEducation(scope.row)" :disabled="!actionUse">删除
                  <!--v-if="scope.row.state === 0 || (scope.row.state === 1 && scope.row.isEnable === 0)"-->
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 分页 -->
        <div slot="footer" class="page-bar">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="search_from.page" :page-size="search_from.size" :page-sizes="[10,20,30,50,100]" layout="total, sizes, prev, pager, next, jumper" :total="page_total">
          </el-pagination>
        </div>
      </layout-list>
    </div>

    <template slot>
      <el-dialog class="content_window" title="效果评价" :visible.sync="evaluateDialogVisible" :close-on-click-modal=false :close-on-press-escape=false width="35%">
        <div>
          <el-form ref="content_form" label-width="80px" style="width: 60%;">
            <el-form-item label="效果评价">
              <el-checkbox-group v-model="content_form">
                <el-checkbox :label="item" v-for="(item,index) in ['口述理解', '会演示', '需强化']" :key="index">{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="评价者">
              <el-input v-model="valuator" readOnly></el-input>
            </el-form-item>
            <el-form-item label="评价时间">
              <el-input v-model="valuatorTime" readOnly></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="evaluateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="evaluateDo">确 定</el-button>
        </span>
      </el-dialog>
    </template>
    <el-dialog title="打卡详情" :visible.sync="dialogTableVisible" class="dialog-edu-detail">
      <el-table :data="detailsData" style="width: 100%;overflow: auto;max-height: 400px">
        <!-- <el-table-column property="" label="序号" align="center"  type="index"></el-table-column> -->
        <el-table-column property="" label="宣教打卡" align="center">
          <el-table-column property="medicalCareName" label="打卡人" align="center">
          </el-table-column>
          <el-table-column property="beginTime" label="打卡时间" align="center">
          </el-table-column>
        </el-table-column>
        <el-table-column property="" label="患者阅读" align="center">
          <el-table-column property="viewTotalSeconds" label="阅读时间（分钟）" align="center">
          </el-table-column>
          <el-table-column property="signItUrl" label="签字状态" align="center">
            <template slot-scope="scope">
              <span v-if="isAskToReadDetails === '2'">{{scope.row.readState}}</span>
              <!--<span v-if="isAskToReadDetails === '2'">{{scope.row.signItUrl === '' || scope.row.signItUrl === null ? '未签字' : '已签字'}}</span>-->
              <span v-else="isAskToReadDetails === '2'">无需签字</span>
            </template>
          </el-table-column>
          <el-table-column property="endTime" label="签字时间" align="center">
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-dialog>
    <div style="display: none">
      <div id="previewElement">
        <div style="border:1px solid #DCDFE6;padding: 10px;margin-top: 20px;min-height: 100px;">
          <div style="text-align: center;font-weight: bold;font-size: 20px;">{{articleDetails.title}}</div>
          <div>
            <section v-if="articleDetails.contentText !== ''" v-html='articleDetails.contentText'></section>
            <section v-else-if="articleDetails.images.length > 0" class="images-detail">
              <div v-for="(item,index) of articleDetails.images" :key="index">
                <img style="width:100%;margin: 10px auto;" :src="item" alt="">
              </div>
            </section>
          </div>
        </div>
        <div style="padding: 10px;background: #E0EFFF;display: flex;justify-content: space-around">
          <div>
            <label>患者签字&nbsp;&nbsp;&nbsp;</label>
            <div style="width: 100px;height: 50px">
              <img :src="articleDetails.signItUrl" v-if="articleDetails.signItUrl !== ''" style="width:100%;height:100%">
            </div>
          </div>
          <div>
            <label>签字时间&nbsp;&nbsp;&nbsp;</label>
            <span>{{articleDetails.endTime}}</span>
          </div>
        </div>
      </div>
    </div>
    <div style="display: none">
      <!--<print-template :printData="printData" id="myHtmlElement"></print-template>-->
      <section ref="print" id="myHtmlElement">
        <div style="text-align: center;">
          宣教记录
        </div>
        <div>
          <label style="padding-left:10px">姓名：</label><span>{{patient.patientName}}</span>
          <label style="padding-left:10px">性别：</label><span>{{patient.sex}}</span>
          <label style="padding-left:10px">年龄：</label><span>{{patient.patientAge}}</span>
          <label style="padding-left:10px">床号：</label><span>{{patient.bedName}}</span>
          <label style="padding-left:10px">科室：</label><span>{{patient.deptName}}</span>
          <label style="padding-left:20px">住院号：</label><span>{{patient.inpNo}}</span>
        </div>
        <table>
          <tr>
            <th>宣教类型</th>
            <th>计划宣教时间</th>
            <th>宣教内容</th>
            <th>宣教对象</th>
            <th>宣教方式</th>
            <th>创建者</th>
            <th>创建时间</th>
            <th>效果评价</th>
            <th>评价者</th>
            <th>评价时间</th>
          </tr>
          <tr v-for="(item,index) in printData" :key="index">
            <td>{{item.eduType}}</td>
            <td>{{item.sentTime}}</td>
            <td>{{item.eduName}}</td>
            <td>{{item.eduTarget}}</td>
            <td>{{item.eduWay}}</td>
            <td>{{item.createUser}}</td>
            <td>{{item.createTime}}</td>
            <td>{{item.commentMessage}}</td>
            <td>{{item.commentUser}}</td>
            <td>{{item.commentTime}}</td>
          </tr>
        </table>
      </section>
    </div>
    <el-dialog title="预览健康宣教" :visible.sync="articleVisible" class="dialog-yulan">
      <div>
        <div style="text-align: right">
          <el-button type="primary" size="small" @click="printView()">打印
          </el-button>
          <!--<el-button type="primary" size="small" @click="printView()" :disabled="!actionUse"-->
          <!--&gt;打印-->
          <!--</el-button>-->
        </div>
        <div style="border:1px solid #DCDFE6;padding: 10px;margin-top: 20px;min-height: 100px;overflow: auto">
          <div style="text-align: center;font-weight: bold;font-size: 20px;">{{articleDetails.title}}</div>
          <div class="article-details">
            <section v-if="articleDetails.contentText !== ''" v-html='articleDetails.contentText'></section>
            <section v-else-if="articleDetails.images.length > 0" class="images-detail">
              <div v-for="(item,index) of articleDetails.images" :key="index">
                <img style="width:100%;margin: 10px auto;" :src="item" alt="">
              </div>
            </section>
          </div>
        </div>
        <div style="padding: 10px;background: #E0EFFF;display: flex;justify-content: space-around">
          <div>
            <label>患者签字&nbsp;&nbsp;&nbsp;</label>
            <div style="width:100px;height: 50px">
              <img :src="articleDetails.signItUrl" v-if="articleDetails.signItUrl !== ''" style="height: 100%;width:100%;">
            </div>
          </div>
          <div>
            <label>签字时间&nbsp;&nbsp;&nbsp;</label>
            <span>{{articleDetails.endTime}}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </layout-aside>
</template>

<script>
import moment from "moment";
import PatientList from "./PatientList";
import layoutAside from "./layout/aside";
import layoutList from "./layout/list";
import PrintTemplate from "./layout/PrintTemplate";
// import { Print } from './layout/print'
// import { ApiEducationList, ApiUser } from '../../../api/nrms'
import printJS from "print-js";
import {
  addEduRecord,
  getEduRecord,
  recordDetails,
  delEduRecord,
  editEduRecord,
  recordState,
  addEduComment,
  getEdArticleDetails,
  isExit,
} from "@/api/hpms/eduCation/situation";
export default {
  name: "education_list_nrms",
  data() {
    return {
      actionUse: true, // 操作按钮是否可用
      loading: false,
      table_height: "500px",
      table_index: 0,
      page_total: 0,
      table_data: [],
      detailsData: [],
      printData: [],
      dialogTableVisible: false,
      dialogPrintVisible: false,
      articleVisible: false,
      // 患者信息
      patient: {},
      // 查询表单
      switchEduType: {
        1: "入院宣教 ",
        2: "住院宣教",
        3: "出院宣教",
      },
      switchEduTarget: {
        1: "患者 ",
        2: "家属",
        3: "陪护",
        "1,2": "患者，家属 ",
        "2,1": "患者，家属 ",
        "1,3": "患者，陪护",
        "3,1": "患者，陪护",
        "2,3": "家属，陪护",
        "3,2": "家属，陪护",
        "1,2,3": "患者，家属，陪护 ",
        "1,3,2": "患者，家属，陪护",
        "2,3,1": "患者，家属，陪护",
        "2,1,3": "患者，家属，陪护",
        "3,1,2": "患者，家属，陪护",
        "3,2,1": "患者，家属，陪护",
      },
      switchEduWay: {
        1: "口述",
        2: "演示",
        3: "书面",
        "1,2": "口述，演示",
        "2,1": "口述，演示",
        "1,3": "口述，书面",
        "3,1": "口述，书面",
        "2,3": "演示，书面",
        "3,2": "演示，书面",
        "1,2,3": "口述，演示，书面",
        "1,3,2": "口述，演示，书面",
        "2,3,1": "口述，演示，书面",
        "2,1,3": "口述，演示，书面",
        "3,1,2": "口述，演示，书面",
        "3,2,1": "口述，演示，书面",
      },
      search_from: {
        deptId: "",
        patientId: "",
        eduName: "", // 宣教内容
        startTime: "",
        endTime: "",
        educationProject: "",
        creater: "", // 创建者
        size: 10,
        page: 1,
      },
      multipleSelection: [],
      empName: "",
      evaluateDialogVisible: false,
      content_form: [],
      valuator: "",
      valuatorTime: "",
      articleDetails: {
        title: "标题", // 标题
        contentText: "内容", // 内容
        signItUrl: "",
        endTime: "",
        images: [],
      },
      isAskToReadDetails: "",
    };
  },
  computed: {},
  mounted() {
    this.getEduRecordPrint();
  },
  created() {
    // 初始化
    try {
      let deptInfo = JSON.parse(localStorage.getItem("deptInfo")) || {};
      let empInfo = JSON.parse(localStorage.getItem("empInfo")) || {};

      this.search_from.deptId = deptInfo.deptId;
      this.empName = empInfo["empName"];
      this.valuator = JSON.parse(localStorage.getItem("empInfo")).empName;
    } catch (e) {
      console.log("有错误！！！！！！", e);
    }
  },
  activated() {
    this.search_from.patientId && this.getData();
  },
  updated() {
    this.$nextTick(function () {
      this.$refs.table.doLayout();
    });
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (row.readState == "未阅读") {
        return "table-background";
      }
      return "";
    },
    // 患者类型更换
    activeNameChange(activeName) {
      if (activeName === "in") {
        this.actionUse = true;
      } else {
        this.actionUse = false;
      }
    },
    initPatient(patient, type) {
      console.log("病患切换：", patient, type);
      this.patient = patient;
      if (type === 2) {
        if (patient.outHospitalFlag === 1) this.actionUse = true;
        else this.actionUse = false;
      }

      this.$set(this.patient, "patientType", type);
      this.search_from.patientId = patient.patientId;
      this.getData();
      this.getEduRecordPrint();
    },
    getData() {
      this.loading = true;
      getEduRecord({
        beginTime: this.search_from.startTime,
        endTime: this.search_from.endTime,
        patientId: this.search_from.patientId,
        nurseUnitId: JSON.parse(localStorage.getItem("selectDeptInfo")).deptId,
        page: this.search_from.page,
        size: this.search_from.size,
        createUser: this.search_from.creater, // 创建者
        eduName: this.search_from.eduName, // 宣教内容
      }).then((res) => {
        let list = res.data.list;
        this.table_data = list;
        this.page_total = res.data.total;
        this.loading = false;
      });
    },
    addEducation() {
      if (!this.patient.patientId) {
        this.$message.warning("请先选择患者！");
        return false;
      }
      this.$emit("option-changed", "add", this.patient, {});
    },
    editEducation(data) {
      isExit({ edArticleSendId: data.id })
        .then((res) => {
          if (res.status === 200) {
            this.$emit("option-changed", "add", this.patient, data);
          } else {
            // this.$message.warning(res.desc)
          }
        })
        .catch((res) => {
          // this.$message.error(res.desc)
        });
    },
    // 宣教预览
    eduView(row) {
      getEdArticleDetails(row.eduId)
        .then((res) => {
          if (res.status === 200) {
            console.log("查询文章内容：", res.data);
            let contentText = res.data.contentText;
            if (res.data.contentText === "" && res.data.images !== null) {
              let images = res.data.images.split(",");
              this.articleDetails.images = images;
            }
            this.articleDetails.title = res.data.title;
            this.articleDetails.contentText = contentText;
            if (res.data.isDone === 0) {
              setTimeout(() => {
                this.getDetailsImages(row.eduId);
              }, 1000 * 5);
            }
            recordState({
              articleId: row.eduId,
              patientId: this.search_from.patientId,
              sendId: row.id,
            })
              .then((res) => {
                console.log("宣教操作记录：", res);
                if (res.status === 200) {
                  if (res.data && res.data.length > 0) {
                    for (let i of res.data) {
                      if (i.signItUrl) {
                        this.articleDetails.signItUrl = i.signItUrl;
                        this.articleDetails.endTime = i.endTime;
                        break;
                      } else {
                        this.articleDetails.signItUrl = "";
                        this.articleDetails.endTime = "";
                      }
                    }
                  } else {
                    this.articleDetails.signItUrl = "";
                    this.articleDetails.endTime = "";
                  }
                  this.articleVisible = true;
                } else {
                  this.$message.warning(res.desc);
                }
              })
              .catch((error) => {
                this.$message.error(error.message);
              });
          }
        })
        .catch((res) => {
          this.$message.error(res.message);
        });
    },
    /**
     * 图片未解析完成，需要继续获取图片
     * */
    getDetailsImages(id) {
      getEdArticleDetails(id)
        .then((res) => {
          if (res.status === 200) {
            console.log("查询的文章内容---图片：", res.data);
            // 手动输入的文字
            let images = [];
            if (res.data.contentText === "" && res.data.images !== null)
              images = res.data.images.split(",");
            if (images.length > this.articleDetails.images.length) {
              this.articleDetails.images = [...images]; // 图片
            }
            if (res.data.isDone === 0) {
              setTimeout(() => {
                this.getDetailsImages(id);
              }, 1000 * 5);
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // 撤回
    cancelEducation(row) {
      this.$confirm("确定要撤回吗?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          editEduRecord({
            isEnable: "0",
            id: row.id,
          })
            .then((res) => {
              if (res.status === 200) {
                this.$message.success("撤回成功！");
                this.getData();
              } else {
                this.$message.warning(res.desc);
              }
            })
            .catch((res) => {
              this.$message.error(res.message);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤回",
          });
        });
    },
    deleteEducation(row) {
      this.$confirm("是否确定删除？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        console.log(row.state);
        // 已发布的，先撤回
        if (row.state === 1) {
          editEduRecord({
            isEnable: "0",
            id: row.id,
          })
            .then((res) => {
              if (res.status === 200) {
                delEduRecord(row.id)
                  .then((res2) => {
                    if (res2.status === 200) {
                      this.$message.success("删除成功！");
                      console.log(res2);
                      this.getData();
                    } else {
                      this.$message.warning(res2.desc);
                    }
                  })
                  .catch((res) => {
                    this.$message.error(res.message);
                  });
              } else {
                this.$message.warning(res.desc);
              }
            })
            .catch((res) => {
              this.$message.error(res.message);
            });
        } else {
          delEduRecord(row.id)
            .then((res) => {
              if (res.status === 200) {
                this.$message.success("删除成功！");
                console.log(res);
                this.getData();
              } else {
                this.$message.warning(res.desc);
              }
            })
            .catch((res) => {
              this.$message.error(res.message);
            });
        }
      });
    },
    // 查看详情
    getDetails(row) {
      this.isAskToReadDetails = row.isAskToRead;
      recordState({
        sendId: row.id,
        articleId: row.eduId,
        patientId: this.search_from.patientId,
      })
        .then((res) => {
          // for (let i of res.data) {
          //   i.createUser = row.createUser
          // }
          if (res.status === 200) {
            this.detailsData = res.data.filter((v) => v.medicalCareId);
            this.dialogTableVisible = true;
            console.log(this.detailsData);
          } else {
            this.$message.warning(res.desc);
          }
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
    },
    evaluate() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要评价的宣教！");
        return false;
      }
      // 获取打开当前窗口的时间
      this.valuatorTime = moment().format("YYYY-MM-DD HH:mm:ss");
      this.evaluateDialogVisible = true;
    },
    evaluateDo() {
      if (this.content_form.length === 0) {
        this.$message.warning("请选择评价内容！");
        return false;
      }
      let recordIdList = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        recordIdList.push(this.multipleSelection[i].id);
      }
      recordIdList = recordIdList.join(",");
      addEduComment({
        ids: recordIdList,
        commentMessage: this.content_form.join(","),
        commentUser: JSON.parse(localStorage.getItem("empInfo")).empName,
        commentUserId: localStorage.getItem("userId"),
      })
        .then((res) => {
          this.$message.success("评价成功！");
          this.evaluateDialogVisible = false;
          this.content_form = [];
          this.getData();
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
      // ApiEducationList.evaluate({
      //   recordIdList: recordIdList,
      //   evaluateEffect: this.content_form.join(','),
      //   evaluateUser: this.empName,
      //   evaluateTime: moment().format('YYYY-MM-DD HH:mm:ss')
      // })
      //   .then(() => {
      //     this.evaluateDialogVisible = false
      //     this.content_form = []
      //     this.$message.success('评价成功！')
      //     this.getData()
      //   })
      //   .catch(res => {
      //     this.$message.error(res.message)
      //   })
    },
    // 获取记录
    getEduRecordPrint() {
      this.loading = true;
      getEduRecord({
        // page:1,
        // size:99999999,
        patientId: this.search_from.patientId,
        nurseUnitId: JSON.parse(localStorage.getItem("selectDeptInfo")).deptId,
        createUser: this.search_from.creater, // 创建者
        eduName: this.search_from.eduName, // 宣教内容
      }).then((res) => {
        this.printData = [];
        for (let i of res.data) {
          let strEduType = "";
          let strEduTarget = "";
          let strEduWay = "";

          if (i.eduTarget.indexOf("1") !== -1) {
            strEduTarget = strEduTarget + `患者，`;
          }
          if (i.eduTarget.indexOf("2") !== -1) {
            strEduTarget = strEduTarget + `家属，`;
          }
          if (i.eduTarget.indexOf("3") !== -1) {
            strEduTarget = strEduTarget + `陪护，`;
          }
          i.eduTarget = strEduTarget.substr(0, strEduTarget.length - 1);
          if (i.eduWay.indexOf("1") !== -1) {
            strEduWay = strEduWay + `口述，`;
          }
          if (i.eduWay.indexOf("2") !== -1) {
            strEduWay = strEduWay + `演示，`;
          }
          if (i.eduWay.indexOf("3") !== -1) {
            strEduWay = strEduWay + `书面，`;
          }
          i.eduWay = strEduWay.substr(0, strEduTarget.length - 1);

          if (i.eduType === 1) {
            strEduType = "入院宣教";
          } else if (i.eduType === 2) {
            strEduType = "住院宣教";
          } else if (i.eduType === 3) {
            strEduType = "出院宣教";
          }
          i.eduType = strEduType;
        }
        this.printData = res.data;
        this.loading = false;
      });
    },
    printing() {
      // this.dialogPrintVisible = true
      // 获取宣教列表
      this.loading = true;
      getEduRecord({
        // page:1,
        // size:99999999,
        patientId: this.search_from.patientId,
        nurseUnitId: JSON.parse(localStorage.getItem("selectDeptInfo")).deptId,
        createUser: this.search_from.creater, // 创建者
        eduName: this.search_from.eduName, // 宣教内容
      }).then((res) => {
        this.printData = [];
        for (let i of res.data) {
          let strEduType = "";
          let strEduTarget = "";
          let strEduWay = "";

          if (i.eduTarget && i.eduTarget.indexOf("1") !== -1) {
            strEduTarget = strEduTarget + `患者，`;
          }
          if (i.eduTarget && i.eduTarget.indexOf("2") !== -1) {
            strEduTarget = strEduTarget + `家属，`;
          }
          if (i.eduTarget && i.eduTarget.indexOf("3") !== -1) {
            strEduTarget = strEduTarget + `陪护，`;
          }
          i.eduTarget = strEduTarget.substr(0, strEduTarget.length - 1);
          if (i.eduWay && i.eduWay.indexOf("1") !== -1) {
            strEduWay = strEduWay + `口述，`;
          }
          if (i.eduWay && i.eduWay.indexOf("2") !== -1) {
            strEduWay = strEduWay + `演示，`;
          }
          if (i.eduWay && i.eduWay.indexOf("3") !== -1) {
            strEduWay = strEduWay + `书面，`;
          }
          i.eduWay = strEduWay.substr(0, strEduTarget.length - 1);

          if (i.eduType === 1) {
            strEduType = "入院宣教";
          } else if (i.eduType === 2) {
            strEduType = "住院宣教";
          } else if (i.eduType === 3) {
            strEduType = "出院宣教";
          }
          i.eduType = strEduType;
        }
        this.printData = res.data;
        this.loading = false;
        const styleStr = `
           @media print{@page {size:landscape}}
           table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 0 auto;
                  text-align: center;
                }

            table tr th{
                border: 1px solid #cad9ea;
                color: #666;
                height: 30px;
            }
            table tr td{
                border: 1px solid #cad9ea;
                color: #666;
                height: 30px;
            }`;
        /* const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          }) */
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          // loading.close()
          printJS({
            printable: "myHtmlElement",
            type: "html",
            scanStyles: false,
            style: styleStr,
            // css: './print.css',//static 目录下
            targetStyle: ["*"],
          });
        }, 2000);
      });
    },
    printView() {
      printJS({
        printable: "previewElement",
        type: "html",
        scanStyles: false,
        // css: './print.css',//static 目录下
        targetStyle: ["*"],
      });
    },
    searchForm() {
      this.handleCurrentChange(1);
    },
    resetForm() {
      // this.$refs.search_form.resetFields() ?
      this.search_from = {
        patientId: this.search_from.patientId,
        nurseUnitId: JSON.parse(localStorage.getItem("selectDeptInfo")).deptId,
        eduName: "", // 宣教内容
        startTime: "",
        endTime: "",
        creater: "", // 创建者
        size: 10,
        page: 1,
      };
      this.handleCurrentChange(1);
    },
    handleSizeChange(val) {
      this.search_from.page = 1;
      this.search_from.size = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.search_from.page = val;
      this.getData();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getRowKeys(row) {
      return row.recordId;
    },
  },
  components: {
    PatientList,
    layoutAside,
    layoutList,
    PrintTemplate,
  },
};
</script>

<style lang="scss" type="text/scss" scoped>
@import "./self_common.scss";
</style>
<style lang="scss">
.dialog-yulan {
  .el-dialog {
    .el-dialog__body {
      overflow: auto !important;
      .article-details {
        .images-detail {
          width: 100%;
          overflow: hidden;
          > div {
            width: 100%;
            margin: 15px 0;
            img {
              width: 100%;
            }
          }
        }

        ol {
          list-style: decimal;
          padding-left: 35px;
          li {
            list-style: decimal;
          }
        }
        ul {
          list-style: disc;
          padding-left: 35px;
          li {
            list-style: disc;
          }
        }

        > p {
          color: #333333;
          white-space: pre-wrap;
          img {
            margin: auto;
            display: block;
            float: none !important;
          }
        }

        .ql-indent-1:not(.ql-direction-rtl) {
          text-indent: 2em;
          padding-left: 0;
        }
        .ql-indent-2:not(.ql-direction-rtl) {
          text-indent: 4em;
          padding-left: 0;
        }
        .ql-indent-3:not(.ql-direction-rtl) {
          text-indent: 6em;
          padding-left: 0;
        }
        .ql-indent-4:not(.ql-direction-rtl) {
          text-indent: 8em;
          padding-left: 0;
        }
        .ql-indent-5:not(.ql-direction-rtl) {
          text-indent: 10em;
          padding-left: 0;
        }
        .ql-indent-6:not(.ql-direction-rtl) {
          text-indent: 12em;
          padding-left: 0;
        }
        .ql-indent-7:not(.ql-direction-rtl) {
          text-indent: 14em;
          padding-left: 0;
        }
        .ql-indent-8:not(.ql-direction-rtl) {
          text-indent: 16em;
          padding-left: 0;
        }

        .ql-align-center {
          text-align: center;
          text-indent: 0 !important;
        }
      }
    }
  }
}
.dialog-edu-detail {
  .el-dialog__body {
    padding: 30px 20px !important;
  }
}
.el-table .table-background {
  color: #ff0000;
}
</style>
