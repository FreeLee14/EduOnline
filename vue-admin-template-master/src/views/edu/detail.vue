<!-- 所有角色的详细展示页面弹出一个弹窗进行展示 -->
<template>
  <div class="app-container">
    <el-form ref="form" :rules="rules" :model="userInfo" label-width="80px">
      <el-form-item v-if="isAdmin" label="头像">
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
      <el-form-item v-else label="头像">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
      </el-form-item>
      <el-form-item prop="id" label="账号">
        <el-input v-model="userInfo.id" :disabled="!isAdmin"/>
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="userInfo.name" :disabled="!isAdmin"/>
      </el-form-item>
      <el-form-item prop="age" label="年龄">
        <el-input v-model="userInfo.age" :disabled="!isAdmin"/>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="userInfo.email" :disabled="!isAdmin"/>
      </el-form-item>
      <el-form-item v-if="userInfo.roleId == 2" clearable label="教师等级">
        <el-input v-model="getLevel" :disabled="true"/>
      </el-form-item>
      <el-form-item v-if="userInfo.roleId == 2" label="教师简介">
        <el-input v-model="userInfo.description" :disabled="!isAdmin" type="textarea" />
      </el-form-item>
      <el-form-item v-if="userInfo.roleId == 3" label="所在学校">
        <el-input v-model="userInfo.school" :disabled="!isAdmin"/>
      </el-form-item>
      <el-form-item>
        <!-- 教师只允许管理员和教师来更改信息 -->
        <el-button v-if="userInfo.roleId == 2 && nowRole === '[ADMIN]'" type="primary" @click="updateTeacher(userInfo)">更新</el-button>
        <el-button v-if="userInfo.roleId == 3 && nowRole === '[ADMIN]'" type="primary" @click="updateStudent(userInfo)">更新</el-button>
        <el-button v-if="userInfo.roleId == 2" @click="backTeacher">返回</el-button>
        <el-button v-if="userInfo.roleId == 3" @click="backStudent">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import qs from 'qs'
import { updateTeacher } from '@/api/edu/teacher/teacher'
import { updateStudent } from '@/api/edu/student/student'
export default {
  components: {},
  data() {
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入正确的邮箱'))
    }
    return {
      userInfo: this.$route.query.userInfo,
      teahcerInfo: {
        teahcerId: '',
        name: '',
        age: 0,
        email: '',
        description: '',
        avatar: ''
      },
      studentInfo: {
        studentId: '',
        name: '',
        age: '',
        email: '',
        school: '',
        password: '',
        avatar: ''
      },
      imageUrl: '',
      avatar: '',
      // 管理员权限标识
      isAdmin: false,
      // 表单验证规则
      rules: {
        id: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          { min: 10, max: 10, message: '账号的长度为10', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
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
    // 将教师级别数字转换为对应的中文
    getLevel() {
      if (this.userInfo.level === 1) {
        return '初级教师'
      } else if (this.userInfo.level === 2) {
        return '中级教师'
      } else if (this.userInfo.level === 3) {
        return '高级教师'
      } else if (this.userInfo.level === 4) {
        return '特级教师'
      }
    },
    // 获取到当前用户权限
    nowRole: {
      get() {
        return this.$store.getters.roles
      }
    }
  },
  mounted() {
    console.log(this.userInfo)
    this.$nextTick(function() {
      // 设置权限标识
      if (this.nowRole === '[ADMIN]') {
        this.isAdmin = true
      } else if (this.nowRole === '[STUDENT]') {
        this.isStudent = true
      }
      this.imageUrl = 'http://127.0.0.1:8001' + this.userInfo.avatar
    })
  },

  methods: {
    // 更新教师信息
    updateTeacher(userInfo) {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message({
            message: '表单校验失败',
            type: 'warning'
          })
          return false
        } else {
          console.info(userInfo)
          var teacher = this.teahcerInfo
          teacher.teahcerId = userInfo.id
          teacher.name = userInfo.name
          teacher.age = userInfo.age
          teacher.email = userInfo.email
          teacher.description = userInfo.description
          console.log(teacher)
          // 调用axios请求
          updateTeacher(teacher.teahcerId, teacher.name, teacher.age, teacher.email, teacher.description, this.avatar)
            .then(res => {
              if (res !== null) {
                if (res.success) {
                  this.$message({
                    message: '更新成功',
                    type: 'success'
                  })
                } else {
                  this.$message({
                    message: '更新失败',
                    type: 'warning'
                  })
                }
              }
            })
        }
      })
    },
    // 更新学生信息
    updateStudent(userInfo) {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return false
        } else {
          console.log(userInfo)
          this.studentInfo.studentId = userInfo.id
          this.studentInfo.name = userInfo.name
          this.studentInfo.age = userInfo.age
          this.studentInfo.email = userInfo.email
          this.studentInfo.school = userInfo.school
          this.studentInfo.password = userInfo.password
          this.studentInfo.avatar = this.avatar
          console.log(this.studentInfo)
          // 通过axios发送请求
          updateStudent(
            [
              function(data) {
                return qs.stringify(data)
              }
            ],
            this.studentInfo
          ).then(res => {
            if (res !== null) {
              if (res.success) {
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: '更新失败',
                  type: 'warning'
                })
              }
            }
          })
        }
      })
    },
    backTeacher() {
      this.$router.replace({
        path: '/teacher/list'
      })
    },
    backStudent() {
      this.$router.replace({
        path: '/student/list'
      })
    },
    // 图片上传成功后回调的函数
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      console.info(file)
      console.info(res)
      this.avatar = res.data.avatarUrl
      console.info(this.avatar)
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
