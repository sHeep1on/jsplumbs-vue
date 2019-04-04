<template>
    <div class="relationTable">
        <div class="showTitle propertyTitle">
            <span><img src="@/images/object.png"/></span>
            <span>{{titleName}}</span>
        </div>
        <el-tabs v-model="objectProperty" class="inTab" @tab-click="propertyClick">
            <el-tab-pane label="基本信息" name="basicMessage">
                <div class="contentMain">
                    <div class="editBtn">
                        <el-button class="edit" type="ghost" icon="el-icon-edit-outline" size="small" @click="editModal">编辑</el-button>
                    </div>
                    <Form class="formShow">
                        <Row>
                            <Col span="12">
                            <FormItem label="组名称： ">
                                <p :title="objectDetail.groupName">{{objectDetail.groupName}}</p>
                            </FormItem>
                            </Col>
                            <Col span="12">
                            <FormItem label="排序号：">
                                <p :title="objectDetail.indexSort">{{objectDetail.indexSort}}</p>
                            </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </el-tab-pane>
            <el-tab-pane label="对象信息" name="objectMessage">
                <Table stripe  :loading="loading" ref="selection" :columns="objectColumns" :data="objecteData" ></Table>
                <Page class="clientPage" :current="current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
            </el-tab-pane>
        </el-tabs>

        <editModal ref="editModal" @save="updateGroup"></editModal>
        <addObject ref="addObject" @save="editObject"></addObject>
    </div>
</template>
<script>
    import api from '@/fetch/api';
    import $ from 'jquery';
    import editModal from '@/views/pages/object/components/editDialog.vue';
    import addObject from '@/views/pages/object/components/addObject.vue';
    import { timestampToTime } from '@/libs/common/common.js';
    export default {
        components: {
            editModal,
            addObject
        },
        data () {
            return {
                id: '',
                titleName: '',
                objectProperty: 'basicMessage',
                editId: '',
                useStatus: '',
                propId: '',
                loading: false,
                pageArray: [ 10, 20, 30, 40 ],
                current: 1,
                total: 0,
                basePage: {
                    pageSize: 10,
                    pageNumber: 1
                },
                objectDetail: {
                    groupName: '',
                    indexSort: ''
                },
                objectColumns: [
                    {
                        title: '对象名称',
                        key: 'targetName',
                        align: 'center',
                        minwidth: 150,
                        ellipsis: true,
                    },
                    {
                        title: '排序号',
                        key: 'indexSort',
                        align: 'center'
                    },
                    // {
                    //     title: '启用情况',
                    //     key: 'useStatus',
                    //     align: 'center',
                    //     render: (h, params) => {
                    //         return h('i-switch', {
                    //             props: {
                    //                 value: Number(params.row.useStatus) === 0
                    //             },
                    //             on: {
                    //                 'on-change': (value) => {
                    //                     this.switch(params.row._index, params.row.id);
                    //                 }
                    //             }
                    //         });
                    //     }
                    // },
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
                                            this.$refs.addObject.showModal();
                                            this.$refs.addObject.title = '编辑对象';
                                            this.$refs.addObject.objectGroup();
                                            this.editO(params.row.id);
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                ],
                objecteData: []
            };
        },
        methods: {
             propertyClick(){
                if(this.objectProperty=="objectMessage"){
                    this.render('1', '10', this.id);
                }
            },
            switch (index, id) {
                this.propId = id;
                if (this.objecteData[index].useStatus === 1) {
                    this.objecteData[index].useStatus = 0;
                    this.useStatus = 0;
                } else {
                    this.objecteData[index].useStatus = 1;
                    this.useStatus = 1;
                }
                api.api('post', api.configUrl + '/target/update', {
                    id: this.propId,
                    useStatus: this.useStatus
                }).then(res => {
                    this.$Message.info(res);
                });
            },
            pageChange (current) {
                this.basePage.pageNumber = current;
                this.current = current;
                this.render(current, this.basePage.pageSize);
            },
            pageSizeChange (current) {
                this.basePage.pageSize = current;
                this.render(this.basePage.pageNumber, current);
            },
            editModal () {
                this.$refs.editModal.showModal();
                this.$refs.editModal.title = '编辑组';
                this.$refs.editModal.formAdd.groupName = this.objectDetail.groupName;
                this.$refs.editModal.formAdd.indexSort = this.objectDetail.indexSort;
            },
            updateGroup (data) {
                api.api('post', api.configUrl + '/target/group/update', {
                    id: this.id,
                    groupName: data.groupName,
                    indexSort: data.indexSort
                }).then(res => {
                    this.$emit('refresh');
                    this.$emit('renderList', this.id);
                    this.titleName = data.groupName;
                });
            },
            refreshPage () {
                this.render(this.basePage.pageNumber, this.basePage.pageSize, this.id);
            },
            render (numbers, size, groupId) {
                this.objecteData = [];
                this.id = groupId;
                let sourceManaUrl = '?pageNum=' + numbers + '&pageSize=' + size + '&groupId=' + groupId;
                this.loading = false;
                api.api('get', api.configUrl + '/target/queryPage' + sourceManaUrl).then(res => {
                    if (!res.total) {
                        this.$Message.info('根据条件查不到数据');
                        this.total = 0;
                        this.loading = false;
                        return;
                    }
                    this.total = res.total;
                    for (let i = 0; i < res.list.length; i++) {
                        this.objecteData.push({
                            id: res.list[i].id,
                            targetName: res.list[i].targetName,
                            indexSort: res.list[i].indexSort,
                            updateTime: res.list[i].updateTime,
                            useStatus: res.list[i].useStatus
                        });
                    }
                    this.loading = false;
                });
            },
            editO (id) {
                this.editId = id;
                api.api('post', api.configUrl + '/target/detail', {
                    id: id
                }).then(res => {
                    this.$refs.addObject.formAdd.targetName = res.targetName;
                    this.$refs.addObject.formAdd.remark = res.remark;
                    this.$refs.addObject.formAdd.groupId = res.groupId;
                    this.$refs.addObject.formAdd.iconField = res.icon;
                });
            },
            editObject (data) {
                api.api('post', api.configUrl + '/target/update', {
                    id: this.editId,
                    targetName: data.targetName,
                    remark: data.remark,
                    groupId: data.groupId,
                    iconField: this.$refs.addObject.iconurl,
                    icon: data.iconField
                }).then(res => {
                    this.refreshPage();
                    this.$emit('refresh');
                    this.$refs.addObject.addModal=false;
                });
            }
        }
    };
</script>
