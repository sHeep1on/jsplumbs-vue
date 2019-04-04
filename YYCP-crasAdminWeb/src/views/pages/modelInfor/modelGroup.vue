
<template>
  <div class="relationTable">
    <div class="showTitle propertyTitle">
      <div>
        <span><img src="@/images/model/modelGroup.png" alt=""></span>
        <span>{{title}}</span>
      </div>
    </div>
    <el-tabs v-model="tabValue" class="inTab" @tab-click="tabChange">
      <el-tab-pane label="基本信息" name="base">
        <div class="contentMain">
          <div class="editBtn">
            <el-button class="edit" size="small" type="ghost" icon="el-icon-edit-outline" :title="title" @click="editBtn">编辑</el-button>
          </div>
          <Form class="baseName">
            <Row>
              <Col span="12">
              <FormItem label="组名称： ">
                <p :title="baseInfor.groupName">{{baseInfor.groupName}}</p>
              </FormItem>
              </Col>
              <Col span="12">
              <FormItem label="排序号：">
                <p :title="baseInfor.indexSort">{{baseInfor.indexSort}}</p>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="模型信息" name="relation">
        <Table :height="height" :loading="loading" stripe ref="selection" :columns="userManaColumns" :data="userManaData"></Table>
        <!-- <Page class="clientPage" :current="current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page> -->
      </el-tab-pane>
    </el-tabs>
    <editListModel ref="editListModel" @save="saveList"></editListModel>
    <editModel ref="addRelation" @update="update"></editModel>
  </div>
</template>
<script>
import api from '@/fetch/api';
import $ from 'jquery';
import { unique } from '@/libs/common/common.js';
import editListModel from './component/editListModel.vue';
import editModel from './component/addModel.vue';
import { timestampToTime } from '@/libs/common/common.js';
export default {
  components: {
    editListModel,
    editModel
  },
  data() {
    return {
      title: "支付宝模型",
      tabValue: "base",
      loading: false,
      id: "",
      height: 0,
      tableId: "",
      baseInfor: {
        groupName: "",
        indexSort: "",
      },
      userManaColumns: [
        {
          title: '模型名称',
          align: 'center',
          key: 'name',
          ellipsis: true,
        },
        {
          title: '排序号',
          align: 'center',
          key: 'indexSort',
          ellipsis: true,
        },
        // {
        // 	title: '启用情况',
        // 	align: 'center',
        // 	key: 'useStatus',
        // 	ellipsis:true,
        // 	render: (h, params) => {
        // 		 return h('i-switch', {
        //             props: {
        //                 value: Number(params.row.useStatus) === 0
        //             },
        //             on: {
        //                 'on-change': (value) => {
        //                     this.switch(params.row._index, params.row.id);
        //                 }
        //             }
        //         });
        // 	}

        // },
        {
          title: '更新时间',
          align: 'center',
          key: 'updateTime',
          ellipsis: true,
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

                    this.editBtnM(params.row.id, event)
                  }
                }
              }, '编辑'),
            ])
          }
        }
      ],
      userManaData: [],
      editId: "",
      useStatus: "",
      useStatusId: "",

    }
  },
  mounted() {

  },
  created() {

  },
  methods: {
    tabChange() {
      if (this.tabValue === "relation") {
        this.render(this.tableId);
      }
    },
    switch(index, id) {				//列表的状态开启
      this.useStatusId = id;
      if (this.userManaData[index].useStatus === 1) {
        this.userManaData[index].useStatus = 0;
        this.useStatus = 0;
      } else {
        this.userManaData[index].useStatus = 1;
        this.useStatus = 1;
      }
      api.api('post', api.configUrl + '/t/model/update', {
        id: this.useStatusId,
        useStatus: this.useStatus
      }).then(res => {
        this.$Message.info('保存成功');
      });
    },
    editBtn() {
      this.$refs.editListModel.editModel = true;
      this.$refs.editListModel.formEdit.id = this.id;
      this.$refs.editListModel.formEdit.groupName = this.baseInfor.groupName;
      this.$refs.editListModel.formEdit.indexSort = this.baseInfor.indexSort;
    },
    editBtnM(id) {
      this.editId = id;
      this.$refs.addRelation.modelGroupMethor();
      api.api('post', api.configUrl + '/t/model/detail', {
        id: id
      }).then(res => {	//这是给的默认值


        this.$refs.addRelation.title = "编辑模型";
        this.$refs.addRelation.modelAdd.id = res.id;
        this.$refs.addRelation.modelAdd.name = res.name;
        this.$refs.addRelation.modelAdd.remark = res.remark;
        this.$refs.addRelation.modelAdd.groupId = res.groupId;
        this.$refs.addRelation.addModal = true;

      });
    },
    update(data) {
      api.api('post', api.configUrl + '/t/model/update', {
        id: this.editId,
        name: data.name,
        remark: data.remark,
        groupId: data.groupId,
      }).then(res => {
        this.$emit("updata", this.tableId)
        this.refreshPage()
      })
    },
    selectTable(name) {			// 选中table的复选框时触发
      this.deleteRoleArr = [];
      this.disabled = true;
      for (let i = 0; i < name.length; i++) {
        this.disabled = false;
        this.deleteRoleArr[i] = name[i].roleId;
      }
      this.load.accountIds = this.deleteRoleArr.join(',')
    },
    rowDetail(item, index) {
      this.lookModal = true;
    },
    saveList(data) {
      api.api('post', api.configUrl + '/t/model/group/update', {
        id: this.id,
        indexSort: data.indexSort,
        groupName: data.groupName,
      }).then(res => {
        this.$emit("updata", this.id);  //带着当前id去修改数据
        this.$emit("updataTree");
      })
    },

    selectTable(name) {									// 选中table的复选框时触发
      this.deleteRoleArr = [];
      this.disabled = true;
      for (let i = 0; i < name.length; i++) {
        this.disabled = false;
        this.deleteRoleArr[i] = name[i].id;
      }
      this.load.accountIds = this.deleteRoleArr.join(',')
    },
    refreshPage: function () {				//更新当前页
      this.render(this.tableId);
    },
    pageChange(current) {					//改变页码查询
      this.basePage.pageNumber = current;
      this.current = current;
      this.render(this.tableId);
    },
    pageSizeChange(current) {				//改变数量查询
      this.basePage.pageSize = current;
      this.render(this.tableId);
    },
    render(id) {					 //查询列表
      this.userManaData = [];
      let userManaUrl = '?groupId=' + id;
      this.loading = false;
      api.api('get', api.configUrl + '/t/model/queryList' + userManaUrl).then(res => {
        if (res.length <= 0) {
          this.$Message.info('根据条件查不到数据');
          this.loading = false;
          return
        }
        for (let i = 0; i < res.length; i++) {
          this.userManaData.push({
            id: res[i].id,
            name: res[i].name,
            indexSort: res[i].indexSort,
            updateTime: res[i].updateTime,
            useStatus: res[i].useStatus,
          })
        }
        this.loading = false;
      })

    },
  }
}
</script>
<style lang="less" scoped>
.relationTable {
  .ivu-tabs-bar {
    display: block;
  }
  .baseBtn {
    height: 50px;
    line-height: 50px;
    .searchBtn {
      float: right;
    }
  }
}
</style>