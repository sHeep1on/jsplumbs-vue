<template>
<div class="add-page-select"  v-loading="loading">
  <div class='flew-detail-ct' v-chinaOlyScrollBar :style="{height: controlHei?'calc(100% - 90px)':'calc(100%)'}">
    <div class="flow-detail-wr" >
      <el-card class="box-card" v-for="(item,index) in flowList" :key="index">
        <div slot="header" class="clearfix">
          <span style='float: left;padding: 3px 0'>{{item.txt1}}</span>
          <span v-show="!controlHei" style="float: right; padding: 3px 0" type="text" v-html="item.txt3"></span>
        </div>
        <div class="text item" v-if="!controlHei">
          <el-tooltip class="item" effect="dark" placement="top" >
            <div slot="content" >
              <template v-if="item.txt4">
              <span v-html="(item.txt4.indexOf(';')==-1)?item.txt4:item.txt4.replace(';','</br>')"></span>
              </template>
            </div>
            <p class="time" v-html='item.txt2'></p>
          </el-tooltip>
          <p class="content" v-html="item.txt5"></p>
          <p class="content" v-html="item.txt6" :title="item.txt6"></p>
           <p class="content" v-html="item.txt7" :title="item.txt7"></p>
        </div>
        <div class="text item" v-else>
          <p class="content" v-html="item.txt2"></p>
           <p class="content" v-html="item.txt3"></p>
        </div>
      </el-card>
    </div>
  </div>
    <Page :current.sync="basePage.pageNum" :page-size.sync="basePage.pageSize"
    :total="total" show-total size="small" @on-change="pagechange" class="pagefy"></Page>
   </div>
</template>
<script>
import api from "@/fetch/api";
import { storage, cloneObj } from "@/libs/common/common.js";
import PerfectScrollbar from 'perfect-scrollbar';
import "perfect-scrollbar/css/perfect-scrollbar.css";
export default {
  data() {
    return {
      flowList: [],
      flowDetail: null,
      scrollEl: null,
      pageNum: 1,
      total: 0,
      isloading: false,
      loading: false,
      basePage:{
        pageNum:1,
        pageSize:10
      },
      total:0,
    };
  },
  props: {
    NodeData: {
      type: Object
    },
    controlHei:{
      type:Boolean,
      default:false
    }
  },
  watch: {
    // NodeData(val) {
    //   console.log(val);

    //   this.resetData()
    //   this.pagechange()
    // },
    controlHei(val){
      this.$nextTick(()=>{
        this.resetData()
        this.pagechange()
      })
    }
  },
  mounted() {
  },
  inject: {
    infoCountCom: {
      default: ""
    }
  },
  methods: {
    pagechange(){
      let res = this.infoCountCom.privateOption.find(i=>i.name==this.infoCountCom.curPrivateTab)
      this.controlHei&&res.hasData?this.initRes(res.title):this.initRes()
    },
    resetData() {
      this.flowList = []
       this.basePage={
        pageNum:1,
        pageSize:10
      }
      this.total=0
    },
    initRes(val) {
      if (this.NodeData==null) {
        return
      }
      let jsonData = {
        fromVId: this.NodeData._refId,
        caseId: this.NodeData.fileOrCaseId||'',
        filter:this.infoCountCom.filterDate
      }
      this.infoCountCom.searchData!==""&&(params=Object.assign(jsonData,{name: this.infoCountCom.searchData}))
      let params = Object.assign(this.basePage,{jsonData: JSON.stringify(jsonData)})
       val&&(params=Object.assign(params,{bank: val}))
       this.infoCountCom.loading = true

      let url = this.controlHei?'/canvasTarget/privateFlowDetail':"/canvasTarget/flowDetail"
      api.api("post", api.loginUrl2 + url, params)
        .then(res => {
          if (this.controlHei) {
            this.$emit('updatedprivate',res,val)
            if (val) {
              this.flowList = res[val]
              this.total = res.label.find(i=>i.value==val).total
            }
          } else {
            this.flowList = res["全部"]
            this.total = res.total
            if (this.flowList.length == 0) {
              this.$emit('nullData')
              this.resetData()
            }
          }
           this.isloading = false
            this.infoCountCom.loading = false

        }).catch(()=>{
            this.isloading = false
           this.infoCountCom.loading = false
          this.$emit('nullData')
          this.resetData()
        })
    }
  }
};
</script>
<style lang="less">
.add-page-select {
  height: calc(~'100% - 100px');
}
.flew-detail-ct {
  position: relative;
      width: 100%;
    margin: 0 auto;
    //  height: calc(~'100% - 90px');
  .flow-detail-wr {
    width: 90%;
    margin: 0 auto;
    padding-bottom: 10px;
    height: 100%;
    .box-card {
      margin-bottom: 15px;
      .el-card__header {
        padding: 8px 20px;
      }
      .el-card__body {
        padding: 8px 20px;
      }
    }
  }
  .loading-ct {
    width: 100%;
    position: relative;
  }
  width: 100%;
  margin: 0 auto;
  position: relative;
  height: 100%;
  // overflow: hidden;
  .ivu-timeline {
    top: 10px;
  }
}
</style>

