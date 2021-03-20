<!-- 所有角色的详细展示页面弹出一个弹窗进行展示 -->
<template>
  <div class="app-container">
    <el-form ref="form" :model="userInfo" label-width="80px">
      <el-form-item label="账号">
        <el-input v-model="userInfo.id"/>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="userInfo.name"/>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="userInfo.age"/>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userInfo.email"/>
      </el-form-item>
      <el-form-item v-if="userInfo.roleId == 2" label="教师等级">
        <el-input v-model="getLevel"/>
      </el-form-item>
      <el-form-item v-if="userInfo.roleId == 2" label="教师简介">
        <el-input v-model="userInfo.description" type="textarea" />
      </el-form-item>
      <el-form-item v-if="userInfo.roleId == 3" label="所在学校">
        <el-input v-model="userInfo.school"/>
      </el-form-item>
      <el-form-item>
        <!-- 教师只允许管理员和教师来更改信息 -->
        <el-button v-if="userInfo.roleId == 2 && nowRole !== [STUDENT]" type="primary" @click="updateTeacher(userInfo)">更新</el-button>
        <el-button v-if="userInfo.roleId == 3" type="primary" @click="updateStudent(userInfo)">更新</el-button>
        <el-button @click="back">取消</el-button>
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
    return {
      userInfo: this.$route.query.userInfo,
      teahcerInfo: {
        teahcerId: '',
        name: '',
        age: 0,
        email: '',
        description: ''
      },
      studentInfo: {
        studentId: '',
        name: '',
        age: '',
        email: '',
        school: '',
        password: '',
        avator: ''
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
  },

  methods: {
    // 更新教师信息
    updateTeacher(userInfo) {
      console.info(userInfo)
      var teacher = this.teahcerInfo
      teacher.teahcerId = userInfo.id
      teacher.name = userInfo.name
      teacher.age = userInfo.age
      teacher.email = userInfo.email
      teacher.description = userInfo.description
      console.log(teacher)
      // 调用axios请求
      updateTeacher(teacher.teahcerId, teacher.name, teacher.age, teacher.email, teacher.description)
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
    },
    // 更新学生信息
    updateStudent(userInfo) {
      console.log(userInfo)
      this.studentInfo.studentId = userInfo.id
      this.studentInfo.name = userInfo.name
      this.studentInfo.age = userInfo.age
      this.studentInfo.email = userInfo.email
      this.studentInfo.school = userInfo.school
      this.studentInfo.password = userInfo.password
      this.studentInfo.avator = ''
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
  }
}

</script>
<style  scoped>
</style>
