<template>
  <div class="index clearfix" v-loading="loading"  element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading">
    <div class="top clearfix">
      <div class="fl box" v-for="(item, index) in themeList" :key="index">
        <div class="innerBox" @click="onJxTheme(item.checked,item.themeTitleTwo)">
          <p style="font-size: 16px;margin-bottom: 15px">{{item.themeTitleTwo}}</p>
          <span style="font-size: 12px;color: #7A7B7F;">总数据量</span>
          <p>
            <strong style="font-size: 24px">{{getNum(item.total)}}</strong>
            <strong>条</strong>
          </p>
          <p style="font-size: 12px;padding: 10px 0">
            <span>七日内更新</span>
            <i class="icon-top" style="color: #3CC480;"></i>
            <span class="">{{getNum(item.updateNum)}}条</span>
          </p>
        </div>
      </div>
      <el-dialog
        :title="checkedName"
        :visible.sync="themeDialog"
        top="25vh"
        :show-close="false"
        width="300px">
        <router-link style="text-decoration: none" class="item" v-for="(item, index) in cardThemeList" :key="index"
                     :to="'theme/'+item.themeTitleTwo+'?su='+item.themeTitleOne+'&themeTitleThree='+item.themeTitleThree">
          {{item.themeTitleThree}}
        </router-link>
      </el-dialog>
    </div>
    <div class="bottom clearfix">
      <div class="ztsq fl">
        <strong>主题书签</strong>
        <div class="ztsq_inner inner">
          <div class="card">
            <ul v-if="themeBookmark.total > 0">
              <li class="li" v-for="(item, index) in themeBookmark.data" :key="index">
                <img src="@/assets/icon/bookmark.png">
                <a style="text-decoration: none" @click="toRouterTheme(item.themeTitleTwo,item.themeTitleOne,item.id)">
                  <span class="book" style="white-space:pre">{{item.name}}</span>
                </a>
                <span class="fr cliTheme">
                      <span class="re img" @click="reBookNameDialog(item.name,item.id,'THEME')"></span>
                      <span class="de img" @click="deleteMark(item.id, 'THEME')"></span>
                </span>
              </li>
            </ul>
            <div v-else style="padding-top: 200px;text-align: center">
              <img style="width: 120px;" src="@/assets/icon/null_tag.png" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="qysq fl">
        <strong>企业书签</strong>
        <div class="qysq_inner inner">
          <div class="card" style="padding: 0 15px;">
            <el-tabs v-model="active_card" @tab-click="tabClick" class="111">
              <el-tab-pane label="企业信息书签" name="COMPANY_INFO">
                <ul v-if="comInfoBookmark.total">
                  <li class="li" v-for="(item, index) in comInfoBookmark.data" :key="index" style="padding: 10px 0;">
                    <img src="@/assets/icon/bookmark.png">
                    <router-link style="text-decoration: none" :to="'company/t_table/'+item.id">
                      <span class="book" style="white-space:pre">{{item.name}}</span>
                    </router-link>
                    <span class="fr cliTheme">
                      <span class="re img" @click="reBookNameDialog(item.name,item.id,'COMPANY_INFO')"></span>
                      <span class="de img" @click="deleteMark(item.id, 'COMPANY_INFO')"></span>
                    </span>
                  </li>
                </ul>
                <div v-else style="margin: 150px auto; text-align: center">
                  <img style="width: 120px;" src="@/assets/icon/null_tag.png" alt="">
                </div>
              </el-tab-pane>
              <el-tab-pane label="企业主题书签" name="COMPANY_THEME">
                <ul v-if="comThemeBookmark.total">
                  <li class="li" v-for="(item, index) in comThemeBookmark.data" :key="index" style="padding: 10px 0;">
                    <img src="@/assets/icon/bookmark.png">
                    <router-link style="text-decoration: none" :to="'/company/companyInfo/'  + item.themeName + '/' +item.companyId + '?sqId=' + item.id">
                      <span class="book" style="white-space:pre">{{item.name}}</span>
                    </router-link>
                    <span class="fr cliTheme">
                      <span  class="re img"  @click="reBookNameDialog(item.name,item.id,'COMPANY_THEME')"></span>
                      <span  class="de img"  @click="deleteMark(item.id, 'COMPANY_THEME')"></span>
                    </span>
                  </li>
                </ul>
                <div v-else style="margin: 150px auto; text-align: center">
                  <img style="width: 120px;" src="@/assets/icon/null_tag.png" alt="">
                </div>
              </el-tab-pane>
              <el-tab-pane label="关注企业" name="COMPANY_COL">
                <ul v-if="colComBookmark.total">
                  <li class="li" v-for="(item, index) in colComBookmark.data" :key="index" style="padding: 10px 0;">
                    <img src="@/assets/icon/com_save.png">
                    <router-link style="text-decoration: none" :to="'/company/companyInfo/'  + 'id/' +item.companyId">
                      <span class="book" style="white-space:pre">{{item.companyName}}</span>
                    </router-link>
                    <span class="fr">
                      <img @click="deleteMark(item.companyId, 'COMPANY_COL')" src="@/assets/icon/collect_active.png" alt="">
                    </span>
                  </li>
                </ul>
                <div v-else style="margin: 150px auto; text-align: center">
                  <img style="width: 120px;" src="@/assets/icon/null_tag.png" alt="">
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <el-dialog
        title="提醒"
        :visible.sync="deleteDialog"
        width="30%">
        <span style="padding: 10px 20px;">{{textTip}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="deleteDialog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="ensureDelete">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="修改标题"
        :visible.sync="reDialog"
        :before-close="handleClose"
        width="30%">
        <div class="reName">
          <el-input placeholder="自定义标题" v-model="reNameValue" clearable></el-input>
          <div v-if="reMsgDialog" style="width: 85%;text-align: left;margin: 10px auto;">
            <i style="color: #F33232;" class="el-icon-info"></i>
            <span style="font-size: 13px;padding-left: 6px">{{reMsg}}</span>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="reDialog = false">取 消</el-button>
          <el-button size="small" type="primary" @click="ensureReName">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog class="checkDialog"
        :visible.sync="checkMsg"
        :show-close = false
        width="300px">
        <div class="reName">
          {{tipMsg}}
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getJxTheme, getJxThreeTheme, getBookMark, deleteM, getColCom, deleteC, checkBookName, reBookName, checkBook } from '@/utils/api'
import { mapGetters } from 'vuex'
import Bus from '@/plugins/eventBus'
var that, interArea
export default {
  name: 'index',
  data () {
    return {
      tipMsg: '',
      checkMsg: false,
      loading: false,
      textTip: '确定要删除该保存书签？',
      themeList: [],
      type: '',
      active_card: 'COMPANY_INFO',
      checkedName: '', // 选中主题名字
      cardThemeList: [], // 三级主题列表
      themeDialog: false,
      deleteDialog: false,
      deleteId: '', // 删除id
      deleteType: '',
      reDialog: false,
      reMsgDialog: false,
      reMsg: '标题重复，请重新输入',
      reType: '',
      reNameValue: '',
      themeBookmark: {},
      comInfoBookmark: {},
      comThemeBookmark: {},
      colComBookmark: {}
    }
  },
  computed: {
    ...mapGetters([
      'info'
    ])
  },
  mounted () {
    that = this
    Bus.$off('reArea_reTheme')
    Bus.$on('reArea_reTheme', function () {
      that.fetchData()
    })
    // 初始化精选主题数据
    interArea = setInterval(function () {
      if (that.info.globalRegion) {
        that.fetchData()
      }
    }, 500)
    this.loading = true
    // 主题书签列表
    this.getBook('THEME')
    // 企业信息书签列表
    this.getBook('COMPANY_INFO')
  },
  watch: {
    reNameValue (val, oldVal) {
      if (val.trim()) {
        this.isExistName(val.trim())
      }
    }
  },
  methods: {
    // 主题跳转
    toRouterTheme (two, one, id) {
      checkBook({
        bookmarkId: id
      }).then(response => {
        if (response.code === 200) {
          this.$router.push({
            path: '/theme/' + two,
            query: {
              su: one,
              id: id
            }
          })
        } else {
          this.checkMsg = true
          this.tipMsg = response.msg
        }
      })
    },
    // 数字格式化
    getNum (val) {
      val = val + ''
      return val.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
    },
    // 初始化精选主题数据
    fetchData () {
      clearInterval(interArea)
      getJxTheme({
        globalProvince: this.info.globalRegion.globalProvince.value,
        globalCity: this.info.globalRegion.globalCity.value,
        globalArea: this.info.globalRegion.globalArea.value
      }).then(response => {
        if (response.code === 200) {
          this.themeList = response.data
        }
        this.loading = false
      })
    },
    // 点击精选主题
    onJxTheme (val, name) {
      if (val) {
        getJxThreeTheme({ themeTitleTwo: name }).then(response => {
          if (response.code === 200) {
            this.cardThemeList = response.data
            this.checkedName = name
            this.themeDialog = true
          }
        })
      }
    },
    // 获取书签
    getBook (value) {
      getBookMark({
        bookmarkType: value,
        pageNum: 1,
        pageSize: 10
      }).then(response => {
        if (response.code === 200) {
          switch (value) {
            case 'THEME':
              this.themeBookmark = response.data
              break
            case 'COMPANY_INFO':
              this.comInfoBookmark = response.data
              break
            case 'COMPANY_THEME':
              this.comThemeBookmark = response.data
              break
            default:
          }
        }
      })
    },
    // 删除书签
    deleteMark (id, type) {
      this.type = type
      if (type === 'COMPANY_COL') {
        this.textTip = '确认要取消收藏该公司？'
      } else {
        this.textTip = '确定要删除该保存书签？'
      }
      this.deleteId = id
      this.deleteType = type
      this.deleteDialog = true
    },
    // 修改书签名称弹窗
    reBookNameDialog (name, id, type) {
      this.reNameValue = name
      this.reDialog = true
      this.reType = type
      this.reId = id
    },
    // 判断书签名称是否存在
    isExistName (valName) {
      checkBookName({
        bookmarkType: this.reType,
        bookmarkName: valName
      }).then(response => {
        if (response.code === 200) {
          this.reMsgDialog = false
        } else {
          this.reMsg = response.msg
          this.reMsgDialog = true
        }
      })
    },
    // 确定修改书签名称
    ensureReName () {
      if (this.reNameValue.trim()) {
        reBookName({
          bookmarkId: this.reId,
          bookmarkType: this.reType,
          bookmarkName: this.reNameValue.trim()
        }).then(response => {
          if (response.code === 200) {
            this.getBook(this.reType)
            this.reMsgDialog = false
            this.reDialog = false
            this.reNameValue = ''
          }
        })
      }
    },
    // 确定删除
    ensureDelete () {
      if (this.type === 'COMPANY_COL') {
        deleteC(this.deleteId).then(response => {
          if (response.code === 200) {
            // 获取关注企业
            getColCom({
              pageNum: 1,
              pageSize: 10
            }).then(response => {
              if (response.code === 200) {
                this.colComBookmark = response.data
              }
            })
          }
          this.deleteDialog = false
        })
      } else {
        deleteM(this.deleteId).then(response => {
          if (response.code === 200) {
            this.getBook(this.deleteType)
          }
          this.deleteDialog = false
        })
      }
    },
    // 企业相关书签tab切换
    tabClick (val) {
      if (val.name === 'COMPANY_COL') {
        // 获取关注企业
        getColCom({
          pageNum: 1,
          pageSize: 10
        }).then(response => {
          if (response.code === 200) {
            this.colComBookmark = response.data
          }
        })
      } else {
        this.getBook(val.name)
      }
    },
    // 弹窗关闭前的回调
    handleClose () {
      this.reMsgDialog = false
      this.reDialog = false
      this.reNameValue = ''
    }
  }
}
</script>

