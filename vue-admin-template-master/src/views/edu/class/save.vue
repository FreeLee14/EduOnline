<!-- 添加课程组件 -->
<template>
  <div class="app-container">
    <h1>添加课程</h1>
    <el-form ref="form" :model="classInfo" label-width="80px">
      <el-form-item label="课程编号">
        <el-input v-model="classInfo.classId"/>
      </el-form-item>
      <el-form-item label="课程名">
        <el-input v-model="classInfo.name"/>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="classInfo.price"/>
      </el-form-item>
      <el-form-item label="课程名额">
        <el-input v-model="classInfo.quota"/>
      </el-form-item>
      <el-form-item label="任课教师">
        <el-select v-model="classInfo.teacherId" placeholder="选择当前任课教师">
          <el-option
            v-for="item in teacherOption"
            :key="item.teacherId"
            :label="item.name"
            :value="item.teacherId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="课程状态">
        <el-select v-model="classInfo.status" placeholder="选择当前课程状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="课程简介">
        <el-input v-model="classInfo.description" type="textarea" />
      </el-form-item>
      <el-form-item>
        <!-- 课程添加只允许管理员和教师自己添加 -->
        <el-button type="primary" @click="submit(classInfo)">提交</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveClass } from '@/api/edu/class/class'
import { queryAllTeacher } from '@/api/edu/teacher/teacher'
import qs from 'qs'
export default {

  components: {},
  data() {
    return {
      options: [{
        value: '1',
        label: '未开课'
      }, {
        value: '2',
        label: '已开课'
      }, {
        value: '3',
        label: '已结课'
      }],
      teacherOption: [],
      classInfo: {
        classId: '',
        name: '',
        price: '',
        quota: '',
        teacherId: '',
        status: '',
        description: ''
      },
      // 当前用户id
      nowId: ''
    }
  },
  computed: {
    // 获取当前用户权限
    nowRole: {
      get() {
        return this.$store.getters.roles
      }
    },
    nowUserId: {
      get() {
        return this.$store.getters.userId
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      // 页面渲染完毕加载分页查询的所有教师简略信息，默认显示第一页
      this.queryAllTeacher()
    })
  },

  methods: {
    // 用于管理员增加课程时添加教师依赖关系所需数据（teacher_id, name）
    queryAllTeacher() {
      queryAllTeacher()
        .then(res => {
          if (res !== null) {
            if (res.success) {
              this.teacherOption = res.data.rows
            }
          }
        })
    },
    // 取消方法，将所有的内容至null
    cancle() {
      this.classInfo.classId = ''
      this.classInfo.name = ''
      this.classInfo.price = ''
      this.classInfo.quota = ''
      this.classInfo.teacherId = ''
      this.classInfo.description = ''
      this.classInfo.status = ''
    },
    submit(classInfo) {
      this.nowId = this.nowUserId
      saveClass(
        [
          function(data) {
            return qs.stringify(data)
          }
        ],
        this.nowId,
        classInfo
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
<style  scoped>
</style>
