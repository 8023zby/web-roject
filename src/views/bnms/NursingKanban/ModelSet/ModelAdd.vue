<template>
  <layout v-loading="loading">
    <div slot="title">{{ form_type_text }}模板设置</div>

    <div slot="main" class="add-from">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="190px" label-suffix=":">
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model.trim="ruleForm.templateName" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="模板类型" prop="templateType">
          <el-radio v-model="ruleForm.templateType" :label="1" :disabled="ruleForm.switchFlag === 1 ? true : false" @change="changeModel">触屏版</el-radio>
          <el-radio v-model="ruleForm.templateType" :label="0" :disabled="ruleForm.switchFlag === 1 ? true : false" @change="changeModel">遥控器版</el-radio>
        </el-form-item>

        <el-row>
          <el-col :span="21">
            <el-form-item label="导航样式" prop="navStyleId">
              <el-select v-model="ruleForm.navStyleId" placeholder="请选择" clearable>
                <el-option v-for="(item, index) in navCur" :key="index" :label="item.navStyleName" :value="parseInt(item.navStyleKey)" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="背景图片">
          <v-upload-image-file ref="imgDiv" :image-obj="imageObj" :file-list="fileList" :img-size="3072" @changeFile="changeFile" @callBackInfo="callBackInfo" @delImage="delImage" />
        </el-form-item>

        <el-form-item label="患者隐私" prop="patientSecret">
          <el-switch v-model="ruleForm.patientSecret" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <el-form-item label="医生隐私" prop="doctorSecret">
          <el-switch v-model="ruleForm.doctorSecret" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <el-form-item label="看板换床/转科是否显示空床">
          <el-switch v-model="ruleForm.isEmptyBed" :active-value="1" :inactive-value="0" />
        </el-form-item>

        <el-form-item label="关联页面" prop="relesePage">
          <el-button type="primary" size="small" @click="addPage('')" v-uni="'mubanshezhi_guanlianyemian_add'">添加</el-button>
        </el-form-item>

        <!-- 关联页面表格 -->
        <el-row style="margin-bottom: 10px;">
          <el-table v-if="forceUpdate" ref="table" :data="pages" :row-key="getRowKeys" stripe>
            <el-table-column type="index" label="序号" width="100">
              <template slot-scope="scope">
                <span>{{
                  (search_form.page - 1) * search_form.size + (scope.$index + 1)
                }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="menuName" label="菜单名称" min-width="100" />

            <el-table-column prop="pageType" label="页面类型" width="100">
              <template slot-scope="scope">
                {{ scope.row.pageType === 1 ? '触屏版' : (scope.row.pageType === 2 ? '遥控器版' : '通用') }}
              </template>
            </el-table-column>

            <el-table-column prop="pageName" label="页面名称" min-width="100" />

            <el-table-column prop="thumbnailUrl" label="缩略图" min-width="100">
              <template slot-scope="scope">
                <el-image v-if="scope.row.initTag === 0 || scope.row.initTag === '0'" style="width: 62px; height: 35px;" :src="'/static/bnms/img/kanban/pageThumb/' + scope.row.thumbnailUrl" fit="contain" :preview-src-list="['/static/bnms/img/kanban/page/' + scope.row.thumbnailUrl]" />
                <el-image v-else-if="scope.row.thumbnailUrl" style="width: 62px; height: 35px" :src="scope.row.thumbnailUrl" :preview-src-list="[scope.row.thumbnailUrl]" fit="contain" />
                <el-image v-else style="width: 62px; height: 35px" :src="blockImg" fit="contain" />
              </template>
            </el-table-column>

            <el-table-column label="排序" width="250" prop="sort">
              <template slot-scope="scope">
                <el-button type="text" @click="classifySort(scope.$index, scope.row, 'top')" v-uni:[scope.row.pageId]="'mubanshezhi_guanlianyemian_head'" :key="'head' + scope.row.pageId">置顶
                </el-button>
                <el-button type="text" @click="classifySort(scope.$index, scope.row, 'up')" v-uni:[scope.row.pageId]="'mubanshezhi_guanlianyemian_up'" :key="'up' + scope.row.pageId">上移
                </el-button>
                <el-button type="text" @click="classifySort(scope.$index, scope.row, 'down')" v-uni:[scope.row.pageId]="'mubanshezhi_guanlianyemian_down'" :key="'down' + scope.row.pageId">下移
                </el-button>
                <el-button type="text" @click="classifySort(scope.$index, scope.row, 'bottom')" v-uni:[scope.row.pageId]="'mubanshezhi_guanlianyemian_bottom'" :key="'bottom' + scope.row.pageId">置尾
                </el-button>
                <el-button type="text" @click="classifySort(scope.$index, scope.row, 'assign')" v-uni:[scope.row.pageId]="'mubanshezhi_guanlianyemian_setposition'" :key="'setposition' + scope.row.pageId">指定位置
                </el-button>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <el-button type="text" @click="addPage(scope.row)" v-uni:[scope.row.pageId]="'mubanshezhi_guanlianyemian_edit'" :key="'edit' + scope.row.pageId">编辑</el-button>
                <el-button type="textred" @click="pageDelete(scope.row)" v-uni:[scope.row.pageId]="'mubanshezhi_guanlianyemian_delete'" :key="'delete' + scope.row.pageId">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入" maxlength="200" show-word-limit style="width: 40vw;" />
        </el-form-item>
      </el-form>

      <!-- 关联页面的添加 -->
      <el-dialog :title="pageTitle" :visible="relese_page_visible" :close-on-click-modal="false" :show-close="false" width="700px">
        <el-form ref="pageForm" :model="pageForm" :rules="pagerules" label-width="130px" label-suffix=":">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="pageForm.menuName" placeholder="请输入" />
          </el-form-item>

          <el-row>
            <el-col :span="21">
              <el-form-item label="选择页面" prop="chosePage">
                <el-select v-model="pageForm.chosePage" placeholder="请选择" clearable @change="setMenuName">
                  <el-option v-for="(item, index) in choosePages" :key="index" :label="item.pageName" :value="item.pageId" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="pageForm.src">
            <img v-if="pageForm.initTag === 0 || pageForm.initTag === '0'" :src="'/static/bnms/img/kanban/page/' + pageForm.src" alt="" style="width: 300px;">
            <img v-else :src="pageForm.src" alt="" style="width: 300px;">
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="cancelBtn" v-uni="'mubanshezhi_guanlianyemian_cancel'">取消</el-button>
          <el-button type="primary" size="small" @click="saveMenu" v-uni="'mubanshezhi_guanlianyemian_save'">保存</el-button>
        </div>
      </el-dialog>
    </div>

    <div slot="footer_btn">
      <el-button size="small" @click="close()" v-uni="'mubanshezhi_cancel'">取消 </el-button>
      <el-button type="primary" size="small" @click="submitForm" v-uni="'mubanshezhi_save'">保存</el-button>
    </div>
  </layout>
</template>

<script>

import vUploadImageFile from '../../../../components/bnms/UploadImageFile.vue'
import layout from '../../../../components/bnms/layout/edit'
import { ModelSetApi, PageSetApi, ModelSetApiSave } from '../../../../api/bnms/index'

export default {
  name: 'KanbanAdd',
  components: {
    layout,
    vUploadImageFile
  },
  props: ['detail'],
  data () {
    return {
      delImg: false,
      dialogVisible: false,
      seen: false,
      imageObj: {
        avatar: 'avatar_menu',
        widthSmall: 'widthSmall',
        imgType: 'oldman',
        imageBase64: '',
        imageUrl: ''
      },
      fileList: [], // 导入文件列表
      forceUpdate: true,
      menuRepeatFlag: false,
      blockImg: require('@/assets/bnms/images/icon_pic.png'),
      saveDelData: [],
      choosePages: [],
      navCur: [],
      pageTitle: '添加',
      relese_page_visible: false,
      search_form: {
        deptId: null,
        size: 10,
        page: 1
      },
      pages: [],
      loading: false,
      form_type_text: '',
      config_item: {
        name: '',
        config: {
          fontColor: '#000',
          backGroundColor: '#fff'
        }
      },
      pageForm: {
        pageName: '',
        menuName: '',
        chosePage: '',
        src: '',
        pageType: ''
      },
      ruleForm: {
        relesePage: '',
        patientSecret: 0,
        doctorSecret: 0,
        isEmptyBed: 0,
        templateType: 1,
        templateName: '',
        navStyleId: '',
        pages: [],
        remark: ''
      },
      rules: {
        templateName: [
          { required: true, message: '请输入模板名称！', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符！', trigger: 'blur' }
        ],
        navStyleId: [
          { required: true, message: '请选择导航样式！', trigger: 'change' }
        ],
        templateType: [
          { required: true, message: '请选择模板类型！', trigger: 'change' }
        ],
        relesePage: [
          { required: true, message: '请添加关联页面！', trigger: 'change' }
        ],
        patientSecret: [{ required: true }],
        doctorSecret: [{ required: true }]
      },
      pagerules: {
        menuName: [
          { required: true, message: '请输入菜单名称！', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符！', trigger: 'change' }
        ],
        chosePage: [
          { required: true, message: '请选择页面！', trigger: 'change' }
        ]
      }
    }
  },
  watch: {

  },
  created () {
    const params = this.detail || {}

    this.form_type_text = Object.keys(params).length !== 0 ? '编辑' : '添加'

    Object.assign(this.ruleForm, params)

    this.imageObj.imageUrl = this.ruleForm.backgroundImageUrl

    if (this.ruleForm.navStyleId) {
      this.ruleForm.navStyleId = parseInt(this.ruleForm.navStyleId)
    }

    this.pages = this.ruleForm.pages

    this.getNavList() // 导航样式
    this.getPagesList() // 获取页面信息
  },
  methods: {
    changeModel () {
      this.getNavList()

      this.pageForm = {
        pageName: '',
        menuName: '',
        chosePage: '',
        src: '',
        pageType: ''
      }
      for (let i = 0; i < this.pages.length; i++) {
        this.pages[i].operFlag = 3
        this.saveDelData.push(this.pages[i])
        // this.pages.splice(i, 1)
      }
      this.pages = []
      this.ruleForm.pages = []
      this.ruleForm.relesePage = ''
      this.ruleForm.patientSecret = 0
      this.ruleForm.doctorSecret = 0
      this.ruleForm.isEmptyBed = 0
      this.ruleForm.navStyleId = ''
      this.ruleForm.remark = ''
      this.pageForm.page_id = ''

      this.getPagesList()
    },
    changeFile (v) {
      this.fileList = v
    },
    callBackInfo () { // 图片上传完成之后的回调

    },
    // 打开文件
    handleOpenFile () {
      this.addVis = false
      const input = document.getElementById(this.id)
      // 解决同一个文件不能监听的问题
      input.addEventListener(
        'click',
        function () {
          this.value = ''
        },
        false
      )
      // 点击input
      input.click()
    },
    delImage () {
      this.$confirm('是否将此图片删除?', '提示', {
        confirmButtonText: '确 认',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        this.imageObj.imageUrl = ''
        this.delImg = true
      })
    },
    cancelBtn () {
      this.relese_page_visible = false

      this.pageForm.src = ''
      this.pageTitle = '添加'
      this.$refs.pageForm.resetFields()
    },
    getPagesList () { // 获取页面信息
      // pageType:1代表触屏，2代表遥控器
      let _pt = 1
      if (this.ruleForm.templateType === 0) { // 遥控器版
        _pt = 2
      } else { // 触屏版
        _pt = 1
      }
      PageSetApi.pageNopSetList({ pageType: _pt }).then((res) => {
        this.choosePages = res.data
        for (let item of this.choosePages) {
          for (let one of this.ruleForm.pages) {
            if (item.pageId === one.pageId) {
              one.content = item.content
            }
          }
        }
      })
    },
    getNavList () {
      let _ser = ''
      if (this.ruleForm.templateType === 0) {
        _ser = 0
      } else {
        _ser = '1,3'
      }
      ModelSetApi.navList({ styleKeys: _ser }).then((res) => {
        this.navCur = res.data
      }).catch((res) => {
        this.$message.error(res.message)
      })
    },
    classifySort (currentIndex, currentData, type) {
      const _classifyData = this.pages

      if (type === 'up') {
        if (currentIndex === 0) {
          this.$message.warning('已经是第一个！')
          return
        }
        const prevIndex = currentIndex - 1
        const prevData = this.pages[prevIndex]
        // 交换序号
        prevData['sort'] = currentData['sort']
        currentData['sort'] = currentData['sort'] - 1
        // 交换位置
        this.pages[currentIndex] = prevData
        this.pages[prevIndex] = currentData
        if (this.pages[currentIndex].id) {
          this.pages[currentIndex].operFlag = 2
        } else {
          this.pages[currentIndex].operFlag = 1
        }

        if (this.pages[prevIndex].id) {
          this.pages[prevIndex].operFlag = 2
        } else {
          this.pages[prevIndex].operFlag = 1
        }
        this.forceUpdate = false
        this.$nextTick(() => {
          this.forceUpdate = true
        })
      } else if (type === 'down') {
        if (currentIndex === _classifyData.length - 1) {
          this.$message.warning('已经是最后一个！')
          return
        }
        const nextIndex = currentIndex + 1
        const nextData = _classifyData[nextIndex]
        // 交换序号
        nextData['sort'] = currentData['sort']
        currentData['sort'] = currentData['sort'] + 1
        // 交换位置
        _classifyData[currentIndex] = nextData
        _classifyData[nextIndex] = currentData

        // 判断数据是数据库的数据进行页面移动还是页面数据进行移动
        if (_classifyData[currentIndex].id) {
          _classifyData[currentIndex].operFlag = 2
        } else {
          _classifyData[currentIndex].operFlag = 1
        }

        if (_classifyData[nextIndex].id) {
          _classifyData[nextIndex].operFlag = 2
        } else {
          _classifyData[nextIndex].operFlag = 1
        }

        this.forceUpdate = false
        this.$nextTick(() => {
          this.forceUpdate = true
        })
      } else if (type === 'top') {
        if (currentIndex === 0) {
          this.$message.warning('已经是第一个！')
          return
        }
        const currentData = _classifyData.splice(currentIndex, 1)
        _classifyData.unshift(currentData[0])
        // 重新排序
        for (let i = 0; i < _classifyData.length; i++) {
          _classifyData[i]['sort'] = i + 1
          if (_classifyData[i].id) {
            _classifyData[i].operFlag = 2
          } else {
            _classifyData[i].operFlag = 1
          }
        }
      } else if (type === 'bottom') {
        if (currentIndex === _classifyData.length - 1) {
          this.$message.warning('已经是最后一个！')
          return
        }
        const currentData = _classifyData.splice(currentIndex, 1)
        _classifyData.push(currentData[0])
        // 重新排序
        for (let i = 0; i < _classifyData.length; i++) {
          _classifyData[i]['sort'] = i + 1
          if (_classifyData[i].id) {
            _classifyData[i].operFlag = 2
          } else {
            _classifyData[i].operFlag = 1
          }
        }
      } else if (type === 'assign') {
        this.$prompt('跳转至:', '指定位置', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          inputPattern: /^[1-9]\d*$/,
          inputErrorMessage: `请输入数字序号(1-${_classifyData.length})`,
          showClose: false,
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              let value = instance.inputValue
              if (parseInt(value) > _classifyData.length) {
                this.$message.warning(`指定位置不能超过${_classifyData.length}！`)
              } else {
                done()
              }
            } else {
              done()
            }
          }
        }).then(({ value }) => {
          const currentData = _classifyData.splice(currentIndex, 1)
          _classifyData.splice(value - 1, 0, currentData[0])
          // 重新排序
          for (let i = 0; i < _classifyData.length; i++) {
            _classifyData[i]['sort'] = i + 1
            if (_classifyData[i].id) {
              _classifyData[i].operFlag = 2
            } else {
              _classifyData[i].operFlag = 1
            }
          }
        }).catch((e) => {
          console.log(e)
        })
      }
    },
    setMenuName (info) {
      let _row = ''
      for (const one of this.choosePages) {
        if (one.pageId === info) {
          _row = one
        }
      }

      //  校验 url 是否已经存在
      let _err = []
      for (let item of this.pages) {
        if (item.content === _row.content) {
          _err.push(item.menuName)
        }
      }
      if (_err.length) {
        this.$message.warning('页面' + _err.join(',') + '与' + _row.pageName + '的URL重复，请重新选择')
        this.pageForm.chosePage = ''
        this.pageForm.menuName = ''
        this.pageForm.src = ''
        return false
      }

      if (!this.pageForm.id) {
        this.pageForm.menuName = _row.pageName
      }
      this.pageForm.pageName = _row.pageName
      this.pageForm.pageType = _row.pageType
      this.pageForm.initTag = _row.initTag
      this.pageForm.content = _row.content

      if (_row.thumbnailUrl) {
        this.pageForm.src = _row.thumbnailUrl
      } else {
        this.pageForm.src = ''
      }
    },
    pageDelete (row) { // 关联页面删除
      this.$confirm('确认要删除该数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        showClose: false
      }).then(() => {
        for (let i = 0; i < this.pages.length; i++) {
          if (this.pages[i].pageId === row.pageId) {
            this.pages[i].operFlag = 3
            this.saveDelData.push(this.pages[i])
            this.pages.splice(i, 1)
          }
        }

        this.pages.map((v, index) => {
          if (!v.id) { // 新增

          } else {
            v.operFlag = 2
          }

          v.sort = index + 1
          return v
        })

        if (this.pages.length === 0) {
          this.ruleForm.relesePage = ''
          this.$refs['ruleForm'].validateField('relesePage')
        }
      }).catch(action => {

      })
    },
    saveMenu () { // 保存菜单
      this.$refs.pageForm.validate((valid) => {
        if (valid) {
          // 校验菜单名称是否重复
          this.ruleForm.relesePage = 'page'
          this.$refs['ruleForm'].validateField('relesePage')

          if (!this.pageForm.id) { // 新增
            for (const one of this.pages) {
              if (one.menuName === this.pageForm.menuName && this.pageForm.page_id !== one.page_id) {
                this.menuRepeatFlag = true
                this.$message({
                  message: '菜单名称已存在，请修改！',
                  type: 'warning'
                })
                return false
              }
            }
            if (!this.pageForm.page_id) { // 新增
              this.pages.push(
                {
                  page_id: Date.parse(new Date()),
                  pageId: this.pageForm.chosePage,
                  pageName: this.pageForm.pageName,
                  menuName: this.pageForm.menuName,
                  thumbnailUrl: this.pageForm.src,
                  sort: this.pages.length + 1,
                  pageType: this.pageForm.pageType,
                  operFlag: 1,
                  initTag: this.pageForm.initTag,
                  content: this.pageForm.content
                }
              )
            } else { // 新增的修改
              this.pages.map((v) => {
                if (v.page_id === this.pageForm.page_id) {
                  v.pageId = this.pageForm.chosePage
                  v.pageName = this.pageForm.pageName
                  v.menuName = this.pageForm.menuName
                  v.thumbnailUrl = this.pageForm.src
                  v.sort = this.pageForm.sort
                  v.pageType = this.pageForm.pageType
                  v.operFlag = 1
                  v.initTag = this.pageForm.initTag
                  v.content = this.pageForm.content
                }
              })
            }
          } else {
            this.pages.map((v) => {
              if (this.pageForm.id) {
                if (this.pageForm.id === v.id) {
                  v.pageId = this.pageForm.chosePage
                  v.pageName = this.pageForm.pageName
                  v.menuName = this.pageForm.menuName
                  v.thumbnailUrl = this.pageForm.src
                  v.sort = this.pageForm.sort
                  v.pageType = this.pageForm.pageType
                  v.operFlag = 2
                  v.initTag = this.pageForm.initTag
                  v.content = this.pageForm.content
                }
              } else {
                if (v.page_id === this.pageForm.page_id) {
                  v.pageId = this.pageForm.chosePage
                  v.pageName = this.pageForm.pageName
                  v.menuName = this.pageForm.menuName
                  v.thumbnailUrl = this.pageForm.src
                  v.sort = this.pageForm.sort
                  v.pageType = this.pageForm.pageType
                  v.operFlag = 2
                  v.initTag = this.pageForm.initTag
                  v.content = this.pageForm.content
                }
              }
            })
          }

          this.pages.map((v, index) => {
            if (!v.id) { // 新增

            } else {
              v.operFlag = 2
            }

            v.sort = index + 1
            return v
          })

          this.relese_page_visible = false
          this.$refs.pageForm.resetFields()
        }
      })
    },
    submitForm () {
      if (this.pages.length > 0) {
        this.ruleForm.relesePage = 'page'
      } else {
        this.ruleForm.relesePage = ''
      }
      this.ruleForm.pages = this.pages

      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const _tv = JSON.parse(JSON.stringify(this.ruleForm))

          this.saveDelData.map((v) => {
            _tv.pages.push(v)
          })

          delete _tv['updateDate']
          delete _tv['createDate']
          delete _tv['creator']
          delete _tv['modify']
          delete _tv['status']
          delete _tv['relesePage']

          // 用于图片删除
          const formDataDel = new FormData()

          if (this.delImg) {
            formDataDel.append('backgroundImageUrl', _tv.backgroundImageUrl)
            delete _tv.backgroundImageUrl
          }

          formDataDel.append('bnTemplateSetStr', JSON.stringify(_tv))

          // 用于图片添加
          const formDataAdd = new FormData()

          this.fileList.map((item) => {
            formDataAdd.append('multipartFile', item.raw)
          })

          formDataAdd.append('bnTemplateSetStr', JSON.stringify(_tv))

          let _addFlag = 'add'
          if (_tv['templateId']) {
            _addFlag = 'mod'
          }

          if (this.delImg) { // 先删除
            // 处理 formData，传 backgroundImageUrl 用于删除
            if (_addFlag !== 'add') { // 添加的话不走删除
              await this.saveChange(formDataDel, _addFlag, 'del')
            }

            this.saveChange(formDataAdd, _addFlag)
          } else {
            // 处理 formData，传 multipartFile 用于删除
            this.saveChange(formDataAdd, _addFlag)
          }
        }
      })
    },
    saveChange (formData, _addFlag, act) { // 保存数据，调接口
      ModelSetApiSave(formData, _addFlag).then((res) => {
        if (act === 'del') {

        } else {
          if (res.status === 200) {
            this.$message.success('保存成功！')
            this.close()
          } else {
            this.$message.error(res.desc)
          }
        }
      }).catch((res) => {
        this.$message.error(res.desc)
      })
    },
    close () { // 返回
      this.$emit('changed')
    },
    getRowKeys (row) {
      return row.labelId
    },
    addPage (data) {
      // 编辑分两种情况:1、保存数据库之后的编辑，有id字段，可以通过id进行修改；2、暂存界面的编辑，有page_id，可以通过page_id进行修改
      if (data) {
        // 数据库数据修改
        this.pageForm.id = data.id
        // 界面数据修改
        this.pageForm.page_id = data.page_id

        this.pageTitle = '编辑'
        this.$nextTick(() => {
          this.pageForm.chosePage = data.pageId
          this.pageForm.pageName = data.pageName
          this.pageForm.menuName = data.menuName
          this.pageForm.initTag = data.initTag
        })

        this.pageForm.src = data.thumbnailUrl
      } else {
        this.pageTitle = '添加'
        this.pageForm.id = ''
        this.pageForm.page_id = ''
        this.pageForm.src = ''
      }

      this.relese_page_visible = true
    }
  }
}
</script>

