<template>

  <transition name="fade">
    <div v-show="isShow" v-loading="loading" class="rela-detail-ct">
      <div class="xq-personal">
        <slot></slot>
        <span class="searchk"></span>
        <div class="rela-detail-img">
          <dl class="rela-detail-person" :class="{'is-long-text':isLongText}">
            <dt><img :src="photosimg2" alt=""></dt>
            <dd>{{dxone}}</dd>
          </dl>
          <!-- <dl
            class="rela-detail-chart"
            v-if="qmd"
          >
            <dt>{{qmd}}</dt>
            <dd>亲密度</dd>
          </dl> -->
          <dl class="rela-no-intimacy">
            <dt>交易频次:{{dealFrequency.name}}</dt>
            <dd>
              <span v-show="!dealFrequency.to" class="dealFrequency-arrow"></span>
              <span v-show="!dealFrequency.from" class="dealFrequency-arrow"></span>
              <span v-show="dealFrequency.isShowTo" class="dealFrequency-to-num">{{dealFrequency.toDeal}}</span>
              <!-- <svg-icon v-show="!dealFrequency.to" name="arrowTo" class="dealFrequency-icon">
              </svg-icon>
              <svg-icon v-show="!dealFrequency.from" name="arrowFrom" class="dealFrequency-icon"></svg-icon> -->

            </dd>
          </dl>
          <dl class="rela-detail-person" :class="{'is-long-text':isLongText}">
            <dt><img :src="photosimg3" alt=""></dt>
            <dd>{{dxtwo}}</dd>
          </dl>
        </div>
      </div>
      <div class="timezhouone rela-detail-info">
        <!-- <transition name="timeboxsx">
          <div class="xiansx" v-show="timeboxbol">
            <DatePicker v-model="filterDate" ref="DatePicker" class="xiansxtime time-" :options="options2" type="daterange" placeholder="请选择日期范围">
            </DatePicker>
            <div class="timesxbtn">
              <span @click="timeboltrue">取消</span>
              <span @click="handleTimeSearch">确定</span>
            </div>
          </div>
        </transition>
        <span class="shaixuan" @click="timeboltrue"></span> -->
        <Tabs ref="timeLine" class="time-line-wrap" @on-click="handleSwitch" value="currentTab">
          <TabPane v-for="(item,index) in labels" :key="item.value" :label="item.value" :name="item.value">
            <p class="total-deal" ref="marquee" v-show="item.income!==0&&item.defray!==0">
              <span :style="{transform :'translate3d('+(marqueeDistance)+'px,0px,0px)'}">
                流水总金额￥{{item.money}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                总收入￥{{item.income}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                总支出￥{{item.defray}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                流水总金额￥{{item.money}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                总收入￥{{item.income}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                总支出￥{{item.defray}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </p>
            <div class="timeline-detail-ct" v-chinaOlyScrollBar>
              <div class="timeline-height-control">
                <el-card class="box-card" v-for="(item2,index) in trajectorys[item.key]" :key="index">
                  <div slot="header" class="clearfix">
                    <span style='float: left;padding: 3px 0'>{{item2.txt1}}</span>
                    <span style="float: right; padding: 3px 0" type="text" v-html="item2.txt3"></span>
                  </div>
                  <div class="text item">
                    <el-tooltip class="item" effect="dark" placement="top">
                      <div slot="content"><span v-html="item2.txt4.replace(';','</br>')"></span></div>
                      <p class="time" v-html='item2.txt2'></p>
                    </el-tooltip>
                    <p class="content" v-html="item2.txt5"></p>
                    <p class="content" v-html="item2.txt6" :title="item2.txt6"></p>
                    <p class="content" v-html="item2.txt7" :title="item2.txt7"></p>
                  </div>
                </el-card>
              </div>
            </div>

          </TabPane>
        </Tabs>
      </div>
      <Page :current.sync="pageNum" :page-size.sync="pageSize" :total="trajectoryNum" show-total size="small" @on-change="pagechange" class="pagefy"></Page>
    </div>
  </transition>
</template>

<script>
import api from "@/fetch/api";
import { storage, cloneObj } from "@/libs/common/common.js";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: true
    },
    relaType: {
      type: String,
      default: null
    },
    relaEdge: {
      type: Object
    },
    isPageEmit: {
      type: Boolean,
      default: true
    },
    isResetDate: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      photosimg2: "",
      dxone: "",
      dxtwo: "",
      timeboxbol: false,
      pageNum: 1,
      pageSize: 4,
      trajectoryNum: 0,
      isRelaDetail: true,
      qmd: "",
      photosimg3: "",
      isLongText: false,
      marqueeDistance: 0,
      options2: {
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
      labels: [],
      oldedgeType: [],
      oldidArr: [],
      oldfromVId: "",
      oldtoVId: "",
      trajectorys: {},
      date: [],
      loneRela: true,
      filterDate: [],
      html: "",
      interval: null,
      dealFrequency: {
        name: "交易频次：4",
        from: false,
        to: false,
        toDeal:'',
        isShowTo:false
      },
      currentTab:null
    };
  },
  watch: {
    relaType() {
      this.countPageSize();
      this.initPage();
    },
    isShow() {
      this.filterDate = [];
    },
    isResetDate() {
      this.filterDate = [];
    }
  },
  created() {
    if (this.relaType !== null) {
      this.countPageSize();
      this.initPage();
    }
  },
  methods: {
    handleBlur() {
    },
    handleInput(e) {
      console.log(e);
    },
    initmarquee(list) {
      if (!this.$refs["marquee"][0] || this.interval) {
        return;
      }
      this.width = this.$refs["marquee"][0]
        .querySelector("span")
        .getBoundingClientRect().width;
      const run = () => {
        if (-this.marqueeDistance < this.width / 2) {
          this.marqueeDistance--;
          this.interval = requestAnimationFrame(() => {
            run();
          });
        } else {
          cancelAnimationFrame(this.interval);
          this.marqueeDistance = 0;
          run();
        }
      };
      run();
      list.forEach((item, index) => {
        this.$refs["marquee"][index].addEventListener("mouseenter", () => {
          cancelAnimationFrame(this.interval);
        });
        this.$refs["marquee"][index].addEventListener("mouseleave", () => {
          run();
        });
      });
    },
    countPageSize() {
      this.pageSize = 6;
    },
    handleSwitch(val) {
      this.pageNum=1
      this.$nextTick(() => {
        let parmas = {
          jsonData: this.relaType,
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          bank:val
        };
        this.renderDate(parmas)
      })
    },
    handleDetailData(val){
       let res = this.labels.find(i => i.value == val)
        this.trajectoryNum = res.total
        this.dealFrequency.name = (res.arrow == 2)?res.incomeTimes:res.defrayTimes
        this.dealFrequency.toDeal = res.incomeTimes
        this.dealFrequency.from = (res.arrow == 1) ? true : false
        this.dealFrequency.to = (res.arrow == 2) ? true : false
        this.dealFrequency.isShowTo =  (res.arrow == 3) ? true : false
    },
    filterImg(img) {
      let httpReg = new RegExp("^http[s]?://");
      let httpResp = new RegExp("^http[s]?://.+?/");
      if (httpReg.test(img)) {
        let res = img.replace(httpResp, "/");
        return res.indexOf(api.urlImage) !== -1 ? res : `${api.urlImage}${res}`;
      } else {
        return img.indexOf(api.urlImage) !== -1? `${img}`: `${api.urlImage}/${img}`
      }
    },
    initPage() {
      // this.loading = true;
      this.oldedgeType = [];
      this.pageNum = 1;
      this.filterDate = [];
      let parmas = {
        jsonData: this.relaType,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      this.$nextTick(() => {
        this.$refs.timeLine.activeKey = ''
      })
      this.renderDate(parmas, true);
    },
    renderDate(parmas, isQuery) {
      this.data = [];
      this.loading = true;
      this.timechage();
      this.trajectorys = {}
      api
        .api("post", api.loginUrl2 + "/canvasRelation/detail", parmas)
        .then(response => {
          if (this.isPageEmit) {
            this.$emit("handleRelaDetail");
          } else {
            this.$emit("handleTabDetail");
          }
          this.loading = false;
          // this.oldidArr = this.relaEdge.idArr;
          // this.oldfromVId = this.relaEdge.from._refId;
          // this.oldtoVId = this.relaEdge.to._refId;
          this.photosimg2 = this.relaEdge.from.oldImage
          this.photosimg3 = this.relaEdge.to.oldImage
          this.qmd = this.relaEdge.intimacy;
          let index = response.label.findIndex((i) => i.value == "全部")
          let allArr = response.label.splice(index, 1)
          response.label.unshift(allArr[0])
          this.labels = response.label
          this.handleDetailData((this.$refs.timeLine.activeKey || this.labels[0].value))
          this.trajectorys = response
          this.dxone = this.relaEdge.$from.name;
          this.dxtwo = this.relaEdge.$to.name;
          this.isLongText = !!(this.dxone.length > 7);
          response.label.forEach(s => {
            this.oldedgeType.push(s.key);
          });
          this.$nextTick(() => {
            this.initmarquee(this.labels);
          });
        })
        .catch(error => {
          this.trajectorys = {};
          this.trajectoryNum = 0;
          this.labels = [];
          if (isQuery) {
            if (this.isPageEmit) {
              this.$emit("nullData");
            } else {
              this.$emit("TabnullData");
            }
          }
          this.loading = false;
        });
    },
    timechage() {
      if (this.filterDate.length == 0 || this.filterDate[0] == "") {
        this.date = [];
      } else {
        this.date[0] = Date.parse(this.filterDate[0]) / 1000;
        this.date[1] = Date.parse(this.filterDate[1]) / 1000 + 86399;
      }
    },
    handleTimeSearch() {
      this.timeboxbol = false;
      this.pageNum = 1;
      this.data = [];
      this.timechage();
      let parmas = {
        jsonData: JSON.stringify({
          // idArr: this.oldidArr,
          fromVId: this.relaEdge.from._refId,
          toVId: this.relaEdge.to._refId,
          fromFileOrCaseId:this.relaEdge.from.fileOrCaseId,
          toFileOrCaseId:this.relaEdge.to.fileOrCaseId,
          edgeType: this.oldedgeType,
          filter: this.date,
        }),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        bank:(this.$refs.timeLine.activeKey || this.labels[0].value)
      };
      this.renderDate(parmas, false);
    },
    timeboltrue() {
      this.timeboxbol = !this.timeboxbol;
    },
    pagechange(value) {
      // this.loading = true;
      this.pageNum = value;
      this.timechage();
      let parmas = {
        jsonData: JSON.stringify({
         fromVId: this.relaEdge.from._refId,
          toVId: this.relaEdge.to._refId,
          fromFileOrCaseId:this.relaEdge.from.fileOrCaseId,
          toFileOrCaseId:this.relaEdge.to.fileOrCaseId,
          filter: this.date,
          edgeType: this.oldedgeType,
        }),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        bank:(this.$refs.timeLine.activeKey || this.labels[0].value)
      };
      this.renderDate(parmas, false);
    }
  }
};
</script>
<style lang="less">
.rela-detail-img {
  display: flex;
  justify-content: space-around;
  width: 90%;
  margin: 0 auto;
  dl {
    width: 33%;
    text-align: center;
    &.rela-detail-person {
      dt {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        overflow: hidden;
        display: inline-block;
        img {
          width: 100%;
        }
      }
      dd {
        font-size: 18px;
        color: #4b4b4b;
        padding-top: 10px;
      }
    }
    &.is-long-text {
      dd {
        font-size: 12px;
      }
    }
    &.rela-detail-chart {
      dt {
        font-size: 24px;
        color: #2f90e9;
        // padding: 20px 0 4px 0;
        // width: 70px;
      }
      dd {
        color: #8c8c8c;
      }
    }
    &.rela-no-intimacy {
      // width: 90px;
      padding-top: 20px;
      dt {
        margin-bottom: 6px;
        color: #3b99fc;
        font-size: 12px;
        font-weight: normal;
      }
      dd {
        position: relative;
        .dealFrequency-arrow {
          &:nth-child(1) {
            position: absolute;
            height: 2px;
            width: 70px;
            background: #3b99fc;
            top: 1px;
            left: 15px;
            &::after {
              position: absolute;
              display: block;
              content: "";
              height: 2px;
              width: 10px;
              background: #3b99fc;
              top: -2px;
              right: 0px;
              transform: rotate(30deg);
            }
          }
          &:nth-child(2) {
            position: absolute;
            height: 2px;
            width: 70px;
            background: #3b99fc;
            top: 5px;
            left: 15px;
            &::after {
              position: absolute;
              display: block;
              content: "";
              height: 2px;
              width: 10px;
              background: #3b99fc;
              top: 2px;
              left: 0px;
              transform: rotate(30deg);
            }
          }
        }
        .dealFrequency-to-num {
          color: #3b99fc;
          position:absolute;
           top: 12px;
          left: 42px;
        }
        .dealFrequency-icon {
          // width: 80%;
          // height: 3px;
          fill: #3b99fc;
          font-size: 30px;
          &:nth-child(1) {
            position: absolute;
            top: 1px;
            left: 15px;
          }
          &:nth-child(2) {
            position: absolute;
            top: 9px;
            left: 15px;
          }
        }
      }
      // padding: 0 10px;
    }
  }
}
.rela-detail-info {
  margin-top: 18px;
  border-top: 1px dashed #dedede;
}
.timeline-detail-ct {
  margin-top: 70px;
  position: relative;
  height: calc(~"100% - 330px");
  overflow: hidden !important;
}
.info-count-detail {
  .timeline-detail-ct {
    height: calc(~"100% - 290px");
  }
}
.timeline-height-control {
  width: 305px;
  margin: 0 auto;
  .box-card {
    margin-bottom: 15px;
    .el-card__header {
      padding: 8px 20px;
    }
    .el-card__body {
      padding: 8px 20px;
    }
  }
}
.time-line-ct {
  .ivu-timeline-item-content {
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #8c8c8c;
    }
  }
  .ivu-timeline-item-tail {
    border-left: 1px #3b99fc dotted;
  }
}
.total-deal {
  position: absolute;
  background: #fafafa;
  padding-top: 6px;
  padding-bottom: 6px;
  margin: 0;
  width: 100%;
  top: -15px;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: #f2f2f2;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
  color: #808080;
  overflow: hidden;
  height: 35px;
  white-space: nowrap;
  span {
    position: absolute;
    white-space: nowrap;
  }
}
.time-line-wrap {
  .ivu-timeline {
    margin-top: 20px;
    left: 24px;
    .time-line-ct:last-child {
      .ivu-timeline-item-tail {
        display: block;
      }
    }
  }
  .ivu-tabs-nav-container {
    .ivu-tabs-nav-scrollable {
      width: 90%;
      padding-left: 18px;
    }
    .ivu-tabs-nav-prev {
      top: 3px;
      color: #ccc;
    }
    .ivu-tabs-nav-next {
      // right: 23px;
      top: 3px;
      color: #ccc;
      cursor: pointer;
      z-index: 99;
    }
  }
}
</style>



