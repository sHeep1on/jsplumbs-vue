
<template>
  <div class="relationTable">
    <div class="showTitle propertyTitle">
      <span><img src="@/images/objectGroup.png" /></span>
      <span>{{titleName}}</span>
      <!-- <i-switch class="switch" v-model="onOff" @on-change="change">
                <span slot="open">开</span>
                <span slot="close">关</span>
            </i-switch> -->
      <Button type="primary" @click="saveMessage" class="searchBtn">保存</Button>
    </div>
    <el-tabs v-model="objectProperty" class="inTab" :before-leave="beforeLeave" @tab-click="handleClick">
      <el-tab-pane label="对象信息" name="basicMessage">
        <div class="contentMain">
          <div class="editBtn">
            <el-button class="edit" type="ghost" icon="el-icon-edit-outline" size="small" @click="editModal">编辑</el-button>
          </div>
          <Form class="formShow">
            <Row>
              <Col span="8">
              <FormItem label="对象名称： ">
                <p :title="objectDetail.targetName">{{objectDetail.targetName}}</p>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="对象ID：">
                <p :title="objectDetail.id">{{objectDetail.id}}</p>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="所属分组：">
                <p :title="objectDetail.groupName">{{objectDetail.groupName}}</p>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
              <FormItem label="已建关系： ">
                <p :title="objectDetail.relationName">{{objectDetail.relationName}}</p>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="排序号：">
                <p :title="objectDetail.indexSort">{{objectDetail.indexSort}}</p>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="对象描述：">
                <p :title="objectDetail.remark">{{objectDetail.remark}}</p>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24">
              <FormItem label="对象Icon：" class="sourceicon">
                <p><img :src="objectDetail.iconField" />{{objectDetail.icon}} </p>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="属性信息" name="objectMessage">
        <div class="propBtn">
          <el-button type="ghost" class="addBtn searchBtn" icon="el-icon-plus" size="small" @click="addList">添加</el-button>
        </div>
        <Table :height='tableHeight' stripe :loading="loading" ref="selection" :columns="objectColumns" :data="objecteSpliceData" class="noPaddingTb"></Table>
        <Page class="clientPage" :current.sync="current" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
        <div class="config">
          <h2>高级设置</h2>
        </div>
        <Form :model="formIcon" :rules="formIcon">
          <FormItem label="图标参数配置：" class="iconLF" prop="iconParame">
            <Select v-model.trim="formIcon.iconParame" placement="top">
              <Option v-for="(item,index) in iconParameConfig" :value="index" :key="index">{{ item.propName }}</Option>
            </Select>
            <Icon type="ios-gear-outline" class="iconConfig" @click="Iconconfig"></Icon>
          </FormItem>
        </Form>
      </el-tab-pane>
    </el-tabs>
    <addObject ref="addObject" @save="editObject"></addObject>
    <iconConfig ref="iconConfig" @save="saveConfig"></iconConfig>
    <tabModal ref="tabModal" @tabSure="tab"></tabModal>
    <delModal ref="delModal" @deleteModel="delParams"></delModal>
  </div>
