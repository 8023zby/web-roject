import getStorageUser from '@/assets/qsms/utils/storageUser'
import { dataReduce,
  selectDeptInfo
} from '@/assets/qsms/utils/common'
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

// 问题原始数据结构
const addFormOriginData = {
  title: '',
  required: 0,
  questionType: 1,
  optionsDoList: [{
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
        'nurseUnitIds': [{
          required: true,
          message: '请选择护理单元',
          trigger: 'change'
        }],
        'title': [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        },
        {
          min: 1,
          max: 32,
          message: '请输入32位以内',
          trigger: 'blur'
        }
        ],
        'required': [{
          required: true,
          message: '请选择是否为必选题',
          trigger: 'blur'
        }
        ]
      },
      // 开关颜色 [激活]
      switchActiveColor: '#13ce66',
      // 按钮是否禁用
      isBtnDisabled: false,
      // Loading 状态
      loadingState: false,
      // 弹窗是否显示
      isDialogVisible: false,
      // 题库列表是否显示
      isDrawerVisible: false,
      // 状态列表
      state: [{
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
      questionTypeList: [{
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
      // 当前护理单元名
      nurseUnitName: ''
    }
  },
  mounted () {
    // 获取当前用户的
    this.nurseUnitName = getStorageUser('selectDeptInfo').deptName
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
      for (var i = 65; i < 91; i++) {
        str.push(String.fromCharCode(i))
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
        }
      } else {
        this.dialogTile = '新建问题'
      }
      this.$nextTick(()=>{
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
        optionsDoList: [{
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
          this.formContent.questionsDoList.push(this.deepClone(this.addForm))
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
          this.formContent.questionsDoList[this.qsmsSortIndex] = this.deepClone(this.addForm)
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
    // 删除题目
    delQuestion (item) {
      var index = this.formContent.questionsDoList.indexOf(item)
      if (index !== -1) {
        this.formContent.questionsDoList.splice(index, 1)
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
          } else { // dataReduce()
            addQsms(this.formContent).then(response => {
              if (response.status === 200) {
                this.$message({
                  type: 'success',
                  message: '操作成功'
                })
                this.$emit('option-changed', 'list')
                this.getData(this.search)
              } else {
                this.$message({
                  type: 'error',
                  message: response.desc
                })
              }
            })
          }
        } else {
          return false
        }
      })
    },

    // 判断重复
    unique (arr) {
      const res = new Map()
      return arr.filter((a) => !res.has(a) && res.set(a, 1))
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
            // 判断问卷中是否有重复题目
            if (dataReduce(this.formContent.questionsDoList, 'title').length !== this.formContent.questionsDoList.length) {
              this.$message({
                type: 'warning',
                message: '问卷中有重复题目！'
              })
            } else {
              this.$message({
                type: 'warning',
                message: '没重复'
              })
              console.log('没重复')
              editQsms(this.formContent).then(response => {
                if (response.status === 200) {
                  this.$message({
                    type: 'success',
                    message: '操作成功'
                  })
                  this.$emit('option-changed', 'list')
                  this.getData(this.search)
                } else {
                  this.$message({
                    type: 'error',
                    message: response.desc
                  })
                }
              })
            }
          }
        } else {
          return false
        }
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
          addQuestionLibrary(this.addForm).then(response => {
            if (response.status === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.getData_questionLibrary()
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
          editQuestionLibrary(this.addForm).then(response => {
            if (response.status === 200) {
              this.$message({
                type: 'success',
                message: '操作成功'
              })
              this.getData_questionLibrary()
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
      }).then(() => {
        if (this.customDelHandler) {
          this.customDelHandler(row)
        } else {
          this.$message({
            type: 'info',
            message: '您未定义删除逻辑处理方法customDelHandler'
          })
        }
      }).catch(() => {
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
