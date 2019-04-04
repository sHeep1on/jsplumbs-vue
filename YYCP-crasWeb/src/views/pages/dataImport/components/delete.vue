<template>
    <Modal v-model="deleteModal" width="360" class="lookStyle delStyle">
        <p slot="header">
            <Icon type="information-circled"></Icon>
            <span>删除确认</span>
        </p>
        <div class="text-align">
            <p>确认删除？</p>
        </div>
        <div slot="footer" class="font-size-0">
            <Button type="default" class="cancelBtn" @click="deleteModal=false">取消</Button>
            <Button type="primary" class="sureBtn" @click="deleteModaldel">确定</Button>
        </div>
    </Modal>
</template>

<script>
    export default {
        data () {
            return {
                delId:'',
                deleteModal: false,
                title:""
            };
        },
        methods: {
            deleteModaldel (data) {
                this.$emit('deleteModel',this.delId);
                this.deleteModal = false;
            }
        }
    };
</script>

<style>
    .delStyle .ivu-modal-wrap .ivu-modal {
        width: 360px !important;
    }
</style>
