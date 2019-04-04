<template>
  <transition name="fade">
    <li class="mxfxli" v-show="isShow" v-chinaOlyloading.fullscreen="spinShow">
      <div class="mxfx">
        <div class="xq-personal2">
          <p>模型分析</p>
        </div>
        <div class="model-analysis-ct">
          <Form :model="AlipaymodelForm" ref="AlipaymodelForm">
            <FormItem label="模型类型:" prop="AnalyType" class="model-analysis-form">
              <Select v-model="AlipaymodelForm.AnalyType" prop="AnalyType" @on-change="handleModleType">
                <Option v-for="item in AnalyTypeOption" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <div class="deal-sum-ct" v-for='(item,index) in ModelData'>
              <div class="meodel-analy-title">{{item.basicProp||item.statisticalProp}}:</div>
              <div class="model-analy-form-item" v-if="(item.basicPropFormatType||item.statisticalPropFormatType)=='1'||(item.basicPropFormatType||item.statisticalPropFormatType)=='5'">
                <FormItem prop='onlyNum'>
                  <Input ref='onlyNum' placeholder="0.00" @on-change='handleInput' @on-focus='handleFocus' @on-blur='handleBlur' :number='true' :max="1000000000000000" :min="0" v-model="item.form.dealRangeMin"></Input>
                </FormItem>
                <div class="deal-sum-to-text">至</div>
                <FormItem>
                  <Input ref='onlyNum' placeholder="0.00" @on-change='handleInput' @on-focus='handleFocus' @on-blur='handleBlur' :number='true' :max="1000000000000000" :min="0" v-model="item.form.dealRangeMax"></Input>
                </FormItem>
                <div class="deal-sum-to-text" v-if="(item.basicPropFormatType||item.statisticalPropFormatType)=='5'">万元</div>
              </div>
              <div class="model-analy-form-item" v-if="(item.basicPropFormatType||item.statisticalPropFormatType)=='0'">
                <FormItem class="integer-num">
                  <i-switch v-model="item.form.integerNum">
                  </i-switch>
                </FormItem>
              </div>
              <div class="model-analy-form-item" v-if="(item.basicPropFormatType||item.statisticalPropFormatType)=='2'">
                <FormItem class="deal-frequency">
                  <Select v-model="item.form.dealFrequency">
                    <Option v-for="item in dealFrequencyOption" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
                <FormItem class="deal-frequency-number">
                  <InputNumber placeholder="0" :max="10000000000000" :min="0" v-model="item.form.DealNum" class="jypl"></InputNumber>
                </FormItem>
              </div>
              <div class="model-analy-form-item" v-if="(item.basicPropFormatType||item.statisticalPropFormatType)=='3'">
                <FormItem class="model-analysis-form-time">
                  <DatePicker ref='dateInput' format='yyyy-MM-dd' v-model="item.form.dealDate" type="daterange" placeholder="请选择日期范围"></DatePicker>
                </FormItem>
              </div>
              <div class="model-analy-form-item" v-if="(item.basicPropFormatType||item.statisticalPropFormatType)=='4'">
                <FormItem class="model-analysis-form-time">
                  <TimePicker v-model="item.form.dealTime" type="timerange" placement="bottom-end" placeholder="选择时间范围"></TimePicker>
                </FormItem>
              </div>
            </div>
          </Form>
        </div>
        <span class="input-tooltip" v-show='isShowPop' v-html="popperText"></span>
        <div class="mxfxstart">
          <span @click="reSetAnaly">重置条件</span>
          <span @click="startfx">开始分析</span>
        </div>
      </div>
    </li>
  </transition>
