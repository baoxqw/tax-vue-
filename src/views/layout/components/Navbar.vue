<template>
  <div class="navber">
    <el-menu class="navbar" mode="horizontal">
      <hamburger class="hamburger-container" @toggleClick="toggleSideBar" :isActive="!sidebar.opened"></hamburger>
      <div class="navbar_item">
        <span class="area item" @click="dialogVisible = true">
          <i class="icon location"></i>
          <span v-if="provinceName">{{provinceName}}</span>
          <span v-if="cityName && cityName !== '县' && cityName !== '市辖区'">/{{cityName}}</span>
          <span v-if="countyName">/{{countyName}}</span>
        </span>
        <span class="readme item">
          <i class="icon question"></i>
          说明文档
        </span>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link user item">
            <i class="icon custom"></i>
            {{info.userName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="changeUser">修改个人信息</el-dropdown-item>
            <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logOut">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <!-- 修改用户信息 -->
    <el-dialog
      title="修改个人信息"
      :visible.sync="userDialog"
      :before-close="closeUser"
      top="30vh"
      width="300px">
      <div class="userInfo">
        <div class="item">
          用户名：
          <el-input
            placeholder="请输入内容"
            size="small"
            v-model="info.userName"
            :disabled="true">
          </el-input>
        </div>
        <div class="item">
          用户组：
          <el-input
            placeholder="请输入内容"
            size="small"
            v-model="info.userGroup"
            :disabled="true">
          </el-input>
        </div>
        <div class="item">
          电话：
          <el-input
            placeholder="请输入内容"
            size="small"
            @focus="error_msg=null"
            v-model="info.phone">
          </el-input>
        </div>
        <div class="item">
          邮箱：
          <el-input
            placeholder="请输入内容"
            size="small"
            @focus="error_msg=null"
            v-model="info.email">
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closeUser">取消</el-button>
        <el-button size="small" type="primary" @click="changeUserInfo">确定</el-button>
      </span>
      <span class="err_msg" style="font-size: 10px;position: relative;left: 70px;top: -20px;">
          <i v-if="error_msg" class="el-icon-info" style="color: #F33232;"></i>
          {{error_msg}}
        </span>
    </el-dialog>

    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="passDialog"
      top="30vh"
      :before-close="closePassword"
      width="300px">
      <div class="userInfo">
        <div class="item">
          原密码：
          <el-input
            show-password
            @focus="msg_=null"
            placeholder="请输入内容"
            size="small"
            v-model="oldPassword">
          </el-input>
        </div>
        <div class="item">
          新密码：
          <el-input
            show-password
            @focus="msg_=null"
            placeholder="请输入内容"
            size="small"
            v-model="password">
          </el-input>
        </div>
        <div class="item">
          确认密码：
          <el-input
            show-password
            @focus="msg_=null"
            placeholder="请输入内容"
            size="small"
            v-model="rePassword">
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="closePassword">取 消</el-button>
        <el-button size="small" type="primary" @click="changePass">确 定</el-button>
      </span>
      <span class="msg_" style="font-size: 10px;position: relative;left: 70px;top: -20px;">
          <i v-if="msg_" class="el-icon-info" style="color: #F33232;"></i>
          {{msg_}}
        </span>
    </el-dialog>

    <!-- 选择区域 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :before-close="closeArea"
      width="800px"
      top="28vh"
      custom-class="dialogArea"
    >
      <div class="dialogBox">
        <span>区域选择 &nbsp; &nbsp;</span>
        <span>省份：
          <el-select v-model="provinceName"
                     size="small"
                     @focus="onFocus('province')"
                     placeholder="选择省份">
              <el-option
                v-for="item in provinceOptions"
                :key="item.id"
                :label="item.name"
                @click.native="onSelect(item, 'province')"
                :value="item.id">
              </el-option>
          </el-select>
        </span>&nbsp;
        <span>城市：
          <el-select v-model="cityName"
                     size="small"
                     @focus="onFocus('city')"
                     placeholder="选择市">
              <el-option
                v-for="item in cityOptions"
                :key="item.id"
                :label="item.name"
                @click.native="onSelect(item, 'city')"
                :value="item.id">
              </el-option>
          </el-select>
        </span>&nbsp;
        <span>区/县：
          <el-select v-model="countyName"
                     size="small"
                     @focus="onFocus('county')"
                     placeholder="选择区县">
              <el-option
                v-for="item in countyOptions"
                :key="item.id"
                :label="item.name"
                @click.native="onSelect(item, 'county')"
                :value="item.id">
              </el-option>
          </el-select>
        </span>
        <el-button type="primary" @click="reUserArea">确定</el-button>
        <p style="position: absolute;
    color: #55585E;
    left: 50%;
    font-size: 10px;
    top: -20px;
    margin-left: -40px !important;" v-if="isAreaMsg">
          <i style="color: red;" class="el-icon-info"></i>
          {{reAreaMsg}}
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Hamburger from '@/components/Hamburger' // 侧边菜单切换按钮
import { selectArea, reArea, changePass } from '@/utils/api'
import { mapGetters } from 'vuex'
import Bus from '@/plugins/eventBus'
import md5 from 'js-md5'
var that, interArea
export default {
  components: {
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'info'
    ])
  },
  data () {
    return {
      dialogVisible: false,
      error_msg: null,
      msg_: null,
      userDialog: false, // 修改个人信息弹窗
      passDialog: false, // 修改密码

      oldPassword: '', // 原密码
      password: '', // 新密码
      rePassword: '', // 确认密码

      provinceName: null,
      provinceId: '',
      // province: '陕西',
      provinceOptions: [],

      cityName: null,
      cityId: '',
      // city: null,
      cityOptions: [],

      countyName: null,
      countyId: '',
      // county: null,
      countyOptions: [],
      reAreaMsg: '',
      isAreaMsg: false
    }
  },
  mounted () {
    that = this
    if (that.info.globalRegion) {
      that.getInfoArea()
    } else {
      interArea = setInterval(function () {
        that.getInfoArea()
      }, 1000)
    }
    // 用户点击书签主题后更新用户区域
    Bus.$off('reArea_bookMark')
    Bus.$on('reArea_bookMark', function () {
      console.log('更新吧')
      that.provinceName = that.info.globalRegion.globalProvince.name
      that.provinceId = that.info.globalRegion.globalProvince.value
      that.cityName = that.info.globalRegion.globalCity.name
      that.cityId = that.info.globalRegion.globalCity.value
      that.countyName = that.info.globalRegion.globalArea.name
      that.countyId = that.info.globalRegion.globalArea.valoue
    })
  },
  methods: {
    //  切换收起侧边菜单
    toggleSideBar () {
      this.$store.dispatch('ToggleSideBar')
      Bus.$emit('initThemeTable')
    },
    // 下拉选择获取焦点
    onFocus (val) {
      if (val === 'province') {
        selectArea({
          type: 1
        }).then(response => {
          if (response.code === 200) {
            this.provinceOptions = response.data
          }
        })
      } else if (val === 'city') {
        selectArea({
          id: this.provinceId,
          type: 2
        }).then(response => {
          if (response.code === 200) {
            this.cityOptions = response.data
          }
        })
      } else if (val === 'county') {
        selectArea({
          id: this.cityId,
          type: 3
        }).then(response => {
          if (response.code === 200) {
            this.countyOptions = response.data
          }
        })
      }
    },
    // 选择后触发方法
    onSelect (val, type) {
      if (type === 'province') {
        this.provinceName = val.name
        this.provinceId = val.id
        this.cityName = null
        this.cityId = null
        this.countyName = null
        this.countyId = null
      } else if (type === 'city') {
        this.cityName = val.name
        this.cityId = val.id
        this.countyName = null
        this.countyId = null
      } else if (type === 'county') {
        this.countyName = val.name
        this.countyId = val.id
      }
    },
    // 更新用户区域
    reUserArea () {
      reArea({
        globalProvince: {
          name: this.provinceName,
          value: this.provinceId
        },
        globalCity: {
          name: this.cityName,
          value: this.cityId
        },
        globalArea: {
          name: this.countyName,
          value: this.countyId
        }
      }).then(response => {
        if (response.code === 200) {
          this.$store.dispatch('GetInfo').then(() => {
            this.dialogVisible = false
            Bus.$emit('reArea_reTheme')
          })
        } else {
          this.reAreaMsg = response.msg
          this.isAreaMsg = true
          let that = this
          setTimeout(function () {
            that.reAreaMsg = ''
            that.isAreaMsg = false
          }, 1000)
        }
      })
    },
    // 点击个人中心菜单
    handleCommand (command) {
      if (command === 'logOut') {
        this.$store.dispatch('LogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      } else if (command === 'changeUser') {
        this.userDialog = true
      } else if (command === 'changePassword') {
        this.passDialog = true
      }
    },
    // 修改个人信息
    changeUserInfo () {
      if (this.info.phone && this.info.email) {
        if (!(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(this.info.phone))) {
          this.error_msg = '手机号格式不正确'
        } else {
          if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.info.email))) {
            console.log(2)
            this.error_msg = '邮箱格式不正确'
          } else {
            this.$store.dispatch('changeUserInfo').then(() => {
              this.userDialog = false
            })
          }
        }
      } else {
        this.error_msg = '手机号或邮箱不能为空'
      }
    },
    // 修改密码
    changePass () {
      if (this.oldPassword && this.password && this.rePassword) {
        if (this.password === this.rePassword) {
          const data = {
            oldPwd: md5(this.oldPassword + 'tax'),
            newPwd: md5(this.password + 'tax')
          }
          changePass(data).then((response) => {
            if (response.code === 200) {
              this.$store.dispatch('LogOut').then(() => {
                location.reload() // 为了重新实例化vue-router对象 避免bug
              })
            } else {
              this.msg_ = response.msg
            }
          })
            .catch(() => {
            })
        } else {
          this.msg_ = '密码不一致'
        }
      } else {
        this.msg_ = '密码不能为空'
      }
    },
    // 关闭个人中心前的回调
    closeUser () {
      this.$store.dispatch('GetInfo').then(() => {
        this.userDialog = false
        this.error_msg = null
      })
    },
    // 关闭修改密码回调
    closePassword () {
      this.msg_ = null
      this.oldPassword = ''
      this.password = ''
      this.rePassword = ''
      this.passDialog = false
    },
    // 关闭选择区域回调
    closeArea () {
      this.provinceName = this.info.globalRegion.globalProvince.name
      this.provinceId = this.info.globalRegion.globalProvince.value
      this.cityName = this.info.globalRegion.globalCity.name
      this.cityId = this.info.globalRegion.globalCity.value
      this.countyName = this.info.globalRegion.globalArea.name
      this.countyId = this.info.globalRegion.globalArea.valoue
      this.dialogVisible = false
    },
    // 获取地区
    getInfoArea () {
      if (that.provinceName) {
        clearInterval(interArea)
      } else {
        that.provinceName = that.info.globalRegion.globalProvince.name
        that.provinceId = that.info.globalRegion.globalProvince.value
        that.cityName = that.info.globalRegion.globalCity.name
        that.cityId = that.info.globalRegion.globalCity.value
        that.countyName = that.info.globalRegion.globalArea.name
        that.countyId = that.info.globalRegion.globalArea.valoue
      }
    }
  }
}
</script>

