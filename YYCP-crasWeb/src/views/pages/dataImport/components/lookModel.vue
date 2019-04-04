<template>
  <Modal width="1000px"
         class="look"
         v-model="addModal"
         :title="title"
         :mask-closable="false"
         footer-hide
         @on-cancel="modalCancel">
    <div class="data-import-detail-ct"
         v-chinaOlyScrollBar>
      <div class="data-import-detail">
        <Table :tooltip='true'
               :loading="loading"
               stripe
               ref="selection"
               :columns="lookColumns"
               :data="lookData"
               :style="{width:width+'px'}"></Table>
      </div>
    </div>
  </Modal>
</template>

<script>
import api from '@/fetch/api';
export default {
  data () {
    return {
      addModal: false,
      height: 250,
      title: '查看文件',
      loading: false,
      lookColumns: [],
      lookData: [],
      crr: [],
      width: 1500
    }
  },
  methods: {
    modalCancel () {
      this.addModal = false;
      this.lookData = []
    },
    look (tbid) {
      // let idUrl = '?id=5E7C2EBBE8D6B69CD826FC77FB6F1F7E'
      let idUrl = '?id=' + tbid
      let w = 0
      api.api("get", api.loginUrl2 + "/files/detail" + idUrl).then(res => {
        let arr = Object.keys(res[0]);
        this.lookColumns = []
        $.each(arr, (i, v) => {
          w += v.length
          let wid = v.length * 19
          this.lookColumns.push({
            title: v,
            key: "a" + i,
            align: 'center',
            ellipsis: true,
            minWidth: wid
          })
        })
        this.crr = []
        $.each(res, (m, n) => {
          $.each(this.lookColumns, (index, val) => {
            let obj = {};
            obj[val.key] = n[val.title];
            this.crr.push(obj);
          })
        })
        var drr = this.crr.filter(v => {
          return Object.keys(v)[0] == 'a0'
        })
        $.each(drr, (m, n) => {
          let obj = {};
          for (let j = 0; j < this.crr.length / drr.length; j++) {
            obj['a' + j] = this.crr.filter(o => {
              return Object.keys(o)[0] == 'a' + j;
            })[m]['a' + j]
          }
          this.lookData.push(obj)
        })
        this.loading = false;
        this.width = w * 20
      })
    },
  }
};
</script>
<style lang="less">
.look .ivu-modal {
  width: 1200px;
}
.look .ivu-table-cell {
  padding: 0 5px;
}
.look .ivu-modal-body {
  padding-bottom: 20px;
}
.data-import-detail-ct {
  position: relative;
  width: 100%;
  height: 500px;
  .data-import-detail {
    // width: 1500px;
    height: 900px;
  }
}
</style>
