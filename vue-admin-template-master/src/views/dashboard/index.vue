<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text"><h6>姓名:{{ name }}</h6></div> -->
    <!-- <div class="dashboard-text"><h6>权限:<span v-for="role in roles" :key="role">{{ role }}</span></h6></div> -->
    <div class="top1">
      <el-carousel height="300px">
        <el-carousel-item v-for="item in 4" :key="item">
          <span class="imagInfo"><img :src="'http://127.0.0.1:8001/user/dashboard/'+item +'.jpg'" class=""></span>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="top2">
      <el-carousel height="300px">
        <el-carousel-item v-for="item in 4" :key="item">
          <span class="imagInfo"><img :src="'http://127.0.0.1:8001/user/dashboard/'+item +'.jpg'" class=""></span>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  data() {
    return {
      imageList: []
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.el-carousel__item h3 {
    color: #eaeef3;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #f5f6f7;
  }
  .el-carousel__item:nth-child(2n+1) {
     background-color: #ffffff;
  }
.imagInfo {
  position: relative;
  top: 0px;
  left: 0px;
  align-content: center;
}
.top1 {
  float: left;
  position: relative;
  top: 100px;
  left: 200px;
  width: 470px;
}
.top2 {
  float: left;
  position: relative;
  top: 100px;
  left: 700px;
  width: 470px;
}
</style>
