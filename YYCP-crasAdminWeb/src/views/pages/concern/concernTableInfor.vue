
<template>
  <div class="relationTable">
    <div class="showTitle propertyTitle">
      <span><img src="@/images/relation/relation.png" alt=""></span>
      <span>{{baseInfor.relationName}}</span>
      <!-- <i-switch class="switch" v-model="onOff" @on-change="change" >
				<span slot="open">开</span>
				<span slot="close">关</span>
			</i-switch> -->
      <Button @click="save" type="primary" size="small" class="searchBtn">保存</Button>
    </div>
    <div>
      <el-tabs v-model="tabValue" class="inTab" @tab-click="tabChange" :before-leave="beforeLeave">
        <el-tab-pane label="关系信息" name="relation">
          <concern-infor :baseInfor="baseInfor" :title="title" @infoEdit="relationInfoEdit"></concern-infor>
        </el-tab-pane>
        <el-tab-pane label="属性信息" class="tabs" name="prop">
          <!-- <InfoPropertyTab :title="title"></InfoPropertyTab> -->
          <div class="propBtn">
            <el-button @click="addList" size="small" icon="el-icon-plus" class="addBtn searchBtn">添加</el-button>
          </div>
          <div>
            <Table :loading="loading" stripe ref="selection" :columns="userManaColumns" :data="SpliceData"></Table>
            <Page class="clientPage" :current.sync="basePage.pageNumber" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size.sync="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
            <div class="mapping">
              <div class="ShowInfor">
                <div class="setTitle">源对象属性映射</div>
                <Form>
                  <Row>
                    <Col span="24">
                    <FormItem label="源对象：">
                      <p>{{baseInfor.fromTarget}}</p>
                    </FormItem>
                    </Col>
                  </Row>
                  <Row v-for="item in fromTargetKey">
                    <Col span="8">
                    <FormItem label="源对象关系属性：">
                      <p>{{item.targetColumnName }}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" class="underLine">
                    -+-----------------------------------映射----------------------------------+-</p>
                    </Col>
                    <Col span="8">
                    <FormItem label="关系对应关联属性:">
                      <Select filterable v-model.trim="item.relationColumn">
                        <Option v-for="item in relationAttr" :value="item.id">{{ item.propName }}</Option>
                      </Select>
                    </FormItem>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div class="ShowInfor">
                <div class="setTitle">目标对象属性映射</div>
                <Form>
                  <Row>
                    <Col span="24">
                    <FormItem label="目标对象：" prop="targetId">
                      <p>{{baseInfor.toTarget}}</p>
                    </FormItem>
                    </Col>
                  </Row>
                  <Row v-for="item in toTargetKey" :value="item.id">
                    <Col span="8">
                    <FormItem label="目标对象关系属性： ">
                      <p>{{item.targetColumnName}}</p>
                    </FormItem>
                    </Col>
                    <Col span="8" class="underLine">
                    <p>-+-----------------------------------映射----------------------------------+-</p>
                    </Col>
                    <Col span="8">
                    <FormItem label="关系对应关联属性：">
                      <Select filterable v-model.trim="item.relationColumn">
                        <Option v-for="item in relationAttr" :value="item.id">{{ item.propName }}</Option>
                      </Select>
                    </FormItem>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div class="ShowInfor">
                <div class="setTitle">高级设置</div>
                <Form :model="lightSet">
                  <Row>
                    <Col span="8">
                    <FormItem label="关系名称定义：" prop="relationNameDef">
                      <Select filterable v-model.trim="lightSet.relationNameDef">
                        <Option v-for="item in groupIdArr" :value="item.id">{{ item.groupId }}</Option>
                      </Select>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="" prop="propId">
                      <Select filterable v-model.trim="lightSet.propId" v-if="lightSet.domNone == true">
                        <Option v-for="item in relationSetArr" :value="item.id">{{ item.propName }}</Option>
                      </Select>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem label="明细清单排序字段：" prop="detailSortField">
                      <Select filterable v-model="lightSet.detailSortField" :clearable='true'>
                        <Option v-for="item in relationSetArr" :value="item.id">{{ item.propName }}</Option>
                      </Select>
                    </FormItem>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div class="ShowInfor">
                <div class="setTitle">累积统计设置</div>
                <Form :model="accumulateSelect">
                  <Row>
                    <Col span="7">
                    <FormItem label="关系次数：" prop="countOperation">
                      <Select filterable class="accumulateSelect" v-model.trim="accumulateSelect.countOperation">
                        <Option v-for="item in statisticalSet" :value="item.value">{{ item.name }}</Option>
                      </Select>
                    </FormItem>
                    </Col>
                    <Col span="8">
                    <FormItem prop="countValue">
                      <Input type="text" v-model.trim="accumulateSelect.countValue" placeholder="请输入..." class="accumulateInput"></Input>
                    </FormItem>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <editModel ref="editModel" @update="updateDetaile"></editModel>
    <tabModal ref="tabModal" @tabSure="tab"></tabModal>
  </div>
