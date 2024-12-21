export default {
  state: {
    labelApplyPatientActiveName: "",
    labelPatientActiveName: ""
  },
  getters: {
    labelApplyPatientActiveName: state => state.labelApplyPatientActiveName,
    labelPatientActiveName: state => state.labelPatientActiveName
  },
  mutations: {
    setLabelApplyPatientActiveName(state, activeName) {
      return (state.labelApplyPatientActiveName = activeName);
    },
    setLabelPatientActiveName(state, activeName) {
      return (state.labelPatientActiveName = activeName);
    }
  },
  actions: {}
};
