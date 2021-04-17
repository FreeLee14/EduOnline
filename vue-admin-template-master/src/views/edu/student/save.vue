<!--  -->
<template>
  <div v-if="nowRole != '[STUDENT]'" class="app-container">
    <h1>学生添加</h1>
    <el-form ref="form" :model="student" :rules="rules" label-width="80px">
      <el-form-item prop="avatar" label="头像">
        <el-upload
          :show-file-list="false"
          :on-change="changeName"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :auto-upload="false"
          :file-list="fileList"
          name="avatar"
          class="avatar-uploader"
          action="http://127.0.0.1:8001/onlineedu/upload/userAvatar">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item prop="studentId" label="账号">
        <el-input v-model="student.studentId"/>
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model="student.password" type="password"/>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="ensurePassword" type="password"/>
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="student.name"/>
      </el-form-item>
      <el-form-item prop="age" label="年龄">
        <el-input v-model="student.age"/>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="student.email"/>
      </el-form-item>
      <el-form-item label="学校">
        <el-input v-model="student.school"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit(student)">提交</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div v-else><h1>您当前没有权限查看</h1> </div>
</template>

<script>
import qs from 'qs'
import axios from 'axios'
import { saveStudent } from '@/api/edu/student/student'
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
      student: {
        studentId: '',
        name: '',
        password: '',
        age: '',
        email: '',
        school: '',
        avator: ''
      },
      imageUrl: '',
      ensurePassword: '',
      rules: {
        studentId: [
          { required: true, message: '学生账号不能为空', trigger: 'blur' },
          { min: 10, max: 10, message: '学生账号的长度为10', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 5, message: '密码不得小于5位', trigger: 'blur' }
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
      },
      fileList: [],
      file: {
        name: ''
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
    submit(student) {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message({
            message: '表单校验未通过',
            type: 'warning'
          })
          return false
        } else {
          if (student.password !== this.ensurePassword) {
            this.$message({
              message: '前后密码不一致',
              type: 'warning'
            })
            return
          }
          const config = {
            'Content-Type': 'multipart/form-data'
          }
          const formData = new FormData()
          // debugger
          console.info(this.fileList[0].raw)
          formData.append('file', this.fileList[0].raw)
          formData.append('userType', 'student')
          // 首先进行头像上传操作，之后获取到头像上传后在服务器中的相对路径
          axios.post(
            'http://localhost:8001/onlineedu/upload/userAvatar',
            formData,
            config
          )
            .then((response) => {
              if (response != null) {
                if (response.data.success) {
                  // 给学生头像的相对路径进行赋值
                  console.log(response.data)
                  console.log(response.data.data.avatarUrl)
                  student.avatar = response.data.data.avatarUrl
                  console.log(student.avatar)
                  saveStudent(
                    [
                      function(data) {
                        return qs.stringify(data)
                      }
                    ],
                    student
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
                } else {
                  this.$message.error('头像上传失败!')
                }
              }
            })
        }
      })
    },
    cancle() {
      this.student.studentId = ''
      this.student.name = ''
      this.student.age = ''
      this.student.email = ''
      this.student.school = ''
      this.student.password = ''
      this.student.avator = ''
      this.ensurePassword = ''
      this.imageUrl = ''
    },
    // 图片上传成功后回调的函数
    handleAvatarSuccess(res, file) {
      // debugger
      this.imageUrl = URL.createObjectURL(file.raw)
      // console.info(file)
      // console.info(res)
      // this.student.avatar = res.data.avatarUrl
      // console.info(this.student.avatar)
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
    },
    // 上传头像后进行浏览器保存图片文件的名字的更改
    changeName(file, fileList) {
      this.imageUrl = URL.createObjectURL(file.raw)
      var fileName = file.name
      if (fileName.search('jpg') !== -1) {
        // 每次文件发生改变时需要对临时变量进行赋值
        this.file = file
        this.fileList = fileList
      } else {
        this.$message.error('当前图片格式必须为jpg格式!')
        // 将页面回显的file内容从数组中弹出
        fileList.pop()
      }
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
