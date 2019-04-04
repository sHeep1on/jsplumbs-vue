
<template>
  <div id="addMapping">
    <div class="addMap">
      <div class="mappingTitle">{{title}}</div>
      <div class="mapSearch">
        <Input class="mapInput" v-model="searchData" icon="ios-search" @on-click="searchBtn" @on-enter="searchBtn" placeholder="请输入数据源、表名、表中文名来查询..." style="width: 200px" />
        <el-button size="small" icon="el-icon-info" class="searchBtn" @click="clearRedisCache">清除缓存</el-button>
        <el-button size="small" icon="el-icon-refresh" class="searchBtn" @click="updataMap">图结构更新</el-button>
        <el-button size="small" icon="el-icon-plus" class="searchBtn" @click="addModelBtn">添加</el-button>
      </div>
    </div>
    <div>
      <Table :loading="loading" stripe ref="selection" :columns="userManaColumns" :data="mappingData"></Table>
      <Page class="clientPage" :current="current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
    </div>
    <addMappingModel :title="title" ref="addMappingModel" @sendData="sendData" @dataList="dataList" @mappingCancel="mappingCancel"></addMappingModel>
    <finnalModel ref="finnalModel" @forceBack="forceBack" @remove="remove" @modelOk="modelOk"></finnalModel>
    <deteleModel ref="delete" @deleteModel="deleteModel"></deteleModel>
    <cancelModel ref="cancelModel" @cancelBack="cancelBack" @cancelModal="cancelModal"></cancelModel>
    <lookModel ref="lookModel"></lookModel>
    <china-oly-loading :isLoading="isLoading" :loadingText="loadingContent"></china-oly-loading>
  </div>
</template>

