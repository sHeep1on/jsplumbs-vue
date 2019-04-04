<template>
  <div class="data-import-ct clearboth">
    <div class="file-tree" ref="treeCt" v-chinaOlyScrollBar @contextmenu.self.prevent="handlecontextmenu">
      <ul class="case-directory">
        <li class="case-title">案件目录</li>
        <li>
          <el-button type="ghost" size="small" class="imgBtn" :disabled="!isAuthority" @click="handleaddCase">
            <img src="@/images/add.png" :class="{active:!isAuthority}" /> 新建
          </el-button>
        </li>
      </ul>
      <el-input placeholder="请输入搜索的目录" size="small" v-model="filterText">
      </el-input>
      <el-tree v-clickOutSide='closeRight' class="filter-tree" :data="treeData" :filter-node-method="filterNode" node-key="id" :props="defaultProps" @node-contextmenu="rihgtClick" @node-click="rightHidden" :empty-text='emptyText' ref="tree2">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <Tooltip placement="top" :content="data.title" :disabled="data.grade!=='0'||data.title.length<7">
            <span v-if="data.flag" class="data-title">{{ data.title }}</span>
            <el-input v-else placeholder="请输入名称" size="mini" @keyup.enter.native="handleEnter(node,data)" autofocus :ref="'treeInput'+data.id" @blur.stop="handleBlur(node, data)" v-model.trim="appendInput">
            </el-input>
            <el-button v-if="data.grade==='0'" type="text" size="mini" @click="caseDeduce(node, data)"> 推演
            </el-button>
          </Tooltip>
        </span>
      </el-tree>
    </div>
    <div class="sjdr" v-chinaOlyloading.fullscreen="spinShow">
      <div class="download wjglheader ">
        <p>{{title}}</p>
        <p>
          <el-button icon="el-icon-refresh" size="mini" style="margin-right:15px;" @click="handleRefresh">刷新</el-button>
          <Input class="wjsearch" v-model="searchVal" icon="ios-search" placeholder="请输入搜索对象" @on-enter="search" @on-click="search"></Input>
          <ul class="data-import-btn" v-show="isAuthority&&!isSyncIng">
            <li @click="showDel"><i></i><span>删除</span></li>
            <li @click="upload">
              <!-- <li @click="upload"
                :class="{'disabled-upload':isSyncData}"> -->
              <svg-icon name="upload" class="head-icon" style="font-size:18px"></svg-icon><span>上传</span>
            </li>
          </ul>
        </p>
      </div>

      <div>
        <Table :height="height" class="uploadTb" :loading="TbLoading" stripe ref="selection" :columns="importColumns" :data="importData" @on-selection-change="selectTable" @on-sort-change="sortChaneg"></Table>
        <Page class="clientPage" :current.sync="basePage.pageNumber" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
      </div>
      <div v-if="isUpLoadFile">
        <fileModal ref="fileModal" @refresh="renderUp" :show.sync="isUpLoadFile" :fileInfo="fileInfo"></fileModal>
      </div>
      <delModal ref="delModal" @deleteModel="delModal"></delModal>
      <lookModal ref="lookModal"></lookModal>
    </div>
    <transition name="fade">
      <div class="right-ct" ref="rightCt" :style="{left:rightCtLoc.left+'px',top:rightCtLoc.top+'px'}" v-show="isShowRight">
        <div class="right-ct-arrow"></div>
        <ul v-if='isclickTree' class="none-data-tree right-w">
          <li @click.self="handleCreateNode">新增</li>
        </ul>
        <ul v-else class="right-w">
          <li @click.self='handleAddSibl'>添加同级文件</li>
          <li :class="{'disable-cls':isDiabled}" @click.self="handleAddChildNode">添加子文件</li>
          <li @click.self="handleDeleFile">删除</li>
          <li @click.self="handleRenameNode">重命名</li>
        </ul>
      </div>
    </transition>
    <div>
      <Modal width='300' v-model="isShowDeleModal" title="请慎重选择" @on-ok="handleDeleNode">
        <p>是否选择该文件</p>
      </Modal>
    </div>
    <div v-if="isAddCase">
      <caseModel ref="caseModel" :caseInfo.sync='caseInfo' @updateTree="initTreeData" :show.sync="isAddCase"></caseModel>
    </div>
    <!-- <div v-if="isDeduceCase"> -->
    <deduce-case ref='deduceCase' :show.sync="isDeduceCase"></deduce-case>
    <!-- </div> -->
  </div>
