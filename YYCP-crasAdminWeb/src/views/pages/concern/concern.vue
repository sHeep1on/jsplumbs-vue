<template>
  <div class="main">
    <div id="relation">
      <div class="search">
        <h2 @click="titClick">{{title}}</h2>
        <el-button type="ghost" size="small" class="imgBtn" :disabled="disabled" @click="deleteAll">
          <img src="@/images/del.png" :class="{active:isActive}" /> 删除
        </el-button>
        <Dropdown @on-click="handleOpen" class="bntDown">
          <el-button class="imgBtn"><img src="@/images/add.png" /> 新建</el-button>
          <DropdownMenu slot="list">
            <DropdownItem name="新建组">新建组</DropdownItem>
            <DropdownItem name="新建关系">新建关系</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Search :title="title" @onTree="acceptValues" ref="tree" @checkChange="handleCheckChange"></Search>
    </div>
    <div class="mainContent">
      <Tabs v-model="tabTitle" :animated="false" class="conternTable" >
        <TabPane name="tabsOne">
          <listTable ref="listTable" @updata="updataGroup"></listTable>
        </TabPane>
        <TabPane name="tabsSecond">
          <concernListDetaile ref="relationShow" @updata="renderList" @updataTree="updataTree" @upTree="updataTree"></concernListDetaile>
        </TabPane>
        <TabPane name="tabsThire" >
          <concernTableInfor v-if="isResetCom" ref="relationInfor" @updata="renderRelationList" @deleteProp="deleteProp" @updataTree="updataTree"></concernTableInfor>
        </TabPane>
      </Tabs>
    </div>
    <searchAdd :title="title" :label="label" ref="searchAdd" @updata="updataGroup" @groupCancel="groupCancel"></searchAdd>
    <addRelation :title="title" ref="addRelation" @updata="updataGroup" @groupCancel="relationCancel"></addRelation>
    <deteleModel ref="delete" @deleteModel="deleteModel"></deteleModel>
    <cancelModel ref="cancelModel" @cancelBack="cancelBack" @cancelModal="cancelModal"></cancelModel>
  </div>
</template>

