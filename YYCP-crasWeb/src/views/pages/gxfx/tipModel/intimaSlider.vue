<template>
  <div class="intima-slider">
    <p class="initima-title">亲密度区间</p>
    <p class="step-rangeData">
      {{value9[0]/10}}~{{value9[1]/10}}
    </p>
    <el-slider height='3' v-model="value9" range :max="10" :format-tooltip="formatTooltip">
    </el-slider>

    <ul class="step-tip">
      <li>0</li>
      <li>1</li>
    </ul>
    <dl class="slider-poptip" v-show="ispoptip">
      <div class="poptip-arrow"></div>
      <dt>拖动两点后放开鼠标查看亲密度的范围</dt>
      <dd @click="ispoptip=false">我知道啦</dd>
    </dl>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value9: [0, 10],
      ispoptip:true,
      rangeData:11,
      isSlider:false
    };
  },
  methods: {
    formatTooltip(val) {
      return val / 10;
    }
  },
  mounted() {
    setTimeout(() => {
      this.isSlider=true
    }, 1000);
  },
  watch:{
    value9(val){
      this.isSlider&&this.$emit('SliderRange',val)
    }
  }
};
</script>
<style lang="less">
.intima-slider {
  width: 180px;
  height: 200px;
  position: absolute;
  top: 215px;
  left: 8px;
  z-index: 2;
  .slider-poptip {
    width: 158px;
    height: 80px;
    background: #ffffff;
    box-sizing: border-box;
    padding: 8px;
    border-radius: 8px;
    margin-top: 18px;
    box-shadow: 0px 0px 8px 2px #e4e4e4;
    position: relative;
    margin-left: 15px;
    dt {
      color: #8C8C8C;
      font-size: 14px;
      text-indent: 1.2em;
      font-weight: normal;
    }
    dd {
      text-align: right;
      padding-top: 8px;
      padding-right: 3px;
      cursor: pointer;
      font-size: 14px;
      color: #2D8BE0;
    }
    .poptip-arrow {
      right: 16px;
      top: -5px;
      border-width: 7px 7px 0;
      border-top-color: hsla(0,0%,85%,.5);
      display: block;
      width: 0;
      height: 0;
      position: absolute;
      border-color: transparent;
      border-style: solid;
      &::after {
        display: block;
        width: 0;
        height: 0;
        position: absolute;
        border-color: transparent;
        border-style: solid;
        border-width: 7px;
        content: " ";
        bottom: -1px;
        margin-left: -7px;
        border-top-width: 0;
        border-bottom-width: 18px;
        border-bottom-color: #fff;
        transform: rotate(16deg)
      }
    }
  }
  .initima-title {
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #8c8c8c;
    padding-bottom: 15px;

  }
  .step-rangeData {
    text-align: center;
    color: #0099FF;
  }
  .step-tip {
    display: flex;
    justify-content: space-between;
    width: 180px;
  }
  .el-slider {
    width: 170px;
    margin-left: 5px;
  }
  .el-slider__runway {
    height: 3px;
    color: #3b99fc;
    .el-slider__bar {
      height: 3px;
      background: #3b99fc;
    }
    // margin: 10px 0;
    .el-slider__button-wrapper {
      top: -16px;
      .el-slider__button {
        border: 1px solid #3b99fc;
        position: relative;
        &::before {
          width: 12px;
          height: 12px;
          position: absolute;
          top: 1px;
          left: 1px;
          content: "";
          display: block;
          background: #3b99fc;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
