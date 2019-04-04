<template>
 <div>
     <div class="relationShow">
         <div class="showTitle">
             <h2><img src="@/images/tableicon.png"/>{{titleName}}</h2>
             <Input search v-model="searchVal" type="text" class="searchbtn" icon="ios-search" @on-enter="searchOB" @on-click="searchOB" placeholder="请输入搜索对象" />
         </div>
         <div class="ShowInfor padding-right-20">
             <Form>
                 <Row>
                     <Col span="10">
                     <FormItem label="表名：">
                         <p>{{ShowInfor.tableName}}</p>
                     </FormItem>
                     </Col>
                     <Col span="13">
                     <FormItem label="表中文名：">
                        <p v-if="eName">{{ShowInfor.tableNameCn}}<Icon type="edit" @click="edit"/></p>
                        <Input v-if="eEdit" v-model="tbName" type="text" icon="checkmark" class="inputEdit" @on-click="saveName"/>
                     </FormItem>
                     </Col>
                     <Col span="1">
                     <FormItem>
                         <el-button size='small'  @click="renewal">
                             更新
                        </el-button>
                     </FormItem>
                     </Col>
                 </Row>
             </Form>
         </div>
         <Table stripe :loading="loading" ref="selection" :columns="tableColumns" :data="tableData" ></Table>
         <Page class="clientPage" :current="current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
     </div>
 </div>
</template>

<script>
import api from '@/fetch/api';
import { tableToLine, formToLine } from '@/libs/common/common.js';
export default {
    data () {
        return {
            loading: false,
            eName: true,
            eEdit: false,
            isSearch: false,
            tableId: '',
            titleName: '',
            tbName: '',
            searchVal: '',
            pageArray: [10, 20, 30, 40],
            current: 1,
            total: 0,
            basePage: {
                pageSize: 10,
                pageNumber: 1
            },
            ShowInfor: {
                tableName: '',
                tableNameCn: ''
            },
            tableColumns: [
                {
                    title: '字段名',
                    key: 'columnName',
                    align: 'center'
                },
                {
                    title: '字段中文名',
                    key: 'columnNameCn',
                    align: 'center'
                },
                {
                    title: '字段类型',
                    key: 'columnType',
                    align: 'center'
                }],
            tableData: []
        };
    },
    created(){
    },
    methods: {
        renewal(){
            api.api('post',api.configUrl+'/datasource/updateTableFields',{tableId:this.tableId}).then(res=>{
                this.render(1, this.basePage.pageSize, this.tableId);
            }).then(res => {
                this.$Message.info(res);
            });

        },
        edit() {
            this.eName = false;
            this.eEdit = true;
        },
        saveName(){
            this.eName = true;
            this.eEdit = false;
            this.ShowInfor.tableNameCn = this.tbName;
            api.api('post', api.configUrl + '/table/update',{
                id: this.tableId,
                tableNameCn: this.tbName
            }).then(res => {
                this.$Message.info(res);
            });
        },
        searchOB(){
            this.render(1, 10, this.tableId, this.searchVal);
            this.disabled = true;
            this.isSearch = true;
            this.current = 1;
        },
        pageChange (current) {//改变页码查询
            this.basePage.pageNumber = current;
            this.current = current;
            if(this.isSearch){
                this.render(current, this.basePage.pageSize, this.tableId, this.searchVal);
            }else{
                this.render(current, this.basePage.pageSize, this.tableId);
            }
        },
        pageSizeChange (current) {//改变数量查询
            this.basePage.pageSize = current;
            if(this.isSearch){
                this.render(current, this.basePage.pageSize, this.tableId, this.searchVal);
            }else{
                this.render(current, this.basePage.pageSize, this.tableId);
            }
        },
        renderTable () {
            api.api('get', api.configUrl + '/table/queryList?id='+ this.tableId).then(res => {
                this.ShowInfor.tableName =formToLine(res[0].tableName);
                this.ShowInfor.tableNameCn =formToLine(res[0].tableNameCn);
            });
            this.tableNameCn = this.ShowInfor.tableNameCn;
        },
        render (numbers, size, id, name) {
            this.tableData = [];
            this.loading = false;
            let sourceManaUrl = '?pageNum=' + numbers + '&pageSize=' + size + '&tableId=' + id;
            if(name) {
                sourceManaUrl += '&columnName=' + name;
            }
            api.api('get', api.configUrl + '/tableProp/queryPage' + sourceManaUrl).then(res => {
                if (!res.total) {
                    this.$Message.info('根据条件查不到数据');
                    this.total = 0;
                    this.loading = false;
                    return;
                }
                this.total = res.total;
                this.tableData = tableToLine(res.list);
                this.loading = false;
            });
        }
    }
};
</script>
<style>
    .searchbtn{
        width: auto;
        float: right;
        margin-top: 10px;
    }
    .searchbtn  .ivu-input-icon{
        font-size: 25px!important;
    }
    .searchbtn .ivu-icon{
        width: auto!important;
        margin: 3px 5px 0 0;
    }
    .ivu-form .ivu-form-item-label{
        padding-left: 0;
    }
    .inputEdit .ivu-icon {
        width: 32px;
        height: 32px;
    }
</style>