<style scoped lang="less">
  .index {
    height: 100%;
    position: relative;
    box-sizing: border-box;
    padding: 20px 20px 20px 0;
    .bottom {
      height: 100%;
      margin-top: -140px;
      padding-top: 140px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
    .box {
      position: relative;
      display: inline-block;
      padding-left: 18px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      width: 25%;
      /*height: 15vh;*/
      background-color: #F2F2F9;
      .innerBox {
        cursor: pointer;
        width: 100%;
        height: 100%;
        color: #54585E;
        padding: 10px 20px;
        box-sizing: border-box;
        border-radius: 6px;
        background-color: #fff;
        .icon-top {
          display: inline-block;
          width: 10px;
          height: 16px;
          background-repeat: no-repeat;
          background-size: contain;
          vertical-align: middle;
          background-image: url("../../assets/icon/data_up.png");
        }
      }
      .innerBox:hover {
        background-color: #FAFBFF;
      }
    }
    .ztsq, .qysq {
      height: 100%;
      padding-left: 20px;
      padding-top: 20px;
      width: 50%;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      strong {
        font-size: 16px;
      }
      .inner {
        width: 100%;
        height: 100%;
        margin-top: -20px;
        padding-top: 25px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        .card {
          height: 100%;
          border-radius: 6px;
          background-color: #fff;
          .li {
            padding: 10px 15px;
            cursor: pointer;
            font-size: 14px;
            color: #55585E;
            .book {
              color: #55585E;
            }
            img {
              cursor: pointer;
              vertical-align: middle;
              height: 15px;
              margin: 0 8px;
            }
            .cliTheme {
              .img {
                display: inline-block;
                margin: 0 5px;
                width: 16px;
                height: 16px;
                background-size: contain;
                background-repeat: no-repeat;
                vertical-align: middle;
              }
              .re {
                background-image: url("../../assets/icon/edit.png");
              }
              .re:hover {
                background-image: url("../../assets/icon/edit_active.png");
              }
              .de {
                background-image: url("../../assets/icon/delete.png");
              }
              .de:hover {
                background-image: url("../../assets/icon/delete_active.png");
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="less">
  p {
    margin: 0 !important;
  }
  .index {
    .el-tabs .is-active {
      color: #4378FF;
    }

    .el-tabs .el-tabs__active-bar {
      background-color: #4378FF;
    }

    .el-tabs .el-tabs__header {
      margin-bottom: 10px;
    }
    .el-dialog {
      box-shadow:0px 2px 6px 0px rgba(43,50,69,0.38);
      border-radius:6px;
      .el-dialog__title {
        font-size: 16px;
        font-weight: bold;
        color: #55585E;
      }
      .el-dialog__header {
        padding: 20px 30px 0px;
      }
      .el-dialog__body {
        padding: 10px 0;
        .reName  {
          margin: 10px 0;
          text-align: center;
          .el-input {
            margin: 0 auto;
            width: 85%;
            .el-input__inner {
              border-radius: 0;
              border: none;
              border-bottom: 1px solid #E9E9E9;
            }
          }
        }
        .item {
          text-align: center;
          display: inline-block;
          width: 30%;
          text-decoration: none;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 14px;
          color: #55585E;
        }
      }
    }
    .checkDialog .el-dialog__header {
      padding: 0 !important;
    }
  }
  .v-modal {
    opacity: .2;
  }
</style>
