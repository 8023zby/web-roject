<template>
  <layout>
    <div slot="aside">
      <patient-list @initPatient="initPatient" initRowType="in" initRowIndex="0" ref="patientList"></patient-list>
    </div>
    <div slot="main" class="right">
      <layout-list>
        <div slot="query" class="query-items">
          <el-form class="demo-form-inline" :inline="true" :model="searchData" ref="formSearch">
            <el-form-item label="开嘱时间：">
							<el-date-picker
      					v-model="searchData.startAdviceDate"
      					type="date"
      					placeholder="选择开嘱时间"
								v-uni="'yongyaoguanli_search_date'" 
								value-format="yyyy-MM-dd"
							>
    					</el-date-picker>
            </el-form-item>
            <el-form-item label="用药名称：">
              <el-input 
								size="small" 
								v-model="searchData.medicationName" 
								v-uni="'yongyaoguanli_search_name'" 
								placeholder="请输入用药名称" 
								clearable
							></el-input>
            </el-form-item>
            <el-form-item>
              <el-button 
								type="primary" 
								v-uni="'yongyaoguanli_search'" 
								icon="el-icon-search" 
								@click="search" 
								size="small"
							>搜索</el-button>
              <el-button 
								type="text" 
								v-uni="'yongyaoguanli_reset'" 
								@click="reset"
							>重置</el-button>
            </el-form-item>
          </el-form>
        </div>
				<div slot="main" class="main-list table">
					<el-table
        		ref="table"
        		:data="tableData"
        		stripe
        		highlight-current-row
        		height="100%"
					>
      			<el-table-column
        			prop="medicationName"
        			align="center"
        			:show-overflow-tooltip = "true"
        			label="用药名称">
      			</el-table-column>
						<el-table-column
        			prop="medicationSpecification"
        			align="center"
        			label="规格">
      			</el-table-column>
						<el-table-column
        			prop="medicationPrice"
        			align="center"
        			label="单价">
      			</el-table-column>
						<el-table-column
        			prop="medicationCount"
        			align="center"
        			label="数量">
      			</el-table-column>
						<el-table-column
        			prop="medicationUnit"
        			align="center"
        			label="单位">
      			</el-table-column>
						<el-table-column
        			prop="totalPrice"
        			align="center"
        			label="金额">
      			</el-table-column>
						<el-table-column
        			prop="startAdviceTime"
        			align="center"
        			label="开嘱时间">
      			</el-table-column>
					</el-table>
				</div>
				<div slot="footer" class="page-bar">
      		<el-pagination
        		@size-change="onSizeChange"
        		@current-change="onCurrentChange"
        		:current-page.sync="pageInfo.currentPage"
        		:page-size="pageInfo.size"
        		layout="total, sizes, prev, pager, next, jumper"
        		:total="pageInfo.total"
        		v-uni="'yongyaoguanli_pagination'"
      		>
      		</el-pagination>
    		</div>
      </layout-list>
    </div>
  </layout>
</template>
<script>
import LayoutList from '../../../components/nrms/layout/list';
import Layout from '../../../components/nrms/layout/aside';
import PatientList from '../../../components/nrms/PatientList';
import { ApiMedication } from '../../../api/nrms/index'
export default {
  components: {
    LayoutList,
    Layout,
    PatientList
  },
  data () {
		const searchData = this.resetSearchData()
    return {
      searchData,
      patient: {},
      patientType: {},
			pageInfo: {
        page: 1,
        size: 10,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50]
      },
			tableData: []
    };
  },
	async mounted() {},
  methods: {
    initPatient (patient, type) {
      this.patient = patient;
      this.patientType = type;
			this.reset()
    },
		resetSearchData() {
			return {
				startAdviceDate: '',
				medicationName: ''
			}
		},
		search() {
			this.getData()
		},
		reset() {
			this.searchData = this.resetSearchData()
			this.pageInfo.page = 1
			this.getData()
		},
		onSizeChange(size) {
			this.pageInfo.size = size
			this.getData()
		},
		onCurrentChange(page) {
			this.pageInfo.page = page
			this.getData()
		},
		async getData() {
			const res = await ApiMedication.getMedicationInfo({
				patientId: this.patient.patientId,
				page: this.pageInfo.page,
				size: this.pageInfo.size,
				...this.searchData,
			}).catch(e => {})
			this.pageInfo.total = res.data.total
			this.tableData = res.data.list
		}
  }
}
</script>
<style lang="scss" type="text/scss" scoped>
@import "../../../assets/nrms/css/self_common";
</style>