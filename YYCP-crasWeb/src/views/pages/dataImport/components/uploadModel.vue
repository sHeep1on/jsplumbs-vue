<template>
  <div>
    <Modal v-model="isShow" width="520" :title="title" :mask-closable="false" @on-cancel="modalCancel" v-chinaOlyloading.fullscreen="isLoading">
      <div slot="footer" class="font-size-0">
        <Button class="download-temp"><a @click="handleDownurl" download="模板">点击此处下载模板</a></Button>
        <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
        <Button type="primary" class="sureBtn" @click="uploadModel">确定</Button>
      </div>
      <div>
        <el-form ref="formAdd" :model="formAdd" :rules="ruleAdd" label-width="115px" class="upload-file-ct" :inline="true">
          <el-form-item label="案件选择：" required prop='caseType'>
            <el-cascader :options="treeData" v-model="formAdd.caseType" :props='defaultProps' size='small'>
            </el-cascader>
          </el-form-item>
          <el-form-item label="模版类型：" prop="fileType">
            <el-select v-model.trim="formAdd.fileType" class="mb" size="small" filterable >
              <el-option v-for="item in Mould" :value="item.id" :label="item.typeName" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="isdataType" label="数据类型：" prop="dataType">
            <el-select v-model.trim="formAdd.dataType" class="mb" size="small" filterable>
              <el-option v-for="item in dataOptin" :value="item.code" :label="item.title" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据来源：" prop="DataSource">
            <el-select v-model.trim="formAdd.DataSource" class="mb" size="small" filterable>
              <el-option v-for="item in DataSource" :value="item.id" :label="item.bankName" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <Upload ref="upload" :before-upload="handleUpload" :format="['csv','xls','xlsx','et','txt']"
          :data='uploadDate' multiple  :show-upload-list="false" :action="actionUrl" :on-remove="removeFile" :on-format-error="handleFormatError">
            <Button icon="ios-cloud-upload-outline" :disabled="disabled" @click.native.stop="handleClick">选择文件</Button>
          </Upload>
          <div class="file-list-ct" v-for="(item,index) in uploadList">
            <template v-if="item.status=='finished'">
              <el-alert v-if="item.response.code==200" :title="item.name" type="success"  @close='removeFileList(item)' show-icon>
              </el-alert>
              <el-alert v-else :title="item.name+'('+item.response.message+')'" type="error"  @close='removeFileList(item)' show-icon>
              </el-alert>
            </template>
            <template v-else>
              <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
          </div>
        </el-form>
      </div>
    </Modal>
  </div>
</template>

