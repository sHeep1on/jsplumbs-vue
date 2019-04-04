<style lang="less">
@import "./main.less";

.main .tags-con {
  border: 1px solid #dfe1e4;
}

.main-breadcrumb {
  padding: 8px 30px !important;
  float: left;
}

.header-middle-con {
  margin-top: 10px;
}

.main .header-avator-con {
  width: 160px !important;
}
.main .main-header {
  display: flex;
}
.main .main-header .header-middle-con {
  right: 170px !important;
}

.main-header .header-avator-con .user-dropdown-menu-con {
  width: 160px !important;
}

.main .main-header-con {
  height: 50px !important;
}

.main .single-page-con {
  top: 60px !important;
  left: 0px;
}

.header-avator-con a {
  color: #fff;
}

.ivu-avatar {
  background: url("../images/u99.png") no-repeat !important;
  width: 36px;
  height: 36px;
}

.ivu-icon {
  margin-left: 5px;
}

.ivu-shrinkable-menu,
.ivu-menu-dark {
  background: #fff !important;
}

.main-header-bg {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.header-logos {
  width: 37px;
  display: inline-block;
  float: left;
  margin: 0px 15px 0 35px;
}
.el-menu--horizontal {
  border: none !important;
}
.main .main-header {
  display: flex;
  .hearder-navbar {
    padding-left: 20px;
    width: 400px;
    ul {
      border: 0;
      li {
        height: 60px;
        line-height: 60px;
      }
      .is-active {
        font-weight: 600;
        color: #fff !important;
        background-color: rgb(57, 124, 191);
        span {
          padding-bottom: 5px;
          border-bottom: 2px solid #fff !important;
        }
      }
    }
  }
}
.header-title p {
  color: #fff;
  float: left;
  font-size: 11px;
  line-height: 20px;
}

.header-title p.header-title-name {
  font-size: 22px;
  margin-top: 14px;
}

.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item {
  color: #333;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
  border-left: 3px solid #fff;
}

.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item:hover,
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu),
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):hover,
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-submenu-title-active:not(.ivu-menu-submenu),
.ivu-menu-dark.ivu-menu-vertical
  .ivu-menu-submenu-title-active:not(.ivu-menu-submenu):hover {
  background: #fff;
  color: #397cbf;
  border-left: 3px solid #397cbf;
  border-right: 0 none;
}

.ivu-dropdown .ivu-btn .ivu-icon {
  color: #333 !important;
}

.bottomPage {
  clear: left;
  height: 40px;
  text-align: center;
}

#navicon .ivu-btn {
  margin-left: -8px !important;
}

#navicon .ivu-btn-text:focus {
  box-shadow: none !important;
}
.zdylogo {
 // width: 365px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.zdylogo > span {
  width: 100%;
  display: inline-block;
  color: #fff;
}
.zdylogo > span:nth-child(1) {
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
  //    width: 300px;
}
.bottom-footer {
  display: inline-block;
}
.gstitle {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  opacity: 0.6;
}
.gstitle > span {
  width: 100%;
  text-align: left;
  margin-top: 5px;
}
</style>
<template>
  <div class="main"
       :class="{'main-hide-text': shrink}">
    <div class="main-header-con">
      <div class="main-header">
        <div class="main-header-bg"  @click="goHome">
          <img :src="require('../../config/logo_head.png')"  class="header-logos" />
          <div class="zdylogo">
            <span>{{config.title}} </span>
            <!-- <span>Relationship&nbsp;&nbsp;Map</span> -->
          </div>
        </div>
        <hearder-navbar></hearder-navbar>
        <div class="header-avator-con">
          <div class="user-dropdown-menu-con">
            <Row type="flex"  justify="end" align="middle" class="user-dropdown-innercon">
              <Avatar :src="avatorPath"  style="margin-left: 10px;"></Avatar>
              <el-dropdown trigger="click"  :hide-on-click="false">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ userName }}</span>
                  <Icon type="md-arrow-dropdown" />
                  <span class="main-user-name main-user-officeName">{{officeName}}</span>
                  <!-- <span>jhghghj</span> -->
                </a>
                <el-dropdown-menu slot="dropdown"  class="personal-info-panel">
                  <el-dropdown-item>
                    <personal-com></personal-com>
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <el-button v-if="isAuthority" type="primary" size="small" @click="handleLink">关系中心管理</el-button>
                    <el-button size="small" @click="handleResetPassWord">修改密码</el-button>
                    <el-button size="small" @click="handleLoginOut">退出登录</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </Row>
          </div>
        </div>
      </div>

    </div>
    <div class="single-page-con">
      <div class="single-page"
           style="background: #FFFFFF;">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
      <div class="bottomPage" v-if="config.footer"
           style="box-sizing: border-box;">
        <div class="bottom-footer">
          <div class="gstitle">
            <!-- <i></i> &copy; 2018 chinaoly.com 杭州中奥科技有限公司版权所有 0571-87397108 400-608-7108 -->
            <span><img src="../images/footer.png" />{{config.footerContent}}</span>
          </div>
        </div>
      </div>
    </div>
    <loading ref="loading"></loading>
      <reSetPassword ref="reSetPassword" @resetPassword='handleLoginOut'></reSetPassword>
  </div>
