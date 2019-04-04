<template>
  <div>
    <Modal v-model="isShow" width="520" :title="title" :mask-closable="false" @on-cancel="modalCancel" v-chinaOlyloading.fullscreen="isLoading">
      <div slot="footer" class="font-size-0">
        <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
        <Button type="primary" class="sureBtn" @click="uploadModel">确定</Button>
      </div>
      <div>
        <el-form ref="formAdd" :model="formAdd" :rules="ruleAdd" label-width="115px" class="upload-file-ct" :inline="true">
          <el-form-item label="案件名称：" prop="name">
            <el-input v-model.trim="formAdd.name" size="small"></el-input>
          </el-form-item>
          <el-form-item label="案件编号：" prop="tenantId">
            <el-input v-model.trim="formAdd.tenantId" :disabled='isDisable' size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </Modal>
  </div>
</template>

<script>
import api from '@/fetch/api';
import { Loading } from 'element-ui';
import { validateCaseId } from '@/libs/common/check.js';
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    caseInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      isShow: this.show,
      Mould: [],
      fileData: [],
      formAdd: {
        name: '',
        tenantId: '',
        id: '0',
        grade: '0'
      },
      ruleAdd: {
        name: [{ required: true, message: '请填写案件名称' }],
        tenantId: [
          { required: true, message: '请填写案件编号', trigger: 'change' },
          { validator: validateCaseId, trigger: 'blur' }
        ]
      },
      isLoading: false,
      roleInfo: '',
      treeData: []
    };
  },
  watch: {
    isShow() {
      this.isShow = this.show;
    }
  },
  computed: {
    title() {
      return this.caseInfo ? '编辑案件' : '新增案件';
    },
    isDisable() {
      return this.caseInfo ? true : false;
    }
  },
  created() {
    if (this.caseInfo) {
      this.formAdd.tenantId = this.caseInfo.caseId;
      this.formAdd.name = this.caseInfo.title;
      this.formAdd.id = this.caseInfo.id;
    }
  },
  mounted() { },
  methods: {
    modalCancel() {
      // 取消
      this.$emit('update:show', false);
      this.$emit('update:caseInfo', null);
    },
    uploadModel() {
      this.$refs.formAdd.validate((valid) => {
        if (valid) {
          this.isLoading=true
          let url = !this.caseInfo ? '/tFilesDataList/save' : '/tFilesDataList/update';
          api.api('post', api.loginUrl2 + url, this.formAdd).then((res) => {
            this.$emit('updateTree');
            this.modalCancel();
            this.isLoading=false
          }).catch(error=>{
            this.isLoading=false
          })
        }
      });
    }
  }
};
</script>
<style lang="less">
.download-temp {
  .download-temp.ivu-btn {
    float: left;
    display: block;
  }
}
.ivu-form-item-content {
  float: none;
}
.ivu-select-selection {
  height: 34px !important;
}
.ivu-btn {
  margin-left: 25px;
}
.mb {
  margin-left: 0;
}
.upload-file-ct {
  .el-form-item {
    width: 100%;
    .el-form-item__content {
      width: calc(~"100% - 200px");
      .el-cascader {
        width: 100%;
      }
      .el-select {
        width: 100%;
      }
    }
  }
}
.ivu-modal-footer {
  .download-temp {
    &.ivu-btn {
      border: 0px;
      padding: 0;
      float: left;
      padding-top: 20px;
      font-size: 12px;
      background: #f5f7f9;
      &:focus {
        box-shadow: none;
      }
      & a {
        color: #2d8cf0;
      }
      &:hover {
        color: #2d8cf0;
        background: #f5f7f9;
      }
    }
  }
}
</style>
