<script>
import Edit from './edit.vue'
import * as API from "@/api/wnms/msgManage/systemConfig";
export default {
	props: ['detail'],
	extends: Edit,
	mounted() {
	},
	methods: {
		init() {
      this.formdata.deviceTypes = ['YH-6297i', 'YH-6267i', 'YH-A26i']
      this.formdata.deptIds = JSON.parse(JSON.stringify(this.deptIds))
      this.$refs.deptTree.setCheckedKeys(this.formdata.deptIds)
			return false
		},
		save () {
      this.$refs['formdata'].validate((valid) => {
        if (valid) {
          const formdata = new FormData()
          Object.keys(this.formdata).forEach(key => {
            if(key === 'file') {
              this.formdata.file.forEach(item => {
                formdata.append(key, item.raw)
              })
              return
            }
            if(Array.isArray(this.formdata[key])) {
              formdata.append(key, JSON.stringify(this.formdata[key]))
            } else {
              formdata.append(key, this.formdata[key])
            }
          })
          API.addMaterialManage(formdata)
            .then(res => {
              this.$message.success('添加成功')
              this.$emit('option-changed', 'list')
            })
            .catch(err => {
              // this.$message.error(err.message || err)
            })
        } else {
          return false;
        }
      });
    }
	}
}
</script>