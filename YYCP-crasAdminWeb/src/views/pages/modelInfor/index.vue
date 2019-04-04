
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
            <DropdownItem name="新建模型">新建模型</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <Search :title="title" :url="url" @onTree="acceptValues" ref="tree" @checkChange="handleCheckChange"></Search>
    </div>
    <div class="mainContent">
      <Tabs v-model="tabTitle" :animated="false" class="conternTable">
        <TabPane label="模型列表" name="tabsOne">
          <listTable ref="listTable" @updata="updataGroup"></listTable>
        </TabPane>
        <TabPane :label="tab1Title" name="tabsSecond">
          <modelGroup ref="modelGroup" @updata="renderList" @updataTree="updataTree"></modelGroup>
        </TabPane>
        <TabPane :label="tab2Title" name="tabsThire">
          <modelDetaile ref="relationInfor" @updata="renderRelationList" @updataTree="updataTree"></modelDetaile>
        </TabPane>
      </Tabs>
    </div>
    <addGroup :title="title" :label="label" ref="searchAdd" @updata="updataGroup" @groupCancel="groupCancel"></addGroup>
    <addModel :title="title" ref="addModel" @updata="updataGroup" @groupCancel="relationCancel"></addModel>
    <deteleModel ref="delete" @deleteModel="deleteModel"></deteleModel>
    <cancelModel ref="cancelModel" @cancelBack="cancelBack" @cancelModal="cancelModal"></cancelModel>
  </div>
</template>

