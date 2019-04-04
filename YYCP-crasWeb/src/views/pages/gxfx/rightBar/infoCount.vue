<template>
  <li v-show="isShow" class="xxtjli info-count-wr"  v-loading="loading">
    <a href="#" class="export-flow" :class="[isExport?'forbid-export':'']" @click="handleExport"><img src="../../../../static/page/images/icon4_20_export.png"></a>
    <el-tabs v-model="activeName" class="info-count-ct">
      <el-tab-pane label="信息统计" name="first">
        <div class="xxtj">
          <div class="xq-personal">
            <Input class="searchk" @blur="inputBlur" v-model="searchval3" icon="ios-search" placeholder="请输入搜索对象"></Input>
          </div>
          <div class="tjgx">
            <Menu :open-names="openList" @on-select="selectxian" ref="leftMenu" v-scrollBar>
              <template v-for="(item,index) in graphMapLable">
                <Submenu :name='index'>
                  <template slot="title">
                    {{item.name}}
                    <span class="erjtime">({{item.count}})</span>
                  </template>
                  <MenuItem class="zdytree" v-for="(item2,index2) in item.arr" :key="index2" :name="item2.node._refId" v-show="!isInputChange || handleSearch(item2,item)">
                  <div>
                    <span class="gximg"><img class="gximg" :src="item2.node.oldImage" /></span>
                    <span class="gxperson">{{item2.node.name}}</span>
                  </div>
                  <span class="erjtime" v-show="item2.count!==undefined">({{item2.count}})</span>
                  </MenuItem>
                </Submenu>
              </template>
            </Menu>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane name="third" class="second-label" v-if="isFlowData">
        <span slot="label"> 资金流水</span>
        <div class="time-filter-ct">
          <DatePicker v-if="isShowDate" type="daterange"  v-show="orientValue=='0'" @on-change='handleDate' :options="options2"
           placement="bottom-end" placeholder="请选择日期范围"></DatePicker>
           <el-input size="small" v-show="orientValue!=='0'" placeholder="请输入您要搜索的姓名" v-model="searchData" @keyup.enter.native="handleSearchName" style="width:210px;">
             <i slot="suffix" @click="handleSearchName" class="el-input__icon el-icon-search date-search-icon"></i>
           </el-input>
            <el-select @change="HandleprivateFlowDetail" v-model="orientValue" placeholder="请选择" size="small" >
              <el-option  v-for="item in orientePerson"  :key="item.key"  :label="item.label"  :value="item.key"> </el-option>
            </el-select>
        </div>
        <div class="private-fund-ct" v-show="orientValue!=='0'">
          <el-tabs type="border-card" v-model="curPrivateTab" class="private-fund-card" @tab-click="tabChange">
          <el-tab-pane  v-for="(item,index) in privateOption" :key='index' :label="item.title" :name="item.name">{{item.content}}</el-tab-pane>
        </el-tabs>
        </div>
        <account-deal @updatedprivate='updatedprivate' ref="accountDeal" :controlHei="orientValue!=='0'" :NodeData='showFlowData' @nullData='handleNullFlowData'></account-deal>
      </el-tab-pane>
      <el-tab-pane name="second" v-if="isShowRelaDetail" class="second-label">
        <span slot="label"> 信息明细<i class="el-icon-close" @click="handleReHighLight"></i>
        </span>
        <rela-detail class="info-count-detail" :isShow="true" :relaType="relaType" :relaEdge="relaEdge" @handleTabDetail="handleRelaDetail" :isPageEmit='false' @TabnullData="nullData"></rela-detail>
      </el-tab-pane>
    </el-tabs>
  </li>

</template>

