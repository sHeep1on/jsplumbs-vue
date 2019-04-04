
<template>
    <div id="addTaskModel">
        <!--新增组模态框-->
        <Modal v-model="addModal" :title="title" class="lookStyle "  :mask-closable="false">
            <div slot="footer" class="font-size-0">
                <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
                <Button type="primary" class="sureBtn"  @click="addModalok">确定</Button>
            </div>
            <div>
                <Form ref="formValidateAdd" :model="formValidateAdd" :rules="ruleValidateAdd" >
                    <Row>
                        <Col span="24">
							<FormItem label="对象/关系名称：" prop="relationName">
								<Select v-model="formValidateAdd.relationName" >
									<Option v-for='item in actiontree' :value="item.id" :key="item.id">
										{{item.title}}
									</Option>
								</Select>
							</FormItem>
						</Col>
                    </Row>
                    <Row>
                        <Col span="24">
                            <FormItem label="对象：" prop="mappingObject">
                                <div class="margin-left-20">
                                    <RadioGroup v-model="formValidateAdd.mappingObject" >
                                        <Radio label="身份证">Male</Radio>
                                        <Radio label="female">Female</Radio>
                                    </RadioGroup>

                                </div>
                            </FormItem>
                        </Col>
                    </Row>
                     <Row>
                        <Col span="24">
                            <FormItem label="关系：" prop="mappingObject1">
                                <div class="margin-left-20">
                                    <RadioGroup v-model="formValidateAdd.mappingObject1" >
                                        <Radio label="亲密度">Male</Radio>
                                        <Radio label="female">Female</Radio>
                                    </RadioGroup>

                                </div>
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
	import { unique } from '@/libs/common/common.js';
	export default {
		components: {

        },
        props:{
			title:String,
			default:'映射配置'
		},
		data() {
            const roleNameUnique = (rule, value, callback) => {
		        setTimeout(() => {
		          if(this.title=="新增角色"){
		        		api.api('get', api.configUrl+'/role/getRoleCount?nameCn='+ value)
				            .then(res => {
				              if (res>0) {
				                callback(new Error('该角色名称已存在'))
				              } else {
				                callback()
				              }
				            })
		        	}else{
		        		api.api('get', api.configUrl+'/role/getRoleCount?nameCn=' + value+'&id='+this.roleId)
				            .then(res => {
				              if (res>0) {
				                callback(new Error('该角色名称已存在'))
				              } else {
				                callback()
				              }
				            })
		        	}
		        }, 10)
            }
			return {
                addModal:false,
                formValidateAdd: { // 表单
					relationName: '',
					relationDescribe: '',
					
				},
               	ruleValidateAdd: {
					relationName: [{
						required: true,
						message: '角色简称不能为空'
					}, {
						pattern: '^[A-Za-z0-9]+$',
						message: '角色简称只能包含英文、数字'
					}],
					relationDescribe: [{
						required: true,
						message: '角色名称不能为空',
					}, {
						pattern: '^[A-Za-z0-9]+$',
						message: '角色名称只能包含英文、数字'
					},{
						validator:roleNameUnique
					}]
				}, // 新增表单验证
				actiontree:[{
					id:0,
					title:"下拉框1"
				},{
					id:1,
					title:"下拉框2"
				},{
					id:2,
					title:"下拉框3"
				},{
					id:3,
					title:"下拉框4"
				}],
			}
		},
		mounted() {
            
		},
		created() {

		},
		methods: {
			modalCancel() {// 编辑 和 增加 模态框 取消事件
				this.$refs.formValidateAdd.resetFields();
				this.addModal = false;
            },
            addModalok() {//新增角色、编辑角色确认
				this.$refs.formValidateAdd.validate((valid) => {
					if(valid) {
						if(this.title == "新增角色") {
							api.api('post',api.configUrl+'/role/save',{
								roleName:this.formValidateAdd.roleName,
								nameCn:this.formValidateAdd.rolePname,
								delFlag:0
							}).then(res=>{
								this.refreshPage();
									this.$refs.formValidateAdd.resetFields();
									this.addModal = false;
							})

						} else {
							api.api('post',api.configUrl+'/role/update',{
								roleName:this.formValidateAdd.roleName,
								nameCn:this.formValidateAdd.rolePname,
								delFlag:0,
								id:this.formValidateAdd.roleId
							}).then(res=>{
								this.refreshPage();
								this.$refs.formValidateAdd.resetFields();
								this.addModal = false;
							})
						}
					}
				})
            },
            refreshPage: function() {// 刷新当前页面
				this.disabled = true;
				this.render(this.basePage.pageNumber, this.basePage.pageSize,this.formDynamic.roleName)
			},
		}
	}
</script>
<style>

</style>
