import api from '@/fetch/api.js'
const personal = {
    state: {
        personal: {
            userInfo: {},
            roleInfo: [],
        },
        system:{}
    },
    getters: {
        personal_userInfo: state => state.personal.userInfo,
        personal_roleInfo: state => state.personal.roleInfo,
        system_url: state => state.system
    },
    mutations: {
        USER_INFO(state, res) {
            state.personal.userInfo = res
        },
        ROLE_INFO(state, res) {
            state.personal.roleInfo = res
        },
        SYSTEM_URL(state, res) {
            state.system = res;
        }

    },
    actions: {
        getUserInfo({commit}) {
            return new Promise(resolve => {
                api.api('post', api.loginUrl + '/login/getAccount').then(res => {
                    commit('USER_INFO', res)
                    resolve()
                })
            })
        },
        getRoleInfo({commit}) {
            return new Promise(resolve => {
                api.api('post', api.loginUrl + '/login/getRoles').then(res => {
                    commit('ROLE_INFO',res)
                    resolve(res)
                })
            })
        },
        getSystemUrl({commit}, id) {
            return new Promise(resolve => {
                api.api('post', api.dictUrl + '/client/detail',{
                    id: id
                }).then(res => {
                    commit('SYSTEM_URL', res)
                    resolve(res)
                })
            })
        },

    }
}
export default personal;