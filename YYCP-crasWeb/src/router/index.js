import Vue from 'vue';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import { routers, otherRouter, appRouter,newRouter } from './router';
import api from '@/fetch/api';
import store from '@/store/index.js';
import Main from '@/views/Main.vue';
import { storage } from '@/libs/common/common.js'



// import './js1'


const lazyLoading = (name) => () => import(`@/views${name}.vue`)
Vue.use(VueRouter);
// 路由配置
const RouterConfig = {
  routes: routers
};
export const router = new VueRouter(RouterConfig);

// app刷新的时候从本地缓存加载动态菜单

router.beforeEach(async (to, from, next) => {
  //await SetToken.verifySet()
  let isdatanull = JSON.stringify(to.query)=='{}' ? true : false
  // let isdatanull = (storage.get('jsonid') == undefined && storage.get('searid') == undefined && storage.get('dataid') == undefined) ? true : false
  let isCurrDate = (!store.state.jsonid && !store.state.searid && !store.state.dataid) ? true : false
  Util.title(to.meta.title);
  if (to.query.token != null) {
    Cookies.set("token", to.query.token);
    Cookies.set("user", to.query.user);
  }
 if (!Cookies.get('user') && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
    next({
      name: 'login'
    });
  } else if ((Cookies.get('user') && to.name === 'login')) { // 判断是否已经登录且前往的是登录页
    Util.title();
    next({
      name: 'home_index'
    });
  } else if ((to.name === 'gxfxIndex') && isdatanull && isCurrDate) {
    next({
      name: 'home_index'
    });
  } else {

    if (!store.getters.get_menuList.length&&Cookies.get('user')) {
        api.api('post', api.loginUrl + '/login/getTreeResources', {
          clientName: '关系前台系统'
        }).then(res => {
          if (res.length==0||!res) {
              next({
                  name: 'forbid_index'
              });
          }
          let tagsList = []
          res.sort((a,b)=>b.weight-a.weight)
          res.forEach(item => {
            let httpReg = new RegExp("^http[s]?://");
            if (httpReg.test(item.resourceVal)) {
              tagsList.push({
                path: '',
                name: item.resourceName,
                title: item.title,
                resourceId: item.id,
                resourceName: item.resourceName,
                resourceVal: item.resourceVal,
                component: Main,
                children: [{
                  path: `${item.resourceVal}`,
                  title: item.title,
                  name: `${item.resourceName}Index`,
                }]
              })
            } else {
              let tempPath = item.resourceVal.split("/")[2]
              tagsList.push({
                path: '/' + tempPath,
                name: tempPath,
                title: item.title,
                resourceId: item.id,
                resourceName: item.resourceName,
                resourceVal: item.resourceVal,
                component: Main,
                children: [{
                  path: `${tempPath}Manager`,
                  title: item.title,
                  name: `${tempPath}Index`,
                  component: lazyLoading(item.resourceVal)
                }]
              })
            }

          })
          router.options.routes = tagsList
          router.addRoutes(tagsList);
          store.commit('setMymenu', tagsList);
          window.localStorage.setItem('menuList', JSON.stringify(tagsList));
        })
      // }

    }
    next()
  }
});

router.afterEach((to) => {
  Util.openNewPage(router.app, to.name, to.params, to.query);
  window.scrollTo(0, 0);
});
