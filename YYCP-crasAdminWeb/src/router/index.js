import Vue from 'vue';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import { routers, otherRouter, appRouter } from './router';
import api from '@/fetch/api';
import store from '@/store/index.js';
import Main from '@/views/Main.vue';
const lazyLoading = name => () => import(`@/views${name}.vue`);

Vue.use(VueRouter);
// 路由配置
const RouterConfig = {
    routes: routers
};

export const router = new VueRouter(RouterConfig);
const menu = store.state.menuList;
// app刷新的时候从本地缓存加载动态菜单
if (menu) {
    store.commit('setMymenu', JSON.parse(menu));
    store.commit('updateMenulist');
}
router.beforeEach((to, from, next) => {
    Util.title(to.meta.title);
    if (to.query.token != null) {
        Cookies.set('token', to.query.token);
        Cookies.set('user', to.query.user);
    }
    if (!Cookies.get('user') && to.name !== 'login') {
        // 判断是否已经登录且前往的页面不是登录页
        //window.location.href = "http://192.168.0.71:8088/#/login?outPath="+window.location.href
        next({
            name: 'login'
        });
    } else {
        if (Cookies.get('user')) {
            api.api('post', api.loginUrl + '/login/getTreeResources', {
                clientName: '关系系统'
            }).then(res => {
                if (res.length == 0) {
                    next({
                        name: 'forbid_index'
                    });
                }
                let tagsList = [];
                let manager = {
                    path: '/Manager',
                    name: 'Manager',
                    component: Main,
                    children: []
                };
                tagsList.push(manager);

                const nestFn = (menu, list) => {
                    menu.forEach(item => {
                        let obj = {
                            path: `${item.resourceName}`,
                            title: item.title,
                            name: `${item.resourceName}`,
                            component: lazyLoading(item.resourceVal)
                        };
                        list.push(obj);
                        item.children.length > 0 && (obj.children = []);
                        nestFn(item.children, obj.children);
                    });
                };
                nestFn(res, manager.children);
                router.addRoutes(tagsList);
                store.commit('setMymenu', tagsList);

                window.localStorage.setItem(
                    'menuList',
                    JSON.stringify(tagsList)
                );
            });
        }
        next();
    }
});

router.afterEach(to => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    window.scrollTo(0, 0);
});
