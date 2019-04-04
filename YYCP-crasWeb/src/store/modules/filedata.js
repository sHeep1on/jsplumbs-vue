import _default from "vuex";

const file = {
  state: {
    fileData: {},
    imgFileData: {},
    setSearchData: {},
    caseFile:{},
    graphObj: null,
    isChange: false,
    isSveDia: {
      isShow: false,
      path: null,
    },
    isForceActive: false
  },
  getters: {
    file_data: state => state.fileData,
    img_file_data: state => state.imgFileData,
    search_data: state => state.setSearchData,
    case_file:state => state.caseFile,
    graph_obj: state => state.graphObj,
    is_change_graph: state => state.isChange,
    toggle_is_save: state => state.isSveDia,
    is_force_active: state => state.isForceActive
  },
  mutations: {
    FILE_DATA(state, res) {
      state.fileData = res
    },
    IMG_FILE_DATA(state, res) {
      state.imgFileData = res
    },
    SEARCH_DATA(state, res) {
      state.setSearchData = res
    },
    CASE_FILE(state, res){
      state.caseFile = res
    },
    GRAPH_OBJ(state, res) {
      state.graphObj = res
    },
    IS_CHANGE_GRAPH(state, res) {
      state.isChange = res
    },
    TOGGLE_IS_SAVE(state, res) {
      state.isSveDia.isShow = res.isShow;
      state.isSveDia.path = res.path
    },
    IS_FORCE_ACTIVE(state, res) {
      state.isForceActive = res
    }
  },
  actions: {
    setFileData({ commit }, val) {
      commit('FILE_DATA', val)
    },
    setImgFileData({ commit }, val) {
      commit('IMG_FILE_DATA', val)
    },
    setSearchData({ commit }, val) {
      commit('SEARCH_DATA', val)
    },
    setCaseFile({ commit },val){
      commit('CASE_FILE', val)
    },
    saveGraphObj({ commit }, val) {
      commit('GRAPH_OBJ', val)
    },
    isChangeGraph({ commit }, val) {
      commit('IS_CHANGE_GRAPH', val)
    },
    toggleIsSave({ commit }, val) {
      commit('TOGGLE_IS_SAVE', val)
    },
    isForceActive({ commit }, val) {
      commit('IS_FORCE_ACTIVE', val)
    }
  }
}
export default file;