</template>

<script>
import api from "@/fetch/api";
import $ from "jquery";
import delModal from "@/views/pages/dataImport/components/delete.vue";
import fileModal from "@/views/pages/dataImport/components/uploadModel.vue";
import lookModal from "@/views/pages/dataImport/components/lookModel.vue";
import { timestampToTime } from "@/libs/common/common.js";
import { tableToLine } from "@/libs/common/common.js";
import { Loading } from "element-ui";
import { storage } from "@/libs/common/common.js";
import chinaOlyLoading from "@/views/main-components/loadingCom/loadingCom";
import caseModel from "./components/caseModel";
import deduceCase from './components/deduceData'
import Popper from 'popper.js'
export default {
  components: {
    delModal,
    fileModal,
    lookModal,
    chinaOlyLoading,
    caseModel,
    deduceCase
  },
  provide() {
    return {
      dataImport: this
    };
  },
  data() {
    return {
      clickNode: null,
      arr: [0, 1, 2, 3, 4],
      useStatus: { "4": true, "2": true, "6": true },
      disabled: false,
      isNoneTree: true,
      filterText: "",
      title: "列表信息",
      isAddCase: false,
      height: 0,
      searchVal: "",
      isSyncData: false,
      deleteResArr: [],
      TbLoading: false,
      isSearch: false,
      sort: false,
      sortKey: "",
      sortOrder: "",
      appendInput: "",
      spinShow: false,
      caseInfo: null,
      isclickTree: false,
      PopperObj: null,
      defaultProps: {
        children: "child",
        label: "title"
      },
      fileInfo: null,
      isDeduceCase: false,
      rightCtLoc: {
        top: 0,
        right: 0
      },
      isShowRight: false,
      importColumns: [
        {
          type: "selection",
          width: 35,
          align: "center",
        },
        {
          title: "序号",
          type: "index",
          align: "center",
          width: 60
        },
        {
          title: "数据名称",
          align: "center",
          key: "fileName",
          maxwidth: 160,
          ellipsis: true,
          sortable: true,
          render: (h, params) => {
            return h("Tooltip", {
              props: {
                placement: "top",
                //content: params.row.fileName
              }
            }, [
                h("span", params.row.fileName),
                h('div', {
                  props: {},
                  slot: 'content',
                  style: { wordWrap: 'break-word' }
                }, [
                    this.failRemarkslice(params.row.fileName, h)
                  ]
                )]
            )
          }
        },
        {
          title: "上传时间",
          align: "center",
          key: "createTime",
          maxwidth: 160,
          ellipsis: true,
          sortable: true,
          render: (h, params) => {
            if (params.row.createTime) {
              if (params.row.createTime != "--") {
                return h("div", timestampToTime(params.row.createTime));
              } else {
                return h("div", params.row.createTime);
              }
            }
          }
        },
        {
          title: "数据类型",
          align: "center",
          key: "typeName",
          minwidth: 100,
          ellipsis: true
        },
        {
          title: "上传者",
          align: "center",
          key: "createUserName",
          minwidth: 100,
          ellipsis: true
        },
        {
          title: "状态",
          align: "center",
          minwidth: 100,
          key: "useStatus",
          ellipsis: true,
          render: (h, params) => {
            return h("Tooltip", {
              props: {
                placement: "top",
                //content: `<p>${params.row.failRemark}</p>`,
                disabled: params.row.failRemark!=='--' ? false : true
              }
            }, [
                h("span", this.handleStatus(params.row)),
                h('div', {
                  props: {},
                  slot: 'content',
                  style: { wordWrap: 'break-word' }
                }, [
                    this.failRemarkslice(params.row.failRemark, h)
                  ]
                )]
            )
          }
        },
        {
          title: "备注",
          align: "center",
          key: "remark",
          width: 170,
          ellipsis: true,
          tooltip: true,
          render: (h, params) => {
            var vm = this;
            return h(
              "div",
              {
                on: {
                  click: e => {
                    e.stopPropagation();
                  }
                }
              },
              [
                h(
                  "Tooltip",
                  {
                    props: {
                      placement: "top",
                      content: params.row.remark,
                      disabled: params.row.remark == "--" ? true : false
                    }
                  },
                  [
                    h(
                      "span",
                      {
                        style: {
                          display:
                            params.row.states === false
                              ? "inline-block"
                              : "none"
                        },
                        on: {
                          click: e => {
                            e.stopPropagation();
                            params.row.states = true;
                            if (params.row.remark == "--") {
                              params.row.remark = "";
                            }
                          }
                        }
                      },
                      params.row.remark
                    ),
                  ]
                ),
                h("Icon", {
                  props: {
                    type: "ios-create-outline"
                  },
                  style: {
                    marginLeft: "5px",
                    display:
                      params.row.states === false ? "inline-block" : "none",
                    fontSize: "16px"
                  },
                  on: {
                    click: e => {
                      e.stopPropagation();
                      params.row.states = true;
                      if (params.row.remark == "--") {
                        params.row.remark = "";
                      }
                    }
                  }
                }),
                h("Input", {
                  style: {
                    display:
                      params.row.states === true ? "inline-block" : "none"
                  },
                  props: {
                    maxlength: 90,
                    value: params.row.remark,
                    icon: "md-checkmark"
                  },
                  on: {
                    "on-change": e => {
                      e.stopPropagation();
                      params.row.remark = event.target.value;
                      vm.importData[params.index] = params.row;
                    },
                    "on-click": e => {
                      e.stopPropagation();
                      if (params.row.remark === "") {
                        params.row.remark = "--";
                      }

                      params.row.states = false;
                      this.remarkUpdate(params.row.id, params.row.remark);
                    },
                    "on-enter": e => {
                      e.stopPropagation();
                      if (params.row.remark === "") {
                        params.row.remark = "--";
                      }
                      params.row.states = false;
                      this.remarkUpdate(params.row.id, params.row.remark);
                    }
                  }
                })
              ]
            );
          }
        },
        {
          title: "操作",
          key: "operate",
          align: "center",
          width: 140,
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  style: {
                    marginRight: "5px"
                  },
                  class: {
                    "node-disabled": this.handleSyncStatus(params)
                  },
                  on: {
                    click: e => {
                      e.stopPropagation();
                      if (!this.useStatus[params.row.useStatus]) {
                        this.$refs.lookModal.addModal = true;
                        this.$refs.lookModal.loading = true;
                        this.$refs.lookModal.look(params.row.id);
                      }
                    }
                  }
                },
                "查看  |"
              ),
              h(
                "a",
                {
                  style: {
                    marginRight: this.isAuthority ? "5px" : "0px"
                  },
                  class: {
                    "node-disabled": this.handleSyncStatus(params)
                  },
                  on: {
                    click: e => {
                      e.stopPropagation();
                      if (!this.useStatus[params.row.useStatus]) {
                        this.$refs.delModal.deleteModal = true;
                        this.$refs.delModal.delId = params.row.id;
                        this.deleInfo = params.row
                      }
                    }
                  }
                },
                this.isAuthority && !this.isSyncIng ? "删除  |" : ""
              ),
              h(
                "a",
                {
                  style: {
                    marginRight: "5px"
                  },
                  class: {
                    "node-disabled": this.handleSyncStatus(params)
                  },
                  on: {
                    click: e => {
                      e.stopPropagation();
                      if (!this.useStatus[params.row.useStatus]) {
                        this.addData(params.row);
                      }
                    }
                  }
                },
                "推演"
              )
            ]);
          }
        }
      ],
      isUpLoadFile: false,
      importData: [],
      pageArray: [10, 20, 30, 40],
      basePage: {
        pageSize: 10,
        pageNumber: 1
      },
      current: 1,
      total: 0, // 分页显示的总数量
      roleInfo: "",
      treeData: [],
      selectData: null,
      selectNode: null,
      tempNode: {},
      isDiabled: false,
      isShowDeleModal: false,
      isAuthority: true,
      isSyncIng: false,
      deleInfo: null,
      targetEl: null
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  computed: {
    emptyText() {
      return this.isNoneTree ? "暂无数据" : "查询结果为空";
    }
  },
  mounted() {
    this.height = window.innerHeight - 258;
    window.onresize = () => {
      this.height = window.innerHeight - 258;
    };
  },
  async created() {
    this.roleInfo = storage.get('relaAdmin') ? "relateAdmin" : "";
    await this.initTreeData();
    this.rendtable();
  },
  directives: {
    clickOutSide: {
      bind(el, binding, vnode) {
        el.handler = e => {
          if (el && !el.contains(e.target)) {
            vnode.context[binding.expression]();
          }
        };
        document.addEventListener("click", el.handler, true);
      },
      unbind(el) {
        document.removeEventListener("click", el.handler, true);
        el.handler = null;
      }
    }
  },
  methods: {
    handleRefresh() {
      this.rendtable()
    },
    caseDeduce(node, data) {
      if (data.isFile) {
        this.isDeduceCase = true;
        this.$refs.deduceCase.caseInfo = data
      } else {
        this.$message.info('请先上传案件数据，再推演')
      }
    },
    failRemarkslice(val, h) {
      let res = []
      for (let index = 0; index < 10; index++) {
        if (val && val !== '--') {
          if (val.slice(index * 16, (index + 1) * 16).length > 0) {
            res.push(h('p', val.slice(index * 16, (index + 1) * 16)))
          }
        }
      }
      return [res]
    },
    handleaddCase() {
      this.isAuthority && (this.isAddCase = true)
    },
    async permissionTable() {
      const permissionSet = () => {
        this.isAuthority = this.$store.getters.personal_roleInfo.some(item => {
          return (item.roleName.indexOf("relateAdmin") !== -1 || item.roleName.indexOf("管理") !== -1);
        });
      };
      if (this.$store.getters.personal_roleInfo.length !== 0) {
        permissionSet();
      } else {
        await this.$store.dispatch("getRoleInfo");
        permissionSet();
      }
    },
    handleStatusopera(info) {
      if (info.useStatus !== "4") {
        return false;
      }
    },
    handleSyncStatus(info) {
      return this.useStatus[info.row.useStatus] ? true : false;
    },
    handleStatus(row) {
      let obj = {
        "0": "成功",
        "1": "失败",
        "2": "数据待清洗",
        "4": "同步中",
        "5": "上传、同步或同步失败",
        "6": "数据同步到hive库"
      };
      if (row.useStatus == "4") {
        this.isSyncData = true;
      }
      return obj[row.useStatus];
    },
    handleSyncOper(list) {
      let caseResult = new Map()
      list.forEach((row, index) => {
        if (row.useStatus.trim() == "3" || row.useStatus.trim() == "4") {
          let reult = this.treeData.find(item => {
            return item.child.some(child => {
              return child.id.indexOf(row.parentId) !== -1;
            });
          });
          if (reult) {
            caseResult.has(reult) ? caseResult.set(reult, caseResult.get(reult).concat([row])) : caseResult.set(reult, [row])
            row.useStatus = "4";
          }
        }
        if (row.useStatus == "4" || row.useStatus == "2" || row.useStatus == "6") {
          row._disabled = true;
        } else {
          row._disabled = false
        }
      });
      // if (caseResult.size > 0) {
      //   caseResult.forEach((item, key) => {
      //     let reqList = item.reduce((t, c) => t.concat([c.id]), (new Array))
      //     api.api("post", api.loginUrl2 + "/hiveClient/ComputeGraph", {
      //       type: item[0].dataType,
      //       caseId: key.caseId,
      //       fileId: reqList.join(","),
      //       time: key.computeTime ? key.computeTime : ""
      //     }).then(res => {
      //       this.basePage.basePage = 1
      //       this.basePage.pageNum = 10
      //       this.rendtable(key.id);
      //     })
      //   })
      // }
    },
    handleClick(e) { },
    filterNode(value, data) {
      if (!value) return true;
      return data.title.indexOf(value) !== -1
    },
    handleCreateNode() {
      if (!this.handlePermission()) {
        return;
      }
      this.isAddCase = true;
    },
    initTreeData() {
      return new Promise(reslove => {
        api
          .api("post", api.loginUrl2 + "/tFilesDataList/selectTree", {
            role: this.roleInfo
          })
          .then(res => {
            this.treeData = JSON.parse(JSON.stringify(res));
            this.isNoneTree = this.treeData.length == 0;
            reslove();
          });
      });
    },
    limitData(val) {
      let reg = new RegExp("^[\u4e00-\u9fa5a-zA-Z0-9]+$");
      if (!reg.test(val)) {
        this.$message.warning("请输入中文，英文，或者数据，谢谢！！！");
        return false;
      } else if (val.length > 10) {
        this.$message.warning("文件名称最多输入十个文字，谢谢！！！");
      } else {
        return true;
      }
    },
    handlecontextmenu(evt) {
      if (!this.handlePermission()) {
        return;
      }
      this.rightCtLoc.top = evt.clientY;
      this.rightCtLoc.left = evt.clientX + 30;
      this.isShowRight = true;
      this.isclickTree = true;
    },
    closeRight() {
      this.isShowRight = false;
    },
    handleBlur(node, data) {
      !data.flag && this.handleInputDate(node, data);
    },
    handleEnter(node, data) {
      !data.flag && this.handleInputDate(node, data);
    },
    rihgtClick(evt, data, node) {
      if (data.grade == '-1'||data.grade == '-2') {
        this.$message.warning('该节点为虚拟数据，不可编辑')
        return
      }
      if (!this.handlePermission()) {
        return;
      }
      this.isclickTree = false;
      this.rightCtLoc.top = (window.innerHeight - 160 - evt.clientY < 0) ? (window.innerHeight - 160) : (evt.clientY - 20);
      this.rightCtLoc.left = evt.clientX + 30;
      this.isShowRight = true;
      // 当时第二级的内容时，灰度添加子节点
      this.isDiabled = data.grade == "1";
      this.selectData = data;
      this.selectNode = node;
      this.appendInput = "";
    },
    handleDeleData(data, node) {
      console.log(data, node);

      // node.flag = true
      // let parent = data.parent;
      // let children = parent.data.child || parent.data;
      // let index = children.findIndex(d => d.id == node.id);
      // children.splice(index, 1);
    },
    // 处理用户输入后的数据
    handleInputDate(data, node) {
      if (!node.flag) {
        if (node.id == 'temple-id-to-map') {
          let params = { id: node.tempId, name: this.appendInput, grade: node.grade }
          if (!this.limitData(this.appendInput)) {
            this.handleDeleData(data, node)
            return false;
          }
          api.api("post", `${api.loginUrl2}/tFilesDataList/save`, params)
            .then(res => {
              node.flag = true;
              node.parentId = params.id;
              node.title = this.appendInput;
              node.id = res;
              this.$message.success("操作成功");
              this.appendInput = "";
            })
            .catch(res => {
              this.appendInput = "";
              this.handleDeleData(data, node)
            });
        } else {
          if (this.appendInput == node.title || this.appendInput == '') {
            node.flag = true
          } else {
            this.renameNodeReq(this.appendInput, data, node)
          }
        }
      }
    },
    renameNodeReq(newValue, data, node) {
      let params = { name: newValue, id: node.id, parentId: node.parentId };
      if (!this.limitData(newValue)) { return }
      api.api("post", `${api.loginUrl2}/tFilesDataList/update`, params)
        .then(res => {
          node.flag = true;
          this.$message.success(res);
          node.title = newValue;
        })
        .catch(res => {
          this.appendInput = "";
          node.flag = true;
        });
    },
    rightHidden(node, data) {
      this.fileInfo = node
      this.isShowRight = false;
      if (node.flag) {
        this.clickNode = node
        this.isSyncIng = node.status == "1" ? true : false;
        this.basePage.pageNumber = 1;
        this.rendtable(node.id);
        !data.expanded && (data.expanded = true)
      }
    },
    // 添加同级目录
    handleAddSibl(e) {
      if (!this.handlePermission()) {
        return;
      }
      this.appendInput = "";
      if (this.selectData.grade == "0") {
        this.isAddCase = true;
      } else {
        this.tempNode = {
          flag: false,
          grade: this.selectData.grade,
          tempId: this.selectData.parentId,
          id: "temple-id-to-map",
          child: []
        };
        this.selectNode.parent.data.child.push(JSON.parse(JSON.stringify(this.tempNode)));
        this.$nextTick(() => { this.$refs['treeInputtemple-id-to-map'].focus() })
      }
      this.isShowRight = false;

    },
    handleDeleNode(e) {
      this.isShowRight = false;
      api.api("post", `${api.loginUrl2}/tFilesDataList/delete`, {
        id: this.selectData.id
      })
        .then(res => {
          this.$message.success(res);
          (this.clickNode !== null && (this.clickNode.id == this.selectData.id || this.clickNode.id == this.selectData.parentId)) && this.rendtable();
          this.handleDeleData(this.selectNode, this.selectData)
        })
        .catch(res => {
          (this.clickNode !== null && (this.clickNode.id == this.selectData.id || this.clickNode.id == this.selectData.parentId)) && this.rendtable();
        });
    },
    handleDeleFile() {
      if (!this.handlePermission()) {
        return;
      }
      this.isShowDeleModal = true;
    },
    handlePermission() {
      console.log();

      if (!this.isAuthority) {
        // this.$message.warning('对不起，您没有权限，不能进行该操作');
        this.isShowRight = false;
        return false;
      } else {
        return true;
      }
    },
    // 添加子节点
    handleAddChildNode(e) {
      this.appendInput = "";
      if (this.isDiabled) {
        return;
      }
      if (!this.handlePermission()) {
        return;
      }
      //let grade = parseInt(this.selectData.grade) + 1;
      this.tempNode = {
        flag: false,
        grade: "1",
        tempId: this.selectData.id,
        id: "temple-id-to-map",
        caseId: this.selectData.caseId
      };

      this.selectData.child.push(JSON.parse(JSON.stringify(this.tempNode)));
      this.selectNode.expanded = true;
      this.$nextTick(() => {
        this.$refs['treeInputtemple-id-to-map'].focus()
      })

    },
    handleRenameNode(e) {
      if (!this.handlePermission()) {
        return;
      }
      if (this.selectData.grade == "0") {
        this.caseInfo = this.selectData;
        this.isAddCase = true;
      } else {
        this.selectData.flag = false;
        this.appendInput = this.selectData.title;
        this.isShowRight = false;
        this.$nextTick(() => { this.$refs['treeInput' + this.selectData.id].focus() })

      }
    },
    addData(params) {
      if (params.useStatus == "3") {
        this.$message.warning("您的数据正在同步，暂时无法添加，请稍后");
        return;
      }
      this.$store.commit("setDataid", params.id);
      this.spinShow = true;
      let caseList = [];
        const findIn = (list) =>{
          if (list[0].grade=='-1') {
            list.forEach(i=>caseList=caseList.concat(i.child))
          } else {
            list.forEach(i=>findIn(i.child))
          }
        }

      if (this.treeData[0].grade == '0') {
       caseList = this.treeData
      } else {
        findIn(this.treeData)
      }
      let reult = caseList.find(item => {
        return !!item.child.filter(child => child.id == params.parentId).length;
      });
      api.api("post", api.loginUrl2 + "/file/fileQuery", {
        fileId: params.id,
        caseId: reult.caseId
      })
        .then(res => {
          this.$store.dispatch("setFileData", res);
          this.spinShow = false;
          this.$router.push({
            path: "/gxfx/gxfxManager",
            query: { dataid: params.id, caseId: reult.caseId }
          });
        })
        .catch(res => {
          this.spinShow = false;
        });
    },
    remarkUpdate(id, remark) {
      // 修改备注
      api
        .api("post", api.loginUrl2 + "/files/update", {
          id: id,
          remark: remark
        })
        .then(res => {
          this.$Message.info(res);
        });
    },
    upload() {
      this.isUpLoadFile = true;
    },
    showDel() {
      if (this.deleteResArr.length == 0) {
        this.$message.warning("请你选择至少一条数据后，再删除");
        return;
      }
      this.$refs.delModal.deleteModal = true;
    },
    selectTable(name) {
      // 选中table的复选框时触发
      this.deleteResArr = [];
      for (let i = 0; i < name.length; i++) {
        this.deleteResArr[i] = name[i].id;
      }
    },
    sortChaneg(data) {
      if (data.key === "fileName") this.sortKey = "FILE_NAME";
      if (data.key === "createTime") this.sortKey = "CREATE_TIME";
      if (data.order !== "normal") {
        this.sortOrder = data.order;
      }
      this.basePage.pageNumber = 1;
      this.rendtable();
    },
    delModal(id) {
      // 删除确认
      let ids = "";
      let caseId = ''
      if (id == null || id == "") {
        ids = this.deleteResArr.join(",");
      } else {
        ids = id;
      }
      api.api("post", api.loginUrl2 + "/files/delete", {
        ids: ids
      })
        .then(res => {
          this.fileInfo !== null ? this.rendtable(this.fileInfo.id || this.fileInfo.parentId) : this.rendtable()
          this.$refs.delModal.deleteModal = false;
        });
    },
    search() {
      this.isSearch = true;
      this.rendtable();
    },
    pageChange(current) {
      // 改变页码查询
      this.basePage.pageNumber = current;
      this.rendtable(this.clickNode !== null ? this.clickNode.id : '');
    },
    pageSizeChange(current) {
      // 改变数量查询
      this.basePage.pageSize = current;
      this.rendtable(this.clickNode !== null ? this.clickNode.id : '');
    },
    renderUp(val) {
      this.rendtable(val);
    },
    rendtable(parId) {
      this.permissionTable();
      this.importData = [];
      let params = {
        pageNum: this.basePage.pageNumber,
        pageSize: this.basePage.pageSize,
        role: this.roleInfo,
        like: this.searchVal,
        orderField: this.sortKey,
        seType: this.sortOrder,
        parId: parId
      };
      api.api("post", api.loginUrl2 + "/files/queryPage", params).then(res => {
        if (!res.total) {
          this.total = 0;
          this.TbLoading = false;
          return;
        }
        this.total = res.total;
        res.list.map(i => {
          Object.assign(i, { states: false });
        });
        this.handleSyncOper(res.list);
        this.importData = tableToLine(res.list);
        this.TbLoading = false;
      });
    }
  }
};
</script>
<style lang="less">
.ivu-select-single .ivu-select-selection .ivu-select-selected-value {
  padding-right: 34px;
}
.ivu-icon {
  margin-left: 0;
}
.ivu-icon-checkmark {
  margin-right: 3px;
}
.ivu-select-single {
  margin-bottom: 0;
}
.ivu-btn {
  font-size: 14px !important;
}
.searchBtn {
  height: 33px;
  padding: 0 10px;
}
.data-import-btn {
  li {
    cursor: pointer;
    &:hover {
      border: 1px solid #397cbf;
      color: #397cbf;
    }
    &.disabled-upload {
      color: #c5c8ce;
      background-color: #f7f7f7;
      border-color: #dcdee2;
      cursor: not-allowed;
      &:hover {
        color: #c5c8ce;
        background-color: #f7f7f7;
        border-color: #dcdee2;
      }
    }
  }
}