<style scoped lang="less">
  .navbar {
    padding: 0 !important;
    height: 50px;
    line-height: 50px;
    border: none;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.04);
    .navbar_item {
      vertical-align: top;
      position: absolute;
      right: 0;
      display: inline-block;
      .item {
        display: inline-block;
        cursor: pointer;
        color: #6F7175;
        line-height: 50px;
        font-size: 14px;
        padding: 0 16px;
        .icon {
          display: inline-block;
          width: 20px;
          height: 20px;
          background-repeat: no-repeat;
          background-size: contain;
          vertical-align: middle;
        }
        .location {
          background-image: url("../../../assets/icon/location.png");
        }
        .question {
          background-image: url("../../../assets/icon/circled-help.png");
        }
        .custom {
          background-image: url("../../../assets/icon/user.png");
        }
      }
    }
  }
</style>
<style lang="less">
  .navber {
    /*padding-left: 10px;*/
    .dialogArea {
      border-radius: 4px;
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0 10px;
        color: #55585E;
        font-size: 15px;
        .dialogBox {
          .el-button {
            position: absolute;
            right: 0;
            vertical-align: bottom;
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
            padding: 0 20px;
            height: 55px;
            line-height: 55px;
          }
          span {
            display: inline-block;
            line-height: 55px;
            height: 55px;
            .el-select {
              width: 150px;
            }
          }
        }
      }
    }
    .userInfo {
      .item {
        margin-bottom: 20px;
        text-align: right;
        .el-input {
          width: 186px;
        }
      }
    }
  }

  .el-scrollbar {
    ul {
      overflow: hidden;
      width: 120px;
      padding: 0;
      .el-select-dropdown__item {
        float: left;
      }
    }
  }

  .el-dropdown-menu {
    text-align: center;
  }
</style>
