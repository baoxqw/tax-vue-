<template>
  <div class="theme" v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading">
    <div id="toolbar">
      <el-tabs v-model="queryData.themeTitleThree" @tab-click="handleClick">
        <el-tab-pane :label="item" :name="item" v-for="(item,index) in threeThemeList" :key="index">
        </el-tab-pane>
      </el-tabs>
      <div class="qyst">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link qyst_buttom">
            区域视图<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="queryData.regionViewVos" @change='tableDataAjax'>
              <el-checkbox :label="item.name" v-for="(item,index) in areaViewList" :key="index">
              </el-checkbox>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="filter_item">
        <span class="f_item item">{{queryData.themeTitleThree}}</span>
        <span style="display: inline-block;" v-for="(item, index) in filterToolBarList" :key="index">
              <i class="el-icon-plus"></i>
              <span class="item">
                {{item.name}}：{{item.value}}
              <i @click="removeFilter(item.type, item.name)" class="el-icon-circle-close icon"></i>
              </span>
            </span>
      </div>
      <div class="fu_view fr">
          <span style="color: #4378FF;font-size: 14px" class="view" @click="reDialog = true">
            <img style="width: 18px;vertical-align: text-top;" src="@/assets/icon/save.png" title="统计视图" alt="">
            保存
          </span>
        <span class="view" @click="getViewFc">
            <img style="width: 18px;vertical-align: text-top;" src="@/assets/icon/bar-graph.png" title="统计视图" alt="">
          </span>
        <span v-if="info.downLimitCount > 0" class="view" @click="getDownExcel">
            <img style="width: 18px;vertical-align: text-top;" src="@/assets/icon/download.png" title="点击下载" alt="">
          </span>
        <span v-else class="view" @click="isDown = true">
            <img style="width: 18px;vertical-align: text-top;" src="@/assets/icon/ban_download.png" title="点击下载" alt="">
          </span>
      </div>
    </div>
    <table id="table_art" class="bootstrapTable" :data-height="tb_height" data-toolbar="#toolbar"
           data-show-columns="true"
           data-toggle="table">
    </table>
    <!-- 分页内容 -->
    <el-pagination v-if="themeList.total > 0"
                   @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"
                   :current-page="queryData.pageNum"
                   :page-sizes="[20, 30, 40, 50]"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="themeList.total">
    </el-pagination>

    <!-- 统计卡片内容 -->
    <el-dialog class="dialog_view"
               title="统计结果"
               :visible.sync="cardVisible"
               top="0"
               width="420px">
      <div class="statisticsView" v-loading="card_loading">
        <p class="p">
          <span class="bold">条目总数</span>
          <span>{{statisticsData.num}}</span>
        </p>
        <div class="number" style="padding: 20px 0"
             v-if="statisticsData.priceMax || statisticsData.priceMin || statisticsData.priceAvg || statisticsData.priceSum">
          <strong class="title">金额统计</strong>
          <p class="p">
            <span>最大值：{{statisticsData.priceMax}}</span>
            <span>最小值：{{statisticsData.priceMin}}</span>
          </p>
          <p class="p">
            <span>平均值：{{statisticsData.priceAvg}}</span>
            <span>总值：{{statisticsData.priceSum}}</span>
          </p>
        </div>
        <div class="date" style="padding: 20px 0" v-if="statisticsData.dateStart || statisticsData.dateEnd">
          <strong class="title">日期区间</strong>
          <p class="p">
            <span>最早日期：{{statisticsData.dateStart}}</span>
            <span>最晚日期：{{statisticsData.dateEnd}}</span>
          </p>
        </div>
        <div class="sum_top" v-if="statisticsData.priceTop">
          <strong class="title">金额top公司排名</strong>
          <ul style="margin-bottom: 1rem">
            <li class="item" v-for="(item, index) in statisticsData.priceTop" :key="index">
              <router-link v-if="item.value" :to=" '/company/companyInfo/' + 'name/' + item.value">
                {{item.name}}
              </router-link>
              <span v-else>{{item.name}}</span>
            </li>
          </ul>
        </div>
        <div class="sj_top" v-if="statisticsData.eventTop">
          <strong class="title">事件top排名</strong>
          <ul style="margin-bottom: 1rem">
            <li class="item" v-for="(item, index) in statisticsData.eventTop" :key="index">
              <router-link v-if="item.value" :to=" '/company/companyInfo/' + 'name/' + item.value">
                {{item.name}}
              </router-link>
              <span v-else>{{item.name}}</span>
            </li>
          </ul>
        </div>
      </div>
    </el-dialog>

    <!-- 筛选字符的弹窗 -->
    <el-dialog class="dialog_filter"
               :title="filterTitle"
               :visible.sync="filterString"
               :before-close="filterClose"
               top="30vh"
               width="350px">
      <div class="string">
       <div style="display: block">
          <el-radio class="des" v-model="stringRadio" label="ASC">升序</el-radio>
          <el-radio class="ase" v-model="stringRadio" label="DESC">降序</el-radio>
       </div>
        <el-select size="small" v-model="strSelect" placeholder="请选择">
          <el-option key="0" label="包含" value="0"></el-option>
          <el-option key="1" label="不包含" value="1"></el-option>
        </el-select>
        <el-input class="input_" size="small" v-model="strValue" placeholder="请输入内容"></el-input>
      </div>
      <ul style="padding: 1rem 0 0;max-height:300px;overflow:auto"  v-loading="item_loading">
        <li v-for="(item,index) in groundItemData" :key="index">
          <span v-if="item.count" @click="clickFilterGround(item._id)"
          style="color:#007bff;cursor: pointer;display:inline-block;width:220px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
            {{item._id}}
          </span>
          <span v-else style="color:#606266;font-weight:bold;display:inline-block;width:220px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
            {{item._id}}
          </span>
          <span v-if="item.count" style="vertical-align: super;width:60px;display:inline-block;text-align:center">({{item.count}})</span>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="filterClose">取消</el-button>
          <el-button size="small" type="primary" @click="clickFilter('string')">确定</el-button>
        </span>
    </el-dialog>
    <!-- 筛选数字的弹窗 -->
    <el-dialog class="dialog_filter"
               :title="filterTitle"
               :visible.sync="filterNumber"
               :before-close="filterClose"
               top="30vh"
               width="300px">
      <div class="num">
        <el-radio class="des" v-model="numberRadio" label="ASC">升序</el-radio>
        <el-radio class="ase" v-model="numberRadio" label="DESC">降序</el-radio>
        <div class="num">
          <el-input size="small" v-model="startNum"
                    placeholder="请输入内容">
            <i class="yu" slot="suffix"></i>
          </el-input>
          至
          <el-input size="small" v-model="endNum"
                    placeholder="请输入内容">
            <i class="yu" slot="suffix"></i>
          </el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="filterClose">取消</el-button>
          <el-button size="small" type="primary" @click="clickFilter('num')">确定</el-button>
        </span>
    </el-dialog>
    <!-- 筛选日期的弹窗 -->
    <el-dialog class="dialog_filter"
               :title="filterTitle"
               :visible.sync="filterDate"
               :before-close="filterClose"
               top="30vh"
               width="320px">
      <div class="date">
        <el-radio class="des" v-model="dateRadio" label="ASC">升序</el-radio>
        <el-radio class="ase" v-model="dateRadio" label="DESC">降序</el-radio>
        <el-date-picker class="date_picker"
                        v-model="dateValue1"
                        type="date"
                        size="small"
                        value-format="yyyy-MM-dd"
                        placeholder="开始日期">
        </el-date-picker>
        <span>至</span>
        <el-date-picker class="date_picker"
                        v-model="dateValue2"
                        type="date"
                        value-format="yyyy-MM-dd"
                        size="small"
                        placeholder="结束日期">
        </el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="filterClose">取消</el-button>
          <el-button size="small" type="primary" @click="clickFilter('date')">确定</el-button>
        </span>
    </el-dialog>
    <!-- 保存标题 -->
    <el-dialog class="dialog_title"
               title="添加标题"
               :visible.sync="reDialog"
               :before-close="handleClose"
               width="23%">
      <div class="reName">
        <el-input placeholder="请输入标题，最多可输入20个字符" v-model="titleName" clearable></el-input>
        <div v-if="reMsgDialog" style="width: 85%;text-align: left;margin: 10px auto;">
          <i style="color: #F33232;" class="el-icon-info"></i>
          <span style="font-size: 13px;padding-left: 6px">{{reMsg}}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleClose">取 消</el-button>
          <el-button size="small" type="primary" @click="saveBookmark">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 下载权限提示 -->
    <el-dialog class="dowm"
               title="提示"
               :show-close="false"
               :visible.sync="isDown"
               width="140px"
               center>
      <span>您暂无下载权限</span>
    </el-dialog>
    <!-- 点击行显示详情 -->
    <el-dialog class="dialog_row"
               :visible.sync="rowDialog"
               center
               top="15vh"
               width="40%">
      <ul class="row">
        <li class="li" v-for="(value, key, index) in rowDataList" :key="index">
          <span v-if="key !== '快照'" class="keys">{{key}}：</span>
          <span v-if="key !== '快照'" class="values">{{value}}</span>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable eqeqeq */