</template>
<script>
import api from "@/fetch/api";
import $ from "jquery";
import addObject from "@/views/pages/object/components/addObject.vue";
import iconConfig from "@/views/pages/object/components/iconConfig.vue";
import tabModal from "@/views/Common/tabSure.vue";
import { tableToLine, formToLine } from "@/libs/common/common.js";
import delModal from '@/views/Common/delete.vue';
import {
  validateNameExsit,
  isNumber,
  ipAddress,
  isHadBlank
} from "@/libs/common/check.js";
export default {
  components: {
    addObject,
    iconConfig,
    tabModal,
    delModal
  },
  data() {
    return {
      id: "",
      onOff: false,
      objectProperty: "basicMessage",
      objectTab: false,
      showTab: true,
      titleName: "",
      editId: "",
      checkDisabled: true,
      loading: false,
      text: true,
      toast: false,
      iconParameConfig: [],
      formIcon: {
        iconParame: ""
      },
      pageArray: [10, 20, 30, 40],
      current: 1,
      total: 0,
      basePage: {
        pageSize: 10,
        pageNumber: 1
      },
      objectDetail: {
        targetName: "",
        id: "",
        // targetId: '',
        groupId: "",
        groupName: "",
        indexSort: "",
        remark: "",
        iconField: "",
        useStatus: "",
        icon: "",
        relationName: ""
      },
      storageList: [],
      queryList: [],
      indexList: [{ name: "无", value: 0 }],
      tableHeight: 0,
      objectColumns: [
        {
          title: "*属性名称",
          key: "propName",
          minWidth: 150,
          ellipsis: true,
          align: "center",
          render: (h, params) => {
            return h("i-input", {
              style: {
                height: "50%"
              },
              props: {
                value: params.row.propName,
                maxlength: 16
              },
              on: {
                "on-blur": e => {
                  var reg = /^[^\s]+$/;
                  var regEn = /[`~!@#$%^&*()+<>?:"{},./;'[\]]/im;
                  var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
                  if (
                    reg.test(e.target.value) != true ||
                    regEn.test(e.target.value) != false ||
                    regCn.test(e.target.value) != false
                  ) {
                    return this.$Message.info("不能输入特殊字符和空格");
                  } else {
                    params.row.propName = e.target.value;
                    let temIndex = (this.basePage.pageNumber - 1) * this.basePage.pageSize;
                    this.objecteData[temIndex + params.index] = params.row;
                  }
                }
              }
            });
          }
        },
        {
          title: "*主键",
          key: "isKey",
          minWidth: 50,
          align: "center",
          render: (h, params) => {
            let temIndex =
              (this.basePage.pageNumber - 1) * this.basePage.pageSize;
            return h("elCheckbox", {
              props: {
                value: Number(params.row.isKey) === 0,
                disabled: params.row.disabled
              },
              on: {
                change: value => {
                  if (this.objecteData.some(i => i.isKey == 0)) {
                    this.$message(value ? "主键只能勾选一个！" : "主键至少勾选一个");
                    params.row.isKey = 1;
                  } else {
                    params.row.isKey = 0;
                  }
                  this.objecteData[temIndex + params.index].isKey = params.row.isKey;
                  this.spliceData();
                }
              }
            });
          }
        },
        {
          title: "*图区显示",
          key: "isAreaShow",
          minWidth: 70,
          align: "center",
          render: (h, params) => {
            return h("checkbox", {
              props: {
                value: Number(params.row.isAreaShow) === 0
              },
              on: {
                "on-change": value => {
                  if (value === true) {
                    params.row.isAreaShow = 0;
                  } else {
                    params.row.isAreaShow = 1;
                  }
                  let temIndex =
                    (this.basePage.pageNumber - 1) * this.basePage.pageSize;
                  this.objecteData[temIndex + params.index].isAreaShow =
                    params.row.isAreaShow;
                  this.spliceData();
                }
              }
            });
          }
        },
        {
          title: "对象信息显示",
          key: "isInfoShow",
          minWidth: 70,
          align: "center",
          render: (h, params) => {
            return h("checkbox", {
              props: {
                value: Number(params.row.isInfoShow) === 0
              },
              on: {
                "on-change": value => {
                  if (value === true) {
                    params.row.isInfoShow = 0;
                  } else {
                    params.row.isInfoShow = 1;
                  }
                  let temIndex = (this.basePage.pageNumber - 1) * this.basePage.pageSize;
                  this.objecteData[temIndex + params.index].isInfoShow = params.row.isInfoShow;
                  this.spliceData();
                }
              }
            });
          }
        },
        {
          title: "条件查询",
          key: "isConditionQuery",
          minWidth: 70,
          align: "center",
          render: (h, params) => {
            return h("checkbox", {
              props: {
                value: Number(params.row.isConditionQuery) === 0
              },
              on: {
                "on-change": value => {
                  if (value === true) {
                    params.row.isConditionQuery = 0;
                  } else {
                    params.row.isConditionQuery = 1;
                  }
                  let temIndex =
                    (this.basePage.pageNumber - 1) * this.basePage.pageSize;
                  this.objecteData[temIndex + params.index].isConditionQuery =
                    params.row.isConditionQuery;
                  this.spliceData();
                }
              }
            });
          }
        },
        {
          title: "统计",
          key: "isCount",
          minWidth: 30,
          align: "center",
          render: (h, params) => {
            return h("checkbox", {
              props: {
                value: Number(params.row.isCount) === 0
              },
              on: {
                "on-change": value => {
                  if (value === true) {
                    params.row.isCount = 0;
                  } else {
                    params.row.isCount = 1;
                  }
                  let temIndex = (this.basePage.pageNumber - 1) * this.basePage.pageSize;
                  this.objecteData[temIndex + params.index].isCount = params.row.isCount;
                  this.spliceData();
                }
              }
            });
          }
        },
        {
          title: "*有效",
          key: "isEffective",
          minWidth: 30,
          align: "center",
          render: (h, params) => {
            return h("checkbox", {
              props: {
                value: Number(params.row.isEffective) === 0
              },
              on: {
                "on-change": value => {
                  params.row.isEffective = value ? 0 : 1;
                  let temIndex =
                    (this.basePage.pageNumber - 1) * this.basePage.pageSize;
                  this.objecteData[temIndex + params.index].isEffective =
                    params.row.isEffective;
                  this.spliceData();
                }
              }
            });
          }
        },
        {
          title: "*存储类型",
          key: "storageType",
          minWidth: 80,
          align: "center",
          render: (h, params) => {
            return h(
              "i-Select",
              {
                props: { value: params.row.storageType },
                style: { width: "80px" },
                on: {
                  "on-change": value => {
                    let temIndex =
                      (this.basePage.pageNumber - 1) * this.basePage.pageSize;
                    this.objecteData[
                      temIndex + params.index
                    ].storageType = value;
                    this.objecteData[temIndex + params.index].queryType = null;
                    this.storageOnchage(value, temIndex + params.index);
                    this.spliceData();
                  }
                }
              },
              this.storageList.map(item => {
                return h(
                  "i-Option",
                  {
                    props: {
                      value: item.id
                    }
                  },
                  item.title
                );
              })
            );
          }
        },
        {
          title: "*查询类型",
          key: "queryType",
          minWidth: 80,
          align: "center",
          render: (h, params) => {
            let temIndex =
              (this.basePage.pageNumber - 1) * this.basePage.pageSize;
            return h(
              "i-Select",
              {
                props: { value: params.row.queryType },
                style: { width: "80px" },
                on: {
                  "on-change": value => {
                    this.objecteData[temIndex + params.index].queryType = value;
                    this.spliceData();
                  }
                }
              },
              (this.queryList[temIndex + params.index] ? this.queryList[temIndex + params.index] : []).map(item => {
                return h(
                  "i-Option",
                  {
                    props: {
                      value: item.id
                    }
                  },
                  item.title
                );
              })
            );
          }
        },
        {
          title: "*索引类型",
          key: "indexType",
          minWidth: 80,
          align: "center",
          render: (h, params) => {
            return h(
              "i-Select",
              {
                props: { value: Number(params.row.indexType) },
                style: { width: "80px" },
                on: {
                  "on-change": value => {
                    let temIndex =
                      (this.basePage.pageNumber - 1) * this.basePage.pageSize;
                    this.objecteData[temIndex + params.index].indexType = value;
                    this.spliceData();
                  }
                }
              },
              this.indexList.map(item => {
                return h(
                  "i-Option",
                  {
                    props: {
                      value: item.value
                    }
                  },
                  item.name
                );
              })
            );
          }
        },
        {
          title: "操作",
          key: "operate",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      this.deletePerson(params);
                    }
                  }
                },
                "删除"
              )
            ]);
          }
        }
      ],
      objecteData: [],
      objecteSpliceData: [],
      addsxList: [],
      tempStorageType: {},
      deleProps: {}
    };
  },
  mounted() {
    this.tableHeight = window.innerHeight - 450
    window.onresize = (() => this.tableHeight = window.innerHeight - 450)
  },
  methods: {
    delParams() {
      let index = (this.basePage.pageNumber - 1) * this.basePage.pageSize + this.deleProps.index
      let ids = '?ids=' + this.deleProps.row.id;
      if (this.deleProps.row.id === null) {
        this.objecteData.splice(index, 1);
        this.spliceData()
      } else {
        this.objecteData.splice(index, 1);
        api.api('post', api.configUrl + '/target/prop/delete' + ids).then(res => {
          this.$Message.info(res);
          this.spliceData()
        })
      }
    },
    storageOnchage(id, index) {
      //查询类型的数组
      let params = { lv: 1, parentId: id };
      api
        .api("post", api.dictUrl + "/dict/findDictTreeOneByOne", params)
        .then(res => {
          this.$set(this.queryList, index, res);
        });
    },
    async queryListFault(val) {
      this.tempStorageType = {};
      for (let index = 0; index < val.length; index++) {
        var id = this.objecteData[index].storageType;
        !this.tempStorageType[id] && (await this.handledictUrl(id));
        this.$set(this.queryList, index, this.tempStorageType[id]);
      }
    },
    handledictUrl(id) {
      let params = { lv: 1, parentId: id };
      return new Promise(reslove => {
        api
          .api("post", api.dictUrl + "/dict/findDictTreeOneByOne", params)
          .then(res => {
            this.tempStorageType[id] = res;
            reslove();
          });
      });
    },
    tab() {
      //确认是否跳转
      this.objectTab = false;
      this.objectProperty = "basicMessage";
    },
    beforeLeave() {
      //tab跳转前的钩子
      if (this.objectProperty === "objectMessage") {
        var result = this.objecteData.some(obj => {
          return obj.id === null;
        }); //存在空，返回true
        this.objectTab = result;
      }
      var state = this.objectTab === true ? false : true;
      if (this.objectTab === true) {
        this.$refs.tabModal.tabModal = true;
      }
      return state;
    },
    handleClick(tab) {
      //tab点击事件
      if (tab.label == "属性信息") {
        this.render(this.editId);
      }
    },
    change(status) {
      // switch开关设置
      if (status === false) {
        this.objectDetail.useStatus = 1;
      } else {
        this.objectDetail.useStatus = 0;
      }
      api
        .api("post", api.configUrl + "/target/update", {
          id: this.editId,
          useStatus: this.objectDetail.useStatus
        })
        .then(res => {
          this.$Message.info(res);
        });
    },
    async addList() {
      //属性表格添加行
      this.objectTab = true;
      let newColumn = {
        id: null,
        disabled: false,
        targetId: "",
        propName: "",
        isKey: 1,
        isAreaShow: 1,
        isInfoShow: 1,
        isConditionQuery: 1,
        isCount: 1,
        isEffective: 1,
        storageType: "026e94234a0343d8a011f18d845157d8",
        queryType: "73da0a4011787fa9e0539401a8c01634",
        indexType: 0,
        targetId: this.editId
      };
      this.storage();
      this.objecteData.push(newColumn);
      !this.tempStorageType["026e94234a0343d8a011f18d845157d8"] && (await this.handledictUrl("026e94234a0343d8a011f18d845157d8"));
      this.$set(this.queryList, this.objecteData.length - 1, this.tempStorageType["026e94234a0343d8a011f18d845157d8"]);
      this.spliceData();
    },
    saveMessage() {
      this.objectTab = false;
      if (this.objecteData.length > 0) {
        // 表格数据的修改和保存
        let arrId = []; //存放修改属性参数
        let arrNotId = []; //存放新增属性参数
        var flag = true; //判断*每一列是选一个
        this.objecteData.find((item, index) => {
          if (item.propName == "") {
            let page = Math.ceil((index + 1) / (this.basePage.pageSize))
            let num = (index) % (this.basePage.pageSize)
            this.$message({
              message: `请检查（第${page}页，第${num + 1}行），属性名称是漏填`,
              type: "warning"
            });
            flag = false;
            return true;
          }
        });
        !this.objecteData.some(i => Number(i.isKey) === 0) && (this.$message({ message: `请至少勾选一个主键` }), (flag = false));
        !this.objecteData.some(i => Number(i.isAreaShow) === 0) && (this.$message({ message: `请至少勾选一个图区显示` }), (flag = false));
        !this.objecteData.some(i => Number(i.isEffective) === 0) && (this.$message({ message: `请至少勾选一个有效` }), (flag = false));
        this.objecteData.forEach(item => { item.id != "" && item.id != null ? arrId.push(item) : arrNotId.push(item) });
        if (flag) {
          let relationId = JSON.stringify(arrId);
          let relationNotId = JSON.stringify(arrNotId);
          let req1 = new Promise((resolve, reject) => {
            if (arrId.length > 0) {
              api.api("post", api.configUrl + "/target/prop/update", { props: relationId }).then(res => { resolve("编辑") }).catch(() => { reject() })
            } else {
              resolve(false);
            }
          });
          let req2 = new Promise((resolve, reject) => {
            if (arrNotId.length > 0) {
              api.api("post", api.configUrl + "/target/prop/save", { props: relationNotId }).then(res => { resolve("保存") }).catch(() => { reject() })
            } else {
              resolve(false);
            }
          });
          Promise.all([req1, req2]).then(res => {
            res[0] && res[1] ? this.$message({ message: "操作成功", type: "success" }) : this.$message({ message: `${res[0] || res[1]}数据成功`, type: "success" });
            this.render(this.id)
          });
        }
      } else {
        this.$Message.info("table框数据不允许为空");
      }
      if (this.iconParameConfig[this.formIcon.iconParame] !== undefined) {
        //icon高级设置
        api
          .api("post", api.configUrl + "/target/update", {
            id: this.editId,
            iconType: this.iconParameConfig[this.formIcon.iconParame].id,
            iconName: this.iconParameConfig[this.formIcon.iconParame].propName
          })
          .then(res => { });
      }
    },
    deletePerson: function (params) {
      this.deleProps = params;
      this.$refs.delModal.deleteModal = true;
      this.$refs.delModal.title = "删除属性列表";

      // 属性表格删一个数组元素
      // this.$emit("deleteProp", params);
    },
    pageChange(current) {
      //  翻页
      this.basePage.pageNumber = current;
      this.current = current;
      this.spliceData();
    },
    pageSizeChange(current) {
      //每页条数改变
      this.basePage.pageSize = current;
      this.spliceData();
    },
    Iconconfig() {
      //设置icon路径
      this.renderIconLink(this.editId);
    },
    saveConfig(data) {
      //前缀后缀保存
      api
        .api("post", api.configUrl + "/target/update", {
          id: this.editId,
          prefix: data.link,
          suffix: data.jpg
        })
        .then(res => {
          this.$Message.info(res);
          this.$refs.iconConfig.addModal = false;
        });
    },
    editModal() {
      //编辑对象
      this.$refs.addObject.showModal();
      this.$refs.addObject.title = "编辑对象";
      this.$refs.addObject.objectGroup();
      this.$refs.addObject.objectIcon();
      api
        .api("post", api.configUrl + "/target/detail", {
          id: this.editId
        })
        .then(res => {
          //这是给的默认值
          this.$refs.addObject.formAdd.targetName = res.targetName;
          this.$refs.addObject.formAdd.remark = res.remark;
          this.$refs.addObject.formAdd.groupId = res.groupId;
          this.$refs.addObject.formAdd.iconField = res.icon;
        });
    },
    refreshPage() {
      // 渲染属性表格
      this.render(this.id);
    },
    render(targetId) {
      //初始化属性表格
      this.objecteData = [];
      // this.iconParameConfig = [];
      this.id = targetId;
      let sourceManaUrl = "?targetId=" + targetId;
      this.loading = false;
      var promise = new Promise((resolve, reject) => {
        api
          .api("get", api.configUrl + "/target/prop/queryList" + sourceManaUrl)
          .then(res => {
            res.forEach((item, index) => {
              this.objecteData.push(item);
              this.objecteData[index].disabled = true;
            });
            this.total = this.objecteData.length;
            this.loading = false;
            resolve(res);
            this.spliceData();
            this.queryList = []
            this.queryListFault(this.objecteData);
          });
      });
      promise.then(value => {
        this.storage();
        this.renderIcon(this.editId);
        this.icontLIst(value);
      });
    },
    spliceData() {
      this.objecteSpliceData = this.objecteData.slice((this.basePage.pageNumber - 1) * this.basePage.pageSize, this.basePage.pageNumber * this.basePage.pageSize);
      this.total = this.objecteData.length
    },
    icontLIst(params) {
      this.iconParameConfig = [];
      params.forEach(item => {
        this.iconParameConfig.push({
          id: item.id,
          propName: item.propName
        });
      });
    },
    storage() {
      //存储类型的数组
      let params = { lv: 1, dictTypeId: "e1727b8f118049388f3615675f0cc9da" };
      api
        .api("post", api.dictUrl + "/dict/findDictTreeOneByOne", params)
        .then(res => {
          this.storageList = res;
        });
    },
    editObject(data) {
      // 修改对象保存
      api
        .api("post", api.configUrl + "/target/update", {
          id: this.editId,
          targetName: data.targetName,
          remark: data.remark,
          groupId: data.groupId,
          icon: data.iconField,
          iconField: data.need
        })
        .then(res => {
          this.$emit("refresh");
          this.renderIcon(this.editId);
          this.$refs.addObject.addModal = false;
          this.$Message.info(res);
        });
    },
    renderIconLink(id) {

      api
        .api("post", api.configUrl + "/target/detail", {
          id: id
        })
        .then(res => {
          this.$refs.iconConfig.showModal();
          if (res.prefix !== null && res.suffix !== null) {
            this.$refs.iconConfig.formAdd.link = res.prefix;
            this.$refs.iconConfig.formAdd.jpg = res.suffix;
          }
        });
    },
    renderIcon(id) {
      var urlFind = api.urlImage + "/";
      api
        .api("post", api.configUrl + "/target/detail", {
          id: id
        })
        .then(res => {
          this.objectDetail.targetName = formToLine(res.targetName);
          this.objectDetail.id = formToLine(res.id);
          this.objectDetail.groupId = formToLine(res.groupId);
          this.objectDetail.groupName = formToLine(res.groupName);
          this.objectDetail.indexSort = formToLine(res.indexSort);
          this.objectDetail.iconField = urlFind + res.iconField;
          this.objectDetail.remark = formToLine(res.remark);
          this.objectDetail.useStatus = res.useStatus;
          this.objectDetail.icon = res.icon;
          this.objectDetail.relationName = formToLine(res.relationName);
          if (Number(this.objectDetail.useStatus) === 0) {
            this.onOff = true;
          } else {
            this.onOff = false;
          }
          let iconIndex = "";
          $.each(this.iconParameConfig, function (key, val) {
            if (res.iconType == val.id) {
              iconIndex = key;
            }
          });
          this.formIcon.iconParame = iconIndex;
          this.toastShow();
        });
    },
    toastShow() {
      if (this.objectDetail.groupId.length > 15) {
        this.toast = true;
        this.text = false;
      }
    }
  }
};
</script>
<style lang="less">
.sourceicon img {
  vertical-align: middle;
  margin-right: 5px;
  width: 25px;
  height: 25px;
}
.config {
  height: 40px;
  margin-top: 20px;
}
.iconLF .ivu-select {
  width: 90%;
  float: left;
}
.iconLF .iconConfig {
  font-size: 28px;
  float: left;
  margin: 5px 0 0 5px;
  cursor: pointer;
}
.noPaddingTb .ivu-table-cell {
  padding: 0;
}
</style>