<script>
import api from '@/fetch/api';
import { Loading } from 'element-ui';
import { storage } from '@/libs/common/common.js';
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    fileInfo:{
      type: Object,
      default: {}
    }
  },
  inject:{
    dataImport:{
      default: ""
    }
  },
  data() {
    const validCaseType = (rule, value, callback) => {
      if (value.length !== 2) {
        callback(new Error('文件目录不可选择，请选择案件'));
      } else {
        callback();
      }
    };
    const validDataType = (rule, value, callback) => {
      if (this.formAdd.fileType == '10' && value == '') {
        callback(new Error('请选择数据类型'))
      } else {
        callback()
      }
    }
    return {
      isShow: this.show,
      title: '文件上传',
      addModal: false,
      disabled: false,
      Mould: [],
      fileData: [],
      uploadList: [],
      DataSource:[],
      // isdataType:false,
      formAdd: {
        fileType: '',
        caseType: [],
        dataType: '',
        DataSource:''
      },
      ruleAdd: {
        fileType: [
          { required: true, message: '请选择模板类型' }
        ],
        caseType: [
          { required: true, message: '请选择案件', trigger: 'change' },
          { validator: validCaseType, trigger: 'change' }
        ],
        dataType: [{ validator: validDataType, trigger: 'change' }],
        DataSource:[{
          required: true, message: '请选择数据来源', trigger: 'change'
        }]
      },
      isLoading: false,
      roleInfo: '',
      treeData: [],
      dataOptin: [],
      defaultProps: {
        children: 'child',
        label: 'title',
        value: 'id'
      },
      files:null,
      uploadDate:{},
      removeList:[]
    };
  },
  watch: {
    isShow() {
      this.isShow = this.show;
    }

  },
  computed: {
    actionUrl() {
      return `/api/v2/files/fileUpload`;
    },
    isdataType() {
      return this.formAdd.fileType == '10'
    }
  },
  created() {
    this.fileMoulds();
    this.roleInfo = storage.get('relaAdmin') ? 'relateAdmin' : '';
    this.initTreeData();
    this.initDataList();
    this.initDataSource()
  },

  mounted() {
    this.uploadList = this.$refs.upload.fileList;
  },
  methods: {
    handleUpload(file){
    },
    findBankName(val){
      let a = this.DataSource.find(i=>i.id==val)
      return a?a.bankName:''
    },
    findShortBankName(val){
      let a = this.DataSource.find(i=>i.id==val)
      return a?a.bankShortName:''
    },
    findCase(val){
      let result = this.treeData.find((item) => {
        return item.id == this.formAdd.caseType[0];
      });
      return result?result[val]:''
    },
    findIconPath(val){
      let res = this.Mould.find(item => this.formAdd.fileType == item.id)
      return res?res[val]:''
    },
    handleClick(){

       this.$refs.formAdd.validate((valid)=>{
         if (valid) {
           this.uploadDate ={
              role:this.roleInfo,
              parId:this.formAdd.caseType[this.formAdd.caseType.length - 1],
              bankname:this.findBankName(this.formAdd.DataSource),
              bankshortname:this.findShortBankName(this.formAdd.DataSource),
              type:this.formAdd.fileType,
              iconPath:this.findIconPath('iconPath'),
              matchType:this.findIconPath('tenantId'),
              dataType:this.formAdd.dataType,
              caseId:this.findCase('caseId'),
              id:this.findCase('id')
            }
            this.$refs.upload.handleClick()
         } else {
           this.$message.warning('请完成所有必选项！')
         }
       })
    },
    initDataSource(){
      api.api('post', `${api.loginUrl2}/tbank/queryList`).then(res => {
        this.DataSource = res
      }).catch(error => {
        console.log(error);
      });
    },
    initDataList() {
      api.api('post', `${api.dictUrl}/dict/findDictTreeByType?dictTypeId=31f76c7779d8472997e2965d9f0e5fbe`).then(res => {
        this.dataOptin = res.sort((a, b) => {
          return Number(a.code) - Number(b.code);
        });
      }).catch(error => {
      });
    },
    handleDownurl() {
      api.api('post', `${api.loginUrl2}/file/downLoadMould`).then(res => {
        let aLink = document.createElement('a');
        aLink.style.display = 'none';
        aLink.href = api.uploads + res;
        document.body.appendChild(aLink);
        aLink.click();
        URL.revokeObjectURL(aLink.href); // 释放URL 对象
        document.body.removeChild(aLink);
      }).catch(error => {
        console.log(error);
      });
    },
    removeFile() {
      this.fileData = [];
      this.disabled = false;
    },

    removeFileList(file) {
      if(file.response.code==200){
        this.removeList.push(file)
        let params ={ids:file.response.data.id}
        this.removeFileReq(params)
      }
    },
    removeFileReq(params){
      api.api('post',api.loginUrl2+"/files/delete",params).then((res)=>{
      }).then(error=>{
        console.log(error);

      })
    },
    initTreeData() {
      api.api('post', api.loginUrl2 + '/tFilesDataList/selectTree', { role: this.roleInfo }).then(res => {
        this.treeData=[]
        const findIn = (list) =>{
          if (list[0].grade=='-1') {
            list.forEach(i=>this.treeData=this.treeData.concat(i.child))
          } else {
            list.forEach(i=>findIn(i.child))
          }
        }
        if (res[0].grade=="0") {
           this.treeData = JSON.parse(JSON.stringify(res));
        } else {
          findIn(res)
        }
        this.handleTreeDate(this.treeData);
        this.handleDefaultSelect()
      });
    },
    handleDefaultSelect(){
      let selectNode = {}
      const findFirst = (obj)=>{
        if (obj.grade=='1') {
          selectNode=obj
        } else {
          findFirst(obj.child[0])
        }
      }
      if (this.fileInfo==null){
        return
      } else {
        findFirst(this.fileInfo)
        this.formAdd.caseType=[selectNode.parentId,selectNode.id]
      }
    },
    handleTreeDate(obj) {
      obj.map(item => {
        if (item.child.length == 0) {
          delete item.child;
          if (item.grade !== '1') {
            item.disabled = true;
          }
        } else {
          this.handleTreeDate(item.child);
        }
      });
    },
    handleFormatError(file) { // 文件上传失败
      this.$Notice.warning({
        title: '模板格式不正确',
        desc: '模板 ' + file.name + ' 格式不正确，请上传正确模板。'
      });
    },

    modalCancel() { // 取消
      this.handleFileData()
      let ids = []
      this.fileData.forEach(i=>{
        ids.push(i.id)
      })
      if (ids.length>0) {
        let params = {ids:ids.join(',')}
        this.removeFileReq(params)
      }
      this.$emit('update:show', false);
    },
    handleFileData() {
      this.fileData = []
      let fileList = this.$refs.upload.fileList.filter(item=>{
        return this.removeList.indexOf(item)==-1
      })
      let successLits = fileList.filter(item => { return item.response.code == 200 })
      successLits.forEach(i => {
        this.fileData.push(i.response.data)
      })
    },
    uploadModel() { // 确定
    this.$refs.formAdd.validate((valid)=>{
      if(valid){
        this.handleFileData()
        if(this.fileData.length>0){
          api.api('post', api.loginUrl2 + '/files/save', {
              jsonObject: JSON.stringify(this.fileData),
              bankname:this.findBankName(this.formAdd.DataSource),
              bankshortname:this.findShortBankName(this.formAdd.DataSource),
            }).then(res => {
              this.isLoading = false;
              this.$message.info(res);
              this.$emit('update:show', false);
              this.$emit('refresh', this.findCase('id'));
            }).catch(error => {
              this.isLoading = false;
              this.$emit('update:show', false);
            });
        } else {
          this.$message.warning('请选择要上传的文件！')
        }
      }
    })

    },
    fileMoulds() { // 模版下拉框
      api.api('post', api.loginUrl2 + '/filesType/queryList').then(res => {
        this.Mould = res
      });
    },
    clearFiles() {
      this.$refs.upload.clearFiles();
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
.file-list-ct {
  padding: 0 20px;
  .el-alert {
    margin-top: 6px;
  }
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
