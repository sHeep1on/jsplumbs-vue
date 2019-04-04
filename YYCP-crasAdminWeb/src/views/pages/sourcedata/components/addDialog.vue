<template>
    <Modal v-model="addModal" :title="title" :mask-closable="false" class="lookStyle roleLookStyle" @on-cancel="modalCancel">
        <div slot="footer" class="font-size-0">
            <Button type="primary" class="sureBtn margin-right-50"  @click="linkTest">连接测试数据源</Button>
            <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
            <Button type="primary" class="sureBtn"  @click="addModalok">确定</Button>
        </div>
        <div>
            <Form ref="formAdd" :model="formAdd" :rules="ruleAdd" :label-width="120">
                <FormItem label="连接名：" prop="linkName">
                    <Input :maxlength="16" v-model.trim="formAdd.linkName" clearable placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="IP地址：" prop="IP">
                    <Input :maxlength="50" v-model.trim="formAdd.IP" clearable placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="端口号：" prop="PORT">
                    <Input :maxlength="50" v-model.trim="formAdd.PORT" clearable placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="数据源类型：" prop="source">
                    <Select v-model.trim="formAdd.source" ref='dataSourceType' :disabled="selectDisabled" :label-in-value="true">
                        <Option v-for="item in dataSourceType" :value="item.value" :key="item.value">{{ item.dictName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="用户名：" prop="userName">
                    <Input :maxlength="50" v-model.trim="formAdd.userName" clearable placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="密码：" prop="password">
                    <Input :maxlength="50" v-model.trim="formAdd.password" type="password" clearable placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="数据库DB：" prop="DB">
                    <Input :maxlength="50" v-model.trim="formAdd.DB" clearable placeholder="请输入"></Input>
                </FormItem>
            </Form>
        </div>
    </Modal>
</template>

<script>
import api from '@/fetch/api';
import { validateNameExsit, isNumber, ipAddress, isHadBlank } from '@/libs/common/check.js';
let Base64 = require('js-base64').Base64;
export default {
    data () {
        return {
            loading: false,
            addModal: false,
            title: '新建数据源',
            selectDisabled: false,
            formAdd: {
                linkName: null,
                IP: '',
                PORT: '',
                source: '',
                userName: '',
                password: '',
                DB: ''
            },
            dataSourceType: [],
            ruleAdd: {
                linkName: [
                    { required: true, message: '连接名不能为空，请重新输入',trigger: 'blur' },
                    { validator: validateNameExsit },  //不能包含特殊字符
                    { validator: isHadBlank }
                ],
                IP: [
                    { required: true, message: 'IP地址不能为空，请重新输入', trigger: 'blur' },
                    { validator: ipAddress },
                    { validator: isHadBlank }
                ],
                PORT: [
                    { required: true, message: '请输入端口号'},
                    { validator: isNumber}
                ],
                source: [
                    { required: true, message: '请选择数据源类型'}
                ],
                userName: [
                    {
                        required: true,
                        message: '用户名不能为空，请重新输入'
                    },{
                        pattern: '^[\u4E00-\u9FA5A-Za-z0-9_]+$',
                        message: '用户名中不能包含除_以外的特殊符号，请重新输入'
                     },{
                        validator: isHadBlank
                    }
                ],
                password: [
                    { required: true, message: '密码不能为空，请重新输入', trigger: 'blur' },
                    { validator: isHadBlank }
                ],
                DB: [
                    { required: true, message: '数据库DB不能为空，请重新输入', trigger: 'blur' },
                    { validator: isHadBlank }
                ]
            }
        };
    },
    mounted () {
    },
    methods: {
        modalCancel () {
            this.$emit("Cancel",this.title)
            //this.$refs.formAdd.resetFields();
            this.addModal = false;
        },
        async showModal () {
            if (this.dataSourceType.length==0) {
                 await this.dataSourceTypeChange();
            }
            this.addModal = true;
            this.$nextTick(()=>{
                this.$refs.dataSourceType.checkUpdateStatus()
            })

        },
        addModalok () {
            this.$refs.formAdd.validate((valid) => {
                if (valid) {
                    this.$emit('save', this.formAdd);
                }
            });
        },
        dataSourceTypeChange () {
             this.dataSourceType=[];
             new Promise(resolve => {
                api.api('get', api.dictUrl + '/dict/queryList?dictTypeId=89f2f1e0235f46ee83cb3557b4c1e09c')
                .then(res => {
                    this.dataSourceType = res;

                    resolve();
                });
             })

        },
        linkTest () {
            this.$refs.formAdd.validate((valid) => {
                if (valid) {
                    var hash = Base64.encode(this.formAdd.password);
                    api.api('post', api.configUrl + '/datasource/datasourceTest', {
                        sourceName: this.formAdd.linkName,
                        ipAddress: this.formAdd.IP,
                        port: this.formAdd.PORT,
                        // dataSourceType: this.dataSourceType[Number(this.formAdd.source)].value,
                        dataSourceType: this.formAdd.source,
                        userName: this.formAdd.userName,
                        password: hash,
                        dbName: this.formAdd.DB
                    }).then(res => {
                         this.$Message.info(res);
                    });
                }
            });
        }
    }
};
</script>
<style>
    .roleLookStyle .ivu-modal-wrap .ivu-modal {
        width: 550px !important;
    }
    .roleLookStyle .ivu-form .ivu-form-item-label {
        width: 120px !important;
    }
    .roleLookStyle .ivu-form-item-content {
        width: 314px;
    }
    .lookStyle .ivu-form-item {
        margin-left: 0px;
        margin-bottom: 25px!important;
    }
</style>
