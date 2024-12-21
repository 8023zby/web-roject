<template>
    <keep-alive>
    <component :is="currentComponent" :modifyData="modifyData" @option-changed="changeComponent"
               ></component>
    </keep-alive>
</template>

<script>
    import list from './List'
    import add from './Add'

    export default {
        name: "Main",
        components: {list, add},
        data() {
            return {
                currentComponent: 'list',
                modifyData: {},
            }
        },
        methods: {
            changeComponent(currCom = 'list', data) {
                this.currentComponent = currCom;
                this.modifyData = data;
            }
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
