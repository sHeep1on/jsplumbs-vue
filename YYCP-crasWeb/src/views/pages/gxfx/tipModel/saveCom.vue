<template>
  <Modal title="保存确认" v-model="show" class="save-file-img-ct reset-model" @on-cancel="handleCancel" :mask-closable="false" v-chinaOlyloading.fullscreen="spinShow">
    <Alert type="warning" show-icon v-show="newGraph">
      你还未保存 请保存再新建.
    </Alert>
    <el-form ref="saveFormData" :model="saveForm" :rules="rulesaveForm" label-width="96px" size="small">
      <el-form-item label="文件名称：" prop="name">
        <el-input v-model.trim="saveForm.name" maxlength="16" placeholder="文件名最多可输入16字"></el-input>
      </el-form-item>
      <el-form-item label="添加备注：" prop="desc">
        <el-input v-model.trim="saveForm.desc" type="textarea" maxlength="160" :cols="30" :rows="4" placeholder="最多可输入160字"></el-input>
        <span class="desc-num">{{remnant2}}/160</span>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <Button @click="handleCancel">取消</Button>
      <Button type="primary" @click="saveGraph">确认</Button>
    </div>
  </Modal>
</template>
<script>
import api from "@/fetch/api";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    fileInfo: {
      type: Object,
      default: {}
    },
    newGraph: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.visible,
      bcfefore: null,
      spinShow: false,
      saveForm: {
        name: null,
        desc: null
      },
      remnant2: 0,
      rulesaveForm: {
        name: [
          { required: true, message: "文件名字不能为空", trigger: "blur" }
        ],
        desc: [{}]
      }
    };
  },
  watch: {
    visible() {
      this.show = this.visible;
    },
    "saveForm.desc"(val) {
      this.remnant2 = val == undefined ? 0 : val.length;
    }
  },
  component: {
    title() {
      return JSON.stringify(this.fileInfo) !== "{}" ? (this.newGraph ? "新建确认" : "保存确认") : "编辑文件";
    }
  },
  created() {
    this.initInputData();
  },
  methods: {
    handleCancel() {
      this.$emit("update:fileInfo", {});
      this.$emit("update:visible", false);
      this.$emit("update:newGraph", false);
    },
    initInputData() {
      this.saveForm.name = this.$store.getters.img_file_data.name;
      this.saveForm.desc = this.$store.getters.img_file_data.remark;
      if (JSON.stringify(this.fileInfo) !== "{}") {
        this.saveForm.name = this.fileInfo.name;
        this.saveForm.desc = this.fileInfo.remark;
      }
    },
    saveGraph() {
      this.$refs.saveFormData.validate(valid => {
        if (valid) {
          this.spinShow = true;
          var postUrl = (this.$route.query.jsonid || JSON.stringify(this.fileInfo) !== "{}") ? "/tAnalyse/result/update" : "/tAnalyse/result/save";
          var postId = (this.$route.query.jsonid || JSON.stringify(this.fileInfo) !== "{}") ? (this.$route.query.jsonid || this.fileInfo.id) : null;
          let parmas = {};
          if (JSON.stringify(this.fileInfo) == "{}") {
            graph.graphModel.selectionModel.clear();
            var image = new Image();
            var c = document.getElementsByClassName("Q-Canvas")[0];
            image.crossOrigin = "Anonymous";
            image.src = c.toDataURL("image/png");
            var picUrl = image.src;
            var aa = graph._l1Model._k2;
            let replaceImage = aa.filter(item => {
              return item instanceof Q.Node && !item.suo
            })
            replaceImage.map(item => (item.image = item.oldImage));
            this.bcfefore = graph.exportJSON(true)
            parmas = {
              name: this.saveForm.name,
              remark: this.saveForm.desc,
              picUrl: picUrl,
              resultContent: this.bcfefore,
              id: postId,
              tenantId: this.$route.query.caseId || ''
            };
          } else {
            parmas = {
              name: this.saveForm.name,
              remark: this.saveForm.desc,
              id: postId
            };
          }
          api.api("post", api.loginUrl2 + postUrl, parmas).then(res => {
            this.spinShow = false
            this.$emit("update:visible", false);
            if (JSON.stringify(this.fileInfo) == "{}") {
              this.$store.dispatch("isChangeGraph", false);
              this.$message.success("保存成功");
              this.newGraph ? this.$emit("clearAll") : this.$router.push({ path: "/role/roleManager" })
              graph.clear();
              this.$store.dispatch("isForceActive", false);
            } else {
              this.$message.success("编辑成功");
              this.$emit('initTable')
            }
            this.handleCancel();
          })
            .catch(error => {
              this.spinShow = false
              this.handleCancel();
              this.$emit("update:visible", true);
            });
        }
      });
    }
  }
};
</script>
<style lang="less">
.desc-num {
  float: right;
  font-size: 12px;
}
</style>


