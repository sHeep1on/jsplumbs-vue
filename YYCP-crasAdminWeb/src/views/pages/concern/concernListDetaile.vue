
<template>
	<div class="relationTable">
		<div class="showTitle propertyTitle">
			<div>
				<span><img src="@/images/relation/relationGroup.png" alt=""></span>
				<span>{{allTitle}}</span>
			</div>
		</div>
		<el-tabs v-model="tabValue" class="inTab" @tab-click="tabChange"> 
			<el-tab-pane label="基本信息" name="base">
				<div class="contentMain">  
					<div class="editBtn">
						<el-button class="edit" type="ghost" icon="el-icon-edit-outline" size="small" @click="editBtn">编辑</el-button >
					</div>
					<Form class="formShow">
						<Row>
							<Col span="12">
								<FormItem label="组名称： ">
									<p :title="baseInfor.groupName">{{baseInfor.groupName}}</p>
								</FormItem>
							</Col>
							<Col span="12">
								<FormItem label="排序号：">
									<p :title="baseInfor.indexSort">{{baseInfor.indexSort}}</p>
								</FormItem>
							</Col>
						</Row>
					</Form>
				</div>
			</el-tab-pane>
			<el-tab-pane label="关系信息" name="relation"  >
				<Table @on-row-click="rowDetail" :height="height" :loading="loading" stripe ref="selection" :columns="userManaColumns" :data="userManaData" @on-selection-change="selectTable"></Table>
				<Page class="clientPage" :current="current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			</el-tab-pane>
		</el-tabs>
		<editListModel ref="editListModel"  @save="saveList"></editListModel>
		<addRelation ref="addRelation" @update="update"></addRelation>
	</div>
