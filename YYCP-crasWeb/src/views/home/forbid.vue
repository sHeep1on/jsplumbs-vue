<style lang="less">
@import "./home.less";
</style>
<template>
  <div>
    <div class="tip-login-out">
      <p style=""> 欢迎来到网贷平台案件数据分析研判辅助工具</p>
      <span>抱歉，您未被管理员赋予该系统权限，系统将于<em>{{count}}s</em>后退出</span>
    </div>

  </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
  name: 'home',
  components: {

  },
  data () {
    return {
      count: 5,
      //configData:configData

    };
  },
  mounted () {
    this.handleReduce()
  },
  computed: {

  },
  methods: {
    handleReduce () {
      let timer = setInterval(() => {
        this.count--
        if (this.count == 0) {
          clearInterval(timer)
          this.$router.push({ path: '/login' })
          Cookies.remove('user')
        }
      }, 1000)
    }
  }
};
</script>
<style lang="less">
.single-page-con {
  .single-page {
    .tip-login-out {
      text-align: center;
      padding-top: 200px;
      p {
        font-size: 32px;
        line-height: 2.7;
      }
      span {
        font-size: 16px;
        color: #397cbf;
        em {
          color: #f56c6c;
        }
      }
    }
  }
}
</style>