</template>
<script>
import hearderNavbar from './main-components/shrinkable-menu/hearder-navbar.vue';
import Cookies from 'js-cookie';
import util from '@/libs/util.js';
import personalCom from './main-components/personalCom.vue';
import loading from '@/views/pages/dataImport/components/loading.vue';
import { storage } from '@/libs/common/common.js'
import reSetPassword from './main-components/reSetPassword/reSetPassword.vue'
//import {SetToken} from "@/libs/client.js"
// const configData = require('../config/config.js')

export default {
  components: {
    hearderNavbar,
    personalCom,
    loading,
    reSetPassword
  },
  data () {
    return {
      shrink: false,
      userName: '',
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
      isAuthority: false,
      officeName: null,
      loginOutCount: {
        loading: false,
        count: 5
      },
      loadingText: null,

    };
  },
  computed: {
    pageTagsList () {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },
    currentPath () {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    avatorPath () {
      return localStorage.avatorImgPath;
    },
    cachePage () {
      return this.$store.state.app.cachePage;
    },
    lang () {
      return this.$store.state.app.lang;
    },
    menuTheme () {
      return this.$store.state.app.menuTheme;
    },
    mesCount () {
      return this.$store.state.app.messageCount;
    }
  },
  methods: {
    goHome () {
      this.$router.push({
        path: '/home'
      })
    },
    init () {
      let pathArr = util.setCurrentPath(this, this.$route.name)

      if (pathArr.length >= 2) {
        this.$store.commit('addOpenSubmenu', pathArr[1].name);
      }
      this.userName = Cookies.get('user');
      let messageCount = 3;
      this.messageCount = messageCount.toString();
      this.checkTag(this.$route.name);
      this.$store.commit('setMessageCount', 3);
    },
    toggleClick () {
      this.shrink = !this.shrink;
    },
    handleLoginOut (name) {
     // SetToken.rewriteToken().then(res => {
        this.$store.commit('logout', this);
        this.$store.commit('setMymenu', []);
        this.$store.commit('clearOpenedSubmenu');
        // this.$router.push({
        //   name: 'login'
        // });
        window.location.reload()
      //})
    },
    handleResetPassWord(){
        this.$refs.reSetPassword.isShow = true
    },
    checkTag (name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
      }
    },
    handleSubmenuChange (val) {
    },
    beforePush (name) {
      return true;
    },
    async handleAuthority () {
      await this.$store.dispatch("getRoleInfo")
      await this.$store.dispatch("getUserInfo")
      if (this.$store.getters.personal_roleInfo) {
        this.isAuthority = !!this.$store.getters.personal_roleInfo.filter(item => { return item.roleName.indexOf('relateAdmin') !== -1 }).length;
        storage.set('relaAdmin', this.isAuthority, 3600)
      }
      // if (this.$store.getters.personal_roleInfo.find(i=>i.roleName.indexOf('relate')!==-1)==undefined) {
      //     this.$router.push({path:'/forbid'})
      // }
      this.officeName = this.$store.getters.personal_userInfo.officeName
    },
    handleLink () {
      var id = "8BC391F31F24982EA95062C40D9B1A3B";
      this.$store.dispatch("getSystemUrl", id).then(res => window.open(res.clientUrl))
    },
  },
  watch: {
    '$route' (to, from, next) {
      this.$store.commit('setCurrentPageName', to.name);
      let pathArr = util.setCurrentPath(this, to.name);
      if (pathArr.length > 2) {
        this.$store.commit('addOpenSubmenu', pathArr[1].name);
      }
      this.checkTag(to.name);
      localStorage.currentPageName = to.name;
    },
    lang () {
      util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
    },
    'pageTagsList.length': function (val) {
      if (val > 7) {
        this.pageTagsList.shift()
      }
    }
  },
  mounted () {
    this.init();
  },
  created () {
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList');
    this.handleAuthority()
  }
};
</script>
