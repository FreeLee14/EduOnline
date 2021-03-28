<!-- 确认订单页面 -->
<template>
  <div class="app-container">
    <h1>确认订单</h1>

    <el-form ref="form" :model="orderDetail" label-width="80px">

      <el-form-item label="创建时间">
        <el-input v-model="orderDetail.createTime" :disabled="true"/>
      </el-form-item>

      <el-form-item label="订单id">
        <el-input v-model="orderDetail.orderId" :disabled="true"/>
      </el-form-item>

      <el-form-item label="课程名称">
        <el-input v-model="orderDetail.className" :disabled="true"/>
      </el-form-item>

      <el-form-item label="订单状态">
        <el-select v-model="orderDetail.status" :disabled="true">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>

      <el-form-item label="价格">
        <el-input v-model="orderDetail.price" :disabled="true"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="ensureOrder(orderDetail)">确认订单</el-button>
        <el-button type="primary" @click="cancelOrder(orderDetail)">取消订单</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script>
import { info, updateOrder } from '@/api/edu/order/order'
import qs from 'qs'
export default {

  components: {},
  data() {
    return {
      orderInfo: this.$route.query.orderInfo,
      orderDetail: {
        className: '',
        createTime: '',
        orderId: '',
        status: '',
        price: ''
      },
      orderParam: {
        orderId: '',
        status: '',
        price: '',
        studentId: '',
        classId: ''
      },
      options: [{
        value: 0,
        label: '未支付'
      }, {
        value: 1,
        label: '已支付'
      }, {
        value: 2,
        label: '废弃订单'
      }]
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
    console.info(this.orderInfo)
    var orderId = this.orderInfo.orderId
    this.info(orderId, this.nowUserId)
  },

  methods: {
    // 根据订单id查询订单
    info(orderId, nowId) {
      info(orderId, nowId)
        .then(res => {
          if (res !== null) {
            if (res.success) {
              // 将根据订单id查询已保存但处于未支付状态的订单
              this.orderDetail = res.data
              console.info(this.orderDetail)
            }
          }
        })
    },
    // 确认订单，row为当前表格点击按钮所在行的信息对象
    ensureOrder(orderDetail) {
      console.log(orderDetail.orderId)
      this.orderParam.orderId = orderDetail.orderId
      this.orderParam.status = 1
      this.orderParam.price = orderDetail.price
      this.orderParam.studentId = this.nowUserId
      this.orderParam.classId = this.orderInfo.classId
      console.info(this.orderParam)
      updateOrder(
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
    },
    // 取消订单
    cancelOrder(orderDetail) {
      this.orderParam.orderId = orderDetail.orderId
      this.orderParam.status = 2
      this.orderParam.price = orderDetail.price
      this.orderParam.studentId = this.nowUserId
      this.orderParam.classId = this.orderInfo.classId
      updateOrder(
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
              message: res.message,
              type: 'success'
            })
            this.$router.replace({
              path: '/class/list'
            })
          } else {
            this.$message({
              message: res.message,
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
