<template>
  <div class="app-container">
    <h1>讲师添加</h1>
    <el-form ref="form" :model="teacher" label-width="80px">
      <el-form-item label="账号">
        <el-input v-model="teacher.teacherId"/>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="年龄">
        <el-input v-model="teacher.age"/>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="teacher.email"/>
      </el-form-item>
      <el-form-item label="教师等级">
        <el-select v-model="teacher.level" placeholder="选择教师等级">
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
        <el-button type="primary" @click="submit(teacher)">提交</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import qs from 'qs'
import { saveTeacher } from '@/api/edu/teacher/teacher'
export default {
  data() {
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
    },
    submit(teacher) {
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
    }
  }
}

</script>
