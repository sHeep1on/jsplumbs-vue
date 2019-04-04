<template>
 <div class="main">
     <div id="relation">
         <div class="search">
            <h2 @click="objectClick">对象列表</h2>
            <el-button type="ghost" size="small" class="imgBtn" :disabled="disabled" @click="delShow">
                <img src="@/images/del.png" :class="{active:isActive}"/> 删除
            </el-button>
            <Dropdown @on-click="handleOpen" class="bntDown">
                <el-button class="imgBtn"><img src="@/images/add.png"/> 新建</el-button>
                <DropdownMenu slot="list">
                    <DropdownItem name="新建组">新建组</DropdownItem>
                     <DropdownItem name="新建对象">新建对象</DropdownItem>
                </DropdownMenu>
            </Dropdown>

         </div>
	    <ZTree ref="tree" @onTree="onTree" @checkChange="handleCheckChange" url="/target/group/selectTree"></ZTree>
     </div>
    <div class="mainContent" >
		 <Tabs :animated="false" v-model="tabValue" class="conternTable">
			 <TabPane label="对象信息" name="objectTable" >
                 <objectTable ref="objectTable" @refresh="referTree"></objectTable>
             </TabPane>
			 <TabPane label="对象组列表信息" name="objectList">
                 <objectList ref="objectList" @renderList="renderList" @refresh="referTree"></objectList>
             </TabPane>
			 <TabPane label="对象表信息" name="objectSource">
                 <objectSource ref="objectSource" @refresh="referTree" @deleteProp="deleteProp"></objectSource>
             </TabPane>
		 </Tabs>
	 </div>
    <addModal ref="addModal" @save="saveSource" @Cancel ="Cancel"></addModal>
    <addObject ref="addObject" @save="saveObject" @Cancel ="Cancel"></addObject>
    <delModal ref="delModal" @deleteModel="del"></delModal>
    <cancelModel ref="cancelModel" @cancelBack="cancelBack" @cancelModal="cancelModal"></cancelModel>
 </div>
</template>

