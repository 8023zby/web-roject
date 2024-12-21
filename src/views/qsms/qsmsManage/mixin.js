import getStorageUser from '@/assets/qsms/utils/storageUser'
import {
  fetchQsmsList,
  addQsms,
  editQsms,
  putQsmsState
} from '@/api/qsms/qsmsManage/qsmsManage'

import {
  fetchQuestionLibrary,
  addQuestionLibrary,
  editQuestionLibrary
} from '@/api/qsms/qsmsManage/questionLibraryManage'

import { selectDeptInfo } from '@/assets/qsms/utils/common'
import { ApiExportExcel, ApiCheckExcel } from '@/api/qsms/qsmsManage/qsmsExcel'
import { getOneDate } from '@/assets/qsms/utils/dateFormat'

// 问题原始数据结构
const addFormOriginData = {
  title: '',
  required: 0,
  questionType: 1,
  optionsDoList: [
    {
      sortIndex: 'A',
      content: '',
      score: 0
    },
    {
      sortIndex: 'B',
      content: '',
      score: 0
    }
  ]
}

export default {
  data () {
    return {
      // 验证方法
      rules: {
        startTime: [
          { required: true, message: '请输入开始日期', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请输入结束日期', trigger: 'blur' }
        ],
        nurseUnitIds: [
          {
            required: true,
            message: '请选择护理单元',
            trigger: 'change'
          }
        ],
        title: [
          {
            required: true,
            message: '请输入标题',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 64,
            message: '请输入64位以内',
            trigger: 'blur'
          }
        ]
      },
      // 开关颜色 [激活]
      switchActiveColor: '#1e88e9',
      // 按钮是否禁用
      isBtnDisabled: false,
      // Loading 状态
      loadingState: false,
      // 弹窗是否显示
      isDialogVisible: false,
      // 题库列表是否显示
      isDrawerVisible: false,
      // 状态列表
      state: [
        {
          label: '全部',
          value: null
        },
        {
          label: '启用',
          value: 1
        },
        {
          label: '停用',
          value: 0
        }
      ],
      // 题目类型
      questionTypeList: [
        {
          label: '单选题',
          value: 0
        },
        {
          label: '多选题',
          value: 1
        },
        {
          label: '简答题',
          value: 2
        },
        {
          label: '单选评分题',
          value: 3
        },
        {
          label: '多选评分题',
          value: 4
        },
        {
          label: '段落说明',
          value: 5
        }
      ],
      // 当前页码
      page: 1,
      // 每页数量
      size: 10,
      // 当前页码
      currPage: 1,
      // 问卷序号
      qsmsSortIndex: null,
      // addForm
      addForm: this.deepClone(addFormOriginData),
      // 护理单元列表
      nurseUnitList: {},
      // 全部护理单元
      allDeptList: {},
      QuestionnaireDialog: false, // 导出问卷表弹窗
      QuestionnaireForm: {
        paperId: '',
        startTime: '',
        endTime: ''
      },
      alertDialog: false
    }
  },
  mounted () {
    // 获取当前用户的
    this.nurseUnitList = getStorageUser('dataDeptInfoList')
  },
  computed: {
    // 登录用户的所有护理单元 ID 字符串
    nurseUnitIdString () {
      return getStorageUser('dataDeptInfoList').map(item => item.deptId)
    },
    // 监听是否为评分题目
    addForm_isScore () {
      return this.addForm.questionType === 3 || this.addForm.questionType === 4
    },
    formContent_isScore () {
      return (
        this.formContent.questionList.questionType === 3 ||
        this.formContent.questionList.questionType === 4
      )
    },
    // 监听是否为简答类题目
    addForm_isShortAnswer () {
      return this.addForm.questionType === 2 || this.addForm.questionType === 5
    }
  },
  methods: {
    //  导出答卷表
    exportExcel (paperId) {
      this.QuestionnaireForm.paperId = paperId
      this.QuestionnaireDialog = true

      this.$nextTick(() => {
        const timeVal = getOneDate('month', this.nums)
        this.QuestionnaireForm.endTime = timeVal[1]
        this.QuestionnaireForm.startTime = timeVal[0]
      })
    },
    close () {
      this.QuestionnaireDialog = false
      this.$refs['QuestionnaireForm'].resetFields()
    },
    confirm () {
      this.$refs['QuestionnaireForm'].validate((valid) => {
        if (valid) {
          if ((new Date(this.QuestionnaireForm.startTime.replace(/\-/g, '\/'))) > (new Date(this.QuestionnaireForm.endTime.replace(/\-/g, '\/')))) {
            this.$message.error('开始时间不能晚于结束时间！')
            return false
          }

          this.QuestionnaireDialog = false
          this.alertDialog = true
          ApiExportExcel(this.QuestionnaireForm).then(res => {
            this.fileName = res.data || ''
            this.checkExcel()
          }).catch((res) => {
            this.QuestionnaireDialog = true
            this.alertDialog = false
          })
        } else {
          return false
        }
      })
    },
    checkExcel () {
      // 加上入参：时间戳 防止从浏览器缓存中取文件
      ApiCheckExcel({ 'fileName': this.fileName }).then(res => {
        let data = res.data
        if (data.status) {
          // true 说明服务器上查到了此文件
          this.alertDialog = false
          this.QuestionnaireDialog = false
          if (data.url) {
            window.open(data.url)
          } else {
            this.$message.error('EXCEL文件不存在')
          }
        } else {
          setTimeout(() => {
            this.checkExcel()
          }, 1000)
        }
      }).catch(() => {
        this.alertDialog = false
      })
    },
    // 深拷贝方法
    deepClone (obj) {
      const _obj = JSON.stringify(obj)
      const objClone = JSON.parse(_obj)
      return objClone
    },
    // 生成大写字母  A的Unicode值为65
    // index: 根据下标获取指定序号
    lowerLetter (index = '') {
      var str = []
      if (this.addForm.optionsDoList.length <= 26) {
        for (var i = 65; i < 91; i++) {
          str.push(String.fromCharCode(i))
        }
      } else {
        for (var i = 1; i < 101; i++) {
          let ii = i
          if (ii < 10) ii = '0' + ii
          str.push(ii)
        }
      }

      return index !== '' ? str[index] : str
    },
    // 动态生成序号

    // 题目类型转中文
    translateQuestionType (e) {
      return this.questionTypeList[e]
    },
    // 显示抽屉
    showPanel () {
      this.isDrawerVisible = !this.isDrawerVisible
    },
    /* 清楚查询条件 */
    handleReset (formName) {
      this.$refs[formName].resetFields()
    },
    // 显示手动添加问题
    openDialog (type, data) {
      this.isDialogVisible = true
      this.questionDialogType = type

      if (type === 'edit') {
        this.dialogTile = '编辑问题'
        if (data) {
          this.qsmsSortIndex = data.index
          this.addForm.title = data.item.title
          this.addForm.required = data.item.required
          this.addForm.questionType = data.item.questionType
          this.addForm.optionsDoList = data.item.optionsDoList
          this.addForm.logicId = data.item.logicId
          if (
            this.addForm.questionType === 3 ||
            this.addForm.questionType === 4
          ) {
            this.addQsTypeClass = 'addQsTypeClass-hassort'
          } else {
            this.addQsTypeClass = 'addQsTypeClass-nosort'
          }

          if (
            this.addForm.questionType === 0 ||
            this.addForm.questionType === 1
          ) {
            this.addQuestionClass = 'addQuestion-ow'
          } else {
            this.addQuestionClass = ''
          }
        }
      } else {
        this.dialogTile = '新建问题'
        if (data && data.index) {
          this.addIndex = data.index
        } else {
          this.addIndex = ''
        }
        this.addForm.questionType = 0
        this.addQsTypeClass = 'addQsTypeClass-nosort'
        this.addQuestionClass = 'addQuestion-ow'
        this.addForm.logicId = this.GenNonDuplicateID()
      }
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
    },
    // 隐藏手动添加问题弹窗
    hideDialog () {
      this.isDialogVisible = false
      this.addForm = {
        title: '',
        required: 0,
        questionType: 1,
        optionsDoList: [
          {
            sortIndex: 'A',
            content: '',
            score: 0
          },
          {
            sortIndex: 'B',
            content: '',
            score: 0
          }
        ]
      }
    },
    // 清空手动添加问题弹窗
    clearDialog () {
      this.addForm = this.deepClone(addFormOriginData)
    },
    // 手动添加题目
    addQuestion (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isDialogVisible = false
          if (this.addIndex !== '') {
            // 在指定位置添加元素,第一个参数指定位置,第二个参数指定要删除的元素,如果为0,则追加
            this.formContent.questionsDoList.splice(
              this.addIndex + 1,
              0,
              this.deepClone(this.addForm)
            )
          } else {
            this.formContent.questionsDoList.push(this.deepClone(this.addForm))
          }
          this.dealQueSort()
        } else {
          return false
        }
      })
    },
    // 手动编辑题目
    editQuestion (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.isDialogVisible = false
          this.formContent.questionsDoList[this.qsmsSortIndex] = this.deepClone(
            this.addForm
          )
          this.dealQueSort()
        } else {
          return false
        }
      })
    },
    // 删除选项
    delOption (item) {
      var index = this.addForm.optionsDoList.indexOf(item)
      if (index !== -1) {
        this.addForm.optionsDoList.splice(index, 1)
      }

      // 动态生成选项序号
      this.addForm.optionsDoList.forEach((val, i) => {
        val.sortIndex = this.lowerLetter(i)
      })
    },
    /**
     * @description: 添加逻辑
     * @param {*} index
     * @param {*} data
     */
    openLogicDialog (index, data) {
      this.displayLogicShow = true
      // 当前打开的题目id
      this.selectLogicQid = data.logicId
      // 取当前题目前面的题目数据
      this.displayLogicQuestion = this.formContent.questionsDoList.filter(
        (ele, i) => i < index && ele.questionType !== 5
      )

      // 没有显示逻辑数据时初始化对象
      if (!this.displayLogicData[data.logicId]) {
        this.selectLogicData = {
          condition: '1',
          options: [this.getSelectItemData()]
        }
      } else {
        this.selectLogicData = JSON.parse(JSON.stringify(this.displayLogicData[data.logicId]))

        this.selectLogicData.options.forEach(ele => {
          this.displayLogicQuestion.forEach(val => {
            if (ele.question === val.logicId) {
              ele.optionList = val.optionsDoList
              ele.conditionList = this.getSelectItemConditionData(data.questionType)
            }
          })
        })
      }
    },
    /**
     * @description: 显示逻辑默认数据
     */
    getSelectItemData () {
      return {
        question: '',
        condition: '',
        option: '',
        optionList: [],
        conditionList: this.getSelectItemConditionData()
      }
    },
    /**
     * @description: 显示逻辑关系，2，5只有显示
     * @param {*} type
     * @return {*}
     */
    getSelectItemConditionData (type = 1) {
      let a = []
      if ([5].includes(type)) {
        a = [{ value: '1', label: '显示' }]
      } else {
        a = [
          { value: '1', label: '显示' },
          { value: '2', label: '选中' }
        ]
      }
      return a
    },
    /**
     * @description: 获取随机数
     */
    GenNonDuplicateID () {
      let str = Math.random().toString(36).substr(3)
      str += Date.now().toString(16).substr(4)
      return str
    },
    /**
     * @description: 关闭显示逻辑弹窗
     */
    closeDisplayLogicDialog () {
      this.displayLogicShow = false
    },
    /**
     * @description: 保存显示逻辑
     */
    saveDisplayLogic () {
      if (this.selectLogicData.options.length === 0) {
        this.$message.warning(`请至少填写一条显示逻辑`)
        return
      }
      // 条件不完善时无法保存
      for (let i in this.selectLogicData.options) {
        let ele = this.selectLogicData.options[i]
        if (!ele.question || !ele.condition || (ele.condition === '2' && !ele.option)) {
          this.$message.warning(`第${parseInt(i) + 1}个条件填写不完整`)
          return
        }
      }
      // 没有逻辑时直接删除
      if (this.selectLogicData.options.length === 0) {
        delete this.displayLogicData[this.selectLogicQid]
      } else {
        // 将当前题目的显示逻辑保存到对象中
        this.displayLogicData[this.selectLogicQid] = this.selectLogicData
      }
      this.displayLogicShow = false
    },
    /**
     * @description: 删除显示逻辑选项
     * @param {*} index
     */
    deleteDisplayLogicItem (index) {
      this.selectLogicData.options.splice(index, 1)
    },
    /**
     * @description: 增加显示逻辑选项
     */
    addDisplayLogicItem () {
      let data = this.selectLogicData.options
      this.$set(data, data.length, this.getSelectItemData())
    },
    /**
     * @description: 切换显示逻辑里的题目
     * @param {*} item
     * @param {*} i
     */
    logicQuestionChange (item, i) {
      // 选项
      let optionFirst = this.displayLogicQuestion.filter(ele => ele.logicId === item.question)
      item.optionList = optionFirst[0].optionsDoList
      item.conditionList = this.getSelectItemConditionData(optionFirst[0].questionType)
    },
    // 删除题目
    delQuestion (index, item) {
      // DONE:删除题目后同步删除显示逻辑
      delete this.displayLogicData[item.logicId]
      Object.values(this.displayLogicData).forEach(ele => {
        ele.options = ele.options.filter(val => val.question !== item.logicId)
      })
      if (index !== -1) {
        this.formContent.questionsDoList.splice(index, 1)
        this.dealQueSort()
      }
    },
    // 获取题目序号
    dealQueSort () {
      let sort = 0
      for (let v of this.formContent.questionsDoList) {
        if (v.questionType !== 5) {
          sort++
          v.sort = sort
          // 第一题删除显示逻辑
          if (sort === 1 && this.displayLogicData[v.logicId]) {
            delete this.displayLogicData[v.logicId]
          }
        } else {
          v.sort = ''
        }
      }
    },
    // 添加选项
    addOption () {
      // 增加数据
      this.addForm.optionsDoList.push({
        content: '',
        sortIndex: this.lowerLetter(this.addForm.optionsDoList.length)
      })
    },

    /**
     * @获取问卷列表
     * @param {Integer: page} 页面，默认为1
     * @param {Integer: size} 条数，默认为10
     * @param {String: nurseUnitId} 护理单元id(多个,逗号拼接)
     * @param {String: title} 问卷标题
     * @param {Integer: paperState} 问卷状态，0 不可用 1 可用
     * @description 获取问卷列表
     */
    getData (param) {
      fetchQsmsList({
        page: this.page,
        size: this.size,
        ...param
      }).then(response => {
        this.tableData = response.data
      })
    },

    // 搜索
    query () {
      this.page = 1
      this.currPage = 1
      this.initPagination(this.pagination)
      this.executeQueryPage()
    },

    /**
     * @添加问卷
     * @param {String: nurseUnitIds} 护理单元id，数组
     * @param {String: title} 问卷标题
     * @param {String: remark} 页备注信息
     * @description
     */
    saveData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.formContent.questionsDoList.length === 0) {
            this.$message({
              type: 'warning',
              message: '请添加题目！'
            })
          } else {
            this.yh_loading = true
            this.formAssignLogicData()
            addQsms(this.formContent).then(response => {
              if (response.status === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                this.yh_loading = false
                this.$emit('option-changed', 'list')
                this.getData(this.search)
              } else {
                this.yh_loading = false
                this.$message({
                  type: 'error',
                  message: response.desc
                })
              }
            }).catch(e => {
              console.log(e, '返回错误--')
              this.yh_loading = false
            })
          }
        } else {
          return false
        }
      })
    },

    /**
     * @编辑问卷
     * @param {String: nurseUnitIds} 护理单元id，数组
     * @param {String: title} 问卷标题
     * @param {String: remark} 页备注信息
     * @description
     */
    editData (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.formContent.questionsDoList.length === 0) {
            this.$message({
              type: 'warning',
              message: '请添加题目！'
            })
          } else {
            this.yh_loading = true
            this.formAssignLogicData()
            editQsms(this.formContent).then(response => {
              if (response.status === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                this.yh_loading = false
                this.$emit('option-changed', 'list')
                this.getData(this.search)
              } else {
                this.$message({
                  type: 'error',
                  message: response.desc
                })
              }
            }).catch(e => {
              console.log(e, '返回错误--')
              this.yh_loading = false
            })
          }
        } else {
          return false
        }
      })
    },
    // 给题目添加显示逻辑ID
    formAssignLogicData () {
      this.formContent.questionsDoList.forEach(ele => {
        ele.displayLogicDoList = []
        Object.keys(this.displayLogicData).forEach(key => {
          if (key === ele.logicId) {
            this.displayLogicData[key].options.forEach(val => {
              ele.displayLogicDoList.push({
                logicId: key,
                paperId: ele.paperId,
                logicType: 2, // 1 跳转逻辑  2 显示逻辑
                conditionType: this.displayLogicData[key].condition,
                conditionLogicId: val.question,
                conditionSelect: val.condition,
                conditionSortIndex: val.option
              })
            })
          }
        })
      })
    },
    /**
     * @修改问卷状态
     * @param {String: id} 问卷id，必填
     * @param {Integer: state} 状态，必填
     * @description
     */
    UpdateQsmsState (val) {
      putQsmsState({
        id: val.paperId,
        state: val.paperState
      }).then(response => {
        if (response.status === 200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          })
          this.getData(this.search)
        } else {
          this.$message({
            type: 'error',
            message: response.desc
          })
        }
      })
    },

    // 每页数量切换
    handleSizeChange (val) {
      this.size = val
      this.getData({
        page: this.page,
        size: this.size,
        ...this.search
      })
    },

    // 分页切换
    handleCurrentChange (val) {
      this.page = val
      this.getData({
        page: this.page,
        size: this.size,
        ...this.search
      })
    },

    /**
     * @获取题库列表
     * @param {Integer: page} 页面，默认为1
     * @param {Integer: size} 条数，默认为10
     * @param {String: nurseUnitId} 护理单元id(多个,逗号拼接)
     * @param {String: title} 问卷标题
     * @param {Integer: paperState} 问卷状态，0 不可用 1 可用
     * @description 获取问卷列表
     */
    getData_questionLibrary (param) {
      fetchQuestionLibrary({
        page: this.page,
        size: this.size,
        ...param
      }).then(response => {
        for (let v of response.data.list.values()) {
          v.showAnswer = false
        }
        this.tableData_questionLibrary = response.data
      })
    },

    /**
     * @添加题库
     * @param {String: title} 题目标题
     * @param {Integer: required} 是否必选
     * @param {Integer: questionType} 题目类型
     * @param {Array: optionsDoList} 选项列表
     * @description 保存数据
     */
    addQuestionLibrary (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.yh_loading = true
          addQuestionLibrary(this.addForm).then(response => {
            if (response.status === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              // this.getData_questionLibrary()
              this.executeQueryPage()
              this.yh_loading = false
              this.isDialogVisible = false
            } else {
              this.$message({
                type: 'error',
                message: response.desc
              })
            }
          })
        } else {
          return false
        }
      })
    },

    /**
     * @编辑题库
     * @param {String: title} 题目标题
     * @param {Integer: required} 是否必选
     * @param {Integer: questionType} 题目类型
     * @param {Array: optionsDoList} 选项列表
     * @description 保存数据
     */
    editQuestionLibrary (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.yh_loading = true
          editQuestionLibrary(this.addForm).then(response => {
            if (response.status === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.yh_loading = false
              this.executeQueryPage()
              this.isDialogVisible = false
            } else {
              this.$message({
                type: 'error',
                message: response.desc
              })
            }
          })
        } else {
          return false
        }
      })
    },

    /**
     * @公共 删除方法
     * @param {row} 传入数据
     * @description 一般根据 id 删除
     */
    delHandler (row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (this.customDelHandler) {
            this.customDelHandler(row)
          } else {
            this.$message({
              type: 'info',
              message: '您未定义删除逻辑处理方法customDelHandler'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 获取护理单元ID
    selectDeptInfo () {
      return selectDeptInfo()
    }
  }
}
