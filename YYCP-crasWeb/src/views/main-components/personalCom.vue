<template>
    <div>
        <p><span>账号名：</span><span>{{personalInfo.userName}}</span></p>
        <p><span>警务编号：</span><span>{{personalInfo.staffCard}}</span></p>
        <!-- <p><span>身份证：</span><span>{{personalInfo.idCard}}</span></p> -->
        <p><span>职务：</span><span>{{personalInfo.levelName}}</span></p>
        <p class="phone-item">
            <span>电话：</span>
            <span>{{personalInfo.phone}}</span>
        </p>
        <p><span>所属部门：</span><span>{{personalInfo.officeName}}</span></p>
    </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  created() {
  },
  computed:{
    personalInfo(){
      return this.$store.getters.personal_userInfo
    }
  },
  methods: {
  }
};
</script>
<style lang="less">
.personal-info-panel.el-dropdown-menu {
  min-width: 340px;
  top: 49px !important;
  .el-dropdown-menu__item {
      button {
          margin-left: 16px;
      }
  }
  .el-dropdown-menu__item:focus,
  .el-dropdown-menu__item:not(.is-disabled):hover {
    background: #ffffff;
    color: #606266;
  }
  p {
    line-height: 2.1;
    font-size: 14px;
    span:nth-child(1) {
      display: inline-block;
      width: 80px;
      text-align: right;
    }
  }
  .phone-item {
    display: flex;
    span {
      line-height: 32px;
    }
    span:nth-child(2) {
      display: inline-block;
      padding-right: 30px;
    }
    a {
      line-height: 32px;
    }
    .ivu-form {
      display: inline-block;
    }
    .ivu-input-wrapper {
      width: 170px;
      .ivu-input {
        width: 170px;
        height: 32px;
      }
    }
  }
}
</style>