<script>
import api from '@/fetch/api';
import $ from 'jquery';
import { formToLine } from '@/libs/common/common.js';
import Search from '@/views/Common/search.vue';			//左边树
import addGroup from '@/views/Common/addSearch.vue';
import addModel from './component/addModel.vue';
import deteleModel from '@/views/Common/delete.vue';
import cancelModel from '@/views/Common/cancelModel.vue';
import listTable from './modelList.vue';
import modelGroup from './modelGroup.vue';
import modelDetaile from './modelDetaile.vue';
export default {
  components: {
    Search,
    deteleModel,
    addGroup,
    cancelModel,
    addModel,
    modelDetaile,
    modelGroup,
    listTable
  },
  data() {
    return {
      tabTitle: "tabsOne",
      title: '模型信息',
      label: '模型组名称：',
      height: 0,
      url: "/t/model/group/selectTree",
      loading: false,
      tab0: true,
      tab1: true,
      tab2: true,
      tab1Title: "模型组详情",
      tab2Title: '模型详情',
      disabled: "",
      isActive: true,
      delNodesChild: [],
      delNodes: [],
      props: {
        params: ""
      }
    }
  },
  created() {

  },
  methods: {
    handleOpen(name) {
      name == "新建组" ? this.addGroup() : this.addModel()
    },
    titClick() {
      this.tabTitle = 'tabsOne';
      this.$refs.listTable.allTitle = this.title;
      this.$refs.listTable.render();
    },
    addGroup() {                                             //新增组按钮
      var me = this;
      me.$refs.searchAdd.addModal = true;
    },
    groupCancel(title) {											//新增组的取消事件
      this.$refs.searchAdd.addModal = false;
      this.$refs.cancelModel.cancelModal = true;
      this.$refs.cancelModel.title = title;
      this.$refs.cancelModel.content = "您未建立组，是否取消？";
    },
    relationCancel(title) {										//新增关系的取消事件
      this.$refs.addModel.addModal = false;
      this.$refs.cancelModel.cancelModal = true;
      this.$refs.cancelModel.title = title;
      this.$refs.cancelModel.content = "您未建立模型，是否取消？";
    },
    cancelBack(data) {
      if (data === "模型信息") {
        this.$refs.searchAdd.addModal = true;
      } else {
        this.$refs.addModel.addModal = true;
      }
      this.$refs.cancelModel.cancelModal = false;
    },
    cancelModal(data) {
      if (data === "模型信息") {
        this.$refs.searchAdd.$refs.formValidateAdd.resetFields();
      } else if (data === "新增模型") {
        this.$refs.addModel.$refs.formValidateAdd.resetFields();
      }
      this.$refs.cancelModel.cancelModal = false;
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
    addModel() {                                          //新增关系按钮
      this.$refs.addModel.title = "新增模型";
      this.$refs.addModel.addModal = true;
      this.$refs.addModel.modelGroupMethor();
    },
    updataTree() {
      this.$refs.tree.initTree();
    },
    updataGroup(value) {											//新增关系按钮
      // this.$refs.listTable.refreshPage();
      this.$refs.tree.initTree();
    },
    deleteAll() {											//树结构的删除
      if (this.delNodes.length === 0 && this.delNodesChild.length === 0) {
        this.$Message.info('请选择关系');
      } else {
        this.$refs.delete.deleteModal = true;
        this.$refs.delete.title = "删除树结构";
        this.$refs.delete.deleteModal_loading = false;
      }
    },
    deleteModel(value) {										//树结构的删除的模态框
      let params = this.props.params;
      if (value.title === "删除树结构") {
        if (this.delNodesChild.length > 0) {
          api.api('post', api.configUrl + '/t/model/delete', {
            ids: this.delNodesChild.join(',')
          }).then(res => {
            this.disabled = true;
            this.$refs.delete.deleteModal = false;
            this.$refs.tree.initTree();
            this.$refs.listTable.refreshPage();
            this.delNodesChild = [];
          });
        }
        if (this.delNodes.length > 0) {
          api.api('post', api.configUrl + '/t/model/group/delete', {
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
      }
    },
    acceptValues(value) {						//接受树节点点击传值
      if (value.parentId !== '') {
        this.tabTitle = 'tabsThire';
        this.$refs.relationInfor.tabValue = 'model';
        this.tab2Title = value.title;
        this.$refs.relationInfor.tableId = value.id;
        this.$refs.relationInfor.objectTab = false;
        this.$refs.relationInfor.isShowProp = false
        this.renderRelationList(value.id);
      } else {
        this.tabTitle = 'tabsSecond';
        this.$refs.modelGroup.tabValue = 'base';
        this.renderList(value.id)
        this.tab1Title = value.title;
        this.$refs.modelGroup.title = value.title;
        this.$refs.modelGroup.tableId = value.id;
      }
    },
    renderList(id) {										//更新模型组的列表数据
      api.api('post', api.configUrl + '/t/model/group/detail', {
        id: id
      }).then(res => {
        this.$refs.modelGroup.id = id;
        this.$refs.modelGroup.baseInfor.groupName = res.groupName;
        this.$refs.modelGroup.baseInfor.indexSort = res.indexSort;
        // this.updataTree()
      });
    },
    renderRelationList(id) {									//更新模型的列表展示
      let ids = '?id=' + id;
      api.api('get', api.configUrl + '/t/model/detail' + ids).then(res => {
        this.$refs.relationInfor.id = id;
        this.$refs.relationInfor.baseInfor.name = res.name;
        this.$refs.relationInfor.baseInfor.useStatus = res.useStatus;
        this.$refs.relationInfor.baseInfor.groupId = res.groupId;
        this.$refs.relationInfor.baseInfor.groupName = res.groupName;
        this.$refs.relationInfor.baseInfor.remark = formToLine(res.remark);
        this.$refs.relationInfor.baseInfor.indexSort = res.indexSort;
        if (Number(this.$refs.relationInfor.baseInfor.useStatus) === 1) {
          this.$refs.relationInfor.onOff = false;
        } else {
          this.$refs.relationInfor.onOff = true;
        }
        this.$refs.relationInfor.toastShow();
      });


    }
  }
}
</script>
<style lang="less">
#relation {
  h2 {
    float: left;
  }
  button {
    float: right;
  }
}
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
