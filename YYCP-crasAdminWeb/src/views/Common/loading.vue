<template>
<div v-loading.fullscreen="isLoading"
    v-if="isLoading"
    element-loading-text=loadingText
    element-loading-spinner=chinaOlyGif
    element-loading-background=maskStyle
    element-loading-custom-class=customClass
>
<!-- <img :src="" alt=""> -->
<slot></slot>
</div>
</template>
<script>
export default {
  props:{
    isLoading:{
      type:Boolean,
      default:false
    },
    loadingText:{
      type:String,
      default:'加载中...'
    },
    maskStyle:{
      type:String,
      default:'rgba(255, 255, 255, 0.8)'
    },
    chinaOlyGif:{
      type:String,
      default:"loading-img"
    },
    customClass:{
      type:String,
      default:"loading-ct"
    }
  },
  data(){
    return {
      // imgUrl:
    }
  }
}
</script>
<style lang="less">
  .loading-ct {
    .el-loading-spinner {
      .loading-img {
        display: inline-block;
        background:url(../../images/loading-logo.gif) no-repeat ;
        background-size:cover;
        height: 80px;
        width: 80px;
      }
    }
  }
</style>




