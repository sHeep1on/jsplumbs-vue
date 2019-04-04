<template>
    <div id="editModel">
        <!--关系列表编辑组模态框-->
        <Modal 
			v-model="editModel" 
			title="编辑关系组" 
			class="lookStyle roleLookStyle" 
			@on-cancel="modalCancel"
			:mask-closable="false" >
            <div slot="footer" class="font-size-0">
                <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
                <Button type="primary" class="sureBtn"  @click="addModalok">确定</Button>
            </div>
            <div>
                <Form ref="formValidateAdd" :model="formValidateAdd" :rules="ruleValidateAdd" >
                    <Row>
                        <Col span="24">
                            <FormItem label="分组名称：" prop="groupName">
                                <Input :maxlength="32" v-model.trim="formValidateAdd.groupName" clearable placeholder="请输入关系组名称"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="排序号：" prop="indexSort">
                                <Input :maxlength="32" v-model.trim="formValidateAdd.indexSort" clearable placeholder="请输入关系组名称"/>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </div>
        </Modal>
    </div>
	
</template>

<script>
	import api from '@/fetch/api';
	import $ from 'jquery';
    import { isNumber,validateNameExsit } from '@/libs/common/check.js';
    import { unique } from '@/libs/common/common.js';
	export default {
		data() {
			const nameUnique = (rule, value, callback) => {
				var urlFind = api.configUrl + '/relation/group/findCount?groupName=' + value + '&id=' + this.formValidateAdd.id;
				api.api('get', urlFind)
				.then(res => {
					if(res > 0) {
						callback(new Error('该关系组名称已存在'))
					} else {
						callback()
					}
				})
			}
			return {
				editModel:false,
				title:"",
				formValidateAdd: { // 表单
					id:"",
					groupName: '',
					indexSort: '',
				},
				// 新增表单验证
               	ruleValidateAdd: {
					groupName: [{
						required: true,
						message: '关系组不能为空'
					},{
						validator:validateNameExsit
					},{
						validator:nameUnique
					}],
					indexSort: [{
						required: true,
						message: '排序号不能为空',
					},{
						validator:isNumber
					}]
				}, 
			}
		},
		methods: {
			modalCancel() {				// 编辑 取消事件
				this.$refs.formValidateAdd.resetFields();
				this.editModel = false;
            },
            addModalok() {				//列表编辑确认
				this.$refs.formValidateAdd.validate((valid) => {
					if(valid) {
						this.$emit('save', this.formValidateAdd);
						this.editModel = false;
					}
				})
            },
		}
	}
</script>
<style>

</style>
