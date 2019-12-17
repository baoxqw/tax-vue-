<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <!-- <img v-if="isCollapse" style="height: 26px;margin: 15px 18px" src="@/assets/logo/logo_small.png" alt="">
    <img v-else style="height: 32px;margin: 15px 12px" src="@/assets/logo/logo.png" alt=""> -->
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :default-openeds="subMenu"
      :collapse="isCollapse"
      unique-opened
      background-color="#2A3144"
      text-color="#fff"
      active-text-color="#4378FF"
    >
      <router-link to="/" style="color: inherit;text-decoration: none;display:block;">
        <el-menu-item index="/">
          <i class="icon index"></i>
          <span slot="title">首页</span>
        </el-menu-item>
      </router-link>
      <el-submenu :index="items.themeTitleOne" v-for="(items,index) in menuTree" :key="index">
        <template slot="title">
          <i class="icon" :class=" 'index' + index"></i>
          <span>{{items.themeTitleOne}}</span>
        </template>
        <router-link :to=" '/theme/' + item.trim() + '?su=' + items.themeTitleOne"
                     style="color: inherit;text-decoration: none;display:block;"
                     v-for="(item,index) in items.themeTitleTwo" :key="index">
          <el-menu-item :index="item">
            {{item}}
          </el-menu-item>
        </router-link>
      </el-submenu>
      <router-link to="/company/t_table/sidebar" style="color: inherit;text-decoration: none;display:block;">
        <el-menu-item index="/company/t_table">
          <i class="icon company"></i>
          <span slot="title">企业信息</span>
        </el-menu-item>
      </router-link>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMenu } from '@/utils/api'

export default {
  name: 'Sidebar',
  data () {
    return {
      menuTree: [],
      subMenu: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  created () {
    if (this.$route.query.su) {
      this.subMenu[0] = this.$route.query.su
    }
    this.fetchData()
  },
  methods: {
    fetchData () {
      getMenu().then(response => {
        if (response.code === 200) {
          this.menuTree = response.data
        }
      })
    }
  }
}
</script>

<style lang="less">
  .scrollbar-wrapper {
    height: calc(100% + 15px);
    .el-scrollbar__view {
      background-color: #2A3144;
      height: 100%;
    }
    .el-menu {
      border: none;
      width: 100% !important;
      .icon {
        width: 20px;
        height: 15px;
        margin-right: 10px;
        vertical-align: middle;
        display: inline-block;
        background-repeat: no-repeat;
        background-size: contain;
      }
      .index {
        background-image: url("../../../assets/icon/home.png");
      }
      .index0 {
        background-image: url("../../../assets/icon/text.png");
      }
      .index1 {
        background-image: url("../../../assets/icon/eye.png");
      }
      .index2 {
        background-image: url("../../../assets/icon/area.png");
      }
      .index3 {
        background-image: url("../../../assets/icon/database.png");
      }
      .company {
        background-image: url("../../../assets/icon/company.png");
      }
      .is-opened {
        .index0 {
          background-image: url("../../../assets/icon/text_active.png");
        }
        .index1 {
          background-image: url("../../../assets/icon/eye_active.png");
        }
        .index2 {
          background-image: url("../../../assets/icon/area_active.png");
        }
        .index3 {
          background-image: url("../../../assets/icon/database_active.png");
        }
      }
      .router-link-exact-active {
        .index {
          background-image: url("../../../assets/icon/home_active.png");
        }
        .company {
          background-image: url("../../../assets/icon/company_active.png");
        }
      }
      .el-menu-item {
        padding: 0;
      }
      .el-submenu .router-link-active {
        .el-menu-item {
          padding: 0;
          color: #4378FF !important;
        }
      }
      .router-link-exact-active {
        .el-menu-item {
          span {
            color: #4378FF !important;
          }
        }
      }
    }
  }

  .is-horizontal {
    display: none;
  }

  .el-menu {
    border: none;
    width: 100% !important;
  }
</style>
