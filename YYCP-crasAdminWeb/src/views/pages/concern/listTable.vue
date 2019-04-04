
<template>
	<div id="listTable">
		<div class="showTitle margin-left-32">
			<div>{{allTitle}}</div>
		</div>	
        <div class="margin-left-32 ">
			<Table :height="height" :loading="loading" stripe ref="relationList" :columns="userManaColumns" :data="userManaData" @on-selection-change="selectTable"></Table>
			<Page class="clientPage" :current="current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
			<listEditModel ref="listEditModel" @save="saveList"></listEditModel>
        </div>
	</div>
</template>

<script>
	import api from '@/fetch/api';
	import $ from 'jquery';
	import listEditModel from './component/editListModel.vue';
	import { timestampToTime } from '@/libs/common/common.js';
	export default {
		components: {
            listEditModel,
        },
		props:{},
		data() {
			return {
				tabTitle:"tabsOne",
				allTitle:"关系列表",
				num: 1,
				height: 0,
				loading: false,
				userManaColumns: [
					{
						type: 'index',
						title: '序号',
						align: 'center',
						width: 75,
					},
					{
						title: '分组名称',
						align: 'center',
						key: 'groupName',
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
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.$refs.listEditModel.editModel = true;
											this.editBtnM(params.row.id,event);
										}
									}
								}, '编辑'),
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
				tab2: true,
				tabTitle:"",
				editId: '',
			}
		},
		mounted() {
		
		},
		created() {
			this.render(this.basePage.pageNumber, this.basePage.pageSize);
		},
		methods: {
			editBtnM(id){			//列表编辑
				this.editId = id;
				api.api('post', api.configUrl + '/relation/group/detail', {
					id: id
				}).then(res => {
					//这是给的默认值
					this.$refs.listEditModel.formValidateAdd.id = id;
					this.$refs.listEditModel.formValidateAdd.groupName = res.groupName;
					this.$refs.listEditModel.formValidateAdd.indexSort = res.indexSort;
				});
			},
			saveList(data){												//列表编辑保存
				api.api('post',api.configUrl + '/relation/group/update',{
					id: this.editId,
					indexSort:data.indexSort,
					groupName:data.groupName,
				}).then(res=>{
					this.$emit("updata")
					this.refreshPage()
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
				this.render(this.basePage.pageNumber, this.basePage.pageSize);
			},
			pageChange(current){					//改变页码查询
				this.basePage.pageNumber = current;
				this.current = current;
				this.render(this.current, this.basePage.pageSize);
			},
			pageSizeChange(current){				//改变数量查询
				this.basePage.pageSize = current;
				this.render(this.basePage.pageNumber, current);
			},
			render(numbers, size) {					 //查询列表
				this.userManaData = [];
				let userManaUrl = '?pageNum=' + numbers + '&pageSize=' + size;
				this.loading = false;
				api.api('get',api.configUrl + '/relation/group/queryPage' + userManaUrl).then(res => {
					if(!res.total) {
						this.$Message.info('根据条件查不到数据');
						this.total = 0;
						this.loading = false;
						return
					}
					this.total = res.total;
					this.userManaData = res.list;
					this.loading = false;
				})
			},
		}
	}
</script>
<style lang="less">
	#listTable{
		.showTitle{
			line-height: 56px;
			font-size: 16px;
			border-bottom: 1px solid #d9d9d9;
		}
	}

</style>
