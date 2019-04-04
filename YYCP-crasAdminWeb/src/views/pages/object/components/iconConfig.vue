<template>
    <Modal v-model="addModal" :title="title" :mask-closable="false" class="lookStyle roleLookStyle">
        <div slot="footer" class="font-size-0">
            <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
            <Button type="primary" class="sureBtn"  @click="addModalok">确定</Button>
        </div>
        <div>
            <Form ref="formAdd" :model="formAdd" :label-width="120">
                <FormItem label="前缀：" prop="link">
                    <Input :maxlength="255" v-model.trim="formAdd.link" clearable placeholder="http://192.168.5.1/zp/"></Input>
                </FormItem>
                <FormItem label="后缀：" prop="jpg">
                    <Input :maxlength="255" v-model.trim="formAdd.jpg" clearable placeholder=".jpg"></Input>
                </FormItem>
            </Form>
        </div>
    </Modal>
</template>

<script>
import { isHadBlank, img } from '@/libs/common/check.js';
export default {
    data () {
        return {
            loading: false,
            addModal: false,
            title: '设置',
            formAdd: {
                link: '',
                jpg: ''
            },
            // ruleAdd: {
            //     link: [
            //         { required: true, message: '请输入前缀', trigger: 'blur' },
            //         { validator: isHadBlank }
            //     ],
            //     jpg: [
            //         { required: true, message: '请输入后缀', trigger: 'blur' },
            //         { validator: img},
            //         { validator: isHadBlank }
            //     ]
            // }
        };
    },
    methods: {
        modalCancel () {
            this.$refs.formAdd.resetFields();
            this.addModal = false;
        },
        showModal () {
            this.addModal = true;
        },
        addModalok () {
            // this.$refs.formAdd.validate((valid) => {
                // if (valid) {
                    this.$emit('save', this.formAdd)
                // }
            // });
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
