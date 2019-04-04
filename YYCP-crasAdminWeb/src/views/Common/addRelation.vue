<template>
	<div id="addRelation">
		<!--新增组模态框-->
		<Modal
			v-model="addModal"
			:title="title"
			class="lookStyle modelList"
			@on-cancel="modalCancel"
			:mask-closable="false">
			<div slot="footer" class="font-size-0">
				<Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
				<Button type="primary" class="sureBtn"  @click="addModalok">确定</Button>
			</div>
			<div>
				<Form ref="formValidateAdd" :model="formValidateAdd" :rules="ruleValidateAdd"  >
					<FormItem label="关系名称：" prop="relationName">
						<Input :maxlength="8" v-model.trim="formValidateAdd.relationName" clearable placeholder="请输入关系名称"/>
					</FormItem>
					<FormItem label="关系描述：" prop="remark">
						<Input :maxlength="16" v-model.trim="formValidateAdd.remark" clearable placeholder="请输入关系描述" />
					</FormItem>
					<FormItem label="关系组：" prop="groupId">
						<Select v-model.trim="formValidateAdd.groupId">
							<Option v-for="item in groupIdArr" :value="item.id" :key="item.id">{{ item.groupName }}</Option>
						</Select>
					</FormItem>
					<FormItem label="源对象：" prop="fromTarget">
						<Select v-model.trim="formValidateAdd.fromTarget">
							<Option v-for="item in fromTargetArr" :value="item.id" :key="item.id">{{ item.targetName }}</Option>
						</Select>
					</FormItem>
					<FormItem label="目标对象：" prop="toTarget">
						<Select v-model.trim="formValidateAdd.toTarget" >
							<Option v-for="item in toTargetArr" :value="item.id" :key="item.id">{{ item.targetName }}</Option>
						</Select>
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
	import { isHadBlank ,validateNameExsit} from '@/libs/common/check.js';
	export default {
		data() {
			const nameUnique = (rule, value, callback) => {
				let urlNeed = this.title == "新增关系" ?  api.configUrl + '/relation/findCount?relationName=' + value
							: api.configUrl + '/relation/findCount?relationName=' + value + '&id=' + this.formValidateAdd.id;
				api.api('get',urlNeed ).then(res => {
					if(res > 0) {
						callback(new Error('该关系名称已存在'))
					} else {
						callback()
					}
				})
			}
			return {
				addModal:false,
				title:"新增关系",
				groupIdArr:[],
				fromTargetArr:[],
				toTargetArr:[],
				formValidateAdd: { // 表单
					id:"",
					relationName: '',
					remark: '',
					groupId: '',
					fromTarget: '',
					toTarget: '',
				},
               	ruleValidateAdd: {
					relationName: [{
						required: true,
						message: '关系名称不能为空'
					},{
						validator:validateNameExsit
					},{
						validator:nameUnique
					},{
						validator:isHadBlank
					},{
						validator:nameUnique
					}],
					remark: [{
						validator:isHadBlank
					},{
						validator:validateNameExsit
					}],
					groupId: [{
						required: true,
						message: '关系组不能为空',
					}, ],
					fromTarget: [{
						required: true,
						message: '原对象不能为空',
					},],
					toTarget: [{
						required: true,
						message: '目标对象不能为空',
					}, ]
				}, // 新增表单验证
			}
		},
		watch:{
			// 'formValidateAdd.toTarget'(val){
			// 	this.cancelRepeat(val);
			// },
			// 'formValidateAdd.fromTarget'(val){
			// 	this.cancelRepeatTo(val);
			// },
　　　　},
		methods: {
			modalCancel() {						// 编辑 模态框 取消事件
				if(this.title == "新增关系"){
					this.$emit("groupCancel",this.title)
				}else{
					this.$refs.formValidateAdd.resetFields();
					this.addModal = false;
				}
			},
			groupIdArrMethor(){
				this.groupIdArr = [];
				this.fromTargetArr = [];
				api.api('post', api.configUrl + '/relation/group/queryList').then(res => {	//这是给的默认值
					this.groupIdArr = res;
				});
				api.api('post', api.configUrl + '/target/queryList').then(res => {	//这是给目标对象的默认值
					this.fromTargetArr = res;
					this.toTargetArr = res;
				});
			},
			// cancelRepeat(val){
			// 	if(val){
			// 		if(this.formValidateAdd.fromTarget === val){
			// 			this.formValidateAdd.toTarget = null
			// 			this.$Message.info('源对象和目标对象不能选择一样，请重新选择。');
			// 		}
			// 	}
			// },
			// cancelRepeatTo(val){
			// 	if(val){
			// 		if(this.formValidateAdd.toTarget === val){
			// 			this.formValidateAdd.fromTarget = null
			// 			this.$Message.info('源对象和目标对象不能选择一样，请重新选择。');
			// 		}
			// 	}
			// },
            addModalok() {						//新增关系模态框确认确认
				this.$refs.formValidateAdd.validate((valid) => {
					if(valid) {
						if(this.title === "新增关系"){
							api.api('post',api.configUrl + '/relation/save',{
								relationName:this.formValidateAdd.relationName,
								remark:this.formValidateAdd.remark,
								groupId:this.formValidateAdd.groupId,
								fromTarget:this.formValidateAdd.fromTarget,
								toTarget:this.formValidateAdd.toTarget,
							}).then(res=>{
								this.$refs.formValidateAdd.resetFields();
								this.addModal = false;
								this.$emit("updata")
							})
						}else{
							this.addModal = false;
							this.$emit("update",this.formValidateAdd);
							// this.$refs.formValidateAdd.resetFields();
						}

					}
				})
			},
		}
	}
</script>
<style lang="less">

</style>