<script>
import api from "@/fetch/api";
import relaDetail from "./relaDetail";
import accountDeal from './accountDeal'
import { storage, cloneObj } from '@/libs/common/common.js';
import {Queue} from './lib'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    graphMap: {
      type: Map,
      default: []
    },
    dataRefId: {
      type: String
    },
    NodeData: {
      type: Object
    }
  },
  provide() {
    return {
      infoCountCom: this
    };
  },
  components: {
    relaDetail,
    accountDeal
  },
  data() {
    return {
      searchData:'',
      // isForbid:true,
      isExport:false,
      isInputChange: true,
      searchval3: "",
      submenu: [],
      openItem: ['0'],
      active: "",
      isSubShow: [],
      imgUrl: null,
      graphMapLable: [],
      isShowRelaDetail: false,
      filterDate:[],
      relaEdge: {},
      relaType: null,
      isFirst: true,
      activeName: "first",
      oldName: [],
      isHasDate: false,
      openList: [],
      isFlowData: true,
      showFlowData: null,
      timeboltrue:false,
      loading:false,
      orientePerson:[{label:'全部',key:'0'},{label:'对私',key:'1'}],
      privateOption:[{title: '净收',name: '1',content:'',hasData:false,total:0},
      {title: '平账',name: '2',content:'',hasData:false,total:0},{title: '净支',name: '3',content:'',hasData:false,total:0}],
      curPrivateTab:'1',
      orientValue:'0',
      isShowDate:false,
      options2:{
        shortcuts: [
          {
            text: "一星期",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "一个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "三个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      },
      exportList:[],
      quneeIndex:0,
      quenuFn:null,
      relaTypeTo:null,
      exportUrl:null,
      beginTime:'',
      endTime:''
    };
  },
  watch: {
    dataRefId() {
      this.disposeData();
      this.isFlowData = true
    },
    NodeData(val) {
      this.isFlowData = true
      this.isShowDate=false
      this.$nextTick(() => {
        this.showFlowData = val
        this.orientValue='0'
        this.curPrivateTab = '1'
        this.isShowDate=true
        this.handleDate(['',''])
      })
    },
    graphMap() {
      this.disposeData();
    },
    isFirst(val) {
      val ? (this.activeName = "first") : (this.activeName = "second");
    },
    // activeName(val){
    //   this.isForbid = val!=='first'?false:true
    // },
    searchval3(val) {
      if (val == '') {
        this.graphMapLable.forEach(item => {
          item.count = item.arr.length
        })
        return
      }
      if (this.openList.lenght == this.graphMapLable) {
        this.updateOpen()
      } else {
        this.graphMapLable.forEach((c, i) => this.openList.push(i))
        this.graphMapLable.forEach(item => {
          item.count = (item.arr.filter(i => (i.node.name).indexOf(val) != -1)).length
        })
        this.updateOpen()
      }
    }
  },
  methods: {
    handleSearchName(){
      // if (this.searchData!=="") {
        this.handleDate(["",""])
      // }
    },
    updatedprivate(res,val){
      this.privateOption.map(item=>{
        let ress = res.label.find(i=>item.title==i.key)
        if (ress==undefined||ress.total==0) {
          item.content = `当前${item.title}，没有数据，请重新选择！`
          item.hasData=false
          item.total=0
        } else {
          item.content = `人数：${ress.peoples}，金额：${ress.money}`
          item.hasData=true
          item.total=ress.total
        }
      })
      if (!val) {
        let activePane = this.privateOption.find(i=>this.curPrivateTab==i.name)
        if (activePane.hasData) {
          this.$refs.accountDeal.flowList=res[activePane.title]
          this.$refs.accountDeal.total=activePane.total
        } else {
          this.$refs.accountDeal.flowList=[]
          this.$refs.accountDeal.total=0
        }
      }

      // }
    },
    tabChange(val){
      let res = this.privateOption.find(i=>this.curPrivateTab==i.name)
      console.log(this.$refs.accountDeal.controlHei);

      if (res.hasData) {
        this.$refs.accountDeal.initRes(res.title)
      } else {
        this.$refs.accountDeal.flowList=[]
        this.$refs.accountDeal.total=0
      }
    },
    HandleprivateFlowDetail(val){
      this.isShowDate=false
      this.$nextTick(() => {
        this.isShowDate=true
        this.handleDateformat(['',''])
      })
    },
    handleSearch(item2, item) {
      return (item2.node.name).indexOf(this.searchval3) != -1
    },
    handleDate(val){
     this.handleDateformat(val)
     this.$nextTick(()=>{
      this.$refs.accountDeal.resetData()
      this.$refs.accountDeal.pagechange()
     })
    },
    handleDateformat(val){
       let date = []
      if (val[0]==''&&val[1]=='') {
        this.filterDate =date
        this.beginTime=''
        this.endTime=''
      } else {
        date.push(Date.parse(new Date(`${val[0]} 00:00:00`)))
        date.push(Date.parse(new Date(`${val[1]} 23:59:59`)))
        this.filterDate =date
        this.beginTime=this.handleTimestamp(val[0])
        this.endTime=this.handleTimestamp(val[1])
      }
    },
    handleTimestamp(info) {
      const format = '{y}{m}{d}';
      const formatObj = {
        y: new Date(info).getFullYear(),
        m: (new Date(info).getMonth()) + 1,
        d: (new Date(info).getDate()),
      };
      const time_str = format.replace(/{(y|m|d)+}/g, (result, key) => {
        let value = formatObj[key];
        if (value.toString().length == 1) {
          value = `0${value.toString()}`;
        }
        return value;
      });
      return time_str;
    },
    disposeData() {
      this.isFlowData = true
      let edges = [];
      this.graphMapLable = new Map();
      this.NodeData.forEachEdge(item => {
        // if(!item.infoCount) {return}
        var keyString = (item.infoCount || item.name).trim().replace(/\s+/g, ",");
        var keyArr = keyString.split(",");
        var otheN = item.to._refId !== this.dataRefId ? item.to : item.from;
        keyArr.forEach(t => {
          let key = t.split(":")[0] || t.split(";")[0];
          let num = t.split(":")[1] || t.split(";")[1];
          if (num == undefined) {
            num = key
            key = '转账交易'
          }
          this.graphMapLable.set(key, [{ name: key, count: num, node: otheN }].concat(this.graphMapLable.get(key) || []))
        });
      });
      this.graphMapLable = [...this.graphMapLable.values()];
      var res = [];
      this.graphMapLable.forEach(item => {
        item.sort((a, b) => parseInt(b.count) - parseInt(a.count))
        res.push({ name: item[0].name, count: item.length, arr: item });
      });
      res.sort((a, b) => parseInt(b.count) - parseInt(a.count))
      this.graphMapLable = res
      this.updateOpen()
    },
    updateOpen() {
      this.$nextTick(() => {
        this.$refs.leftMenu.updateOpened();
      })
    },
    inputBlur() {
      this.isInputChange = false;
    },
    handleExport(){
      // if (this.isForbid) return
      if (this.isExport) {
        this.$notify.warning('正在导出，不要心急！');
        return
      }
      let parmas ={
        fileName:this.NodeData.name,
        caseId: this.$route.query.caseId||'',
      }


      // if (this.quenuFn==null) {
      //   this.quenuFn = new Queue()
      // }
        // console.log(this.relaEdge);
        if (this.activeName=='third') {
          if (this.orientValue==1) {
            let res = this.privateOption.find(i=>i.name==this.curPrivateTab)
            res.hasData?parmas=Object.assign(parmas,{payType:res.title}):(this.$notify.warning('当前账号没有可以导出的数据！'))
            if(!res.hasData)return
            this.exportUrl = '/canvasTarget/privateDataExcel'
          } else{
             parmas=Object.assign(parmas,{beginTime:this.beginTime,endTime:this.endTime})
            this.exportUrl = '/canvasTarget/excel'
          }
        } else if (this.activeName=='second'){
          parmas=Object.assign(parmas,{ rivalName:this.NodeData.name==this.relaEdge.to.name?this.relaEdge.from.name:this.relaEdge.to.name})
          this.exportUrl = '/canvasTarget/excel'
        } else {
          parmas=Object.assign(parmas,{ infoStats:true})
          this.exportUrl = '/canvasTarget/infoStatsExcel'
        }
        this.request(parmas)
      // this.quenuFn.add(this.request(parmas))
      // if (this.quenuFn.getStatus) return
      // this.quenuFn.run()
    },
    request(parmas){
        this.isExport = true
        api.api('post',api.loginUrl2+this.exportUrl,parmas).then(res=>{
          let aLink = document.createElement('a');
            aLink.style.display = 'none';
            aLink.href = api.uploads + res;
            document.body.appendChild(aLink);
            aLink.click();
            URL.revokeObjectURL(aLink.href); // 释放URL 对象
            document.body.removeChild(aLink);
            this.isExport = false
            // next()
        }).catch(err=>{this.isExport = false})
      // })

    },
    selectxian(name) {
      if (this.handleRepe(name)) {
        let a = this.graphMap.get(name);
        this.$emit("updateRoleInfo", a);
        let b = this.graphMap.get(this.dataRefId);
        let c = a.getEdgeBundle(b).edges[0];
        graph.highlight([a, b, c]);
        let fromRef = c.fromVId || c.from._refId;
        let toRef = c.toVId || c.to._refId;
        this.isShowRelaDetail = true;

        this.relaType = JSON.stringify({
          fromVId: fromRef,
          toVId: toRef,
          fromFileOrCaseId:c.from.fileOrCaseId,
          toFileOrCaseId:c.to.fileOrCaseId
        });
        this.relaEdge = c;
      } else {
        this.handleReHighLight();
      }
    },
    handleRepe(name) {
      if (this.oldName.length == 0) {
        this.oldName.push(name);
        return true;
      } else if (this.oldName.indexOf(name) !== -1 && !this.isHasDate) {
        this.isHasDate = !this.isHasDate
        return false;
      } else {
        this.oldName.push(name);
        this.oldName.shift();
        return true;
      }
    },
    handleRelaDetail() {
      this.isShowRelaDetail = true;
      this.$nextTick(() => {
        this.isFirst = false;
        this.activeName = 'second'
        this.isHasDate = true;
      })

    },
    handleNullFlowData() {
      //this.isFlowData = false
      let res = {label:[]}
      this.updatedprivate(res)
      // this.$nextTick(() => {
      //   this.activeName = "first"
      // })
    },
    nullData() {
      this.isShowRelaDetail = false;
      this.$nextTick(() => {
        this.isFirst = true;
        this.isHasDate = false;
      })
    },
    handleReHighLight() {
      this.isShowRelaDetail = false;
      var aa = graph._l1Model._k2;
      this.$nextTick(() => {
        this.isFirst = true;
      })
      aa.forEach(item => {
        item.setStyle(Q.Styles.ALPHA, 1);
      });
    }
  }
};
</script>
<style lang="less">
.time-filter-ct {
  width: 90%;
  margin: 0 auto;
  padding-bottom: 15px;
  display: flex;
  justify-content: space-between;
  .date-search-icon {
    cursor: pointer;
  }
  .ivu-date-picker {
    width: 70%;
  }
  .el-select {
    width: 25%;
    // background: #409eff;
    color: #fff;
    .el-input__inner {
      background: #409eff;
      border-color: #409eff;
      color: #fff;
    }
    .el-select__caret {
      color: #fff;
    }
  }
  .ivu-select-dropdown {
    z-index: 99999999999999;
  }
}
.private-fund-ct {
  width: 90%;
  margin: 0 auto;
  margin-bottom: 10px;
  .private-fund-card {
    .el-tabs__nav {
      width: 100%;
      margin-left: 0px;
      display: flex;
      justify-content: space-between;
      .el-tabs__item {
        width: 33.2%;
        text-align: center;
      }
    }
    .el-tabs__content {
      padding-bottom: 10px;
    }
  }

}
.export-flow {
  position:absolute;
  right: 7px;
  top: 7px;
  z-index: 2;
  &.forbid-export{
    cursor: not-allowed;
    text-decoration: none;
    color: #c5c8ce;
    opacity: .5;
  }
}
.info-count-ct {
  height: 100%;
  #tab-second {
    span {
      i {
        position: absolute;
        top: 13px;
        right: -23px;
        color: #303133;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
  .el-tabs__nav {
    margin-left: 23px;
  }
  .el-tabs__content {
    height: calc(~"100% - 55px");
    overflow: visible;
    .el-tab-pane {
      height: 100%;
    }
  }
}
.xxtj {
  height: 100%;
  .tjgx {
    height: calc(~"100% - 55px");
    .ivu-menu {
      height: 100%;
    }
  }
}
</style>

