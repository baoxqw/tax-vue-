<template>
  <div class="app_main">
    <transition name="fade" mode="out-in">
      <router-view :key="key"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key () {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
  }
}
</script>

<style lang="less">
  #toolbar {
    .el-tabs {
      .el-tabs__header {
        margin: 0;
      }
      .el-tabs__active-bar {
        height: 1px;
      }
      .el-tabs__item {
        font-size: 15px;
        color: #55585E;
        font-weight: normal;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
    }
  }
</style>
