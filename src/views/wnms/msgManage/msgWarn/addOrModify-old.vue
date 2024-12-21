<!--
  文件描述：自动提醒\提醒应用-添加/修改页
    根据pageFrom这个参数判断：msgWarnUse 是提醒应用，msgWarn是自动提醒
      主样式class：edit-page-new
  创建时间：2020/5/09 14:31
  创建人：Administrator

  自动提醒，公式选择逻辑：
  字段：expressType
  0 比较运算 ：需要选择比较字段，输入比较值
  1 关键正则 ：关键字匹配，需要选择匹配字段，输入匹配值
  2 新增即提醒 ：只需选择公式，不需要选字段，输入内容
  3 修改即提醒 ：只需选择公式，不需要选字段，输入内容
  4 删除即提醒 ：只需选择公式，不需要选字段，输入内容
  5 时间运算：触发时刻，相对时间时，选择用的公式

  根据expressType判断，是否有必填、必选项
  expressType === 0时，比较参数拼接：`[$${v.A}]`
-->
<template>
  <el-container class="edit-page-new">
    <el-header :height="'48px'">
      <!--标题-->
      <div class="title">
        <slot name="title">
          {{this.detail.type==='add'?'添加消息':'修改消息'}}
        </slot>
      </div>
      <!--头部右侧按钮-->
      <div class="right-btn">
        <slot name="right_btn">
        </slot>
      </div>
    </el-header>
    <el-main>
      <!--主内容-->
      <slot name="main">
        <el-form ref="formMsg" :model="formMsg" :rules="rules" label-width="125px">
          <el-form-item label="消息类型:" prop="msgType">
            <el-select v-model="formMsg.msgType"
                       class="elinput-300"
                       :disabled="pageFrom!=='msgWarn'"
                       placeholder="请选择">
              <el-option v-for="item in eventTypeList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id">{{ item.name }}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="消息名称:" :prop="pageFrom==='msgWarn'?'msgName':''">
            <el-input v-model="formMsg.msgName" class="elinput-300" placeholder="请输入" :disabled="pageFrom!=='msgWarn'"/>
          </el-form-item>
          <el-form-item label="消息描述:">
            <el-input
              :disabled="pageFrom!=='msgWarn'"
              placeholder="请输入"
              v-model="formMsg.msgDesc"
              class="elinput-300"
              type="textarea"
              :rows="7"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="选择表:" prop="itemId" >
            <el-select v-model="formMsg.itemId"
                       :disabled="pageFrom!=='msgWarn'"
                       class="elinput-300"
                       @change="changeItemId"
                       placeholder="请选择">
              <el-option v-for="item in tableList"
                         :key="item.itemId"
                         :label="item.tableNameExplain"
                         :value="item.itemId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="患者id字段:" prop="patientIdField" v-if="formMsg.itemId!==''">
            <el-select v-model="formMsg.patientIdField"
                       class="elinput-300"
                       :disabled="pageFrom!=='msgWarn'"
                       placeholder="请选择">
              <section v-for="item3 in listTableFields" :key="item3.key">
                <el-option
                  v-if="item3.tableFrom !== '关联表'"
                  :label="item3.keyName"
                  :value="item3.key">
                </el-option>
              </section>

            </el-select>
          </el-form-item>
          <!--关联表 ==== START-->
          <div class="htmlinfo"><h2>查询的关联表信息（RelatedtableList）：</h2>{{RelatedtableList}}</div>
          <div class="htmlinfo"><h2>关联表字段信息（unionRules）：</h2>{{unionRules}}</div>
          <div class="htmlinfo"><h2>主表所有字段+从表出参（listTableFields）：</h2>{{listTableFields}}</div>
          <div class="htmlinfo"><h2>主表所有字段（listTableFieldsString）：</h2>{{listTableFieldsString}}</div>

          <section v-if="formMsg.itemId!==''">
            <el-form-item label="选择关联表" :class="{'remind-rules':unionRules.length > 0}">
              <el-button
                v-if="pageFrom==='msgWarn'"
                type="primary"
                icon="el-icon-plus"
                title="添加"
                circle
                @click="RelatedTableAdd"
                size="mini"
                class="button-model-add"
              />
            </el-form-item>
            <div class="border-dom" v-if="unionRules.length > 0">
              <el-row v-for="(item,index) in unionRules" :key="index">
                <el-col :span="7">
                  <el-form-item label="关联表："  class="form-required">
                    <el-select v-model="item.sqlId"
                               :disabled="pageFrom!=='msgWarn'"
                               style="width:90%;"
                               @change="changeRelated(index)"
                               placeholder="请选择">
                      <el-option v-for="item2 in RelatedtableList"
                                 :label="item2.name"
                                 :value="item2.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="1" class="small-btn">
                  <el-button
                    v-if="pageFrom==='msgWarn'"
                    type="danger"
                    icon="el-icon-minus"
                    title="删除"
                    circle
                    @click="RelatedTableDel(index)"
                    size="mini"
                    class="button-model-del"
                  />
                </el-col>
                <el-col :span="5" v-for="(item2,index2) in item.gl" :key="index2">
                  <el-form-item :label="`${item2.keyName}:`"  class="form-required">
                    <el-select v-model="item2.mainTableField"
                               :disabled="pageFrom!=='msgWarn'"
                               style="width:90%;"
                               @change="$forceUpdate()"
                               placeholder="请选择">
                      <section v-for="item3 in listTableFields" :key="item3.key">
                        <el-option
                          v-if="item3.tableFrom !== '关联表'"
                          :key="item3.key"
                          :label="item3.keyName"
                          :value="item3.key">
                        </el-option>
                      </section>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </section>
          <!--关联表 ==== END-->

          <div class="htmlinfo"><h2>提醒规则（formMsg.eventType）：</h2>{{formMsg.eventType}}</div>
          <div class="htmlinfo"><h2>提醒规则详情（formMsg.focusRulesArray）：</h2>{{formMsg.focusRulesArray}}</div>
          <el-form-item label="提醒规则:" prop="eventType">
            <el-checkbox-group v-model="formMsg.eventType" :disabled="pageFrom!=='msgWarn'">
              <el-checkbox label="INSERT" :disabled="formMsg.itemId===''">新增</el-checkbox>
              <el-checkbox label="UPDATE" :disabled="formMsg.itemId===''">修改</el-checkbox>
              <el-checkbox label="DELETE" :disabled="formMsg.itemId===''">删除</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <div class="htmlinfo"><h2>规则配置数组（formMsg.focusRulesArray）：</h2>{{formMsg.focusRulesArray}}</div>
          <!--规则配置数组：<br>{{formMsg.focusRulesArray}}<br><br>
          表达式：<br>{{expressionList}}-->
          <!--新增规则-&#45;&#45;demo=====START-->
          <!--expressType 0 比较运算 1 关键正则 2 新增 3 修改 4 删除提醒 5 时间运算-->
          <section v-if="formMsg.eventType.indexOf('INSERT')>-1 && formMsg.itemId!==''">
            <el-form-item label="新增规则" prop="title" class="remind-rules"></el-form-item>
            <div class="border-dom">
              <el-row v-for="(item,index) in formMsg.focusRulesArray.INSERT" :key="index">
                <el-col :span="7">
                  <el-form-item :label="index==0?'选择公式:':`选择公式${(index+1)}:`"
                                class="form-required"
                  >
                    <el-select v-model="item.eid"
                               :disabled="pageFrom!=='msgWarn'"
                               @change="changeExpress(index,'INSERT')"
                               style="width:90%;"
                               placeholder="请选择">
                      <section v-for="item2 in expressionList" :key="item2.key">
                       <el-option
                         v-if="Number(item2.expressType)!==3 && Number(item2.expressType)!==4 && Number(item2.expressType)!==5"
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
                    @click="ruleAddAdd"
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
                    @click="ruleAddDel(index)"
                    size="mini"
                    class="button-model-del"
                  />
                </el-col>
                <!--比较公式：A>B-->
                <section v-if="Number(item.expressType)===0">
                  <el-col :span="8">
                    <el-form-item label="A:" >
                      <el-select v-model="item.A"
                                 style="width:90%;"
                                 :disabled="pageFrom!=='msgWarn'"
                                 placeholder="请选择">
                        <!--<el-option
                          v-for="item3 in item.functionArgs.A"
                          :key="item3.key"
                          :label="item3.explain"
                          :value="item3.key">
                        </el-option>-->
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
                                @blur="ruleEventType('focusRulesArray','INSERT',index,'B')"
                      />
                    </el-form-item>
                  </el-col>
                </section>
                <!--关键字匹配公式-->
                <section v-if="Number(item.expressType)===1">
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
                      <el-input v-model="item.keywordValue" placeholder="请输入" @blur="ruleEventType('focusRulesArray','INSERT',index,'keywordValue')" :disabled="pageFrom!=='msgWarn'"/>
                    </el-form-item>
                  </el-col>
                </section>

              </el-row>
            </div>
          </section>

          <!--新增规则-&#45;&#45;demo=====END-->
          <!--修改规则-&#45;&#45;demo=====START-->
          <section v-if="formMsg.eventType.indexOf('UPDATE')>-1 && formMsg.itemId!==''">
            <el-form-item label="修改规则" prop="title" class="remind-rules"></el-form-item>
            <div class="border-dom">
              <el-row v-for="(item,index) in formMsg.focusRulesArray.UPDATE" :key="index">
                <el-col :span="7">
                  <el-form-item :label="index==0?'选择公式:':`选择公式${(index+1)}:`"  class="form-required">
                    <el-select v-model="item.eid"
                               :disabled="pageFrom!=='msgWarn'"
                               @change="changeExpress(index,'UPDATE')"
                               style="width:90%;"
                               placeholder="请选择">
                      <section v-for="item2 in expressionList" :key="item2.eid">
                        <el-option
                          v-if="Number(item2.expressType)!==2 && Number(item2.expressType)!==4 && Number(item2.expressType)!==5"
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
                    @click="ruleModifyAdd"
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
                    @click="ruleModifyDel(index)"
                    size="mini"
                    class="button-model-del"
                  />
                </el-col>
                <!--比较公式：A>B-->
                <section v-if="Number(item.expressType)===0">
                  <el-col :span="8">
                    <el-form-item label="A:">
                      <el-select v-model="item.A"
                                 style="width:90%;"
                                 :disabled="pageFrom!=='msgWarn'"
                                 placeholder="请选择">
                        <!--<el-option
                          v-for="item3 in item.functionArgs.A"
                          :key="item3.key"
                          :label="item3.explain"
                          :value="item3.key">
                        </el-option>-->
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
                      <el-input
                        v-model.trim="item.B"
                        placeholder="请输入"
                        @blur="ruleEventType('focusRulesArray','UPDATE',index,'B')"
                        :disabled="pageFrom!=='msgWarn'"/>
                    </el-form-item>
                  </el-col>
                </section>
                <!--关键字匹配公式-->
                <section v-if="Number(item.expressType)===1">
                  <el-col :span="8">
                    <el-form-item label="选择字段:">
                      <el-select v-model="item.keywordField"
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
                    <el-form-item label="关键词:">
                      <el-input v-model.trim="item.keywordValue" placeholder="请输入" @blur="ruleEventType('focusRulesArray','UPDATE',index,'keywordValue')" :disabled="pageFrom!=='msgWarn'"/>
                    </el-form-item>
                  </el-col>
                </section>
              </el-row>
            </div>
          </section>
          <!--修改规则-&#45;&#45;demo=====END-->
          <!--删除规则-&#45;&#45;demo=====START-->
          <section v-if="formMsg.eventType.indexOf('DELETE')>-1 && formMsg.itemId!==''">
            <el-form-item label="删除规则" prop="title" class="remind-rules"></el-form-item>
            <div class="border-dom">
              <el-row v-for="(item,index) in formMsg.focusRulesArray.DELETE" :key="index">
                <el-col :span="7">
                  <el-form-item :label="index==0?'选择公式:':`选择公式${(index+1)}:`"  class="form-required">
                    <el-select v-model="item.eid"
                               :disabled="pageFrom!=='msgWarn'"
                               @change="changeExpress(index,'DELETE')"
                               style="width:90%;"
                               placeholder="请选择">
                      <section v-for="item2 in expressionList" :key="item2.eid">
                        <el-option
                          v-if="Number(item2.expressType)===4"
                          :label="item2.functionName"
                          :value="item2.eid">
                        </el-option>
                      </section>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </section>
          <!--删除规则-&#45;&#45;demo=====END-->
          <el-form-item label="显示图标:" >
            <div style="float: left;margin-right: 15px;">
              <el-switch
                :disabled="pageFrom!=='msgWarn'"
                v-model="formMsg.icon">
              </el-switch>
            </div>
            <div style="float: left;" v-if="formMsg.icon && pageFrom==='msgWarn'">
              <upload-flied ref="uploadIconFile"
                            v-model="formMsg.iconUrl"
                            :data-name="uploadOption.dataName"
                            :accept="uploadOption.accept"
                            :limits="uploadOption.limits"
                            :filelist="uploadOption.fileList"
                            :handle-exceed="handleExceed"
                            btnName="上传"
                            :fileSize=1
                            changeData="icon"
                            :showFileView="false"
                            :showFileList="true"
                            showFileType="icon"
                            @uploadFlieds="uploadFlieds" />
            </div>
            <div v-else-if="pageFrom!=='msgWarn'&&formMsg.iconName!==''">
              <img :src="formMsg.iconUrl" alt="" width="100px">
            </div>

          </el-form-item>

          <el-form-item label="触发时刻:" prop="timeType">
            <el-checkbox-group v-model="formMsg.timeType">
              <el-checkbox label="IMMEDIATE">实时提醒</el-checkbox>
              <el-checkbox label="ABSOLUTE">绝对时间</el-checkbox>
              <el-checkbox label="RELATIVE" :disabled="formMsg.itemId===''">相对时间</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!--<div><h2>触发时刻(formMsg.timeType):</h2>{{formMsg.timeType}}</div>
          <div><h2>时间配置项数据(formMsg.timeConfig):</h2>{{formMsg.timeConfig}}</div>-->
          <!--触发时刻联动&#45;&#45;&#45;&#45;绝对时间 =========== START-->
          <section v-if="formMsg.timeType.indexOf('ABSOLUTE')>-1">
            <el-form-item label="绝对时间" prop="title" class="remind-rules"></el-form-item>
            <div class="border-dom">
              <el-row v-for="(item,index) in formMsg.timeConfig.ABSOLUTE" :key="index">
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
          <section v-if="formMsg.timeType.indexOf('RELATIVE')>-1">
            <el-form-item label="相对时间" prop="title" class="remind-rules"></el-form-item>
            <div class="border-dom">
              <el-row v-for="(item,index) in formMsg.timeConfig.RELATIVE" :key="index">
                <el-col :span="11">
                  <el-form-item label="选择字段:"  class="form-required">
                    <el-select v-model="item.keywordField"
                               style="width:90%;"
                               placeholder="请选择">
                      <section v-for="item3 in listTableFields" :key="item3.key">
                        <el-option
                          v-if="item3.type === 'datetime'"
                          :label="item3.keyName"
                          :value="item3.key">
                        </el-option>
                      </section>
                    </el-select>

                  </el-form-item>
                </el-col>
                <el-col :span="11">
                  <el-form-item label="比较时间:">
                    <el-input v-model="item.B" placeholder="请输入"  style="width:90%;"  @blur="ruleEventType('timeConfig','RELATIVE',index,'B')"/>分钟
                  </el-form-item>
                </el-col>

                <el-col :span="2" class="small-btn">
                  <el-button
                    v-if="index==0"
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
                    type="danger"
                    icon="el-icon-minus"
                    title="删除"
                    circle
                    @click="timeTypeReDel(index)"
                    size="mini"
                    class="button-model-del"
                  />
                </el-col>
              </el-row>
            </div>
          </section>
          <!--触发时刻联动&#45;&#45;&#45;&#45;相对时间 =========== END-->

          <el-form-item label="接收者:" prop="recipient">
            <el-checkbox-group v-model="formMsg.recipient">
              <el-checkbox v-for="(item,index) in recipientDic" :key="index" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <!--循环接收者数据 === START-->
          <div class="border-dom viewType-dom"
               style="padding-bottom: 0;"
               v-for="(item,index) in formMsg.msgPushInfoArray"
               :key="index"
          >
            <div class="recipientName">
              {{getrecipientName(item.id)}}
            </div>
            <el-form-item label="展现形式:" >
              <el-radio-group v-model="item.viewType">
                <el-radio  label="TEXT">文字</el-radio>
                <el-radio  label="IMAGE">图片</el-radio>
                <el-radio  label="AUDIO">音频</el-radio>
                <el-radio  label="VIDEO">视频</el-radio>
              </el-radio-group>
            </el-form-item>
            <!--展项形式=======START-->
            <section v-if="item.viewType === 'TEXT'">
              <el-form-item label="文字内容:">
                <el-row>
                  <el-col :span="20">
                    <el-input type="textarea" v-model="item.TEXT" placeholder="请输入不超过200个字符" maxlength="200" style="width:97%;" :rows="3" :id="`textarea${index}`" @blur="ruleEventType('msgPushInfoArray','nonee',index,'TEXT')" @input="textChange"/>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="primary" @click="insertAtCursor('{医嘱关键词}',index)" size="mini" style="margin-top: 2px;margin-left: -10px;">插入替换字段</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
            </section>
            <section v-if="item.viewType === 'IMAGE'">
              <el-form-item label="图片:">
                <el-row>
                  <el-col :span="5">
                    <upload-flied ref="uploadImageFile"
                                  btnName="上传"
                                  v-model="item.ImageFile"
                                  :data-name="item.uploadImageOption.dataName"
                                  :accept="item.uploadImageOption.accept"
                                  :limits="item.uploadImageOption.limits"
                                  :filelist="item.uploadImageOption.fileList"
                                  :before-upload="beforeUpload"
                                  :handle-exceed="handleExceed"
                                  :changeData="`${index},IMAGE`"
                                  :showFileView="false"
                                  :showFileList="true"
                                  showFileType="IMAGE"
                                  :fileSize=20
                                  :filePath="item.IMAGE"
                                  :fileName="item.fileName"
                                  @uploadFlieds="uploadFlieds" />
                  </el-col>
                </el-row>

              </el-form-item>
            </section>
            <section v-if="item.viewType === 'AUDIO'">
              <el-form-item label="音频:">
                <el-row>
                  <el-col :span="5">
                    <upload-flied ref="uploadAudioFile"
                                  v-model="item.AudioFile"
                                  :data-name="item.uploadAudioOption.dataName"
                                  :accept="item.uploadAudioOption.accept"
                                  :limits="item.uploadAudioOption.limits"
                                  :filelist="item.uploadAudioOption.fileList"
                                  :before-upload="beforeUpload"
                                  :handle-exceed="handleExceed"
                                  :changeData="`${index},AUDIO`"
                                  btnName="上传"
                                  :showFileView="false"
                                  :showFileList="true"
                                  showFileType="AUDIO"
                                  :fileSize=1024
                                  :filePath="item.AUDIO"
                                  :fileName="item.fileName"
                                  @uploadFlieds="uploadFlieds" />
                  </el-col>
                </el-row>

              </el-form-item>
            </section>
            <section v-if="item.viewType === 'VIDEO'">
              <el-form-item label="视频:">
                <el-row>
                  <el-col :span="5">
                    <upload-flied ref="uploadAudioFile"
                                  v-model="item.AudioFile"
                                  :data-name="item.uploadVideoOption.dataName"
                                  :accept="item.uploadVideoOption.accept"
                                  :limits="item.uploadVideoOption.limits"
                                  :filelist="item.uploadVideoOption.fileList"
                                  :before-upload="beforeUpload"
                                  :handle-exceed="handleExceed"
                                  :changeData="`${index},VIDEO`"
                                  btnName="上传"
                                  :showFileView="false"
                                  :showFileList="true"
                                  showFileType="VIDEO"
                                  :fileSize=1024
                                  :filePath="item.VIDEO"
                                  :fileName="item.fileName"
                                  @uploadFlieds="uploadFlieds" />
                  </el-col>
                </el-row>

              </el-form-item>
            </section>
            <!--展项形式=======END-->

            <!--接收终端====START-->
            <el-form-item label="接收终端:">
              <section v-for="(item3,index3) in item.resourceInfo" :key="index3" class="demo-device">
                <el-row v-if="item3.permissions.indexOf(item.id)>-1">
                  <el-col :span="2">
                    <el-checkbox :label="item3.id" v-model="item3.isCheckbox">{{item3.deviceName}}</el-checkbox>
                  </el-col>
                  <el-col :span="20" v-if="item.viewType === 'TEXT'">
                    <el-form-item label="跳转链接:">
                      <el-input v-model.trim="item3.url" placeholder="请输入可跳转路由" :disabled="!item3.isCheckbox"/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </section>
            </el-form-item>
            <!--接收终端====END-->

          </div>
          <!--循环接收者数据 === END-->
        </el-form>
      </slot>

      <!--底部按钮组-->
      <div class="footer-btn">
        <slot name="footer_btn">
          <el-button @click="backHandler">取消</el-button>
          <el-button type="primary" @click="msgSubmit">保存</el-button>
        </slot>
      </div>
    </el-main>

    <!-- 其他无固定位置元素 如弹窗等 -->
    <slot>
      <el-dialog
        title="选择插入字段"
        :visible.sync="dialogVisible"
        width="600px"
        :close-on-click-modal=false
        :close-on-press-escape=false
        :show-close="false"
      >
        <div class="dialog-textc">
          <div v-if="false">
            <span>请选择表：</span>
            <el-select v-model="textTable"
                       disabled
                       class="elinput-300"
                       @change="changetextTable"
                       :popper-append-to-body="false"
                       placeholder="请选择">
              <el-option v-for="item in tableList"
                         :key="item.tableName"
                         :label="item.tableNameExplain"
                         :value="item.tableName">
              </el-option>
            </el-select>
          </div>
          <div>
            <span>请选择字段：</span>
            <el-select v-model="textField"
                       class="elinput-300"
                       :popper-append-to-body="false"
                       placeholder="请选择">
              <el-option v-for="item in listTableFields"
                         :key="item.key"
                         :label="item.keyName"
                         :value="item.key">
              </el-option>
            </el-select>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">

          <el-button @click="dialogVisible = false">取 消</el-button>
