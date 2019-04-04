import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import personal from './modules/personal'
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        count: 1,
        loc: location.protocol + '//' + location.host + location.pathname,
    },
    mutations: {
        setCount(state, payload) {
            state.count = payload;
        },
    },
    actions: {
        setC({commit}) {
            commit('setCount')
        }
    },
    modules: {
        app,
        user,
        personal
    }
});

export default store;
