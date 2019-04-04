
<template>
	<div id="listTable">
		<div class="showTitle margin-left-32">
			<div>{{allTitle}}</div>
		</div>
        <div>
			<Table :height="height" :loading="loading" stripe ref="relationList" :columns="modelListColumns" :data="modelListData" ></Table>
			<!-- <Page class="clientPage"  show-sizer placement="top"  show-elevator show-total></Page> -->
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
				allTitle:"模型信息",
				num: 1,
				height: 0,
				loading: false,
				modelListColumns: [
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
											this.editBtnM(params.row.id);
										}
									}
								}, '编辑'),
							])
						}
					}
				],
				modelListData: [],
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
			this.render();
		},
		methods: {
			editBtnM(id){			//列表编辑
				this.editId = id;
				api.api('post', api.configUrl + '/t/model/group/detail', {
					id: id
				}).then(res => {
					//这是给的默认值
					this.$refs.listEditModel.formEdit.id = id;
					this.$refs.listEditModel.formEdit.groupName = res.groupName;
					this.$refs.listEditModel.formEdit.indexSort = res.indexSort;
				});
			},
			saveList(data){												//列表编辑保存
				api.api('post',api.configUrl + '/t/model/group/update',{
					id: this.editId,
					indexSort:data.indexSort,
					groupName:data.groupName,
				}).then(res=>{
					this.$emit("updata")
					this.refreshPage()
				})
			},
			refreshPage: function () {				//更新当前页
				this.render();
			},
			render() {					 //查询列表
				this.modelListData = [];
				this.loading = false;
				api.api('post',api.configUrl + '/t/model/group/queryList').then(res => {
					if(res.length <= 0) {
						this.$Message.info('根据条件查不到数据');
						this.total = 0;
						this.loading = false;
						return
					}
					this.total = res.total;
					this.modelListData = res;
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
