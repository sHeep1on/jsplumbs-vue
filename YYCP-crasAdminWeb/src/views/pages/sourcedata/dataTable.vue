<template>
 <div id="listTable">
     <div class="showTitle margin-left-32">
        <div>{{title}}</div>
     </div>
	 <Table stripe  :loading="loading" ref="selection" :columns="sourceColumns" :data="sourceData" ></Table>
     <Page class="clientPage" :current="current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
     <addModal ref="addModal" @save="updateSource"></addModal>
 </div>
</template>

<script>
import api from '@/fetch/api';
import $ from 'jquery';
import addModal from '@/views/pages/sourcedata/components/addDialog.vue';
import { timestampToTime } from '@/libs/common/common.js';
let Base64 = require('js-base64').Base64;
export default {
    components: {
        addModal
    },
    data () {
        return {
            loading: false,
            title: '数据源列表',
            editId: '',
            pageArray: [ 10, 20, 30, 40 ],
            current: 1,
            total: 0,
            basePage: {
                pageSize: 10,
                pageNumber: 1
            },
            sourceColumns: [
                {
                    title: '数据源名称',
                    key: 'sourceName',
                    ellipsis: true,
                    align: 'center'
                },
                {
                    title: 'IP地址',
                    width: 150,
                    key: 'ipAddress',
                    ellipsis: true,
                    align: 'center'
                },
                {
                    title: '端口',
                    key: 'port',
                    ellipsis: true,
                    align: 'center'
                },
                {
                    title: '用户名',
                    key: 'userName',
                    ellipsis: true,
                    align: 'center'
                },
                {
                    title: '数据库',
                    key: 'dbName',
                    ellipsis: true,
                    align: 'center'
                },
                {
                    title: '数据源类型',
                    key: 'dataSourceTypeName',
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
        editBtn (id) {              //gy --start
            this.editId = id;
            var res = new Promise(resolve => {
                api.api('post', api.configUrl + '/datasource/detail', {
                    id: id
                }).then(res => {
                    this.$refs.addModal.formAdd.linkName = res.sourceName;
                    this.$refs.addModal.formAdd.IP = res.ipAddress;
                    this.$refs.addModal.formAdd.PORT = res.port;
                    this.$refs.addModal.formAdd.source =  res.dataSourceType;
                    this.$refs.addModal.formAdd.userName = res.userName;
                    this.$refs.addModal.formAdd.password = Base64.decode(res.password)
                    this.$refs.addModal.formAdd.DB = res.dbName;
                    resolve();
                });
            })
            res.then(resolve => {
                this.$refs.addModal.showModal();
                this.$refs.addModal.title = '编辑数据源';
                this.$refs.addModal.selectDisabled=true;
            })
           //gy--end
        },
        updateSource (data) {
            api.api('post', api.configUrl + '/datasource/update', {
                id: this.editId,
                sourceName: data.linkName,
                ipAddress: data.IP,
                port: data.PORT,
                dataSourceType: data.source,
                userName: data.userName,
                password: data.password,
                dbName: data.DB
            }).then(res => {
                this.$emit('refresh');
                this.refreshPage();
                this.$refs.addModal.addModal=false;
            });
        },
        refreshPage: function () {
            this.render(this.basePage.pageNumber, this.basePage.pageSize);
        },
        render (numbers, size) {
            this.sourceData = [];
            let sourceManaUrl = '?pageNum=' + numbers + '&pageSize=' + size;
            this.loading = false;
            api.api('get', api.configUrl + '/datasource/queryPage' + sourceManaUrl).then(res => {
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
                        sourceName: res.list[i].sourceName,
                        ipAddress: res.list[i].ipAddress,
                        port: res.list[i].port,
                        userName: res.list[i].userName,
                        dbName: res.list[i].dbName,
                        dataSourceType: res.list[i].dataSourceType,
                        dataSourceTypeName: res.list[i].dataSourceTypeName,
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

