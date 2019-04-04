import Vue from 'vue';
import { router } from './router/index';
import { appRouter } from './router/router';
import store from './store';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import iView from 'iview';
import 'iview/dist/styles/iview.css';

import VueI18n from 'vue-i18n';
import * as filters from '@/libs/common/filters.js';
import App from './app.vue';
import instance from '@/fetch/api.js';
// import yycpComponents from '../../../../YYCP-componentsWeb/dist/YycpComponents';
import yycpComponents from 'yycp-components/dist/YycpComponents.js';

Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});
Vue.use(VueI18n);
Vue.use(ElementUI);
Vue.use(iView);
Vue.use(yycpComponents);

Vue.prototype.$axios = instance.instance;
import axios from 'axios'
function getConfigData(){
    return new Promise((resolve,reject)=>{
        axios.get('../config/config.json').then(res=>{
            window.config = res.data
            Vue.prototype.config = window.config
            resolve()
        })
    })
}
(async function() {
    await getConfigData()
    new Vue({
        el: '#app',
        router: router,
        store: store,
        render: h => h(App),
        data: {
            currentPageName: ''
        },
        mounted () {
            this.currentPageName = this.$route.name;
            // 显示打开的页面的列表
            this.$store.commit('setOpenedList');
            this.$store.commit('initCachepage');
            // 权限菜单过滤相关
            this.$store.commit('updateMenulist');
        },
        created () {
            let tagsList = [];
            appRouter.map(item => {
                if (item.children.length <= 1) {
                    tagsList.push(item.children[0]);
                } else {
                    tagsList.push(...item.children);
                }
            });
            this.$store.commit('setTagsList', tagsList);
        }
    });
})()
