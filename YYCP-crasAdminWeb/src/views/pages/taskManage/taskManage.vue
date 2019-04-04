
<template>
	<div id="addMapping">
		<div class="wholeContent">
			<div class="concernTable">
				<div class="headerTitle">
					<h1 class="margin-left-20 addMap" >任务管理</h1>
					<Form ref="formDynamic" inline >
						<FormItem  class="margin-right-20" v-model="searchData">
							<Input type="text" clearable v-model.trim="searchData.inputData" placeholder="请输入表名、中文名、表组"></Input>
						</FormItem>
						<Button type="primary" size = "small" class="searchBtn" @click="searchBtn">查询</Button>
						<Button type="default" size = "small" class="searchBtn" @click="addModelBtn">新增</Button>
					</Form>
				</div>
				<div class="margin-left-20 ">
					<div class="tabTitle">
						<span inline>{{title}}</span>
					</div>
					<Table @on-row-click="rowDetail" :height="height" :loading="loading" stripe ref="selection" :columns="userManaColumns" :data="userManaData" @on-selection-change="selectTable"></Table>
					<Page class="clientPage margin-left-20" :current="current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
				</div>
			</div>
			<taskManage :title=title ref="addMappingModel"></taskManage>
		</div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import $ from 'jquery';
	// import { unique } from '@/libs/common/common.js';
	import taskManage from './taskManageModel.vue';
	
	export default {
		components: {
			taskManage,
		},
		data() {
			return {
				title:'任务管理',
				height: 0,
				loading: false,
				searchData:{
					inputData:''
				},
				userManaColumns: [{
						type: 'selection',
						width: 60,
						align: 'center'
					},{
						type: 'index',
						width: 75,
						title: '表名',
						align: 'center'
					},{
						title: '表中文名',
						align: 'center',
						key: 'roleName1',
						ellipsis:true,
						// minWidth: 180,
					},{
						title: '已建关系或对象',
						align: 'center',
						key: 'rolePnam2e',
						ellipsis:true,
					    // minWidth: 140,
					},{
						title: '所属数据源',
						align: 'center',
						key: 'rolePnam3e',
						ellipsis:true,
					    // minWidth: 100,
					},{
						title: '所属表组',
						align: 'center',
						key: 'rolePname4',
						ellipsis:true,
					    // minWidth: 200,
					},{
						title: '表记录数',
						align: 'center',
						key: 'rolePname4',
						ellipsis:true,
					    // minWidth: 200,
					},{
						title: '数据最近更新时间',
						align: 'center',
						key: 'rolePname4',
						ellipsis:true,
					    // minWidth: 200,
					},{
						title: '操作',
						key: 'operate',
						align: 'center',
						width: 75,
						render: (h, params) => {
							return h('div', [
								h('a', {
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.addModal = true;
											this.title = "编辑角色";
											this.editBtnM(params.row.roleId,event)
										}
									}
								}, '移除'),
							])
						}
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
				tab0: true,
                tab1: true,
                tab2: true
			}
		},
		mounted() {
		
		},
		created() {

		},
		methods: {
			rowDetail(item,index){
				this.lookModal = true;
				this.editBtnM(item.roleId,event)
			},
			selectTable(name) {// 选中table的复选框时触发
				this.deleteRoleArr = [];
				this.disabled = true;
				for(let i = 0; i < name.length; i++) {
					this.disabled = false;
					this.deleteRoleArr[i] = name[i].roleId;
				}
				this.load.accountIds=this.deleteRoleArr.join(',')
			},
			pageChange(current){//改变页码查询
				this.basePage.pageNumber = current;
				this.current=current;
				this.render(current, this.basePage.pageSize, this.formDynamic.roleName);
			},
			pageSizeChange(current){//改变数量查询
				this.basePage.pageSize = current;
				this.render(this.basePage.pageNumber, current, this.formDynamic.roleName);
			},
			render(numbers, size, roleName) { //查询列表
				this.userManaData = [];
				let userManaUrl = '?pageNum=' + numbers + '&pageSize=' + size;
				if(roleName) {
					userManaUrl += '&roleName=' + roleName;
				}
				this.loading = false;
				api.api('get',api.configUrl+'/role/queryPage' + userManaUrl).then(res => {
					if(!res.total) {
							this.$Message.info('根据条件查不到数据');
							this.total = 0;
							this.loading = false;
							return
						}
						this.total = res.total;
						for(let i = 0; i < res.list.length; i++) {
							this.userManaData.push({
								roleId: res.list[i].id,
								rolePname: res.list[i].nameCn,
								roleName: res.list[i].roleName
							})
						}
						this.loading = false;
				})
			},
			searchBtn(){										//搜索框按钮事件							
				// console.log(this.searchData.inputData)
			},
			addModelBtn(){										//添加模态框按钮事件							
				var me = this;
                me.$refs.addMappingModel.addModal = true;
			}
		}
	}
</script>