</template>
<script>
import Popper from "popper.js";
import api from "@/fetch/api";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  inject: {
    graphMap: {
      default: ""
    }
  },
  data() {
    return {
      AlipaymodelForm: {
        AnalyType: "涉毒模型",
        //onlyNum
      },
      ModelTypeValue: "1",
      spinShow: false,
      //"支付宝模型",
      AnalyTypeOption: [],
      dealFrequencyOption: [
        { label: ">", value: "gt" },
        { label: "≥", value: "gte" },
        { label: "=", value: "eq" },
        { label: "<", value: "lt" },
        { label: "≤", value: "lte" }
      ],
      propList: null,
      statPropList: null,
      isShowInteger: false,
      ModelData: [],
      traceObj: null,
      orginData: [],
      popper: null,
      popperText: 10000000,
      isShowPop: false
    };
  },
  computed: {
    isShowType() {
      return this.ModelTypeValue == "1" ? true : false;
    }
  },
  watch: {
    isShow() {
      this.orginData.length == 0 && this.resetDate();
    }
  },
  methods: {
    handleBlur(e) {
      if (this.popper !== null && this.popper.reference == e.target) {
        this.isShowPop = false;
        this.popper.destroy();
      }
    },
    handleFocus(e) {
      this.handleTipPop(e);
    },
    handleInput(e, val) {
      this.handleTipPop(e);
    },
    handleTipPop(e) {
      let tooltip = document.querySelector(".input-tooltip");
      if (this.popper !== null && this.popper.reference == e.target) {
        this.popperText = this.popperText = e.target.value;
        if (this.popper) {
          this.popper.update();
        }
      } else {
        if (e.target.value !== "") {
          this.popper = new Popper(e.target, tooltip, {
            placement: "top"
          });
          this.popperText = e.target.value;
          this.popper.update();
          this.isShowPop = true;
        }
      }
    },
    handleModleType(id) {
      api
        .api("post", api.loginUrl2 + "/t/model/prop/selectTree", {
          modelId: id
        })
        .then(res => {
          this.orginData = res;
          this.handleModelFormat(res);
        });
    },
    handleModelFormat(data) {
      let arr = [];
      data.forEach(item => {
        arr = arr.concat(item[item.key]);
      });
      arr.map(item => {
        switch (item.basicPropFormatType || item.statisticalPropFormatType) {
          case "0":
            item.form = { integerNum: false };
            break;
          case "1":
            item.form = { dealRangeMin: "", dealRangeMax: "" };
            break;
          case "2":
            item.form = { dealFrequency: "gte", DealNum: 1 };
            break;
          case "3":
            item.form = { dealDate: [] };
            break;
          case "4":
            item.form = { dealTime: [] };
            break;
          case "5":
            item.form = { dealRangeMin: "", dealRangeMax: "" };
            break;
        }
      });
      this.ModelData = arr;
      this.$nextTick(() => {
        this.$refs.onlyNum.forEach(item => {
          let input = item.$el.querySelector('input')
          input.setAttribute('type', 'number')
        })
      })
    },
    handleDate(value) {
      let arr = [];
      if (value[0] == "") {
        return arr;
      }
      arr[0] = Date.parse(value[0]) / 1000;
      arr[1] = Date.parse(value[1]) / 1000 + 86399;
      return arr;
    },
    handleDealTime(value1) {
      let value = [];
      if (value1[0] == "") {
        return value;
      }
      value = JSON.parse(JSON.stringify(value1));
      var s = "";
      var hour = value[0].split(":")[0];
      var min = value[0].split(":")[1];
      var sec = value[0].split(":")[2];
      var s2 = "";
      var hour2 = value[1].split(":")[0];
      var min2 = value[1].split(":")[1];
      var sec2 = value[1].split(":")[2];
      s = Number(hour * 3600000) + Number(min * 60000) + Number(sec * 1000);
      s2 = Number(hour2 * 3600000) + Number(min2 * 60000) + Number(sec2 * 1000);
      value[0] = s;
      value[1] = s2;
      return value;
    },
    reSetAnaly() {
      this.ModelData = [];
      this.$nextTick(() => {
        this.handleModelFormat(this.orginData);
      });
      if (this.traceObj == null) {
        return;
      }
      graph.clear();
      graph.parseJSON(this.traceObj);
      let reDrawImage = graph._l1Model._k2.filter(
        i => i instanceof Q.Node && !i.suo
      );
      reDrawImage.map(item => {
        this.graphMap.reSetImg2(item.oldImage).then(res => {
          item.image = res;
        });
        item.oldImage = this.graphMap.filterImg(item.oldImage);
      });
      this.traceObj = null;
    },
    resetDate() {
      this.initModelType();
      this.ModelData = [];
    },
    initModelType() {
      api.api("post", api.loginUrl2 + "/t/model/queryList").then(res => {
        this.AnalyTypeOption = res;
        this.handleDefault(this.AnalyTypeOption);
      });
    },
    handleDefault(list) {
      this.AlipaymodelForm.AnalyType = list.find(
        i => i.name == "银行卡模型"
      ).id;
      this.handleModleType(this.AlipaymodelForm.AnalyType);
    },
    handleDealRange(item) {
      let moneyArr = [];
      if (item.form.dealRangeMin !== "" || item.form.dealRangeMax !== "") {
        item.form.dealRangeMin!==''?(moneyArr.push((item.basicPropFormatType||item.statisticalPropFormatType) == '5' ? `${Number(item.form.dealRangeMin)*10000}` : item.form.dealRangeMin)):moneyArr.push('')
        item.form.dealRangeMax!==''?(moneyArr.push((item.basicPropFormatType||item.statisticalPropFormatType) == '5' ? `${Number(item.form.dealRangeMax)*10000}` : item.form.dealRangeMax)):moneyArr.push('')
      }
      return moneyArr;
    },
    handleAlipayData() {
      this.propList = [];
      this.statPropList = [];
      this.ModelData.forEach(item => {
        if(this.handleResaplt(item)){
          item.basicPropFormatType && this.propList.push(item.value);
          item.statisticalPropFormatType && this.statPropList.push(item.value);
        }
      });
    },
    handleResaplt(item) {
      let FormatType = item.basicPropFormatType || item.statisticalPropFormatType;
      switch (FormatType) {
        case "0":
          item.value = {
            propId: item.basicPropId || item.statisticalPropId,
            propType: item.form.integerNum ? "lt":"lte",
            values: [3]
          };
          return  item.form.integerNum?true:false
          break;
        case "1":
          item.value = {
            propId: item.basicPropId || item.statisticalPropId,
            propType: "between",
            values: this.handleDealRange(item)
          };
          break;
        case "5":
          item.value = {
            propId: item.basicPropId || item.statisticalPropId,
            propType: "between",
            values: this.handleDealRange(item)
          };
          break;
        case "2":
          item.value = {
            propId: item.basicPropId || item.statisticalPropId,
            propType: item.form.dealFrequency,
            values: [item.form.DealNum]
          };
          break;
        case "3":
          let dealDate = this.handleDate(item.form.dealDate);
          item.value = {
            propId: item.basicPropId || item.statisticalPropId,
            propType: "between",
            values: dealDate[0] == null ? [] : dealDate
          };
          break;
        case "4":
          let dealTime = this.handleDate(item.form.dealTime);
          item.value = {
            propId: item.basicPropId || item.statisticalPropId,
            propType: "between",
            values: dealTime[0] == null ? [] : dealTime
          };
          break;
      }
      return true
    },
    startfx() {
      this.spinShow = true;
      var aa = graph._l1Model._k2;
      var edgearrId = [];
      aa.forEach(s => {
        if (s instanceof Q.Edge) {
          s.idArr.forEach(ss => {
            edgearrId.push(ss);
          });
        }
      });
      edgearrId = edgearrId.join(",");
      this.handleAlipayData();
      api
        .api("post", api.loginUrl2 + "/canvasModel/modelFilter", {
          jsonData: JSON.stringify({
            data: {
              _className: "Q.Edge",
              idArr: edgearrId
            },
            propList: this.propList,
            statPropList: this.statPropList
          })
        })
        .then(res => {
          if (res.edge.length == 0 && res.node.length == 0) {
            this.$notify.info({
              title: "提示",
              message: "符合模型条件结果为空"
            });
            this.spinShow = false;
            return;
          }
          var aa = graph._l1Model._k2;
          let replaceImage = aa.filter(
            item => item instanceof Q.Node && !item.suo
          );
          replaceImage.map(item => (item.image = item.oldImage));
          this.traceObj = graph.exportJSON(true);

          aa.map((item, index, arr) => {
            setTimeout(() => {
              if (item instanceof Q.Edge) {
                if (res.edge.indexOf(item.absId) == -1) {
                  graph.graphModel.remove(item);
                }
                // else if (item.arrow !== '3') {
                //   item.setStyle(Q.Styles.ARROW_TO, true)
                //   item.setStyle(Q.Styles.ARROW_TO_OUTLINE, null)
                //   item.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, "#ccc")
                // }

              }
            },0);
          });
          aa.map((item, index, arr) => {
            setTimeout(() => {
              if (  item instanceof Q.Node &&  res.node.indexOf(item._refId) == -1) {
                graph.graphModel.remove(item);
              }
            },0);
          });
          setTimeout(() => {
            this.spinShow = false;
          }, 1000);

        })
        .catch(error => {
          this.spinShow = false;
        });

    }
  }
};
</script>
<style lang="less">
.input-tooltip {
  padding: 3px 8px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border-radius: 5px;
  margin-bottom: 5px;
  margin-right: 10px;
  position: absolute;
  top: -5000px;
}
.model-analysis-ct {
  padding-top: 20px;
  .model-analysis-form {
    display: flex;
    .ivu-form-item-content {
      width: 228px;
      .ivu-select {
        margin: 1px 0px 0px 0px;
      }
    }
  }

  .meodel-analy-title,
  .ivu-form-item-label {
    padding: 11px 12px 13px 15px;
    font-weight: normal;
    font-size: 14px;
    color: #4b4b4b;
  }
  .meodel-analy-title {
    padding-top: 8px;
  }
  .deal-sum-ct {
    display: flex;
    padding-bottom: 9px;
    .model-analy-form-item {
      display: flex;
      // width: 280px;
    }
    & .ivu-form-item:not(.integer-num) {
      .ivu-form-item-content {
        width: 80px;
        height: 30px;
      }
    }

    .deal-sum-to-text {
      padding: 8px 6px;
    }
    .integer-num {
      .ivu-form-item-content {
        width: 160px;
        margin-top: 2px;
        .ivu-checkbox-wrapper {
          margin: 0;
        }
      }
    }
    .model-analysis-form-time.ivu-form-item {
      .ivu-form-item-content {
        width: 240px;
        .ivu-date-picker {
          width: 90%;
        }
      }
    }
    .ivu-form-item.deal-frequency {
      // padding-top: 2px;
      .ivu-form-item-content {
        width: 110px;
      }
    }
    .ivu-form-item.deal-frequency-number {
      .ivu-form-item-content {
        // padding-top: 10px;
      }
    }
  }
  .jyje {
    width: 100%;
  }
}
</style>

