<template>
     <Spin fix v-if="spinShow">
        <i class="el-icon-loading"></i>
        <div>上传中</div>
    </Spin>
</template>
<script>
    export default {
        computed: {
            spinShow() {
                return this.$store.state.loading
            }
        },
    };
</script>
<style>
.ivu-spin-fix{
    z-index:10000;
}
.el-icon-loading{
    font-size: 30px;
}
</style>
