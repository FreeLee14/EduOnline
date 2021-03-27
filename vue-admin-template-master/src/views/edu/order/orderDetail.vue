<!-- 订单详情页面 -->
<template>
  <div v-if="nowRole == '[STUDENT]'" class="app-container">
    <h1>订单详情</h1>
    <el-form ref="form" :model="orderDetail" label-width="80px">
      <el-form-item label="订单号">
        <el-input v-model="orderDetail.orderId" :disabled="true"/>
      </el-form-item>
      <el-form-item label="课程名称">
        <el-input v-model="orderDetail.className" :disabled="true"/>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-input v-model="orderDetail.createTime" :disabled="true"/>
      </el-form-item>
      <el-form-item label="更新时间">
        <el-input v-model="orderDetail.updateTime" :disabled="true"/>
      </el-form-item>
      <el-form-item label="订单状态">
        <el-select v-model="orderDetail.status" :disabled="true" >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="订单价格">
        <el-input v-model="orderDetail.price" :disabled="true"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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

  methods: {
    // 返回之前的list组件
    back() {
      this.$router.replace({
        path: '/order/list'
      })
    }
  }
}

</script>
<style  scoped>
</style>
