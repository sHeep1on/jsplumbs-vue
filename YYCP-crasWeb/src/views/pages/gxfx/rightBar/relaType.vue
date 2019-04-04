<template>
  <transition name="fade">
    <li class="gxlxli" v-show="isShow" v-chinaOlyloading.fullscreen="spinShow">
      <div class="gxlx query-analysis-wr">
        <div class="xq-personal">
          <p>查询分析
          </p>
        </div>
        <div class="query-analysis">
          <div class="query-analysis-title">
            <el-select v-model="analysisTitle" placeholder="请选择" size='small' @change='changeAnalysisSelect'>
              <el-option v-for="item in analysisSelect" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="analysis-content-ct">
            <div class="analysis-content-wr" v-show="analysisTitle=='0'||analysisTitle=='1'">
              <div class="together-analysis-ct" v-chinaOlyScrollBar>
                <div class="together-analysis-search">
                  <el-input placeholder="请输入搜索的目录" size="small" v-model="filterText">
                  </el-input>
                </div>
                <el-tree :check-strictly='true' show-checkbox default-expand-all @check="checkAnalysis"
                :default-checked-keys="defaultCheck"
                 :expand-on-click-node='false' class="filter-tree" :data="treeData" :filter-node-method="filterNode"
                 node-key="id" :props="defaultProps" ref="tree2">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ data.value||data.name }}</span>
                  </span>
                </el-tree>
              </div>
              <div class="analysis-button">
                <el-button size="small" type="primary" @click="handleAnalysis">分析</el-button>
              </div>
            </div>
            <div class="shortest-path" v-show="analysisTitle=='2'">
              <div class="shortest-path-ct">
                <ul class="shortest-path-select">
                  <li>
                    <el-button size="small" @click="handlePath" :class="{'active-btn':BtnbtnIndex==1}">最短路径</el-button>
                  </li>
                  <!-- <li>
                    <el-button size="small" @click="handlePerson" :class="{'active-btn':BtnbtnIndex==2}">重点人员路径</el-button>
                  </li> -->
                </ul>
                <!-- <div class="shortest-path-reset">
                  <el-button size="small" @click="resetPath()">重置</el-button>
                </div> -->
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="fxstart">
          <span @click="addfx">开始分析</span>
        </div> -->
      </div>
    </li>
  </transition>
