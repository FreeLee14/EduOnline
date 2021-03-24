<!-- 订单管理 -->
<template >
  <div v-if="nowRole == '[STUDENT]'" class="app-container">
    <h1 >订单管理</h1>
    <table v-show="isStudent">
      <tr>
        <div class="item-nominate">
          <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
              prop="orderId"
              label="订单编号"
              width="180"/>
            <el-table-column
              prop="status"
              label="订单状态"
              width="180"/>
            <el-table-column
              prop="createTime"
              label="日期"
              width="180"/>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="queryOrder(scope.row)">查看</el-button>
                <el-button type="text" size="small" @click="deleteOrder(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tr>
      <tr>
        <!-- current-change是当前标签发生变化时触发此方法 -->
        <el-pagination
          :hide-on-single-page="value"
          :page-size="limit"
          :total="tableDateLength"
          layout="prev, pager, next"
          @current-change="pageSearchOrder"/>
      </tr>
    </table>
  </div>
  <div v-else><h1>您当前没有权限查看</h1> </div>
</template>

<script>
import { info, deleteOrder, pageSearch } from '@/api/edu/order/order'
export default {

  components: {},
  data() {
    return {
      isStudent: false,
      // 控制分页当只有一页的时候不显示分页控件
      value: false,
      // 当前页数
      currentPage: 0,
      // 每一页显示的数量 默认显示8条
      limit: 8,
      // 获取动态的分页数据
      tableData: [],
      // 总记录数（根据后台返回来确定）
      dateLength: 0,
      // 切换分页展示和单一展示具体信息的标识
      flag: true,
      orderDetail: {}
    }
  },

  computed: {
    // 通过动态属性响应式的记录总记录数
    tableDateLength: {
      get() {
        return this.dateLength
      },
      set(v) {
        this.dateLength = v
      }
    },
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
    console.info(this.nowRole)
    if (this.nowRole === '[STUDENT]') {
      console.info(this.nowRole)
      this.isStudent = true
      this.pageSearchOrder('0')
    }
  },
  methods: {
    queryOrder(row) {
      var orderId = row.orderId
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
    // 删除订单
    deleteOrder(row) {
      var orderId = row.orderId
      deleteOrder(orderId)
        .then(res => {
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
    // 分页查询所有学生
    pageSearchOrder(val) {
      // 由于mybaitsplus的分页插件自动处理的当前页数和记录数之间的关系，所以我们这里只需要传递正确的页数即可
      this.currentPage = val
      pageSearch(this.nowUserId, this.currentPage, this.limit)
        .then(res => {
          if (res !== null) {
            if (res.success) {
              this.tableData = res.data.rows
              // 每次翻页也要获取总记录数，进行一个动态的更新
              this.tableDateLength = res.data.total
            }
          }
        })
    }
  }
}

</script>
<style  scoped>
.item-nominate{
  background-color: #FFFFFF;
  float: left;
  position: relative;
  left: 20px;
  width: 1500px;
  height: 200px;
  margin-left: 20px;
  margin-top: 20px;
}
.page{
  position: relative;
  top: 500px;
  left: -1450px;
}
.departure{
  position: relative;
  top: 20px;
  left: 50px;
}
.destination{
  position: relative;
  top: 100px;
  left: -7px;
}
.money{
  position: relative;
  top: 20px;
  left: 150px;
}
.buying{
  position: relative;
  top:100px;
  left: 90px;
}
.page{
  position: relative;
}
</style>
