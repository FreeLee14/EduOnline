<!-- 确认订单页面 -->
<template>
  <div>
    <h1>确认订单</h1>
    <table>
      <tr>
        <el-table
          :data="orderDetail"
          border
          style="width: 100%">
          <el-table-column
            prop="createTime"
            label="日期"
            width="180"/>
          <el-table-column
            prop="orderId"
            label="订单编号"
            width="180"/>
          <el-table-column
            prop="className"
            label="课程名称"
            width="180"/>
          <el-table-column
            prop="status"
            label="订单状态"
            width="180"/>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="ensureOrder(scope.row)">查看</el-button>
              <el-button type="text" size="small" @click="cancelOrder(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </tr>
    </table>
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
      orderDetail: {},
      orderParam: {
        orderId: '',
        status: '',
        price: '',
        studentId: ''
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

  mouted() {
    this.$nextTick(function() {
      var orderId = this.orderInfo.orderId
      this.info(orderId)
    })
  },

  methods: {
    // 根据订单id查询订单
    info(orderId) {
      info(orderId)
        .then(res => {
          if (res !== null) {
            if (res.success) {
              // 将根据订单id查询已保存但处于未支付状态的订单
              this.orderDetail = res.data
            }
          }
        })
    },
    // 确认订单，row为当前表格点击按钮所在行的信息对象
    ensureOrder(row) {
      this.orderParam.orderId = row.orderId
      this.orderParam.status = '1'
      this.orderParam.price = row.price
      this.orderParam = row.studentId
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
    cancelOrder(row) {
      this.orderParam.orderId = row.orderId
      this.orderParam.status = '2'
      this.orderParam.price = row.price
      this.orderParam = row.studentId
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
    }
  }
}

</script>
<style  scoped>
</style>
