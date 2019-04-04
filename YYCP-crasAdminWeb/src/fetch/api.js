import Cookies from 'js-cookie';
import axios from "axios";
import $ from 'jquery';
import Vue from 'vue';
import qs from 'qs';
import store from '@/store/index.js';
import {Message} from 'element-ui';
let AUTH_TOKEN = (function () {
    return Cookies.get("token");
})();

var instance = axios.create({
    timeout: 5000000,
    headers: {
        "Content-Type": "application/json"
    }
});
instance.defaults.headers.common["Authorization"] = AUTH_TOKEN;
instance.interceptors.request.use(function (config) {
    config.headers.Authorization = Cookies.get("token");
    if (config.method === 'post' || config.method === 'patch') {
        config.data = qs.stringify(config.data)
    }
    return config;
}, function (err) {
    return Promise.reject(err);
});
instance.interceptors.response.use(function (res) {
    if (res.headers.authorization) {
        Cookies.set('token', res.headers.authorization);
    }
    return res;
}, function (err) {
    return err;
});
Vue.prototype.$axios = instance;

export function ajaxApi(method, url, params,callback) {
    return new Promise(function (resolve, reject) {
        var ajaxParams = {};
        if (method === 'post') {
            ajaxParams = {
                method: method,
                url: url,
                data: params,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            }
        } else {
            ajaxParams = {
                method: method,
                url: url,
                data: params
            }
        }
        instance(ajaxParams).then(res => {
            var result = JSON.parse(JSON.stringify(res.data))
            if (result.code == 200) {
                resolve(result.data)
            } else if (JSON.stringify(result)=='{}'||result.code == 20014 || result.code == 20015) {
                $('<p class="goLogin">登录已过期,5秒后进入到登录页面</p>').appendTo('body')
                setTimeout(function () {
                    window.location.href = window.location.protocol + "//" + window.location.host + '/#login';
                    window.location.reload();
                }, 4000)
                Cookies.set('user', '')
                store.commit('setMymenu', '');

            } else {
                if(callback && typeof callback==='function'){
                    reject(callback(result.code))
                }
                Message({
                    type:'warning',
                    message:result.message,
                })
                reject()
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

export function ajaxJson(method, url, data) {
    return new Promise(function (resolve, reject) {
        axios({
            method: method,
            url: url,
            data: data
        }).then(res => {
            if (res.data.code == 200) {
                resolve(res.data.data)
            } else {
                // Vue.prototype.$Message.error(res.data.message);
            }
        }).catch((error) => {
            reject(error)
        })
    })
}

const loginUrl = '/api/v1';
const configUrl = '/api/v2';
const dictUrl = '/api/v3';
const urlImage = '/api/urlImage'
export default {
    api(method, url, params,callback) {
        return ajaxApi(method, url, params,callback)
    },
    json(method, url, params) {
        return ajaxJson(method, url, params)
    },
    loginUrl,
    configUrl,
    dictUrl,
    urlImage
}
