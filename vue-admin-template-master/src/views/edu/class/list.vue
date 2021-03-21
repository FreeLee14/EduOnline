<template>
  <div class="app-container">
    <h1>课程管理</h1>
    <table v-show="flag" style="height: 800px">
      <tr>
        <div class="item-search">
          <td><h2>价格:</h2></td>
          <td >
            <el-input
              v-model="classQueryVO.priceLowLimit"
              placeholder="大于"
              clearable/>
          </td>
          <td><h2>~</h2></td>
          <td>
            <el-input
              v-model="classQueryVO.priceHighLimit"
              placeholder="小于"
              clearable/>
          </td>
          <td><h2>课程状态:</h2></td>
          <td>
            <el-select v-model="classQueryVO.status" clearable placeholder="课程状态">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </td>
          <td><h2>时间:</h2></td>
          <td>
            <el-date-picker
              v-model="date"
              style="width: 500px"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="changeDate" />
          </td>
          <td>
            <el-button type="info" round @click="pageSearchByCondition('0')">查询</el-button>
          </td>
        </div>
      </tr>
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
              width="200"/>
            <el-table-column
              prop="quota"
              label="课程名额"
              width="350"/>
            <el-table-column
              fixed="right"
              label="操作"
              width="350">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="info(scope.row.classId)">查看</el-button>
                <!-- 只有管理员有删除权限 -->
                <el-button v-if="nowRole == '[ADMIN]'" type="text" size="small" @click="deleteclass(scope.row.classId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </tr>
      <tr>
        <!-- current-change是当前标签发生变化时触发此方法 -->
        <el-pagination
          v-if="!isTeacher"
          :hide-on-single-page="value"
          :page-size="limit"
          :total="tableDateLength"
          layout="prev, pager, next"
          @current-change="pageSearchByCondition"/>
        <el-pagination
          v-if="isTeacher"
          :hide-on-single-page="value"
          :page-size="limit"
          :total="tableDateLength"
          layout="prev, pager, next"
          @current-change="pageSearchByTeacher"/>
      </tr>
    </table>
    <table v-show="flag">
      <router-view />
    </table>
  </div>
</template>
<script>
import qs from 'qs'
import { info, deleteclass, pageSearchByCondition, pageSearchByTeacher } from '@/api/edu/class/class'
import { queryAllTeacher } from '@/api/edu/teacher/teacher'
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
      classInfo: {},
      nowId: '',
      isTeacher: false,
      // 用于传递到子组件显示教师下拉列表
      teacherOption: [],
      classQueryVO: {
        beginTime: null,
        endTime: null,
        priceHighLimit: null,
        priceLowLimit: null,
        status: null
      },
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
      // 开始日期和结束日期
      date: []
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
      // 页面渲染完毕加载分页查询的所有课程简略信息，默认显示第一页
      if (this.nowRole === '[TEACHER]') {
        // 如果当前是登录人员是教师，将是讲师标识置为true
        this.isTeacher = true
        this.pageSearchByTeacher('0')
      } else {
        this.pageSearchByCondition('0')
      }
      console.info(this.nowRole)
    })
  },
  methods: {
    // 通过当前教师id进行分页查看课程
    pageSearchByTeacher(val) {
      // 获取当前登录用户id
      this.nowId = this.nowUserId
      this.currentPage = val
      pageSearchByTeacher(this.nowId, this.currentPage, this.limit)
        .then(res => {
          if (res !== null) {
            if (res.success) {
              this.tableData = res.data.rows
              // 每次翻页也要获取总记录数，进行一个动态的更新
              this.tableDateLength = res.data.total
            }
          }
        })
    },
    // 通过条件来分页展示课程（时间、价格、课程状态）
    pageSearchByCondition(val) {
      this.currentPage = val
      pageSearchByCondition(
        [
          function(data) {
            return qs.stringify(data)
          }
        ],
        this.currentPage,
        this.limit,
        this.classQueryVO
      ).then(res => {
        if (res !== null) {
          if (res.success) {
            this.tableData = res.data.rows
            // 每次翻页也要获取总记录数，进行一个动态的更新
            this.tableDateLength = res.data.total
          }
        }
      })
    },
    // 根据课程编号查看课程详细信息
    info(classId) {
      console.info(this.nowRole)
      console.info(this.nowRole === '[ADMIN]')
      // 如果当前是管理员权限，才允许将教师信息传递到课程详情组件，用于修改教师
      if (this.nowRole === '[ADMIN]') {
        queryAllTeacher()
          .then(res => {
            if (res !== null) {
              if (res.success) {
                // 切换显示详情组件，隐藏分页组件
                this.flag = false
                this.teacherOption = res.data.rows
                console.info(this.teacherOption)
              }
            }
          })
      }
      info(classId)
        .then(res => {
          if (res !== null) {
            if (res.success) {
              console.info('success to query classinfo')
              // 使用本地对象接收数据
              this.classInfo = res.data
              console.info(this.classInfo)
              // 非管理员权限只传递课程信息到课程详情组件中
              // 切换显示详情组件，隐藏分页组件
              this.flag = false
              this.$router.replace({
                path: '/classInfo',
                query: { classInfo: this.classInfo, teacherOption: this.teacherOption }
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
    // 根据课程编号删除课程
    deleteclass(classId) {
      console.log(this.classId)
      this.nowId = this.nowUserId
      deleteclass(this.nowId, classId)
        .then(res => {
          if (res !== null) {
            if (res.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              // 删除成功后重新查询后台数据
              if (this.isTeacher) {
                // 如果当前是教师，走教师权限
                this.pageSearchByTeacher(this.currentPage)
              } else {
                // 非教师走其他权限查询方法
                this.pageSearchByCondition(this.currentPage)
              }
            } else {
              this.$message({
                message: '删除失败',
                type: 'warning'
              })
            }
          }
        })
    },
    changeDate() {
      console.log(this.date)
      this.classQueryVO.beginTime = this.date[0]
      this.classQueryVO.endTime = this.date[1]
      console.log(this.classQueryVO.beginTime)
      console.log(this.classQueryVO.endTime)
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
  margin-top: -200px;
}
.item-search{
  background-color: #FFFFFF;
  float: left;
  position: relative;
  width: 1500px;
  height: 50px;
  margin-left: 50px;
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
