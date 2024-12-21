<template>
    <!--事件备忘-->
    <div class="typt-list-container">
        <!--查询-->
        <el-form :inline="true" :model="formSearchData" class="demo-form-inline" ref="formSearch">
            <el-form-item label="查询日期：">
                <el-date-picker
                        style="width: 182px;height: 34px;"
                        v-model="formSearchData.searchDate"
                        type="date"
                        size="small"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <div class="typt-search-btn">
                    <el-button type="primary"
                               class="el-button-radius"
                               icon="el-icon-search"
                               @click="onSearchSubmit" size="small">搜索
                    </el-button>
                    <el-button type="text" @click="reload">重置</el-button>
                </div>
            </el-form-item>
        </el-form>
        <!--end-->
        <hr/>
        <div class="typt-list-add-div">
            <el-button type="warning" size="small" style="width: 80px;"
                       @click="$emit('option-changed', 'add', { businessType: formSearchData.businessType })"
                       icon="el-icon-plus">添加
            </el-button>
        </div>
        <!--列表-->
        <el-table
                :data="tableData"
                :stripe="CONFIG.table.stripe"
                v-loading="loading"
                height="80%"
        >
            <el-table-column
                    prop="beginDate"
                    align="center"
                    label="开始时间"
            >
            </el-table-column>
            <el-table-column
                    prop="endDate"
                    align="center"
                    label="结束时间">
            </el-table-column>
            <el-table-column
                    prop="noteDescribe"
                    align="center"
                    label="备注"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="操作"
                    width="200">
                <template slot-scope="scope">
                    <el-button type="text"
                               @click="$emit('option-changed', 'add', { businessType: formSearchData.businessType }, scope.row)">
                        编辑
                    </el-button>
                    <el-button type="text" @click="del(scope.row)" style="color: #f56c6c">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--end-->
        <!--分页-->
        <div class="paginationDiv">
            <!--组件页码显示-->
            <page-info :pageInfo="pageInfo"></page-info>
        </div>
        <!--end-->
    </div>
</template>

<script>
    import BaseManage from '../../../assets/hsms/mixins/BaseManage'
    import PageInfo from '../../../components/hsms/PageInfoCommon'
    import config from '../../../assets/hsms/mixins/config'

    export default {
        name: 'NurseRemark',
        mixins: [BaseManage, config],
        components: {PageInfo},
        props: ['params'],
        data() {
            return {
                modelName: '事件备忘',
                formSearchData: {
                    searchDate: '',
                    businessType: 'NURSE'
                },
                url: '/hsms/web-hs/note'
            }
        },
        created() {
            this.formSearchData.businessType = this.params.businessType
            this.getData()
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../assets/hsms/css/self_common";

    .el-button--small {
        padding: 6px 16px !important;
        border-radius: 2px !important;
    }
</style>
