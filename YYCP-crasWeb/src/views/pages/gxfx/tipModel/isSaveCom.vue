<template>
  <Modal v-model="show" @on-cancel="handleClose" title="是否保存" width="350px">
    <Alert type="warning" show-icon>
      是否保存当前画布
    </Alert>
    <span></span>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handlePushPath">不保存</el-button>
      <el-button size="small" type="primary" @click="saveGraph">确 定</el-button>
    </span>
  </Modal>
</template>

<script>
import api from "@/fetch/api";
export default {
  data() {
    return {
      show: false
    };
  },
  created() {},
  watch: {
    Visible(val) {
      this.show = this.Visible;
    }
  },
  computed: {
    Visible() {
      return this.$store.getters.toggle_is_save.isShow;
    }
  },
  methods: {
    handleClose() {
      this.$store.dispatch("toggleIsSave", { isShow: false });
    },
    handlePushPath() {
      this.$store.dispatch("toggleIsSave", {
        isShow: false,
        path: this.$store.getters.toggle_is_save.path
      });
      this.$router.push({ path: this.$store.getters.toggle_is_save.path });
      this.$store.dispatch("isForceActive", false);
    },
    saveGraph() {
      this.$emit("saveGraph");
      this.$store.dispatch("toggleIsSave", { isShow: false });
    }
  }
};
</script>