</template>
<script>
import api from "@/fetch/api";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    NodeRefIdArr: {
      type: Array,
      default: []
    },
    graphMap: {
      type: Map
    }
  },
  data() {
    return {
      single: false,
      gxlxarrs: [],
      lxarr: [],
      lxarr2: [],
      selectName: "",
      isprimary: false,
      BtnbtnIndex: 0,
      analysisTitle: "1",
      analysisSelect: [
        // { label: "群体分析", value: "0" },
        { label: "共同邻居", value: "1" },
        { label: "最短路径", value: "2" }
      ],
      filterText: "",
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      spinShow: false,
      defaultCheck:[]
    };
  },
  watch: {
    NodeRefIdArr() {
      this.handleAnalysisRelation();
    },
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.value ? (data.value.indexOf(value) !== -1) : (data.name.indexOf(value) !== -1)
    },
    handleAnalysisRelation() {
      if (this.NodeRefIdArr.length < 2) {
        this.treeData = []
        return
      }
      let _refIdArrnew = [];
      this.NodeRefIdArr.forEach(item => {
        _refIdArrnew.push(this.graphMap.get(item)._reftype);
      });
      _refIdArrnew = _refIdArrnew.join(",");
      api.api("post", api.loginUrl2 + "/relation/findCanAnalysisRelation", {
        targets: _refIdArrnew
      }).then(res => {
        this.handleAnalysisData(res)
      }).catch(() => {
      })
    },
    resetPath() {
      this.BtnbtnIndex = 0
      graph.graphModel.selectionModel.clear()
    },
    handlePath() {
      this.pathAnysis(true)
    },
    handlePerson() {
      this.pathAnysis(false)
    },
    pathAnysis(isPath) {
      let resNode = graph.selectionModel.datas.filter(item => item instanceof Q.Node)
      let result = {}
      result.jsonData = JSON.stringify({
        _refId: this.NodeRefIdArr
      })
      if (resNode.length !== 2) {
        this.$notify({
          title: '注意',
          message: isPath ? '最短路径选择对象只能为两个！！' : '人员对象只能为两个！！',
          type: 'warning'
        });
      } else {
        this.BtnbtnIndex = isPath ? 1 : 2
        let params = {
          fromId: resNode[0]._refId,
          toId: resNode[1]._refId,
          caseId:this.$route.query.caseId
        }
        this.spinShow = true;
        api.api('post', api.loginUrl2 + (isPath ? '/queryAnalysis/shortestPath' : '/queryAnalysis/keyPersonnel'), params).then(res => {
          this.$emit('handleExpandData', result, res, false)
          this.spinShow = false;
        }).catch(() => {
          this.spinShow = false;
        })
      }
    },
    handleAnalysisData(data) {
      this.defaultCheck = []
      let res ;
      data.map(item => {
        let children = item[item.key]
        item.children = children
        res = item.children.find(i=>i.name=='交易统计')
        delete item[item.key]
      })
      this.defaultCheck.push(res.id)
      this.treeData = data
    },
    checkAnalysis(node) {
      if (this.$refs.tree2.getCheckedNodes().length == 6) {
        this.$notify({
          title: '注意',
          message: '群体分析的关系不可选择超过5个',
          type: 'warning'
        });
        this.$refs.tree2.setChecked(node, false)
      }
    },
    changeAnalysisSelect() {
      this.$refs.tree2.setCheckedKeys([]);
    },
    handleAnalysis() {
      if (this.$refs.tree2.getCheckedNodes().length == 0) {
        return
      }
      let res = []
      this.$refs.tree2.getCheckedNodes().forEach(item => res.push(item.id))
      var result = {};
      result.jsonData = JSON.stringify({
        _refId: this.NodeRefIdArr,
        edgeType: res,
        caseId:this.$route.query.caseId
      })
      let url = this.analysisTitle == '0' ? '/queryAnalysis/groupAnalytic' : '/queryAnalysis/commNeighbors'
      this.spinShow = true;
      api.api('post', api.loginUrl2 + url, result).then(res => {
        this.$emit('handleExpandData', result, res, false)
        this.spinShow = false;
      }).catch(() => {
        this.spinShow = false;
      })
    }
  }
};
</script>
<style lang="less">
.query-analysis-wr {
  height: 100%;
}
.shortest-path {
  height: 100%;
  .shortest-path-ct {
    height: 100%;
    .el-button--default {
      color: #3b99fc;
      border-color: #3b99fc;
    }
    .shortest-path-select {
      height: calc(~"100% - 90px");
      li {
        text-align: center;
        width: 80%;
        margin: 0 auto;
        padding: 15px;
        .el-button {
          width: 100%;
          font-size: 16px;
          padding: 8px;
          border-radius: 8px;
          color: #3b99fc;
          border-color: #3b99fc;
          &.active-btn {
            background: #3b99fc;
            color: #fff;
          }
        }
      }
    }
    .shortest-path-reset {
      width: 100%;
      text-align: center;
      .el-button {
        padding: 4px 20px;
        font-size: 14px;
      }
    }
  }
}
.query-analysis {
  height: 100%;
  .analysis-content-ct {
    height: calc(~"100% - 90px");
  }
  .analysis-content-wr {
    height: 100%;
  }
  .analysis-button {
    text-align: right;
    padding-right: 16px;
    padding-top: 30px;
    .el-button {
      width: 80px;
      padding: 6px;
      font-size: 14px;
      border-radius: 8px;
    }
  }
  .together-analysis-ct {
    height: calc(~"100% - 90px");
    position: relative;
    overflow: hidden;

    .together-analysis-search {
      padding: 0 20px;
    }
    width: 90%;
    margin: 0 auto;
    padding: 20px 0;
    border: 1px solid #dddcdc;
    border-radius: 8px;
    box-shadow: 0 0 5px 2px RGBA(222, 222, 222, 0.5) inset;
    .el-tree-node__expand-icon {
      display: none;
    }
    .filter-tree {
      box-shadow: inset 5px 0 5px -2px RGBA(222, 222, 222, 0.5),
        inset -5px 0 5px -2px RGBA(222, 222, 222, 0.5);
      & > .el-tree-node {
        border-bottom: 1px #dedede dashed;
        padding: 5px 20px;
        & > .el-tree-node__content {
          .el-checkbox {
            display: none;
          }
        }
      }
    }
  }
  .query-analysis-title {
    text-align: center;
    .el-select {
      width: 110px;
      .el-input__inner {
        border: 0px;
        // padding-left: 0px;
        color: #2f90e9;
      }
      .el-select__caret {
        color: #2f90e9;
      }
    }
  }
}
</style>

