<template>
  <div class="hearder-navbar">
    <ul class="header-navbar-ct">
      <template v-for="item in originRouter" v-if="!item.hidden&&item.children">
        <li :class="{'path-active':(item.path+'/'+item.children[0].path)==$route.path}" v-if="item.children.length==1 && !item.children[0].children" @click="handleRouter(item.path+'/'+item.children[0].path)">
          <span>{{item.children[0].title}}</span>
        </li>
      </template>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
      transforRouter: [],
      setRoute: false,
      ishomeIndex: false,
    }
  },
  watch: {
  },
  computed: {

    originRouter() {
      return this.$store.getters.get_menuList
    }
  },
  methods: {
    handleActive(val) {

    },
    handleRouter(val) {
      let httpReg = new RegExp("^/http[s]?://");
      if (httpReg.test(val)) {
        let res = val.replace(/^\//, '')
        window.open(res)
        return
      } else {
        this.setRoute = false
        if (this.$route.path.indexOf('/gxfx/gxfxManager') !== -1 && this.$store.getters.is_change_graph) {
          if (val.indexOf('/gxfx/gxfxManager') == -1) {
            this.$store.dispatch('toggleIsSave', { isShow: true, path: val })
            this.$store.commit('setSearid', false);
          }
        } else {
          if (val.indexOf('/gxfx/gxfxManager') !== -1) {
            if (this.$route.path !== val) {
              this.$router.push({ path: '/home' })
              this.$store.commit('setSearid', false);
              this.$store.dispatch('isChangeGraph', false)
            }
          } else {
            this.$router.push({ path: val })
            this.$store.commit('setSearid', false);
            this.$store.dispatch('isChangeGraph', false)
          }

        }
      }
    }
  }
}
</script>
<style lang="less">
.main {
  .main-header {
    .hearder-navbar {
      .header-navbar-ct {
        display: flex;
        li {
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
}
</style>


