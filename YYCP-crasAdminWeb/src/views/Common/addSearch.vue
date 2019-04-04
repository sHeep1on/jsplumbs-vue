
<template>
	<div>
		<!--新增组模态框-->
		<Modal 
			v-model="addModal" 
			title="新增组" 
			class="lookStyle modelList" 
			@on-cancel="modalCancel"
			:mask-closable="false">
			<div slot="footer" class="font-size-0">
				<Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
				<Button type="primary" class="sureBtn"  @click="addModalok">确定</Button>
			</div>
			<div>
				<Form ref="formValidateAdd" :model="formValidateAdd" :rules="ruleValidateAdd" >
					<FormItem :label="label" prop="groupName">
						<Input :maxlength="8" v-model.trim="formValidateAdd.groupName" clearable placeholder="请输入关系组名称"/>
					</FormItem>
				</Form>
			</div>
		</Modal>
	</div>
</template>
<script>
	import api from '@/fetch/api';
	import $ from 'jquery';
	import { unique } from '@/libs/common/common.js';
	import {remarkValid,isChina,isHadBlank,validateNameExsit} from '@/libs/common/check.js';
	import cancelModel from '@/views/Common/cancelModel.vue';
	export default {
		components: {
			cancelModel
        },
        props:{
			title: {
				type: String,
				default: '关系'
			},
			label: {
				type: String,
				default: '关系组名称'
			},
		
		},
		data() {
			const nameUnique = (rule, value, callback) => {
				var urlFind = this.title == "关系信息" ?  api.configUrl + '/relation/group/findCount?groupName='
								: api.configUrl + '/t/model/group/findCount?groupName='
				api.api('get', urlFind + value )
				.then(res => {
					if(res > 0) {
						callback(new Error('该关系组名称已存在'))
					} else {
						callback()
					}
				})
			}
			return {
				addModal:false,
				tips:{
					name:"",
					findCount:"",
				},
                formValidateAdd: { // 表单
					groupName: '',
					remark: '',
				},
				ruleValidateAdd: {			// 新增组表单验证
					groupName: [{
						required: true,
						message: "名称不能为空"
					},{
						validator:nameUnique
					},{
						validator:validateNameExsit
					},{
						validator:isHadBlank
					},{
						validator:nameUnique
					}],
				}, 
			}
		},
		methods: {
			modalCancel() {  			//新增组的取消实现
				this.$emit("groupCancel",this.title)
			},
			addModalok() {				//新增组的 确定按钮判断
				this.$refs.formValidateAdd.validate((valid) => {
					if(valid) {
						let urlNeed = this.title == "关系信息" 
									  ? api.configUrl + '/relation/group/save' : api.configUrl + '/t/model/group/save';
						api.api('post',urlNeed,{
							groupName:this.formValidateAdd.groupName,
						}).then(res=>{
							this.$refs.formValidateAdd.resetFields();
							this.addModal = false;
							this.$emit("updata")
						})
					}
				})
			},
			
		}
	}
</script>
<style lang="less">
	#addGroup{
		.owenForm{
			.ivu-form-item{
				.ivu-form-item-label{
					width: 30% !important;
				}
			}
		}	
	}
</style>
