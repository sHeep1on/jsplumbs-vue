
<template>
  <!--新增组模态框-->
  <Modal v-model="addModal" :title="finnal.title" class="addFinalMapModel" :mask-closable="false" @on-cancel="modalCancel">
    <div slot="footer" class="font-size-0">
      <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
      <Button type="default" class="cancelBtn" @click="force">上一步</Button>
      <Button type="primary" class="sureBtn" @click="addModalok">确定</Button>
    </div>
    <div>
      <Form ref="formValidateAdd">
        <FormItem :label="finnal.label">
          <Input clearable disabled :placeholder="finnal.placeholders"></Input>
        </FormItem>
      </Form>
      <Table :loading="finnal.loading" stripe ref="selection" :columns="mappingColumns" :data="addObject"></Table>
      <Page class="clientPage" :current.sync="basePage.pageNumber" :total="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size.sync="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
    </div>
  </Modal>
</template>

<script>
import api from "@/fetch/api";
import $ from "jquery";
import { unique } from "@/libs/common/common.js";
export default {
  components: {},
  data() {
    return {
      addModal: false,
      loading: false,
      addObject: [],
      finnal: {
        title: "添加到关系",
        label: "",
        placeholders: "",
        type: "",
        mappingId: ""
      },
      propSelect: [],
      dateOption: [
        { label: "无", id: 0 },
        { label: "毫秒数", id: 1 },
        { label: "yyyyMMdd", id: 2 },
        { label: "yyyyMMdd HHmmss", id: 3 },
        { label: "yyyy-MM-dd", id: 4 },
        { label: "yyyy-MM-dd HH:mm:ss", id: 5 }
      ],
      mappingColumns: [
        {
          title: "物理表字段",
          key: " tableCloumn",
          align: "center",
          ellipsis: true,
          render: (h, params) => {
            return h(
              "Select",
              {
                props: {
                  value: String(params.row.tableCloumn)
                },
                on: {
                  "on-change": value => {
                    // this.mappingData[params.index].tableCloumn = value;
                    this.physicalField(value, params.index);
                  }
                }
              },
              this.propSelect.map(item => {
                return h(
                  "i-Option",
                  {
                    props: {
                      value: item.columnName
                    }
                  },
                  item.columnName
                );
              })
            );
          }
        },
        {
          title: "属性名称",
          align: "center",
          key: "propName",
          ellipsis: true,
          render: (h, params) => {
            return h("i-input", {
              props: {
                value: String(params.row.propName),
                disabled: true
              }
            });
          }
        },
        {
          title: "主键",
          align: "center",
          ellipsis: true,
          width: 100,
          render: (h, params) => {
            var values = params.row.isKey ? params.row.isKey == 0 ? "是" : "否" : params.row.isUniqueId == 0 ? "是" : "否";
            return h("div", values);
          }
        },
        {
          title: "时间格式",
          align: "center",
          ellipsis: true,
          key: 'tenantId',
          render: (h, params) => {
            let temIndex = (this.basePage.pageNumber - 1) * this.basePage.pageSize;
            return h(
              "Select",
              {
                props: {
                  value: params.row.tenantId
                },
                on: {
                  "on-change": value => {
                    this.mappingData[temIndex + params.index].tenantId = value;
                    this.spliceData();
                    // this.mappingData[params.index].tenantId = value;
                  }
                }
              },
              this.dateOption.map(item => {
                return h(
                  "i-Option",
                  {
                    props: {
                      value: item.id
                    }
                  },
                  item.label
                );
              })
            )
          }
        }
      ],
      mappingData: [],
      tableList: [],
      pageArray: [10, 20, 30, 40],
      basePage: {
        pageSize: 10,
        pageNumber: 1
      },
      tableId: "",
      total: 0, // 分页显示的总数量,
      cancelRepeat: [],
      index: []
    };
  },
  methods: {
    physicalField(value, index) {
      if (this.mappingData.some(i => i.tableCloumn == value)) {
        this.$Message.info("物理表字段不能重复");
        this.addObject[index].tableCloumn = null;
      } else {
        this.addObject[index].tableCloumn = value;
        this.mappingData[(this.basePage.pageNumber - 1) * this.basePage.pageSize + index].tableCloumn = value;
      }
      this.spliceData();
    },
    modalCancel() {
      this.basePage.pageNumber = 1;
      this.basePage.pageSize = 10;
      this.addModal = false;
      this.mappingData.map(item => {
        item.propId = null;
      });
      this.$emit("remove", this.finnal.title);
    },
    force() {
      this.basePage.pageNumber = 1;
      this.basePage.pageSize = 10;
      this.$emit("forceBack");
    },
    addModalok() {
      this.basePage.pageNumber = 1;
      this.basePage.pageSize = 10;
      this.$emit("modelOk");
    },
    rendtable(id) {
      this.tableId = id;
      this.mappingData = [];
      var urlFind = this.finnal.title === "添加到对象" ? "/target/prop/queryList" : "/relation/prop/queryList";
      var params = this.finnal.title === "添加到对象" ? { targetId: id } : { relationId: id };
      api.api("post", api.configUrl + urlFind, params).then(res => {
        //这是为对象的默认值
        if (res.length == 0) {
          this.$Message.info("根据条件查不到数据");
          this.total = 0;
          this.loading = false;
          return;
        }
        res.forEach(item => {
          this.mappingData.push({
            id: null,
            tableCloumn: "",
            propId: item.id,
            propName: item.propName,
            type: this.finnal.title == "添加到对象" ? 0 : 1,
            isKey: this.finnal.title == "添加到对象" ? item.isKey : item.isUniqueId,
            tenantId: 0
          });
        });
        this.total = res.length;
        this.spliceData();
      });
    },
    spliceData() {
      this.addObject = this.mappingData.slice((this.basePage.pageNumber - 1) * this.basePage.pageSize, this.basePage.pageNumber * this.basePage.pageSize);
    },
    pageChange(current) {
      this.spliceData();
    },
    pageSizeChange(current) {
      this.spliceData();
    }
  }
};
</script>
<style lang="less" >
.addFinalMapModel {
  .ivu-modal-wrap {
    .ivu-modal {
      width: 800px !important;
      .ivu-modal-content {
        .ivu-modal-header {
          background: #397cbf;
          padding: 0 20px 0 8px;
          height: 50px;
          line-height: 50px;
        }
      }
    }
  }
}
</style>
