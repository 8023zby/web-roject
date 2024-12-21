<!--
  文件描述：触发时刻
  创建时间：2021/10/27 10:35
  创建人：PCL
-->
<template>
    <section class="">

      <!--触发时刻联动&#45;&#45;&#45;&#45;绝对时间 =========== START-->
      <section v-if="timeType.indexOf('ABSOLUTE')>-1">
        <el-form-item label="绝对时间" prop="title" class="remind-rules"></el-form-item>
        <div class="border-dom">
          <el-row v-for="(item,index) in timeConfig.ABSOLUTE" :key="index">
            <el-col :span="7">
              <el-form-item :label="index==0?'频率:':`频率${(index+1)}:`"  class="form-required">
                <el-select v-model="item.frequency"
                           style="width:90%;"
                           placeholder="请选择">
                  <el-option v-for="item2 in frequencyList"
                             :key="item2.id"
                             :label="item2.name"
                             :value="item2.id">{{ item2.name }}
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="small-btn">
              <el-button
                v-if="index==0"
                type="primary"
                icon="el-icon-plus"
                title="添加"
                circle
                @click="timeTypeAdd"
                size="mini"
                class="button-model-add"
              />
              <el-button
                v-else
                type="danger"
                icon="el-icon-minus"
                title="删除"
                circle
                @click="timeTypeDel(index)"
                size="mini"
                class="button-model-del"
              />
            </el-col>
            <el-col :span="8">
              <el-form-item label="时间:">
                <el-time-picker
                  v-model="item.absoluteTime"
                  style="width:90%;"
                  format='HH:mm'
                  value-format="HH:mm"
                  placeholder="请选择"
                  class="time-picker-timeType"
                  :picker-options="{
                        format: 'HH:mm'
                      }"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="次数:">
                <el-input v-model.trim="item.executeCount" placeholder="请输入"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </section>
      <!--触发时刻联动&#45;&#45;&#45;&#45;绝对时间 =========== END-->
      <!--触发时刻联动&#45;&#45;&#45;&#45;相对时间 =========== START-->
      <section v-if="timeType.indexOf('RELATIVE')>-1">
        <el-form-item label="相对时间" prop="title" class="remind-rules"></el-form-item>
        <div class="border-dom">
          <el-row v-for="(item,index) in timeConfig.RELATIVE" :key="index">
            <el-col :span="7">
              <el-form-item :label="index==0?'选择公式:':`选择公式${(index+1)}:`"
                            class="form-required"
              >
                <el-select v-model="item.eid"
                           :disabled="pageFrom!=='msgWarn'"
                           @change="changeExpress(index,'RELATIVE','timeConfig')"
                           style="width:90%;"
                           placeholder="请选择">
                  <section v-for="item2 in expressionList" :key="item2.key">
                    <el-option
                      v-if="Number(item2.expressType)===0"
                      :key="item2.eid"
                      :label="item2.functionName"
                      :value="item2.eid">
                    </el-option>
                  </section>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="small-btn">
              <el-button
                v-if="index==0"
                :disabled="pageFrom!=='msgWarn'"
                type="primary"
                icon="el-icon-plus"
                title="添加"
                circle
                @click="timeTypeReAdd"
                size="mini"
                class="button-model-add"
              />
              <el-button
                v-else
                :disabled="pageFrom!=='msgWarn'"
                type="danger"
                icon="el-icon-minus"
                title="删除"
                circle
                @click="timeTypeReDel(index)"
                size="mini"
                class="button-model-del"
              />
            </el-col>
            <!--比较公式：A>B 、A<>B、A < B、A = B-->
            <section v-if="Number(item.expressType)===0">
              <el-col :span="8">
                <el-form-item label="字段:" >
                  <el-select v-model="item.A"
                             style="width:90%;"
                             :disabled="pageFrom!=='msgWarn'"
                             placeholder="请选择">
                    <el-option
                      v-for="item3 in listTableFields"
                      :key="item3.key"
                      :label="item3.keyName"
                      :value="item3.key">
                    </el-option>

                  </el-select>

                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="比较时间:">
                  <div style="white-space: nowrap;">
                    <el-input v-model="item.B"
                              :disabled="pageFrom!=='msgWarn'"
                              placeholder="比较时间"
                    />小时
                  </div>
                </el-form-item>
              </el-col>
            </section>
          </el-row>
        </div>
      </section>
      <!--触发时刻联动&#45;&#45;&#45;&#45;相对时间 =========== END-->
    </section>
