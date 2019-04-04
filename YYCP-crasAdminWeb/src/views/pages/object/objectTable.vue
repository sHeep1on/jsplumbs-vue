<template>
 <div id="listTable">
    <div class="showTitle margin-left-32">
        <div>{{title}}</div>
    </div>
	 <Table stripe  :loading="loading" ref="selection" :columns="sourceColumns" :data="sourceData" ></Table>
     <Page class="clientPage" :current="current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
     <editModal ref="editModal" @save="updateSource"></editModal>
 </div>
</template>

<script>
import api from '@/fetch/api';
import $ from 'jquery';
import editModal from '@/views/pages/object/components/editDialog.vue';
import { timestampToTime } from '@/libs/common/common.js';
export default {
    components: {
        editModal
    },
    data () {
        return {
            loading: false,
            editId: '',
            title:"对象列表",
            pageArray: [ 10, 20, 30, 40 ],
            current: 1,
            total: 0,
            basePage: {
                pageSize: 10,
                pageNumber: 1
            },
            sourceColumns: [
                {
                    title: '分组名称',
                    width: 250,
                    key: 'groupName',
                    align: 'center',
                    ellipsis: true
                },
                {
                    title: '排序号',
                    key: 'indexSort',
                    align: 'center'
                },
                {
                    title: '更新时间',
                    key: 'updateTime',
                    width: 170,
                    align: 'center',
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
                                        this.$refs.editModal.showModal();
                                        this.$refs.editModal.title = '编辑组';
                                        this.editBtn(params.row.id);
                                    }
                                }
                            }, '编辑')
                        ]);
                    }
                }
            ],
            sourceData: []
        };
    },
    mounted () {
        this.render(this.basePage.pageNumber, this.basePage.pageSize);
        var tipBox = document.createElement('span');
        tipBox.setAttribute('class', 'tip-box');
        this.$nextTick(() => {
            this.$refs.selection.$el
                .querySelector('.ivu-table-tbody')
                .addEventListener('mouseover', function (e) {
                    if (e.target.nodeName == 'SPAN') {
                        if (e.target.innerText.length > 1) {
                            e.target.setAttribute('title', e.target.innerText);
                        }
                    }
                });
        });
    },
    methods: {
        pageChange (current) {
            this.basePage.pageNumber = current;
            this.current = current;
            this.render(current, this.basePage.pageSize);
        },
        pageSizeChange (current) {
            this.basePage.pageSize = current;
            this.render(this.basePage.pageNumber, current);
        },
        editBtn (id) {
            this.editId = id;
            api.api('post', api.configUrl + '/target/group/detail', {
                id: id
            }).then(res => {
                this.$refs.editModal.formAdd.groupName = res.groupName;
                this.$refs.editModal.formAdd.indexSort = res.indexSort;
            });
        },
        updateSource (data) {
            api.api('post', api.configUrl + '/target/group/update', {
                id: this.editId,
                groupName: data.groupName,
                indexSort: data.indexSort
            }).then(res => {
                this.$emit('refresh');
                this.refreshPage();
            });
        },
        refreshPage: function () {
            this.render(this.basePage.pageNumber, this.basePage.pageSize);
        },
        render (numbers, size) {
            this.sourceData = [];
            let sourceManaUrl = '?pageNum=' + numbers + '&pageSize=' + size;
            this.loading = false;
            api.api('get', api.configUrl + '/target/group/queryPage' + sourceManaUrl).then(res => {
                if (!res.total) {
                    this.$Message.info('根据条件查不到数据');
                    this.total = 0;
                    this.loading = false;
                    return;
                }
                this.total = res.total;
                for (let i = 0; i < res.list.length; i++) {
                    this.sourceData.push({
                        id: res.list[i].id,
                        groupName: res.list[i].groupName,
                        indexSort: res.list[i].indexSort,
                        updateTime: res.list[i].updateTime
                    });
                }
                this.loading = false;
            });
        }
    }
};
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
