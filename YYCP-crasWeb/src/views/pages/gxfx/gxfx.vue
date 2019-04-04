<template>
  <div id="page" @keyup.17="up" @keydown.17="down" v-chinaOlyloading.fullscreen="spinShow">
    <div v-if="modal5">
      <add-node :visible.sync="modal5" @traceAddNode='traceAddNode'></add-node>
    </div>
    <Modal @on-ok="xjgxok" @on-cancel="xjgxqx" title="新建关系" v-model="modal9" :mask-closable="false">
      <div class="xjgxbox">
        <ul>
          <li v-for="(item,index) in gxlinelx" :key="index">
            <Checkbox v-model="item.check">{{item.name}}</Checkbox>
          </li>
        </ul>
      </div>
    </Modal>
    <div id="right_panel">
      <div style="opacity:0;height:0">
        <ol id="demo_title" class="breadcrumb" style="float: left"></ol>
        <div title="About" id="about" style="float: right;" class="btn btn-sm">About</div>
        <div style="clear:both;"></div>
      </div>
      <div id="graph_panel" class="q-panel">
        <div role="toolbar" class="q-toolbar">
          <div>
            <div id="toolbar"></div>
            <ColorPicker class="toobar-color-picker" ref="ColorPicker" v-model="color5" recommend @on-change="colorChange" @on-open-change="handleexpandColor" />
            <div id="demo_menu" class="q-right">
              <div title="全屏" id="maximize" class="btn btn-default btn-sm">
                <div class="q-icon toolbar-max"></div>
                <span>全屏</span>
              </div>
              <div class="btn btn-default btn-sm zdyadd2" v-clickOutSide='closeAdd'>
                <div @click="wjcxcd2">
                  <div class="q-icon toolbar-addnew"></div>
                  <span>增加</span>
                  <a href="javascript:void(0)">
                    <Icon type="md-arrow-dropdown" />
                  </a>
                </div>
                <transition name="fade">
                  <div class="file-tree" ref="treeCt" v-chinaOlyScrollBar v-show="visible">
                    <div class="to-y-scroll">
                      <el-input @click.stop placeholder="输入关键字进行过滤" size="small" v-model="filterText">
                      </el-input>
                      <el-tree class="filter-tree" :data="pldrarr" :filter-node-method="filterNode" node-key="id" :props="defaultProps" @node-click="wjcxcd" ref="tree2">
                        <span class="custom-tree-node" slot-scope="{ node, data }">
                          <span class="tree-icon-ct" v-show='data.iconPath'><img :src="handleImg(data.iconPath)"></span>
                          <span :title="data.fileName">{{ data.title||data.fileName }}</span>
                        </span>
                      </el-tree>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
        <div class="q-content">
          <div id="canvas" @contextmenu="openContextMenu($event)"></div>
          <div id="overview" style="width: 186px;height: 136px;box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.2);position: absolute;left: 5px;top: 5px;background-color: #fff;"></div>
          <div class="Q-Export-JSON" id="Q-JSON-Panel" style="height: 0px; overflow: hidden;">
            <div style="background: #EEE; position: absolute; top: 50px; bottom: 0px; width: 100%; overflow: auto;">
              <textarea id="json_code_panel" style="height: 100%; width: 100%; border: none;"></textarea>
            </div>
            <div style="padding: 10px; height: 50px; float: right; position: relative;">
              <div id="btnJSONSubmit" class="btn btn-primary btn-sm" title="Submit">Submit</div>
              <div id="btnJSONClose" class="btn btn-primary btn-sm" title="Close">Close</div>
            </div>
          </div>
          <transition name="fade">
            <div class="q-contentRight">
              <ul class="cblnav">
                <li v-for="(item,index) in ycnavarr" :key="index" :title="item.text" @click="handlerightBarShow(index)" :class="{'navactive':index===gaoliang}">
                  <!-- <li v-for="(item,index) in ycnavarr" :key="index" :title="item.text">	 -->
                  <span></span>
                </li>
              </ul>
              <transition name="fade">
                <ul class="xqbox" v-show="xqboxbol==0">
                  <transition name="fade">
                    <span @click="sscdfn" class="cdss">
                      <img :src='require("../../../static/page/images/ssjt.png")' alt="">
                    </span>
                  </transition>
                  <!-- 对象基本信息 -->
                  <basic-info :isShow="xqbol==0" v-loading="basicLoading" :userDetail="userDetail"></basic-info>
                  <li class="gxlxli" v-show="xqbol==5">
                    <rela-detail :isResetDate="xqboxbol==0" :isShow="xqbol==5" :relaType="relaType" :relaEdge="relaEdge" @handleRelaDetail="handleRelaDetail" @nullData="nullData" ref="relaDetail">
                      <p>关系明细</p>
                    </rela-detail>
                  </li>
                  <!-- 信息统计 -->
                  <info-count :isShow="xqbol==1" :graphMap="graphMap" :dataRefId='dataRefId' @updateRoleInfo='updateRoleInfo' :NodeData="NodeData"></info-count>
                  <!-- 关系类型 -->
                  <rela-type :isShow="xqbol==2" :graphMap="graphMap" :NodeRefIdArr="NodeRefIdArr" @handleExpandData="handleExpandData" ref="relaType"></rela-type>
                  <!-- 模型分析 -->
                  <model-analysis ref='modelAnaly' :isShow="xqbol==3"></model-analysis>
                  <!-- 信息备注 -->
                  <transition name="fade">
                    <li class="bzxxli" v-show="xqbol==4">
                      <div class="bqbzxx">
                        <div class="xq-personal2">
                          <p>备注信息</p>
                        </div>
                        <div>
                          <textarea placeholder="最多可输入160字" maxlength="160" name="" id="bzxx" v-model="yhbz3" rows="13"></textarea>
                          <span class="text-count2">{{remnant3}}/160</span>
                        </div>
                        <div class="bzadd">
                          <span class="qkbz" @click="qkallbz">清空备注</span>
                          <span class="tjbz" @click="tjbzbz">添加备注</span>
                        </div>
                      </div>
                    </li>
                  </transition>
                </ul>
              </transition>
            </div>
          </transition>
        </div>
        <!-- 右侧菜单 -->
      </div>
    </div>
    <is-save-com @saveGraph='saveGraph'></is-save-com>
    <Modal width='300' v-model="isNewGraph" title="请慎重选择" @on-ok="handleNewGraph">
      <p>是否新建画布</p>
    </Modal>
    <div v-if="modal6">
      <save-com :visible.sync="modal6" :newGraph.sync="newGraph" :fileInfo.sync="fileInfo" @clearAll="clearAll"></save-com>
    </div>
    <div class="node-tooltip" :style="{top:tooltip.x+'px',left:tooltip.y+'px'}" v-show="tooltip.isShow">{{tooltip.text}}</div>

    <right-menu :event='contextmenuEvent' @addNodeFn='addNodeFn' @deleNodeFn='deleNodeFn' @chearGraph='chearGraph' @handleLock='handleLock' @handleUnlock='handleUnlock' @handleNodeUnfold='handleNodeUnfold' @handleNodeFold='handleNodeFold' @handleSpring='handleSpring' @handleGlaxy='handleGlaxy' @handleFakerTree='handleFakerTree' @handleFlower="handleFlower" @handlePerson='handlePerson' @handleModelAnaly='handleModelAnaly' @handleNodeRemark='handleNodeRemark'></right-menu>
    <!-- <intima-slider @SliderRange='SliderRange'></intima-slider> -->
  </div>
</template>

