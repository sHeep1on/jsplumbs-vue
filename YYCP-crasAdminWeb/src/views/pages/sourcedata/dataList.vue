
<template>
    <div class="relationShow"
        >
        <div class="showTitle">
            <h2><img src="@/images/dataicon.png"/>{{titleName}}</h2>
            <el-button size="small" icon="el-icon-refresh" style="margin-left: 10px;" @click="updataSource">更新</el-button>
            <el-button type="ghost" icon="el-icon-edit-outline" size="small" @click="editModal">编辑</el-button>

        </div>
        <div class="ShowInfor padding-left-20  padding-right-20">
            <Form>
                <Row>
                    <Col span="8">
                    <FormItem label="IP地址： ">
                        <p :title="sourceDetail.IP">{{sourceDetail.IP}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="用户名：">
                        <p :title="sourceDetail.userName">{{sourceDetail.userName}}</p>
                    </FormItem>
                    </Col>
                     <Col span="8">
                    <FormItem label="数据源类型：">
                        <p :title="sourceDetail.sourceTypeName">{{sourceDetail.sourceTypeName}}</p>
                    </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="8">
                    <FormItem label="端口号：">
                        <p :title="sourceDetail.PORT">{{sourceDetail.PORT}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="密码：">
                        <p>******</p>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="数据库：">
                        <p :title="sourceDetail.DB">{{sourceDetail.DB}}</p>
                    </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
        <addModal ref="addModal" @save="updateSource"></addModal>
        <china-oly-loading :isLoading="isLoading" :loadingText="loadingContent"></china-oly-loading>
    </div>
</template>
<script>
    import api from '@/fetch/api';
    import $ from 'jquery';
    import addModal from '@/views/pages/sourcedata/components/addDialog.vue';
    import chinaOlyLoading from '@/views/Common/loading.vue'
    let Base64 = require('js-base64').Base64;
    export default {
        components: {
            addModal,
            chinaOlyLoading
        },
        data () {
            return {
                id: '',
                titleName: '',
                dataSourceId:"",
                isLoading:false,
                loadingContent:'玩命更新中...',
                sourceDetail: {
                    IP: '',
                    PORT: '',
                    userName: '',
                    password: '',
                    sourceType: '',
                    sourceTypeName: '',
                    DB: ''
                }
            };
        },
        methods: {
            updataSource(){
                // this.loading = true;
                this.isLoading = true;
                var _this = this;
                var promise = new Promise(resolve => {
                    api.api('post', api.configUrl + '/datasource/initialization', {
                        datasourceId: this.dataSourceId
                    },function(code){
                        if(code === 400){
                            _this.isLoading = false;
                        }
                    }).then(res => {
                        resolve();
                    });
                })
                promise.then(() => {
                    this.isLoading = false;
                    this.$message({
						message: '恭喜你，数据更新成功',
						type: 'success'
					});
                    // this.loading = false;
                    this.$emit("renderTree")
                })

            },
            editModal () {
                api.api('post', api.configUrl + '/datasource/detail', {
                    id: this.id
                }).then(res => {
                    this.$refs.addModal.formAdd.linkName = res.sourceName;
                    this.$refs.addModal.formAdd.IP = res.ipAddress;
                    this.$refs.addModal.formAdd.PORT = res.port;
                    this.$refs.addModal.formAdd.source = res.dataSourceType.trim()
                    this.$refs.addModal.formAdd.userName = res.userName;
                    this.$refs.addModal.formAdd.password = Base64.decode(res.password)
                    this.$refs.addModal.formAdd.DB = res.dbName;
                    this.$refs.addModal.selectDisabled=true;
                    this.$refs.addModal.showModal();
                    this.$refs.addModal.title = '编辑数据源';
                });
            },
            updateSource (data) {
                api.api('post', api.configUrl + '/datasource/update', {
                    id: this.id,
                    sourceName: data.linkName,
                    ipAddress: data.IP,
                    port: data.PORT,
                    dataSourceType: data.source,
                    userName: data.userName,
                    password: data.password,
                    dbName: data.DB
                }).then(res => {
                    this.$refs.addModal.addModal = false;
                    this.$emit('renderList', this.id);
                    this.$emit('refresh');
                    this.titleName = data.linkName;
                });
            }
        }
    };
</script>
<style lang="less">
    .relationShow{
        width: 100%;
        float: right;
        .showTitle{
            border-bottom:1px solid #d9d9d9;
            overflow: hidden;
            height: 56px;
            line-height: 56px;
            h2{
                float: left;
                font-size:16px;
                color:#333;
                img {
                    margin: 0px 15px 0 0;
                    vertical-align:middle;
                }
            }
            Button{
                float: right;
                margin-top: 13px;
            }
        }
        .ShowInfor{
            padding: 0 50px;
            padding-top: 10px
        }

    }
    .ivu-form-item {
        margin-bottom: 0px !important
    }
    .ivu-form .ivu-form-item-content {
        font-size: 14px;
        padding: 2px 0;
    }
    .ivu-row{
        margin: 10px 0;
    }
    .ivu-form {
        margin: 15px 0;
    }
    .borderNone{
        border: 0 none;
    }
</style>