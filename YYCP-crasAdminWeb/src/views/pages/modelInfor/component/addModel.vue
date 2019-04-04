<template>
  <div id="addRelation">
    <!--新增组模态框-->
    <Modal v-model="addModal" :title="title" class="lookStyle roleLookStyle owenForm" @on-cancel="modalCancel" :mask-closable="false">
      <div slot="footer" class="font-size-0">
        <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
        <Button type="primary" class="sureBtn" @click="addModalok">确定</Button>
      </div>
      <div>
        <Form ref="formValidateAdd" :model="modelAdd" :rules="ruleValidateAdd">
          <FormItem label="模型名称：" prop="name">
            <Input :maxlength="16" v-model.trim="modelAdd.name" clearable placeholder="请输入模型名称"></Input>
          </FormItem>
          <FormItem label="模型描述：" prop="remark">
            <Input :maxlength="16" v-model.trim="modelAdd.remark" clearable placeholder="请输入模型描述描述"></Input>
          </FormItem>
          <FormItem label="模型组：" prop="groupId">
            <Select v-model.trim="modelAdd.groupId">
              <Option v-for="item in modelGroup" :value="item.id" :key="item.id">{{ item.groupName }}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>
<script>
import api from '@/fetch/api';
import $ from 'jquery';
import { unique } from '@/libs/common/common.js';
import { validateNameExsit } from '@/libs/common/check.js';
export default {
  data() {
    //名字重复性的校验
    const nameUnique = (rule, value, callback) => {

      let urlNeed = this.title == "新增模型" ? api.configUrl + '/t/model/findCount?name=' + value
        : api.configUrl + '/t/model/findCount?name=' + value + '&id=' + this.modelAdd.id;
      api.api('get', urlNeed).then(res => {
        if (res > 0) {
          callback(new Error('该模型名称已存在'))
        } else {
          callback()
        }
      })
    }
    return {
      addModal: false,
      title: "新增模型",
      modelGroup: [],
      modelAdd: { 				// 表单
        id: "",
        name: '',
        remark: '',
        groupId: '',
      },
      // 新增表单验证
      ruleValidateAdd: {
        name: [{
          required: true,
          message: '模型名称不能为空'
        }, {
          validator: validateNameExsit
        }, {
          validator: nameUnique
        }],
        remark: [{
          validator: validateNameExsit
        }],
        groupId: [{
          required: true,
          message: '关系组不能为空',
        }]
      },
    }
  },
  methods: {
    modalCancel() {						// 编辑 模态框 取消事件
      if (this.title === "新增模型") {
        this.$emit("groupCancel", this.title)
      } else {
        this.$refs.formValidateAdd.resetFields();
        this.addModal = false;
      }
    },
    modelGroupMethor() {
      this.modelGroup = [];
      api.api('get', api.configUrl + '/t/model/group/queryList').then(res => {	//这是给的默认值
        this.modelGroup = res;
      });
    },
    addModalok() {						//新增关系模态框确认确认
      this.$refs.formValidateAdd.validate((valid) => {
        if (valid) {
          if (this.title === "新增模型") {
            api.api('post', api.configUrl + '/t/model/save', {
              name: this.modelAdd.name,
              remark: this.modelAdd.remark,
              groupId: this.modelAdd.groupId,
            }).then(res => {
              this.$refs.formValidateAdd.resetFields();
              this.addModal = false;
              this.$emit("updata")
            })
          } else {
            this.$emit("update", this.modelAdd);
            this.addModal = false;
            this.$refs.formValidateAdd.resetFields();
          }
        }
      })
    },
  }
}
</script>
<style lang="less">
#addRelation {
  .owenForm {
    .ivu-form-item {
      .ivu-form-item-label {
        width: 30% !important;
      }
    }
  }
}
</style>
