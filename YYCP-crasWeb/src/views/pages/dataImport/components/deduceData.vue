<template>
  <div>
    <Modal v-model="isShow" width="550" :title="title" :mask-closable="false" @on-cancel="modalCancel" v-chinaOlyloading.fullscreen="isLoading">
      <div slot="footer" class="font-size-0">
        <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
        <Button type="primary" class="sureBtn" @click="uploadModel">确定</Button>
      </div>
      <div>
        <el-form ref="formAdd" :model="formAdd" :rules="ruleAdd" label-width="115px" class="deduce-file-ct" :inline="true">
          <!-- <el-form-item label="交易日期：" prop="dealTime">
             <DatePicker type="daterange"   v-model="dealTime" :options="options2" placement="bottom-end" placeholder="请选择日期范围" style="width:309px"></DatePicker>
          </el-form-item> -->
          <el-form-item label="交易频次：" class="deal-range-ct">
            <el-col :span="11">
              <el-form-item prop="dealRangeMin">
                <el-input type='Number' v-model.trim="formAdd.dealRangeMin" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="11">
              <el-form-item prop="dealRangeMax">
                <el-input type='Number' v-model.trim="formAdd.dealRangeMax" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="交易金额：" class="deal-range-ct">
            <el-col :span="10">
              <el-form-item prop="dealAmountMin">
                <el-input type='Number' v-model.trim="formAdd.dealAmountMin" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">至</el-col>
            <el-col :span="10">
              <el-form-item prop="dealAmountMax">
                <el-input type='Number' v-model.trim="formAdd.dealAmountMax" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2">万元</el-col>
          </el-form-item>
        </el-form>
      </div>
    </Modal>
  </div>
</template>

<script>
import api from '@/fetch/api';
import { Loading } from 'element-ui';
import { validateCaseId,isAmount,isNumber } from '@/libs/common/check.js';
import {storage} from '@/libs/common/common.js'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    // caseInfo: {
    //   type: Object,
    //   default: {}
    // }
  },
  data() {
    return {
      isShow: this.show,
      Mould: [],
      fileData: [],
      formAdd: {
        // dealTime: '',
        dealRangeMin: '',
        dealRangeMax: '',
        dealAmountMin:'',
        dealAmountMax:''
      },
      dealTime:[],
      caseInfo:null,
      ruleAdd: {
        dealRangeMin: [
          { validator: isNumber, trigger: 'change' }
        ],
        dealRangeMax: [
          { validator: isNumber, trigger: 'change' }
        ],
        dealAmountMin: [
          { validator: isAmount, trigger: 'change' }
        ],
        dealAmountMax: [
          { validator: isAmount, trigger: 'change' }
        ]
      },
      isLoading: false,
      roleInfo: '',
      treeData: [],
      options2:{
        shortcuts: [
          {
            text: "一星期",
            value() { const end = new Date(); const start = new Date(); start.setTime(start.getTime() - 3600 * 1000 * 24 * 7) ;return [start, end];
            }
          },
          {
            text: "一个月",
            value() {const end = new Date(); const start = new Date(); start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);return [start, end];
            }
          },
          {
            text: "三个月",
            value() { const end = new Date();const start = new Date() ;start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);return [start, end] }
          }
        ]
      },
    };
  },
  watch: {
    show() {
      this.isShow = this.show;
    }
  },
  computed: {
    title() {
      return '推演条件';
    },
    // isDisable() {
    //   return this.caseInfo ? true : false;
    // }
  },
  created() {
    // if (this.caseInfo) {
    //   this.formAdd.tenantId = this.caseInfo.caseId;
    //   this.formAdd.name = this.caseInfo.title;
    //   this.formAdd.id = this.caseInfo.id;
    // }
  },
  mounted() { },
  methods: {
    modalCancel() {
      // 取消
      this.$emit('update:show', false);
    },
    handleTimeNormal(val){
      if (val.length==0||val[0]=='') {
        return ''
      } else {
        return `${Date.parse(new Date(val[0]))}-${Date.parse(new Date(val[1]))}`
      }
    },
    uploadModel() {
      this.$refs['formAdd'].validate((valid) => {
          if (valid) {
            // if(Object.values(this.formAdd).every(key=>key=='')){
            //   this.$message.warning('请至少选择一项作为当前案件的筛选条件！')
            // } else {
              this.isLoading=true
              let parmas ={}
              parmas.jsonData=JSON.stringify({
                propList:[{
                  propId:'CFB2DAE8369103D6582AEA96A6F6B7FF',
                  propType:'between',
                  values:(this.formAdd.dealRangeMin==''&&this.formAdd.dealRangeMax=='')?[]:[this.formAdd.dealRangeMin,this.formAdd.dealRangeMax]
                },{
                  propId:'D44C5A64006EE33594715215A527BAE8',
                  propType:'between',
                  values:(this.formAdd.dealAmountMin==''&&this.formAdd.dealAmountMax=='')?[]:
                  [this.formAdd.dealAmountMin==''?'':`${parseInt(this.formAdd.dealAmountMin)*10000}`,this.formAdd.dealAmountMax==''?'':`${parseInt(this.formAdd.dealAmountMax)*10000}`]
                }],
                caseId:this.caseInfo.caseId
              })
              //storage.set('CaseDedu',parmas,1000*60*60*12)
              api.api('post', api.loginUrl2 + '/file/entireCaseDedu', parmas).then((res) => {
                this.$store.dispatch("setCaseFile", res);
                let storages = {}
                  storages[this.caseInfo.caseId]=res
                storage.set('caseFile', JSON.stringify(storages),2*1000*60*60)
                this.$router.push({
                  path: "/gxfx/gxfxManager",
                  query: { caseFile:this.caseInfo.caseId,caseDedu:parmas.jsonData,caseId:this.caseInfo.caseId }
                })
                this.modalCancel()
                this.isLoading=false
              }).catch(error=>{
                this.modalCancel()
                this.isLoading=false
              })
            }
          // }
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
.deduce-file-ct {
  .el-form-item {
    width: 100%;
    &.deal-range-ct>.el-form-item__content{
      width: calc(~"100% - 150px");
    }
    .el-form-item__content {
      // width: calc(~"100% - 150px");
      .el-col-2 {
        text-align: center;
      }
    }
    .el-input__inner {
      padding: 0px 0px 0px 15px!important;
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
