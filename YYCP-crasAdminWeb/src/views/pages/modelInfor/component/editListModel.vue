<style lang="less">

</style>
<template>
    <div id="editModel">
        <!--关系列表编辑组模态框-->
        <Modal 
			v-model="editModel" 
			title="编辑关系" 
			class="lookStyle roleLookStyle modelList" 
			@on-cancel="modalCancel"
			:mask-closable="false">
            <div slot="footer" class="font-size-0">
                <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
                <Button type="primary" class="sureBtn"  @click="addModalok">确定</Button>
            </div>
            <div>
                <Form ref="formValidateAdd" :model="formEdit" :rules="ruleValidateAdd" >
                    <Row>
                        <Col span="24">
                            <FormItem label="模型组名称：" prop="groupName">
                                <Input :maxlength="32" v-model.trim="formEdit.groupName" clearable placeholder="请输入关系组名称"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="排序号：" prop="indexSort">
                                <Input :maxlength="32" v-model.trim="formEdit.indexSort" clearable placeholder="请输入关系组名称"></Input>
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
	export default {
		components: {
        },
		data() {
			//名字重复性的校验
			const nameUnique = (rule, value, callback) => {
				let urlNeed = api.configUrl + '/t/model/group/findCount?groupName=' + value + '&id=' + this.formEdit.id;
				api.api('get',urlNeed ).then(res => {
					if(res > 0) {
						callback(new Error('该模型名称已存在'))
					} else {
						callback()
					}
				})
			}
			return {
                editModel:false,
				formEdit: { // 表单
					id:"",
					groupName: '',
					indexSort: '',
				},
               	ruleValidateAdd: {
					groupName: [{
						required: true,
						message: '模型组名称不能为空'
					},{
						validator:validateNameExsit
					}, {
						validator:nameUnique
					} ],
					indexSort: [{
						required: true,
						message: '排序号不能为空',
					},{
						validator:isNumber
					} ]
				}, // 新增表单验证
			}
		},
		mounted() {
            
		},
		created() {

		},
		methods: {
			modalCancel() {				// 编辑 取消事件
				this.$refs.formValidateAdd.resetFields();
				this.editModel = false;
            },
            addModalok() {				//列表编辑确认
				this.$refs.formValidateAdd.validate((valid) => {
					if(valid) {
						this.$emit('save', this.formEdit);
						this.editModel = false;
					}
				})
            },
		}
	}
</script>
<style lang="less">
</style>
