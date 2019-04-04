
<template>
  <div class="relationTable">
    <div class="showTitle propertyTitle">
      <span><img src="@/images/model/model.png" alt=""></span>
      {{baseInfor.name}}
      <Button @click="save" type="primary" size="small" class="searchBtn">保存</Button>
    </div>
    <el-tabs v-model="tabValue" class="inTab" @tab-click="tabChange" :before-leave="beforeLeave">
      <el-tab-pane label="模型信息" name="model">
        <div class="contentMain">
          <!--编辑修改展示栏 -->
          <div class="editBtn">
            <el-button class="edit" @click="relationInfoEdit" size="small" type="ghost" icon="el-icon-edit-outline" :title="title">编辑</el-button>
          </div>
          <Form class="formShow">
            <Row>
              <Col span="8">
              <FormItem label="模型名称：">
                <p :title="baseInfor.name">{{baseInfor.name}}</p>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="模型ID： ">
                <p :title="baseInfor.groupId">{{baseInfor.groupId}}</p>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="所属分组：">
                <p :title="baseInfor.groupName">{{baseInfor.groupName}}</p>
              </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="8">
              <FormItem label="排序号： ">
                <p :title="baseInfor.indexSort">{{baseInfor.indexSort}}</p>
              </FormItem>
              </Col>
              <Col span="8">
              <FormItem label="模型描述：">
                <p :title="baseInfor.remark">{{baseInfor.remark}}</p>
              </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
      </el-tab-pane>
      <el-tab-pane label="属性信息" class="propRelation" name="prop">
        <div class="propBtn">
          <el-button @click="addList" size="small" icon="el-icon-plus" class="addBtn searchBtn">添加</el-button>
        </div>
        <div v-if="isShowProp">
          <Table :height="tableHeight" :loading="loading" stripe ref="selection" :columns="userManaColumns" :data="userManaData"></Table>
          <div class="show-Page-wr">
            <span class="page-ct">共 {{total}} 条</span>
            <Page class="clientPage" :current="current" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size="basePage.pageSize" :page-size-opts="pageArray" show-elevator></Page>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <editModel ref="editModel" @update="updateDetaile"></editModel>
    <tabModal ref="tabModal" @tabSure="tab"></tabModal>
    <deteleModel ref="delete" @deleteModel="deleteModel"></deteleModel>
  </div>