<script>
import api from "@/fetch/api";
import $ from "jquery";
import {
  toNull,
  tableToLine,
  lineToNull,
  timestampToTime
} from "@/libs/common/common.js";
import addMappingModel from "./model/addMappingModel.vue";
import lookModel from "./model/lookModel.vue";
import deteleModel from "@/views/Common/delete.vue";
import cancelModel from "@/views/Common/cancelModel.vue";
import finnalModel from "./model/finnalModel.vue";
import chinaOlyLoading from "@/views/Common/loading.vue";
export default {
  components: {
    addMappingModel,
    finnalModel,
    deteleModel,
    cancelModel,
    lookModel,
    chinaOlyLoading
  },
  data() {
    return {
      title: "映射配置",
      height: 0,
      loading: false,
      isLoading: false,
      loadingContent: "玩命更新中...",
      searchData: "",
      updataMapLoading: false,
      userManaColumns: [
        {
          title: "表名",
          key: "tableName",
          align: "center",
          render: (h, params) => {
            let value = params.row.tableName ? params.row.tableName : "--";
            return h("span", value);
          }
        },
        {
          title: "表中文名",
          align: "center",
          key: "tableNameCn",
          ellipsis: true,
          render: (h, params) => {
            let value = params.row.tableNameCn ? params.row.tableNameCn : "--";
            return h("span", value);
          }
        },
        {
          title: "已建关系或对象",
          align: "center",
          ellipsis: true,
          render: (h, params) => {
            let value = params.row.relationName
              ? params.row.relationName
              : params.row.targetName;
            return h("div", value);
          }
        },
        {
          title: "所属数据源",
          align: "center",
          key: "sourceName",
          ellipsis: true
        },
        {
          title: "数据最近同步时间",
          align: "center",
          key: "finalLoadTime",
          ellipsis: true,
          render: (h, params) => {
            //let value = params.row.finalLoadTime!==null ? params.row.finalLoadTime : "--";
            return h("div", params.row.finalLoadTime!==null ?timestampToTime(params.row.finalLoadTime):'--');
          }
        },
        {
          title: "同步数据量",
          align: "center",
          key: "finalLoadDataAmout",
          ellipsis: true,
          render: (h, params) => {
            //let value = params.row.finalLoadTime!==null ? params.row.finalLoadTime : "--";
            return h("div", params.row.finalLoadDataAmout!==null ?params.row.finalLoadDataAmout:'--');
          }
        },
        {
          title: "同步状态",
          align: "center",
          key: "useStatus",
          ellipsis: true,
          render: (h, params) => {
            //let value = params.row.finalLoadTime!==null ? params.row.finalLoadTime : "--";
            return h("div", this.handleStatus(params.row.useStatus));
          }
        },
        {
          title: "操作",
          key: "operate",
          align: "center",
          width: 250,
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.delete(params.row.id);
                    }
                  }
                },
                "移除 |"
              ),
              h(
                "a",
                {
                  on: {
                    click: () => {
                      this.look(params.row);
                    }
                  }
                },
                "查看 | "
              ),
              h(
                "a",
                {
                  on: {
                    click: () => {
                      this.synchrodata(params.row);
                    }
                  }
                },
                "同步"
              )
            ]);
          }
        }
      ],
      mappingData: [],
      pageArray: [10, 20, 30, 40],
      basePage: {
        pageSize: 10,
        pageNumber: 1
      },
      current: 1,
      total: 0, // 分页显示的总数量,
      addmappingData: {},
      finnalData: [],
      listId: "",
      dataTableList: []
    };
  },
  created() {
    this.rendtable(
      this.basePage.pageNumber,
      this.basePage.pageSize,
      this.searchData
    );
  },
  methods: {
    handleStatus(val){
      let obj = {
        '0':'同步成功',
        '1':'同步失败'
      }
      return obj[val]
    },
    clearRedisCache(){
      api.api('post',api.configUrl+'/resetRedisCache/reset').then(res=>{
        this.$message.success(res)

      }).catch(error=>{

      })
    },
    updataMap() {
      //图结构更新
      this.isLoading = true;
      this.loadingContent = "玩命更新中...";
      var _this = this;
      var promise = new Promise(resolve => {
        api
          .api("post", api.configUrl + "/graphSon/addgraphSon", {}, function () {
            if (code === 400) {
              _this.isLoading = false;
            }
          })
          .then(res => {
            resolve();
          });
      });
      promise.then(() => {
        this.$message({
          message: "恭喜你，图结构更新成功",
          type: "success"
        });
        this.isLoading = false;
      });
    },
    synchrodata(params) {
      //同步数据
      this.isLoading = true;
      this.loadingContent = "玩命同步中...";
      var me = this;
      var promise = new Promise(resolve => {
        api
          .api(
            "post",
            api.configUrl + "/hiveClient/readGraph",
            {
              dataSourceId: params.dataSourceId,
              id: params.id,
              tableName: params.tableName,
              relationId: params.relationId,
              targetId: params.targetId
            },
            function () {
              me.isLoading = false;
            }
          )
          .then(res => {
            resolve();
          });
      });
      promise.then(() => {
        this.isLoading = false;
        this.$message({
          message: "恭喜你，数据同步成功",
          type: "success"
        });
      });
    },
    mappingCancel(data) {
      this.$refs.cancelModel.cancelModal = true;
      this.$refs.cancelModel.title = data;
      this.$refs.cancelModel.content = "您未配置映射，是否取消？";
    },
    cancelBack(data) {
      if (data === "映射配置") {
        this.$refs.addMappingModel.addModal = true;
      } else {
        this.$refs.finnalModel.addModal = true;
      }
      this.$refs.cancelModel.cancelModal = false;
    },
    cancelModal(data) {
      if (data === "映射配置") {
        this.$refs.addMappingModel.$refs.formValidateAdd.resetFields();
        this.$refs.addMappingModel.addModal = false;
      } else {
        this.$refs.addMappingModel.$refs.formValidateAdd.resetFields();
        this.$refs.finnalModel.addModal = false;
      }
      this.$refs.cancelModel.cancelModal = false;
    },
    remove(data) {
      this.$refs.cancelModel.cancelModal = true;
      this.$refs.cancelModel.title = data;
      this.$refs.cancelModel.content = "您己修改参数，是否取消？";
    },
    modelOk() {
      this.finnalData = this.$refs.finnalModel.mappingData;
      let tableData = JSON.stringify(this.finnalData);
      let params = this.addmappingData;

      var flag = false;
      for (var i = 0; i < this.finnalData.length; i++) {
        var precondition = this.finnalData[i].isKey ? this.finnalData[i].isKey : this.finnalData[i].isUniqueId;
        if (Number(precondition) === 0) {
          if (this.finnalData[i].tableCloumn === null || this.finnalData[i].tableCloumn === "") {
            return this.$message.error(
              "请检查第" + (i + 1) + "行主键，物理表字段必须选择"
            );
          } else {
            flag = true;
          }
        } else {
          flag = true;
        }
      }
      if (flag) {
        api
          .api("post", api.configUrl + "/t/mapping/save", {
            dataSourceId: params.dataSourceId,
            relationId: params.relationId ? params.relationId : null,
            tableId: params.tableId,
            targetId: params.targetId ? params.targetId : null,
            props: tableData
          })
          .then(res => {
            this.$refs.addMappingModel.$refs.formValidateAdd.resetFields();
            this.$refs.addMappingModel.addModal = false;
            this.$refs.finnalModel.addModal = false;
            this.rendtable(
              this.basePage.pageNumber,
              this.basePage.pageSize,
              this.searchData
            );
          });
      }
    },
    look(data) {
      this.$refs.lookModel.lookModel = true;
      this.$refs.lookModel.handleLook(data)
      //this.$refs.lookModel.formValidateAdd = data;
      this.$refs.lookModel.title = "查看";
    },
    sendData(data) {
      this.addmappingData = data;
      this.$refs.finnalModel.propSelect = [];
      this.$refs.addMappingModel.$refs.formValidateAdd.validate(valid => {
        if (valid) {
          if (data.targetId == "" && data.relationId == "") {
            this.$Message.info("请确保对象或关系不能为空已选择完毕");
          } else {
            this.propFault(data.tableId);
            if (data.relationId != "") {
              this.$refs.finnalModel.finnal.title = "添加到关系";
              this.$refs.finnalModel.finnal.label = "*关系名称:";
              this.$refs.finnalModel.finnal.type = 1;
              this.$refs.finnalModel.rendtable(data.relationId)
            } else if (data.targetId != "") {
              this.$refs.finnalModel.finnal.title = "添加到对象";
              this.$refs.finnalModel.finnal.label = "*对象名称:";
              this.$refs.finnalModel.finnal.type = 0;
              this.$refs.finnalModel.rendtable(data.targetId);
            }
            this.$refs.addMappingModel.addModal = false;
            this.$refs.finnalModel.addModal = true;
            // this.$refs.finnalModel.propSelect = this.dataTableList;
          }
        }
      });
    },
    propFault(id) {
      //关系在详情input里面的展示
      var urlFind = this.addmappingData.relationId
        ? api.configUrl +
        "/relation/detail" +
        "?id=" +
        this.addmappingData.relationId
        : api.configUrl +
        "/target/detail" +
        "?id=" +
        this.addmappingData.targetId;
      api.api("post", urlFind).then(res => {
        if (this.addmappingData.relationId) {
          this.$refs.finnalModel.finnal.placeholders = res.relationName;
        } else {
          this.$refs.finnalModel.finnal.placeholders = res.targetName;
        }
      });
      api
        .api("get", api.configUrl + "/tableProp/queryList?tableId=" + id)
        .then(res => {
          this.$refs.finnalModel.propSelect = res;
        });
    },
    forceBack() {
      this.$refs.finnalModel.addModal = false;
      this.$refs.addMappingModel.addModal = true;
      this.$refs.addMappingModel.formValidateAdd.targetId = "";
      this.$refs.addMappingModel.formValidateAdd.relationId = "";
    },
    delete(id) {
      //列表删除按钮
      this.listId = id;
      this.$refs.delete.deleteModal = true;
      this.$refs.delete.deleteModal_loading = false;
    },
    deleteModel() {
      //列表删除按钮
      api
        .api("post", api.configUrl + "/t/mapping/delete", {
          ids: this.listId
        })
        .then(res => {
          this.$refs.delete.deleteModal = false;
          this.refreshPage();
        });
    },
    searchBtn() {
      //搜索框按钮事件
      this.rendtable(
        this.basePage.pageNumber,
        this.basePage.pageSize,
        this.searchData
      );
    },
    refreshPage: function () {
      //更新当前页
      this.rendtable(
        this.basePage.pageNumber,
        this.basePage.pageSize,
        this.searchData
      );
    },
    pageChange(current) {
      //改变页码查询
      this.basePage.pageNumber = current;
      this.current = current;
      this.rendtable(
        this.basePage.pageNumber,
        this.basePage.pageSize,
        this.searchData
      );
    },
    pageSizeChange(current) {
      //改变数量查询
      this.basePage.pageSize = current;
      this.rendtable(
        this.basePage.pageNumber,
        this.basePage.pageSize,
        this.searchData
      );
    },
    rendtable(numbers, size, params) {
      //选线table页，和搜索功能
      this.mappingData = [];
      let userManaUrl = "";
      if (params) {
        userManaUrl =
          "?pageNum=" +
          numbers +
          "&pageSize=" +
          size +
          "&queryCriteria=" +
          params;
      } else {
        userManaUrl = "?pageNum=" + numbers + "&pageSize=" + size;
      }
      api
        .api("get", api.configUrl + "/t/mapping/queryPage" + userManaUrl)
        .then(res => {
          if (res.total === 0) {
            this.$Message.info("根据条件查不到数据");
            this.total = 0;
            return;
          }
          this.mappingData = res.list;
          this.total = res.total;
        });
    },
    addModelBtn() {
      //添加模态框按钮事件
      this.$refs.addMappingModel.addModal = true;
      this.$refs.addMappingModel.disabled = false;
      this.$refs.addMappingModel.objectDisable = false;
      this.dataSource();
      this.relationObjSelect();
    },
    //对象--关系 的下拉框
    relationObjSelect() {
      this.$refs.addMappingModel.relationSelect = [];
      this.$refs.addMappingModel.objectSelect = [];
      api.api("post", api.configUrl + "/relation/queryList").then(res => {
        this.$refs.addMappingModel.relationSelect = res;
      });
      api.api("post", api.configUrl + "/target/queryList").then(res => {
        this.$refs.addMappingModel.objectSelect = res;
      });
    },
    //这是数据源的默认值
    dataSource() {
      // this.$refs.addMappingModel.dataSource = [];
      api.api("post", api.configUrl + "/datasource/queryList").then(res => {
        this.$refs.addMappingModel.dataSource = res;
      });
    },
    //这是数据表的默认值
    dataList(data) {
      if (data) {
        this.$refs.addMappingModel.dataList = [];
        api.api("post", api.configUrl + "/table/queryList", {
          dataSourceId: data
        })
          .then(res => {
            this.$refs.addMappingModel.dataList = res;
            this.dataTableList = res;
          });
      } else {
        this.$refs.addMappingModel.dataList = [];
      }
    }
  }
};
</script>
<style lang="less">
#addMapping {
  padding: 16px 32px 32px 32px;
  width: 100%;
  min-width: 1366px;
  .addMap {
    display: flex;
    line-height: 56px;
    justify-content: space-between;
    border-bottom: 1px solid #d9d9d9;
    .mappingTitle {
      font-size: 16px;
      color: #333;
    }
    .mapSearch {
      // width: 27%;
      text-align: center;
      padding-top: 10px;
      display: flex;
      position: relative;
      .mapInput {
        width: 256px !important;
        input {
          font-size: 12px;
        }
        .ivu-icon {
          width: 32px !important;
          padding-top: 2px;
          font-size: 25px;
        }
      }
    }
  }
}
</style>