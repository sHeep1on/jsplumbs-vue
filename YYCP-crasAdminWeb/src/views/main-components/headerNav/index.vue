<template>
  <ul class="header-navbar-ct">
    <template v-for="item in originRouter" v-if="item">
      <li :class="{'active-mune':item.name == $route.name}" class="header-nav-menu" v-if="!item.children" @click.stop="handleRouter(item)">
        <span>{{item.title}}</span>
      </li>
      <template v-else>
        <header-nav :defaultPopperClass='defaultPopperClass' :popperActiveClass='popperActiveClass' @clickEmit="handleRouter" :routeList='item' placement="bottom-start" :isMenuNav='true'></header-nav>
      </template>
    </template>
  </ul>
</template>
<script>
import headerNav from './headerNav'
export default {
  name: 'headerIndex',
  components: {
    headerNav
  },
  data() {
    return {
    }
  },

  props: {
    router: {
      type: Array
    },
    defaultPopperClass: {
      type: String
    },
    popperActiveClass: {
      type: String
    }
  },
  computed: {
    originRouter() {
      return this.router[0].children || []
    }
  },
  watch: {
    router(val) {

    }
  },
  methods: {
    handleRouter(val) {
      this.$emit('click', val)
      if (this.isRouter) {
        this.$router.push({
          name: val.name
        });
      }

    }
  },
}
</script>
<style lang="less">
ul {
  list-style: none;
}
li {
  list-style: none;
}
.header-navbar-ct {
  display: flex;
  height: 60px;
  align-items: center;
  line-height: 60px;
  .active-mune {
    .active-span {
      border-bottom: 2px solid #fff;
      padding-bottom: 5px;
    }
  }
  & > li.header-nav-menu:not(.content-list) {
    padding: 0px 15px;
    height: 100%;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    p.header-nav-title {
      //line-height: 60px;
      span {
        margin-right: 10px;
      }
      .header-arrow {
        transition: all 0.5s;
        float: right;
        position: relative;
        top: 22px;
        &.overturn-arrow {
          transform: rotate(180deg);
        }
      }
    }

    &:hover {
      background: #2e6399;
    }
  }
}
</style>