</template>

<script>
    // 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
    // 例如：import 《组件名称》 from '《组件路径》';
    // 例如：import uploadFile from '@/components/uploadFile/uploadFile'

    export default {
        name: 'ruleConfiguration',
        // import引入的组件需要注入到对象中才能使用
        components: {},
        data() {
            // 这里存放数据
            return {
              listTableFields: null,
              expressionList: null,
              timeType: [], //触发时刻
              //频率
              frequencyList: [
                { id: 0, name: '每天' },
                { id: 1, name: '隔天' },
                { id: 7, name: '每周' }
              ],
              //触发时刻-配置项
              timeConfig: {
                ABSOLUTE: [], //绝对时间
                RELATIVE: [] //相对时间
              }
            }
        },
        // 监听属性 类似于data概念
        computed: {},
        props: {
          pageFrom: {
            type: String,
            default() {
              return 'msgWarn'
            }
          }
        },
        // 方法集合
        methods: {
          init(Obj) {
            const _this = this
            _this.expressionList = JSON.parse(Obj.expressionList)
            _this.timeType = JSON.parse(Obj.newVal)

            let newVal = JSON.parse(Obj.newVal),
              oldVal = JSON.parse(Obj.oldVal)
            //RELATIVE--相对定时
            if (newVal.indexOf('RELATIVE') > -1 && oldVal.indexOf('RELATIVE') < 0) {
              let j = {
                ruleid: '',
                ruleContent: "",
                InConfig: "",
                A: '',
                B: '',
                keywordField: '',
                keywordValue: ''
              }
              _this.timeConfig.RELATIVE.push(j)
            } else if (newVal.indexOf('RELATIVE') < 0 && oldVal.indexOf('RELATIVE') > -1) {
              _this.timeConfig.RELATIVE = []
            }
            //ABSOLUTE--绝对定时
            if (newVal.indexOf('ABSOLUTE') > -1 && oldVal.indexOf('ABSOLUTE') < 0) {
              let j = {
                absoluteTime: '',
                executeCount: "",
                frequency: ""
              }
              _this.timeConfig.ABSOLUTE.push(j)
            } else if (newVal.indexOf('ABSOLUTE') < 0 && oldVal.indexOf('ABSOLUTE') > -1) {
              _this.timeConfig.ABSOLUTE = []
            }
          },
          editInit(Obj) {
            const _this = this
            _this.timeType = JSON.parse(Obj.timeType)
            _this.expressionList = JSON.parse(Obj.expressionList)
            _this.timeConfig = {
              "ABSOLUTE": [],
              "RELATIVE": []
            }
            let timeConfig = eval('(' + Obj.timeConfig + ')')
            for (let i = 0; i < _this.timeType.length; i++) {
              let ent = _this.timeType[i]
              if (ent === 'ABSOLUTE') {
                _this.timeConfig[ent] = timeConfig[ent]
              } else if (ent === 'RELATIVE') {
                for (let v of timeConfig['RELATIVE'].values()) {
                  let timeConfig = eval('(' + v.timeConfig + ')')
                  let j = {
                    "timeConfig": '',
                    "timeExpress": v.timeExpress,
                    "keywordField": "",
                    "A": "",
                    "B": "",
                    "ruleContent": v.timeExpress,
                    "expressType": '',
                    eid: ''
                  }
                  let express = _this.expressionList.find((item) => {
                    return item.expression === v.timeExpress
                  })
                  if (express) {
                    j.eid = express.eid
                    j.expressType = express.expressType
                  }
                  for (let kk in timeConfig) {
                    if (kk === 'b') {
                      j.B = timeConfig[kk]
                    } else if (kk === 'a') {
                      let aVal = timeConfig[kk].match(/\[\$(\S*)\]/)
                      if (aVal !== null && aVal[1])j.A = aVal[1]
                    }
                  }
                  _this.timeConfig[ent].push(j)
                }
              }
            }
          },
          // 处理规则保存数据
          dealFocusRules() {
            const _this = this

            let timeConfig = {}
            if (_this.timeType.indexOf('ABSOLUTE') > -1) {
              let ABSOLUTE = _this.timeConfig.ABSOLUTE
              for (let vA of ABSOLUTE.values()) {
                if (vA.absoluteTime) {
                  if (vA.absoluteTime.includes('-'))vA.absoluteTime = vA.absoluteTime.split(" ")[1]
                  vA.absoluteTime = vA.absoluteTime.substr(0, 5) + ':00'
                }
              }
              timeConfig.ABSOLUTE = ABSOLUTE
            }
            // 相对时间
            if (_this.timeType.indexOf('RELATIVE') > -1) {
              timeConfig.RELATIVE = []
              let arr = _this.timeConfig.RELATIVE
              for (let v of arr.values()) {
                let j = {
                  timeExpress: v.ruleContent,
                  timeConfig: ''
                }
                let InConfig = {}
                // 0 比较运算
                if (v.expressType === 0) {
                  if (v.A)InConfig['a'] = `[$${v.A}]`
                  else InConfig['a'] = ''
                  if(v.B) InConfig['b'] = v.B
                  else InConfig['b'] = ''
                }
                j.timeConfig = JSON.stringify(InConfig)

                timeConfig.RELATIVE.push(j)
              }
            }

            return JSON.stringify(timeConfig)
          },
          /**
           * /触发时刻联动-绝对时间：添加、删除
           */
          timeTypeDel(index) {
            this.timeConfig.ABSOLUTE.splice(index, 1)
          },
          timeTypeAdd() {
            if (this.timeConfig.ABSOLUTE.length < 3) {
              let j = {}
              this.timeConfig.ABSOLUTE.push(j)
            } else {
              this.$message.warning('每类规则可最多增加至3条！')
            }
          },
          /**
           * /触发时刻联动-相对时间：添加、删除
           */
          timeTypeReDel(index) {
            this.timeConfig.RELATIVE.splice(index, 1)
          },
          timeTypeReAdd() {
            if (this.timeConfig.RELATIVE.length < 3) {
              let j = {
                ruleid: '',
                ruleContent: "",
                InConfig: "",
                A: '',
                B: '',
                keywordField: '',
                keywordValue: ''
              }
              this.timeConfig.RELATIVE.push(j)
            } else {
              this.$message.warning('每类规则可最多增加至3条！')
            }
          },
          //选择公式后更该公式类型
          changeExpress(i, t, type = 'focusRulesArray') {
            let eid = this[type][t][i]['eid']
            let item = this.expressionList.find((v, i) => {
              return v.eid === eid
            })
            console.log('选择的公式：', JSON.stringify(item))
            this[type][t][i]['expressType'] = item.expressType
            this[type][t][i]['ruleContent'] = item.expression
            this[type][t][i]['functionArgs'] = item.functionArgs
            // 之前的数据置空
            this[type][t][i]['A'] = ''
            this[type][t][i]['B'] = ''
            this[type][t][i]['keywordField'] = ''
            this[type][t][i]['keywordValue'] = ''
          },
        },
        // 监控data中的数据变化
        watch: {}
    }
</script>
