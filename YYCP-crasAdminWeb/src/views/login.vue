

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <!-- <div class="main-header-bg">
            <img src="../images/login/logo_image.png"  class="header-logo"/>
            <img src="../images/logo_head.png"  class="header-logo"/>
            <div class="header-title">
                <p class="header-title-name">资金数据分析平台</p>
                <p class="header-title-name">中奥关系分析管理中心</p>
                <p>Relationship Map</p>
            </div>
        </div> -->
        <div class="login-ct">
        <div class="login-con">
            <p class="login-title">
               <!-- <img src="../images/login/logo_image.png"/> -->
               <!-- <img src="../images/logo_head.png"/> -->
                <span > {{config.title}}</span>
            </p>
            <div id="passwordlogin" class="form-con">
                <Form ref="loginForm" :model="form" :rules="rules" class="loginform">
                    <div class="user-name">
                        <FormItem prop="userName" class="user-name-ct">
                            <Input v-model="form.userName" placeholder="请输入用户名" clearable :maxlength="50">
                                <span slot="prepend">
                                    <Icon :size="16" type="person" color='#57a3f3' slot="prepend"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                    </div>
                    <FormItem prop="password">
                        <Input type="password" v-model="form.password" placeholder="请输入密码" clearable>
                        <span slot="prepend">
                            <Icon :size="14" type="locked" color='#57a3f3'></Icon>
                        </span>
                        </Input>
                    </FormItem>
                    <!-- <FormItem prop="identicode">
                        <Input v-model="form.identicode" placeholder="请输入验证码">
                        <span slot="prepend">
                            <Icon :size="14" type="checkmark-round" color='#57a3f3'></Icon>
                        </span>
                        </Input>
                        <img class="edit-captcha" @click="editCaptcha" :src="captcha"/>
                    </FormItem> -->
                    <div class="button-ct">
                        <Button @click="handleSubmit" type="primary" long>登录</Button>
                    </div>
                </Form>
            </div>
        </div>
        <div class="login-footer">
            <i></i> &copy; 2018 chinaoly.com  杭州中奥科技有限公司版权所有 0571-87397108 400-608-7108
        </div>
     </div>
    </div>

</template>

<script>
    import api from '@/fetch/api'
    import Cookies from 'js-cookie'
    import {router} from '@/router/index'
    import {isHadBlank} from '@/libs/common/check.js'
    import store from '@/store'
    import axios from 'axios'
    var bcrypt = require('bcryptjs')
    export default {
        data() {
            const validatePass = (rule, value, callback) => {
                if(value.length < 6) {
                    callback(new Error('密码不少于6位'));
                } else {
                    callback();
                }
            };
            return {
                form: {
                    userName: '',
                    password: '',
                    identicode: ''
                },
                roleList:[
                    {label:'管理员',value:'1'},
                    {label:'用户',value:'2'},
                ],
                rules: {
                    userName: [
                        {required: true, message: '账号不能为空', trigger: 'blur'},
                         {
                            validator: isHadBlank,
                        }
                    ],
                    password: [
                        {required: true, message: '密码不能为空', trigger: 'blur'},
                        {
                            validator: validatePass,
                        }
                    ],
                    identicode: [
                        {required: true, message: '验证码不能为空', trigger: 'blur'}
                    ]
                },
                imgs: '',
                kpi: 'none',
                pass: 'block',
                passcolor: 'white',
                kpicolor: '#57a3f3',
                passborder: '1px solid #57a3f3',
                kpiborder: 'none',
                captcha: ''
            };
        },
        created() {

        },
        mounted() {
            //this.editCaptcha();
            window.sessionStorage.setItem('menu', '')
            Cookies.set('token', '');
            this.$store.commit('setMymenu', [])
        },
        methods: {
            editCaptcha() {
                this.captcha = api.loginUrl + '/login/check?t=' + Math.random();
            },
            handleSubmit() {
                this.$refs.loginForm.validate(valid => {
                    var salt = bcrypt.genSaltSync(10)
                    var hash = bcrypt.hashSync(this.form.password, salt)
                    if (valid) {
                    axios({
                        method: "post",
                        url: api.loginUrl + '/login/authOrEncry?username=' + this.form.userName + '&password=' + hash
                    }).then(res => {
                        if (res.data.code == 200) {
                            Cookies.set("token", res.data.data);
                            Cookies.set("user", this.form.userName);
                            this.$store.commit("updateMenulist", []);
                            this.$router.push({
                            path: "/sourcedata/sourcedataManager"
                            });
                        } else {
                            this.$message.error(res.data.message);
                            //this.editCaptcha();
                        }
                    })
                }
            })
            },
            kpishows() {
                this.kpi = 'block';
                this.pass = 'none';
                this.kpicolor = 'white';
                this.passcolor = '#57a3f3';
                this.kpiborder = '1px solid #57a3f3';
                this.passborder = 'none';
            },
            passwordshows() {
                this.pass = 'block';
                this.kpi = 'none';
                this.kpicolor = '#57a3f3';
                this.passcolor = 'white';
                this.kpiborder = 'none';
                this.passborder = '1px solid #57a3f3';
            }
        }
    };
</script>

<style lang="less">
    @import './login.less';
    .main-header-bg {               //logo
        width: 300px;
        height: 60px;
        display: flex;
        .header-logo{
            width:45px;
            height:40px;
            float: left;
            margin: 11px 14px 0 20px;
        }
        .header-title {
            color: #fff;
            float: left;
            font-size: 11px;
            p{
                line-height: 35px;
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