<script>
import api from '@/fetch/api.js';
import $ from 'jquery';
import ZTree from '@/views/Common/search.vue';
import objectTable from '@/views/pages/object/objectTable.vue';
import objectList from '@/views/pages/object/objectList.vue';
import objectSource from '@/views/pages/object/objectSource.vue';
import addModal from '@/views/pages/object/components/addDialog.vue';
import addObject from '@/views/pages/object/components/addObject.vue';
import delModal from '@/views/Common/delete.vue';
import cancelModel from '@/views/Common/cancelModel.vue';
export default {
    components: {
        ZTree,
        objectTable,
        objectList,
        objectSource,
        addModal,
        addObject,
        delModal,
        cancelModel
    },
    data () {
        return {
            delNodes: [],
            delNodesChild: [],
            disabled: true,
            isActive: true,
            tabValue: 'objectTable',
            title:"对象列表",
            props:{
				params:""
			}
        };
    },
    methods: {
        handleOpen(name){
            name == "新建组" ? this.add() : this.addObject()
        },
        Cancel(title){
            title == "新建对象" ? this.$refs.cancelModel.content = "您未建立对象，是否取消？" : this.$refs.cancelModel.content = "您未建立对象组，是否取消？"
            this.$refs.cancelModel.cancelModal = true;
            this.$refs.cancelModel.title = title;
        },
        cancelBack(data){
            if(data === "新建对象")	{
                this.$refs.addObject.addModal = true;
                this.$refs.addObject.objectIcon();
            }else{
                this.$refs.addModal.addModal = true
            }
            this.$refs.cancelModel.cancelModal = false;
        },
        cancelModal(data){										//取消的确认事件
            data === "新建对象" ? this.$refs.addObject.$refs.formAdd.resetFields() : this.$refs.addModal.$refs.formAdd.resetFields()
            this.$refs.cancelModel.cancelModal = false;
        },
        objectClick(){           //title点击切换
            this.tabValue = 'objectTable';
            this.$refs.objectTable.title = this.title;
            this.$refs.objectTable.render('1', '10');
        },
        onTree (nodes) {
            if (nodes.parentId !== '') {
                this.$refs.objectSource.renderIcon(nodes.id);
                this.$refs.objectSource.editId = nodes.id;
                this.$refs.objectSource.titleName = nodes.title;
                this.$refs.objectSource.objectProperty = 'basicMessage';
                this.$refs.objectSource.objectTab = false;
                this.$refs.objectSource.iconParameConfig=[];
                this.tabValue = 'objectSource';
            } else {
                this.$refs.objectList.objectProperty = 'basicMessage';
                this.$refs.objectList.titleName = nodes.title;
                this.tabValue = 'objectList';
                this.renderList(nodes.id);
            }
        },
        handleCheckChange(nodes, checked) {
            if(checked){    // 当前点击为选择状态而不是取消选择
                this.disabled=false;
                this.isActive=false;
                if (nodes.parentId == '') {
                     this.delNodes.push(nodes.id);
                } else {
                     this.delNodesChild.push(nodes.id);
                }
            }else{
                 for(var i = 0; i < this.delNodes.length; i++) {
                    if(this.delNodes[i] === nodes.id) {
                        this.delNodes.splice(i, 1);
                    }
                }
                 for(var i = 0; i < this.delNodesChild.length; i++) {
                    if(this.delNodesChild[i] === nodes.id) {
                        this.delNodesChild.splice(i, 1);
                    }
                }
                if(this.delNodes.length ===0 && this.delNodesChild.length === 0){
                   this.disabled=true;
                   this.isActive=true;
                }
            }
        },
        delShow () {
            this.$refs.delModal.deleteModal = true;
            this.$refs.delModal.title = "删除树结构";
        },
        deleteProp(params){											//属性的删除按钮事件
            this.props.params = params;
            this.$refs.delModal.deleteModal = true;
            this.$refs.delModal.title = "删除属性列表";
            //this.$refs.delModal.deleteModal_loading = false;
        },
        del (value) {
            let params = this.props.params;
            if(value.title === "删除树结构"){
                if(this.delNodesChild.length > 0) {
                    api.api('post', api.configUrl + '/target/delete', {
                        ids: this.delNodesChild.join(',')
                    }).then(res => {
                        this.$refs.tree.initTree();
                        this.$refs.objectTable.refreshPage();
                        this.delNodesChild=[];
                    });
                }
                if(this.delNodes.length > 0) {
                    api.api('post', api.configUrl + '/target/group/delete', {
                        ids: this.delNodes.join(',')
                    }).then(res => {
                        this.$refs.tree.initTree();
                        this.$refs.objectTable.refreshPage();
                        this.delNodes=[];
                    });
                }
                this.tabValue = 'objectTable';
            }
        },
        renderList (id) {
            api.api('post', api.configUrl + '/target/group/detail', {
                id: id
            }).then(res => {
                this.$refs.objectList.id = id;
                this.$refs.objectList.objectDetail.groupName = res.groupName;
                this.$refs.objectList.objectDetail.indexSort = res.indexSort;
            });
        },
        referTree () {
            this.$refs.tree.initTree();
        },
        add () {
            this.$refs.addModal.showModal();
            this.$refs.addModal.formAdd={};
        },
        addObject () {
            this.$refs.addObject.showModal();
            this.$refs.addObject.objectGroup();
            this.$refs.addObject.objectIcon();
            this.$refs.addObject.formAdd={
                targetName: '',
                remark: '',
                groupId: '',
                iconField: ''
            };
        },
        saveSource (data) {
            api.api('post', api.configUrl + '/target/group/save', {
                groupName: data.groupName,
                remark: data.remark
            }).then(res => {
                this.$refs.addModal.addModal=false;
                this.$refs.objectTable.refreshPage();
                this.$refs.tree.initTree();
                this.$refs.addObject.objectGroup();
            });
        },
        saveObject (data) {
            api.api('post', api.configUrl + '/target/save', {
                targetName: data.targetName,
                remark: data.remark,
                groupId: data.groupId,
                iconField: data.need,
                icon: data.iconField
            }).then(res => {
                this.$refs.addObject.addModal=false;
                this.$refs.tree.initTree();
            });
        }
    }
};
</script>
<style lang="less">
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
        .concernShow{
                .ivu-tabs-bar{
                    display: block;
                    background: #fafafa;
                    line-height:48px;
                }
            }
    }
}
</style>
