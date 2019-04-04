<template>
    <Modal v-model="editModal" :title="title" :mask-closable="false" class="lookStyle roleLookStyle">
        <div slot="footer" class="font-size-0">
            <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
            <Button type="primary" class="sureBtn"  @click="addModalok">确定</Button>
        </div>
        <div>
            <Form ref="formAdd" :model="formAdd" :rules="ruleAdd" :label-width="120">
                <FormItem label="分组名称：" prop="groupName">
                    <Input :maxlength="12" v-model.trim="formAdd.groupName" clearable placeholder="请输入"></Input>
                </FormItem>
                <FormItem label="排序号：" prop="indexSort">
                    <Input :maxlength="32" v-model.trim="formAdd.indexSort" clearable placeholder="请输入"></Input>
                </FormItem>
            </Form>
        </div>
    </Modal>
</template>

<script>
import api from '@/fetch/api';
import { validateNameExsit,isNumber } from '@/libs/common/check.js';
export default {
    data () {
        return {
            loading: false,
            editModal: false,
            title: '编辑对象组',
            formAdd: {
                groupName: '',
                indexSort: ''
            },
            ruleAdd: {
                groupName: [
                    { required: true, message: '请输入对象组名称', trigger: 'blur' },
                    { validator: validateNameExsit }
                ],
                indexSort: [
                    { required: true, message: '请输入排序号', trigger: 'blur' },
                    { validator: isNumber}
                ]
            }
        };
    },
    methods: {
        modalCancel () {
            this.editModal = false;
        },
        showModal () {
            this.editModal = true;
        },
        addModalok () {
            this.$refs.formAdd.validate((valid) => {
                if (valid) {
                    this.$emit('save', this.formAdd);
                    this.editModal = false;
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
