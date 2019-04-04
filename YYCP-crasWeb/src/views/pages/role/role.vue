<template>
  <div class="reset-file">
    <div v-if="modal8">
      <save-com :visible.sync="modal8" :fileInfo.sync='fileInfo' @initTable='initTable'></save-com>
    </div>
    <div class="wjglheader">
      <p>全部</p>
      <p>
        <el-input class="wjsearch" @keyup.enter.native="tksearch" placeholder="请输入搜索对象" size="small" v-model="searchvalwj">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="tksearch"></i>
        </el-input>
        <ul>
          <li>
            <DatePicker type="daterange" :options="options3" placement="bottom-end" placeholder="时间范围筛选" class="wjsxtime" @on-change="tksearch2"></DatePicker>
          </li>
          <li class="disabled" @click="bianji">
            <i></i>
            <span>编辑</span>
          </li>
          <li @click="wjglallcheck">
            <i></i>
            <span>{{quanxuan}}</span>
          </li>
          <li @click="handleDeleNode">
            <i></i>
            <span>删除</span>
          </li>
          <li @click="handleExport">
            <i></i>
            <span>导出</span>
          </li>
        </ul>
      </p>
    </div>
    <div class="gxtlist">
      <ul class="file-img-manage" v-scrollBar>
        <li v-for="(item,index) in tuku" :key="index">
          <div class="file-img-ct">
            <Checkbox class="selecttu" v-model="item.check"></Checkbox>
            <img :src="item.picUrl" alt="" @click="jsonxr(item)">
          </div>
          <strong :title="item.name">{{item.name}}</strong>
          <p class="tubz" :title="item.remark">{{item.remark}}</p>
          <p class="bctime">{{item.updateTime|timestampToTime}}</p>
        </li>

      </ul>
      <Page class="reset-page" :current.sync="current2" :page-size="pageSize" :total="listtotal" show-elevator show-total @on-change="fychange" />
    </div>
    <Modal width='300' v-model="isShowDeleModal" title="请慎重选择" @on-ok="removelist">
      <p>是否删除该文件</p>
    </Modal>
    <Modal width='300' v-model="isExportImg" title="请选择" @on-ok="daochu">
      <p>是否选择导出该文件</p>
    </Modal>
  </div>
</template>

<script>
import api from "@/fetch/api";
import { storage } from "@/libs/common/common.js";
import saveCom from "../gxfx/tipModel/saveCom";
export default {
  components: {
    saveCom
  },
  data() {
    return {
      remnant4: 0,
      isShowDeleModal: false,
      isExportImg: false,
      activebolagin2: false,
      fileInfo: {},
      options3: {
        shortcuts: [
          {
            text: "一周",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "一个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "三个月",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      },
      searchvalwj: "",
      quanxuan: "全选",
      tuku: [],
      modal8: false,
      bjwjm: "",
      bjbzxx: "",
      listtotal: 0,
      pageSize: 8,
      current2: 1,
      startTime: null,
      endTime: null,
      roleInfo: ""
    };
  },
  created() {
    this.roleInfo = storage.get("relaAdmin") ? "relateAdmin" : "";
    // this.initTable();
  },
  activated() {
    this.initTable();
  },
  methods: {
    wjglallcheck() {
      if (this.quanxuan == "全选") {
        this.tuku.forEach(item => {
          item.check = true;
        });
        this.quanxuan = "取消";
      } else {
        this.tuku.forEach(item => {
          item.check = false;
        });
        this.quanxuan = "全选";
      }
    },
    handleDeleNode() {

      let removeId = [];
      let _this = this;
      this.tuku.forEach(item => {
        if (item.check) {
          removeId.push(item.id);
        }
      });
      if (removeId.length > 0) {
        this.isShowDeleModal = true;
      } else {
        this.$message.error("请先选择文件再进行删除");
      }
    },
    initTable() {
      api.api("post", api.loginUrl2 + "/tAnalyse/result/queryPage", {
        pageNum: this.current2,
        pageSize: 8,
        role: this.roleInfo,
        name: this.searchvalwj,
        startTime: this.startTime,
        endTime: this.endTime
      })
        .then(response => {
          this.listtotal = response.total;
          this.tuku = response.list;
        });
    },
    removelist() {
      let removeId = [];
      let _this = this;
      this.tuku.forEach(item => {
        if (item.check) {
          removeId.push(item.id);
        }
      });
      api.api("post", api.loginUrl2 + "/tAnalyse/result/delete", {
        ids: removeId.join(",")
      })
        .then(() => {
          this.quanxuan = "全选";
          this.initTable();
          this.$message.success("删除成功");
        })
        .catch(error => { });

    },
    handleExport() {
      let exportFile = this.tuku.filter(item => item.check);
      if (exportFile.length == 0) {
        this.$message.error("请先选择文件再进行导出");
      } else {
        this.isExportImg = true;
      }
    },
    daochu() {
      let exportFile = this.tuku.filter(item => item.check);
      exportFile.forEach(item2 => {
        var alink = document.createElement("a");
        alink.href = item2.picUrl;
        alink.download = item2.name;
        alink.click();
      });
    },
    bianji() {
      let newtuku3 = this.tuku.filter(item => item.check);
      if (newtuku3.length == 1) {
        this.fileInfo.name = newtuku3[0].name;
        this.fileInfo.remark = newtuku3[0].remark;
        (this.fileInfo.id = newtuku3[0].id), (this.modal8 = true);
      } else if (newtuku3.length == 0) {
        this.$message.error("请先选择文件再进行编辑");
      } else {
        this.$message.error("请选择单个文件进行编辑");
      }
    },
    fychange(value) {
      let _this = this;
      this.quanxuan = "全选";
      this.current2 = value;
      this.initTable();
    },
    tksearch() {
      this.current2 = 1;
      this.initTable();
    },
    tksearch2(value) {
      this.startTime = value[0];
      this.endTime = value[1];
      this.current2 = 1;
      this.initTable();
    },
    jsonxr(info) {
      let id = info.id
      api
        .api("post", api.loginUrl2 + "/tAnalyse/result/detail", { id })
        .then(response => {
          this.$store.commit("setJsonid", response.id);
          this.$router.push({
            path: "/gxfx/gxfxManager",
            query: { jsonid: response.id,caseId:info.tenantId }
          });
          this.$store.dispatch("setImgFileData", response);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    descInput4() {
      var txtVal4 = this.bjbzxx.length;
      this.remnant4 = txtVal4;
    }
  }
};
</script>
<style lang="less">
.el-icon-search {
  cursor: pointer;
}
.reset-file {
  height: calc(~"100% - 135px");
  width: calc(~"100% - 40px");
  margin: 0 20px;
  margin-top: 20px;
  padding: 10px 20px;
  background: #fff;
  overflow: hidden;
  .reset-page {
    text-align: right;
    width: 100%;
    padding-right: 15px;
    padding-bottom: 10px;
    padding-top: 15px;
  }
  .gxtlist {
    height: calc(~"100% - 110px");
  }
  .file-img-manage {
    height: 100%;
    background: #fff;
    position: relative;
    overflow: hidden;

    & > li {
      height: 270px;
      .file-img-ct {
        width: 100%;
        height: 190px;
        overflow: hidden;
        cursor: pointer;
        img {
          width: 100%;
        }
      }
      strong {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .tubz {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>

