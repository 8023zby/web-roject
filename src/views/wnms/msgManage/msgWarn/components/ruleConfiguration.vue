<!--
  文件描述：规则配置
  创建时间：2021/6/10 10:35
  创建人：PCL
-->
<template>
    <section class="">
      <!--<h3>规则配置数组(focusRulesArray)：</h3><div style="border:1px solid #b4ffa6;">{{focusRulesArray}}</div>
      <h3>规则配置数组(eventType)：</h3><div style="border:1px solid #ffd855;">{{eventType}}</div>-->
      <section v-for="(itemtype,index0) of eventType" :key="index0">
        <el-form-item :label="`${labelShow[itemtype]}规则`" prop="title" class="remind-rules"></el-form-item>
        <div class="border-dom">
          <el-row v-for="(item,index) in focusRulesArray[itemtype]" :key="index">
            <el-col :span="7">
              <el-form-item :label="index==0?'选择公式:':`选择公式${(index+1)}:`"
                            class="form-required"
              >
                <el-select v-model="item.eid"
                           :disabled="pageFrom!=='msgWarn'"
                           @change="changeExpress(index,itemtype)"
                           style="width:90%;"
                           placeholder="请选择">
                  <section v-for="item2 in expressionList" :key="item2.key">
                    <template v-if="itemtype==='INSERT'">
                      <el-option
                        v-if="Number(item2.expressType)!==3 && Number(item2.expressType)!==4"
                        :key="item2.eid"
                        :label="item2.functionName"
                        :value="item2.eid">
                      </el-option>
                    </template>
                    <template v-else-if="itemtype==='UPDATE'">
                      <el-option
                        v-if="Number(item2.expressType)!==2 && Number(item2.expressType)!==4"
                        :key="item2.eid"
                        :label="item2.functionName"
                        :value="item2.eid">
                      </el-option>
                    </template>
                    <template v-else-if="itemtype==='DELETE'">
                      <el-option
                        v-if="Number(item2.expressType)===4"
                        :key="item2.eid"
                        :label="item2.functionName"
                        :value="item2.eid">
                      </el-option>
                    </template>
                  </section>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1" class="small-btn" v-if="itemtype!=='DELETE'">
              <el-button
                v-if="index==0"
                :disabled="pageFrom!=='msgWarn'"
                type="primary"
                icon="el-icon-plus"
                title="添加"
                circle
                @click="ruleAdd(itemtype)"
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
                @click="ruleDel(index,itemtype)"
                size="mini"
                class="button-model-del"
              />
            </el-col>
            <!--比较公式：A>B 、A<>B、A < B、A = B-->
            <section v-if="Number(item.expressType)===0 || Number(item.expressType)===2 || Number(item.expressType)===3">
              <el-col :span="8">
                <el-form-item label="A:" >
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
                <el-form-item label="B:">
                  <el-input v-model="item.B"
                            :disabled="pageFrom!=='msgWarn'"
                            placeholder="请输入"
                  />
                </el-form-item>
              </el-col>
            </section>
            <!--关键字匹配公式-->
            <section v-else-if="Number(item.expressType)===1">
              <el-col :span="8">
                <el-form-item label="选择字段:">
                  <el-select v-model="item.keywordField"
                             :disabled="pageFrom!=='msgWarn'"
                             style="width:90%;"
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
                <el-form-item label="关键词:">
                  <el-input v-model="item.keywordValue" placeholder="请输入" :disabled="pageFrom!=='msgWarn'"/>
                </el-form-item>
              </el-col>
            </section>
            <!--6 监听值提醒 5-与当前日期比较-->
            <section v-else-if="Number(item.expressType)===6 || Number(item.expressType)===5">
              <el-col :span="8">
                <el-form-item label="选择字段:">
                  <el-select v-model="item.keywordField"
                             :disabled="pageFrom!=='msgWarn'"
                             style="width:90%;"
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
            </section>
          </el-row>
        </div>
      </section>
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
              labelShow: {
                INSERT: '新增',
                UPDATE: '修改',
                DELETE: '删除'
              },
              eventType: [],
              focusRulesArray: {
                INSERT: [],
                UPDATE: [],
                DELETE: []
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
            _this.eventType = JSON.parse(Obj.newVal)
            _this.expressionList = JSON.parse(Obj.expressionList)
            let j = {
              ruleid: '',
              ruleContent: "",
              InConfig: "",
              A: '',
              B: '',
              keywordField: '',
              keywordValue: ''
            }
            //INSERT--新增、删除
            if (Obj.newVal.indexOf('INSERT') > -1 && Obj.oldVal.indexOf('INSERT') < 0) {
              _this.focusRulesArray.INSERT.push(j)
            } else if (Obj.newVal.indexOf('INSERT') < 0 && Obj.oldVal.indexOf('INSERT') > -1) {
              _this.focusRulesArray.INSERT = []
            }
            //UPDATE--新增、删除
            if (Obj.newVal.indexOf('UPDATE') > -1 && Obj.oldVal.indexOf('UPDATE') < 0) {
              _this.focusRulesArray.UPDATE.push(j)
            } else if (Obj.newVal.indexOf('UPDATE') < 0 && Obj.oldVal.indexOf('UPDATE') > -1) {
              _this.focusRulesArray.UPDATE = []
            }
            //DELETE--新增、删除
            if (Obj.newVal.indexOf('DELETE') > -1 && Obj.oldVal.indexOf('DELETE') < 0) {
              _this.focusRulesArray.DELETE.push(j)
            } else if (Obj.newVal.indexOf('DELETE') < 0 && Obj.oldVal.indexOf('DELETE') > -1) {
              _this.focusRulesArray.DELETE = []
            }
          },
          editInit(Obj) {
            const _this = this
            _this.eventType = JSON.parse(Obj.eventType)
            _this.expressionList = JSON.parse(Obj.expressionList)
            _this.focusRulesArray = {
              UPDATE: [],
              INSERT: [],
              DELETE: []
            }
            let focusRules = eval('(' + Obj.focusRules + ')')
            for (let i = 0; i < _this.eventType.length; i++) {
              let ent = _this.eventType[i]
              if (focusRules[ent]) {
                for (let v of focusRules[ent].values()) {
                  let j = {
                    "ruleid": "",
                    "ruleContent": v.ruleContent,
                    "InConfig": "",
                    "A": "",
                    "B": "",
                    "keywordField": "",
                    "keywordValue": "",
                    "eid": "",
                    "expressType": '',
                    functionArgs: {}
                  }
                  let InConfig = eval('(' + v.InConfig + ')')

                  for (let v2 of _this.expressionList.values()) {
                    if (v2.expression === v.ruleContent) {
                      j.eid = v2.eid
                      j.expressType = v2.expressType
                      j.functionArgs = v2.functionArgs
                      if (v2.expressType === 0 || v2.expressType === 2 || v2.expressType === 3) {
                        j.B = InConfig.b
                        for (let kk in InConfig) {
                          if (kk === 'a') {
                            let aVal = InConfig[kk].match(/\[\$(\S*)\]/)
                            if (aVal !== null && aVal[1])j.A = aVal[1]
                          }
                        }
                      } else if (v2.expressType === 1) {
                        for (let kk in InConfig) {
                          j.keywordField = kk
                          j.keywordValue = InConfig[kk]
                        }
                      } else if (v2.expressType === 5 || v2.expressType === 6) {
                        for (let kk in InConfig) {
                          j.keywordField = InConfig[kk]
                        }
                      }
                    }
                  }
                  _this.focusRulesArray[ent].push(j)
                }
              }
            }
          },
          // 处理规则保存数据
          dealFocusRules() {
            const _this = this
            let focusRules = {}

            for (let i = 0; i < _this.eventType.length; i++) {
              let ety = _this.eventType[i]
              // if (ety === 'DELETE') continue
              focusRules[ety] = []
              let arr = _this.focusRulesArray[ety]
              for (let v of arr.values()) {
                let j = {
                  ruleContent: v.ruleContent,
                  InConfig: ''
                }
                let InConfig = {}
                // 0 比较运算
                // 2 新增即提醒 ：只需选择公式，不需要选字段，输入内容
                // 3 修改即提醒 ：只需选择公式，不需要选字段，输入内容
                if (v.expressType === 0 || v.expressType === 2 || v.expressType === 3) {
                  if (v.A)InConfig['a'] = `[$${v.A}]`
                  if (v.B) InConfig['b'] = v.B
                  if (v.A && !v.B) InConfig['b'] = ''
                } else if (v.expressType === 1) {
                  // 1 关键正则
                  InConfig[v.keywordField] = v.keywordValue
                } else if (v.expressType === 5 || v.expressType === 6) {
                  // 5 与当前日期比较
                  // 6 监听值提醒
                  InConfig['a'] = v.keywordField
                }
                j.InConfig = JSON.stringify(InConfig)

                focusRules[ety].push(j)
              }
            }
            return JSON.stringify(focusRules)
          },
          /**
           * 规则添加模块：添加、删除
           * */
          ruleAdd(type) {
            if (this.focusRulesArray[type].length < 3) {
              let j = {
                ruleid: '',
                ruleContent: "",
                InConfig: "",
                A: '',
                B: '',
                keywordField: '',
                keywordValue: ''
              }
              this.focusRulesArray[type].push(j)
            } else {
              this.$message.warning('每类规则可最多增加至3条！')
            }
          },
          ruleDel(index, type) {
            this.focusRulesArray[type].splice(index, 1)
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
