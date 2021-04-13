<!-- 订单详情页面 -->
<template>
  <div v-if="nowRole === '[ADMIN]' || nowRole === '[STUDENT]'" class="app-container">
    <h1>订单详情</h1>
    <el-form ref="form" :model="orderDetail" label-width="80px">
      <el-form-item label="订单号">
        <el-input v-model="orderDetail.orderId" :disabled="true" style="width: 400px"/>
      </el-form-item>
      <el-form-item label="课程名称">
        <el-input v-model="orderDetail.className" :disabled="true" style="width: 400px"/>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="orderDetail.createTime" :disabled="true" style="width: 400px"/>
      </el-form-item>
      <el-form-item label="更新时间">
        <el-input v-model="orderDetail.updateTime" :disabled="true" style="width: 400px"/>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="orderDetail.status" :disabled="true" style="width: 400px" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="订单价格">
        <el-input v-model="orderDetail.price" :disabled="true" style="width: 400px"/>
      </el-form-item>
      <el-form-item label="订单反馈">
        <el-select v-model="orderDetail.feedBack" :disabled="!isAdmin" >
          <el-option
            v-for="item in feedBackOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="back">返 回</el-button>
        <el-button v-show="isAdmin" type="primary" @click="updateFeedback">更 新</el-button>
        <el-button v-show="!isAdmin && orderDetail.status === 1" type="primary" @click="fileDownloadDialogVisible = true">资料下载</el-button>
        <el-button v-show="!isAdmin && orderDetail.status === 1" type="primary" @click="dialogVisible = true">申请退单</el-button>
      </el-form-item>
      <!-- 提示是否删除的弹窗 -->
      <el-dialog
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        title="提示"
        width="30%">
        <span>请确认是否申请退单！</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="applyChargeBack()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 提示下载资料 -->
      <el-dialog
        :visible.sync="fileDownloadDialogVisible"
        :before-close="handleClose"
        title="课程资料下载"
        width="30%">
        <a v-for="item in orderDetail.file" :key="item" :href="getFileHref(item)">{{ item.substring(item.indexOf('\\') + 1) }}</a>
        <span v-if="orderDetail.file.length === 0">
          <h1>当前课程没有资料可供下载</h1>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fileDownloadDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
import { updateFeedback, applyReturnOrder } from '@/api/edu/order/order'
import qs from 'qs'
export default {

  components: {},
  data() {
    return {
      // 获取路由传递的参数
      orderDetail: this.$route.query.orderDetail,
      options: [{
        value: 0,
        label: '未支付'
      }, {
        value: 1,
        label: '已支付'
      }, {
        value: 2,
        label: '废弃订单'
      }],
      feedBackOptions: [{
        value: 0,
        label: '无反馈' },
      {
        value: 1,
        label: '申请退单'
      }, {
        value: 2,
        label: '确认申请'
      }, {
        value: 3,
        label: '拒绝申请'
      }],
      // 弹窗显示标识
      dialogVisible: false,
      // 文件下载弹窗标识
      fileDownloadDialogVisible: false,
      // 申请退单的传参
      orderParam: {
        orderId: '',
        className: '',
        classId: '',
        studentId: '',
        status: '',
        feedBack: 0
      },
      // 是否是管理员标识，该标识用于限制当前表单是否可以进行更改
      isAdmin: false
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

  created() {
    if (this.nowRole === '[ADMIN]') {
      this.isAdmin = true
    }
    console.info(this.isAdmin)
    // this.fileList = this.orderDetail.file
    console.info(this.orderDetail.file)
  },

  methods: {
    // 返回之前的list组件
    back() {
      this.$router.replace({
        path: '/order/list'
      })
    },
    // 申请退单
    applyChargeBack() {
      // 给orderParam进行赋值
      this.orderParam.orderId = this.orderDetail.orderId
      this.orderParam.className = this.orderDetail.className
      this.orderParam.status = this.orderDetail.status
      this.orderParam.feedBack = 1
      this.orderParam.studentId = this.orderDetail.studentId
      this.orderParam.classId = this.orderDetail.classId
      applyReturnOrder(
        [
          function(data) {
            return qs.stringify(data)
          }
        ],
        this.orderParam
      ).then(res => {
        if (res !== null) {
          if (res.success) {
            this.$message({
              message: '申请成功',
              type: 'success'
            })
            // 成功后关闭弹窗
            this.dialogVisible = false
          } else {
            this.$message({
              methods: '申请失败',
              type: 'warning'
            })
          }
        }
      })
    },
    // 关闭弹窗的回调函数
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 更新订单方法（管理员权限使用）
    updateFeedback() {
      // 给orderParam进行赋值
      this.orderParam.orderId = this.orderDetail.orderId
      this.orderParam.className = this.orderDetail.className
      this.orderParam.status = this.orderDetail.status
      this.orderParam.feedBack = this.orderDetail.feedBack
      this.orderParam.studentId = this.orderDetail.studentId
      console.info(this.orderParam.feedBack)
      updateFeedback(
        [
          function(data) {
            return qs.stringify(data)
          }
        ],
        this.orderParam
      ).then(res => {
        if (res !== null) {
          if (res.success) {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            // 成功后关闭弹窗
            this.dialogVisible = false
          } else {
            this.$message({
              methods: '更新失败',
              type: 'warning'
            })
          }
        }
      })
    },
    getFileHref(filePath) {
      console.log(filePath)
      // debugger
      return 'http://localhost:8001/classInfo/' + filePath
    }
  }
}

</script>
<style  scoped>
</style>
