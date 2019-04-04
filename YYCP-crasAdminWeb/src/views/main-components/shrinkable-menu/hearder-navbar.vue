<style lang="less">
.hearder-navbar {
}
</style>

<template>
  <div class="hearder-navbar">
    <ul class="header-navbar-ct">
      <template v-for="item in originRouter" v-if="!item.hidden&&item.children">
        <li :class="{'path-active':(item.path+'/'+item.children[0].path)==$route.path}" v-if="item.children.length==1 && !item.children[0].children" @click="handleRouter(item.path+'/'+item.children[0].path)">
          <span>{{item.children[0].title}}</span>
        </li>
      </template>
    </ul>

    <!-- <el-menu mode="horizontal" :router='true' class="el-menu-demo"
        background-color="#397cbf"
        text-color="#D2E1EF"
        :default-active="activeLink"
        >
            <template v-for="item in originRouter" v-if="!item.hidden && item.children"  class="headerMenu">
                <el-menu-item ref="item.name" v-if="item.children.length == 1 && !item.children[0].children" :index="item.path+'/'+item.children[0].path">
                    <span slot="title">{{item.children[0].title}}</span>
                </el-menu-item>
                <el-submenu v-else :index="item.name || item.path" :key="item.name">
                    <template slot="title">
                        <span slot="title">{{item.title}}</span>
                    </template>
                    <template v-for="child in item.children">
                        <el-menu-item v-if="!child.children" :index="item.path + '/' + child.path">
                            <span slot="title">{{child.title}}</span>
                        </el-menu-item>
                    </template>
                </el-submenu>
            </template>
        </el-menu> -->
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      transforRouter: [],
      show: false
    };
  },
  computed: {
    activeLink() {
      return this.$route.path;
    },
    originRouter() {
      return this.$store.getters.get_menuList;
    }
  },
  created() { },
  methods: {
    handleRouter(val) {
      this.$router.push({ path: val })

    }
  }
};
</script>



