<template>
  <div class="layout" :class="classObj">
    <sidebar class="sidebar_container"></sidebar>
    <div class="mian_container">
      <navbar></navbar>
      <app-main class="app_mian"></app-main>
       <div style="z-index: 21;
    position: absolute;
    bottom: 0;
    text-align: center;
    width: 100%;
    font-size:13px">
       版权所有©2016 - 2019 | 西安麦仓数据服务有限公司 |
      <a style="color: #777;text-decoration: none" href="http://beian.miit.gov.cn"
         target="_blank">陕ICP备17018521号-2</a>
    </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Navbar, AppMain, Sidebar } from './components'

export default {
  name: 'layout',
  components: {
    Navbar,
    AppMain,
    Sidebar
  },
  data () {
    return {
      isCollapse: true
    }
  },
  computed: {
    sidebar () {
      return this.$store.state.app.sidebar
    },
    classObj () {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened
      }
    }
  },
  methods: {
  }
}
</script>
<style scoped lang="less">
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .layout {
    position: relative;
    height: 100%;
    width: 100%;
    .mian_container {
      height: 100%;
      background-color: #F2F2F9;
      transition: margin-left .28s;
      margin-left: 180px;
      position: relative;
      .app_mian {
        margin-top: -90px;
        padding-top: 90px;
        height: 100%;
        box-sizing: border-box;
      }
    }
    .sidebar_container {
      transition: width 0.28s;
      width: 180px !important;
      height: 100%;
      position: fixed;
      font-size: 0px;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1001;
      overflow: hidden;
      //reset element-ui css
      .horizontal-collapse-transition {
        transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
      }
    }
  }
  .hideSidebar {
    .mian_container {
      margin-left: 60px;
    }
    .sidebar_container {
      width: 60px !important;
    }
  }
</style>