<script>
import '@/static/page/js/i18n.js?v=2.6.0.4';
import '@/static/page/js/check-IE678.js?v=2.6.0.4';
import '@/static/page/js/bootstrap.min.js?v=2.6.0.4';
import '@/static/page/js/qunee-min2.js?v=2.6.0.4';
import '@/static/page/js/common.js?v=2.6.0.4';
import '@/static/page/js/graphs.js?v=2.6.0.4';
import '@/static/page/js/demo.js?v=2.6.0.4';
import '@/static/page/js/codemirror.js?v=2.6.0.4';
import '@/static/page/js/javascript.js?v=2.6.0.4';
import api from '@/fetch/api';
import InfoCount from './rightBar/infoCount';
import isSaveCom from './tipModel/isSaveCom';
import basicInfo from './rightBar/basicInfo';
import relaDetail from './rightBar/relaDetail';
import relaType from './rightBar/relaType';
import modelAnalysis from './rightBar/modelAnalysis';
import { storage, cloneObj } from '@/libs/common/common.js';
import { flowerLayout, transferLayout, galaxyLayout, personLayout, AutoLayouter, fakerTreeLayout } from './layoutExtend';
import interStyle from './interactionStyle';
import saveCom from './tipModel/saveCom';
import addNode from './tipModel/addNode';
import $$ from './editorDom';
import rightMenu from './tipModel/rightMenu/index';
import intimaSlider from './tipModel/intimaSlider';
export default {
  components: {
    InfoCount, isSaveCom, basicInfo, relaDetail, relaType, modelAnalysis, saveCom, addNode, rightMenu, intimaSlider
  },
  data() {
    return {
      color5: '#ccc',
      ssxjt: '-1',
      isNewGraph: false,
      thisvalue: '',
      activebolagin: false,
      wjdrarr: [],
      pldrarr: [],
      cxqjnum: 0,
      tooltip: {
        x: 300,
        y: 300,
        text: '',
        isShow: false
      },
      yhbz3: '',
      cxqjarr: [],
      bcfefore: '',
      modal5: false,
      modal6: false,
      modal7: false,
      modal9: false,
      spinShow: false,
      newGraph: false,
      fileInfo: {},
      yhbz: '',
      ctrlandclick: false,
      isInputChange: false,
      searchval1: '',
      searchval2: '',
      xqboxbol: '-1',
      xqbol: '-1',
      gaoliang: '-1',
      seletime: 0,
      selbq: '-1',
      mx: 1,
      lxarr: [],
      addfxTime: [],
      oldedgeType: [],
      mxfxlxtime: '2次',
      visible: false,
      listenChange: true,
      oldnextbol: true,
      defaultProps: {
        children: 'child',
        label: 'title'
      },
      ycnavarr: [
        { text: '基本信息', show: false },
        { text: '信息统计', show: false },
        { text: '查询分析', show: false },
        { text: '模型分析', show: false },
        { text: '备注信息', show: false }
      ],
      lxarr2: [],
      trajectorys: [],
      bindingUIs: [
        {
          'ui': {
            _className: 'Q.ImageUI',
            json: {
              $lineWidth: 1,
              strokeStyle: '#ccc',
              $fillColor: '#fff',
              zIndex: -1,
              fillColor: '#fff',
              data: {
                '_className': 'Q.Path',
                json: [
                  { type: 'm', points: [0, 20] },
                  { type: 'c', points: [0, 8.954303999999999, 8.954303999999999, 0, 20, 0] },
                  { type: 'c', points: [31.045696, 0, 40, 8.954303999999999, 40, 20] },
                  { type: 'c', points: [40, 31.045696, 31.045696, 40, 20, 40] },
                  { type: 'c', points: [8.954303999999999, 40, 0, 31.045696, 0, 20] }
                ]              },
              'bindingProperties': [
                {
                  'property': 'shape',
                  'propertyType': 2,
                  'bindingProperty': 'lineWidth',
                  'target': {}
                }
              ]
            }          }        }],
      size: { width: 40, height: 40 },

      predefineColors: ['#ff4500', '#ff8c00', '#ffd700', '#90ee90', '#00ced1', '#1e90ff', '#c71585', 'rgba(255, 69, 0, 1)',
        'rgb(255, 120, 1)'
      ],
      gxlinelx: [],
      open: ['1'],
      active: '',
      remnant1: 0,
      // remnant3: 0,
      userDetail: { imgUrl: '', name: '', res: [] },
      relaInfo: [],
      graphMap: null,
      dataRefId: null,
      graphNodeMap: null,
      graphEdgeMap: null,
      tempEdge: null,
      isChangeNum: [],
      editImageInfo: null,
      relaType: null,
      relaEdge: null,
      basicLoading: false,
      NodeData: {},
      isSelectEdge: false,
      NodeRefIdArr: [],
      timer: null,
      traceTimer: null,
      isTraceChange: true,
      traceArr: [],
      traceStep: -1,
      roleInfo: '',
      commEdir: null,
      bindStatus: false,
      filterText: '',
      idAddReady: false,
      matchType: null,
      autoName: null,
      contextmenuEvent: null,
      AutoLayouter: null,
      interstyle: null
    };
  },
  mounted() {
    this.spinShow = true;
    this.activebolagin = false;
    this.bindStatus = true;
    setTimeout(() => {
      this.allgn();
    }, 500);
  },
  provide() {
    return {
      graphMap: this
    };
  },
  computed: {
    remnant3() {
      return (this.yhbz3) ? (this.yhbz3).toString().length : 0;
    }
  },
  directives: {
    clickOutSide: {
      bind(el, binding, vnode) {
        el.handler = (e) => {
          if (el && !el.contains(e.target)) {
            vnode.context[binding.expression]();
          }
        };
        document.addEventListener('click', el.handler, true);
      },
      unbind(el) {
        document.removeEventListener('click', el.handler, true);
        el.handler = null;
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
  activated() {
    if (this.activebolagin) {
      this.bindStatus = false;
      this.spinShow = true;
      this.idAddReady = false;
      setTimeout(() => {
        this.allgn();
      }, 500);
    }
  },
  deactivated() {
    this.activebolagin = true;
  },
  created() {
    this.roleInfo = storage.get('relaAdmin') ? 'relateAdmin' : '';
    this.$nextTick(() => {
      // var graph = new Q.Graph("canvas")
    });
  },
  methods: {
    SliderRange(val) {
      if (graph) {
        var aa = graph._l1Model._k2;
        if (!aa.some(item => item instanceof Q.Edge)) return
        let map = new Map();
        aa.forEach(i => {
          i.setStyle(Q.Styles.ALPHA, 0);
          if (i instanceof Q.Node) {
            i.layoutable = false;
          }
          if (i instanceof Q.Edge) {
            let num = i.intimacy ? Number(i.intimacy) : 1;
            if ((num > val[0] / 10 || num == val[0] / 10) && (num < val[1] / 10 || num == val[1] / 10)) {
              map.set(i.absId, i);
              map.set(i.to._refId, i.to);
              map.set(i.from._refId, i.from);
            }
          }
        });
        let b = [...map.values()];
        b.forEach(i => {
          if (i instanceof Q.Node) {
            i.layoutable = true;
          }
          i.setStyle(Q.Styles.ALPHA, 1);
        });
      }
    },
    addNodeFn() {
      this.modal5 = true;
    },
    deleNodeFn(isClearAll) {
      //let resEdge = graph.selectionModel.datas.filter(item => item instanceof Q.Edge);
      let res = isClearAll ? graph._l1Model._k2.filter(item => (item instanceof Q.Node) && !item.suo) :
        graph.selectionModel.datas.filter(item => (item instanceof Q.Node) && !item.suo)
      let obj = { node: [], edge: [] };
      res.forEach(item => {
        obj.node.push(item);
        item.forEachEdge(function (edge) {
          obj.edge.push(edge);
        });
        graph.graphModel.remove(item);
        this.dataRefId = null;
      });
      if (obj.node.length == 0 && obj.edge.length == 0) {
        if (graph._l1Model._k2.length !== 0) {
          this.$message.warning('该对象已被锁定，不能被删除~')
        }
        return
      }
      this.traceRemove(obj);
    },
    chearGraph() {
      this.deleNodeFn(true)
    },
    handleLock() {
      let res = graph.selectionModel.datas.filter(item => item instanceof Q.Node);
      if (res.every(i => i.suo)) { return; }
      res.forEach(node => {
        node.suo = true;
        node.image = require('../../../static/page/images/suo.png');
      });
      let obj = {
        isLock: true,
        data: res
      };
      this.tarceLock(obj);
    },
    handleUnlock() {
      let res = graph.selectionModel.datas.filter(item => item instanceof Q.Node);
      if (res.every(i => !i.suo)) { return; }
      res.forEach(node => {
        node.suo = false;
        this.reSetImg2(node.oldImage).then(res => node.image = res);
      });
      let obj = {
        isLock: false,
        data: res
      };
      this.tarceLock(obj);
    },
    handleNodeUnfold() {
      let res = graph.selectionModel.datas.filter(item => (item instanceof Q.Node) && !item.suo);
      let resArr = [];
      res.forEach(i => resArr.push(i._refId));
      let result = {};
      result.jsonData = JSON.stringify({
        _refId: [resArr],
        limit: 200,
        caseId: this.$route.query.caseId
      });
      this.updateRelaExpand(result, true);
    },
    handleNodeFold() {
      let res = graph.selectionModel.datas.filter(item => (item instanceof Q.Node) && !item.suo);
      let resArr = [];
      res[0].forEachEdge(item => {
        let tarNode = item.to._refId == res[0]._refId ? item.from : item.to;
        resArr.push(tarNode);
      });
      let obj = {
        node: [],
        edge: []
      };
      let tarArr = resArr.filter(i => i.edgeCount == 1);
      tarArr.forEach(i => {
        obj.node.push(i);
        i.forEachEdge(e => obj.edge.push(e));
        graph.graphModel.remove(i)
          ;
      });
      this.traceNodeFold(obj);
    },
    handleSpring() {
      this.AutoLayouter.doLayout({
        layoutType: '弹性',
        byAnimate: true,
        callback: function () {
          graph.zoomToOverview(true);
        }
      });
      this.autoName = '弹性'
    },
    handleGlaxy() {
      this.AutoLayouter.doLayout({
        layoutType: '星云',
        byAnimate: true,
        callback: function () {
          graph.zoomToOverview(true);
        }
      });
      this.autoName = '星云'
    },
    handleFlower() {
      this.AutoLayouter.doLayout({
        layoutType: '散点',
        byAnimate: true,
        callback: function () {
          graph.zoomToOverview(true);
        }
      });
      this.autoName = '散点'
    },
    handlePerson() {
      this.AutoLayouter.doLayout({
        layoutType: '人物',
        byAnimate: true,
        callback: function () {
          graph.zoomToOverview(true);
        }
      });
      this.autoName = '人物'
    },
    handleFakerTree() {
      this.AutoLayouter.doLayout({
        layoutType: '圆盘',
        byAnimate: true,
        callback: function () {
          graph.zoomToOverview(true);
        }
      });
      this.autoName = '圆盘'
    },
    handleModelAnaly() {
      this.gaoliang = 2;
      this.xqbol = 2;
      this.xqboxbol = 0;
    },
    handleNodeRemark() {
      let res = graph.selectionModel.datas.filter(item => (item instanceof Q.Node) && !item.suo);
      this.gaoliang = 3;
      this.xqbol = 3;
      this.xqboxbol = 0;
    },
    openContextMenu(evt) {
      evt.preventDefault();
      this.contextmenuEvent = evt;
    },
    allgn() {
      var aa = graph._l1Model._k2;
      this.AutoLayouter = new AutoLayouter(graph);
      this.traceArr = [];
      this.traceStep = -1;
      //  var ctrlandclick=false
      let _this = this;
      $('.bjlx,.bjxl').find('li').click(function () {
        let that = $(this);
        _this.AutoLayouter.doLayout({
          layoutType: that.text(),
          byAnimate: true,
          callback: function () {
            graph.zoomToOverview(true);
          }
        });
      });

      this.xqboxbol = '-1';
      this.listenChange && this.handleEventListener();
      this.listenChange && this.handleCreatedEdge();
      this.initCavasData();
      this.listenChange && this.traceLocation();
      this.$refs.modelAnaly.orginData = []
      // this.traceArr = []
      this.listenChange = false;
      // 重新初始化选择框样式
      this.interstyle = new interStyle(graph, this);
      this.commEdir = $$('.q-content');
      graph.enableTooltip = false;
      // var overview = new Q.Overview(document.getElementById(overview));

      // var visible = !overview.visible;
      // overview.setVisible(visible);
      // overview.setGraph(visible ? window.graph : null);

      graph.onmousemove = (evt) => {
        this.tooltip.isShow = false;
        if (graph.count == 0) { return }
        if (evt.getData() instanceof Q.Node || evt.getData() instanceof Q.Edge) {
          this.tooltip.isShow = true;
          this.tooltip.text = evt.getData() instanceof Q.Node ? evt.getData().name : ((evt.getData().infoCount == '' || !evt.getData().infoCount) ? this.tooltip.isShow = false : evt.getData().infoCount);
          this.tooltip.x = evt.pageY - 50;
          this.tooltip.y = ((evt.pageX + this.tooltip.text.length * 14 + 30) > window.innerWidth) ? (evt.pageX - this.tooltip.text.length * 14) : evt.pageX + 20;
        }
      };
      this.interstyle.selectionChangeListener((node) => {
        if (!Q.isArray(node) && node instanceof Q.Node) { this.yhbz3 = node.bz; }
        let data = Q.isArray(node) ? node : [node];
        this.commEdir.handleRightStatus(data);
        let nodeSelect = [];
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.NodeRefIdArr = [];
          if (graph.selectionModel.datas.length !== 0) {
            nodeSelect = graph.selectionModel.datas.filter(item => {
              return item instanceof Q.Node;
            });
          }
          if (nodeSelect == undefined) {
            this.NodeRefIdArr = [];
          } else {
            var nodeRes = [];
            nodeSelect.forEach(item => {
              nodeRes.push(item._refId);
            });
            this.NodeRefIdArr = nodeRes;
          }
        }, 500);
      });

      // $(".tooltip").click(e => {e ? e.stopPropagation() : (event.cancelBubble = true)})
      this.$store.dispatch('isChangeGraph', false);

      var isSetting = false;
      graph.selectionModel.listChangeDispatcher.on((evt) => {
        this.$store.dispatch('isChangeGraph', true);
        // this.isTraceChange=true
        // 删除情况下，右侧对象信息和信息统计
        if (evt.kind == 'remove') {
          if (this.xqbol !== 2) {
            this.xqbol = -1;
            this.gaoliang = -1;
            this.xqboxbol = '-1';
          }
        }
      });
      this.handleGraphListen();
    },
    handleNewGraph() {
      if (this.$store.getters.is_change_graph) {
        this.newGraph = true;
        this.modal6 = true;
      } else {
        this.clearAll();
      }
    },
    // 事件监听绑定
    handleEventListener() {
      // graph.graphModel.selectionModel.select(graph._l1Model._k2[0])
      // graph.setSelection([graph._l1Model._k2[0]]);
      if (!this.bindStatus) {
        return;
      }
      let that = this;
      // 删除事件绑定
      $$('.toolbar-remove-btn').node.addEventListener('click', function () { this.editorNode.handleRemover(); });
      $$('.removebox .removexl .scdx').node.addEventListener('click', function () { this.editorNode.deleNodeFn(that); });
      $$('.removebox .removexl .scall').node.addEventListener('click', function () {
        this.editorNode.deleNodeFn(that, true);
        // this.traceClear();
        // graph.clear();
      });
      // 新建对象绑定
      // $$(".addNode").node.addEventListener("click", function() {this.editorNode.addNodeFn(that)})
      $$('.toolbar-add-node').node.addEventListener('click', () => (this.modal5 = true));
      $$('.toolbar-color-box').node.addEventListener('click', () => {
        if (graph.selectionModel.datas.length == 0) {
          this.$message.warning('当前没有可以改变颜色的对象或者关系');
          return;
        }
        this.$refs.ColorPicker.visible = true;
      });
      // 锁定事件绑定
      $$('.toolbar-lock-btn').node.addEventListener('click', function () {
        this.querySelector('.q-icon').classList.contains('suobol') ? this.editorNode.handleLock(false, that) : this.editorNode.handleLock(true, that);
      });
      // 新建画布事件绑定
      $$('.toolbar-new-graph').node.addEventListener('click', function () { this.editorNode.handleNewGraph(that); });
      // 保存事件绑定
      $$('.toolbar-save-graph').node.addEventListener('click', () => { this.clearGraphSelect(); this.modal6 = true; });
      // 箭头大小改变

      // $$('.toolbar-edge-arrow').node.addEventListener('click',function () {this.editorNode.handleEdgeArrow(that)})
      //计算状态按钮
      $$('.toolbar-calc-status').node.addEventListener('click', function () {
        this.editorNode.handleCalcStatus(that)
      })
      // 线的粗细改变
      // $$('.toolbar-edge-weight').node.addEventListener('click', function () {
      //   this.editorNode.handleEdgeWeight(that);
      // });
      // $$('.toolbar-edge-weight .cxlx').node.addEventListener('click', function (e) {
      //   this.editorNode.handleChangeEdge(e, that);
      // });
      // 布局方式改变
      $$('.toolbar-re-layout').node.addEventListener('click', function () { this.editorNode.handleReLayout(that); });
      // 撤销重做按钮
      $$('.toolbar-undo').node.addEventListener('click', () => {
        this.handleUndoTrace();
      });
      $$('.toolbar-redo').node.addEventListener('click', () => {
        this.handeleRedoTrace();
      });
    },
    addCalcStatus() {
      let calcBtn = document.querySelector('.toolbar-calc-status .q-icon')
      if (calcBtn.classList.contains('toolbar-calced')) {
        calcBtn.classList.remove('toolbar-calced')
        calcBtn.classList.add('toolbar-calc')
      }
    },
    removeCalcStatus() {
      let calcBtn = document.querySelector('.toolbar-calc-status .q-icon')
      if (calcBtn.classList.contains('toolbar-calc')) {
        calcBtn.classList.remove('toolbar-calc')
        calcBtn.classList.add('toolbar-calced')
      }
    },
    setCalcStatus() {
      let reDrawImage = graph._l1Model._k2.filter(i => i instanceof Q.Node);
      let reEdgeImage = graph._l1Model._k2.filter(i => i instanceof Q.Edge);
      if (reDrawImage.some(item => item.suspicion && (item.getStyle(Q.Styles.SHADOW_BLUR) == 3))) {
        this.addCalcStatus()
      } else {
        this.removeCalcStatus()
      }
      reEdgeImage.forEach(item => {
        if (item.arrow !== '3') {
          item.setStyle(Q.Styles.ARROW_TO, true)
          item.setStyle(Q.Styles.ARROW_TO_OUTLINE, null)
          item.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, "#ccc")
        }
      })
    },
    handleCalcData() {
      let reDrawImage = graph._l1Model._k2.filter(i => i instanceof Q.Node);
      reDrawImage.map(item => {
        if (item.suspicion) {
          item.setStyle(Q.Styles.RENDER_COLOR, 'rgba(255,255,255,0)');
          item.setStyle(Q.Styles.SHADOW_COLOR, 'rgba(152,152,152,0)');
          item.setStyle(Q.Styles.SHADOW_OFFSET_X, 0);
          item.setStyle(Q.Styles.SHADOW_OFFSET_Y, 0);
          item.setStyle(Q.Styles.SHADOW_BLUR, 0);
        }
      });
    },
    handleunCalcData(fn) {
      let reDrawImage = graph._l1Model._k2.filter(i => i instanceof Q.Node);
      graph._l1Model._k2.map(item => {
        if (item instanceof Q.Node) {
          if (item.suspicion && item.suspicion == '0') {
            item.setStyle(Q.Styles.RENDER_COLOR, '#B0061B');
          } else if (item.suspicion && item.suspicion == '1') {
            item.setStyle(Q.Styles.RENDER_COLOR, '#F5A623');
          }
          fn && fn(item)
        } else {
          if (item.arrow && item.arrow !== '3') {
            item.setStyle(Q.Styles.ARROW_TO, true)
            item.setStyle(Q.Styles.ARROW_TO_OUTLINE, null)
            item.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, "#ccc")
          }
        }
      });
    },
    handeleRedoTrace() {
      if (this.traceStep !== this.traceArr.length - 1) {
        this.traceStep++;
        let tempData = this.traceArr[this.traceStep];
        this.isTraceChange = false;
        if (tempData.kind === 'add-node') {
          let newNodeArr = [];
          tempData.data.data.node.map((item) => {
            let newNode = this.createdNodeLocation({
              suspicion: item.suspicion,
              name: item.name,
              image: item.oldImage,
              oldImage: item.oldImage,
              _refId: item._refId,
              _reftype: item._reftype,
              x: item.x,
              y: item.y,
              model: graph.graphModel,
              fileOrCaseId:item.fileOrCaseId
            });
            newNodeArr.push(newNode);
          });
          tempData.data.data.node = newNodeArr;
          this.setNodeMap();
          let newEdgeArr = [];
          tempData.data.data.edge.map((item) => {
            let w = item.fromVId;
            let s = item.toVId;
            var edge = new Q.Edge(this.graphNodeMap.get(w), this.graphNodeMap.get(s));
            var c1 = graph.graphModel.add(edge);
            c1.name = item.name;
            c1.fromVId = w;
            c1.toVId = s;
            c1.idArr = item.idArr;
            c1.absId = item.absId;
            item.intimacy && (c1.intimacy = item.intimacy);
            this.reSetEdge(c1);
            newEdgeArr.push(c1);
          });
          tempData.data.data.edge = newEdgeArr;
          graph.centerTo(tempData.data.Redo.center.x, tempData.data.Redo.center.y, tempData.data.Redo.scale, true);
        }
        if (tempData.kind === 'lock-node') {
          if (tempData.data.isLock) {
            tempData.data.data.forEach(node => {
              node.suo = true;
              this.commEdir.handleRightStatus();
              node.image = require('../../../static/page/images/suo.png');
            });
          } else {
            tempData.data.data.forEach(node => {
              node.suo = false;
              this.commEdir.handleRightStatus();
              this.reSetImg2(node.oldImage).then(res => node.image = res);
            });
          }
        }
        // if (tempData.kind==='edge-weight') {
        //   tempData.data.forEach(item=>{
        //     item.edge.setStyle(Q.Styles.EDGE_WIDTH, item.newWidth)
        //     item.edge.newWidth = item.newWidth
        //   })
        // }
        // if (tempData.kind === 'edge-arrow') {
        //   tempData.data.forEach(item => {
        //     if (item.arrow) {
        //       item.edge.setStyle(Q.Styles.ARROW_TO, true);
        //       item.edge.setStyle(Q.Styles.ARROW_TO_OUTLINE, null);
        //       item.edge.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, '#2ebcff');
        //     } else {
        //       item.edge.setStyle(Q.Styles.ARROW_TO, false);
        //     }
        //   });
        // }
        if (tempData.kind === 'graph-color') {
          tempData.data.forEach(item => {
            if (item.data instanceof Q.Node) {
              item.data.setStyle(Q.Styles.IMAGE_BORDER_STYLE, item.redoColor);
              item.data.setStyle(Q.Styles.LABEL_COLOR, item.redoColor);
              item.data.bindingUIs.datas[0].ui.strokeStyle = item.redoColor;
              item.data.colornew = item.redoColor;
            }
            if (item.data instanceof Q.Edge) {
              item.data.setStyle(Q.Styles.EDGE_COLOR, item.redoColor);
              item.data.setStyle(Q.Styles.LABEL_COLOR, item.redoColor); // 文字的颜色
              item.data.colornew = item.redoColor;
              if (item.data instanceof Q.Edge && item.data.getStyle(Q.Styles.ARROW_TO)) {
                item.data.setStyle(Q.Styles.ARROW_TO, false);
                item.data.setStyle(Q.Styles.ARROW_TO, true);
                item.data.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, item.redoColor);
              }
            }
          });
        }
        if (tempData.kind == 'location') {
          tempData.data.forEach(item => {
            let offX = item.redo.x - item.node.x;
            let offY = item.redo.y - item.node.y;
            graph.moveElements([item.node], offX, offY);
          });
          this.isTraceChange = true;
        }
        if (tempData.kind === 'rela-expand') {
          graph.clear();
          graph.parseJSON(tempData.data.redo);
          var aa = graph._l1Model._k2.find(item => item instanceof Q.Node);
          let reDrawImage = graph._l1Model._k2.filter(i => i instanceof Q.Node && !i.suo);
          reDrawImage.map(item => {
            this.matchType = item.matchType;
            this.reSetImg2(item.oldImage).then(res => { item.image = res; });
            item.oldImage = this.filterImg(item.oldImage);
          });
        }
        if (tempData.kind === 'node-fold' || tempData.kind === 'remove-node' || tempData.kind === 'clear-graph') {
          this.setGraphMap();
          tempData.data.edge.forEach((item) => {
            let edgeId = item.absId;
            graph.graphModel.remove(this.graphMap.get(edgeId));
          });
          tempData.data.node.forEach((item) => {
            let nodeId = item._refId;
            graph.graphModel.remove(this.graphMap.get(nodeId));
          });
        }
        if (tempData.kind === 'add-edge') {
          let w = tempData.data.from;
          let s = tempData.data.to;
          var edge = new Q.Edge(w, s);
          var c1 = graph.graphModel.add(edge);
          c1.name = tempData.data.name;
          c1.fromVId = w._refId;
          c1.toVId = s._refId;
          c1.idArr = tempData.data.idArr;
          c1.absId = tempData.data.absId;
          tempData.data.intimacy && (c1.intimacy = tempData.data.intimacy);
          this.reSetEdge(c1);
          tempData.data = edge;
        }
      } else {
        this.$message.warning('当前操作没有可以重做的步骤');
      }
    },
    handleUndoTrace() {
      if (this.traceStep > -1) {
        let tempData = this.traceArr[this.traceStep];
        this.isTraceChange = false;

        if (tempData.kind === 'add-node') {
          tempData.data.data.node.forEach((item) => {
            graph.graphModel.remove(item);
          });
          graph.centerTo(tempData.data.Undo.center.x, tempData.data.Undo.center.y, tempData.data.Undo.scale, true);
        }
        if (tempData.kind === 'lock-node') {
          if (!tempData.data.isLock) {
            tempData.data.data.forEach(node => {
              node.suo = true;
              this.commEdir.handleRightStatus();
              node.image = require('../../../static/page/images/suo.png');
            });
          } else {
            tempData.data.data.forEach(node => {
              node.suo = false;
              this.commEdir.handleRightStatus();
              this.reSetImg2(node.oldImage).then(res => node.image = res);
            });
          }
        }
        if (tempData.kind === 'add-edge') {
          this.setGraphMap();
          let edgeId = tempData.data.absId;
          graph.graphModel.remove(this.graphMap.get(edgeId));
        }
        // if (tempData.kind === 'edge-weight') {
        //     tempData.data.forEach(item => {
        //         item.edge.setStyle(Q.Styles.EDGE_WIDTH, item.oldWidth);
        //         item.edge.newWidth = item.oldWidth;
        //     });
        // }
        // if (tempData.kind === 'edge-arrow') {
        //   tempData.data.forEach(item => {
        //     if (item.arrow) {
        //       item.edge.setStyle(Q.Styles.ARROW_TO, true);
        //       item.edge.setStyle(Q.Styles.ARROW_TO_OUTLINE, null);
        //       item.edge.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, '#2ebcff');
        //     } else {
        //       item.edge.setStyle(Q.Styles.ARROW_TO, false);
        //     }
        //   });
        // }
        if (tempData.kind === 'graph-color') {
          tempData.data.forEach(item => {
            if (item.data instanceof Q.Node) {
              item.data.setStyle(Q.Styles.IMAGE_BORDER_STYLE, item.undoColor);
              item.data.setStyle(Q.Styles.LABEL_COLOR, item.undoColor);
              item.data.bindingUIs.datas[0].ui.strokeStyle = item.undoColor;
              item.data.colornew = item.undoColor;
            }
            if (item.data instanceof Q.Edge) {
              item.data.setStyle(Q.Styles.EDGE_COLOR, item.undoColor);
              item.data.setStyle(Q.Styles.LABEL_COLOR, item.undoColor); // 文字的颜色
              item.data.colornew = item.undoColor;
              if (item.data instanceof Q.Edge && item.data.getStyle(Q.Styles.ARROW_TO)) {
                item.data.setStyle(Q.Styles.ARROW_TO, false);
                item.data.setStyle(Q.Styles.ARROW_TO, true);
                item.data.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, item.undoColor);
              }
            }
          });
        }
        if (tempData.kind == 'location') {
          tempData.data.forEach(item => {
            item.redo.x = item.node.x;
            item.redo.y = item.node.y;
            let offX = item.undo.x - item.node.x;
            let offY = item.undo.y - item.node.y;
            graph.moveElements([item.node], offX, offY);
          });
          this.isTraceChange = true;
        }
        if (tempData.kind === 'rela-expand') {
          var aa = graph._l1Model._k2;
          let replaceImage = aa.filter(item => item instanceof Q.Node && !item.suo);
          replaceImage.map(item => (item.image = item.oldImage));
          tempData.data.redo = graph.exportJSON(true);
          graph.clear();
          graph.parseJSON(tempData.data.undo);
          var aa = graph._l1Model._k2.find(item => item instanceof Q.Node);
          let reDrawImage = graph._l1Model._k2.filter(i => i instanceof Q.Node && !i.suo);
          reDrawImage.map(item => {
            this.matchType = item.matchType;
            this.reSetImg2(item.oldImage).then(res => { item.image = res; });
            item.oldImage = this.filterImg(item.oldImage);
          });
        }
        if (tempData.kind === 'node-fold' || tempData.kind === 'remove-node' || tempData.kind === 'clear-graph') {
          let newNodeArr = [];
          tempData.data.node.map((item) => {
            let newNode = this.createdNodeLocation({
              suspicion: item.suspicion,
              name: item.name,
              image: item.oldImage,
              oldImage: item.oldImage,
              _refId: item._refId,
              _reftype: item._reftype,
              x: item.x,
              y: item.y,
              model: graph.graphModel,
              fileOrCaseId:item.fileOrCaseId
            });
            newNode.styles = item.styles;
            newNodeArr.push(newNode);
          });
          tempData.data.node = newNodeArr;
          this.setNodeMap();
          let newEdgeArr = [];
          tempData.data.edge.map((item) => {
            let w = item.fromVId;
            let s = item.toVId;
            var edge = new Q.Edge(this.graphNodeMap.get(w), this.graphNodeMap.get(s));
            var c1 = graph.graphModel.add(edge);
            c1.name = item.name;
            c1.fromVId = w;
            c1.toVId = s;
            c1.idArr = item.idArr;
            c1.absId = item.absId;
            c1.styles = item.styles;
            newEdgeArr.push(c1);
          });
          tempData.data.edge = newEdgeArr;
        }
        this.traceStep--;
      } else {
        this.$message.warning('当前操作没有可以撤销的步骤');
      }
    },
    handleTraceArr(obj) {
      if (this.traceStep == this.traceArr.length - 1) {
        this.traceArr.push(obj);
        if (this.traceArr.length > 30) {
          this.traceArr.shift();
        }
        this.traceStep = this.traceArr.length - 1;
      } else {
        this.traceArr = this.traceArr.slice(0, this.traceStep + 1);
        this.traceArr.push(obj);
        this.traceStep = this.traceArr.length - 1;
      }
    },
    // 新增数据追踪
    traceAddNode(val) {
      let obj = {
        kind: 'add-node',
        data: val
      };
      this.handleTraceArr(obj);
    },
    // 新增关系数据
    taceAddEdge(val) {
      let obj = {
        kind: 'add-edge',
        data: val
      };
      this.handleTraceArr(obj);
    },
    // 锁定数据追踪
    tarceLock(val) {
      let obj = {
        kind: 'lock-node',
        data: val
      };
      this.handleTraceArr(obj);
    },
    // 删除数据追踪
    traceRemove(val) {
      let obj = {
        kind: 'remove-node',
        data: val
      };
      this.handleTraceArr(obj);
    },
    traceClear() {
      let obj = { node: [], edge: [] };
      graph._l1Model._k2.forEach(t => {
        (t instanceof Q.Node) ? obj.node.push(t) : obj.edge.push(t);
      });
      let objArr = {
        kind: 'clear-graph',
        data: obj
      };
      this.handleTraceArr(objArr);
    },
    // edge粗细数据
    traceWeight(val) {
      // let obj = {
      //     kind: 'edge-weight',
      //     data: val
      // };
      // this.handleTraceArr(obj);
    },
    // 箭头样式改变
    traceArrow(val) {
      let obj = {
        kind: 'edge-arrow',
        data: val
      };
      this.handleTraceArr(obj);
    },
    // 颜色样式改变
    traceColor(val) {
      let obj = {
        kind: 'graph-color',
        data: val
      };
      this.handleTraceArr(obj);
    },
    traceLocation() {
      let TraceMap = new Map();
      let objArr = [];
      graph.dataPropertyChangeDispatcher.on((evt) => {
        if (this.isTraceChange) {
          if (evt.kind == 'location') {
            if (!TraceMap.get('location')) {
              TraceMap.set('location', evt);
              objArr = [];
              graph.selectionModel.datas.forEach(item => {
                if (item instanceof Q.Node) {
                  let obj = { node: item, undo: { x: item.x, y: item.y }, redo: { x: null, y: null } };
                  objArr.push(obj);
                }
              });
            }
            if (this.traceTimer) {
              clearTimeout(this.traceTimer);
            }
            this.traceTimer = setTimeout(() => {
              let arrObj = { kind: 'location', data: objArr };
              this.handleTraceArr(arrObj);
              TraceMap = new Map();
            }, 500);
          }
        }
      });
    },
    // 关系扩展追踪
    traceRelaExpand(val) {
      let obj = {
        kind: 'rela-expand',
        data: val
      };
      this.handleTraceArr(obj);
    },
    // 关系收缩追踪
    traceNodeFold(val) {
      let obj = {
        kind: 'node-fold',
        data: val
      };
      this.handleTraceArr(obj);
    },
    closeAdd() {
      this.visible = false;
    },
    filterNode(value, data) {
      if (!value) return true;
      return (data.title && data.title.indexOf(value) !== -1) || (data.fileName && data.fileName.indexOf(value) !== -1);
    },
    handleexpandColor(val) {
      if (val) {
        $('.removexl').fadeOut();
        $('.bjlx').fadeOut();
        $('.cxlx').fadeOut();
      }
    },
    handleaddClose() {
      this.visible = false;
    },
    up() {
      this.ctrlandclick = false;
    },
    down() {
      this.ctrlandclick = true;
    },
    // 请求对象详情，请求成功，打开侧边栏
    nodeInfo(parmas) {
      const { imgUrl, name, _refId,fileOrCaseId, isOpenSideBar = false } = parmas;
      this.basicLoading = true;
      return new Promise(resolve => {
        api.api('post', api.loginUrl2 + '/canvasTarget/detail', { refId: _refId, caseId: fileOrCaseId }, error => { this.spinShow = false; }).then(res => {
          this.basicLoading = false;
          this.userDetail = {
            name: name,
            imgUrl: imgUrl,
            res: res
          };
          isOpenSideBar && this.handleOpensidebar();
        })
          .catch(function (error) { });
      });
    },
    // 更新个人信息
    updateRoleInfo(val) {
      this.nodeInfo({
        imgUrl: this.filterImg(val.oldImage),
        name: val.name,
        _refId: val._refId,
        fileOrCaseId:val.fileOrCaseId
      });
    },
    handleRelaDetail() {
      this.handleOpensidebar();
      this.xqbol = 5;
    },
    nullData() {
      this.gaoliang = 0;
      this.xqboxbol = '-1';
      this.isSelectEdge = false;
    },
    handleOpensidebar() {
      this.gaoliang = 0;
      this.xqbol = 0;
      this.xqboxbol = 0;
      this.mx = 1;
      this.spinShow = false;
    },
    filterImg(img) {
      let httpReg = new RegExp('^http[s]?://');
      let httpResp = new RegExp('^http[s]?://.+?/');
      if (httpReg.test(img)) {
        let res = img.replace(httpResp, '/');
        return res.indexOf(api.urlImage) !== -1 ? res : `${api.urlImage}${res}`;
      } else {
        return img.indexOf(api.urlImage) !== -1 ? `${img}` : `${api.urlImage}/${img}`;
      }
    },
    setGraphMap() {
      var aa = graph._l1Model._k2;
      this.graphMap = aa.reduce((t, c) => {
        let store = c._refId || c.absId;
        return t.set(store, c);
      }, new Map());
    },
    setNodeMap() {
      var aa = graph._l1Model._k2;
      this.graphNodeMap = aa.reduce((t, c) => {
        return c._refId ? t.set(c._refId, c) : t;
      }, new Map());
    },
    setEdgeMap() {
      var aa = graph._l1Model._k2;
      this.graphEdgeMap = aa.reduce((t, c) => {
        return c.absId ? t.set(c.absId, c) : t;
      }, new Map());
    },
    clearGraphSelect() {
      var aa = graph._l1Model._k2;
      aa.forEach(function (s) {
        if (s instanceof Q.Node) {
          s.setStyle(Q.Styles.ALPHA, 1);
          if (s.getStyle(Q.Styles.LABEL_COLOR) == '#2ebcff') {
            s.bindingUIs.datas[0].ui.strokeStyle = '#ccc';
            s.setStyle(Q.Styles.LABEL_COLOR, 'gray');
            s.setStyle(Q.Styles.IMAGE_BORDER_STYLE, '#ccc');
          }
        } else {
          s.setStyle(Q.Styles.ALPHA, 1);
          if (s.getStyle(Q.Styles.LABEL_COLOR) == '#2ebcff') {
            s.setStyle(Q.Styles.EDGE_COLOR, '#ccc');
            s.setStyle(Q.Styles.LABEL_COLOR, 'gray');
          }
        }
      });
    },
    reSetEdge(edge) {
      edge.setStyle(Q.Styles.ARROW_TO, false);
      edge.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, '#ccc');
      edge.setStyle(Q.Styles.EDGE_WIDTH, 1);
      // edge.setStyle(Q.Styles.EDGE_LINE_DASH, [8, 4, 1, 4]);
      edge.setStyle(Q.Styles.EDGE_COLOR, '#ccc');
      edge.setStyle(Q.Styles.LABEL_FONT_SIZE, 12);
      edge.setStyle(Q.Styles.LABEL_COLOR, 'gray');
      edge.setStyle(Q.Styles.ARROW_TO_OUTLINE, null);
      edge.setStyle(Q.Styles.LABEL_RADIUS, 0);
      edge.setStyle(Q.Styles.LABEL_ROTATABLE, false);
      edge.setStyle(Q.Styles.LABEL_BACKGROUND_COLOR, '#F5F6F8');
      edge.setStyle(Q.Styles.LABEL_ANCHOR_POSITION, Q.Position.CENTER_MIDDLE);
      // edge.zIndex = 49;
    },
    saveGraph() {
      this.clearGraphSelect();
      this.modal6 = true;
    },
    initGraphDate(imgFileData) {
      graph.clear();
      graph.parseJSON(imgFileData.resultContent);

      // var res = JSON.parse(imgFileData.resultContent).datas.find(item => item._className === "Q.Node");
      var aa = graph._l1Model._k2.find(item => item instanceof Q.Node);
      let reDrawImage = graph._l1Model._k2.filter(i => i instanceof Q.Node && !i.suo);
      reDrawImage.map(item => {
        this.matchType = item.matchType;
        this.reSetImg2(item.oldImage).then(res => { item.image = res; });
        item.oldImage = this.filterImg(item.oldImage);
      });

      this.setGraphMap();
      this.nodeInfo({
        imgUrl: aa.oldImage,
        name: aa.name,
        _refId: aa._refId,
        fileOrCaseId:aa.fileOrCaseId
      });
      this.NodeData = aa;
      this.dataRefId = aa._refId;
      this.NodeRefIdArr = [aa._refId];
      this.$store.dispatch('isChangeGraph', false);
      this.setCalcStatus()
    },
    initdataGraph(val) {
      let styles = {
        'label.font.size': 12,
        'label.color': 'gray',
        'image.padding': 10,
        'shape.fill.color': '#ee6411',
        'shape.stroke.style': '#f7c966',
        'selection.color': 'transparent',
        'image.border.style': '#ccc',
        'edge.color': '#ccc',
        'arrow.to.fill.color': '#ccc',
        'image.radius': 40,
        'image.border.radius': 40,
        'arrow.to.outline': null      };
      let xianstyles = {
        'arrow.to': false,
        'arrow.to.fill.color': '#ccc',
        'edge.width': 1,
        'edge.color': '#ccc',
        'label.font.size': 12,
        'label.color': 'gray',
        'edge.outline': null,
        'edge.outline.style': null,
        "label.radius": 0,
        "label.rotatable": false,
        "label.background.color": "#F5F6F8",
        'alpha': 1
      };

      graph.clear();
      let fileData = JSON.parse(JSON.stringify(val));
      var res = fileData.find(item => item._className === 'Q.Node');
      let unique = [...val.reduce((t, c) => {
        let key = c._className == 'Q.Node' ? c._refId : c.json.absId;
        return t.set(key, c)
      }, new Map()).values()];
      unique.forEach(s => {
        if (s._className == 'Q.Node') {
          this.matchType = s.matchType.trim();
          s.json.matchType = s.matchType;
          s.json._refId = s._refId;
          s.json.zIndex = 11;
          s.json.styles = styles;
          s.json.bindingUIs = this.bindingUIs;
          s.json.size = this.size;
          s.json._reftype = s.json.type;
          s.json.oldImage = this.filterImg(s.json.oldImage);
          s.json.image = this.filterImg(s.json.image);
          s.json.fileOrCaseId = s.fileOrCaseId
        }
        if (s._className == 'Q.Edge') {
          let fromObj = JSON.parse(JSON.stringify(s.json.from))
          let toObj = JSON.parse(JSON.stringify(s.json.to))
          // xianstyles["arrow.to"] = (s.json.arrow == '3') ? false : true
          s.json.styles = xianstyles;
          // child.edge.intimacy&&(c1.intimacy = child.edge.intimacy)
          if (s.json.arrow == '1') {
            s.json.from = toObj
            s.json.to = fromObj
            s.json.fromVId = toObj._ref;
            s.json.toVId = fromObj._ref;
          } else {
            s.json.fromVId = fromObj._ref;
            s.json.toVId = toObj._ref;

          }

        }
      });

      var pldrjon = JSON.stringify({ version: '2.0', datas: unique });
      graph.parseJSON(pldrjon);
      this.handleunCalcData((item) => {
        this.reSetImg2(item.oldImage).then(res => { item.image = res });
      })
      var layouter;
      if (this.matchType == 'flower') {
        this.autoName = '散点'
        // layouter = new flowerLayout(graph);
      } else if (this.matchType == 'galaxy') {
        this.autoName = '星云'
        // layouter = new galaxyLayout(graph);
      } else {
        this.autoName = '弹性'
        // layouter = new Q.BalloonLayouter(graph);
      }
      this.AutoLayouter.doLayout({
        layoutType: this.autoName,
        byAnimate: true,
        callback: function () {
          graph.zoomToOverview(true);
        }
      });
      var aa = graph._l1Model._k2.find(item => item instanceof Q.Node);
      this.setGraphMap();
      this.nodeInfo({
        imgUrl: aa.oldImage,
        name: aa.name,
        _refId: aa._refId,
        fileOrCaseId:aa.fileOrCaseId
      });
      this.NodeData = aa;
      this.dataRefId = aa._refId;
      this.NodeRefIdArr = [aa._refId];
      this.$store.dispatch('isChangeGraph', true);
      this.setCalcStatus()
      setTimeout(() => { this.spinShow = false }, 2000);
    },

    handleGraphListen() {
      // 双击添加节点
      graph.ondblclick = (evt3) => {
        var data = evt3.getData();
        var node1 = graph.getElementByMouseEvent(evt3);
        if (node1 !== undefined) {
          if (node1.styles.alpha === 0.1) {
            return;
          }
        }
        if (data instanceof Q.Node && !node1.suo) {
          var model = graph.graphModel;
          var absIdarr = [];
          var _refIdarr = [];
          var result = {};
          result.jsonData = JSON.stringify({
            _refId: [node1._refId],
            limit: 200,
            caseId: this.$route.query.caseId
          });
          this.updateRelaExpand(result, true);
        }
      };
      // 点击事件
      graph.onclick = evt4 => {
        console.log(evt4.getData(), graph);

        if (graph.interactionMode == 'create.edge') { return; }
        var code = evt4;
        var data = evt4.getData();
        var node = graph.getElementByMouseEvent(evt4);
        if (node !== undefined) {
          if (node.styles.alpha === 0.1) {
            return;
          }
        }
        let nodeSelect;
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          this.NodeRefIdArr = [];
          if (graph.selectionModel.datas.length !== 0) {
            nodeSelect = graph.selectionModel.datas.filter(item => {
              return item instanceof Q.Node;
            });
          }
          if (nodeSelect == undefined) {
            this.NodeRefIdArr = [];
          } else {
            var nodeRes = [];
            nodeSelect.forEach(item => {
              nodeRes.push(item._refId);
            });
            this.NodeRefIdArr = nodeRes;
            this.gaoliang = 0
          }
        }, 500);
        if (data instanceof Q.Edge) {
          if (!this.interstyle.isAnalysis) {
            this.interstyle.setIsAnalysis(true)
            graph._l1Model._k2.forEach(item => {
              this.interstyle.unselectCommonStyle(item)
            })
            graph.setSelection([data]);
          }
          this.isSelectEdge = true;
          let fromRef = node.fromVId || node.from._refId;
          let toRef = node.toVId || node.to._refId;
          this.xqbol = 5;
          this.relaType = JSON.stringify({
            // idArr: node.idArr,
            fromVId: fromRef,
            toVId: toRef,
            fromFileOrCaseId:node.from.fileOrCaseId,
            toFileOrCaseId:node.to.fileOrCaseId
            // caseId: this.$route.query.caseId
          });
          this.relaEdge = node;
          this.gaoliang = 0
        }
        if (data instanceof Q.Node == false && data instanceof Q.Edge == false) {
          this.isSelectEdge = false;
        }
      };
      // 右击菜单功能区域效果
      graph.onmouseup = (evt2) => {
        this.setGraphMap();
        this.visible = false;
        var node2 = graph.getElementByMouseEvent(evt2);
        var data = evt2.getData();
        if (node2 !== undefined) {
          if (node2.styles.alpha === 0.1) {
            return;
          }
        }
        if (node2 instanceof Q.Node && node2 instanceof Q.Group == false) {
          // 点击对象请求基本信息
          if (!this.interstyle.isAnalysis) {
            this.interstyle.setIsAnalysis(true)
            graph._l1Model._k2.forEach(item => {
              this.interstyle.unselectCommonStyle(item)
            })
            graph.setSelection([data]);
          }
          let isopen = !!((this.xqboxbol == '-1' || this.xqbol == 5));
          this.nodeInfo({
            imgUrl: this.filterImg(node2.oldImage),
            name: node2.name,
            _refId: node2._refId,
            fileOrCaseId:node2.fileOrCaseId,
            isOpenSideBar: isopen
          });
          this.setGraphMap();
          // 图谱中关系合并整理
          this.NodeData = node2;
          this.dataRefId = node2._refId;
        }
        this.commEdir.handleRightStatus();
      };
      graph.onkeydown = (e) => {
        if (e.keyCode == 46) {
          e.stopPropagation();
          return false;
        }
      };
    },
    clearAll() {
      graph.clear();
      this.$store.dispatch('setImgFileData', {});
    },
    // 新增关系事件监听
    handleCreatedEdge() {
      graph.interactionDispatcher.on(evt => {
        if (graph.interactionMode === 'create.edge' && evt.kind === 'element.created') {
          this.tempEdge = [];
          var res = evt.data.from.getEdgeBundle(evt.data.to).edges;
          if (res.length == 2) {
            this.$message.error('已存在关系！');
            this.tempEdge = evt.data;
            var model = graph.graphModel;
            model.remove(this.tempEdge);
          } else {
            var fomNode, toNode;
            this.tempEdge = evt.data;
            fomNode = this.tempEdge ? this.tempEdge.from._reftype : null;
            toNode = this.tempEdge ? this.tempEdge.to._reftype : null;
            this.tempEdge.name = ''
            if (!this.tempEdge.isLooped()) {
              api.api('post', api.loginUrl2 + '/relation/findCanAddRelation', { target1: fomNode, target2: toNode }).then(res => {
                if (res.length == 0) {
                  this.gxlinelx = [];
                  this.xjgxok();
                  this.reSetEdge(this.tempEdge);
                  this.tempEdge.fromVId = this.tempEdge.from._refId;
                  this.tempEdge.toVId = this.tempEdge.to._refId;

                  // taceAddEdge
                } else {
                  this.modal9 = true;
                  this.gxlinelx = res;
                  this.reSetEdge(this.tempEdge);
                  this.tempEdge.fromVId = this.tempEdge.from._refId;
                  this.tempEdge.toVId = this.tempEdge.to._refId;
                }
              });
            } else {
              var model = graph.graphModel;
              model.remove(this.tempEdge);
            }
          }
        }
      });
    },

    handleImg(val) {
      if (val) {
        return `${api.urlImage}/${val}`;
      }
    },
    xjgxok() {
      var aa = graph._l1Model._k2;
      var model = graph.graphModel;
      let xjnewgxlxId = [];
      let xjnewgxlx = [];
      if (this.gxlinelx.length > 0) {
        this.gxlinelx.forEach(item => {
          if (item.check) {
            xjnewgxlx.push(item.name);
            xjnewgxlxId.push(item.id);
          }
        });
      }
      api.api('post', api.loginUrl2 + '/canvasRelation/addRelation', {
        jsonData: JSON.stringify({
          fromVId: this.tempEdge.$from._refId,
          toVId: this.tempEdge.$to._refId,
          edgeType: xjnewgxlxId,
          idArr: [],
          name: ''
        })
      })
        .then(res => {
          xjnewgxlxId = [];
          this.tempEdge.name = res.edge[0].name;
          this.tempEdge.absId = res.edge[0].absId;
          this.tempEdge.idArr = res.edge[0].idArr;
          this.taceAddEdge(this.tempEdge);
          // this.tempEdge
        })
        .catch(res => {
          graph.graphModel.remove(this.tempEdge);
        });
    },
    xjgxqx() {
      this.tempEdge.name = '';
      this.gxlinelx = [];
      graph.graphModel.remove(this.tempEdge);
    },
    // 点击右侧相应的信息和模型分析等展开组件
    handlerightBarShow(index) {
      if (this.gaoliang == index) {
        this.xqbol = -1;
        this.gaoliang = -1;
        this.xqboxbol = '-1';
        return;
      }
      this.gaoliang = index;
      this.xqbol = index;
      this.xqboxbol = 0;
      this.lxarr = [];
      this.lxarr2 = [];
      // this.qkallbz()
      let obj = {
        0: {
          noneMes: '请选择您要查看的对象',
          allMes: '只能查看一个对象，请不要心急'
        },
        1: {
          noneMes: '请选择您要统计的对象',
          allMes: '只能统计一个对象，请不要心急',
          edgeMes: '关系信息不能进行统计对象'
        },
        2: {
          noneMes: '请选择对象，以分析关系类型',
          edgeMes: '查询分析的的选择对象，至少为两个及以上'
        },
        4: {
          noneMes: '请选择您要添加备注的对象',
          allMes: '添加备注的对象只能有一个，且不能添加关系备注',
          edgeMes: '不能添加关系备注'
        }
      };
      let res = graph.selectionModel.datas.filter(i => i instanceof Q.Node)

      if (index == 2) {
        if (res.length < 2) {
          this.xqboxbol = '-1';
          this.$notify.warning(obj[index].edgeMes);
        }
      } else if (index == 4 || index == 0 || index == 1) {
        if (graph.selectionModel.datas.length == 0) {
          this.xqboxbol = '-1';
          this.$notify.warning(obj[index].noneMes);
        } else if (graph.selectionModel.datas.length > 1) {
          this.xqboxbol = '-1';
          // if (index == 2) {
          //   this.xqboxbol = 0;
          //   return;
          // }
          this.$notify.warning(obj[index].allMes);
        } else if (graph.selectionModel.datas[0] instanceof Q.Edge) {
          if (index == 0) {
            this.xqbol = 5;
          } else {
            this.xqboxbol = '-1';
            this.$notify.warning(obj[index].edgeMes);
          }
        }
      }
    },
    sscdfn() {
      this.xqboxbol = '-1';
      // this.qkallbz()
    },
    wjcxcd2(val) {
      return new Promise((resolve, reject) => {
        if (this.idAddReady) {
          this.visible = !this.visible;
          return;
        }
        this.spinShow = true;
        $('.removexl').fadeOut();
        $('.bjlx').fadeOut();
        $('.cxlx').fadeOut();
        api.api('post', api.loginUrl2 + '/files/queryList', { role: this.roleInfo }).then((response) => {
          this.pldrarr = [response.find(i => i.caseId == this.$route.query.caseId)]
          this.visible = !this.visible;
          this.spinShow = false;
          this.idAddReady = true;
          reslove();
        }).catch((error) => {
          this.spinShow = false;
          reject();
        });
      });
    },
    updateRelaExpand(reqPramas, isDbClick) {
      this.spinShow = true;
      api.api('post', api.loginUrl2 + '/canvasRelation/relaExpand', reqPramas).then(res => {
        this.handleExpandData(reqPramas, res, isDbClick);
      })
        .catch(res => {
          this.spinShow = false;
        });
    },
    InsteadNodeData(params,node){
      Object.keys(params).forEach(key=>{
        if(!(params[key] instanceof Object)&&(key.toUpperCase().indexOf('IMAGE')==-1)){
          node[key] = params[key]
        }
      })
    },
    handleExpandData(reqPramas, res, isDbClick) {
      this.$refs.modelAnaly.traceObj = null
      this.isTraceChange = false;
      var aa = graph._l1Model._k2;
      let replaceImage = aa.filter(item => item instanceof Q.Node && !item.suo);
      replaceImage.map(item => (item.image = item.oldImage));
      let traceObj = graph.exportJSON(true);
      let objArr = { undo: traceObj, redo: null };
      this.traceRelaExpand(objArr);
      let refIdArr = JSON.parse(reqPramas.jsonData)._refId;
      replaceImage.map(item => {
        this.reSetImg2(item.oldImage).then(res => { item.image = res })
      })
      this.setNodeMap();
      this.setEdgeMap();
      let newCreat = new Map();
      let newCreatNode = [];
      this.spinShow = true;
      // let temRefId = this.dataRefId;
      // this.dataRefId = '';
      var aa = graph._l1Model._k2.filter(item => item instanceof Q.Node);
      let OriginString = aa.reduce((t, c) => t + ',' + c._refId, '');
      let hightNode = new Map();
      res.forEach(item => {
        hightNode.set(item._refId, item);
        item.node.forEach(child => {
          hightNode.set(child._refId, child);
          if (!this.graphNodeMap.get(child._refId)) {
            let n = this.createdNodeLocation({
              suspicion: child.suspicion,
              name: child.name,
              _refId: child._refId,
              image: this.filterImg(child.image),
              oldImage: this.filterImg(child.oldImage),
              _reftype: child.type,
              model: graph.graphModel,
              fileOrCaseId:child.fileOrCaseId
            });
            this.graphNodeMap.set(child._refId, n);
            newCreatNode.push(child._refId);
          } else {
            this.InsteadNodeData(child,this.graphNodeMap.get(child._refId))
          }
        });
        this.setGraphMap();
        // this.dataRefId = temRefId;
      });
      this.setNodeMap();
      newCreatNode.reduce((t, c) => t.set(c, this.graphNodeMap.get(c)), newCreat);
      res.forEach(item => {
        item.node.forEach(child => {
          hightNode.set(child.edge.absId, child.edge);
          if (this.graphEdgeMap.get(child.edge.absId)) {
            graph.graphModel.remove(this.graphEdgeMap.get(child.edge.absId));
          }
          setTimeout(() => {
            let w = child.edge.arrow == '1' ? child.edge.toVId : child.edge.fromVId;
            let s = child.edge.arrow == '1' ? child.edge.fromVId : child.edge.toVId;
            var edge = new Q.Edge(this.graphNodeMap.get(w), this.graphNodeMap.get(s));
            var c1 = graph.graphModel.add(edge);
            c1.name = child.edge.intimacy || child.edge.name;
            c1.fromVId = w;
            c1.toVId = s;
            c1.idArr = child.edge.idArr;
            c1.absId = child.edge.absId;
            c1.arrow = child.edge.arrow
            c1.infoCount = child.edge.name;
            child.edge.intimacy && (c1.intimacy = child.edge.intimacy);
            this.reSetEdge(c1);
            newCreat.set(c1.absId, c1);

          }, 0)
        });
      });
      var layouter;

      let regEn = new RegExp(/[a-bA-Z]/g)
      if (newCreatNode.length > 0) {

        this.autoName = '星云';
        if (this.matchType == 'flower') {
          this.autoName = '散点';
        } else if (this.matchType == 'galaxy') {
          this.autoName = '星云';
        }
        this.AutoLayouter.doLayout({
          layoutType: this.autoName,
          byAnimate: true,
          callback: function () {
            graph.zoomToOverview(true);
          }
        });
      }

      // if (graph.graphModel.size()<20) {
      //     	graph.centerTo(0,0,1.5,true)
      //   }
      // 高亮需要的数据
      let resArr = []
      setTimeout(() => {
        if (!isDbClick) {
          let h = [...hightNode.keys()]
          this.setGraphMap()
          h.forEach(i => { resArr.push(this.graphMap.get(i)) });
          graph.setSelection(resArr);
          this.interstyle.setIsAnalysis(false)
          var aa = graph._l1Model._k2;
          aa.forEach(s => {
            s.setStyle(Q.Styles.ALPHA, 1);
            s.zIndex = 10;
          });
        }
        setTimeout(() => { this.spinShow = false }, 0)
        this.isTraceChange = true;
        this.setGraphMap()
        this.handleunCalcData()
      }, 0);


    },
    wjcxcd(val) {
      if (!val.fileName) {
        return;
      }
      var _this = this;
      this.spinShow = true;
      var model = graph.graphModel;
      this.$refs.modelAnaly.traceObj = null
      api.api('post', api.loginUrl2 + '/file/fileQuery', { fileId: val.id, caseId: this.$route.query.caseId }).then(res => {
        this.spinShow = false;
        this.visible = false;
        this.setNodeMap();
        this.setEdgeMap();
        let uniqNode = new Map();
        let uniqEdge = new Map();
        let nodeArr = res.filter(i => i._className == 'Q.Node');
        let edgeArr = res.filter(i => i._className == 'Q.Edge');
        nodeArr.forEach(item => {
          if (!this.graphNodeMap.get(item._refId)) {
            uniqNode.set(item._refId, item);
          }
        });
        edgeArr.forEach(item => {
          if (!this.graphEdgeMap.get(item.json.absId)) {
            uniqEdge.set(item.json.absId, item);
          }
        });
        let uniqNodeArr = [...uniqNode.values()];
        let uniqEdgeArr = [...uniqEdge.values()];
        if (uniqNodeArr.length == 0 && uniqEdgeArr.length == 0) {
          this.$message.warning('您添加的数据，已经都在推演室中，不需要再添加');
        }
        let divd = 2 * uniqNodeArr.length;
        let cy = parseInt(graph.bounds.cy);
        let cx = parseInt(graph.bounds.right - 240);
        let sortArr = [];
        uniqNodeArr.forEach((item, index, arr) => {
          this.createdNodeLocation({
            name: item.json.name,
            suspicion: item.json.suspicion,
            image: this.filterImg(item.json.image),
            oldImage: this.filterImg(item.json.oldImage),
            _refId: item._refId,
            _reftype: item.json.type,
            x: cx + 500 + 500 * Math.sin(2 * index * 3.14 / divd),
            y: cy + 500 * Math.cos(2 * index * 3.14 / divd),
            model: graph.graphModel,
            fileOrCaseId:item.fileOrCaseId
          });
        });
        this.handleunCalcData()
        this.setNodeMap();
        uniqEdgeArr.forEach(it => {
          var item = it.json;
          var w = item.from._ref || item.absId.split('-')[0];
          var s = item.to._ref || item.absId.split('-')[1];
          var edge = new Q.Edge(
            this.graphNodeMap.get(w),
            this.graphNodeMap.get(s)
          );
          var c1 = graph.graphModel.add(edge);
          c1.name = item.name;
          c1.fromVId = w;
          c1.toVId = s;
          c1.idArr = item.idArr;
          c1.absId = item.absId;
          c1.setStyle(Q.Styles.LABEL_COLOR, 'gray');
          c1.setStyle(Q.Styles.EDGE_COLOR, '#ccc');
          c1.setStyle(Q.Styles.ARROW_TO, false);
          c1.setStyle(Q.Styles.EDGE_WIDTH, 1);
          // c1.setStyle(Q.Styles.EDGE_LINE_DASH, [8, 4, 1, 4]);
        });
        uniqNodeArr.sort((a, b) => { return (this.graphNodeMap.get(b._refId).edgeCount - this.graphNodeMap.get(a._refId).edgeCount); });
        let moveNode = this.graphNodeMap.get(uniqNodeArr[0]._refId);
        let offX = cx + 450 - moveNode.x;
        let offY = cy - moveNode.y;
        graph.moveElements([moveNode], offX, offY);
        let scal = 1 - graph.height / graph.count / 10;
        graph.centerTo(cx, cy, 0.5, true);
      })
        .catch(res => {
          this.spinShow = false;
          this.visible = false;
        });
    },
    reSetImg2(image, r, color) {
      let l = r || 80;
      return new Promise(resolve => {
        var imma = new Image();
        imma.crossOrigin = 'Anonymous';
        imma.src = this.filterImg(image);
        // imma.src = require('../../../static/page/images/toolbar/timg (2).jpg')
        imma.onload = () => {
          var customDraw = {
            width: l,
            height: l,
            draw: function (g, scale) {
              g.beginPath();
              g.arc(l / 2, l / 2, l / 4, 0, 2 * Math.PI);
              g.lineWidth = (color ? 7 : 0);
              g.strokeStyle = color || '#fff';
              g.stroke();
              g.clip();
              g.drawImage(imma, l / 4, l / 4, l / 2, l / 2);
            }
          };
          resolve(customDraw);
        };
        imma.onerror = (e) => {
          imma.src = require('../../../images/person/test6.png');
        }
      });
    },
    createdNodeLocation(parmas) {
      const { name, image, _refId, _reftype, x, y, model, oldImage, suspicion,fileOrCaseId } = parmas;
      var circle = Q.Shapes.getShape(Q.Consts.SHAPE_CIRCLE, 0, 0, 40, 40);
      var shape = new Q.ImageUI(circle);
      shape.lineWidth = 1;
      shape.strokeStyle = '#ccc';
      shape.fillColor = '#fff';
      shape.zIndex = -1;
      var b = (x && y) ? graph.createNode(name, x, y) : model.add(new Q.Node(name))
      b.size = { height: 40, width: 40 };
      b.setStyle(Q.Styles.LABEL_COLOR, 'gray');
      this.reSetImg2(oldImage).then(res => { b.image = res; });
      (b.oldImage = this.filterImg(oldImage)), (b._refId = _refId);
      b._reftype = _reftype;
      suspicion && (b.suspicion = suspicion)
      b.fileOrCaseId = fileOrCaseId
      b.addUI(shape, [{
        property: 'shape',
        propertyType: Q.Consts.PROPERTY_TYPE_CLIENT,
        bindingProperty: 'lineWidth'
      }]);
      b.size = { width: 40, height: 40 };
      b.setStyle(Q.Styles.LABEL_FONT_SIZE, 12);
      b.zIndex = 11;
      return b;
    },
    tjbzbz() {
      let s = graph.selectionModel.datas.find(i => i instanceof Q.Node);
      if (graph.selectionModel.datas.length !== 1 || s == undefined) {
        this.$message.warning('您只能备注对象，且只能备注一个对象！');
        return;
      }
      if (this.yhbz3 == '' || this.yhbz3 == undefined) {
        this.$message.warning('请您添加需要备注的信息!');
        return;
      }
      if (!s.bz) {
        var icon = new Q.ImageUI(require('../../../images/icon/tooltip-text.png'));
        icon.position = Q.Position.RIGHT_TOP;
        icon.anchorPosition = Q.Position.LEFT_TOP;
        icon.showPointer = true;
        s.addUI(icon, {
          property: 'icon.alpha',
          propertyType: Q.Consts.PROPERTY_TYPE_CLIENT,
          bindingProperty: 'alpha'
        });
      }

      s.set('icon.alpha', 1);
      s.bz = this.yhbz3;
    },
    colorChange(val) {
      this.commEdir.handleRightStatus();
      let changeBox = document.querySelector('#customWidget #colorSelector2 div');
      changeBox.style.backgroundColor = val;
      let res = graph.selectionModel.datas.filter(i => !i.suo);
      let objArr = [];
      res.forEach(s => {
        let obj = { data: s, undoColor: s.colornew || '#ccc', redoColor: val };
        if (s instanceof Q.Node) {
          s.setStyle(Q.Styles.IMAGE_BORDER_STYLE, val);
          s.setStyle(Q.Styles.LABEL_COLOR, val);
          s.bindingUIs.datas[0].ui.strokeStyle = val;
          s.colornew = val;
        }
        if (s instanceof Q.Edge) {
          s.setStyle(Q.Styles.EDGE_COLOR, val);
          s.setStyle(Q.Styles.LABEL_COLOR, val); // 文字的颜色
          s.colornew = val;
          if (s instanceof Q.Edge && s.getStyle(Q.Styles.ARROW_TO) && s.colornew) {
            s.setStyle(Q.Styles.ARROW_TO, false);
            s.setStyle(Q.Styles.ARROW_TO, true);
            s.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, val);
          }
        }
        objArr.push(obj);
      });
      this.traceColor(objArr);
    },
    qkallbz() {
      let s = graph.selectionModel.datas.find(i => i instanceof Q.Node);
      if (graph.selectionModel.datas.length !== 1) {
        this.$message.warning('您只能进行清空单个对象的备注操作！');
        return;
      }
      this.yhbz3 = '';
      s.set('icon.alpha', 0);
      s.bz = '';
    },
    initCavasData() {
      this.spinShow = true;
      if (JSON.stringify(this.$route.query) !== '{}') {
        graph.clear();
        if (this.$route.query.jsonid) {
          var imgFileData;
          storage.remove('caseFile')
          if (this.$store.state.jsonid) {
            this.initGraphDate(JSON.parse(JSON.stringify(this.$store.getters.img_file_data)));
            graph.updateViewport();
            this.spinShow = false;
          } else {
            let id = this.$route.query.jsonid
            api.api('post', api.loginUrl2 + '/tAnalyse/result/detail', { id })
              .then(response => {
                this.$store.commit('setJsonid', response.id);
                this.$store.dispatch('setImgFileData', response);
                this.initGraphDate(response);
                this.spinShow = false;
              });
            graph.updateViewport();
          }
        }
        if (this.$route.query.caseFile) {
          if (this.$store.state.caseFile) {
            this.initdataGraph(JSON.parse(JSON.stringify(this.$store.getters.case_file)));
            graph.updateViewport();
            this.spinShow = false;
          } else {
            let parmas = {}
            parmas.jsonData = this.$route.query.caseDedu
            this.spinShow = true;
            let fileCase = JSON.parse(storage.get('caseFile'))
            this.initdataGraph(fileCase[this.$route.query.caseId])
          }
        }
        if (this.$route.query.searid) {
          this.$store.dispatch('setImgFileData', {});
          storage.remove('caseFile')
          graph.clear();
          this.spinShow = false;
          var model = graph.graphModel;
          const renderCanvas = response => {
            response.forEach(s => {
              this.createdNodeLocation({
                name: s.name,
                suspicion: s.suspicion,
                _refId: s._refId,
                image: this.filterImg(s.image),
                oldImage: this.filterImg(s.oldImage),
                _reftype: s.type,
                model: model,
                fileOrCaseId:s.fileOrCaseId
              });
            });
            this.setGraphMap();
            let addEdge = response.filter(item => item.hasOwnProperty('node'));
            if (addEdge.length > 0) {
              this.setNodeMap();
              this.setEdgeMap();
              let repeAbs = new Map();
              addEdge.forEach(it => {
                let item = it.node[0].edge;
                if (!this.graphEdgeMap.get(item.absId)) {
                  repeAbs.set(item.absId, item);
                }
              });
              let unqAbsId = [...repeAbs.values()];
              unqAbsId.forEach(item => {
                let w = item.fromVId;
                let s = item.toVId;
                var edge = new Q.Edge(
                  this.graphNodeMap.get(w),
                  this.graphNodeMap.get(s)
                );
                var c1 = graph.graphModel.add(edge);
                c1.name = item.name;
                c1.fromVId = w;
                c1.toVId = s;
                c1.idArr = item.idArr;
                c1.absId = item.absId;
                item.intimacy && (c1.intimacy = item.intimacy);
                this.reSetEdge(c1);
              });
            }
            this.$store.dispatch('isChangeGraph', true);
            var layouter = new Q.BalloonLayouter(graph);
            layouter.radius = 150;
            layouter.doLayout({
              byAnimate: true,
              callback: function () {
                graph.zoomToOverview(true, 2);
              }
            });
            var aa = graph._l1Model._k2.find(item => item instanceof Q.Node);
            this.$store.dispatch('isChangeGraph', false);
            this.nodeInfo({
              imgUrl: this.filterImg(aa.oldImage),
              name: aa.name,
              _refId: aa._refId,
              fileOrCaseId:aa.fileOrCaseId
            });
            this.NodeData = aa;
            this.dataRefId = aa._refId;
            this.NodeRefIdArr = [aa._refId];
            graph.updateViewport();
            this.setCalcStatus()
          };
          if (this.$store.state.jsonid) {
            renderCanvas(JSON.parse(JSON.stringify(this.$store.getters.search_data)));
            graph.updateViewport();
            this.spinShow = false;
          } else {
            api.api('post', api.loginUrl2 + '/canvasTarget/add', { typeNum: this.$route.query.searid,caseId:this.$route.query.caseId }).then(res => {
              renderCanvas(res);
              graph.updateViewport();
              this.spinShow = false;
            }).catch(res => {
              this.spinShow = false;
            });
          }
        }
        if (this.$route.query.dataid) {
          storage.remove('caseFile')
          // this.spinShow = false;
          this.$store.dispatch('setImgFileData', {});
          var imgFileData;
          if (this.$store.state.dataid) {
            this.initdataGraph(JSON.parse(JSON.stringify(this.$store.getters.file_data)));
            graph.updateViewport();
            setTimeout(() => {
              this.spinShow = false;
            }, 2000);

          } else {
            let id = this.$route.query.dataid;
            let caseId = this.$route.query.caseId
            this.spinShow = true;
            api.api('post', api.loginUrl2 + '/file/fileQuery', { fileId: id, caseId: caseId }).then(res => {
              this.$store.commit('setDataid', id);
              this.$store.dispatch('setFileData', res);
              this.initdataGraph(res);
              setTimeout(() => {
                this.spinShow = false;
              }, 2000);
              graph.updateViewport();
            });
          }
        }
      }
    }
  }
};
</script>
<style lang="less">
.move-message {
  top: 126px;
}
.Q-Export-JSON {
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  background: #ddd;
  opacity: 0.9;
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
}
//搜索框样式修改
.canvas-search-ct > .input-group-btn > .btn {
  c0c0c0ffffff &:active,
  &:focus,
  &:hover {
    background: #f3f5f6;
    box-shadow: none;
  }
}
.zdyadd2 {
  position: relative;
  .file-tree {
    position: absolute;
    right: 10px;
    top: 52px;
    background: #fff;
    padding: 15px 20px;
    border-radius: 5px;
    border: 1px solid #ddd;
    box-shadow: 1px 1px 8px 2px #e4e1e1;
    width: 300px;
    height: 400px;
    overflow: hidden;
    .to-y-scroll {
      width: 500px;
      .el-input {
        text-align: left;
        .el-input__inner {
          width: 260px;
          display: inline-block;
          // float: left;
        }
      }

      // padding-right: 250px;
    }
    .custom-tree-node {
      vertical-align: middle;
      span {
        vertical-align: middle;
      }
      .tree-icon-ct {
        padding-top: 2px;
        width: 19px;
        display: inline-block;

        img {
          width: 100%;
          display: block;
        }
      }
    }
  }
}
.node-tooltip {
  position: absolute;
  top: 300px;
  left: 300px;
  z-index: 300;
  background-color: RGBA(27, 27, 27, 0.6);
  padding: 6px 15px;
  color: #fff;
  border-radius: 5px;
  font-size: 14px;
}
.toobar-color-picker {
  position: absolute;
  left: 680px;
  top: 2px;
  z-index: -99999;
  .ivu-color-picker-rel {
    height: 50px;
    width: 60px;
    opacity: 0;
    .ivu-color-picker-input {
      height: 50px;
      width: 58px;
      cursor: pointer;
      opacity: 0;
    }
  }
}
</style>
