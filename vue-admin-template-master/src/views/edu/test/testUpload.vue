<!-- 测试图片上传功能 -->
<template>
  <div>
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
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传doc文件，且不超过10MB</div>
    </el-upload>

    <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
  </div>
</template>

<script>
import { uploadAvatar } from '@/api/upload'
export default {

  components: {},
  data() {
    return {
      imageUrl: 'http://127.0.0.1:8001/user/avatar/cool.jpg',
      imageName: '',
      imgInfo: '',
      fileList: [
        {
          name: '',
          url: ''
        }
      ]
    }
  },

  computed: {},

  methods: {
    savePhoto(file, fileList) {
      const formData = new FormData()
      formData.append('file', file.raw)
      uploadAvatar(formData)
        .then(res => {
          if (res !== null) {
            console.info(res.data.avatarUrl)
          }
        })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      console.info(file)
      console.info(res)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 提交文件
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    beforeUpload(file) {
      console.log(file)
      var fileName = file.name
      if (fileName.search('docx') !== -1 || fileName.search('doc') !== -1) {
        if (fileName.indexOf('$') === -1) {
          console.info('...')
          // file.name = '202109933$' + fileName
        }
      }
    },
    changeName(file, fileList) {
      console.log(file)
      var fileName = file.name
      console.log(file.name)
      if (fileName.search('docx') !== -1 || fileName.search('doc') !== -1) {
        if (fileName.indexOf('$') === -1) {
          console.info('...')
          file.name = '202109933$' + fileName
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
