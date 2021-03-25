<!-- 测试组件 -->
<template>
  <div><h1>测试组件</h1></div>
</template>

<script>
export default {

  components: {},
  data() {
    return {
      classInfo: this.$route.query.classInfo
    }
  },
  mouted() {
    console.info(this.classInfo)
  },
  computed: {},

  methods: {}
}

</script>
<style  scoped>
</style>