.uploadTb .ivu-table-sort {
  overflow: initial;
}
.case-directory {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dcdfe6;
  padding-bottom: 15px;
  margin-bottom: 15px;
  li {
    &.case-title {
      font-size: 16px;
      line-height: 32px;
    }
    .imgBtn {
      width: 72px;
      height: 32px;
      padding: 0;
      line-height: 32px;
      .active {
        opacity: 0.5;
      }
    }
  }
}
.data-import-ct {
  width: 100%;
  height: 100%;
  display: flex;
  .node-disabled {
    cursor: not-allowed;
    text-decoration: none;
    color: #c5c8ce;
  }
  .right-ct {
    position: fixed;
    left: 500px;
    top: 30px;
    z-index: 9000000000;
    .right-ct-arrow {
      top: 15px;
      left: -22px;
      border-color: transparent;
      border-width: 10px 20px 10px 0;
      border-right-color: hsla(0, 0%, 85%, 0.5);
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      border-style: solid;
      z-index: 107;
      &::after {
        display: block;
        width: 0;
        height: 0;
        position: absolute;
        content: " ";
        border-style: solid;
        top: -10px;
        left: 2px;
        border-color: transparent;
        //  border-width: 20px;
        border-left-width: 0;
        border-width: 10px 20px 10px 0;
        border-right-color: rgb(255, 255, 255);
        z-index: 106;

        // transform: rotate(-4deg);
      }
    }

    .right-w {
      background: #fff;
      border-radius: 5px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 1;
      margin-bottom: 20px;
      li {
        &.disable-cls {
          color: #a3a0a0;
        }
        padding: 10px 30px;
        width: 100%;
        font-size: 14px;
        cursor: pointer;
        &:not(.disable-cls):hover {
          background: #eee;
          border-radius: 5px;
        }
      }
    }
  }
  .file-tree {
    width: 240px;
    height: calc(~"100% - 130px");
    margin: 20px 20px;
    box-sizing: border-box;
    background: #fff;
    padding: 20px;
    position: relative;

    .custom-tree-node {
      width: 100%;
      .ivu-tooltip {
        width: 100%;
        .ivu-tooltip-rel {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          .data-title {
            line-height: 32px;
            // width: 20px;
            width: 6em;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            overflow: hidden;
          }
          .el-button {
            padding-right: 10px;
            display: none;
          }
        }
      }
    }
    .el-tree-node__content {
      height: 34px;
      font-size: 14px;
      &:hover {
        .el-button {
          display: block !important;
        }
      }
    }
  }
  .sjdr {
    width: calc(~"97% - 240px");
    margin: 0 20px 60px 0px;
    background: #fff;
    padding: 10px 20px;
    margin-top: 20px;
    height: calc(~"100% - 130px");
  }
}
.clearboth {
  &::after {
    content: "";
    display: block;
    clear: both;
    height: 0;
  }
}
</style>
