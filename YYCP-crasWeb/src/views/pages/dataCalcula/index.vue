<template>
  <div class="data-calc-wr" v-chinaOlyloading.fullscreen="spinShow">
    <div class="data-calc-ct">
      <Table :tooltip='true' :height="height" @on-row-click="handleClickRow" class="" :loading="isloading" stripe ref="selection" :columns="calcColumns" :data="calcData" @on-selection-change="selectTable" @on-sort-change="sortChaneg"></Table>
      <Page class="data-calc-page" :current.sync="basePage.pageNum" :total.sync="total" show-sizer placement="top" @on-change="pageChange" @on-page-size-change="pageSizeChange" :page-size.sync="basePage.pageSize" :page-size-opts="pageArray" show-elevator show-total></Page>
    </div>
    <detail-model ref="detailModel"></detail-model>
    <calc-setting ref="calcSetting" @handleUpdateStatus='handleUpdateStatus'></calc-setting>
  </div>
</template>
<script>
import api from '@/fetch/api';
import { timestampToTime } from '@/libs/common/common.js';
import detailModel from './component/detailModel';
import calcSetting from './component/calcSetting'
import axios from 'axios';
import { storage } from '@/libs/common/common.js';
export default {
  components: {
    detailModel,calcSetting
  },
  data() {
    return {
      isloading: false,
      calcData: [],
      height: 400,
      timer: null,
      isAuthority: true,
      spinShow: false,
      basePage: {
        pageNum: 1,
        pageSize: 10,
        role: storage.get('relaAdmin') ? 'relateAdmin' : ''
      },
      pageArray: [10, 20, 30, 40],
      total: 0,
      calcColumns: [
        {
          title: '序号',
          type: 'index',
          align: 'center',
          width: 80
        },
        {
          title: '案件名称',
          align: 'center',
          key: 'name',
          minwidth: 160,
          ellipsis: true
        },
        {
          title: '最近计算时间',
          align: 'center',
          key: 'finalComputeTime',
          width: 190,
          ellipsis: true,
          render: (h, params) => {
            return (params.row.finalComputeTime) ? h('div', this.handletime(params.row.finalComputeTime)) : h('div', '--');
          }
        },
        {
          title: '操作者',
          align: 'center',
          key: 'operator',
          minwidth: 160,
          ellipsis: true,
          render: (h, params) => {
            return h('div', params.row.operator || '--');
          }
        },
        {
          title: '状态',
          align: 'center',
          key: 'fileName',
          minwidth: 160,
          ellipsis: true,
          render: (h, params) => {
            return h('div', {
              on: {
                click: e => {
                  e.stopPropagation();
                  this.handleShowError(params.row);
                }
              }
            }, this.handleStatus(params.row));
          }
        },
        {
          title: '操作',
          align: 'center',
          key: 'fileName',
          minwidth: 160,
          ellipsis: true,
          render: (h, params) => {
            return h('div', [
              h('a', {
                'class': {
                  'node-disabled': this.handlecalcStatusStyle(params.row)
                },
                on: {
                  click: e => {
                    e.stopPropagation();
                    this.handleCalc(params.row);
                  }
                }
              }, ' 计算'),
              h('span', {
                style: {
                  marginRight: '5px',
                  marginLeft: '5px'
                },
              }, '|'),
              h('a', {
                'class': {
                  'node-disabled': this.handleStatusStyle(params.row)
                },
                on: {
                  click: e => {
                    e.stopPropagation();
                    this.handleExport(params.row);
                  }
                }
              }, '导出')
            ]);
          }
        }
      ]

    };
  },
  mounted() {
    this.height = window.innerHeight - 210;
    const that = this;
    window.onresize = function temp() {
      that.height = window.innerHeight - 210;
    };
  },
  created() {
    this.handleTableData();
  },
  methods: {
    async permissionTable() {
      const permissionSet = () => {
        this.isAuthority = this.$store.getters.personal_roleInfo.some(item => {
          return item.roleName.indexOf('relateAdmin') !== -1 || item.roleName.indexOf('管理') !== -1
        })
        !this.isAuthority && (this.calcColumns.pop())
      }

      if (this.$store.getters.personal_roleInfo.length !== 0) {
        permissionSet()
      } else {
        await this.$store.dispatch("getRoleInfo")
        permissionSet()

      }

    },
    handletime(time) {
      const format = '{y}-{m}-{d} {h}:{i}:{s}';
      const formatObj = {
        y: time.slice(0, 4),
        m: time.slice(4, 6),
        d: time.slice(6, 8),
        h: time.slice(8, 10),
        i: time.slice(10, 12),
        s: time.slice(12, 14)
      };
      const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key];
        return value || 0;
      });
      return time_str;
    },
    handleShowError(info) {
      if (info.useStatus == '2') {
        this.$message.warning(info.remark)
      }
    },
    handleTableData() {
      this.permissionTable()
      api.api('post', `${api.loginUrl2}/tFilesDataList/caseQueryPage?`, this.basePage).then(res => {
        this.calcData = res.list;
        this.total = res.total;
      });
    },
    handleExport(info) {
      if (info.useStatus == '3') {
        api.api('post', `${api.loginUrl2}/tFilesDataList/downloadCaseTable`, {
          caseId: info.tenantId,
          time: info.finalComputeTime
        }).then((res) => {
          let aLink = document.createElement('a');
          aLink.style.display = 'none';
          aLink.href = api.uploads + res;
          document.body.appendChild(aLink);
          aLink.click();
          URL.revokeObjectURL(aLink.href); // 释放URL 对象
          document.body.removeChild(aLink);
        });
      }

    },

    handleStatusStyle(info) {
      return info.useStatus == '3' ? false : true
    },
    handlecalcStatusStyle(info) {
      return info.useStatus == '1' ? true : false
    },
    handleCalc(info) {

      if (info.useStatus !== '1') {
        this.$refs.calcSetting.isShow=true
        this.$refs.calcSetting.caseInfo = info
        this.$refs.calcSetting.resetForm()
        // let time = this.handleTimestamp(info);
        // this.spinShow = true
        // this.handleRequest({
        //   url: `${api.calcUrl}/P2P/all/${info.tenantId}/${time}`
        // }).then(res => {
        //   if (res.stat == '000') {
        //     this.$message.success(res.msg);
        //     this.handleUpdateStatus(info.id, '1', time);
        //   } else {
        //     this.$message.success(res.msg);
        //     this.handleUpdateStatus(info.id, '2', time, res.msg);
        //   }
        //   this.spinShow = false
        // }).catch(error => {
        //   this.handleUpdateStatus(info.id, '2', time);
        //   this.spinShow = false
        // });
      }

    },

    handleStatus(info) {
      let params = JSON.parse(JSON.stringify(info));
      let obj = {
        '0': '未计算',
        '1': '开始计算中',
        '2': '计算失败',
        '3': '计算成功'
      };

      if (params.useStatus == '1') {
        this.handleInquire(params);
      }
      return obj[params.useStatus];
    },
    handleInquire(params) {
      let info = JSON.parse(JSON.stringify(params));
      this.handleStatusFn(info)
      if (!info.timer) {
        //setInterval
        info.timer = setInterval(() => {
          this.handleStatusFn(info)

        }, 2*1000*60);
      }
    },
   handleStatusFn(info){
       this.handleRequest({
            url: `${api.calcUrl}/P2P/result/message_status/${info.tenantId}/${info.finalComputeTime}`
          }).then(res => {
            if (res.length !== 0) {
              if (res[0].stat == '100') {
                this.$message.success(res[0].msg);
                this.handleUpdateStatus(info.id, '3', info.finalComputeTime);
                clearInterval(info.timer);
              } else {
                this.handleUpdateStatus(info.id, '2', info.finalComputeTime, res[0].msg);
                clearInterval(info.timer);
              }
            }
          }).catch(error => {
            this.handleUpdateStatus(info.id, '2', info.finalComputeTime);
            clearInterval(info.timer);
          });
    },
    handleRequest(option) {
      const { url } = option;
      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('get', `${url}`, true);
        xhr.send();
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(xhr);
          }
        };
        xhr.onerror = (error) => {
          reject(error);
        };
      });
    },
    handleUpdateStatus(id, status, time, remark) {
      api.api('post', api.loginUrl2 + '/tFilesDataList/updataComputeTime', {
        id: id,
        time: time,
        status: status,
        remark: remark
      }).then(res => {
        this.handleTableData();
        // console.log(res);
      }).catch(error=>{
        this.handleTableData();
      })
    },
    handleClickRow() {

    },
    selectTable() {

    },
    sortChaneg() {

    },
    pageChange(current) {
      this.basePage.pageNumber = current;
      this.handleTableData();
    },
    pageSizeChange(current) {
      this.basePage.pageSize = current;
      this.handleTableData();

    }
  }
};
</script>
<style lang="less">
.data-calc-wr {
  height: calc(~"100% - 135px");
  width: calc(~"100% - 40px");
  margin: 0 20px;
  margin-top: 20px;
  padding: 10px 20px;
  background: #fff;
  overflow: hidden;
  .node-disabled {
    cursor: not-allowed;
    text-decoration: none;
    color: #c5c8ce;
  }
  .data-calc-page {
    display: flex;
    .ivu-page-options {
      display: flex;
      padding-top: 2px;
      .ivu-page-options-sizer {
        .ivu-select-single {
          width: 82px;
        }
      }
    }
  }
}
</style>

