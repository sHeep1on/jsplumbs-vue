<template>
  <Modal title="添加节点" v-model="show" :mask-closable="false" @on-cancel="handleCancel" class="save-file-img-ct reset-model">
    <div class="addjdbox" v-chinaOlyloading.fullscreen="spinShow">
      <label for="addjd">添加：</label>
      <input id="addjd" type="text" placeholder="请输入手机号码/身份证号码/公司" v-model.trim="addjdname">
    </div>
    <div slot="footer">
      <Button @click="handleCancel">取消</Button>
      <Button type="primary" @click="addok">确认</Button>
    </div>
         <transition name='fade'>
        <div class="history-wr"  v-show="isShowCompany">
          <p class="none-history" v-show="companyList.length==0">您现在暂无搜索记录</p>
          <ul class="history-ct company-ct" v-chinaOlyScrollBar>
            <li v-for="(item,index) in companyList">
              <span  @click="handleHistorySearch(item)" :title='item'>{{item}}</span>
            </li>
          </ul>
        </div>
        </transition>
  </Modal>
</template>
<script>
import api from "@/fetch/api";
import {cloneObj} from '@/libs/common/common.js'
export default {
  props:{
    visible:{
      type:Boolean,
      default:false
    }
	},
	inject: {
    graphMap: {
      default: ''
    }
  },
  data(){
    return{
      addjdname:"",
      show:this.visible,
      graphNodeMap:null,
      graphEdgeMap:null,
			spinShow:false,
			isShowCompany:false,
			companyList:[]
    }
  },
  watch:{
    visible(){
      this.show=this.visible
		},
		addjdname(val){
			  let chinaReg = /[\u4e00-\u9fa5]/
       if (chinaReg.test(val)) {
         api.api('post',api.loginUrl2+'/canvasTarget/company',{name:val}).then(res=>{
           this.isShowHistory=false;
           this.isShowCompany = true;
           this.companyList=res
         })
       }
		}
  },
  methods:{
    handleCancel(){
      this.$emit("update:visible", false)
    },
    setNodeMap(){
      	var aa = graph._l1Model._k2;
				this.graphNodeMap = aa.reduce((t,c)=>{
					return c._refId?t.set(c._refId,c):t
				},new Map())
		},
	handleHistorySearch(content){
      this.addjdname = content
      this.addok()
    },
		setEdgeMap(){
      	var aa = graph._l1Model._k2;
				this.graphEdgeMap = aa.reduce((t,c)=>{
					return c.absId?t.set(c.absId,c):t
				},new Map())
    },
    addok(){

      let regEn = /[`~!@#$%^&*()_+<>?:"{}.\/;'[\]]/
      let regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/
			let cPattern = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
			let cP = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      let mPattern = /^1[34578]\d{9}$/
			let splitReg =  /,|\s+/
			 let chinaReg = /[\u4e00-\u9fa5]/
      let nexttys2=true
      if(regEn.test(this.addjdname) || regCn.test(this.addjdname)) {
          this.$message.error('请删除您搜索栏中的特殊符号，包括中文逗号')
          nexttys2=false
      }
      let resArr = this.addjdname.split(splitReg)
      let res = resArr.filter(item=>item!=="")
      if (res.length>5) {
        this.$message.error('一次最多只能添加5条数据，请适当删减 谢谢')
        nexttys2=false
      }
      let warnMes = []
      res.forEach(s=>{
        if( !mPattern.test(s) && !cPattern.test(s) && !chinaReg.test(s)){
          warnMes.push(s)
					nexttys2=false;
				}
      })
      warnMes.length!==0&&this.$message.warning(warnMes.join(',')+" 输入格式错误")
       let unqiPar = [...new Set(res)]
      if (unqiPar.length!==res.length) {
          this.$message.error("您输入的数据中，有重复项，请删减");
           nexttys2 = false;
      }
			if(nexttys2){
        let parmas = res.join(',')
				var aa=graph._l1Model._k2;
				var _this=this
				this.spinShow=true;
					var _refIdarr=[]
					let rankX=[],rankY=[],gap=100
					var mes = []
				if (aa.length>1) {
					const compare=(property)=>(a,b)=>a[property]-b[property]
					this.setNodeMap()
					let nodeRes = [...this.graphNodeMap.values()]
					nodeRes.sort(compare('x'))
          rankX = cloneObj(nodeRes)
					rankY = nodeRes.sort(compare('y'))
					let gapX = rankX[0].x-rankX[1].x
					let gapY = rankY[0].y-rankY[1].y
					let gap = Math.abs(gapX)-Math.abs(gapY)>=0?gapX:gapY
					gap = gap<=100?100:gap
				} else {
					var obj = {}
					obj.x = 0;
					obj.y = 0
					rankX[0]=obj
					rankY[0]=obj
					if (aa.length.length==0) {
						this.graphNodeMap = new Map()
					} else {
						this.setNodeMap()
					}
				}
				api.api('post',api.loginUrl2+'/canvasTarget/add',{
					typeNum:parmas
					},function(){
						_this.spinShow=false;
					})
					.then( (response)=> {
            this.spinShow=false;
						this.$emit("update:visible", false)
						let addNode={
							node:[],
							edge:[]
						}
						response.forEach((s,index) => {
							if(this.graphNodeMap.get(s._refId)){
								mes.push(s.name)
							}else{
								let newNode = this.graphMap.createdNodeLocation({
									name: s.name,
									image: s.image,
									oldImage: s.oldImage,
									_refId: s._refId,
									_reftype: s.type,
									x: (rankX[0].x-(gap)),
									y: (rankY[0].y+(index)*gap),
									model: graph.graphModel
								});
								graph.originAtCenter = false;
								addNode.node.push(node)
							}
						})
						let obj = {
							Undo : {
								center:{
									x:graph.center.x,
									y:graph.center.y
								},
								scale: graph.scale
							},
							Redo : {
								center:{
									x:rankX[0].x-(-gap),
									y:rankY[0].y+(response.length/2)*gap
								},
								scale: 0.8
							}
						}
						graph.centerTo(rankX[0].x-(-gap),rankY[0].y+(response.length/2)*gap,0.8,true)
						let addEdge = response.filter(item=>item.hasOwnProperty('node'))
						if (addEdge.length>0) {
								this.setNodeMap()
								this.setEdgeMap()
								let repeAbs = new Map()
								addEdge.forEach(it=>{
									let item = it.node[0].edge
									if (!this.graphEdgeMap.get(item.absId)) {
										repeAbs.set(item.absId,item)
									}
								})
								let unqAbsId = [...repeAbs.values()]
								unqAbsId.forEach(item=>{
									let w = item.fromVId
									let s = item.toVId
									var edge = new Q.Edge(this.graphNodeMap.get(w),this.graphNodeMap.get(s))
									var c1=graph.graphModel.add(edge);
									c1.name =item.name
									c1.fromVId=w
									c1.toVId=s
									c1.idArr=item.idArr;
									c1.absId=item.absId;
									this.graphMap.reSetEdge(c1)
									addNode.edge.push(c1)
								})
              }
              this.$store.dispatch('isChangeGraph',true)
							if (mes.length>0) {
								mes = mes.join(',')
								this.$message.warning(`${mes} 节点已存在`)
							}
							obj.data = addNode
							this.$emit('traceAddNode',obj)
					})
					.catch(function (error) {
						_this.spinShow=false;
					})
			}
		}
  }
};
</script>
<style lang="less">
.save-file-img-ct{
	.history-wr {
    position: absolute;
    width: 385px;
    height: 220px;
    background: #fff;
    top: 115px;
    left: 50%;
    margin-left: -175px;
    border-radius: 4px;
    box-shadow: 0 0 3px 1px #d9d9d9;
    .none-history {
        line-height: 50px;
        width:100%;
        text-align: center;
        color: #949494;
        position: absolute;
    }
    .history-ct {
        position: relative;
        height: 190px;
        &.company-ct{
            height: 210px;
        }
        li {
          height: 30px;
          line-height: 30px;
          box-sizing: border-box;
          padding: 0px 18px 0 10px;
          display: flex;
          justify-content: space-between;
          &:first-child{
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
          }
          &:hover{
            background:#E4E4E4;
            span:nth-child(2){
                display: block;
            }
          }

          span {
              &:nth-child(1){
                  width: 320px;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space:nowrap;
                  cursor: pointer;
              }
              &:nth-child(2){
                color: #949494;
                cursor: pointer;
                display: none;
              }
          }
        }

    }
    .inter-history {
        line-height: 25px;
        float: right;
        span {
            padding-right: 20px;
            color: #949494;
            cursor: pointer;
        }
    }
}
}

</style>

