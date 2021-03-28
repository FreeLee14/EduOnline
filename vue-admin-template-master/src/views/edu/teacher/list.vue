<template>
  <div class="app-container">
    <h1>讲师管理</h1>
    <table v-show="flag" style="height: 800px">
      <tr>
        <div class="item-nominate">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="teacherId"
              label="教师id"
              width="180"/>
            <el-table-column
              prop="name"
              label="姓名"
              width="180"/>
            <el-table-column
              prop="level"
              label="等级">
              <template slot-scope="scope">{{ getLevel(scope.row.level) }}</template>
            </el-table-column>
            <el-table-column
              prop="description"
              label="简介"
              width="700"/>
            <el-table-column
              fixed="right"
              label="操作"
              width="150">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="info(scope.row.teacherId)">查看</el-button>
                <!-- 只有管理员有删除权限 -->
                <el-button v-if="nowRole == '[ADMIN]'" type="text" size="small" @click="deleteTeacher(scope.row.teacherId)">删除</el-button>
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
          @current-change="pageSearchTeacher"/>
      </tr>
    </table>
    <table v-show="flag">
      <router-view />
    </table>
  </div>
</template>
<script>
import { pageSearch, info, deleteTeacher } from '@/api/edu/teacher/teacher'
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
      nowId: ''
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
    this.$nextTick(function() {
      // 页面加载之前先将切换标识置为true
      this.flag = true
      // 页面渲染完毕加载分页查询的所有教师简略信息，默认显示第一页
      this.pageSearchTeacher('0')
    })
  },
  methods: {
    // 分页查询所有教师
    pageSearchTeacher(val) {
      // 由于mybaitsplus的分页插件自动处理的当前页数和记录数之间的关系，所以我们这里只需要传递正确的页数即可
      this.currentPage = val
      pageSearch(this.currentPage, this.limit)
        .then(res => {
          if (res !== null) {
            if (res.success) {
              this.tableData = res.data.rows
              console.log(this.tableData)
              // 每次翻页也要获取总记录数，进行一个动态的更新
              this.tableDateLength = res.data.total
            }
          }
        })
    },
    // 根据id查看教师详细信息
    info(teacherId) {
      info(teacherId)
        .then(res => {
          if (res !== null) {
            if (res.success) {
              // 切换显示详情组件，隐藏分页组件
              this.flag = false
              // 使用本地对象接收数据
              this.userInfo = res.data
              this.$router.replace({
                path: '/detail',
                query: { userInfo: this.userInfo }
              })
            } else {
              this.$message({
                message: '查询出错',
                type: 'warning'
              })
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 根据教师id删除教师
    deleteTeacher(teacherId) {
      console.log(this.nowUserId)
      this.nowId = this.nowUserId
      deleteTeacher(this.nowId, teacherId)
        .then(res => {
          if (res !== null) {
            if (res.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              // 删除成功后重新查询后台数据
              this.pageSearchTeacher(this.currentPage)
            } else {
              this.$message({
                message: '删除失败',
                type: 'warning'
              })
            }
          }
        })
    },
    // 映射教师等级
    getLevel(level) {
      switch (level) {
        case 1:
          return '初级教师'
        case 2:
          return '中级教师'
        case 3:
          return '高级教师'
        case 4:
          return '特级教师'
      }
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
