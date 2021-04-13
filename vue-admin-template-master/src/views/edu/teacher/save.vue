<template>
  <div v-if="nowRole == '[ADMIN]'" class="app-container">
    <h1>讲师添加</h1>
    <el-form ref="form" :model="teacher" :rules="rules" label-width="80px">
      <el-form-item label="头像">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          name="avatar"
          class="avatar-uploader"
          action="http://127.0.0.1:8001/onlineedu/upload/userAvatar">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item prop="teacherId" label="账号">
        <el-input v-model="teacher.teacherId"/>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="teacher.password" type="password"/>
      </el-form-item>
      <el-form-item prop="repassword" label="确认密码">
        <el-input v-model="ensurePassword" type="password"/>
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item prop="age" label="年龄">
        <el-input v-model="teacher.age"/>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="teacher.email"/>
      </el-form-item>
      <el-form-item label="教师等级">
        <el-select v-model="teacher.level" clearable placeholder="选择教师等级">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="教师简介">
        <el-input v-model="teacher.description" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button v-if="nowRole == '[ADMIN]'" type="primary" @click="submit(teacher)">提交</el-button>
        <el-button v-if="nowRole == '[ADMIN]'" @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div v-else><h1>您当前没有权限查看</h1> </div>
</template>
<script>
import qs from 'qs'
import { saveTeacher } from '@/api/edu/teacher/teacher'
export default {
  data() {
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的邮箱'))
    }
    return {
      options: [{
        value: '1',
        label: '初级教师'
      }, {
        value: '2',
        label: '中级教师'
      }, {
        value: '3',
        label: '高级教师'
      }, {
        value: '4',
        label: '特级教师'
      }],
      teacher: {
        teacherId: '',
        name: '',
        password: '',
        age: '',
        email: '',
        level: '',
        description: '',
        avator: ''
      },
      // 确认密码字段
      ensurePassword: '',
      imageUrl: '',
      rules: {
        teacherId: [
          { required: true, message: '教师账号不能为空', trigger: 'blur' },
          { min: 10, max: 10, message: '教师账号的长度为10', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '教师姓名不能为空', trigger: 'blur' }
        ],
        age: [
          { required: true, message: '年龄不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    nowUserId: {
      get() {
        return this.$store.getters.userId
      }
    },
    nowRole: {
      get() {
        return this.$store.getters.roles
      }
    }
  },
  methods: {
    // 取消方法，将所有的内容至null
    cancle() {
      this.teacher.teacherId = ''
      this.teacher.name = ''
      this.teacher.age = ''
      this.teacher.email = ''
      this.teacher.level = ''
      this.teacher.description = ''
      this.teacher.avator = ''
      this.teacher.password = ''
      this.ensurePassword = ''
    },
    submit(teacher) {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message({
            message: '表单校验未通过',
            type: 'warning'
          })
          return false
        } else {
          if (teacher.password !== this.ensurePassword) {
            this.$message({
              message: '前后密码不一致',
              type: 'warning'
            })
            return
          }
          saveTeacher(
            [
              function(data) {
                return qs.stringify(data)
              }
            ],
            teacher
          ).then(res => {
            if (res !== null) {
              if (res.success) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.message,
                  type: 'warning'
                })
              }
            }
          })
        }
      })
    },
    // 图片上传成功后回调的函数
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      console.info(file)
      console.info(res)
      this.teacher.avatar = res.data.avatarUrl
      console.info(this.teacher.avatar)
    },
    // 上传之前的回调函数
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      // 限制大小为2mb以内
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}

</script>
<style  scoped>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
