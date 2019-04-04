
<template>
  <!--查看的模态框-->
  <Modal v-model="lookModel" :width='800' :title="title" class="addMapModel" :mask-closable="false">
    <div slot="footer" class="font-size-0">
      <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
      <Button type="primary" class="sureBtn" @click="addModalok">确定</Button>
    </div>
    <div>
      <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="物理表字段" width="120">
          <template slot-scope="scope">{{ scope.row.tableCloumn }}</template>
        </el-table-column>
        <el-table-column label="属性名称" width="190">
          <template slot-scope="scope">{{ scope.row.propName }}</template>
        </el-table-column>
        <el-table-column label="主键" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.isKey=='0'?'是':'否' }}</template>
        </el-table-column>
        <el-table-column label="时间格式" show-overflow-tooltip>
          <template slot-scope="scope">{{ handleDataStyle(scope.row.tenantId) }}</template>
        </el-table-column>
      </el-table>
    </div>
  </Modal>
</template>

<script>
import api from '@/fetch/api';
import $ from 'jquery';
import { unique } from '@/libs/common/common.js';
export default {
  components: {

  },
  data() {
    return {
      lookModel: false,
      title: '',
      formValidateAdd: {},
      tableData: [],
      dateOption: [
        { label: "无", id: 0 },
        { label: "毫秒数", id: 1 },
        { label: "yyyyMMdd", id: 2 },
        { label: "yyyyMMdd HHmmss", id: 3 },
        { label: "yyyy-MM-dd", id: 4 },
        { label: "yyyy-MM-dd HH:mm:ss", id: 5 }
      ],
    }
  },
  methods: {
    handleDataStyle(val) {
      return this.dateOption.find(i => (i.id).toString() == val).label
    },
    handleLook(data) {
      let type = data.relationId == '' ? 0 : 1
      api.api('post', api.configUrl + '/t/mapping/prop/viewMapping', { type: type, mappingId: data.id }).then((res) => {
        this.tableData = res
      })

    },
    modalCancel() {						//弹框的取消事件
      this.lookModel = false;
    },

    addModalok() {
      this.lookModel = false;
    },
  }
}
</script>
<style lang="less">
.addMapModel {
  .ivu-modal-wrap {
    .ivu-modal {
      .ivu-modal-content {
        .ivu-modal-header {
          padding: 0 30px;
          height: 50px;
          line-height: 50px;
        }
        .ivu-modal-body {
          .ivu-form {
            padding: 0 !important;
            .searchInput {
              padding-bottom: 20px;
            }
            .ivu-form-item-label {
              height: 32px;
              line-height: 32px;
              padding: 10px 0;
              margin-right: 10px;
              width: 35%;
            }
            .ivu-form-item-content {
              width: 55%;
            }
          }
          .mappingBox {
            width: 100%;
            .title {
              font-size: 16px;
              color: #333;
              line-height: 44px;
              border-bottom: 1px solid #ccc;
            }
            .mappingCon {
              height: 150px;
              overflow: auto;
              padding: 10px 5px;
            }
          }
        }
      }
    }
  }
}
</style>