<style lang="scss" type="text/scss" scoped>
@import "../../../../assets/bnms/css/self_common";
</style>
<style lang="scss" scoped>
.passport-tool-width {
  margin-left: 46px;
}
.passport-tool-height {
  margin-left: 46px;
}
.passport-tool-default {
  margin-left: 30px;
  color: #1e87f0;
  line-height: 70px;
  span {
    cursor: pointer;
  }
}
.passport-tool-btn {
  margin-left: 20px;
  width: 70px;
  font-size: 16px;
  height: 40px;
  border-radius: 2px;
  padding: 0 !important;
  margin-top: 12px;
}
.passport-tool-size-div {
  padding: 26px;
  display: flex;
}
.passport-tool-title {
  color: #999999;
  font-size: 14px;
}
.passport-tool-div-item {
  width: 25%;
  text-align: center;
}
.iconSize {
  font-size: 24px;
  color: #999999;
  cursor: pointer;
  &:hover {
    color: #1e87f0;
  }
}
.passport-tool-div {
  width: 217px;
  height: 38px;
  background: #efefef;
  border-radius: 20px;
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  margin-top: 15px;
}
.passport-add-img {
  border: 1px dashed #dcdfe6;
  width: 108px;
  height: 108px;
  line-height: 164px;
  text-align: center;
  color: #cccece;
  position: relative;
  cursor: pointer;
}
.passport-add-img::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 36%;
  width: 25px;
  margin-left: -11px;
  border-top: 3px solid #b7b7b7;
}
.passport-add-img::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 36%;
  height: 25px;
  margin-top: -11px;
  border-left: 3px solid #b7b7b7;
}
.passport-add-img:hover,
.passport-add-img:focus {
  border: 1px dashed #1e87f0;
}
.passport-uploader-img:hover,
.passport-uploader-img:focus {
  border: 1px solid #1e87f0;
}
.main-content {
  display: flex;
  flex-flow: column;
}
#passport-corpper {
  width: 480px;
  height: 220px;
  background-image: none;
  background: #fff;
  z-index: 1002;
  margin: 0 auto;
}

.cropper-button {
  z-index: 1003;
  text-align: center;
  margin-top: 20px;
  .el-button {
    font-size: 16px;
    cursor: pointer;
    text-align: center;
  }
  .cancel-btn {
    color: #373737;
  }
  .el-button:last-child {
    margin-left: 100px;
  }
}
.passport-uploader-img {
  width: 110px;
  height: 110px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.imgContent {
  width: 110px;
  height: 110px;
  border-radius: 2px;
}
.widthSmall {
  width: 110px;
}
.showBtn {
  position: absolute;
  bottom: 0px;
  left: 0;
  height: 22px;
  line-height: 22px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  border-radius: 0 0 2px 2px;
  width: 100%;
}
.ImgBtn {
  float: left;
  width: 50%;
  background: rgba(51, 51, 51, 0.3);
}
.passport-up-img {
  position: relative;
  display: flex;
  vertical-align: middle;
  text-align: center;
  width: 108px;
  height: 108px;
  border-radius: 2px;
  .showImg {
    width: 108px;
    height: 108px;
    object-fit: scale-down;
  }
}
.closeBtn {
  position: absolute;
  top: 0px;
  right: 0;
  width: 20px;
  height: 20px;
}
</style>
