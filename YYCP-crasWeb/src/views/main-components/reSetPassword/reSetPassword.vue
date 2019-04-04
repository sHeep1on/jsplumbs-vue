<template>
  <div>
    <Modal v-model="isShow" width="490" title="修改密码"  :mask-closable="false" @on-cancel="modalCancel"
     v-chinaOlyloading.fullscreen="isLoading">
      <div slot="footer" class="font-size-0">
        <Button type="default" class="cancelBtn" @click="modalCancel">取消</Button>
        <Button type="primary" class="sureBtn" @click="resetPassword">确定</Button>
      </div>
      <div>
        <el-form ref="formPassword" :model="formPassword" label-width="100px" class="" :inline="true" :rules="formPasswordrules">
          <el-form-item label="原始密码：" prop="oldPass">
            <el-input type="password" v-model="formPassword.oldPass" size='small' style="width:270px">
            </el-input>
          </el-form-item>
          <el-form-item label="新设密码：" prop="newPass">
            <el-input type="password" v-model="formPassword.newPass" size='small' style="width:270px">
            </el-input>
          </el-form-item>
          <el-form-item label="确认密码：" prop="checkPass">
            <el-input type="password" v-model="formPassword.checkPass" size='small' style="width:270px">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </Modal>
  </div>
</template>
<script>
// import api from '@/fetch/api'
export default {

  data() {
    var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formPassword.newPass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      isLoading:false,
      isShow:false,
      caseInfo:{},
      formPassword:{
        oldPass:'',
        newPass:'',
        checkPass:''
      },
      formPasswordrules:{
        oldPass:[
          { required: true,message: '请输入原始密码', trigger: 'blur' }
        ],
        newPass:[
           { required: true,message: '请输入新密码', trigger: 'blur' }
        ],
        checkPass:[
          { required: true,message: '请再次输入密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
   props: {

  },
  methods: {
    modalCancel(){
      this.isShow=false
    },
    resetForm(){
      this.formPassword={
        oldPass:'',
        newPass:'',
        checkPass:''
      }
    },
    resetPassword(){
      this.$refs['formPassword'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('resetPassword',this.formPassword).then(res=>{
            this.$message.success('修改密码成功')
            this.isShow=false
            this.resetForm()
            this.$emit('resetPassword')
          }).catch(error=>{

          })
        }
      });

    }
  }
}
</script>
<style lang="less">
</style>
