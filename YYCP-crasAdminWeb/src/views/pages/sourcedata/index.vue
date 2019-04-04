<template>
 <div class="main">
     <div id="relation"  v-chinaOlyloading.fullscreen="spinShow">
         <div class="search">
             <h2 @click="dataTableClick">数据源列表</h2>
             <el-button type="ghost" size="small" class="imgBtn" :disabled="disabled" @click="delShow">
                <img src="@/images/del.png" :class="{active:isActive}"/> 删除
             </el-button>
             <el-button type="ghost" size="small" class="imgBtn" @click="add">
                <img src="@/images/add.png"/> 新建
             </el-button>
         </div>
	    <ZTree ref="tree"
         class="datatree"
          @onTree="onTree"
           @checkChange="handleCheckChange" url="/datasource/selectTree"></ZTree>
     </div>
     <div class="mainContent">
		 <Tabs :animated="false" v-model="tabValue">
			 <TabPane label="源数据表" name="dataTable" class="conternTable">
                 <dataTable ref="dataTable" @refresh="referTree"></dataTable>
             </TabPane>
			 <TabPane label="数据源列表" name="dataList">
                 <dataList ref="dataList" @renderList="renderList" @refresh="referTree" @renderTree="renderTree"></dataList>
             </TabPane>
			 <TabPane label="数据源" name="dataSource">
                 <dataSource ref="dataSource"></dataSource>
             </TabPane>
		 </Tabs>
	 </div>
    <addModal ref="addModal" @save="saveSource" @Cancel ="Cancel"></addModal>
    <delModal ref="delModal" @deleteModel="del"></delModal>
    <cancelModel ref="cancelModel" @cancelBack="cancelBack" @cancelModal="cancelModal"></cancelModel>
 </div>
</template>

<script>
import api from '@/fetch/api.js';
import $ from 'jquery';
import ZTree from '@/views/Common/search.vue';
import dataTable from '@/views/pages/sourcedata/dataTable.vue';
import dataList from '@/views/pages/sourcedata/dataList.vue';
import dataSource from '@/views/pages/sourcedata/dataSource.vue';
import addModal from '@/views/pages/sourcedata/components/addDialog.vue';
import delModal from '@/views/Common/delete.vue';
import cancelModel from '@/views/Common/cancelModel.vue';
let Base64 = require('js-base64').Base64;
export default {
    components: {
        ZTree,
        dataTable,
        dataList,
        dataSource,
        addModal,
        delModal,
        cancelModel
    },
    data () {
        return {
            delNodes: [],
            delChart:[],
            disabled: true,
            isActive: true,
            tabValue: 'dataTable',
            title:"源数据",
            spinShow:false
        };
    },
    mounted () {
    },
    methods: {
        Cancel(title){
            this.$refs.addModal.addModal = false;
            this.$refs.cancelModel.cancelModal = true;
            this.$refs.cancelModel.title = title;
            this.$refs.cancelModel.content = "您未建立数据源，是否取消？";
        },
        cancelBack(data){											//取消的返回事件弹框
            this.$refs.addModal.addModal = true;
            this.$refs.cancelModel.cancelModal = false;
        },
        cancelModal(data){										//取消的确认事件
            this.$refs.addModal.$refs.formAdd.resetFields();
            this.$refs.cancelModel.cancelModal = false;
        },
        dataTableClick(){           //title点击切换
            this.$refs.dataTable.title = this.title;
            this.$refs.dataTable.render('1', '10');
            this.tabValue = 'dataTable';
        },
        onTree (nodes) {
            if (nodes.parentId !== '') {
                this.$refs.dataSource.tableId = nodes.id;
                this.$refs.dataSource.titleName = nodes.title;
                this.$refs.dataSource.render('1', '10', nodes.id);
                this.$refs.dataSource.renderTable();
                this.tabValue = 'dataSource';
            } else {
                this.tabValue = 'dataList';
                this.$refs.dataList.titleName = nodes.title;
                this.$refs.dataList.dataSourceId = nodes.id;
                this.renderList(nodes.id);
            }
        },
        handleCheckChange(nodes, checked,ArrNode,Keys) {
            (Keys.length==0)?(this.disabled=true,this.isActive=true):(this.disabled=false,this.isActive=false)
            this.handleDeleDate(ArrNode)
        },
        handleDeleDate(arr,keys){
            this.delChart=arr.reduce((t,c)=>(c.parentId=='')?t.set(c.id,c):t,new Map())
            let temp =arr.filter(i=>(i.parentId!=='')&&!this.delChart.get(i.parentId)||((i.parentId=='')&&!this.delChart.get(i.id)))
            this.delChart=[...this.delChart.keys()]
            this.delNodes=[]
            temp.map(i=>this.delNodes.push(i.id))
        },
        delShow () {
            this.$refs.delModal.deleteModal = true;
        },
        del () {
            if(this.delChart.length!==0){
                api.api('post', api.configUrl + '/datasource/delete', {
                    ids: this.delChart.join(',')
                }).then(res => {
                    this.tabValue = 'dataTable';
                    this.$refs.tree.initTree();
                    this.$refs.dataTable.refreshPage();
                });
            }
            if(this.delNodes.length!==0){
                api.api('post', api.configUrl + '/table/delete ', {
                    ids: this.delNodes.join(',')
                }).then(res => {
                    this.tabValue = 'dataTable';
                    this.$refs.tree.initTree();
                    this.$refs.dataTable.refreshPage();
                });
            }
        },
        renderList (id) {
            api.api('post', api.configUrl + '/datasource/detail', {
                id: id
            }).then(res => {
                this.$refs.dataList.id = id;
                this.$refs.dataList.sourceDetail.IP = res.ipAddress;
                this.$refs.dataList.sourceDetail.PORT = res.port;
                this.$refs.dataList.sourceDetail.userName = res.userName;
                this.$refs.dataList.sourceDetail.password = res.password;
                this.$refs.dataList.sourceDetail.sourceType = res.dataSourceType;
                this.$refs.dataList.sourceDetail.sourceTypeName = res.dataSourceTypeName;
                this.$refs.dataList.sourceDetail.DB = res.dbName;
                this.$refs.dataTable.refreshPage();
            });
        },
        //刷新树节点
        renderTree(){
            this.referTree();
        },
        referTree () {
            this.$refs.tree.initTree();
        },
        add () {
            this.$refs.addModal.showModal();
        },
        saveSource (data) {
            let index = '';
            var hash = Base64.encode(data.password);
            this.spinShow=true
            let dictNameObj = this.$refs.addModal.dataSourceType.find(i=>i.value==data.source)
            api.api('post', api.configUrl + '/datasource/save', {
                sourceName: data.linkName,
                ipAddress: data.IP,
                port: data.PORT,
                dataSourceType: data.source,
                dataSourceTypeName: dictNameObj.dictName,
                userName: data.userName,
                password: hash,
                dbName: data.DB
            }).then(res => {
                this.$refs.addModal.addModal=false;
                this.$refs.dataTable.refreshPage();
                this.referTree();
                this.spinShow=false
            }).catch(()=>{
                this.spinShow=false
            })
        }
    }
};
</script>
<style lang="less" sco>
.mainContent{
    .ivu-tabs{
        overflow: initial;
        .ivu-tabs-bar{
            display: none;
        }
    }
    .conternTable{
        .relationTable{
            .ivu-tabs-bar{
                display: block;
                background: #fafafa;
                line-height:48px;
            }
        }
    }
}
</style>
