import Main from '@/views/Main.vue';

export const loginRouter = [{
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () =>
        import ('@/views/login.vue')
    }
];

export const otherRouter = {

    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [{
        path: 'home',
        title: '首页',
        name: 'home_index',
        component: () =>
            import ('@/views/home/home.vue')
    }],

};
export const appRouter = [
    {
    path:'/forbid',
    name:'forbid',
    component:Main,
    children: [{
        path: 'forbid',
        title: '没有权限的过渡页',
        name: 'forbid_index',
        component: () =>
            import ('@/views/home/forbid.vue')
    }]

    }
];

export const routers = [
    ...loginRouter,
    otherRouter,
    ...appRouter
];