import {
  getThemedata, getThemeStatistics, getMaxMin,
  getSubThreeName, getThemeQueryParams, checkBookName,
  saveThemeBookMark, getAreaViewList, getStatistics
} from '@/utils/api'
import { getToken } from '@/utils/auth'
import $ from 'jquery'
import { mapGetters } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap-table/dist/bootstrap-table.min.css'
import 'bootstrap-table/dist/bootstrap-table.min'
import 'bootstrap-table/dist/locale/bootstrap-table-zh-CN.min'
import Bus from '@/plugins/eventBus'

var that
export default {
  name: 'theme',
  data () {
    return {
      loading: false,
      isDown: false,
      areaViewList: [],
      tb_height: $(document).height() - 140, // 表格高度
      bookmarkId: null, // 书签名称
      threeThemeList: [], // 三级主题列表
      twoThemeName: '',
      oneThemeName: '',
      statisticsData: {},
      groundItemData: [],
      themeList: [],
      rowDataList: {}, // 点击行数据
      rowDialog: false,
      themeHeaderList: [],
      type: '', // 筛选类型
      isHasGroup: false, // 是否聚合数据
      filterToolBarList: [], // 筛选展示条件数据
      cardVisible: false,
      total: 0,
      filterTitle: '筛选',
      item_loading: false,
      card_loading: false,

      titleName: '', // 添加标题相关
      reDialog: false, //  添加标题相关
      reMsgDialog: false,
      reMsg: '标题重复，请重新输入',

      filterString: false, // 筛选字符弹窗
      stringRadio: null,
      strSelect: '0',
      strValue: null,

      filterNumber: false, // 筛选数字弹窗
      numberRadio: null,
      startNum: null,
      endNum: null,

      filterDate: false, // 筛选日期的弹窗
      dateRadio: null,
      dateValue1: '',
      dateValue2: '',

      queryData: {
        queryType: 'THEME', // 查询方式 COMPANY（企业）
        themeTitleThree: null, // 当前主题名称
        globalProvince: null, // 全局省
        globalCity: null, // 全局市
        globalArea: null, // 全局区
        regionViewVos: [],
        stringFilters: [],
        numFilters: [],
        dateFilters: [],
        sort: {},
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    ...mapGetters([
      'info'
    ])
  },
  watch: {
    titleName (val, oldVal) {
      if (val.trim()) {
        this.isExistName(val.trim())
      }
    }
  },
  created () {
    this.twoThemeName = this.$route.params.id
    this.oneThemeName = this.$route.query.su
    if (this.$route.query.id) {
      this.bookmarkId = this.$route.query.id
      this.getSubThreeNameArr(2)
    } else if (this.$route.query.themeTitleThree) {
      this.queryData.themeTitleThree = this.$route.query.themeTitleThree
      this.getSubThreeNameArr()
    } else {
      this.getSubThreeNameArr(1)
    }
  },
  mounted () {
    that = this
    Bus.$off('initThemeTable')
    Bus.$on('initThemeTable', function () {
      that.initTableData()
    })
    Bus.$off('reArea_reTheme')
    Bus.$on('reArea_reTheme', function () {
      that.filterToolBarList = []
      that.getQueryParams()
    })
  },
  methods: {
    // 请求主题筛选参数
    getQueryParams () {
      getThemeQueryParams({
        themeTitleThree: this.queryData.themeTitleThree,
        bookmarkId: this.bookmarkId
      }).then(response => {
        if (response.code === 200) {
          this.queryData = response.data
          this.queryData.globalProvince = response.data.globalProvince
          this.queryData.globalCity = response.data.globalCity
          this.queryData.globalArea = response.data.globalArea
          this.queryData.themeTitleThree = response.data.themeTitleThree
          // 此处拼接筛选条件呢
          this.filterToolBarList = []
          if (this.queryData.dateFilters.length > 0) {
            for (let i = 0; i < this.queryData.dateFilters.length; i++) {
              let date = {
                name: this.queryData.dateFilters[i].dateFilterName,
                value: (this.queryData.dateFilters[i].dateFilterFrom === null ? '最早 ' : this.queryData.dateFilters[i].dateFilterFrom) + ' 至' +
                  (this.queryData.dateFilters[i].dateFilterTo === null ? ' 现在' : this.queryData.dateFilters[i].dateFilterTo),
                type: 'date'
              }
              this.filterToolBarList.push(date)
            }
          }
          if (this.queryData.numFilters.length > 0) {
            for (let i = 0; i < this.queryData.numFilters.length; i++) {
              let num = {
                name: this.queryData.numFilters[i].numFilterName,
                value: this.queryData.numFilters[i].numFilterFrom + '至' + this.queryData.numFilters[i].numFilterTo,
                type: 'num'
              }
              this.filterToolBarList.push(num)
            }
          }
          if (this.queryData.stringFilters.length > 0) {
            for (let i = 0; i < this.queryData.stringFilters.length; i++) {
              let val = this.queryData.stringFilters[i].stringFilterType == '0' ? '包含' : '不包含'
              let string = {
                name: this.queryData.stringFilters[i].stringFilterName,
                value: '（' + val + '）' + this.queryData.stringFilters[i].stringFilter,
                type: 'string'
              }
              this.filterToolBarList.push(string)
            }
          }
          // 主题书签过来的需要重新请求用户信息更新全局区域信息
          if (this.bookmarkId) {
            this.$store.dispatch('GetInfo').then(() => {
              Bus.$emit('reArea_bookMark')
            })
          }
          this.getAreaViewData()
          this.tableDataAjax()
        }
      })
    },
    // 请求三级主题菜单
    getSubThreeNameArr (val) {
      getSubThreeName({
        themeTitleOne: this.oneThemeName,
        themeTitleTwo: this.twoThemeName
      }).then(response => {
        if (response.code === 200) {
          this.threeThemeList = response.data
          if (val && val === 1) {
            this.queryData.themeTitleThree = this.threeThemeList[0]
          } else if (val === 2) {
            this.queryData.themeTitleThree = null
          }
          this.getQueryParams()
        }
      })
    },
    // 获取区域视图参数
    getAreaViewData () {
      getAreaViewList({
        themeTitleThree: this.queryData.themeTitleThree
      }).then(response => {
        if (response.code === 200) {
          this.areaViewList = response.data
        }
      })
    },
    // 请求表格数据
    tableDataAjax () {
      this.loading = true
      getThemedata(this.queryData).then(response => {
        if (response.code === 200) {
          this.themeHeaderList = response.data.headers
          this.themeList = response.data.pageInfo
          // 初始化表格数据
          this.initTableData()
        } else {
          this.loading = false
        }
      })
    },
    // 初始化表格数据
    initTableData () {
      // 获取表头
      let columns = this.getTableColumns()
      $('#table_art').bootstrapTable('destroy')
      if (columns === null) {
        $('#table_art').bootstrapTable({})
      } else {
        if (columns && columns[0].field === '快照') {
          let firstColumn = {
            field: '快照',
            title: '快照',
            class: 'kuahao',
            visible: columns[0].visible,
            titleTooltip: '点击筛选',
            formatter: this.formatterKz
          }
          columns[0] = firstColumn
        } else if (columns && columns[0].field === '招股说明书') {
          let firstColumn = {
            field: '招股说明书',
            title: '招股说明书',
            visible: columns[0].visible,
            class: 'zgsms',
            titleTooltip: '点击筛选',
            formatter: this.formatterZgsms
          }
          columns[0] = firstColumn
        } else if (columns && columns[0].field === '原始文件') {
          let firstColumn = {
            field: '原始文件',
            title: '原始文件',
            visible: columns[0].visible,
            class: 'zgsms',
            titleTooltip: '点击筛选',
            formatter: this.formatterYswj
          }
          columns[0] = firstColumn
        }
      }
      $('#table_art').bootstrapTable({
        showColumns: true,
        columns: columns,
        data: this.themeList.data,
        undefinedText: '--',
        onColumnSwitch: this.clickTableHeader,
        onClickRow: this.clickRow
      })
      // $('#table_art').bootstrapTable('hideColumn', '快照')   // 隐藏列
      this.loading = false
      this.clickTableHeader()
    },
    // 点击行显示详情弹窗
    clickRow (row, $element, field) {
      this.rowDialog = true
      this.rowDataList = {}
      for (let item in this.themeHeaderList) {
        let key = this.themeHeaderList[item].header
        this.rowDataList[key] = row[key].name
      }
    },
    // 获取表头
    getTableColumns () {
      let column = []
      if (this.themeHeaderList != null) {
        for (var i = 0; i < this.themeHeaderList.length; i++) {
          var value = this.themeHeaderList[i].header
          var show = this.themeHeaderList[i].headerCheck
          var col = {
            field: value,
            title: value,
            class: 'clickHeader',
            visible: show,
            titleTooltip: value,
            formatter: this.formatterColumns
          }
          column[i] = col
        }
        return column
      } else {
        return null
      }
    },
    formatterColumns (obj) {
      if (obj.value) {
        return [
          '<a class="pic" href="/#/company/companyInfo/id/' + obj.value + '" onclick="event.stopPropagation()" title="查看公司详情" rel="noopener">',
          '<span>' + obj.name + '</span>',
          '</a>'
        ].join('')
      } else {
        if (obj.name === '') {
          return '--'
        } else {
          return obj.name
        }
      }
    },
    // 快照
    formatterKz (obj) {
      if (obj.name) {
        return [
          '<a class="pic" href="' + obj.name + '" onclick="event.stopPropagation()" title="查看原网页" target="_blank" rel="noopener">',
          '<i class="picture kz"></i>',
          '</a>'
        ].join('')
      } else {
        return null
      }
    },
    // 招股说明书
    formatterZgsms (obj) {
      if (obj.name) {
        return [
          '<a class="pic" href="' + obj.name + '" onclick="event.stopPropagation()" title="查看原网页" target="_blank" rel="noopener">',
          '<i class="picture zg"></i>',
          '</a>'
        ].join('')
      } else {
        return null
      }
    },
    // 原始文件
    formatterYswj (obj) {
      if (obj.name) {
        return [
          '<a class="pic" href="' + obj.name + '" onclick="event.stopPropagation()" title="查看原始文件" target="_blank" rel="noopener">',
          '<i class="picture zg"></i>',
          '</a>'
        ].join('')
      } else {
        return null
      }
    },
    // 点击表头筛选
    clickTableHeader () {
      let that = this
      $('#table_art thead .clickHeader').on('click', function () {
        let name = $(this).text().trim()
        that.filterTitle = name
        that.groundItemData = [] // 聚合数据置空
        for (var i = 0; i < that.themeHeaderList.length; i++) {
          if (that.themeHeaderList[i].header === name) {
            that.type = that.themeHeaderList[i].headerType
            that.isHasGroup = that.themeHeaderList[i].hasGroup // 是否聚合数据
          }
        }
        if (that.type === 'NUM') {
          that.getMaxMinValue(name)
          that.filterNumber = true
        } else if (that.type === 'DATE') {
          that.getMaxMinValue(name)
          that.filterDate = true
        } else if (that.type === 'STRING') {
          if (that.isHasGroup) { // 聚合接口
            that.item_loading = true
            that.getStatisticsData(name)
          }
          that.strSelect = '0'
          that.strValue = null
          that.filterString = true
        }
      })
    },
    // 聚合数据
    getStatisticsData (val) {
      getStatistics(this.queryData, val).then(response => {
        if (response.code === 200) {
          that.groundItemData = response.data
          if (that.groundItemData && that.groundItemData.length > 30) {
            that.groundItemData.pop()
            that.groundItemData.push({
              count: '',
              _id: '......'
            })
          }
        }
        that.item_loading = false
      })
    },
    clickFilterGround (val) {
      let stringFilter = {
        stringFilterName: this.filterTitle, // 字符筛选 列名称
        stringFilter: val, // 参数
        stringFilterType: 0 // 筛选类型  0：包含，1：不包含
      }
      for (let index in this.queryData.stringFilters) {
        if (this.filterTitle === this.queryData.stringFilters[index].stringFilterName) {
          this.queryData.stringFilters.splice(index, 1)
        }
      }
      if (val) {
        this.queryData.stringFilters.push(stringFilter)
        // 拼接筛选展示条件
        let string = {
          name: this.filterTitle,
          value: '（包含）' + val,
          type: 'string'
        }
        for (let i in this.filterToolBarList) {
          if (this.filterToolBarList[i].name === string.name) {
            this.filterToolBarList.splice(i, 1)
          }
        }
        this.filterToolBarList.push(string)
      }
      this.filterString = false
      this.queryData.pageNum = 1
      this.queryData.pageSize = 20
      this.filterClose()
      this.tableDataAjax()
    },
    // 筛选确定
    clickFilter (type) {
      if (type === 'string') {
        if (this.stringRadio) {
          this.queryData.sort.type = this.stringRadio
          this.queryData.sort.name = this.filterTitle
        }
        let stringFilter = {
          stringFilterName: this.filterTitle, // 字符筛选 列名称
          stringFilter: this.strValue, // 参数
          stringFilterType: this.strSelect // 筛选类型  0：包含，1：不包含
        }
        for (let index in this.queryData.stringFilters) {
          if (this.filterTitle === this.queryData.stringFilters[index].stringFilterName) {
            this.queryData.stringFilters.splice(index, 1)
          }
        }

        if (this.strValue) {
          this.queryData.stringFilters.push(stringFilter)
          // 拼接筛选展示条件
          let val = this.strSelect == '0' ? '包含' : '不包含'
          let string = {
            name: this.filterTitle,
            value: '（' + val + '）' + this.strValue,
            type: 'string'
          }
          for (let i in this.filterToolBarList) {
            if (this.filterToolBarList[i].name === string.name) {
              this.filterToolBarList.splice(i, 1)
            }
          }
          this.filterToolBarList.push(string)
        }
        this.filterString = false
      } else if (type === 'num') {
        if (this.numberRadio) {
          this.queryData.sort.type = this.numberRadio
          this.queryData.sort.name = this.filterTitle
        }
        let numFilter = {
          numFilterName: this.filterTitle, // 数字筛选 列名称
          numFilterFrom: this.startNum, // 数字筛选 开始
          numFilterTo: this.endNum // 数字筛选 结束
        }
        for (let index in this.queryData.numFilters) {
          if (this.filterTitle === this.queryData.numFilters[index].numFilterName) {
            this.queryData.numFilters.splice(index, 1)
          }
        }
        if (this.startNum || this.endNum) {
          this.queryData.numFilters[0] = numFilter
          // 拼接筛选展示条件
          let num = {
            name: this.filterTitle,
            value: this.startNum + '至' + this.endNum,
            type: 'num'
          }
          for (let i in this.filterToolBarList) {
            if (this.filterToolBarList[i].name === num.name) {
              this.filterToolBarList.splice(i, 1)
            }
          }
          this.filterToolBarList.push(num)
        }
        this.filterNumber = false
      } else if (type === 'date') {
        if (this.dateRadio) {
          this.queryData.sort.type = this.dateRadio
          this.queryData.sort.name = this.filterTitle
        }
        if (this.dateValue1 || this.dateValue2) {
          let dateFilter = {
            dateFilterName: this.filterTitle, // 时间筛选 列名称
            dateFilterFrom: this.dateValue1, // 时间筛选 开始 格式 yyyy-MM-dd
            dateFilterTo: this.dateValue2 // 时间筛选 结束 格式 yyyy-MM-dd
          }
          // 拼接筛选展示条件
          let date = {
            name: this.filterTitle,
            value: (this.dateValue1 === null ? '最早' : this.dateValue1) + ' 至 ' + (this.dateValue2 === null ? ' 现在' : this.dateValue2),
            type: 'date'
          }
          for (let i in this.filterToolBarList) {
            if (this.filterToolBarList[i].name === date.name) {
              this.filterToolBarList.splice(i, 1)
            }
          }
          this.filterToolBarList.push(date)
          this.queryData.dateFilters[0] = dateFilter
        }
        this.filterDate = false
      }
      this.queryData.pageNum = 1
      this.queryData.pageSize = 20
      this.filterClose()
      this.tableDataAjax()
    },
    // 移除企业筛选条件
    removeFilter (type, name) {
      /* 删除展示筛选条件 */
      for (let i = 0; i < this.filterToolBarList.length; i++) {
        if (this.filterToolBarList[i].name === name) {
          this.filterToolBarList.splice(i, 1)
        }
      }
      if (type === 'string') {
        for (let i = 0; i < this.queryData.stringFilters.length; i++) {
          if (this.queryData.stringFilters[i].stringFilterName === name) {
            this.queryData.stringFilters.splice(i, 1)
          }
        }
      } else if (type === 'num') {
        for (let i = 0; i < this.queryData.numFilters.length; i++) {
          if (this.queryData.numFilters[i].numFilterName === name) {
            this.queryData.numFilters.splice(i, 1)
          }
        }
      } else if (type === 'date') {
        for (let i = 0; i < this.queryData.dateFilters.length; i++) {
          if (this.queryData.dateFilters[i].dateFilterName === name) {
            this.queryData.dateFilters.splice(i, 1)
          }
        }
      }
      this.queryData.pageNum = 1
      this.queryData.pageSize = 20
      this.tableDataAjax()
    },
    // 获取筛选最大最小值
    getMaxMinValue (val) {
      getMaxMin(this.queryData, val).then(response => {
        if (response.code === 200) {
          if (this.type === 'NUM') {
            this.startNum = response.data.min
            this.endNum = response.data.max
          } else if (this.type === 'DATE') {
            this.dateValue1 = response.data.min
            this.dateValue2 = response.data.max
          }
        }
      })
    },
    // 保存书签
    saveBookmark () {
      if (this.titleName.trim()) {
        saveThemeBookMark({
          name: this.titleName.trim(),
          type: 'THEME',
          themeFilter: this.queryData
        }).then(response => {
          if (response.code === 200) {
            this.reMsgDialog = false
            this.reDialog = false
            this.titleName = ''
          } else {
            this.reMsg = response.msg
            this.reMsgDialog = true
          }
        })
      }
    },
    // 判断书签名称是否存在
    isExistName (valName) {
      checkBookName({
        bookmarkType: 'THEME',
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
    // 下载
    getDownExcel () {
      this.postDownLoadFile({
        url: '/api/V1/tax/theme/down',
        // url: 'http://192.168.1.172:8080/api/V1/tax/theme/down',
        data: this.queryData,
        method: 'post'
      })
    },
    // post下载
    postDownLoadFile (options) {
      let token = getToken()
      var config = $.extend(true, { method: 'post' }, options)
      var $iframe = $('<iframe id="down-file-iframe"/>')
      var $form = $('<form target="down-file-iframe" method="' + config.method + '" />')
      $form.attr('action', config.url)
      for (var key in config.data) {
        $form.append('<input type="hidden" name="' + key + '" value="' + JSON.stringify(config.data[key]).replace(/"/g, '\'') + '" />')
      }
      $form.append('<input type="hidden" name="' + 'userToken' + '" value="' + JSON.stringify(token).replace(/"/g, '\'') + '" />')
      $iframe.append($form)
      $(document.body).append($iframe)
      $form[0].submit()
      $iframe.remove()
    },
    // 统计视图
    getViewFc () {
      that.card_loading = true
      getThemeStatistics(this.queryData).then(response => {
        if (response.code === 200) {
          this.statisticsData = response.data
        }
        that.card_loading = false
      })
      this.cardVisible = true
    },
    // 切换主题
    handleClick () {
      this.getSubThreeNameArr()
    },
    // 分页条数改变
    handleSizeChange (pageSize) {
      this.queryData.pageSize = pageSize
      this.tableDataAjax()
    },
    // 当前页码改变
    handleCurrentChange (pageNum) {
      this.queryData.pageNum = pageNum
      this.tableDataAjax()
    },
    // 标题弹窗关闭前
    handleClose () {
      this.reMsgDialog = false
      this.reDialog = false
      this.titleName = ''
    },
    // 筛选弹框关闭前
    filterClose () {
      this.stringRadio = null
      this.numberRadio = null
      this.dateRadio = null
      this.filterString = false
      this.filterDate = false
      this.filterNumber = false
    }
  }
}
</script>

<style scoped lang="less">
  .theme {
    margin: 15px;
    padding: 10px;
    padding-top: 0;
    border-radius: 6px;
    font-size: 15px;
    background-color: #fff;
    #toolbar {
      .filter_item {
        padding-right: 160px;
        .f_item {
          display: inline-block;
          margin: 12px 0 12px 0;
          padding: 2px 5px;
          color: #55585E;
          font-size: 13px;
          border: 1px solid #4378FF;
          border-radius: 15px;
        }
        .item {
          cursor: pointer;
          display: inline-block;
          margin-bottom: 12px;
          line-height: 28px;
          padding: 0 8px;
          background-color: #fff;
          border: 1px solid #4378FF;
          border-radius: 18px;
          font-size: 12px;
          color: #55585E;
          .icon {
            font-size: 14px;
            vertical-align: text-bottom;
          }
          .icon:hover {
            font-size: 18px;
          }
        }
      }
      .fu_view {
        position: absolute;
        top: 40px;
        right: 0;
        margin: 12px;
        display: inline-block;
        .view {
          margin: 0 10px;
          cursor: pointer;
        }
      }
    }
    .el-pagination {
      padding: 10px 5px 5px;
    }
  }
</style>
<style lang="less">
  .theme {
    height: 100%;
    .dialog_view {
      .el-dialog {
        position: absolute;
        margin: 0 !important;
        right: 0;
        height: 100%;
      }
      .el-dialog__title {
        margin-left: 30px;
        font-size: 18px;
        color: #55585E;
      }
      .el-dialog__title:before {
        content: '';
        position: absolute;
        left: 20px;
        height: 20px;
        width: 18px;
        background-image: url("../../assets/icon/graph_active.png");
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        margin-left: 1px;
      }
      .el-dialog__body {
        .statisticsView {
          font-size: 15px;
          color: #55585E;
          .title {
            display: block;
            margin-bottom: 1rem;
          }
          .item {
            line-height: 30px;
            cursor: pointer;
          }
          .item:hover {
            color: #4378FF;
          }
          .number .p span, .date .p span {
            display: inline-block;
            width: 190px;
          }
        }
      }
    }
    .dialog_title {
      .el-dialog__body {
        .reName {
          margin: 10px 0;
          text-align: center;
          .el-input {
            margin: 0 auto;
            width: 98%;
            .el-input__inner {
              border-radius: 0;
              border: none;
              border-bottom: 1px solid #E9E9E9;
            }
          }
        }
      }
    }
    .dialog_filter {
      .el-table--border, .el-table--group {
        border: 1px solid #DEE7FF;
      }
      .el-table td, .el-table th {
        padding: 8px 2px;
        text-align: center !important;
        font-size: 14px !important;
        color: #55585E;
      }
      .el-table th {
        cursor: pointer;
        background-color: #F8FAFF;
        .cell {
          white-space: nowrap;
        }
        .cell::after {
          content: '';
          position: relative;
          left: 3px;
          display: inline-block;
          height: 10px;
          width: 8px;
          background-image: url("../../assets/icon/select.png");
          background-repeat: no-repeat;
          background-size: cover;
        }
      }
      .el-table td, .el-table th.is-leaf {
        border-bottom: 1px solid #DEE7FF;
      }
      .el-table__body-wrapper {
        overflow: auto;
      }
      .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
        border-right: 1px solid #DEE7FF;
      }
      .el-dialog__header {
        .el-dialog__title {
          font-size: 16px;
          color: #55585E;
        }
        font-size: 10px;
        font-weight: bold;
        color: #55585E;
      }
      .el-dialog__body {
        padding: 10px 20px;
        .el-radio {
          display: block;
          .el-radio__inner {
            display: none;
          }
        }
        .des {
          .el-radio__input::before {
            content: '';
            display: block;
            height: 20px;
            width: 16px;
            background-image: url("../../assets/icon/order_up.png");
            background-repeat: no-repeat;
            background-size: contain;
          }
          .is-checked::before {
            background-image: url("../../assets/icon/order_up_active.png");
          }
        }
        .ase {
          margin: 15px 0;
          .el-radio__input::before {
            content: '';
            display: block;
            height: 20px;
            width: 16px;
            background-image: url("../../assets/icon/order_down.png");
            background-repeat: no-repeat;
            background-size: contain;
          }
          .is-checked::before {
            background-image: url("../../assets/icon/order_down_active.png");
          }
        }
        .el-select {
          width: 70px;
          .el-input__inner {
            padding: 0 10px;
          }
        }
        .input_ {
          margin-left: 10px;
          width: 180px;
        }
        .date_picker {
          width: 130px;
        }
        .num {
          .el-input {
            width: 118px;
            font-size: 12px;
            .yu {
              line-height: 32px;
              font-size: 12px;
              color: #55585E;
            }
          }
        }
        .el-range-separator {
          width: 10% !important;
        }
      }
      .string {
        .el-radio {
          display: inline-block
        }
      }
    }
    .dialog_row {
      .el-dialog {
        border-radius: 8px;
        .el-dialog__header {
          display: none;
        }
        .el-dialog__body {
          max-height: 600px;
          overflow: auto;
        }
      }
      .row {
        margin: 0;
        .li {
          display: block;
          width: 100%;
          font-size: 15px;
          color: #55585E;
          line-height: 38px;
          border-bottom: 1px dashed #E9E9E9;
          .values {
            color: #383A3E;
          }
        }
      }
    }
    .dowm {
      .el-dialog__header {
        padding: 10px 0 0;
      }
      .el-dialog__body {
        padding: 20px;
      }
    }
    .bootstrap-table {
      .fixed-table-border {
        display: none;
      }
      .bs-bars {
        margin: 0;
        width: 100%;
      }
      .fixed-height:not(.has-footer) {
        border-bottom: 1px solid #DEE7FF;
      }
      .table {
        .table-bordered {
          border: 1px solid #DEE7FF;
        }
        thead {
          background-color: #F8FAFF;
          tr th {
            border: 1px solid #DEE7FF !important;
            margin: 0;
            padding: 0;
            .th-inner {
              color: #55585E;
              font-size: 15px;
              padding: 6px 16px;
            }
          }
        }
        tbody {
          tr td {
            max-width: 320px;
            border: 1px solid #DEE7FF;
            .picture {
              display: block;
              margin: 0 auto;
              height: 16px;
              width: 16px;
              background-repeat: no-repeat;
              background-size: contain;
              background-position: center;
            }
            .kz {
              background-image: url("../../assets/icon/polaroid.png");
            }
            .zg {
              background-image: url("../../assets/icon/pdf.png");
            }
            font-size: 14px;
            color: #55585E;
          }
        }
        .clickHeader {
          .th-inner:after {
            content: '';
            position: absolute;
            height: 20px;
            width: 9px;
            background-image: url("../../assets/icon/select.png");
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
            margin-left: 1px;
          }
          position: relative;
          text-align: center;
          /*max-width: 320px;*/
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
      }
      #toolbar {
        .qyst {
          position: absolute;
          display: inline-block;
          margin-top: -32px;
          right: 60px;
          cursor: pointer;
          .qyst_buttom {
            display: inline-block;
            padding: 3px 8px;
            font-size: 12px;
            line-height: 21px;
            background-color: #F2F2F9;
            border: 1px solid #C0C1CA;
            color: #55585E;
            box-shadow: none;
            border-radius: .25rem;
          }
        }
        .el-tabs {
          .el-tabs__header {
            margin: 0;
            padding-right: 160px;
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
      .fixed-table-toolbar {
        .columns {
          position: absolute;
          margin-top: 7px;
          right: 25px;
          .btn-secondary {
            padding: 3px 8px;
            background-color: #F2F2F9;
            border: 1px solid #C0C1CA;
            color: #55585E;
            font-size: 14px;
            box-shadow: none;
            border-bottom-left-radius: 0;
            border-top-left-radius: 0;
          }
          .dropdown-toggle {
            .fa-th-list::after {
              content: '更多列';
              font-style: normal;
              font-size: 12px;
            }
          }
          .dropdown-menu {
            .dropdown-item {
              width: 170px;
              color: #55585E;
              font-size: 13px;
              span {
                display: inline-block;
                max-width: 120px;
                white-space: normal;
                vertical-align: text-top;
              }
            }
          }
        }
      }
    }
  }

  .el-dropdown-menu {
    padding: .5rem .8rem;
    margin: .125rem 0 0;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, .15);
    border-radius: .25rem;
    .popper__arrow {
      display: none;
    }
    .el-checkbox-group {
      text-align: left;
      .el-checkbox {
        display: block;
        margin-right: 30px;
        .el-checkbox__label {
          color: #55585E;
          font-family: 'Avenir', Helvetica, Arial, sans-serif;
          font-weight: normal;
          font-size: 13px;
        }
      }
    }
  }

  .el-popper[x-placement^=bottom] {
    margin-top: 2px;
  }

  .el-pagination__jump {
    cursor: pointer !important;
  }
</style>