</template>
<script>
import api from "@/fetch/api";
import $ from "jquery";
import { unique } from "@/libs/common/common.js";
import { isNumber } from "@/libs/common/check.js";
import editModel from "./component/addModel.vue";
import tabModal from "@/views/Common/tabSure.vue";
import deteleModel from '@/views/Common/delete.vue';
export default {
  components: {
    editModel,
    tabModal,
    deteleModel
  },
  computed: {
  },
  data() {
    return {
      title: "编辑模型",
      tabValue: "model",
      objectTab: false,
      onOff: false,
      tableId: "",
      isShowProp: false,
      baseInfor: {
        // 详细信息的展示
        name: "",
        groupId: "",
        groupName: "",
        indexSort: "",
        remark: "",
        useStatus: ""
      },
      propTypeOption: [
        { label: "基本属性", key: "0" },
        { label: "统计属性", key: "1" }
      ],
      modelPropNameOption: [
        { label: "转账时间", key: "转账时间" },
        { label: "转账日期", key: "转账日期" }
      ],
      formatTypeOption: [
        { label: "是否取整", key: "0" },
        { label: "区间", key: "1" },
        { label: "单区间", key: "2" },
        { label: "日期", key: "3" },
        { label: "时间", key: "4" },
        { label: '金额区间', key: '5' }
      ],
      modelPropList: [],
      modelProp: [],
      tableHeight: 0,
      userManaColumns: [
        {
          // title: "类别*",
          align: "center",
          key: "propType",
          renderHeader: (h, params) => {
            return h("div", [
              h("span", "类别"),
              h("i", {
                style: {
                  color: "#FF4343"
                }
              }, '*')
            ]);
          },
          render: (h, params) => {
            return h(
              "Select",
              {
                props: {
                  value: this.userManaData[params.index].propType
                },
                on: {
                  "on-change": value => {
                    this.userManaData[params.index].propType = value;
                    this.userManaData[params.index].relationPropId = ''
                    this.userManaData[params.index].relationPropName = ''
                  }
                }
              },
              this.propTypeOption.map(item => {
                return h(
                  "i-Option",
                  {
                    props: {
                      value: String(item.key)
                    }
                  },
                  item.label
                );
              })
            );
          }
        },
        {
          align: "center",
          key: "relationId",
          renderHeader: (h, params) => {
            return h("div", [
              h("span", "关系类型"),
              h("i", {
                style: {
                  color: "#FF4343"
                }
              }, '*')
            ]);
          },
          render: (h, params) => {
            return h(
              "Select",
              {
                props: {
                  value: this.userManaData[params.index].relationId
                },
                on: {
                  "on-change": value => {
                    this.userManaData[params.index].relationId = value;
                    this.userManaData[params.index].relationPropId = ''
                    this.relationNameChange(value, params.index);
                  }
                }
              },
              this.modelPropRelation.map(item => {
                return h(
                  "i-Option",
                  {
                    props: {
                      value: String(item.id)
                    }
                  },
                  item.relationName
                );
              })
            );
          }
        },
        {
          renderHeader: (h, params) => {
            return h("div", [
              h("span", "关系属性"),
              h("i", {
                style: {
                  color: "#FF4343"
                }
              }, '*')
            ]);
          },
          align: "center",
          ellipsis: true,
          render: (h, params) => {
            if (this.userManaData[params.index].propType == "0") {
              return h(
                "Select",
                {
                  props: {
                    value: String(this.userManaData[params.index].relationPropId),
                    labelInValue: true
                  },
                  ref: 'select' + params.index,
                  on: {
                    "on-change": value => {
                      this.userManaData[params.index].relationPropId = value.value;
                      this.userManaData[params.index].relationPropName = value.label;
                      // this.relationProp(value,params.index);
                    }
                  }
                },
                (this.modelPropList[params.index] ? this.modelPropList[params.index] : []).map(item => {
                  return h('i-Option', {
                    props: {
                      value: String(item.id),
                    }
                  }, item.propName)
                })
              );
            } else {
              return h(
                "Input",
                {
                  props: {
                    value: String((this.userManaData[params.index].relationPropName == null) ? '' : this.userManaData[params.index].relationPropName)
                  },
                  class: "rela-prop-table",
                  on: {
                    "on-blur": (e) => {
                      this.userManaData[params.index].relationPropName = event.target.value
                      this.userManaData[params.index].relationPropId = 'fromVIdAndToVId';
                    }
                  }
                },
              );
            }
          }
        },
        {
          renderHeader: (h, params) => {
            return h("div", [
              h("span", "条件样式"),
              h("i", {
                style: {
                  color: "#FF4343"
                }
              }, '*')
            ]);
          },
          align: "center",
          key: "formatType",
          ellipsis: true,
          render: (h, params) => {
            return h(
              "Select",
              {
                props: {
                  value: this.userManaData[params.index].formatType
                },
                on: {
                  "on-change": value => {
                    this.userManaData[params.index].formatType = value;
                  }
                }
              },
              this.formatTypeOption.map(item => {
                return h(
                  "i-Option",
                  {
                    props: {
                      value: String(item.key)
                    }
                  },
                  item.label
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
                  style: {
                    marginRight: "5px"
                  },
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
      userManaData: [],
      loading: false,
      pageArray: [10, 20, 30, 40],
      basePage: {
        pageSize: 10,
        pageNumber: 1
      },
      current: 1,
      total: 0, // 分页显示的总数量,
      loading: false,
      modelShow: false,
      modelPropRelation: [],
      text: true,
      toast: false,
      isSave: false,
      isUpdate: false,
      deleParams: {}
    };
  },
  mounted() {
    this.tableHeight = window.innerHeight - 330
    window.onresize = (() => this.tableHeight = window.innerHeight - 330)
  },
  methods: {
    tab() {
      this.objectTab = false;
      this.tabValue = "model";
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
      if (tab.label == "属性信息") {
        this.isShowProp = true
        this.$nextTick(() => {
          this.render("1", "10", this.tableId);
        })
      }
    },
    deletePerson(params) {

      // 列表删一个元素
      this.total--
      // this.$emit("deleteProp", params);
      this.deleParams = params
      this.$refs.delete.deleteModal = true;
      this.$refs.delete.title = "删除属性列表";
      this.$refs.delete.deleteModal_loading = false;
    },
    deleteModel() {
      // let index = params.index;
      // let basePage = this.$refs.relationInfor.basePage;
      // let realationId = this.$refs.relationInfor.tableId;
      let params = this.deleParams
      let ids = '?ids=' + params.row.id;
      if (params.row.id === null) {
        this.userManaData.splice(params.index, 1);
        this.modelPropList.splice(params.index, 1)
      } else {
        api.api('post', api.configUrl + '/t/model/prop/delete' + ids).then(res => {
          this.$Message.info('数据删除成功');
          this.userManaData.splice(params.index, 1);
          // this.formatTypeOption.splice(params.index, 1)
          this.modelPropList.splice(params.index, 1)
          // this.propTypeOption.splice(params.index, 1)
        })
      }
    },
    switchChange(state) {
      //列表的状态开启
      if (state === false) {
        this.baseInfor.useStatus = 1;
      } else {
        this.baseInfor.useStatus = 0;
      }
      api.api("post", api.configUrl + "/t/model/update", {
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
    addList() {
      let newColumn = {
        id: null,
        modelId: this.tableId,
        propType: "0",
        formatType: "",
        relationId: "",
        relationPropName: '',
        relationPropId: ''
      };
      this.userManaData.push(newColumn);
      this.total++
      (this.modelPropRelation.length == 0) && this.modelName()
    },
    relationNameChange(id, index) {
      //关系名称onchange事件
      let params = "?relationId=" + id;
      api.api("get", api.configUrl + "/relation/prop/queryList" + params)
        .then(res => {
          this.$set(this.modelPropList, index, res);
        });
    },
    // queryType(params, id) {
    //   this.modelProp.map((item, index, array) => {
    //     if (array[index].id === id) {
    //       this.userManaData[params.index].queryTypeName = array[index].title;
    //     }
    //   });
    // },
    relationInfoEdit() {
      //关系信息编辑按钮
      this.$refs.editModel.addModal = true;
      this.$refs.editModel.title = "编辑模型";
      this.$refs.editModel.modelGroupMethor();
      api.api("post", api.configUrl + "/t/model/detail", {
        id: this.tableId
      })
        .then(res => {

          //这是给的默认值
          this.$refs.editModel.modelAdd.name = res.name;
          this.$refs.editModel.modelAdd.remark = res.remark;
          this.$refs.editModel.modelAdd.groupId = res.groupId;
          this.$refs.editModel.modelAdd.id = res.id
        });
    },
    updateDetaile(data) {
      //编辑按钮的确认事件
      api.api("post", api.configUrl + "/t/model/update", {
        id: this.tableId,
        name: data.name,
        remark: data.remark,
        groupId: data.groupId
      })
        .then(res => {
          this.$emit("updata", this.tableId);
          this.$emit("updataTree");
        });
    },
    save() {
      let mes = {
        propType: "类别",
        formatType: "条件样式",
        relationId: "关系类型",
        relationPropName: "关系属性",
        relationPropId: '关系属性'
      };
      //table  保存---数据---gy--start
      this.objectTab = false;
      if (this.userManaData.length > 0) {
        let flag = this.userManaData.some((item, index) => {
          return Object.keys(mes).some(key => {
            if (item[key] == "") {
              this.$message({ message: `请检查第${index + 1}行${mes[key]}是否漏填`, type: "warning" });
              return true;
            }
          });
        });
        if (flag) return false
        let arrId = [];
        let arrNotId = [];
        this.userManaData.forEach(item => {
          item.id != "" && item.id != null ? arrId.push(item) : arrNotId.push(item);
        });
        let req1 = new Promise((resolve, reject) => {
          if (arrNotId.length) {
            api.api("post", api.configUrl + "/t/model/prop/save", { props: JSON.stringify(arrNotId) })
              .then(res => { resolve("保存") }).catch(() => { reject() });
          } else {
            resolve(false);
          }
        });
        let req2 = new Promise((resolve, reject) => {
          if (arrId.length) {
            api.api("post", api.configUrl + "/t/model/prop/update", { props: JSON.stringify(arrId) })
              .then(res => { resolve("编辑") }).catch(() => { reject() });
          } else {
            resolve(false);
          }
        });
        Promise.all([req1, req2]).then(res => {
          res[0] && res[2] ? this.$message(`操作成功`) : this.$message(`${res[0] || res[1]}成功`);
          this.render(this.basePage.pageNumber, this.basePage.pageSize, this.tableId);
        })
      } else {
        this.$Message.info("table框数据不允许为空");
      }
      //table  保存---数据---gy--end
    },
    refreshPage: function () {
      //更新当前页
      this.render(
        this.basePage.pageNumber,
        this.basePage.pageSize,
        this.tableId
      );
    },
    refreshPage: function () {
      //更新当前页
      this.render(
        this.basePage.pageNumber,
        this.basePage.pageSize,
        this.tableId
      );
    },
    pageChange(current) {
      //改变页码查询
      this.basePage.pageNumber = current;
      this.current = current;
      this.render(this.current, this.basePage.pageSize, this.tableId);
    },
    pageSizeChange(current) {
      //改变数量查询
      this.basePage.pageSize = current;
      this.render(this.basePage.pageNumber, current, this.tableId);
    },
    render(numbers, size, id) {
      //查询列表
      this.userManaData = [];
      this.modelPropRelation = [];
      this.modelPropList = [];
      let userManaUrl = "?pageNum=" + numbers + "&pageSize=" + size + "&modelId=" + id;
      this.loading = false;
      api
        .api("get", api.configUrl + "/t/model/prop/queryPage" + userManaUrl)
        .then(res => {
          this.modelName();
          if (!res.total) {
            this.$Message.info("根据条件查不到数据");
            this.total = 0;
            this.loading = false;
            return;
          }
          this.userManaData = res.list;
          this.total = res.total;

          this.loading = false;
          this.userManaData.forEach((item, index) => {

            if (item.relationId !== '123456') {
              this.relationNameChange(item.relationId, index)
            }
          })
        });
    },
    modelName() {
      api.api("get", api.configUrl + "/relation/queryList").then(res => {
        this.modelPropRelation = res;
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
.rela-prop-table {
  .ivu-input {
    text-align: center;
    font-size: 12px;
  }
}
.show-Page-wr {
  display: flex;
  .page-ct {
    // display: inline-block;
    height: 32px;
    line-height: 32px;
    margin-right: 10px;
    margin-left: 10px;
    padding-bottom: 5px;
  }
}
</style>