<el-button type="primary" @click="textFieldSure">确 定</el-button>
        </span>
      </el-dialog>
    </slot>
  </el-container>
</template>

<script>
  import BaseEditForm from '../../common/BaseEditForm'
  import { deepMergeLeft } from '@/assets/wnms/utils'
  import * as msgWarnApi from '@/api/wnms//msgManage/msgWarn'
  import mains from './mixins'
  import uploadFlied from './uploadFlied-new'

  export default {
    components: { uploadFlied },
    mixins: [BaseEditForm, mains],
    props: {
      detail: {
        required: false,
        type: Object,
        default: () => {}
      },
      pageFrom: {
        type: String,
        default: () => {
          return 'msgWarn'
        }
      }
    },
    data () {
      const form = this.initForm()
      const rules = this.initRules()
      return {
        // 关联表
        RelatedTable: {
          sqlId: ''
        },
        RelatedtableList: [],
        unionRules: [], //关联表保存字段
        DeptInfo: {}, //护理单元信息
        detailData: {},
        iscanWatch: true, //是否可以进行监听的参数
        // 接收者选择插入字段的时候，选择字段
        dialogVisible: false,
        textTable: '', //替换的表名
        textField: '', //替换的字段名
        textIndex: '',
        // 表达式字典
        expressionList: [],
        // 选择的表的字段
        listTableFields: [],
        listTableFieldsString: '',
        //接收者字典
        recipientDic: [
          { id: 'PATIENT', name: '患者' },
          { id: 'NURSE', name: '护士' },
          { id: 'NURSE_HEAD', name: '护士长' },
          { id: 'DOCTOR', name: '医生' }
        ],
        //频率
        frequencyList: [
          { id: 0, name: '每天' },
          { id: 1, name: '隔天' },
          { id: 7, name: '每周' }
        ],
        eventTypeList: [], //消息类型字典
        // 设备仪器字典
        resourceInfoDic: [
          {
            id: 'wnBedSideExtension',
            deviceName: '床旁分机',
            permissions: 'PATIENT,NURSE,NURSE_HEAD,DOCTOR', //展示权限
            isCheckbox: false,
            url: ''
          },
          {
            id: 'wnBedHeadExtension',
            deviceName: '床头分机',
            permissions: 'PATIENT', //展示权限
            isCheckbox: false,
            url: ''
          },
          {
            id: 'bnPDA',
            deviceName: 'PDA',
            permissions: 'NURSE,NURSE_HEAD', //展示权限
            isCheckbox: false,
            url: ''
          },
          {
            id: 'wnMedicalAudioAssistant',
            deviceName: 'W101',
            permissions: 'NURSE,NURSE_HEAD,DOCTOR', //展示权限
            isCheckbox: false,
            url: ''
          },
          {
            id: 'bnNursingTV',
            deviceName: '触屏看板',
            permissions: 'NURSE,NURSE_HEAD', //展示权限
            isCheckbox: false,
            url: ''
          },
          {
            id: 'WEB',
            deviceName: 'web',
            permissions: 'NURSE,NURSE_HEAD,DOCTOR', //展示权限
            isCheckbox: false,
            url: ''
          }
        ],
        tableList: [
        ], //选择表字典
        // Icon上传设置
        uploadOption: {
          fileSize: 10,
          fileSizeUnit: '',
          dataName: '',
          accept: '.png,.jpg,bmp',
          limits: 1,
          fileList: []
        },
        /*展现形式上传配置 =====START*/
        uploadImageOption: {
          fileSizeUnit: '',
          dataName: '',
          accept: '.png,.jpg,bmp',
          limits: 1,
          fileList: []
        },
        uploadAudioOption: {
          fileSizeUnit: '',
          dataName: '',
          accept: '.mp3',
          limits: 1,
          fileList: []
        },
        uploadVideoOption: {
          fileSizeUnit: '',
          dataName: '',
          accept: '.mp4',
          limits: 1,
          fileList: []
        },

        /*展现形式上传配置 =====END*/
        form: form,
        formMsg: {
          // 接收者选择后配置项的变量
          msgPushInfoArray: [],
          // 规则配置存储变量
          focusRulesArray: {
            UPDATE: [],
            INSERT: [],
            DELETE: []
          },
          itemId: '', //侦听项id
          id: '',
          msgType: '', // 消息类型
          msgName: '', // 消息名称
          msgDesc: '', // 消息描述
          eventType: [], // 提醒规则
          focusRules: {
            UPDATE: [],
            INSERT: [],
            DELETE: []
          },
          icon: false, // 显示图标
          iconUrl: '', //图标路径
          timeType: [], //触发时刻
          //触发时刻-配置项
          timeConfig: {
            ABSOLUTE: [], //绝对时间
            RELATIVE: [] //相对时间
          },
          recipient: [], //接收者
          //接收者-配置项
          msgPushInfo: {},
          patientIdField: ''//患者id字段
        },
        rules: rules
      }
    },
    mounted () {
      this.DeptInfo = JSON.parse(localStorage.getItem("selectDeptInfo"))
      // 获取表
      msgWarnApi.getlistTables().then(res => {
        if (res.status === 200) {
          if (res.data !== null) this.tableList = res.data
        }
      })
      // 获取关联表
      /*this.RelatedtableList = [
        { id: 1,
          name: '宣教关联表',
          inFieldInfo: '[{"key":"articleId","type":"string","isVariable":"true","keyName":"宣教id"},{"key":"articleId","type":"string","isVariable":"true","keyName":"宣教名称"}]',
          outFieldInfo: '[{"key":"readCount","type":"int","isVariable":"true","keyName":"宣教的阅读次数"}]' },
        { id: 2,
          name: '体温关联表',
          inFieldInfo: '[{"key":"articleId","type":"string","isVariable":"true","keyName":"患者姓名"},{"key":"articleId","type":"string","isVariable":"true","keyName":"体温数据"}]',
          outFieldInfo: '[{"key":"readCount","type":"int","isVariable":"true","keyName":"宣教的阅读次数"}]' }
      ]*/
      msgWarnApi.getlistRelatedTables().then(res => {
        if (res.status === 200) {
          if (res.data !== null) this.RelatedtableList = res.data
        }
      })
      // 获取消息类型
      msgWarnApi.getConfigType().then(res => {
        if (res.status === 200 && res.data !== null) {
          console.log('消息类型:', res)
          this.eventTypeList = res.data
        }
      })
      // type !== add 为空的话 那么就是修改
      if (this.detail.type !== 'add') {
        this.iscanWatch = false
        msgWarnApi.Details(this.detail.row.eventId).then(res => {
          this.form.eventId = this.detail.row.eventId
          if (res.status === 200) {
            this.dealDetail(res.data)
          }
        })
      } else {
        // type == add 的话 那么就是添加
        deepMergeLeft(this.form, this.initForm())
      }

      // 校验
      this.$nextTick(() => {
        this.$refs['formMsg'].clearValidate()
      })
    },
    watch: {
      // 触发时刻联动监听
      'formMsg.timeType': {
        handler(newVal, oldVal) {
          if (!this.iscanWatch) return
          const _this = this
          console.log('触发时刻联动监听', '新值：' + JSON.stringify(newVal), '旧值：' + JSON.stringify(oldVal))

          //RELATIVE--相对定时
          if (newVal.indexOf('RELATIVE') > -1 && oldVal.indexOf('RELATIVE') < 0) {
            // 相对定时需要一个比较公式
            let e = _this.expressionList.find((ev, eindex) => {
              return ev.expressType === 5
            })
            if (!e || !e.expression || e.expression === '') {
              this.$message.error('选择表中相对定时没有配置公式，请与管理员联系')
              _this.formMsg.timeType.splice(_this.formMsg.timeType.findIndex(item => item === 'RELATIVE'), 1)
              return
            }
            let j = {
              timeConfig: '',
              timeExpress: e.expression || ''
            }
            _this.formMsg.timeConfig.RELATIVE.push(j)
          } else if (newVal.indexOf('RELATIVE') < 0 && oldVal.indexOf('RELATIVE') > -1) {
            _this.formMsg.timeConfig.RELATIVE = []
          }
          //ABSOLUTE--绝对定时
          if (newVal.indexOf('ABSOLUTE') > -1 && oldVal.indexOf('ABSOLUTE') < 0) {
            let j = {
              absoluteTime: '',
              executeCount: "",
              frequency: ""
            }
            _this.formMsg.timeConfig.ABSOLUTE.push(j)
          } else if (newVal.indexOf('ABSOLUTE') < 0 && oldVal.indexOf('ABSOLUTE') > -1) {
            _this.formMsg.timeConfig.ABSOLUTE = []
          }
        },
        immediate: false,
        deep: true
      },
      // 监听提醒规则的变化
      'formMsg.eventType': {
        handler(newVal, oldVal) {
          if (!this.iscanWatch) return
          const _this = this
          console.log('监听提醒规则的变化', JSON.stringify(newVal), JSON.stringify(oldVal))
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
          if (newVal.indexOf('INSERT') > -1 && oldVal.indexOf('INSERT') < 0) {
            _this.formMsg.focusRulesArray.INSERT.push(j)
          } else if (newVal.indexOf('INSERT') < 0 && oldVal.indexOf('INSERT') > -1) {
            _this.formMsg.focusRulesArray.INSERT = []
          }
          //UPDATE--新增、删除
          if (newVal.indexOf('UPDATE') > -1 && oldVal.indexOf('UPDATE') < 0) {
            _this.formMsg.focusRulesArray.UPDATE.push(j)
          } else if (newVal.indexOf('UPDATE') < 0 && oldVal.indexOf('UPDATE') > -1) {
            _this.formMsg.focusRulesArray.UPDATE = []
          }
          //DELETE--新增、删除
          if (newVal.indexOf('DELETE') > -1 && oldVal.indexOf('DELETE') < 0) {
            _this.formMsg.focusRulesArray.DELETE.push(j)
          } else if (newVal.indexOf('DELETE') < 0 && oldVal.indexOf('DELETE') > -1) {
            _this.formMsg.focusRulesArray.DELETE = []
          }
        },
        immediate: false,
        deep: true
      },
      // 监听接收者
      'formMsg.recipient': {
        handler(newVal, oldVal) {
          if (!this.iscanWatch) return
          const _this = this
          let j = {
            id: '',
            content: '',
            resourceInfo: [
              {
                id: 'wnBedSideExtension',
                deviceName: '床旁分机',
                permissions: 'PATIENT,NURSE,NURSE_HEAD,DOCTOR', //展示权限
                isCheckbox: false,
                url: ''
              },
              {
                id: 'wnBedHeadExtension',
                deviceName: '床头分机',
                permissions: 'PATIENT', //展示权限
                isCheckbox: false,
                url: ''
              },
              {
                id: 'bnPDA',
                deviceName: 'PDA',
                permissions: 'NURSE,NURSE_HEAD', //展示权限
                isCheckbox: false,
                url: ''
              },
              {
                id: 'wnMedicalAudioAssistant',
                deviceName: 'W101',
                permissions: 'NURSE,NURSE_HEAD,DOCTOR', //展示权限
                isCheckbox: false,
                url: ''
              },
              {
                id: 'bnNursingTV',
                deviceName: '触屏看板',
                permissions: 'NURSE,NURSE_HEAD', //展示权限
                isCheckbox: false,
                url: ''
              },
              {
                id: 'WEB',
                deviceName: 'web',
                permissions: 'NURSE,NURSE_HEAD,DOCTOR', //展示权限
                isCheckbox: false,
                url: ''
              }
            ],
            uploadImageOption: {
              fileSizeUnit: '',
              dataName: '',
              accept: '.png,.jpg,bmp',
              limits: 1,
              fileList: []
            },
            uploadAudioOption: {
              fileSizeUnit: '',
              dataName: '',
              accept: '.mp3',
              limits: 1,
              fileList: []
            },
            uploadVideoOption: {
              fileSizeUnit: '',
              dataName: '',
              accept: '.mp4',
              limits: 1,
              fileList: []
            },
            viewType: '',
            sort: 0
          }
          //PATIENT -患者--新增、删除
          if (newVal.indexOf('PATIENT') > -1 && oldVal.indexOf('PATIENT') < 0) {
            j.id = 'PATIENT'
            j.sort = 0
            _this.formMsg.msgPushInfoArray.push(j)
          } else if (newVal.indexOf('PATIENT') < 0 && oldVal.indexOf('PATIENT') > -1) {
            let i = _this.formMsg.msgPushInfoArray.findIndex((v, i) => {
              return v.id === 'PATIENT'
            })
            _this.formMsg.msgPushInfoArray.splice(i, 1)
          }
          //NURSE -护士--新增、删除
          if (newVal.indexOf('NURSE') > -1 && oldVal.indexOf('NURSE') < 0) {
            j.id = 'NURSE'
            j.sort = 1
            _this.formMsg.msgPushInfoArray.push(j)
          } else if (newVal.indexOf('NURSE') < 0 && oldVal.indexOf('NURSE') > -1) {
            let i = _this.formMsg.msgPushInfoArray.findIndex((v, i) => {
              return v.id === 'NURSE'
            })
            _this.formMsg.msgPushInfoArray.splice(i, 1)
          }
          //NURSE_HEAD -护士长--新增、删除
          if (newVal.indexOf('NURSE_HEAD') > -1 && oldVal.indexOf('NURSE_HEAD') < 0) {
            j.id = 'NURSE_HEAD'
            j.sort = 2
            _this.formMsg.msgPushInfoArray.push(j)
          } else if (newVal.indexOf('NURSE_HEAD') < 0 && oldVal.indexOf('NURSE_HEAD') > -1) {
            let i = _this.formMsg.msgPushInfoArray.findIndex((v, i) => {
              return v.id === 'NURSE_HEAD'
            })
            _this.formMsg.msgPushInfoArray.splice(i, 1)
          }
          //DOCTOR -医生--新增、删除
          if (newVal.indexOf('DOCTOR') > -1 && oldVal.indexOf('DOCTOR') < 0) {
            j.id = 'DOCTOR'
            j.sort = 3
            _this.formMsg.msgPushInfoArray.push(j)
          } else if (newVal.indexOf('DOCTOR') < 0 && oldVal.indexOf('DOCTOR') > -1) {
            let i = _this.formMsg.msgPushInfoArray.findIndex((v, i) => {
              return v.id === 'DOCTOR'
            })
            _this.formMsg.msgPushInfoArray.splice(i, 1)
          }

          _this.formMsg.msgPushInfoArray.sort(_this.compareMsg("sort"));

          console.log(_this.formMsg.msgPushInfoArray)
        },
        immediate: false,
        deep: false
      }
    },
    methods: {
      /**
       * 关联表处理
       * */
      // 添加关联表
      RelatedTableAdd() {
        for (let v of this.unionRules.values()) {
          if (v.sqlId === '') {
            this.$message({
              type: 'warning',
              message: '请先完善当前关联表信息!'
            })
            return
          }
        }
        let t = { sqlId: '', inConfig: {} }
        this.unionRules.push(t)
      },
      // 删除关联表
      RelatedTableDel(index) {
        this.listTableFields = JSON.parse(this.listTableFieldsString)
        this.unionRules.splice(index, 1)
        for (let v of this.unionRules.values()) {
          let rt = this.RelatedtableList.find((vt, it) => {
            return v.sqlId === vt.id
          })
          if (rt) this.listTableFields = [...this.listTableFields, ...JSON.parse(rt.outFieldInfo)]
        }
      },
      // 更改关联表
      changeRelated(index) {
        let sqlId = this.unionRules[index]['sqlId']
        let table = this.RelatedtableList.find((v, i) => {
          return v.id === sqlId
        })
        // 判断是否选了这个关联表,关联表只能选择一次 === START
        let cftable = 0
        for (let v of this.unionRules.values()) {
          if (v.sqlId === sqlId)cftable++
        }

        if (cftable === 2) {
          this.$message({
            type: 'warning',
            message: '关联表不能重复!'
          })
          this.unionRules[index]['sqlId'] = ''
          this.unionRules[index]['gl'] = []
          return
        }
        // 判断是否选了这个关联表,关联表只能选择一次 === END
        if (table.inFieldInfo && table.inFieldInfo !== null && table.inFieldInfo !== '') {
          this.unionRules[index]['gl'] = []
          let inFieldInfo = JSON.parse(table.inFieldInfo)
          for (let [i, v] of inFieldInfo.entries()) {
            this.unionRules[index]['gl'].push(Object.assign(v, { mainTableField: '' }))
          }
        }

        // 将选择的关联表的出参，并到全部字段中供选择
        this.listTableFields = JSON.parse(this.listTableFieldsString)
        for (let v of this.unionRules.values()) {
          let rt = this.RelatedtableList.find((vt, it) => {
            return v.sqlId === vt.id
          })
          if (rt) this.listTableFields = [...this.listTableFields, ...JSON.parse(rt.outFieldInfo)]
        }

        console.log('更改关联表,处理关联表入参匹配主表字段\n当前选择的表：', table, '\n关联表数据：', this.unionRules, index)
      },
      // 编辑回显关联表
      showRelatedTable() {
        const _this = this
        try {
          let unionRules = _this.detailData.unionRules
          unionRules = JSON.parse(unionRules)
          for (let v of unionRules) {
            let Obj = {
              sqlId: v.sqlId,
              gl: []
            }

            let inFieldInfo = JSON.parse((_this.RelatedtableList.find((v2) => v2.id === v.sqlId)).inFieldInfo)
            let outFieldInfo = JSON.parse((_this.RelatedtableList.find((v2) => v2.id === v.sqlId)).outFieldInfo)
            console.log('入参：', inFieldInfo, '\n出参：', outFieldInfo)
            for (let [ii, vv] of Object.entries(v.inConfig)) {
              let ru = inFieldInfo.find((vvv) => vvv.key === ii)
              Obj.gl.push(Object.assign(ru, { mainTableField: vv.match(/\[\$(\S*)\]/)[1] }))
            }
            _this.unionRules.push(Obj)
            // 初始化字段
            this.listTableFields = [...this.listTableFields, ...outFieldInfo]
          }
        } catch (e) {
          console.log('编辑回显关联表出错！！！！！！！！！！！！！！')
        }
      },
      textChange() {
        this.$forceUpdate()
      },
      // 处理详情信息==编辑
      dealDetail(data) {
        const _this = this
        _this.detailData = data
        //消息类型
        _this.formMsg.msgType = data.msgType
        //消息名称
        _this.formMsg.msgName = data.msgName
        //消息描述
        _this.formMsg.msgDesc = data.msgDesc
        //选择表（侦听项id）
        _this.formMsg.itemId = data.itemId
        _this.changeItemId('editContinue') //更新字段和公式
        //患者id字段

        _this.formMsg.patientIdField = data.patientIdField
        //提醒规则
        if (_this.formMsg.eventType && _this.formMsg.eventType !== null)_this.formMsg.eventType = data.eventType.split(',')
        // 显示图标
        _this.formMsg.iconUrl = data.icon === '' ? '' : data.icon
        _this.formMsg.iconName = data.iconName === '' ? '' : data.iconName
        _this.formMsg.icon = data.icon !== ''
        _this.uploadOption.fileList = [
          {
            name: _this.formMsg.iconName,
            url: _this.formMsg.iconUrl
          }
        ]
        //触发时刻
        if (_this.formMsg.timeType && _this.formMsg.timeType !== null)_this.formMsg.timeType = data.timeType.split(',')
        //接收者
        if (_this.formMsg.recipient && _this.formMsg.recipient !== null)_this.formMsg.recipient = data.recipient.split(',')

        //_this.iscanWatch=true
        if (_this.pageFrom === 'msgWarn' && data.deptIds !== '' && data.deptIds !== null) {
          const h = this.$createElement;
          this.$msgbox({
            title: '提示',
            message: h('p', null, [
              h('span', null, '系统数据显示，该条提醒已应用到护理单元，若是修改，需重新应用到对应护理单元，且会覆盖各护理单元的改动。请谨慎修改！')
            ]),
            showCancelButton: false,
            confirmButtonText: '关闭',
            showClose: false
          }).then(action => {

          });
        }
      },
      dealDetailJson() {
        const _this = this
        let data = _this.detailData

        // 编辑回显：处理提醒规则 ===== START
        if (_this.formMsg.eventType && _this.formMsg.eventType !== null) {
          _this.formMsg.focusRulesArray = {
            UPDATE: [],
            INSERT: [],
            DELETE: []
          }
          let focusRules = eval('(' + data.focusRules + ')')
          for (let i = 0; i < _this.formMsg.eventType.length; i++) {
            let ent = _this.formMsg.eventType[i]
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
                    if (v2.expressType === 0) {
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
                    }
                  }
                }

                _this.formMsg.focusRulesArray[ent].push(j)
              }
            }

            if (ent === 'DELETE') {
              let j = {
                "ruleid": "",
                "ruleContent": '',
                "InConfig": "",
                "A": "",
                "B": "",
                "keywordField": "",
                "keywordValue": "",
                "eid": "",
                "expressType": '',
                functionArgs: {}
              }
              for (let v2 of _this.expressionList.values()) {
                if (v2.functionName.indexOf('删除') > -1) {
                  j.eid = v2.eid
                }
              }
              _this.formMsg.focusRulesArray.DELETE.push(j)
            }
          }
        }
        // 编辑回显：处理提醒规则 ===== END

        // 编辑回显：处理触发时刻 =========START
        if (_this.formMsg.timeType && _this.formMsg.timeType !== null) {
          _this.formMsg.timeConfig = {
            "ABSOLUTE": [],
            "RELATIVE": []
          }
          let timeConfig = eval('(' + data.timeConfig + ')')
          for (let i = 0; i < _this.formMsg.timeType.length; i++) {
            let ent = _this.formMsg.timeType[i]
            if (ent === 'ABSOLUTE') {
              _this.formMsg.timeConfig[ent] = timeConfig[ent]
            } else if (ent === 'RELATIVE') {
              for (let v of timeConfig['RELATIVE'].values()) {
                let timeConfig = eval('(' + v.timeConfig + ')')
                let j = {
                  "timeConfig": "",
                  "timeExpress": "",
                  "keywordField": "",
                  "B": ""
                }
                for (let kk in timeConfig) {
                  if (kk === 'b') {
                    j.B = timeConfig[kk]
                  } else {
                    let aVal = timeConfig[kk].match(/\[\$(\S*)\]/)
                    if (aVal[1]) j.keywordField = aVal[1]
                  }
                }
                _this.formMsg.timeConfig[ent].push(j)
              }
            }
          }
        }
        // 编辑回显：处理触发时刻 =========END
        // 编辑回显：处理接收者相关配置 =========START
        if (_this.formMsg.recipient && _this.formMsg.recipient !== null) {
          let pushMsgInfo = eval('(' + data.pushMsgInfo + ')')
          _this.formMsg.msgPushInfoArray = []
          for (let k in pushMsgInfo) {
            let sort = 0
            if (k === 'NURSE') {
              sort = 1
            } else if (k === 'NURSE_HEAD') {
              sort = 2
            } else if (k === 'DOCTOR') {
              sort = 3
            }
            let j = {
              id: k,
              content: '',
              resourceInfo: [
                {
                  id: 'wnBedSideExtension',
                  deviceName: '床旁分机',
                  permissions: 'PATIENT,NURSE,NURSE_HEAD,DOCTOR', //展示权限
                  isCheckbox: false,
                  url: ''
                },
                {
                  id: 'wnBedHeadExtension',
                  deviceName: '床头分机',
                  permissions: 'PATIENT', //展示权限
                  isCheckbox: false,
                  url: ''
                },
                {
                  id: 'bnPDA',
                  deviceName: 'PDA',
                  permissions: 'NURSE,NURSE_HEAD', //展示权限
                  isCheckbox: false,
                  url: ''
                },
                {
                  id: 'wnMedicalAudioAssistant',
                  deviceName: 'W101',
                  permissions: 'NURSE,NURSE_HEAD,DOCTOR', //展示权限
                  isCheckbox: false,
                  url: ''
                },
                {
                  id: 'bnNursingTV',
                  deviceName: '触屏看板',
                  permissions: 'NURSE,NURSE_HEAD', //展示权限
                  isCheckbox: false,
                  url: ''
                },
                {
                  id: 'WEB',
                  deviceName: 'web',
                  permissions: 'NURSE,NURSE_HEAD,DOCTOR', //展示权限
                  isCheckbox: false,
                  url: ''
                }
              ],
              viewType: pushMsgInfo[k]['viewType'],
              sort: sort,
              secondsDuration: pushMsgInfo[k]['secondsDuration'],
              secondsDurationFormat: pushMsgInfo[k]['secondsDurationFormat'], //音频时长(hh:mm:ss)
              fileName: pushMsgInfo[k]['fileName'],
              uploadImageOption: {
                fileSizeUnit: '',
                dataName: '',
                accept: '.png,.jpg,bmp',
                limits: 1,
                fileList: []
              },
              uploadAudioOption: {
                fileSizeUnit: '',
                dataName: '',
                accept: '.mp3',
                limits: 1,
                fileList: []
              },
              uploadVideoOption: {
                fileSizeUnit: '',
                dataName: '',
                accept: '.mp4',
                limits: 1,
                fileList: []
              }
            }
            j[pushMsgInfo[k]['viewType']] = pushMsgInfo[k]['content']
            let resourceInfo = eval('(' + pushMsgInfo[k]['resourceInfo'] + ')')

            for (let v of resourceInfo.values()) {
              let indexR = j.resourceInfo.findIndex((val, index) => {
                return val.id === v.deviceName
              })
              j.resourceInfo[indexR]['isCheckbox'] = true
              j.resourceInfo[indexR]['url'] = v.url
            }
            _this.formMsg.msgPushInfoArray.push(j)
            console.log(j)
          }
          _this.formMsg.msgPushInfoArray.sort(_this.compareMsg("sort"))
        }
        // 编辑回显：处理接收者相关配置 =========END
        this.iscanWatch = true
      },
      //手动表单验证
      ruleEventType(array, type, index, val) {
        try {
          if (type === 'nonee') {
            let v = this.formMsg[array][index][val]
            if (v === '' || !v) {
              this.$message.warning('必填项不能为空！')
            }
          } else {
            let v = this.formMsg[array][type][index][val]
            let isVariable = this.formMsg[array][type][index]['functionArgs'][val]['isVariable']
            console.log('手动表单验证:', array, type, index, val, v, 'isVariable:' + isVariable)

            if (v === '' || !v) {
              if (isVariable) this.$message.warning('必填项不能为空！')
            }
          }
        } catch (e) {
          console.log('手动表单验证代码出错------------')
        }
      },
      //选择公式后更该公式类型
      changeExpress(i, t) {
        console.log(this.formMsg.focusRulesArray[t][i], this.expressionList)
        let eid = this.formMsg.focusRulesArray[t][i]['eid']
        let item = this.expressionList.find((v, i) => {
          return v.eid === eid
        })
        console.log('选择公式后更该公式类型', item)
        this.formMsg.focusRulesArray[t][i]['expressType'] = item.expressType
        this.formMsg.focusRulesArray[t][i]['ruleContent'] = item.expression
        this.formMsg.focusRulesArray[t][i]['functionArgs'] = item.functionArgs
      },
      //根据选中的表查询字段\查询表达式
      changetextTable() {
        msgWarnApi.getlistTableFields({ table: this.textTable }).then(res => {
          if (res.status === 200) {
            if (res.data !== null) {
              this.textFields = JSON.parse(res.data[0].fieldInfo)
            }
          }
        })
      },
      changeItemId(type) {
        // 获取选择表的字段
        msgWarnApi.getlistTableFields({ table: this.formMsg.itemId }).then(res => {
          if (res.status === 200) {
            if (res.data !== null) {
              this.listTableFields = JSON.parse(res.data[0].fieldInfo)
              this.listTableFieldsString = res.data[0].fieldInfo
              console.log('获取选择表的字段', this.listTableFields)
            }
          }
        })
        msgWarnApi.getExpressionList({ itemId: this.formMsg.itemId }).then(res => {
          // 获取选择表的公式

          if (res.status === 200) {
            if (res.data !== null) {
              for (let v of res.data.values()) {
                if (v.functionArgs !== null) {
                  v.functionArgs = JSON.parse(v.functionArgs)
                }
              }
              this.expressionList = res.data
              console.log('获取选择表的公式', this.expressionList)

              if (type && type === 'editContinue') {
                // 回显关联表
                this.showRelatedTable()
                this.dealDetailJson()
              } else {
                // 清空患者id
                this.formMsg.patientIdField = ''

                // 清空规则
                this.formMsg.eventType = []

                this.formMsg.focusRulesArray = {
                  UPDATE: [],
                  INSERT: [],
                  DELETE: []
                }

                // 清空触发时刻
                this.formMsg.timeType = []
                this.formMsg.timeConfig = {
                  ABSOLUTE: [], //绝对时间
                  RELATIVE: [] //相对时间
                }

                // 清空关联表
                this.unionRules = []

                setTimeout(() => {
                  this.$refs.formMsg.clearValidate()
                }, 10)
              }
            }
          }
        })
      },
      // 排序：
      compareMsg(property) {
        return function (a, b) {
          var v1 = a[property];
          var v2 = b[property];
          return v1 - v2;
        }
      },
      // 获取接收者名称
      getrecipientName (t) {
        return this.recipientDic.find((v, i) => {
          return v.id === t
        }).name
      },
      /**
       * /触发时刻联动-绝对时间：添加、删除
       */
      timeTypeDel(index) {
        this.formMsg.timeConfig.ABSOLUTE.splice(index, 1)
      },
      timeTypeAdd() {
        if (this.formMsg.timeConfig.ABSOLUTE.length < 3) {
          let j = {}
          this.formMsg.timeConfig.ABSOLUTE.push(j)
        } else {
          this.$message.warning('每类规则可最多增加至3条！')
        }
      },
      /**
       * /触发时刻联动-相对时间：添加、删除
       */
      timeTypeReDel(index) {
        this.formMsg.timeConfig.RELATIVE.splice(index, 1)
      },
      timeTypeReAdd() {
        if (this.formMsg.timeConfig.RELATIVE.length < 3) {
          let j = {}
          this.formMsg.timeConfig.RELATIVE.push(j)
        } else {
          this.$message.warning('每类规则可最多增加至3条！')
        }
      },

      /**
       * 规则添加模块：添加、删除
       * */
      ruleAddAdd() {
        if (this.formMsg.focusRulesArray.INSERT.length < 3) {
          let j = {}
          this.formMsg.focusRulesArray.INSERT.push(j)
        } else {
          this.$message.warning('每类规则可最多增加至3条！')
        }
      },
      ruleAddDel(index) {
        this.formMsg.focusRulesArray.INSERT.splice(index, 1)
      },
      /**
       * 规则修改模块：添加、删除
       * */
      ruleModifyAdd() {
        if (this.formMsg.focusRulesArray.UPDATE.length < 3) {
          let j = {}
          this.formMsg.focusRulesArray.UPDATE.push(j)
        } else {
          this.$message.warning('每类规则可最多增加至3条！')
        }
      },
      ruleModifyDel(index) {
        this.formMsg.focusRulesArray.UPDATE.splice(index, 1)
      },

      // 文件上超出个数的钩子
      handleExceed (files, fileList) {
        this.$message.warning(`当前限制选择 ${this.uploadOption.limits} 个文件，本次选择了 ${files.length} 个文件，已超出个数限制!`)
      },

      // 文件上传前的钩子
      beforeUpload (file) {
        const isLt2M = file.size / 1024 / 1024 < this.uploadOption.fileSize
        if (!isLt2M) {
          this.$message.error(`上传文件大小不能超过 ${this.uploadOption.fileSize + (this.uploadOption.fileSizeUnit || 'MB')}!`)
        }

        // 设置上传文件名
        // this.uploadOption.dataName = this.formContent.audioName

        return isLt2M
      },

      // 接收上传组件得返回结果
      uploadFlieds (res, changeData, fileStatus) {
        console.log('上传附件成功后、删除附件回调：\n', res, changeData, fileStatus)
        // 附件上傳在準備階段，不處理任何數據
        if (fileStatus === 'ready') {
          return
        }

        if (res.data !== 'remove') {
          if (changeData === 'icon') {
            if (res === 'clear') {
              this.formMsg.iconUrl = ''
            } else {
              let data = JSON.parse(res.data)
              this.formMsg.iconUrl = data.url
              this.formMsg.iconName = data.name
            }
          } else {
            let j = changeData.split(",")
            if (res === 'clear') {
              this.formMsg.msgPushInfoArray[j[0]][j[1]] = ''
            } else {
              let data = JSON.parse(res.data)
              this.formMsg.msgPushInfoArray[j[0]][j[1]] = data.url
              this.formMsg.msgPushInfoArray[j[0]]['secondsDuration'] = data.secondsDuration // 时长
              this.formMsg.msgPushInfoArray[j[0]]['secondsDurationFormat'] = data.secondsDurationFormat //音频时长(hh:mm:ss)
              this.formMsg.msgPushInfoArray[j[0]]['fileName'] = data.name // 附件名
            }
          }
        } else {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          if (changeData === 'icon') {
            this.formMsg.iconUrl = ''
            this.formMsg.iconName = ''
          } else {
            let j = changeData.split(",")
            this.formMsg.msgPushInfoArray[j[0]][j[1]] = ''
            this.formMsg.msgPushInfoArray[j[0]]['secondsDuration'] = '' //音频时长(hh:mm:ss)
            this.formMsg.msgPushInfoArray[j[0]]['secondsDurationFormat'] = '' // 时长
            this.formMsg.msgPushInfoArray[j[0]]['fileName'] = '' // 附件名
          }
        }

        console.log(this.formMsg.msgPushInfoArray)
        //res="{"name":"478c1b0da7a76cb54512be438ce9fa1e.jpg","url":"/resource/img/20200511/943940bb3514446f83fb091a19f99140.jpg"}"
        /*if (res.data === '') {
          this.formMsg.iconUrl =''
        } else {
          this.formMsg.iconUrl = JSON.parse(res.data).url
          // 清除上传组件验证结果
          this.$refs['formMsg'].clearValidate(['fileUrl'])
        }*/
      },
      // 清除表单验证
      clearValidate (refs) {
        this.$nextTick(() => {
          this.$refs[refs].clearValidate()
        })
      },
      // 插入关键词
      textFieldSure() {
        if (this.textTable === '' || this.textField === '') {
          this.$message.warning('请先选择字段！')
          return
        }
        this.dialogVisible = false
        //let myValue = `|${this.textTable}-${this.textField}|`
        let myValue = `[$${this.textField}]`
        this.insertAtCursort(myValue, this.textIndex)
      },
      async insertAtCursort(myValue, index) {
        let id = '#textarea' + index
        const myField = document.querySelector(id)
        if (myField.selectionStart || myField.selectionStart === 0) {
          var startPos = myField.selectionStart
          var endPos = myField.selectionEnd
          this.formMsg.msgPushInfoArray[index]['TEXT'] =
            myField.value.substring(0, startPos) +
            myValue +
            myField.value.substring(endPos, myField.value.length)
          await this.$nextTick() // 这句是重点, 圈起来
          myField.focus()
          myField.setSelectionRange(
            endPos + myValue.length,
            endPos + myValue.length
          )
        } else {
          this.formMsg.msgPushInfoArray[index]['TEXT'] += myValue
        }
      },
      async insertAtCursor (myValue, index) {
        let t = this.tableList.find((v, i) => {
          return v.itemId === this.formMsg.itemId
        })
        if (!t) {
          this.$message.warning('请先选择表！')
          return
        }

        this.textIndex = index
        this.textTable = t.tableName
        this.textField = ''
        this.dialogVisible = true
      },
      // 点击保存按钮，处理提交数据
      msgSubmit() {
        const _this = this

        // 手写表单验证模块 ===== START
        // 图标
        if (_this.formMsg.icon && _this.formMsg.iconUrl === '') {
          this.$message.warning('请上传图标！')
          return
        }
        // 提醒规则
        try {
          for (let i = 0; i < _this.formMsg.eventType.length; i++) {
            let ety = _this.formMsg.eventType[i]
            for (let v of _this.formMsg.focusRulesArray[ety].values()) {
              if (!v.eid || v.eid === '') {
                this.$message.warning('提醒规则请选择公式！')
                return
              }
              if (v.expressType === 0) {
                if (v.A === '' || (v.B === '' && v.functionArgs['B']['isVariable'])) {
                  this.$message.warning('提醒规则选择后，请选择字段或输入参数！')
                  return
                }
              } else if (v.expressType === 1) {
                if (v.keywordField === '' || v.keywordValue === '' || !v.keywordField || !v.keywordValue) {
                  this.$message.warning('提醒规则选择后，请选择字段或输入参数！')
                  return
                }
              }
            }
          }
        } catch (e) {
          console.log('验证提醒规则中有错误！！')
        }

        // 触发时刻
        for (let i = 0; i < _this.formMsg.timeType.length; i++) {
          let ety = _this.formMsg.timeType[i]

          if (_this.formMsg.timeConfig[ety]) {
            for (let v of _this.formMsg.timeConfig[ety].values()) {
              if (ety === 'ABSOLUTE') {
                if (v.frequency === undefined || v.frequency === '') {
                  this.$message.warning('触发时刻选择绝对时间后，请选择频率！')
                  return
                }
                if (!v.absoluteTime || v.absoluteTime === '') {
                  this.$message.warning('触发时刻选择绝对时间后，请选择时间！')
                  return
                }
                if (v.executeCount && v.executeCount !== '') {
                  // 次数”输入框限制输入1000以内的正整数
                  let re = /^\d+$|^\d*\.\d+$/g
                  if (!re.test(v.executeCount)) {
                    this.$message.warning('触发时刻选择绝对时间后，输入次数限制为不大于1000的正整数！')
                    return
                  } else {
                    if (v.executeCount > 1000) {
                      this.$message.warning('触发时刻选择绝对时间后，输入次数限制为不大于1000的正整数！')
                      return
                    } else if (v.executeCount < 1) {
                      this.$message.warning('触发时刻选择绝对时间后，输入次数限制为不大于1000的正整数！')
                      return
                    }
                  }
                }
              } else if (ety === 'RELATIVE') {
                if (!v.keywordField || v.keywordField === '') {
                  this.$message.warning('触发时刻选择相对时间后，请选择对比字段！')
                  return
                }
                if (!v.B || v.B === '') {
                  this.$message.warning('触发时刻选择相对时间后，请输入时间常量！')
                  return
                } else {
                  let VB = v.B
                  if (VB < 0)VB *= -1
                  /*let re =  /^[0-9]+.?[0-9]*!/
                  console.log(re.test(VB),VB,Number(VB).toString())*/
                  if (Number(VB).toString() === 'NaN') {
                    this.$message.warning('触发时刻选择相对时间后，输入的比较时间为数字！')
                    return
                  }
                }
              }
            }
          }
        }

        // 接收者
        for (let v of _this.formMsg.msgPushInfoArray.values()) {
          let isChr = v.resourceInfo.findIndex((rval, rindex) => {
            return rval.permissions.includes(v.id) && rval.isCheckbox
          })
          if (isChr === -1) {
            this.$message.warning('接收者选择后，请选择接收终端！')
            return
          }

          if (v.viewType === '') {
            this.$message.warning('接收者选择后，请选择展现形式！')
            return
          }
          if (!v[v.viewType] || v[v.viewType] === '') {
            this.$message.warning('接收者选择后，输入文字或者上传附件！')
            return
          }
          if (v.viewType === 'TEXT') {
            v.AUDIO = ''
            v.fileName = ''
            v.secondsDurationFormat = ''
            v.secondsDuration = ''
          } else {
            v.TEXT = ''
            for (let v2 of v.resourceInfo) {
              v2.url = ''
            }
          }
          for (let v2 of v.resourceInfo.values()) {
            if (v2.isCheckbox && v2.url !== '') {
              let u = v2.url.split('/')
              if (v2.url.indexOf('/') !== 0) {
                this.$message.warning('接收终端跳转URL不符合规范，请检查！')
                return
              }
            }
          }
        }

        // 手写表单验证模块 ===== END

        this.$refs.formMsg.validate((valid) => {
          if (!valid) return false
          this.$confirm('确定要保存吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showClose: false
          }).then(() => {
            try {
              //消息类型
              _this.form.msgType = _this.formMsg.msgType
              //消息名称
              _this.form.msgName = _this.formMsg.msgName
              //消息描述
              _this.form.msgDesc = _this.formMsg.msgDesc
              //选择表（侦听项id）
              _this.form.itemId = _this.formMsg.itemId
              //患者id字段
              _this.form.patientIdField = _this.formMsg.patientIdField
              // 关联表信息
              _this.form.unionRules = []
              for (let v of _this.unionRules) {
                let Obj = {
                  sqlId: v.sqlId,
                  inConfig: {}
                }
                for (let v2 of v.gl) {
                  Obj.inConfig[v2.key] = `[$${v2.mainTableField}]`
                }
                _this.form.unionRules.push(Obj)
              }
              _this.form.unionRules = JSON.stringify(_this.form.unionRules)
              //提醒规则
              _this.form.eventType = _this.formMsg.eventType.join(',')
              // 显示图标
              _this.form.icon = _this.formMsg.icon ? _this.formMsg.iconUrl : ''
              _this.form.iconName = _this.formMsg.iconName ? _this.formMsg.iconName : ''
              //触发时刻
              _this.form.timeType = _this.formMsg.timeType.join(',')
              //接收者
              _this.form.recipient = _this.formMsg.recipient.join(',')

              // 保存时，处理提醒规则 ===== START
              let focusRules = {}

              for (let i = 0; i < _this.formMsg.eventType.length; i++) {
                let ety = _this.formMsg.eventType[i]
                if (ety === 'DELETE') continue
                focusRules[ety] = []
                let arr = _this.formMsg.focusRulesArray[ety]
                for (let v of arr.values()) {
                  let j = {
                    ruleContent: v.ruleContent,
                    InConfig: ''
                  }
                  let InConfig = {}
                  // A>B 公式
                  if (v.expressType === 0) {
                    InConfig['a'] = `[$${v.A}]`
                    InConfig['b'] = v.B
                  } else if (v.expressType === 1) {
                    //关键字匹配公式
                    InConfig[v.keywordField] = v.keywordValue
                  }
                  j.InConfig = JSON.stringify(InConfig)

                  focusRules[ety].push(j)
                }
              }
              _this.form.focusRules = JSON.stringify(focusRules)
              // 保存时，处理提醒规则 ===== END
              // 保存时，处理触发时刻 =========START
              let timeConfig = {}
              if (_this.formMsg.timeType.indexOf('ABSOLUTE') > -1) {
                let ABSOLUTE = _this.formMsg.timeConfig.ABSOLUTE
                for (let vA of ABSOLUTE.values()) {
                  //if (vA.absoluteTime && vA.absoluteTime.indexOf('2020-01-01') < 0)vA.absoluteTime = '2020-01-01 ' + vA.absoluteTime + ':00'
                  if (vA.absoluteTime) {
                    if (vA.absoluteTime.includes('-'))vA.absoluteTime = vA.absoluteTime.split(" ")[1]
                    vA.absoluteTime = vA.absoluteTime.substr(0, 5) + ':00'
                    console.log(vA.absoluteTime)
                  }
                }
                timeConfig.ABSOLUTE = ABSOLUTE
              }
              if (_this.formMsg.timeType.indexOf('RELATIVE') > -1) {
                timeConfig.RELATIVE = []
                let arr = _this.formMsg.timeConfig.RELATIVE

                // 相对定时需要一个比较公式
                let e = _this.expressionList.find((ev, eindex) => {
                  return ev.expressType === 5
                })
                if (!e || !e.expression || e.expression === '') {
                  this.$message.error('选择表中相对定时没有配置公式，请与管理员联系')
                  return
                }
                for (let v of arr.values()) {
                  let j = {
                    timeExpress: e.expression,
                    timeConfig: ''
                  }
                  // 找到相对时间的对应字段
                  let obj = {}
                  //obj[v.keywordField] = '[$'+v.keywordField+']'
                  obj.a = '[$' + v.keywordField + ']'
                  obj.b = v.B
                  j.timeConfig = JSON.stringify(obj)

                  timeConfig.RELATIVE.push(j)
                }
              }
              _this.form.timeConfig = JSON.stringify(timeConfig)

              // return

              // 保存时，处理触发时刻 =========END
              // 保存时，处理接收者相关配置 =========START
              let msgPushInfo = {}
              let arr = _this.formMsg.msgPushInfoArray
              for (let v of arr.values()) {
                msgPushInfo[v.id] = {
                  secondsDuration: v.secondsDuration,
                  secondsDurationFormat: v.secondsDurationFormat, //音频时长(hh:mm:ss)
                  fileName: v.fileName,
                  viewType: v.viewType,
                  content: v[v.viewType],
                  resourceInfo: ''
                }
                let resourceInfo = []
                for (let v2 of v.resourceInfo.values()) {
                  if (v2.isCheckbox) {
                    let rObj = {
                      deviceName: v2.id,
                      url: v2.url
                    }
                    resourceInfo.push(rObj)
                  }
                }
                msgPushInfo[v.id].resourceInfo = JSON.stringify(resourceInfo)
              }

              _this.form.pushMsgInfo = JSON.stringify(msgPushInfo)

              if (_this.pageFrom === 'msgWarnUse') {
                _this.form.deptIds = this.detail.selectDeptId
              }

              console.log('保存表单：', JSON.stringify(_this.form))
              // 保存时，处理接收者相关配置 =========END
              _this.customSubmitHandler()
            } catch (e) {
              console.log('处理保存数据的form时有错误！！')
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
        })
      },
      // 保存数据
      customSubmitHandler () {
        // ID 为空的话 那么就是修改
        if (this.detail.type !== 'add') {
          if (this.pageFrom === 'msgWarnUse') {
            // 护理单元进来修改的时候，请求另一个接口
            msgWarnApi.EditUse(this.form).then(data => {
              this.submitSuccessHandler(data)
            })
          } else {
            msgWarnApi.Edit(this.form).then(data => {
              this.submitSuccessHandler(data)
            })
          }
        } else {
          // ID 为空的话 那么就是添加
          msgWarnApi.Add(this.form).then(data => {
            this.submitSuccessHandler(data)
          })
        }
      },
      backHandler (data) {
        console.log('这是添加页的放回',this.detail)
        this.$emit('option-changed', 'list', {search:this.detail.search,selectDeptId:this.detail.selectDeptId})
      },
    }
  }
