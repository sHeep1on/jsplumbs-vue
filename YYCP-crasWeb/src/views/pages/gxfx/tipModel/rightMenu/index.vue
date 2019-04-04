<template>
  <div>
    <right-menu-com :event='contextmenuEvent'  @refreshbizlines="clickEvent"  :list='lists'  :show.sync="isShow"></right-menu-com>
  </div>
</template>
<script>
import rightMenuCom from "./rightMenuCom";
export default {
  name: "rightMenu",
  props: {
    event: MouseEvent
  },
  provide(){
    return {
      rughtMenuCom:this
    }
  },
  data () {
    return {
      contextmenuEvent: null,
      lists: [
        { label: "添加", condition: ['node', 'all', 'edge','none'], disable: false, interaction: 'addNodeFn' },
        {          label: "删除", condition: ['node', 'all', 'edge','none'], disable: false,
          childrens: [
            { label: "删除选项", condition: ['node', 'edge'], disable: false, interaction: 'deleNodeFn' },
            { label: "删除全部", condition: ['node','all' ,'edge'], disable: false, interaction: 'chearGraph' }
          ]
        },
        { label: "锁定", condition: ['node', 'edge'], disable: false, interaction: 'handleLock' },
        { label: "解锁", condition: ['node', 'edge'], disable: false, interaction: 'handleUnlock' },
        { label: "全部展开", condition: ['node'], disable: false, interaction: 'handleNodeUnfold' },
        { label: "全部收缩", condition: ['node'], disable: false, interaction: 'handleNodeFold' },
        {          label: "布局", condition: ['node', 'all', 'edge','none'], disable: false, interaction: 'addNodeFn',
          childrens: [
            { headIcon: "layer1", label: "弹性布局", condition: ['node', 'all', 'edge'], disable: false, interaction: 'handleSpring' },
            { headIcon: "glaxy", label: "星云布局", condition: ['node', 'all', 'edge'], disable: false, interaction: 'handleGlaxy' },
            { headIcon: "flower", label: "散点布局", condition: ['node', 'all', 'edge'], disable: false, interaction: 'handleFlower' },
            { headIcon: "person", label: "人物布局", condition: ['node', 'all', 'edge'], disable: false, interaction: 'handlePerson' },
            { headIcon: "circle", label: "圆盘布局", condition: ['node', 'all', 'edge'], disable: false, interaction: 'handleFakerTree' }
          ]
        },
        { label: "模型分析", condition: ['node', 'all', 'edge'], disable: false, interaction: 'handleModelAnaly' },
        { label: "备注", condition: ['node'], disable: false, interaction: 'handleNodeRemark' },
      ],
      isShow: false
    };
  },
  components: {
    rightMenuCom
  },
  watch: {
    event (val) {
      this.contextmenuEvent = val,
        this.isShow = true
      this.RightMenuStatus()
    }
  },
  computed: {

  },
  methods: {
    clickEvent (evt, item) {
      this.$emit(item['interaction'])
      this.isShow = false
    },
    RightMenuStatus () {
      if (graph.selectionModel.length === 0) {
        this.handleIteration(this.lists, 'all')
        if (graph._l1Model._k2.length==0){
          this.handleIteration(this.lists, 'none')
        }
      } else if (graph.selectionModel.datas.some(item => item instanceof Q.Edge)) {
        this.handleIteration(this.lists, 'edge')
      } else {
        this.handleIteration(this.lists, 'node')
      }
    },
    handleIteration (arr, status) {
      arr.map(item => {
        (item.condition.indexOf(status) == -1) ? (item.disable = true) : (item.disable = false)
        item.childrens && this.handleIteration(item.childrens, status)
      })
    }
  }
};
</script>