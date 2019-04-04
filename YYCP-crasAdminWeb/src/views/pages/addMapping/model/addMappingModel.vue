
<template>
  <!--新增组模态框-->
  <Modal v-model="addModal" :title="title" class="lookStyle roleLookStyle addMapModel" @on-cancel="modalCancel" :mask-closable="false">
    <div slot="footer" class="font-size-0">
      <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
      <Button type="primary" class="sureBtn" @click="addModalok">下一步</Button>
    </div>
    <div>
      <Form ref="formValidateAdd" :model="formValidateAdd" :rules="ruleValidate">
        <Row>
          <Col span="24">
          <FormItem label="数据源：" prop="dataSourceId">
            <Select v-model.trim="formValidateAdd.dataSourceId">
              <Option v-for="item in dataSource" :value="item.id">{{ item.sourceName }}</Option>
            </Select>
          </FormItem>
          </Col>
          <Col span="24">
          <FormItem label="数据源表：" prop="tableId" >
            <Select v-model.trim="formValidateAdd.tableId" filterable>
              <Option v-for="item in dataList" :value="item.id">{{ item.tableName }}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem :label="labelTitle.objectTitle" prop="targetId" class="object" ref="target">
            <Select v-model.trim="formValidateAdd.targetId" :disabled="objectDisable">
              <Option v-for="item in objectSelect" :value="item.id">{{ item.targetName }}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
          <FormItem :label="labelTitle.relationTitle" prop="relationId" class="relation" ref="relation">
            <Select v-model.trim="formValidateAdd.relationId" :disabled="disabled">
              <Option v-for="item in relationSelect" :value="item.id">{{ item.relationName }}</Option>
            </Select>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
  </Modal>
</template>

<script>
import api from '@/fetch/api';
import $ from 'jquery';
import { unique } from '@/libs/common/common.js';
export default {
  props: {
    title: String,
    default: '映射配置'
  },
  watch: {
    'formValidateAdd.dataSourceId'(val) {
      if (val != undefined) {
        this.$emit("dataList", val);
      }
    },
    'formValidateAdd.targetId'(val) {
      if (val) {
        this.disabled = true;
      } else {
        this.disabled = false;
      }
    },
    'formValidateAdd.relationId'(val) {
      if (val) {
        this.objectDisable = true;
      } else {
        this.objectDisable = false;
      }
    }
  },
  data() {
    return {
      disabled: false,
      objectDisable: false,
      addModal: false,
      formValidateAdd: { // 表单
        dataSourceId: '',
        tableId: '',
        targetId: '',
        relationId: '',
      },
      labelTitle: {
        relationTitle: "关系：",
        objectTitle: "对象：",
      },
      dataSource: [],
      dataList: [],
      relationSelect: [],
      objectSelect: [],
      ruleValidate: {
        dataSourceId: [{
          required: true,
          message: '数据源不能为空'
        }],
        tableId: [{
          required: true,
          message: '数据表不能为空',
        }]
      }, // 新增表单验证
    }
  },
  methods: {
    dataSourceChange(data) {
      this.$emit("dataList", data);
    },
    modalCancel() {						//弹框的取消事件
      this.addModal = false;
      this.$emit("mappingCancel", this.title)
    },
    addModalok() {
      this.$emit('sendData', this.formValidateAdd)
    },
  }
}
</script>
<style lang="less">
.addMapModel {
  .ivu-modal-wrap {
    .ivu-modal {
      .ivu-modal-content {
        // width: 480px !important;
        .ivu-form-item-label {
          padding: 0 !important;
        }
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
