<template>
    <Modal v-model="cancelModal" @on-cancel="cancelBack" width="360" class="lookStyle delStyle" :closable="false">
        <p slot="header">
            <Icon type="information-circled"></Icon>
            <span>取消确认</span>
        </p>
        <div class="text-align">
            <p>{{content}}</p>
        </div>
        <div slot="footer" class="font-size-0">
            <Button type="default" class="cancelBtn" @click="cancelBack">返回上一步</Button>
            <Button type="primary" class="sureBtn"  @click="cancelModalOk">确定</Button>
        </div>
    </Modal>
</template>

<script>
    export default {
        data () {
            return {
                cancelModal: false,
                content:"您未建立组，是否取消？",
                title:""
            };
        },
        methods: {
            cancelBack(){
                this.$emit("cancelBack",this.title)
            },
            cancelModalOk(){
                this.$emit('cancelModal',this.title);
            }
        }
    };
</script>

<style>
    .delStyle .ivu-modal-wrap .ivu-modal {
        width: 360px !important;
    }
</style>
