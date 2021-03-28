<!--  -->
<template>
  <div v-if="nowRole != '[STUDENT]'" class="app-container">
    <h1>学生添加</h1>
    <el-form ref="form" :model="student" label-width="80px">
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
      <el-form-item label="账号">
        <el-input v-model="student.studentId"/>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="student.password"/>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="student.name"/>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="student.age"/>
      </el-form-item>
      <el-form-item label="邮箱">
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
import { saveStudent } from '@/api/edu/student/student'
export default {

  components: {},
  data() {
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
      imageUrl: ''
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
              message: '保存成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '保存失败',
              type: 'warning'
            })
          }
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
    },
    // 图片上传成功后回调的函数
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      console.info(file)
      console.info(res)
      this.student.avatar = res.data.avatarUrl
      console.info(this.student.avatar)
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
