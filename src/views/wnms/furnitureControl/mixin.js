export default {
  data () {
    return {
      addressList: [
        // {
        //   value: 'FEFE',
        //   label: 'FEFE'
        // },
        {
          value: '00',
          label: '00'
        },
        {
          value: '01',
          label: '01'
        },
        {
          value: '02',
          label: '02'
        },
        {
          value: '03',
          label: '03'
        },
        {
          value: '04',
          label: '04'
        },
        {
          value: '05',
          label: '05'
        },
        {
          value: '06',
          label: '06'
        },
        {
          value: '07',
          label: '07'
        },
        {
          value: '08',
          label: '08'
        },
        {
          value: '09',
          label: '09'
        },
        {
          value: '10',
          label: '10'
        },
        {
          value: '11',
          label: '11'
        },
        {
          value: '12',
          label: '12'
        },
        {
          value: '13',
          label: '13'
        },
        {
          value: '14',
          label: '14'
        },
        {
          value: '15',
          label: '15'
        },
        {
          value: '16',
          label: '16'
        },
        {
          value: '17',
          label: '17'
        },
        {
          value: '18',
          label: '18'
        },
        {
          value: '19',
          label: '19'
        },
        {
          value: '20',
          label: '20'
        }
      ],
      addressList1: [
        {
          value: '00',
          label: '00'
        },
        {
          value: '01',
          label: '01'
        },
        {
          value: '02',
          label: '02'
        },
        {
          value: '03',
          label: '03'
        },
        {
          value: '04',
          label: '04'
        },
        {
          value: '05',
          label: '05'
        },
        {
          value: '06',
          label: '06'
        },
        {
          value: '07',
          label: '07'
        },
        {
          value: '08',
          label: '08'
        },
        {
          value: '09',
          label: '09'
        },
        {
          value: '10',
          label: '10'
        },
        {
          value: '11',
          label: '11'
        },
        {
          value: '12',
          label: '12'
        },
        {
          value: '13',
          label: '13'
        },
        {
          value: '14',
          label: '14'
        },
        {
          value: '15',
          label: '15'
        },
        {
          value: '16',
          label: '16'
        },
        {
          value: '17',
          label: '17'
        },
        {
          value: '18',
          label: '18'
        },
        {
          value: '19',
          label: '19'
        },
        {
          value: '20',
          label: '20'
        },
        {
          value: '21',
          label: '21'
        },
        {
          value: '22',
          label: '22'
        },
        {
          value: '23',
          label: '23'
        },
        {
          value: '24',
          label: '24'
        },
        {
          value: '25',
          label: '25'
        },
        {
          value: '26',
          label: '26'
        },
        {
          value: '27',
          label: '27'
        },
        {
          value: '28',
          label: '28'
        },
        {
          value: '29',
          label: '29'
        },
        {
          value: '30',
          label: '30'
        },
        {
          value: '31',
          label: '31'
        },
        {
          value: '32',
          label: '32'
        },
        {
          value: '33',
          label: '33'
        },
        {
          value: '34',
          label: '34'
        },
        {
          value: '35',
          label: '35'
        },
        {
          value: '36',
          label: '36'
        },
        {
          value: '37',
          label: '37'
        },
        {
          value: '38',
          label: '38'
        },
        {
          value: '39',
          label: '39'
        },
        {
          value: '40',
          label: '40'
        }
      ]
    }
  },
  methods: {
    addType (type) {
      if (type === 1) {
        if (this.ruleForm.light.length >= 15) {
          this.$message.warning('最多可添加十五条回路')
          return false
        }
        this.ruleForm.light.push({
          lineId: '',
          lineName: '',
          lineLoop: ''
        })
      } else if (type === 2) {
        if (this.ruleForm.curtains.length >= 15) {
          this.$message.warning('最多可添加十五条回路')
          return false
        }
        this.ruleForm.curtains.push({
          lineId: '',
          lineName: '',
          lineLoop: ''
        })
      }
    },
  }
}
