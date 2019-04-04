<template>
    <Modal v-model="addModal" :title="title" :mask-closable="false" class="lookStyle roleLookStyle" @on-cancel="modalCancel">
        <div slot="footer" class="font-size-0">
            <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
            <Button type="primary" class="sureBtn"  @click="addModalok">确定</Button>
        </div>
        <div>
            <Form ref="formAdd" :model="formAdd" :rules="ruleAdd" :label-width="120">
                <FormItem label="对象名称：" prop="targetName">
                    <Input :maxlength="16" v-model.trim="formAdd.targetName" clearable placeholder="请输入"/>
                </FormItem>
                <FormItem label="对象描述：" prop="remark">
                    <Input :maxlength="16" v-model.trim="formAdd.remark" clearable placeholder="请输入"/>
                </FormItem>
                <FormItem label="对象组：" prop="groupId">
                    <Select v-model.trim="formAdd.groupId">
                        <Option v-for="item in object" :value="item.id" :key="item.id">{{ item.groupName }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="对象icon：" prop="iconField">
                    <Input v-model="formAdd.iconField" clearable placeholder="请输入"  />
                    <ul class="divIcon">
                        <li @click="clickIcon(item,index)" :class="{'active':index == active}" v-for="(item,index) in iconUrl" :key="item.url">
                            <img :src="item.url"/><a :title='item.name'>{{item.name}}</a>
                        </li>
                    </ul>
                </FormItem>
            </Form>
            
        </div>
    </Modal>
</template>

<script>
import api from '@/fetch/api';
import { validateNameExsit, isHadBlank } from '@/libs/common/check.js';
export default {
    data () {
        return {
            active: -1,
            loading: false,
            addModal: false,
            title: '新建对象',
            iconurl: '',
            object: [],
            iconUrl:[],
            formAdd: {
                targetName: '',
                remark: '',
                groupId: '',
                iconField: '',
                need:""
            },
            cc:'',
            ruleAdd: {
                targetName: [
                    { required: true, message: '请输入对象名称', trigger: 'blur' },
                    { validator: validateNameExsit },   //不能包含特殊字符
                    { validator: isHadBlank }
                ],
                groupId: [
                    { required: true, message: '请选择对象组', trigger: 'blur' },
                    { validator: isHadBlank }
                ],
                iconField: [
                    { required: true, message: '请选择对象icon', trigger: 'blur'},
                    { validator: isHadBlank }
                ]
            }
        };
    },
    created () {
    },
    methods: {
        modalCancel () {
            this.$emit("Cancel",this.title)
            this.addModal = false;
        },
        showModal () {
            this.addModal = true;
        },
        objectIcon(){
            api.api('post', api.configUrl + '/file/filePicture').then(res => {
                for (let i = 0; i < res.length; i++) {
                    var urlFind = api.urlImage + "/";
                    this.iconUrl.push({
                        name: res[i].name,
                        url: urlFind + res[i].url,
                        need:res[i].url
                    });
                }
            });
        },
        objectGroup () {
            this.object=[];
            api.api('post', api.configUrl + '/target/group/queryList').then(res => {
                for (let i = 0; i < res.length; i++) {
                    this.object.push({
                        id: res[i].id,
                        groupName: res[i].groupName
                    });
                }
            });
        },
        addModalok () {
            this.$refs.formAdd.validate((valid) => {
                if (valid) {
                    this.$emit('save', this.formAdd);
                }
            });
        },
        clickIcon (item,index) {
            this.active = index;
            this.formAdd.iconField = item.name;
            this.formAdd.need = item.need;
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
    }
    .divIcon{
        width: 100%;
        height: 188px;
        overflow:auto;
        background:#F8F8F9;
        border: 1px solid #D9D9D9;
        border-top:none;
        padding: 5px;
    }
    .divIcon li{
        width: 30%;
        list-style: none;
        float:left;
        padding: 5px 10px 2px 10px;
        text-align:center;
        border:1px solid #D9D9D9;
        border-radius:5px;
        line-height: initial;
        margin-right: 8px;
        margin-bottom: 8px;
    }
    .divIcon li.active{
        border:1px solid #387CBF;
    }
    .divIcon li img{
       width:25px;
       height:25px;
    }
    .divIcon li a{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display:block;
        height:14px;
        line-height:14px;
        color: #666;
    }
</style>
