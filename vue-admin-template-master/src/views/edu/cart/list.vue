<!-- 购物车列表 -->
<template>
  <div v-if="isStudent" class="app-container">
    <h1>购物车管理</h1>
    <table v-show="flag" style="height: 800px">
      <tr>
        <div class="item-nominate">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="classId"
              label="课程编号"
              width="300"/>
            <el-table-column
              prop="name"
              label="课程名"
              width="300"/>
            <el-table-column
              prop="price"
              label="课程价格"
              width="400"/>
            <el-table-column
              prop="quota"
              label="课程名额"
              width="300"/>
            <el-table-column
              fixed="right"
              label="操作"
              width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="ensureOrder(scope.row)">结算</el-button>
                <el-button type="text" size="small" @click="deleteCart(scope.row.classId)">删除</el-button>
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
          @current-change="pageSearchCart"/>
      </tr>
    </table>
  </div>
  <div v-else><h1>您当前没有权限查看该页面</h1> </div>
</template>

<script>
import qs from 'qs'
import { pageSearch, deleteCart } from '@/api/edu/cart/cart'
import { saveOrder } from '@/api/edu/order/order'
export default {

  components: {},
  data() {
    return {
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
      userInfo: {},
      nowId: '',
      isStudent: false,
      // 订单信息
      orderInfo: {
        orderId: '',
        studentId: '',
        classId: '',
        status: ''
      }
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
  mounted() {
    var role = this.nowRole
    if (role === '[STUDENT]') {
      this.isStudent = true
    }
    this.$nextTick(function() {
      // 页面加载之前先将切换标识置为true
      this.flag = true
      // 页面渲染完毕加载分页查询的所有教师简略信息，默认显示第一页
      this.pageSearchCart('0')
    })
  },
  methods: {
    // 分页查询
    pageSearchCart(val) {
      if (this.isStudent) {
        // 获取当前登录用户id
        this.nowId = this.nowUserId
        this.currentPage = val
        pageSearch(this.nowId, this.currentPage, this.limit)
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
    },
    // 删除课程
    deleteCart(classId) {
      var studentId = this.nowUserId
      deleteCart(classId, studentId)
        .then(res => {
          if (res !== null) {
            if (res.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.pageSearchCart('0')
            } else {
              this.$message({
                message: '删除失败',
                type: 'warning'
              })
            }
          }
        })
    },
    // 结算-->直接跳转至确认订单页面
    ensureOrder(classInfo) {
      var time = new Date()
      console.info(time)
      // 订单编号根据当前的时间戳
      this.orderInfo.orderId = 'Edu' + time.getFullYear() + '' + (time.getMonth() + 1) + '' + time.getDay() + '' + time.getHours() + '' + time.getMinutes() + '' + time.getSeconds()
      this.orderInfo.classId = classInfo.classId
      // 由于只有学生才可以进行下订单，所以将当前id赋值为学生id
      this.orderInfo.studentId = this.nowUserId
      // 初步保存订单设定为0 即未支付状态
      this.orderInfo.status = 0
      // 完成结算之后自动删除购物车该课程信息
      this.deleteCart(classInfo.classId)
      // 保存订单
      saveOrder(
        [
          function(data) {
            return qs.stringify(data)
          }
        ],
        this.orderInfo
      ).then(res => {
        if (res !== null) {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            // 暂存订单成功跳转到确认订单页面
            this.$router.replace({
              path: '/order/ensureOrder',
              query: { orderInfo: this.orderInfo }
            })
          } else {
            this.$message({
              methods: res.message,
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
