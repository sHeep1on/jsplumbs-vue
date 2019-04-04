<template>
  <li :class="[isMenuNav?'header-nav-menu':'content-list',{'active-mune' :handlerActive(routeList)}]" ref='trigger'>
    <p class="header-nav-title" :class="{}">
      <span :class="{'active-span':isMenuNav}" class="header-nav-text">{{routeList.title}}</span>
      <i :class="[{'overturn-arrow':isPoperShow},isMenuNav?'header-arrow':'arrow-popper']" class="el-icon-arrow-down"></i>
    </p>
    <transition name="fade">
      <ul v-show="isPoperShow" class="popper-ct" :class="[defaultPopperClass||'']">
        <template v-for="item in routeList.children">
          <li :class="[(item.name == $route.name)?(popperActiveClass||'active-popper'):'']" v-if="!item.children" class="content-list" @click.stop="emitClickEvent(item)">
            <span>{{item.title}}</span>
          </li>
          <template v-else>
            <header-nav :popperActiveClass='popperActiveClass' :routeList='item' @clickEmit='emitClickEvent' :defaultPopperClass='defaultPopperClass' :isMenuNav='false'></header-nav>
          </template>
        </template>
      </ul>
    </transition>
  </li>
</template>
<script>
import Popper from "popper.js";
export default {
  name: 'headerNav',
  componentName: 'headerNav',
  data() {
    return {
      popper: null,
      isPoperShow: false,
      triggerEl: null
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
  props: {
    routeList: {
      type: Object
    },
    placement: {
      type: String,
      default: 'right-start'
    },
    isMenuNav: {
      type: Boolean,
      default: false
    },
    defaultPopperClass: {
      type: String
    },
    popperActiveClass: {
      type: String
    }
  },
  mounted() {
    this.initEvent()
  },
  computed: {
  },
  watch: {
    routeList(val) {
    }
  },
  created() {
  },
  methods: {
    initEvent() {
      let { show, hide } = this;
      this.triggerEl = this.$refs.trigger
      this.triggerEl.addEventListener('mouseenter', show)
      this.triggerEl.addEventListener('mouseleave', hide);

    },
    show() {
      if (this.popper == null) {
        this.popper = new Popper(this.triggerEl, this.triggerEl.firstChild.nextElementSibling, {
          placement: this.placement,
          offset: '50px'
        })
      }
      this.isPoperShow = true
    },
    hide() {
      if (this.popper !== null) {
        this.popper.destroy();
        this.popper = null
      }
      this.isPoperShow = false
    },
    emitClickEvent(item) {

      this.$emit('clickEmit', item)
    },
    handlerActive(item) {
      const findActive = (list) => {
        if (list.some(i => i.name == this.$route.name)) {
          return true
        } else if (list.children) {
          return findActive(list.children)
        } else {
          return false
        }
      }
      if (this.isMenuNav) {
        return findActive(item.children)
      } else {
        return false
      }


    }
  },
}
</script>
<style lang="less">
.header-navbar-ct {
  .popper-ct {
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    position: absolute;
    top: -888px;
    z-index: -55555;

    li.content-list {
      padding: 10px 20px;
      position: relative;
      z-index: 5;
      line-height: 1.7;
      cursor: pointer;

      &:hover {
        background: #f0f7fd;
      }
      span {
        color: #606266;
      }
      &.active-popper {
        background: #606266;
        color: #fff;
        span {
          color: #fff;
        }
      }
      p {
        .arrow-popper {
          color: #606266;
          transition: all 0.5s;
          float: right;
          position: relative;
          top: 5px;
          // top: 10px;
          &.overturn-arrow {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
}
</style>

