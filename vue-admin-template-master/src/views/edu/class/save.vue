<!-- 添加课程组件 -->
<template>
  <div v-if="nowRole !== '[STUDENT]'" class="app-container">
    <h1>添加课程</h1>
    <el-form ref="form" :rules="rules" :model="classInfo" label-width="80px">
      <el-form-item prop="classId" label="课程编号">
        <el-input v-model="classInfo.classId"/>
      </el-form-item>
      <el-form-item prop="name" label="课程名">
        <el-input v-model="classInfo.name"/>
      </el-form-item>
      <el-form-item prop="price" label="价格">
        <el-input v-model="classInfo.price"/>
      </el-form-item>
      <el-form-item prop="quota" label="课程名额">
        <el-input v-model="classInfo.quota"/>
      </el-form-item>
      <el-form-item v-if="nowRole === '[ADMIN]'" prop="teacherId" label="任课教师">
        <el-select v-model="classInfo.teacherId" placeholder="选择当前任课教师">
          <el-option
            v-for="item in teacherOption"
            :key="item.teacherId"
            :label="item.name"
            :value="item.teacherId"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="nowRole === '[TEACHER]'" prop="teacherId" label="任课教师">
        <el-select v-model="classInfo.teacherId" :disabled="true" placeholder="选择当前任课教师">
          <el-option
            v-for="item in teacherOption"
            :key="item.teacherId"
            :label="item.name"
            :value="item.teacherId"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="status" label="课程状态">
        <el-select v-model="classInfo.status" placeholder="选择当前课程状态">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item prop="description" label="课程简介">
        <el-input v-model="classInfo.description" type="textarea" />
      </el-form-item>
      <el-form-item label="课程文件">
        <el-upload
          ref="upload"
          :on-change="changeName"
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          class="upload-demo"
          action="http://127.0.0.1:8001/onlineedu/upload/uploadFiles">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
          <div slot="tip" class="el-upload__tip">只能上传doc文件，且不超过10MB</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <!-- 课程添加只允许管理员和教师自己添加 -->
        <el-button type="primary" @click="submit(classInfo)">提交</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div v-else><h1>您当前没有权限查看</h1> </div>
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
      // 进行表单的整体校验
      rules: {
        classId: [
          { required: true, message: '课程编号不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '课程名称不能为空', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '价格不能为空', trigger: 'blur' }
        ],
        quota: [
          { required: true, message: '名额不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '课程状态必须填写', trigger: 'change' }
        ]
      },
      // 当前用户id
      nowId: '',
      fileList: [
        {
          name: '',
          url: ''
        }
      ]
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
      if (this.nowRole === '[TEACHER]') {
        this.classInfo.teacherId = this.nowUserId
      }
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
      // 保存课程信息
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
            // 提交文件
            this.$refs.upload.submit()
          } else {
            this.$message({
              message: '保存失败',
              type: 'warning'
            })
          }
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    beforeUpload(file) {
      console.log(file)
      const isLt2M = file.size / 1024 / 1024 <= 10
      if (!isLt2M) {
        this.$message.error('上传文件大小不能超过 10MB!')
      }
      return isLt2M
    },
    changeName(file, fileList) {
      console.log(file)
      var fileName = file.name
      if (fileName.search('docx') !== -1 || fileName.search('doc') !== -1) {
        if (fileName.indexOf('$') === -1) {
          file.name = this.classInfo.classId + '$' + fileName
        }
      } else {
        this.$message.error('当前文件格式必须为docx或doc格式文件!')
        // 将页面回显的file内容从数组中弹出
        fileList.pop()
      }
    }
  }
}

</script>
<style  scoped>
</style>