</script>
<style lang="scss">
  //@import url(); 引入公共css类
  @import '@/assets/wnms/css/self_common.scss';
  .htmlinfo{
    display: none;
  }
  // 提醒规则样式
  .remind-rules{
    margin: 15px 0 6px 0 !important;
    .el-form-item__label{
      text-align: center !important;
    }
  }
  .border-dom{
    min-height: 30px;
    border:1px solid #EBEEF5;
    width: 97%;
    margin: 0 auto;
    padding: 0 0 20px 0;
    margin-bottom: 20px;
    .el-row{
      margin-top: 20px;
      .small-btn{
        .el-button{
          position: absolute;
          top: 5px;
          margin-left: -16px;
        }
      }
      .el-col{
        .el-form-item{
          margin-bottom: 0;
          .el-form-item__label{
            width: 100px !important;
          }
          .el-form-item__content{
            margin-left: 100px !important;
          }
        }
      }
    }
  }
  .viewType-dom{
    .el-form-item{
      .demo-device{
        margin-top: 12px;
      }
      .demo-device:first-child{
        margin-top: 0;
      }

      .el-form-item__label{
        width: 100px !important;
      }
      .el-form-item__content{
        margin-left: 100px !important;
        .el-row:first-child{
          margin-top: 0;
        }
      }
    }
    .recipientName{
      width: 80px;
      text-align: center;
      padding: 10px 0;
    }
  }
  .form-required:before{
    content: '*';
    color: #F56C6C;
    position: absolute;
    top: 8px;
    left: 10px;
  }
  .dialog-textc{
    width: 80%;
    text-align: center;
    margin: 0 auto;

    >div{
      margin: 20px 0;
      >span{
        display: inline-block;
        width: 100px;
        text-align: right;
      }
      .el-select{
        .el-popper{
          width: 300px;
          ul{
            li{
              text-align: left;
            }
          }
        }
      }
    }
  }
</style>
