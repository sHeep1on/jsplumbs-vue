<template>
  <div>
    <Modal v-model="isShow" width="520" :title="title"  :mask-closable="false" @on-cancel="modalCancel"
     v-chinaOlyloading.fullscreen="isLoading">
      <div slot="footer" class="font-size-0">
        <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
        <Button type="primary" class="sureBtn" @click="calcCase">确定</Button>
      </div>
      <div>
        <el-form ref="formCalc" :model="formCalc" class="upload-file-ct" :inline="true" :rules="formCalcrules">
          <div class="single-amount-wr">
            <span class="single-amount-title">单笔金额：</span>
            <div>
              <el-form-item label="" prop='companyNum'>
                <el-input v-model="formCalc.companyNum" size='small' style="width:270px">
                    <span slot="prepend" class="appent-title">企业：</span>
                      <span slot="append">万</span>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="personNum">
                 <el-input v-model="formCalc.personNum" size='small' style="width:270px">
                   <span slot="prepend"  class="appent-title">个人：</span>
                    <span slot="append">万</span>
                </el-input>
              </el-form-item>
            </div>
          </div>
           <el-form-item label="收支匹配时间：" prop="inexTime"  class="amount-float-wr">
               <el-input v-model="formCalc.inexTime" size='small' style="width:270px;">
                 <span slot="append">天</span>
                </el-input>
            </el-form-item>
            <el-form-item label="金额浮动：" prop="amountFloat" class="amount-float-wr">
               <el-input v-model="formCalc.amountFloat" size='small' style="width:270px;">
                   <span slot="append">%</span>
                </el-input>
            </el-form-item>
        </el-form>
      </div>
    </Modal>
  </div>
</template>
<script>
import api from '@/fetch/api'
import {isNumber,isAmount} from '@/libs/common/check.js'
export default {
  data() {
    var checkInexTime = (rule, value, callback) => {
        if (parseInt(value)>10||parseInt(value)<1) {
          callback(new Error('收支匹配时间为1-10之间的整数,'));
        } else {
           callback();
        }
      }
      var checkAmountFloat = (rule, value, callback) => {
        if (parseInt(value)>30||parseInt(value)<0) {
          callback(new Error('金额浮动为0-30之间的整数,'));
        } else {
           callback();
        }

      }
    return {
      isLoading:false,
      title:'算法配置',
      isShow:false,
      caseInfo:{},
      formCalc:{
        companyNum:100,
        personNum:20,
        inexTime:3,
        amountFloat:5
      },
      formCalcrules:{
        companyNum:[
          { required: true,message: '请输入企业金额', trigger: 'change' },
          { validator: isAmount, trigger: 'change' }
        ],
        personNum:[
          { required: true,message: '请输入个人金额', trigger: 'change' },
          { validator: isAmount, trigger: 'change' }
        ],
        inexTime:[
          { required: true, message: '请输入收支匹配时间', trigger: 'change'},
          { validator: isNumber, trigger: 'change' },
           { validator: checkInexTime, trigger: 'change' }
        ],
        amountFloat:[
          { required: true,message: '请输入金额浮动', trigger: 'change'},
          { validator: isNumber, trigger: 'change' },
          { validator: checkAmountFloat, trigger: 'change' }
        ]
      },
      inexTime:[],
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
    }
  },
   props: {

  },
  methods: {
    modalCancel(){
      this.isShow=false
    },
    handleTimeNormal(val){
      if (val.length==0||val[0]=='') {
        return ''
      } else {
        return `${Date.parse(new Date(val[0]))}-${Date.parse(new Date(val[1]))}`
      }
    },
    resetForm(){
      this.formCalc={
        companyNum:100,
        personNum:20,
        inexTime:3,
        amountFloat:5
      }
    },
    calcCase(){
         // if (info.useStatus == '0') {
        let info =this.caseInfo
        let time = this.handleTimestamp(info);
        this.$refs['formCalc'].validate((valid) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.formCalc))
            params.companyNum = `${parseInt(params.companyNum)*10000}`
            params.personNum = `${parseInt(params.personNum)*10000}`
            this.isLoading = true
            this.handleRequest({
              url: `${api.calcUrl}/P2P/all/${info.tenantId}/${time}/`,
              data:params
            }).then(res => {
              if (res.stat == '000') {
                this.$message.success(res.msg);
                this.$emit('handleUpdateStatus',info.id, '1', time)
                // this.handleUpdateStatus(info.id, '1', time);
              } else {
                this.$message.success(res.msg);
                this.$emit('handleUpdateStatus',info.id, '2', time, res.msg)
              }
              this.isLoading = false
              this.isShow=false
            }).catch(error => {
              this.$emit('handleUpdateStatus',info.id, '2', time)
              this.isLoading = false
              this.isShow=false
            });
          } else {
            return false;
          }
        });

    },
    handleRequest(option) {
      const { url,data } = option;
      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        let params = []
       for (var key in data) {
         params.push(`${key}=${data[key]}`)
       }
        params = params.join('&')
        xhr.open('get', `${url}?${params}`, true);
        xhr.send();
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(xhr);
          }
        };
        xhr.onerror = (error) => {
          reject(error);
        };
      });
    },
    handleTimestamp(info) {
      const format = '{y}{m}{d}{h}{i}{s}';
      const formatObj = {
        y: new Date().getFullYear(),
        m: (new Date().getMonth()) + 1,
        d: (new Date().getDate()),
        h: new Date().getHours(),
        i: (new Date().getMinutes()),
        s: (new Date().getSeconds())
      };
      const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        if (value.toString().length == 1) {
          value = `0${value.toString()}`;
        }
        return value;
      });
      return time_str;
    }
  }
}
</script>
<style lang="less">
  .single-amount-wr {
    display: flex;
    justify-content: flex-start;
    .single-amount-title {
      width: 215px;
      padding: 0 12px 0 0;
      font-size: 14px;
      color: #606266;
      line-height: 40px;
      text-align: right;
      &::before{
        content: "*";
        color: #f56c6c;
        margin-right: 4px;
      }
    }
    .el-input__inner {
      padding-top:0px!important;
    }
    .el-input-group__prepend{
      background: #fff;
      padding: 0 10px;
      color: #606266;
    }
  }
   .el-input-group__append {
      background: #fff;
    }
  .amount-float-wr {
    display: flex!important;

    .el-form-item__label {
      width: 130px;
    }
    .el-form-item__content {
      // display: flex;
    }
  }
</style>
