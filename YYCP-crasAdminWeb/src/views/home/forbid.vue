<style lang="less">
@import "./home.less";
</style>
<template>
    <div>
        <div class="tip-login-out">
            <p style=""> 欢迎来到中奥火炬平台-关系系统</p>
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
            count:5
        };
    },
    mounted() {
        this.handleReduce()
    },
    computed: {

    },
    methods: {
        handleReduce(){
            let timer = setInterval(()=>{
                this.count--
                if (this.count==0) {
                    clearInterval(timer)
                    this.$router.push({path:'/login'})
                    Cookies.remove('user')
                }
            },1000)
        }
    }
};
</script>
<style lang="less">
.single-page-con {
    .single-page {
        .tip-login-out{
        position: absolute;
        top:0px;
        bottom:45px;
        text-align: center;
        left:0;
        right:0;
        background:#ffffff;
        p{
            padding-top: 200px;
            font-size: 32px;
            line-height: 2.7;
        }
        span {
            font-size: 16px;
            color:#397CBF;
            em {
                color:#f56c6c;

                }
        }
        }
    }
}

</style>