</template>
<script>
import api from "@/fetch/api";
import $ from "jquery";
import { unique } from "@/libs/common/common.js";
import editModel from "@/views/Common/addRelation.vue";
import tabModal from "@/views/Common/tabSure.vue";
import concernInfor from "./component/concernInfor.vue";
// import InfoPropertyTab from './component/InfoPropertyTab'
export default {
  components: {
    editModel,
    tabModal,
    concernInfor,
    // InfoPropertyTab
  },
  data() {
    return {
      loading: false,
      userManaData: [],
      pageArray: [10, 20, 30, 40],
      basePage: {
        pageSize: 10,
        pageNumber: 1
      },
      userManaColumns: [
        {
          title: " *属性名称",
          align: "center",
          key: "propName",
          ellipsis: true,
          minWidth: 100,
          render: (h, params) => {
            let temIndex = (this.basePage.pageNumber - 1) * this.basePage.pageSize;
            return h("i-input", {
              style: {
                height: "80%"
              },
              props: {
                value: String(params.row.propName),
                maxlength: 16
              },
              on: {
                "on-blur": e => {
                  var reg = /^[^\s]+$/;
                  var regEn = /[`~!@#$%^&*()+<>?:"{},./;'[\]]/im;
                  var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
                  if (reg.test(e.target.value) != true || regEn.test(e.target.value) != false || regCn.test(e.target.value) != false) {
                    return this.$Message.info("不能输入特殊字符和空格");
                  } else {
                    params.row.propName = e.target.value;
                    this.userManaData[temIndex + params.index] = params.row;
                  }
                }
              }
            });
          }
        },
        {
          title: "*是否唯一ID",
          align: "center",
          key: "isUniqueId",
          ellipsis: true,
          width: 120,
          render: (h, params) => {
            let temIndex = (this.basePage.pageNumber - 1) * this.basePage.pageSize;
            return h("checkbox", {
              props: {
                value: Number(params.row.isUniqueId) === 0,
                disabled: params.row.disabledList
              },
              on: {
                "on-change": value => {
                  params.row.isUniqueId = value ? 0 : 1
                  this.userManaData[temIndex + params.index].isUniqueId = params.row.isUniqueId
                  this.spliceData();
                }
              }
            });
          }
        },
        {
          title: "*是否明细",
          align: "center",
          key: "isDetail",
          ellipsis: true,
          minWidth: 20,
          render: (h, params) => {
            let temIndex = (this.basePage.pageNumber - 1) * this.basePage.pageSize;
            return h("checkbox", {
              props: {
                value: Number(params.row.isDetail) === 0
              },
              on: {
                "on-change": value => {
                  params.row.isDetail = value ? 0 : 1
                  this.userManaData[temIndex + params.index].isDetail = params.row.isDetail;
                  this.spliceData();
                }
              }
            });
          }
        },
        {
          title: "条件查询",
          align: "center",
          key: "isConditionQuery",
          ellipsis: true,
          minWidth: 20,
          render: (h, params) => {
            let temIndex = (this.basePage.pageNumber - 1) * this.basePage.pageSize;
            return h("checkbox", {
              props: {
                value: Number(params.row.isConditionQuery) === 0
              },
              on: {
                "on-change": value => {
                  params.row.isConditionQuery = value ? 0 : 1
                  this.userManaData[temIndex + params.index].isConditionQuery = params.row.isConditionQuery;
                  this.spliceData();
                }
              }
            });
          }
        },
        {
          title: "*有效",
          align: "center",
          key: "isEffective",
          ellipsis: true,
          minWidth: 20,
          render: (h, params) => {
            let temIndex = (this.basePage.pageNumber - 1) * this.basePage.pageSize;
            return h("checkbox", {
              props: {
                value: Number(params.row.isEffective) === 0
              },
              on: {
                "on-change": value => {
                  params.row.isEffective = value ? 0 : 1
                  this.userManaData[temIndex + params.index].isEffective = params.row.isEffective;
                  this.spliceData();
                }
              }
            });
          }
        },
        {
          title: "*存储类型",
          align: "center",
          key: "storageType",
          ellipsis: true,
          minWidth: 20,
          render: (h, params) => {
            let temIndex = (this.basePage.pageNumber - 1) * this.basePage.pageSize;
            return h(
              "Select",
              {
                props: {
                  value: String(params.row.storageType)
                },
                style: {
                  width: "70px"
                },
                on: {
                  "on-change": value => {
                    this.userManaData[temIndex + params.index].storageType = value;
                    this.userManaData[temIndex + params.index].queryType = null;
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
                      value: String(item.id)
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
          align: "center",
          key: "queryType",
          ellipsis: true,
          minWidth: 20,
          render: (h, params) => {
            let temIndex = (this.basePage.pageNumber - 1) * this.basePage.pageSize;
            return h(
              "Select",
              {
                props: {
                  value: String(params.row.queryType)
                },
                style: {
                  width: "70px"
                },
                on: {
                  "on-change": value => {
                    this.userManaData[temIndex + params.index].queryType = value;
                    this.spliceData();
                  }
                }
              },
              (this.queryList[temIndex + params.index] ? this.queryList[temIndex + params.index] : []).map(item => {
                return h(
                  "i-Option",
                  {
                    props: {
                      value: String(item.id)
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
          align: "center",
          key: "indexType",
          ellipsis: true,
          minWidth: 20,
          render: (h, params) => {
            let temIndex = (this.basePage.pageNumber - 1) * this.basePage.pageSize;
            return h(
              "Select",
              {
                props: {
                  value: Number(params.row.indexType)
                },
                style: {
                  width: "70px"
                },
                on: {
                  "on-change": value => {
                    this.userManaData[temIndex + params.index].indexType = value;
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
      SpliceData: [],
      onOff: false,
      tabValue: "relation",
      objectTab: false,
      title: "编辑关系",
      tableId: "",
      // showProp: false,
      baseInfor: {
        // 详细信息的展示
        relationName: "",
        groupId: "",
        fromTarget: "",
        remark: "",
        toTarget: "",
        groupName: "",
        useStatus: "",
        toTargetId: "",
        fromTargetId: "",
        indexSort: ""
      },
      realations: [],
      fromTargetKey: [],
      toTargetKey: [],
      relationMap: {
        formTarget: "",
        toTorget: ""
      },
      groupIdArr: [
        {
          id: 0,
          groupId: "关系类型"
        },
        {
          id: 1,
          groupId: "属性值"
        },
        {
          id: 2,
          groupId: "属性值 + 关系类型"
        },
        {
          id: 3,
          groupId: "关系类型 + 频次"
        }
      ],
      statisticalSet: [
        { name: ">=", value: 0 },
        { name: ">", value: 1 },
        { name: "=", value: 2 },
        { name: "<", value: 3 },
        { name: "=", value: 4 }
      ],
      storageList: [],
      queryList: [],
      indexList: [{ name: "无", value: 0 }],


      total: 0, // 分页显示的总数量,
      loading: false,
      relationAttr: [],
      lightSetArr: [],
      lightSet: {
        id: null,
        relationNameDef: 0,
        propId: "",
        detailSortField: "",
        domNone: false
      },
      accumulateSelect: {
        id: null,
        countOperation: "",
        countValue: ""
      },
      relationSetArr: [],
      text: true,
      toast: false,
      addDisable: true,

      tempStorageType: {}
    };
  },
  watch: {
    "lightSet.relationNameDef"(val) {
      if (val && val != 3) {
        this.lightSet.domNone = true;
        this.$nextTick(() => {
          this.hightSet(this.tableId);
        })
      } else {
        this.lightSet.domNone = false;
        this.relationSetArr = [];
      }
    },
    baseInfor: {
      handler: function (val) { },
      deep: true,
      immediate: true // watch 的一个特点是，最初绑定的时候是不会执行的，要等到 serviceList 改变时才执行监听计算。加上改字段让他最初绑定的时候就执行
    },
    tabValue(val) {
      if (val === "prop") {
        if (val.fromTargetId !== "" || val.toTargetId !== "") {
          this.getSelectArr(val);
        }
      }
    },
  },
  created() {
  },
  methods: {
    tab() {
      this.objectTab = false;
      this.tabValue = "relation";
    },
    beforeLeave() {
      if (this.tabValue === "prop") {
        var result = this.userManaData.some(obj => {
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
    tabChange(tab) {
      if (tab.label === "属性信息") {
        // this.showProp = true
        this.render(this.tableId);
      }
    },

    storageOnchage(id, index) {
      //查询类型的数组
      let params = {
        lv: 1,
        parentId: id
      };
      api
        .api("post", api.dictUrl + "/dict/findDictTreeOneByOne", params)
        .then(res => {
          this.$set(this.queryList, index, res);
        });
    },
    async queryListFault(val) {
      this.tempStorageType = {};
      for (let index = 0; index < val.length; index++) {
        var id = this.userManaData[index].storageType;
        !this.tempStorageType[id] && (await this.handledictUrl(id));
        this.$set(this.queryList, index, this.tempStorageType[id]);
      }
    },
    handledictUrl(id) {
      let params = { lv: 1, parentId: id };
      return new Promise(reslove => {
        api.api("post", api.dictUrl + "/dict/findDictTreeOneByOne", params)
          .then(res => {
            this.tempStorageType[id] = res;
            reslove();
          });
      });
    },
    save() {
      //table  保存---数据---gy--start
      this.objectTab = false;
      let value = this.userManaData;
      //数据为空的判断
      var flag = true;
      var queryType = false;
      !this.userManaData.some(i => Number(i.isUniqueId) === 0) && (this.$message({ message: `请至少勾选一个是否唯一id` }), (flag = false));
      !this.userManaData.some(i => Number(i.isEffective) === 0) && (this.$message({ message: `请至少勾选一个是否有效` }), (flag = false));
      !this.userManaData.some(i => Number(i.isDetail) === 0) && (this.$message({ message: `请至少勾选一个是否明细` }), (flag = false));
      this.userManaData.find((item, index) => {
        if (item.propName == "") {
          let page = Math.ceil((index + 1) / (this.basePage.pageSize))
          let num = (index) % (this.basePage.pageSize)
          this.$message({ message: `请检查（第${page}页，第${num + 1}行），属性名称是漏填`, type: "warning" });
          flag = false;
          return true;
        }
      })
      //参数
      if (!flag) return
      let params = this.fromTargetKey;
      let toTargetKey = this.toTargetKey;
      params.push.apply(params, toTargetKey);
      let values = {
        //高级设置
        id: this.lightSet.id,
        relationNameDef: this.lightSet.relationNameDef,
        propId: this.lightSet.propId,
        detailSortField: this.lightSet.detailSortField,
        relationId: this.tableId,
        countOperation: this.accumulateSelect.countOperation,
        countValue: this.accumulateSelect.countValue
      };
      var object = {
        //参数拼接
        props: this.userManaData,
        mappings: params,
        config: values
      };
      let arr = [];
      arr.push(object);
      let newObject = JSON.stringify(arr);
      if (this.userManaData.length <= 0) {
        this.$Message.info("关系属性列表不能为空");
      } else {
        api
          .api("post", api.configUrl + "/relation/prop/saveOrUpdate", {
            datas: newObject
          })
          .then(res => {
            this.$Message.info("保存数据成功");
            this.render(this.tableId);
          });
      }

    },
    deletePerson: function (params) {
      // 列表删一个元素
      this.$emit("deleteProp", params);
    },
    change(status) {
      //开关按钮
      if (status === false) {
        this.baseInfor.useStatus = 1;
      } else {
        this.baseInfor.useStatus = 0;
      }
      api
        .api("post", api.configUrl + "/relation/update", {
          id: this.tableId,
          useStatus: this.baseInfor.useStatus
        })
        .then(res => {
          if (this.baseInfor.useStatus === 0) {
            this.$Message.info("状态开启成功");
          } else {
            this.$Message.info("状态关启成功");
          }
        });
    },
    relationInfoEdit() {
      //关系信息编辑按钮
      this.$refs.editModel.addModal = true;
      this.$refs.editModel.title = "编辑关系";
      this.$refs.editModel.groupIdArrMethor();
      api
        .api("post", api.configUrl + "/relation/detail", {
          id: this.tableId
        })
        .then(res => {
          //这是给的默认值
          this.$refs.editModel.formValidateAdd.id = this.tableId;
          this.$refs.editModel.formValidateAdd.relationName = res.relationName;
          this.$refs.editModel.formValidateAdd.remark = res.remark;
          this.$refs.editModel.formValidateAdd.groupId = res.groupId;
          this.$refs.editModel.formValidateAdd.fromTarget = res.fromTarget;
          this.$refs.editModel.formValidateAdd.toTarget = res.toTarget;
        });
    },
    updateDetaile(data) {
      //编辑按钮的确认事件
      api
        .api("post", api.configUrl + "/relation/update", {
          id: this.tableId,
          relationName: data.relationName,
          remark: data.remark,
          groupId: data.groupId,
          fromTarget: data.fromTarget,
          toTarget: data.toTarget
        })
        .then(res => {
          this.$emit("updata", this.tableId); //带着当前id去修改数据
          this.$emit("updataTree");
        });
    },
    refreshPage: function () {
      //更新当前页
      this.render(this.tableId);
    },
    pageChange(current) {
      //改变页码查询
      this.basePage.pageNumber = current;
      this.spliceData();
    },
    pageSizeChange(current) {
      //改变数量查询
      this.basePage.pageSize = current;
      this.spliceData();
    },
    render(id) {
      //查询列表
      this.userManaData = [];
      this.relationAttr = [];
      this.loading = false;
      let userManaUrl = "?relationId=" + id;
      let promise = new Promise((resolve, reject) => {
        api.api("post", api.configUrl + "/relation/prop/queryList" + userManaUrl)
          .then(res => {
            res.forEach((item, index) => {
              this.userManaData.push(item)
              this.userManaData[index].disabledList = true;
              this.userManaData[index].relationId = this.tableId;
              this.relationAttr.push({
                id: item.id,
                propName: item.propName
              })
            })
            this.loading = false;

            this.queryList = []
            this.queryListFault(this.userManaData)
            this.basePage.pageNumber = 1
            this.basePage.pageSize = 10
            this.spliceData();
            resolve(res);
          });
      });
      promise.then(value => {
        this.storage();
        this.renderPropFault(this.tableId);
      });
    },

    storage() {
      //存储类型的数组
      let params = {
        lv: 1,
        dictTypeId: "e1727b8f118049388f3615675f0cc9da"
      };
      api
        .api("post", api.dictUrl + "/dict/findDictTreeOneByOne", params)
        .then(res => {
          this.storageList = res;
        });
    },
    hightSet(id) {
      //				onchange事件触发的select
      // if (this.lightSet.relationNameDef != null) {
      // this.relationSetArr = [];
      api
        .api("post", api.configUrl + "/relation/prop/queryList", {
          relationId: id
        })
        .then(res => {

          // this.relationSetArr=res
          for (let i = 0; i < res.length; i++) {
            this.relationSetArr.push({
              id: res[i].id,
              propName: res[i].propName
            });
          }
        });
      // }
    },
    getSelectArr(val) {
      let fromTargetId =
        "?targetId=" + this.baseInfor.fromTargetId + "&isKey=0";
      let toTargetId = "?targetId=" + this.baseInfor.toTargetId + "&isKey=0";
      this.fromTargetKey = [];
      this.toTargetKey = [];
      api
        .api("get", api.configUrl + "/target/prop/queryList" + fromTargetId)
        .then(res => {
          //映射的东西
          for (let i = 0; i < res.length; i++) {
            this.fromTargetKey.push({
              id: null,
              linkType: 0,
              relationColumn: "",
              targetColumn: res[i].id,
              relationId: this.tableId,
              targetId: this.baseInfor.fromTargetId,
              targetColumnName: res[i].propName
            });
          }
        });
      api
        .api("get", api.configUrl + "/target/prop/queryList" + toTargetId)
        .then(res => {
          for (let i = 0; i < res.length; i++) {
            this.toTargetKey.push({
              id: null,
              linkType: 1,
              relationColumn: "",
              targetColumn: res[i].id,
              relationId: this.tableId,
              targetId: this.baseInfor.toTargetId,
              targetColumnName: res[i].propName
            });
          }
        });
    },
    async addList() {
      let newColumn = {
        id: null,
        relationId: this.tableId,
        propName: "",
        disabledList: false,
        isDetail: 1,
        isUniqueId: 1,
        isConditionQuery: 1,
        isEffective: 1,
        storageType: "026e94234a0343d8a011f18d845157d8",
        indexType: 0,
        queryType: "73da0a4011787fa9e0539401a8c01634"
      };
      this.objectTab = true;
      this.storage();
      this.userManaData.push(newColumn);
      !this.tempStorageType["026e94234a0343d8a011f18d845157d8"] && (await this.handledictUrl("026e94234a0343d8a011f18d845157d8"));
      this.$set(this.queryList, this.userManaData.length - 1, this.tempStorageType["026e94234a0343d8a011f18d845157d8"]);
      this.spliceData();
    },
    spliceData() {
      this.SpliceData = this.userManaData.slice((this.basePage.pageNumber - 1) * this.basePage.pageSize, this.basePage.pageNumber * this.basePage.pageSize);
      this.total = this.userManaData.length
    },
    renderPropFault(id) {

      //关系属性映射刷新
      api
        .api("post", api.configUrl + "/relation/prop/findAllDatas", {
          relationId: id
        })
        .then(res => {
          if (res.config != null) {
            //高级设置默认值
            this.lightSet.id = res.config.id;
            this.accumulateSelect.id = res.config.id;
            this.lightSet.relationNameDef = Number(res.config.relationNameDef);
            this.lightSet.propId = res.config.propId;
            this.lightSet.detailSortField = res.config.detailSortField;
            this.relationSetArr = []
            this.accumulateSelect.countOperation = Number(res.config.countOperation);
            this.accumulateSelect.countValue = res.config.countValue;
            this.hightSet(id);

          } else {
            this.lightSet.id = null;
            this.accumulateSelect.id = null;
            this.lightSet.relationNameDef = 0;
            this.lightSet.propId = "";
            this.lightSet.detailSortField = "";
            this.accumulateSelect.countOperation = "";
            this.accumulateSelect.countValue = "";
            this.hightSet(id);
          }
          if (res.mappings.length > 0) {
            var toTarget = res.mappings.filter(item => {
              return Number(item.linkType) === 1;
            });
            var fromTarge = res.mappings.filter(item => {
              return Number(item.linkType) === 0;
            });
            if (fromTarge.length > 0) this.fromTargetKey = fromTarge;
            if (toTarget.length > 0) this.toTargetKey = toTarget;
          }
        });
    },
    toastShow() {
      if (this.baseInfor.groupId.length > 15) {
        this.toast = true;
        this.text = false;
      }
    }
  }
};
</script>
<style lang="less">
.relationTable {
  .mapping {
    margin-top: 10px;
    .ShowInfor {
      font-size: 14px;
      .setTitle {
        font-size: 16px;
        border-bottom: 1px solid #ccc;
        line-height: 48px;
        color: #333;
      }
      .underLine {
        color: #bbd6e8;
        font-size: 12px;
      }
      .ivu-row {
        padding-top: 20px;
        .ivu-form-item {
          .ivu-form-item-content {
            width: 160px !important;
          }
        }
      }
    }
  }
}
</style>