<template>
  <div class="card_container" v-loading="loading">
    1111111
  </div>
</template>

<script>
import { ApiBedCard, ApiBedRoom, ApiDept } from "../../../api/bnms/index";

export default {
  name: "card_list",
  data() {
    return {
      loading: false,
      patientList: [],
      label: []
    };
  },
  created() {
    this.getDataInit();
  },
  methods: {
    async getDataInit() {
      console.log(1);
      //患者数据
      const a = this.getPatientListData();
      console.log(2);
      //患者一览标签
      const b = this.getPatient2LabelData();
      console.log(3);

      await a;
      await b;
      console.log(a, b);
      console.log(4);

      // return {
      //   a: await a,
      //   b: await b
      // }
    },
    async getDataInit1() {
      Promise.all([this.getPatientListData(), this.getPatient2LabelData()])
        .then(res => {
          console.log(444444, res);
        })
        .catch(res => {});
    },
    async getPatientListData() {
      console.log(11);
      return ApiBedCard.patientList(this.search_from);
      //   .then(res => {
      //   console.log(111, res)
      //   this.patientList = res.data;
      // });
    },
    async getPatient2LabelData() {
      console.log(22);
      await ApiBedCard.patientLabel({
        deptId: 1,
        labelShowPosition: 2
      });
      //   .then(res => {
      //   console.log('ppp -- ',this.patientList)
      //   console.log(222, res)
      //   this.label = res.data;
      // });
    }
  }
};
</script>
