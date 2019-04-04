<template>
    <Modal v-model="addModal" :title="title" :mask-closable="false" class="lookStyle roleLookStyle" @on-cancel="modalCancel">
        <div slot="footer" class="font-size-0">
            <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
            <Button type="primary" class="sureBtn"  @click="addModalok">确定</Button>
        </div>
        <div>
            <Form ref="formAdd" :model="formAdd" :rules="ruleAdd" :label-width="120">
                <FormItem label="对象组名称：" prop="groupName">
                    <Input :maxlength="8" v-model.trim="formAdd.groupName" clearable placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="对象组描述：" prop="remark">
                    <Input :maxlength="16" v-model.trim="formAdd.remark" clearable placeholder="请输入"></Input>
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
            loading: false,
            addModal: false,
            title: '新建对象组',
            formAdd: {
                groupName: '',
                remark: ''
            },
            ruleAdd: {
                groupName: [
                    { required: true, message: '请输入对象组名称', trigger: 'blur' },
                    { validator: validateNameExsit },  //不能包含特殊字符
                    { validator: isHadBlank }  //不能有空格
                ]
            }
        };
    },
    methods: {
        modalCancel () {
            this.$emit("Cancel",this.title)
            //this.$refs.formAdd.resetFields();
            this.addModal = false;
        },
        showModal () {
            this.addModal = true;
        },
        addModalok () {
            this.$refs.formAdd.validate((valid) => {
                if (valid) {
                    this.$emit('save', this.formAdd);
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
    }
</style>
