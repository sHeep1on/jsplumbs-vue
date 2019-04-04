
<template>
  <div class="main" :class="{'main-hide-text': shrink}">
    <div class="main-header-con">
      <div class="main-header">
        <div class="main-header-bg" @click="goHome">
          <img :src="require('../../config/logo_head.png')" class="header-logo" />
          <div class="header-title">
            <p class="header-title-name">{{config.title}}</p>
            <!-- <p>Relationship Map</p> -->
          </div>
        </div>
        <headerNavMenu :router='menuList'></headerNavMenu>
        <div class="header-avator-con">
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Avatar :src="avatorPath" style="margin-left: 10px;"></Avatar>
              <el-dropdown trigger="click" :hide-on-click="false">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ userName }}</span>
                  <Icon type="arrow-down-b"></Icon>
                </a>
                <el-dropdown-menu slot="dropdown" class="personal-info-panel">
                  <el-dropdown-item>
                    <personal-com></personal-com>
                  </el-dropdown-item>
                  <el-dropdown-item divided>
                    <el-button size="small" @click="handleLoginOut">退出登录</el-button>
                    <el-button v-if="isAuthority" type="primary" size="small" @click="handleLink">关系图谱</el-button>
                    <!-- <el-button  type="primary" size="small" @click="handleLink">关系图谱</el-button> -->
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </Row>
          </div>
        </div>
      </div>

    </div>
    <div class="single-page-con">
      <div class="single-page" style="border: 1px solid #dfe1e4;background: #FFFFFF;">
        <keep-alive>
          <router-view :key="key"></router-view>
        </keep-alive>
      </div>
      <div class="bottomPage" v-if="config.footer" id="bottomPage" style="padding-top: 10px;box-sizing: border-box;width: 600px;margin: auto;">
        <div style="clear: both;width: 600px;margin: auto;">
          <img src="../images/footer.png" style="float: left;" />
          <span style="height: 18px;line-height: 18px;float: left;font-weight: 700;"> {{config.footerContent}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import hearderNavbar from "./main-components/headerNav/index";
import Cookies from "js-cookie";
import $ from "jquery";
import util from "@/libs/util.js";
import personalCom from "@/views/Common/personalCom.vue";
export default {
  components: {
    // hearderNavbar,
    personalCom
  },
  data() {
    return {
      shrink: false,
      userName: "",
      isFullScreen: false,
      state: "",
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
      isAuthority: false,
      system: {}
    };
  },

  computed: {
    menuList() {
      return this.$store.state.app.menuList;
    },
    key() {
      return this.$route.name !== undefined
        ? this.$route.name + +new Date()
        : this.$route + +new Date();
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    avatorPath() {
      return localStorage.avatorImgPath;
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    },
    lang() {
      return this.$store.state.app.lang;
    },
    menuTheme() {
      return this.$store.state.app.menuTheme;
    },
    mesCount() {
      return this.$store.state.app.messageCount;
    }
  },

  methods: {
    goHome() {
      this.$router.push({
        path: "/sourcedata/sourcedataManager"
      });
    },
    init() {
      let pathArr = util.setCurrentPath(this, this.$route.name);
      if (pathArr.length >= 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.userName = Cookies.get("user");
      let messageCount = 3;
      this.messageCount = messageCount.toString();
      this.checkTag(this.$route.name);
      this.$store.commit("setMessageCount", 3);
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    handleLoginOut() {
      this.$store.commit("logout", this);
      this.$store.commit("setMymenu", []);
      this.$store.commit("clearOpenedSubmenu");
      this.$router.push({
        name: "login"
      });
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name === name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(
          this,
          name,
          this.$route.params || {},
          this.$route.query || {}
        );
      }
    },
    handleSubmenuChange(val) { },
    beforePush(name) {
      return true;
    },
    fullscreenChange(isFullScreen) { },
    async handleAuthority() {
      await this.$store.dispatch("getRoleInfo").then(res => {
        this.isAuthority = !!res.filter(item => {
          return item.roleName.indexOf("relateAdmin") !== -1;
        }).length;
      });
    },
    handleLink() {
      var id = "E584180EDA7791598EFE9BD65AD55E56";
      this.$store
        .dispatch("getSystemUrl", id)
        .then(res => window.open(res.clientUrl));
    },
    handlePersonal() {
      this.system = JSON.parse(JSON.stringify(this.$store.getters.system_url));
    }
  },
  watch: {
    $route(to, from, next) {
      this.$store.commit("setCurrentPageName", to.name);
      let pathArr = util.setCurrentPath(this, to.name);
      if (pathArr.length > 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.checkTag(to.name);
      localStorage.currentPageName = to.name;
    },
    lang() {
      util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
    },
    "pageTagsList.length": function (val) {
      if (val > 7) {
        this.pageTagsList.shift();
      }
    },
    state(val) {
      if (val > 0) {
        $("#bottomPage").css("left", "350px");
      } else {
        $("#bottomPage").css("left", "0");
      }
    }
  },
  mounted() {
    this.init();
    const self = this;
    this.state = $("#relation").length;
    // window.onresize = function temp() {
    //     if(val > 0){
    //         $('#bottomPage').css("left","350px");
    //     }else{
    //         $('#bottomPage').css("left","0");
    //     }
    //     // $(".menuNav").css("height", $(window).height() - 60 + "px");
    //     // that.height = $(window).height() - 211;
    // };
  },
  created() {
    // 显示打开的页面的列表
    this.$store.commit("setOpenedList");
    this.handleAuthority();
  }
};
</script>
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
  background: url("../images/icon_user.png") no-repeat !important;
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
  height: 50px;
  line-height: 50px;
  text-align: center;
  // color: #999999;
  opacity: 0.6;
  color: #333;
  width: 100%;
  // text-align: center;
}
#navicon .ivu-btn {
  margin-left: -8px !important;
}

#navicon .ivu-btn-text:focus {
  box-shadow: none !important;
}

//gy-start -8.4 -- menu
.main .main-header {
  display: flex;
  .hearder-navbar {
    padding-left: 20px;
    width: 800px;
    .header-navbar-ct {
      display: flex;
      list-style: none;
      li {
        list-style: none;
        height: 60px;
        line-height: 60px;
        padding: 0 20px;
        font-size: 14px;
        color: #fff;
        cursor: pointer;
        &:hover {
          background: rgb(46, 99, 153);
        }
        &.path-active span {
          padding-bottom: 5px;
          border-bottom: 2px solid #ffffff;
        }
      }
    }
  }
}
.main-header-bg {
  //logo
  width: 300px;
  height: 60px;
  display: flex;
  .header-logo {
    width: 40px;
    height: 36px;
    float: left;
    margin: 11px 12px 0 20px;
  }
  .header-title {
    color: #fff;
    float: left;
    font-size: 11px;
    p {
      line-height: 35px;
    }
    .header-title-name {
      font-size: 22px;
      margin-top: 14px;
      font-weight: 600;
      // margin-bottom: 5px;
    }
  }
}
</style>