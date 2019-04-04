import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import user from './modules/user';
import personal from './modules/personal';
import file from './modules/filedata'
Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        count: 1,
        loc: location.protocol + '//' + location.host + location.pathname,
        jsonid: '',
        searid: '',
        dataid: '',
        loading: false
    },
    mutations: {
        setCount (state, payload) {
            state.count = payload;
        },
        setJsonid (state, jsonid2) {
            state.jsonid = jsonid2;
        },
        setSearid (state, searid2) {
            state.searid = searid2;
        },
        setDataid (state, dataid2) {
            state.dataid = dataid2;
        },
        saveLoading(state,payload){
            state.loading = payload;
        }
    },
    actions: {
        setC ({commit}) {
            commit('setCount');
        }
    },
    modules: {
        app,
        user,
        personal,
        file
    }
});

export default store;
