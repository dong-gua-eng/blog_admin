<template>
  <div class="user-add">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="user-add-ruleForm"
    >
      <el-form-item label="姓名" prop="user_cname">
        <el-input 
          type="text" 
          v-model="ruleForm.user_cname" 
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="user_name">
        <el-input 
          type="text" 
          v-model="ruleForm.user_name" 
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="user_password">
        <el-input 
          type="password" 
          v-model="ruleForm.user_password" 
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input 
          type="password" 
          v-model="ruleForm.checkPassword" 
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="user_department">
        <el-input v-model.number="ruleForm.age"></el-input>
      </el-form-item>
      <el-form-item label="职位" prop="user_role">
        <el-input v-model.number="ruleForm.user_role"></el-input>
      </el-form-item>
      <el-form-item label="发表博客总数" prop="article_count">
        <span>{{ruleForm.article_count}}</span>
      </el-form-item>
      <el-form-item>
        <el-button 
          type="primary" 
          @click="submitForm('ruleForm')"
        >提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPassword !== "") {
          this.$refs.ruleForm.validateField("checkPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.checkPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        user_cname: '',
        user_name: '',
        user_password: '',
        checkPassword: '',
        user_department: '',
        user_role: '',
        article_count: 0
      },
      rules: {
        user_password: [{ validator: validatePass, trigger: "blur" }],
        checkPassword: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less">
.user-add {
  .user-add-ruleForm {
    input {
      width: 90%;
      height: 32px;
    }
  }
}  
</style>