<!--  -->
<template>
  <div class="app-container">
    <h1>学生添加</h1>
    <el-form ref="form" :model="student" label-width="80px">
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
      }
    }
  },

  computed: {},

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
    }
  }
}

</script>
<style  scoped>
</style>
