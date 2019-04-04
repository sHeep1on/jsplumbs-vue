<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>
<template>
  <div class="searchbox">
    <div v-clickOutSide='handleClick'  v-chinaOlyloading.fullscreen="isLoading">
      <div class="home-main">
        <p>
          <Input class="searchid" v-model="searchvalue" @on-focus="isShowHistory=true" @keyup.enter.native="CaseCollision" placeholder="请输入手机号码/身份证号码/公司"></Input>
          <span @click="CaseCollision">搜索</span>
        </p>
      </div>
      <transition name='fade'>
        <div class="history-wr" v-if="isShowHistory">
          <p class="none-history" v-show="historyList.length==0">您现在暂无搜索记录</p>
          <ul class="history-ct" v-chinaOlyScrollBar>
            <li v-for="(item,index) in historyList">
              <span :title='item.content' @click="handleHistorySearch(item.content)">{{item.content}}</span>
              <span @click="handleDeleHis([item])">删除</span>
            </li>
          </ul>
          <p class="inter-history"><span @click="handleDeleHis(historyList)">删除历史</span><span @click="isShowHistory=false">关闭历史</span></p>
        </div>
      </transition>
      <transition name='fade'>
        <div class="history-wr" v-if="isShowCompany">
          <p class="none-history" v-show="companyList.length==0">您现在暂无搜索记录</p>
          <ul class="history-ct company-ct" v-chinaOlyScrollBar>
            <li v-for="(item,index) in companyList">
              <span @click="handleHistorySearch(item)" :title='item'>{{item}}</span>
            </li>
          </ul>
        </div>
      </transition>
    </div>
    <div class="">
      <Modal v-model="isShowCase" width="520" title="案件选择" :mask-closable="false" @on-cancel="isShowCase=false">
        <div slot="footer" class="font-size-0">
          <Button type="default" class="cancelBtn" @click="isShowCase=false">取消</Button>
          <Button type="primary" class="sureBtn" @click="searchID">确定</Button>
        </div>
        <div class="case-list-ct" v-chinaOlyScrollBar>
          <el-radio-group v-model="caseIdRadio">
            <template v-for="item in caseList">
              <el-radio :label="item.id">{{item.name}}</el-radio>
            </template>
          </el-radio-group>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import api from "@/fetch/api";
export default {
  name: "home",
  components: {},
  data() {
    return {
      searchvalue: "",
      historyList: [],
      isShowHistory: false,
      isShowCompany: false,
      companyList: [],
      caseList:[],
      caseIdRadio:'',
      isShowCase:false,
      isLoading:false
    };
  },
  computed: {
  },
  created() {
    // console.log('jlkjljkkj');

    // this.handleHistory()
  },
  activated() {
    this.handleHistory()
  },
  watch: {
    searchvalue(val) {
      if (val == '') {
        this.isShowHistory = true;
        this.isShowCompany = false;
        this.companyList = []
        this.handleHistory()
      } else {
        let chinaReg = /[\u4e00-\u9fa5]/
        if (chinaReg.test(val)) {
          api.api('post', api.loginUrl2 + '/canvasTarget/company', { name: val }).then(res => {
            this.$nextTick(() => {
              if (this.searchvalue == '') {
                this.isShowHistory = true;
                this.isShowCompany = false;
                this.companyList = []
              } else {
                this.isShowHistory = false;
                this.isShowCompany = true;
                this.companyList = res
              }
            })
          })
        }
      }

    }
  },
  directives: {
    clickOutSide: {
      bind(el, binding, vnode) {
        el.handler = e => {
          if (el && !el.contains(e.target)) {
            vnode.context[binding.expression]();
          }
        };
        document.addEventListener("click", el.handler, true);
      },
      unbind(el) {
        document.removeEventListener("click", el.handler, true);
        el.handler = null;
      }
    }
  },
  methods: {
    handleClick() {
      this.isShowHistory = false
      this.isShowCompany = false;
    },
    handleHistory() {
      api.api('post', api.loginUrl2 + '/tCrasHistoricalRecord/queryPage').then((res) => {
        // this.historyList = res.list.length==0?[]
        this.historyList = res.list || []
      })
      // this.isShowHistory=false
    },
    async handleDeleHis(list) {
      if (list.length == 0) { return }
      let ids = list.reduce((t, c) => (`${t},${c.id}`).replace(/(^,)/g, ''), '')
      await api.api('post', api.loginUrl2 + '/tCrasHistoricalRecord/delete', { ids: ids })
      this.handleHistory()
    },
    handleHistorySearch(content) {
      this.searchvalue = content
      this.CaseCollision()
    },
    CaseCollision() {
      let nexttys = this.verifySearchValue()
      if (nexttys) {
        api.api("post", api.loginUrl2 + "/canvasTarget/accountCrash", {
          typeNum: this.searchvalue
        })
          .then(res => {
            this.isShowHistory = false;
            this.isShowCompany = false;
            this.isShowCase=true
            this.caseList = res
            this.caseIdRadio = res[0].id

          }).catch(error => { this.handleHistory() });
      }
    },
    searchID() {
      this.isLoading=true
      let caseId = this.caseList.find(i=>i.id==this.caseIdRadio).tenantId
        api.api("post", api.loginUrl2 + "/canvasTarget/add", {
          typeNum: this.searchvalue,
          caseId:caseId
        })
          .then(res => {
            this.$store.dispatch("setSearchData", res);
            this.$store.commit("setSearid", this.searchvalue);
            this.isShowCase=false
            this.$router.push({
              path: "/gxfx/gxfxManager",
              query: { searid: this.searchvalue,caseId: caseId}
            });
            this.isLoading=false
          }).catch(error => {
            this.handleHistory()
            this.isLoading=false
            this.isShowCase=false
           })
    },
    verifySearchValue() {
      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/;
      let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/;
      let cPattern = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
      let cP = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      let mPattern = /^1[34578]\d{9}$/;
      let splitReg = /,|\s+/;
      let caseReg = /^A\d{22}$/
      let chinaReg = /[\u4e00-\u9fa5]/
      let nexttys = true;
      if (this.searchvalue == '') {
        this.$message.error("请输入搜索内容");
        nexttys = false;
      }
      if (regEn.test(this.searchvalue) || regCn.test(this.searchvalue)) {
        this.$message.error("请删除您搜索栏中的特殊符号，包括中文逗号");
        nexttys = false;
      }
      let resArr = this.searchvalue.split(splitReg);
      let res = resArr.filter(item => item !== "")
      if (res.length > 1) {
        this.$message.error("一次最多只能添加1条数据，请适当删减 谢谢");
        nexttys = false;
      }
      let unqiArr = [...new Set(res)]
      if (unqiArr.length !== res.length) {
        this.$message.error("您输入的数据中，有重复项，请删减");
        nexttys = false;
      }
      let warnMes = [];
      res.forEach(s => {
        if (!mPattern.test(s) && !cP.test(s) && !chinaReg.test(s)) {
          warnMes.push(s);
          nexttys = false;
        }
      });
      warnMes.length !== 0 && this.$message.warning(warnMes.join(",") + " 输入格式错误");
      return nexttys
    }
  }
};
</script>
