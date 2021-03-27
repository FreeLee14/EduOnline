<!-- 课程详情展示
（管理员权限可以修改信息，给当前课程添加更换老师）
（学生权限在该页面下可以购买课程或添加到购物车） -->
<template>
  <div class="app-container">
    <el-form ref="form" :model="classInfo" label-width="80px">
      <el-form-item label="课程编号">
        <el-input v-model="classInfo.classId" :disabled="!isAdmin"/>
      </el-form-item>
      <el-form-item label="课程名">
        <el-input v-model="classInfo.name" :disabled="!isAdmin"/>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input v-model="classInfo.price" :disabled="!isAdmin"/>
      </el-form-item>
      <el-form-item label="课程名额">
        <el-input v-model="classInfo.quota" :disabled="!isAdmin"/>
      </el-form-item>
      <el-form-item v-if="isAdmin" label="任课教师">
        <el-select v-model="classInfo.teacherId" >
          <el-option
            v-for="item in teacherOption"
            :key="item.teacherId"
            :label="item.name"
            :value="item.teacherId"/>
        </el-select>
      </el-form-item>
      <el-form-item v-if="!isAdmin" label="任课教师">
        <el-input v-model="classInfo.teacherName" :disabled="!isAdmin"/>
      </el-form-item>
      <el-form-item label="课程状态">
        <el-select v-model="classInfo.status" :disabled="!isAdmin">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="课程简介">
        <el-input v-model="classInfo.description" :disabled="!isAdmin" type="textarea" />
      </el-form-item>
      <el-form-item>
        <!-- 课程只允许管理员更改信息 -->
        <el-button v-if="isAdmin" type="primary" @click="updateClass(classInfo)">更新</el-button>
        <!-- 该界面允许学生进行购买 添加购物车 -->
        <el-button v-if="isStudent" type="primary" @click="purchase(classInfo)">购买</el-button>
        <el-button v-if="isStudent" type="primary" @click="addToCart(classInfo)">添加购物车</el-button>
      </el-form-item>
    </el-form>
    <router-view />
  </div>
</template>

<script>
import qs from 'qs'
import { updateClass } from '@/api/edu/class/class'
import { saveOrder } from '@/api/edu/order/order'
import { saveToCart } from '@/api/edu/cart/cart'
export default {

  components: {},
  data() {
    return {
      // 获取通过路由传递过来的数据
      classInfo: this.$route.query.classInfo,
      teacherOption: this.$route.query.teacherOption,
      nowId: '',
      isAdmin: false,
      isStudent: false,
      options: [{
        value: 1,
        label: '未开课'
      }, {
        value: 2,
        label: '已开课'
      }, {
        value: 3,
        label: '已结课'
      }],
      // 订单信息
      orderInfo: {
        orderId: '',
        studentId: '',
        classId: '',
        status: ''
      },
      // 购物车保存传递参数
      cartParam: {
        classId: '',
        studentId: ''
      }
    }
  },

  computed: {
    // 当前用户id
    nowUserId: {
      get() {
        return this.$store.getters.userId
      }
    },
    // 当前用户角色
    nowRole: {
      get() {
        return this.$store.getters.roles
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      // 设置权限标识
      if (this.nowRole === '[ADMIN]') {
        this.isAdmin = true
      } else if (this.nowRole === '[STUDENT]') {
        this.isStudent = true
      }
      console.info(this.classInfo)
      console.info(this.teacherOption)
    })
  },
  methods: {
    // 更新课程
    updateClass(classInfo) {
      updateClass(
        [
          function(data) {
            return qs.stringify(data)
          }
        ],
        classInfo
      ).then(res => {
        if (res !== null) {
          if (res.success) {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: '更新失败',
              type: 'warning'
            })
          }
        }
      })
    },
    // 购买课程
    purchase(classInfo) {
      var time = new Date()
      console.info(time)
      // 订单编号根据当前的时间戳
      this.orderInfo.orderId = 'Edu' + time.getFullYear() + '' + (time.getMonth() + 1) + '' + time.getDay() + '' + time.getHours() + '' + time.getMinutes() + '' + time.getSeconds()
      this.orderInfo.classId = classInfo.classId
      // 由于只有学生才可以进行下订单，所以将当前id赋值为学生id
      this.orderInfo.studentId = this.nowUserId
      // 初步保存订单设定为0 即未支付状态
      this.orderInfo.status = 0

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
    },
    // 添加购物车
    addToCart(classInfo) {
      this.cartParam.classId = classInfo.classId
      this.cartParam.studentId = this.nowUserId
      saveToCart(
        [
          function(data) {
            return qs.stringify(data)
          }
        ],
        this.cartParam
      ).then(res => {
        if (res != null) {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
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
