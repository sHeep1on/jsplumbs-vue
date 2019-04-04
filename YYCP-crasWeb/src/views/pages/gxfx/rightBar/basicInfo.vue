<template>
  <transition name="fade">
    <li class="dxxxli" v-show="isShow">
      <div class="typedianzfb">
        <div class="xq-personal">
          <p>基本信息</p>
          <div class="bigphoto">
            <div class="photo"><img :src="userDetail.imgUrl" :onerror='require("../../../../images/person/test6.png")' alt=""></div>
            <p>{{userDetail.name}}</p>
          </div>
        </div>
        <div class="personxx basic-info-list">
          <el-tabs type="border-card">
            <template v-for="(value, key) in userDetail.res">
              <el-tab-pane :label="key">
                <div class="basic-info-ct" v-chinaOlyScrollBar>
                  <template v-if="key.indexOf('工商信息')==-1">
                    <p v-for="(item,index) in value" :key="index" class="basic-info-line">
                      <span v-html='item.key'></span>
                      &nbsp;&nbsp;:&nbsp;&nbsp;
                      <span v-html="item.value"></span>
                    </p>
                  </template>
                  <template v-else>
                    <p v-if="!value.length">
                      当前没有工商信息
                    </p>
                    <template v-else>
                      <template v-for="(CommerceItem,inx) in value">
                        <div>
                        <p v-for="(Commvalue, keyItem) in CommerceItem" :key="keyItem" class="basic-info-line">
                          <template v-if="Commerce[keyItem]">
                            <span v-html='Commerce[keyItem]'></span>
                            &nbsp;&nbsp;:&nbsp;&nbsp;
                            <span v-html="Commvalue"></span>
                          </template>
                        </p>
                      </div>

                    </template>
                    </template>


                  </template>
                </div>
              </el-tab-pane>
            </template>
          </el-tabs>
        </div>
      </div>
    </li>
  </transition>
</template>
<script>
import api from "@/fetch/api"
import { Commerce } from './lib'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    userDetail: {
      // type:Object
    }
  },
  data() {
    return {
      jbxxpersonimg: '',
      jbxxpersonname: '',
      xqxxarr: [],
      test: true,
      labels: [],
      Commerce: Commerce
    }
  },
  watch: {
    userDetail() {
      this.handleInfo()
    }
  },
  methods: {
    handleInfo() {

      this.jbxxpersonname = this.userDetail.name||''
      //this.xqxxarr = this.userDetail.res||''
    }
  }
}
</script>
<style lang="less">
.typedianzfb {
  height: 100%;
}
.basic-info-list {
  height: calc(~"100% - 200px");
  .el-tabs {
    height: 100%;
    .el-tabs__content {
      height: 100%;
      .el-tab-pane {
        height: 100%;
        .basic-info-ct {
          position: relative;
          height: calc(~"100% - 40px");
        }
      }
    }
    .basic-info-line {
      font-size: 14px;
      line-height: 1.9;
      display: flex;
      & span:nth-child(1) {
        width: 32%;
        text-align: right;
      }
      & span:nth-child(2) {
        width: 68%;
      }
    }
  }
}
</style>



