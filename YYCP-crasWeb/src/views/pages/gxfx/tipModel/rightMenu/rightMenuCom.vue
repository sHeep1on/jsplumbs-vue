<template>
  <transition name='fade'>
    <div v-clickOutSide :class="rightMenuClass" :style="[isChildCom?'':handleParentCom()]" v-if="show">
      <ul class="right-menu-ui">
        <li v-for='(item,index) in list'  @mouseleave="handlemouseleave($event,item,index)"  @mouseover="handleMouse($event,item,index)">
          <a :class="[item['disable'] ? 'disable-menu':'active-menu',{'identified-class':item.childrens}]"  @click="emitClickEvent($event, item)">
            <svg-icon v-if="item.headIcon" :name="item.headIcon" class="head-icon" style="font-size:18px"></svg-icon>
            <span>{{ item.label}}</span>
            <i v-show="item.childrens" :class="{'open-child-menu':(showIndex==index)}" class="el-icon-arrow-right right-menu-arrow"></i>
          </a>
          <right-menu-com :isChildCom='true' v-if="item.childrens" @refreshbizlines="emitClick" :list="item.childrens" :show="true"></right-menu-com>
        </li>
      </ul>
    </div>
  </transition>
</template>
<script>
import Popper from 'popper.js'
export default {
  name: "rightMenuCom",
  props: {
    list: Array,
    locX: String,
    locY: String,
    show: {
      type: [Boolean],
      required: false,
      default: false
    },
    event: MouseEvent,
    isChildCom: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      startX: "",
      startY: "",
      showIndex: -1,
      isopenChild:false,
      popper: null,
      isPoperShow: false,
      triggerEl: null
    };
  },
  inject:{
     rughtMenuCom: {
      default: ""
    }
  },
  watch: {
    event(val) {
      this.startX = val.pageX;
      this.startY = val.pageY;
    }
  },
  computed: {
    rightMenuClass() {
      return this.isChildCom ? "right-menu-child" : "right-menu-ct";
    }
  },
   directives:{
			clickOutSide:{
				bind(el,binding,vnode){
					el.handler = (e)=>{
						if (el && !el.contains(e.target)) {
              vnode.context.$emit('update:show',false)
						}
					}
					document.addEventListener('click',el.handler,true)
				},
				unbind(el){
					document.removeEventListener('click',el.handler,true)
					el.handler=null
				}
			}
		},
  methods: {
    handleParentCom(){

      // this.$nextTick(()=>{
        let obj = {};
        ((this.startY+370)>this.event.toElement.clientHeight)&& (obj['bottom'] = '0px')
          obj['left']=(this.startX+120)>this.event.toElement.clientWidth?
                      (this.startX-120)+'px':this.startX+'px'
          !obj['bottom']&&(obj['top']=this.startY+'px')
        return obj
      // })
    },
    showChildren(item) {
        if (!item.childrens || !item.childrens.length) {
          return false
        } else {
          return true
        }
      },
    handleMouse(e,item,index) {
      // if (item.childrens&&item.childrens.length>0) {
        let target
        if (e.target.parentElement.classList.contains('identified-class')) {
          target=e.target.parentElement.parentElement
        } else if (e.target.firstElementChild&&e.target.firstElementChild.classList.contains('identified-class')){
          target=e.target.firstElementChild.parentElement
        } else if (e.target.classList.contains('identified-class')){
          target=e.target.parentElement
        }
        if (target!==undefined) {
          if (this.popper == null||this.triggerEl!==target) {
            this.triggerEl=target
            let CanvasPanel = document.querySelector('.Q-CanvasPanel')
            this.popper = new Popper(this.triggerEl, this.triggerEl.lastElementChild, {
              placement: 'right-start',
              modifiers :{
                flip: {
                  padding:'500px'
                },
                preventOverflow:{
                  boundariesElement:'scrollParent'
                }
              }
            })
            this.popper.update()
          }
        }
        // let target =
        // console.log(target);
      // }
      // this.showIndex=index
    },
    handlemouseleave($event,item,index){
      this.popper !== null&&this.popper.destroy()
      this.popper=null
    },
    showList(index) {
      if (this.showIndex === index) {
        return true;
      } else {
        return false;
      }
    },
    emitClick(event,item) {
      this.$emit("refreshbizlines",event,item);
    },
    emitClickEvent(event, item) {
      event = event || window.event;
      if (!this.showChildren(item)&&!item.disable) {
        this.emitClick(event,item);
      } else {
        event.cancelBubble = true;
        event.stopPropagation();
      }
    }
  }
};
</script>

<style lang="less">
.right-menu-ct {
  position: fixed;
  z-index: 10000;
  padding-left: 2px;
   min-width: 120px;
  // top: 250px;
  // left: 50px;
}
.fade-enter-active {
		transition: all .4s ease;
	}
	.fade-leave-active {
		transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
	}
	.fade-enter, .fade-leave-to {
		transform: translateY(-10px);
		opacity: 0;
	}
.right-menu-child {
  position: absolute;
   padding-left: 8px;
   top: -55555px;
   margin-bottom: 57px;

}
.right-menu-ui {
  //  min-width: 100px;
  border-radius: 8px;
  box-shadow: 1px 1px 8px 2px #e4e1e1;
  padding: 5px;
  background: #fff;


  & li {
    position: relative;
    .right-menu-arrow {
      position: absolute;
      right: 8px;
      top: 13px;
      transition:all .2s ease;
      &.open-child-menu {
         top: 10px;
        transform:rotate(90deg);
      }
    }
  }
  & li a {
    position: relative;
    text-decoration: none;
    text-indent: .5em;
    font-size: 14px;
    min-width: 100px;
    padding: 9px 5px;
    &.disable-menu {
      cursor: not-allowed;
      color: #a3a0a0;
    }

  }
  & li a.active-menu:hover {
    background: #eee;
    border-radius: 8px;
    color: #555;
    cursor: pointer;
  }
  & > li a {
    list-style: none;
    position: relative;

    display: block;
  }
}
</style>