</template>
<script>
	import api from '@/fetch/api';
	import $ from 'jquery';
	import { unique } from '@/libs/common/common.js';
	import editListModel from './component/editListModel.vue';
	import addRelation from '@/views/Common/addRelation.vue';
	import { timestampToTime } from '@/libs/common/common.js';
	export default {
		components: {
			editListModel,
			addRelation
		},
		data() {
			return {
				height: 0,
				loading: false,
				tabValue:"base",
				allTitle:"",
				id:"",
				tableId:"",
				baseInfor:{
					groupName:"",
					indexSort:"",
				},
				userManaColumns: [
					{
						title: '关系名称',
						align: 'center',
						key: 'relationName',
						ellipsis:true,
						minWidth: 60,
					},
					{
						title: '排序号',
						align: 'center',
						key: 'indexSort',
						ellipsis:true,
						minWidth: 60,
					},
					// {
					// 	title: '启用情况',
					// 	align: 'center',
					// 	key: 'useStatus',
					// 	states:'useStatus',
					// 	ellipsis:true,
					// 	minWidth: 60,
					// 	render: (h, params) => {
					// 		 return h('i-switch', {
                    //             props: {
                    //                 value: Number(params.row.useStatus) === 0
                    //             },
                    //             on: {
                    //                 'on-change': (value) => {
                    //                     this.switch(params.row._index, params.row.id);
                    //                 }
                    //             }
                    //         });
					// 	}
					// },
					{
						title: '更新时间',
						align: 'center',
						key: 'updateTime',
						ellipsis:true,
						minWidth: 60,
						render: (h, params) => {
							if (params.row.updateTime) {
								return h('div', timestampToTime(params.row.updateTime));
							}
						}
					},
					{
						title: '操作',
						key: 'operate',
						align: 'center',
						render: (h, params) => {
							return h('div', [
								h('a', {
									on: {
										click: () => {
											this.$refs.addRelation.addModal = true;
											this.$refs.addRelation.title = "编辑关系";
											this.editBtnM(params.row.id)
										}
									}
								}, '编辑'),
							])
						}
					}
				],
				newColumn: [
					{
						relationId: '', 
						relationName: 0, 
						useStatus: true,
						updateTime: '',
					}
				],
				userManaData: [],
				pageArray:[10,20,30,40],
				basePage: {
					pageSize: 10,
					pageNumber: 1
				},
				current:1,
				total: 0, // 分页显示的总数量,
				editId:"",
				useStatusId:""
			}
		},
		mounted() {
		
		},
		created() {

		},
		methods: {
			tabChange(){
				if(this.tabValue === "relation"){
                    this.render(this.basePage.pageNumber, this.basePage.pageSize,this.tableId);
                }
			},
			switch (index, id) {				//列表的状态开启
                this.useStatusId = id;
                if (this.userManaData[index].useStatus === 1) {
                    this.userManaData[index].useStatus = 0;
                    this.useStatus = 0;
                } else {
                    this.userManaData[index].useStatus = 1;
                    this.useStatus = 1;
				}
				api.api('post', api.configUrl + '/relation/update', {
                    id: this.useStatusId,
                    useStatus: this.useStatus
                }).then(res => {
                    this.$Message.info('保存开关成功');
                });
			},
			editBtn(){						
				this.$refs.editListModel.editModel = true;
				this.$refs.editListModel.formValidateAdd.id = this.tableId;
				this.$refs.editListModel.formValidateAdd.groupName = this.baseInfor.groupName;
                this.$refs.editListModel.formValidateAdd.indexSort = this.baseInfor.indexSort;
			},
			editBtnM(id){
				this.editId = id;
				api.api('post', api.configUrl + '/relation/detail', {
					id: id
				}).then(res => {	//这是给的默认值
					this.$refs.addRelation.formValidateAdd.id = res.id;
					this.$refs.addRelation.formValidateAdd.relationName = res.relationName;
					this.$refs.addRelation.formValidateAdd.remark = res.remark;
					this.$refs.addRelation.formValidateAdd.groupId = res.groupId;
					this.$refs.addRelation.formValidateAdd.fromTarget = res.fromTarget;
					this.$refs.addRelation.formValidateAdd.toTarget = res.toTarget;
				});
				this.$refs.addRelation.groupIdArrMethor();
			},
			update(data){
				api.api('post',api.configUrl + '/relation/update',{
					id:this.editId,
					relationName:data.relationName,
					remark:data.remark,
					groupId:data.groupId,
					fromTarget:data.fromTarget,
					toTarget:data.toTarget,
				}).then(res=>{
					this.$emit("updata",this.tableId)
					this.$emit("upTree",this.tableId)
					this.refreshPage()
				})
			},
			selectTable(name) {			// 选中table的复选框时触发
				this.deleteRoleArr = [];
				this.disabled = true;
				for(let i = 0; i < name.length; i++) {
					this.disabled = false;
					this.deleteRoleArr[i] = name[i].roleId;
				}
				this.load.accountIds=this.deleteRoleArr.join(',')
			},
			rowDetail(item,index){
				this.lookModal = true;
			},
			saveList(data){
				api.api('post',api.configUrl + '/relation/group/update',{
					id: this.id,
					indexSort:data.indexSort,
					groupName:data.groupName,
				}).then(res=>{
					this.$emit("updata", this.id);  //带着当前id去修改数据
					this.$emit("updataTree");
				})
			},
			selectTable(name) {									// 选中table的复选框时触发
				this.deleteRoleArr = [];
				this.disabled = true;
				for(let i = 0; i < name.length; i++) {
					this.disabled = false;
					this.deleteRoleArr[i] = name[i].id;
				}
				this.load.accountIds = this.deleteRoleArr.join(',')
			},
			refreshPage: function () {				//更新当前页
				this.render(this.basePage.pageNumber, this.basePage.pageSize,this.tableId);
			},
			pageChange(current){					//改变页码查询
				this.basePage.pageNumber = current;
				this.current = current;
				this.render(this.current, this.basePage.pageSize,this.tableId);
			},
			pageSizeChange(current){				//改变数量查询
				this.basePage.pageSize = current;
				this.render(this.basePage.pageNumber, current,this.tableId);
			},
			render(numbers, size, id) {					 //查询列表
				this.userManaData = [];
				let userManaUrl = '?pageNum=' + numbers + '&pageSize=' + size + '&groupId=' + id;
				this.loading = false;
				api.api('get',api.configUrl + '/relation/queryPage' + userManaUrl).then(res => {
					if(!res.total) {
						this.$Message.info('根据条件查不到数据');
						this.total = 0;
						this.loading = false;
						return
					}
					this.total = res.total;
					for(let i = 0; i < res.list.length; i++) {
						this.userManaData.push({
							id:res.list[i].id,
							relationName: res.list[i].relationName,
							indexSort: res.list[i].indexSort,
							updateTime: res.list[i].updateTime,
							useStatus: res.list[i].useStatus,
						})
					}
					this.loading = false;
				})
				
			},
		}
	}
</script>
<style lang="less">
	.relationTable{
		.ivu-tabs-bar{
			display: block;
		}
	}
</style>