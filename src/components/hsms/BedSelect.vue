<template>
    <div class="bed-div">
        <div class="item-bed"
             :class="[flag.indexOf(',' + item.objId + ',')>-1 ? 'seled': '']"
             v-for="(item, index) in srcData"
             @click="selBed(index)"
             :key="index">{{item.objName}}
        </div>
        <!--:class="['item-bed',{'seled':flag.indexOf(','+item.objId+',')>-1}]"-->
    </div>
</template>

<script>
    let that = this;
    export default {
        name: 'bed-select',
        props: ['srcData', 'selectedOldBeds'],
        data() {
            return {
                flag: '',
                obj: {}
            }
        },
        beforeCreate: function () {
            that = this;
        },
        created() {
            this.flag = this.selectedOldBeds;
        },
        mounted() {
            this.flag = this.selectedOldBeds;
        },
        watch: {
            selectedOldBeds: {
                immediate: true,
                handler(val) {
                    this.flag = val;
                    // that.$forceUpdate();
                    // that.$nextTick(function () {
                    //     this.flag = val;
                    //     console.log(this.flag);
                    // });

                },
            },
        },
        methods: {
            selBed(index) {
                let id = this.srcData[index].objId
                if (this.flag.indexOf(',' + id + ',') > -1) {
                    this.flag = this.flag.replace(',' + id + ',', ',')
                    delete this.obj[id]
                } else {
                    this.flag += ',' + id + ','
                    this.obj[id] = this.srcData[index]
                }
                let arr = this.flag.split(',')
                arr.forEach((item, index) => {
                    if (item !== '') {
                        this.obj[item] = {
                            objId: item
                        }
                    }
                })
                this.$emit('dealSelData', this.obj)
            }
        }
    }
</script>

<style scoped>
    .bed-div {
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
    }

    .item-bed {
        border: 1px solid #BFBFBF;
        font-size: 14px;
        color: #666666;
        border-radius: 2px;
        width: 36px;
        height: 36px;
        text-align: center;
        line-height: 36px;
        margin: 5px;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .seled {
        background: #1E87F0;
        color: #ffffff;
        border: 1px solid #1E87F0;
    }
</style>
