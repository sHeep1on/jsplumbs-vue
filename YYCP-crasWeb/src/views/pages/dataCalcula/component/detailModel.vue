<template>
    <Modal width="1000px" class="look" v-model="addModal" :title="title" :mask-closable="false" footer-hide @on-cancel="modalCancel">
        <div class="data-import-detail-ct" v-chinaOlyScrollBar>
        <div class="calc-import-detail">
           <Table :tooltip='true' :loading="loading" stripe ref="selection" :columns="lookColumns" :data="lookData" ></Table>
        </div>
        </div>
    </Modal>
</template>

<script>
import api from '@/fetch/api';
export default {
    data () {
        return{
            addModal: false,
            height: 250,
            title: '查看文件',
            loading: false,
            lookColumns:[],
            lookData: [],
            crr:[]
        }
    },
    methods: {
        modalCancel(){
          this.addModal = false;
          this.lookData = []
        },
        look(tbid){
          console.log(tbid);
            api.api("get",api.loginUrl2 +"/tFilesDataList/queryCaseInfo?id="+tbid).then(res => {
              let lookColumns = res.shift()
              lookColumns = lookColumns.split(',')
              lookColumns.forEach((item,index)=>{
                if (item!=='') {
                  this.lookColumns.push({
                  title: item,
                  key: "a"+index,
                  align: 'center',
                  ellipsis: true
                })
                }
              })
              res.forEach((item,index)=>{
                let data = item.split(',')
                let obj ={}
                data.forEach((data,key)=>{
                  obj['a'+key] = data
                })
                this.lookData.push(obj)
              })

                this.loading=false;
            })
        },
    }
};
</script>
<style lang="less">
.look .ivu-modal{
    width: 1200px;
}
.look .ivu-table-cell{
    padding: 0 5px;
}
.look .ivu-modal-body{
    padding-bottom: 20px;
}
.data-import-detail-ct {
position: relative;
width: 100%;
height: 500px;
.calc-import-detail {
    width: 5000px;
    height: 900px;
}
}
</style>
