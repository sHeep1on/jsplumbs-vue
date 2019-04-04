<template>
    <Modal v-model="tabModal" width="360" class="lookStyle delStyle">
        <p slot="header">
            <Icon type="information-circled"></Icon>
            <span>提示信息</span>
        </p>
        <div class="text-align">
            <p>您还为进行参数设置，是否继续？</p>
        </div>
        <div slot="footer" class="font-size-0">
            <Button type="default" class="cancelBtn" @click="tabModal=false" >否</Button>
            <Button type="primary" class="sureBtn" @click="tabYes">是</Button>
        </div>
    </Modal>
</template>

<script>
    export default {
        data () {
            return {
                tabModal: false,
                title:""
            };
        },
        methods: {
            tabYes (data) {
                this.$emit('tabSure',this);
                this.tabModal = false;
            }
        }
    };
</script>

<style>
    .delStyle .ivu-modal-wrap .ivu-modal {
        width: 360px !important;
    }
</style>