<script>
import api from '@/fetch/api';
import $ from 'jquery';
import { formToLine } from '@/libs/common/common.js';
import Search from '@/views/Common/search.vue';			//左边树
import searchAdd from '@/views/Common/addSearch.vue';
import addRelation from '@/views/Common/addRelation.vue';
import deteleModel from '@/views/Common/delete.vue';
import cancelModel from '@/views/Common/cancelModel.vue';
import listTable from './listTable.vue';
import concernListDetaile from './concernListDetaile.vue';
import concernTableInfor from './concernTableInfor.vue';
export default {
  components: {
    Search,
    deteleModel,
    searchAdd,
    addRelation,
    cancelModel,
    concernTableInfor,
    concernListDetaile,
    listTable
  },
  props: {},
  data() {
    return {
      tabTitle: "tabsOne",
      disabled: true,
      isActive: true,
      title: '关系信息',
      label: "关系组名称",
      height: 0,
      loading: false,
      fromTarget: "",
      toTarget: "",
      delNodesChild: [],
      delNodes: [],
      props: {
        params: ""
      },
      isResetCom:false
    }
  },
  created() {
  },
  methods: {
    handleOpen(name) {
      name == "新建组" ? this.addGroup() : this.addRelation()
    },
    addGroup() {                                             //新增组按钮
      var me = this;
      me.$refs.searchAdd.addModal = true;
      // me.$refs.searchAdd.judgeTips();
    },
    groupCancel(title) {											//新增组的取消事件
      this.$refs.searchAdd.addModal = false;
      this.$refs.cancelModel.cancelModal = true;
      this.$refs.cancelModel.title = title;
      this.$refs.cancelModel.content = "您未建立组，是否取消？";
    },
    relationCancel(title) {										//新增关系的取消事件
      this.$refs.addRelation.addModal = false;
      this.$refs.cancelModel.cancelModal = true;
      this.$refs.cancelModel.title = title;
      this.$refs.cancelModel.content = "您未建立关系，是否取消？";
    },
    cancelBack(data) {											//取消的返回事件弹框
      if (data === "关系信息") {
        this.$refs.searchAdd.addModal = true;
      } else if (data === "新增关系") {
        this.$refs.addRelation.addModal = true;
      }
      this.$refs.cancelModel.cancelModal = false;
    },
    cancelModal(data) {										//取消的确认事件
      if (data === "关系信息") {
        this.$refs.searchAdd.$refs.formValidateAdd.resetFields();
      } else if (data === "新增关系") {
        this.$refs.addRelation.$refs.formValidateAdd.resetFields();
      }
      this.$refs.cancelModel.cancelModal = false;
    },
    addRelation() {                                          //新增关系按钮
      this.$refs.addRelation.title = "新增关系";
      this.$refs.addRelation.addModal = true;
      this.$refs.addRelation.groupIdArrMethor();
    },
    handleCheckChange(nodes, checked) {
      if (checked) {    // 当前点击为选择状态而不是取消选择
        this.disabled = false;
        this.isActive = false;
        if (nodes.parentId !== '') {
          this.delNodesChild.push(nodes.id);
        } else {
          this.delNodes.push(nodes.id);
        }
      } else {
        for (var i = 0; i < this.delNodes.length; i++) {
          if (this.delNodes[i] === nodes.id) {
            this.delNodes.splice(i, 1);
          }
        }
        for (var i = 0; i < this.delNodesChild.length; i++) {
          if (this.delNodesChild[i] === nodes.id) {
            this.delNodesChild.splice(i, 1);
          }
        }
        if (this.delNodes.length == 0 && this.delNodesChild.length == 0) {
          this.disabled = true;
          this.isActive = true;
        }
      }
    },
    updataTree() {
      this.$refs.tree.initTree();
    },
    updataGroup(value) {											//新增关系按钮
      // this.$refs.listTable.refreshPage();
      this.$refs.tree.initTree();
    },
    deleteAll() {
      if (this.delNodes.length === 0 && this.delNodesChild.length === 0) {
        this.$Message.info('请选择关系');
      } else {
        this.$refs.delete.deleteModal = true;
        this.$refs.delete.title = "删除树结构";
        this.$refs.delete.deleteModal_loading = false;
      }
    },
    deleteProp(params) {											//属性的删除按钮事件
      this.props.params = params;
      this.$refs.delete.deleteModal = true;
      this.$refs.delete.title = "删除属性列表";
      this.$refs.delete.deleteModal_loading = false;
    },
    deleteModel(value) {
      let params = this.props.params;
      if (value.title === "删除树结构") {
        if (this.delNodesChild.length > 0) {
          api.api('post', api.configUrl + '/relation/delete', {
            ids: this.delNodesChild.join(',')
          }).then(res => {
            this.disabled = true;
            this.$refs.tree.initTree();
            this.$refs.listTable.refreshPage();
            this.delNodesChild = [];
          });
        }
        if (this.delNodes.length > 0) {
          api.api('post', api.configUrl + '/relation/group/delete', {
            ids: this.delNodes.join(',')
          }).then(res => {
            this.disabled = true;
            this.$refs.tree.initTree();
            this.$refs.listTable.refreshPage();
            this.delNodes = [];
          });
        }
        this.tabTitle = 'tabsOne';
        this.$refs.listTable.allTitle = this.title;
        this.$refs.listTable.render('1', '10');
         this.isResetCom = false
      } else {
        let index = params.index;
        let realationId = this.$refs.relationInfor.tableId;
        let ids = '?ids=' + params.row.id;
        if (params.row.id === null) {
          this.$refs.relationInfor.userManaData.splice(index, 1);
        } else {
          this.$refs.relationInfor.userManaData.splice(index, 1);
          api.api('post', api.configUrl + '/relation/prop/delete' + ids).then(res => {
            this.$Message.info('数据删除成功');
            this.$refs.relationInfor.render(realationId);
          })
        }

      }
    },
    titClick() {
      this.tabTitle = 'tabsOne';
      this.$refs.listTable.allTitle = this.title;
      this.$refs.listTable.render('1', '10');
      this.isResetCom = false
    },
    acceptValues(value) {						//接受树节点点击传值
      if (value.parentId !== '') {
        this.isResetCom=false
        this.$nextTick(()=>{
          this.isResetCom=true
          this.$nextTick(()=>{
            this.tabTitle = 'tabsThire';
            this.$refs.relationInfor.tabValue = 'relation';
            this.$refs.relationInfor.title = value.title;
            this.$refs.relationInfor.tableId = value.id;
            this.$refs.relationInfor.objectTab = false;
            // this.$refs.relationInfor.showProp = false;
            this.renderRelationList(value.id);
          })

        })
      } else {
        this.isResetCom=false
        this.tabTitle = 'tabsSecond';
        this.$refs.relationShow.tabValue = 'base';
        this.renderList(value.id);
        this.$refs.relationShow.allTitle = value.title;
        this.$refs.relationShow.tableId = value.id;
      }
    },
    renderList(id) {						//更新关系列表数据
      api.api('post', api.configUrl + '/relation/group/detail', {
        id: id
      }).then(res => {
        this.$refs.relationShow.id = id;
        this.$refs.relationShow.baseInfor.groupName = formToLine(res.groupName);
        this.$refs.relationShow.baseInfor.indexSort = formToLine(res.indexSort);
      });
    },
    renderRelationList(id) {											//关系基本信息情的列表展示---及刷新
      let ids = '?id=' + id;
      api.api('get', api.configUrl + '/relation/detail' + ids).then(res => {
        this.$refs.relationShow.id = id;
        this.$refs.relationInfor.baseInfor.relationName = formToLine(res.relationName);
        this.$refs.relationInfor.baseInfor.groupId = res.groupId;
        this.$refs.relationInfor.baseInfor.fromTarget = res.fromTargetName;	//原对象
        this.$refs.relationInfor.baseInfor.remark = formToLine(res.remark);
        this.$refs.relationInfor.baseInfor.toTarget = res.toTargetName;		//目标对象
        this.$refs.relationInfor.baseInfor.groupName = res.groupName;
        this.$refs.relationInfor.baseInfor.useStatus = Number(res.useStatus);
        this.$refs.relationInfor.baseInfor.toTargetId = res.toTarget;
        this.$refs.relationInfor.baseInfor.fromTargetId = res.fromTarget;
        this.$refs.relationInfor.baseInfor.indexSort = res.indexSort;
        if (Number(this.$refs.relationInfor.baseInfor.useStatus) === 1) {
          this.$refs.relationInfor.onOff = false;
        } else {
          this.$refs.relationInfor.onOff = true;
        }
        this.$refs.relationInfor.toastShow();
      });
    },
  }
}
</script>
<style lang="less">
.mainContent {
  .ivu-tabs {
    overflow: initial;
    .ivu-tabs-bar {
      display: none;
    }
  }
  .conternTable {
    .relationTable {
      .ivu-tabs-bar {
        display: block;
        background: #fafafa;
        line-height: 48px;
      }
    }
    .concernShow {
      .ivu-tabs-bar {
        display: block;
        background: #fafafa;
        line-height: 48px;
      }
    }
  }
  .tabTitle {
    font-size: 14px;
    background: #ccc;
    line-height: 30px;
  }
}
</style>
