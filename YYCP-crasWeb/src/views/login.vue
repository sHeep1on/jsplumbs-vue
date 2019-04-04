

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-ct">
      <div class="login-con">
        <p class="login-title">
          <i><img :src="require('../../config/logo_head.png')" class="title-logo" /></i>

          <span>{{config.title}}</span>
          </p>
        <!-- <el-button @click="handlePki">try</el-button> -->
        <div id="passwordlogin" class="form-con">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="账号登录" name="first">
              <Form ref="loginForm" :model="form" :rules="rules" class="loginform">
                <FormItem prop="username" class="user-name-ct">
                  <Input v-model="form.username" class="login-icon" placeholder="请输入用户名" clearable>
                  <span slot="prepend">
                    <Icon type="ios-person" :size="18" color='#57a3f3' />
                  </span>
                  </Input>
                </FormItem>
                <FormItem prop="password">
                  <Input type="password" v-model="form.password" placeholder="请输入密码" class="login-icon" clearable>
                  <span slot="prepend">
                    <Icon :size="16" type="ios-unlock" color='#57a3f3' />
                  </span>
                  </Input>
                </FormItem>
                <div class="button-ct">
                  <Button @click="handleSubmit" type="primary" long>登录</Button>
                </div>
              </Form>
            </el-tab-pane>
            <el-tab-pane label="pki登录" name="second">
              <p class="pki-img" @click="handlePki">
                <img src="../images/login/pkiImg.png" alt="">
              </p>
            </el-tab-pane>

          </el-tabs>

        </div>
      </div>
      <div class="login-footer">
        <span>© 2018 chinaoly.com 杭州中奥科技有限公司版权所有 0571-87397108 400-608-7108</span>
        <!-- 版权所有：杭州市公安局信息经济公安分局&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;技术支持：杭州中奥科技有限公司 -->
      </div>
    </div>
  </div>

</template>

<script>
import api from "@/fetch/api";
import Cookies from "js-cookie";
import { router } from "@/router/index";
import store from "@/store";
import axios from "axios";
var bcrypt = require("bcryptjs");
export default {
  data() {
    return {
      activeName: 'second',
      form: {
        username: "",
        password: "",
        checkCode: "",
        role: null
      },
      roleList: [
        { label: "管理员", value: "1" },
        { label: "用户", value: "2" }
      ],
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码不能为空", trigger: "blur" }]
        // checkCode: [
        //   { required: true, message: "验证码不能为空", trigger: "blur" }
        // ]
      },
      imgs: "",
      kpi: "none",
      pass: "block",
      passcolor: "white",
      kpicolor: "#57a3f3",
      passborder: "1px solid #57a3f3",
      kpiborder: "none",
      captcha: "",
    };
  },
  created() { },
  mounted() {
    window.sessionStorage.setItem("menu", "");
    Cookies.set("token", "");
    this.$store.commit("setMymenu", "");

  },
  methods: {

    // editCaptcha() {
    //   this.captcha = api.loginUrl + "/login/check?t=" + Math.random();
    // },
    handleClick(name) {
      //console.log(name);

    },
    handlePki() {
      window.open(api.loginUrl + "/pki/pkiTest");
      api.api("get", api.loginUrl + "/pki/login")
        .then(res => {
          Cookies.set("token", res);
          this.getUserInfo();
        })
        .catch(error => {
          console.log(error);
        });
    },
    getUserInfo() {
      api.api("post", api.loginUrl + "/login/getAccount").then(res => {
        Cookies.set("user", res.userName);
        this.$store.commit("updateMenulist", []);
        this.$router.push({ path: "/home" });
      });
    },
    handleSubmit() {
      this.$refs.loginForm.validate(valid => {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(this.form.password, salt);
        if (valid) {
          axios({
            method: "post",
            url:api.loginUrl +
              "/login/authNoCode?username=" +this.form.username + "&password=" +hash
          }).then(res => {
            if (res.data.code == 200) {
              Cookies.set("token", res.data.data);
              Cookies.set("user", this.form.username);
             // SetToken.rewriteToken(res.data.data, this.form.username).then(res => {
              this.$store.commit("updateMenulist", []);
              this.$router.push({ path: "/home" });
              //});
            } else {
              this.$message.error(res.data.message);
              // this.editCaptcha();
            }
          });
        }
      });
    },
    kpishows() {
      this.kpi = "block";
      this.pass = "none";
      this.kpicolor = "white";
      this.passcolor = "#57a3f3";
      this.kpiborder = "1px solid #57a3f3";
      this.passborder = "none";
    },
    passwordshows() {
      this.pass = "block";
      this.kpi = "none";
      this.kpicolor = "#57a3f3";
      this.passcolor = "white";
      this.kpiborder = "none";
      this.passborder = "1px solid #57a3f3";
    }
  }
};
</script>

<style lang="less">
@import "./login.less";
.login-icon {
  .ivu-input-group-prepend {
    box-sizing: border-box;
    width: 29px;
    padding-left: 2px;
    padding-top: 0px;
    // padding-top: 3px;
  }
}
.main-header-bg {
  //logo
  //width: 300px;
  height: 60px;
  display: flex;
  .header-logo {
    width: 45px;
    height: 40px;
    float: left;
    margin: 11px 14px 0 20px;
  }
  .header-title {
    color: #fff;
    float: left;
    font-size: 11px;
    p {
      line-height: 20px;
    }
    .header-title-name {
      font-size: 22px;
      margin-top: 14px;
      font-weight: 600;
      margin-bottom: 5px;
    }
  }
}
</style>


