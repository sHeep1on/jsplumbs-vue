import { Message } from 'element-ui';
class editorNode {
  constructor(seletor) {
    this.graph = seletor.graph ? option.graph : window.graph
    this.node = document.querySelector(seletor)
    this.node.editorNode = this
  }
  //确定所有的状态转变
  handleRightStatus(select) {
    let selectBox = select || this.graph.selectionModel.datas
    let NodeNum = selectBox.filter(i => i instanceof Q.Node)
    //选中框中没有任何节点
    if (!selectBox.some(i => i instanceof Q.Node)) {
      //添加节点
      $('.tooltip .yjcz .addNode').removeClass("jzsy")
      //删除状态
      $('.tooltip .scxl .scdx').addClass('jzsy')
      $(".tooltip .scxl .scall").removeClass("jzsy");
      $('.toolbar-remove-btn .removexl .scdx').addClass('jzsy')
      //锁定状态
      $(".tooltip .yjcz .jiesuo").addClass("jzsy");
      $(".tooltip .suodin").addClass("jzsy");
      //全部展开
      $('.tooltip .zkqb').addClass("jzsy")
      $('.tooltip .qbss').addClass('jzsy')
      // 点击备注
      $(".tooltip .bzxx").addClass("jzsy");
    } else if (NodeNum.every(i => i.suo)) {
      //添加状态改变
      $('.tooltip .yjcz .addNode').addClass("jzsy")
      //锁定解锁状态改变
      $(".toolbar-lock-btn .q-icon").addClass("suobol");
      $(".toolbar-lock-btn>span").text("解锁");
      $(".tooltip .suodin").addClass("jzsy");
      $(".tooltip .jiesuo").removeClass("jzsy");
      //删除状态改变
      $('.tooltip .scxl .scdx').addClass('jzsy')
      $(".tooltip .scxl .scall").removeClass("jzsy");
      $('.toolbar-remove-btn .removexl .scdx').addClass('jzsy')
      //全部展开
      $('.tooltip .zkqb').addClass("jzsy")
      $('.tooltip .qbss').addClass('jzsy')
      // 点击备注
      $(".tooltip .bzxx").addClass("jzsy");
    } else if (NodeNum.some(i => !i.suo)) {
      //锁定状态改变
      $(".toolbar-lock-btn .q-icon").removeClass("suobol");
      $(".toolbar-lock-btn>span").text("锁定");
      $(".tooltip .suodin").removeClass("jzsy");
      $(".tooltip .jiesuo").addClass("jzsy");
      //删除状态改变
      $('.tooltip .scxl .scdx').removeClass('jzsy')
      $('.toolbar-remove-btn .removexl .scdx').removeClass('jzsy')
      //全部展开
      $('.tooltip .zkqb').removeClass("jzsy")
      $('.tooltip .qbss').removeClass('jzsy')
      // 点击备注
      $(".tooltip .bzxx").removeClass("jzsy");
    }
    $(".removexl").fadeOut();
    $(".bjlx").fadeOut();
    $(".cxlx").fadeOut();
  }
  //当点击对象的时候，切换删除按钮的状态
  handleRemover() {
    this.handleRightStatus()
    let toggleBox = document.querySelector('.removexl')
    if (getComputedStyle(toggleBox).display == 'none') {
      toggleBox.style.display = 'block'

    } else {
      toggleBox.style.display = 'none'
    }
    $(".tooltip").fadeOut()
  }
  //删除选项
  deleNodeFn(that,isClearAll) {
    this.handleRightStatus()
    if (this.node.classList.contains('jzsy')) {
      return
    } else {
      this.node.classList.remove('jzsy')
      let res = isClearAll?this.graph._l1Model._k2.filter(item => (item instanceof Q.Node) && !item.suo):
      this.graph.selectionModel.datas.filter(item => (item instanceof Q.Node) && !item.suo)
      let obj={
        node:[],
        edge:[]
      }
      res.forEach(item => {
        obj.node.push(item)
        item.forEachEdge(function(edge){
          obj.edge.push(edge)
        })
        this.graph.graphModel.remove(item)
        //图谱中关系合并整理
        that.dataRefId = null;
      })
      if (obj.node.length==0&&obj.edge.length==0) {
        if (isClearAll&&this.graph._l1Model._k2.length!==0) {
          that.$message.warning('该对象已被锁定，不能被删除~')
        }
        return
      }
      that.traceRemove(obj)
    }


    $(".tooltip").fadeOut()
  }
  //新增对象框选show
  addNodeFn(that) {
    this.handleRightStatus()
    if (!this.node.classList.contains('jzsy')) {
      $('.tooltip').hide()
      that.modal5 = true
    }
    $(".tooltip").fadeOut()
  }
  //锁定和解锁状态转换
  handleLock(lock, that) {
    this.handleRightStatus()
    let res = this.graph.selectionModel.datas.filter(item => item instanceof Q.Node)

    if (lock) {
      res.forEach(node => {
        node.suo = true;
        this.handleRightStatus()
        node.image = require("../../../static/page/images/suo.png")
      })
    } else {
      res.forEach(node => {
        node.suo = false;
        this.handleRightStatus()
        that.reSetImg2(node.oldImage).then(res => node.image = res)
      })
    }
    let obj = {
      isLock:lock,
      data:res
    }
    that.tarceLock(obj)
    $(".tooltip").fadeOut()
  }
  //新建画布
  handleNewGraph(that) {
    this.handleRightStatus()
    that.isNewGraph = true
    $(".tooltip").fadeOut()
  }
  //对象备注
  handleNodeRemark(that) {
    this.handleRightStatus()
    if (this.node.classList.contains('jzsy')) return
    let res = this.graph.selectionModel.datas.filter(item => (item instanceof Q.Node) && !item.suo)
    if (res.length > 1) { that.$message.warning('不要心急，请一个对象一个对象备注！！'); return }
    if (res[0].bz) {
      that.yhbz3 = res[0].bz;
      that.remnant3 = that.yhbz3.length
    } else {
      that.yhbz3 = "";
      that.remnant3 = 0
    }
    that.contentRight = 0
    that.gaoliang = 4;
    that.xqbol = 4;
    that.xqboxbol = 0;
    $(".tooltip").fadeOut()
  }
  //计算状态页面
  handleCalcStatus(that){
    let btn = this.node.querySelector('div')
    if (btn.classList.contains('toolbar-calc')) {
      btn.classList.remove('toolbar-calc')
      btn.classList.add('toolbar-calced')
      that.handleCalcData()
    } else {
      btn.classList.remove('toolbar-calced')
      btn.classList.add('toolbar-calc')
      that.handleunCalcData()
    }
  }
  //模型分析
  handleModelAnaly(that) {
    this.handleRightStatus()
    that.contentRight = 0
    that.gaoliang = 3;
    that.xqbol = 3;
    that.xqboxbol = 0;
    $(".tooltip").fadeOut()
  }
  //展开全部
  handleNodeUnfold(that) {
    this.handleRightStatus()
    if (this.node.classList.contains('jzsy')) return
    let res = this.graph.selectionModel.datas.filter(item => (item instanceof Q.Node) && !item.suo)
    let resArr = []
    res.forEach(i => resArr.push(i._refId))
    let result = {}
    result.jsonData = JSON.stringify({
      _refId: [resArr],
      limit: 200
    })
    that.updateRelaExpand(result, true)
    $(".tooltip").fadeOut()
  }
  //收缩功能删除
  handleNodeFold(that) {
    this.handleRightStatus()
    if (this.node.classList.contains('jzsy')) return;
    let res = this.graph.selectionModel.datas.filter(item => (item instanceof Q.Node) && !item.suo)
    if (res.length!==1) {
      that.$message.warning('只能收缩一个对象')
    } else {
      let resArr = []
      res[0].forEachEdge(item=>{
        let tarNode = item.to._refId==res[0]._refId?item.from:item.to
        resArr.push(tarNode)
      })
      let obj={
        node:[],
        edge:[]
      }
      let tarArr = resArr.filter(i=>i.edgeCount==1)
      tarArr.forEach(i=>{
        obj.node.push(i)
        i.forEachEdge(e=>obj.edge.push(e))
        this.graph.graphModel.remove(i)})
        that.traceNodeFold(obj)
    }

    $(".tooltip").fadeOut()
  }
  //设置箭头样式
  handleEdgeArrow(that){
    this.handleRightStatus()
    let res = this.graph.selectionModel.datas.filter(i=>i instanceof Q.Edge)
    let arr = []
    if (res.length==0) {
      Message({
        message:'请选择需要改变箭头的关系',
        customClass:'move-message',
        type:'warning'
      })
      // that.$message.warning('请选择需要改变箭头的关系')
    } else {
      if (res.every(i=>i.getStyle(Q.Styles.ARROW_TO))) {

        res.forEach(s=>{
          let obj = {edge:s,arrow:s.getStyle(Q.Styles.ARROW_TO)}
          arr.push(obj)
          s.setStyle(Q.Styles.ARROW_TO, false)
        })
      } else {
        res.forEach(s=>{
          let obj = {edge:s,arrow:s.getStyle(Q.Styles.ARROW_TO)}
          arr.push(obj)
          s.setStyle(Q.Styles.ARROW_TO, true)
          s.setStyle(Q.Styles.ARROW_TO_OUTLINE, null)
          s.setStyle(Q.Styles.ARROW_TO_FILL_COLOR, "#2ebcff")
        })
      }
      that.traceArrow(arr)
    }

  }
  //设置关系粗细
  handleEdgeWeight(that){
    let res = this.graph.selectionModel.datas.filter(i=>i instanceof Q.Edge)
    this.handleRightStatus()
    if (res.length==0) {
      that.$message.warning('请选择需要改变粗细的关系')
    } else {
      this.node.querySelector('.cxlx').style.display='block'
    }
  }
  handleChangeEdge(e,that){
    let res = this.graph.selectionModel.datas.filter(i=>i instanceof Q.Edge)
    let target  = e.target || e.srcElement;
    let arr = []
    if(target.nodeName.toLowerCase() == 'li') {
      let elList = target.parentElement.querySelectorAll('li');
      let index = Array.prototype.indexOf.call(elList, target);
      res.forEach(edge=>{
        edge.newWidth=(index + 1)
        let obj = {edge:edge,oldWidth:edge.getStyle(Q.Styles.EDGE_WIDTH),newWidth:edge.newWidth}
        arr.push(obj)
        edge.setStyle(Q.Styles.EDGE_WIDTH, index + 1)
      })
    }
    that.traceWeight(arr)

  }
  //弹性布局
  handleReLayout(that){
    this.handleRightStatus()
    let toggleBox = document.querySelector('.bjbox .bjlx')
    if (getComputedStyle(toggleBox).display == 'none') {
      toggleBox.style.display = 'block'
    } else {
      toggleBox.style.display = 'none'
    }
  }
}
export default function $$(ele) {
  return new editorNode(ele)
}
