<template>
  <div class="companyInfo"  v-loading="loading"  element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading">
    <div class="base_card">
      <p>
        <strong class="name">{{cDataDetail.companyName}}</strong>
        <span class="status">{{cDataDetail.companyStatus}}</span>
        <span v-if="cDataDetail.col" @click="onCol(true)" class="att fr"></span>
        <span v-else class="unAtt att fr" @click="onCol(false)"></span>
      </p>
      <p style="margin-bottom: 25px" v-if="listedInfo">
        <el-tag class="tag" size="mini" color="#E1E9FE" style="color: #4378FF;border-color: #7EA1FC">
          {{listedInfo.shortName}}
        </el-tag>
        <el-tag class="tag" size="mini" color="#FFE6CF" style="color: #FE902B;border-color: #FFAF67">
          股票代码：{{listedInfo.shortCode}}
        </el-tag>
      </p>
      <p class="p" v-if="listedInfo">
        <span style="margin-right: 50px">上市时间：{{listedInfo.listedTime}}</span>
        <span>发行数量：{{listedInfo.shortIssueNum}}万股</span>
      </p>
      <p class="p" v-else>
        <span style="margin-right: 50px">成立日期：{{basicInfo.time}}</span>
        <span>注册资本：{{basicInfo.price}}</span>
      </p>
      <p class="p" v-if="cDataDetail.addr1">
        联系地址：{{cDataDetail.addr1}}
      </p>
      <p class="p" v-if="cDataDetail.addr2">
        登记机关：{{cDataDetail.addr2}}
      </p>
    </div>
    <div class="info_card">
      <div v-if="is_subMenu && sub_menu" class="shadow">
          <span class="item" v-for="(item, index) in sub_menu" :key="index" @click="submenuOnClick(item)">
            {{item}}
          </span>
      </div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="基本信息">
          <strong style="display: block;padding: 10px 0; font-size: 16px" v-if="gsxxData">工商信息</strong>
          <ul class="base-ul" v-if="gsxxData">
            <li class="li_item">
              <span class="title">统一社会信用代码：</span>
              <span class="value" v-if="gsxxData['统一社会信用代码']">{{gsxxData['统一社会信用代码']}}</span>
              <span class="value" v-else>暂无数据</span>
              <span class="title">组织机构代码：</span>
              <span class="value" v-if="gsxxData['组织机构代码']">{{gsxxData['组织机构代码']}}</span>
              <span class="value" v-else>暂无数据</span>
            </li>
            <li class="li_item">
              <span class="title">法定代表人：</span>
              <span class="value" v-if="gsxxData['法定代表人']">{{gsxxData['法定代表人']}}</span>
              <span class="value" v-else>暂无数据</span>
              <span class="title">注册资本：</span>
              <span class="value" v-if="gsxxData['注册资本']">{{gsxxData['注册资本']}}</span>
              <span class="value" v-else>暂无数据</span>
            </li>
            <li class="li_item">
              <span class="title">经营状态：</span>
              <span class="value" v-if="gsxxData['经营状态']">{{gsxxData['经营状态']}}</span>
              <span class="value" v-else>暂无数据</span>
              <span class="title">成立日期：</span>
              <span class="value" v-if="gsxxData['成立日期']">{{gsxxData['成立日期']}}</span>
              <span class="value" v-else>暂无数据</span>
            </li>
            <li class="li_item">
              <span class="title">联系电话：</span>
              <span class="value" v-if="gsxxData['联系电话']">{{gsxxData['联系电话']}}</span>
              <span class="value" v-else>暂无数据</span>
              <span class="title">所在区域：</span>
              <span class="value" v-if="gsxxData['所在区域']">{{gsxxData['所在区域']}}</span>
              <span class="value" v-else>暂无数据</span>
            </li>
            <li class="li_item">
              <span class="title">所属行业：</span>
              <span class="value" v-if="gsxxData['所属行业']">{{gsxxData['所属行业']}}</span>
              <span class="value" v-else>暂无数据</span>
              <span class="title">企业类型：</span>
              <span class="value" v-if="gsxxData['企业类型']">{{gsxxData['企业类型']}}</span>
              <span class="value" v-else>暂无数据</span>
            </li>
            <li class="li_item line">
              <span class="title">注册地：</span>
              <span class="full_line">{{gsxxData['注册地']}}</span>
            </li>
            <li class="li_item line">
              <span class="title">联系地址：</span>
              <span class="full_line">{{gsxxData['联系地址']}}</span>
            </li>
            <li class="li_item line">
              <span class="title">经营范围：</span>
              <span class="full_line">{{gsxxData['经营范围']}}</span>
            </li>
          </ul>
          <strong v-if="tableData" style="display: block;padding: 10px 0; font-size: 16px">股东信息</strong>
          <div class="gdxx" v-if="tableData">
            <el-table
              :data="tableData"
              border
              size="small"
              style="width: 100%">
              <el-table-column
                prop="gudongMC"
                label="股东名称">
              </el-table-column>
              <el-table-column
                prop="gudongXZ"
                label="股东性质">
              </el-table-column>
              <el-table-column
                prop="chuziBL"
                width="100px"
                label="出资比例">
              </el-table-column>
              <el-table-column
                prop="rengjiaoCZ"
                label="认缴出资">
              </el-table-column>
              <el-table-column
                prop="chuziSJ"
                label="出资时间">
              </el-table-column>
              <el-table-column
                prop="shijiaoCZ"
                label="实缴出资">
              </el-table-column>
            </el-table>
          </div>

          <strong v-if="ggxxData" style="display: block;padding: 10px 0; font-size: 16px">高管信息</strong>
          <div class="ggxx" v-if="ggxxData">
            <el-table
              :data="ggxxData"
              border
              size="small"
              style="width: 100%">
              <el-table-column
                type="index"
                label="序号"
                width="50">
              </el-table-column>
              <el-table-column
                prop="gaoguanMC"
                label="高管名称">
              </el-table-column>
              <el-table-column
                prop="gaoguanZW"
                label="高管职位">
              </el-table-column>
            </el-table>
          </div>

          <strong v-if="cDataDetail.sdgg" style="display: block;padding: 10px 0; font-size: 16px">十大股东</strong>
          <div v-if="cDataDetail.sdgg" class="sdgd">
            <el-tabs v-model="sdgd_tab" @tab-click="sdgdClickTab">
              <el-tab-pane :label="value" :name="value" v-for="(item, value, index) in cDataDetail.sdgg" :key="index">
                <el-table
                  :data="item"
                  border
                  size="small"
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    label="序号"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop="gudongMX"
                    label="股东名称">
                  </el-table-column>
                  <el-table-column
                    prop="chiguSL"
                    label="持股数量（股）">
                  </el-table-column>
                  <el-table-column
                    prop="chiguBL"
                    label="持股比例（%）">
                  </el-table-column>
                  <el-table-column
                    prop="gufengXZ"
                    label="持股性质">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>

          <strong v-if="cDataDetail.sdltgg" style="display: block;padding: 10px 0; font-size: 16px">十大流通股东</strong>
          <div v-if="cDataDetail.sdltgg" class="sdltgd">
            <el-tabs v-model="sdltgd_tab" @tab-click="sdgdClickTab">
              <el-tab-pane :label="value" :name="value" v-for="(item, value, index) in cDataDetail.sdltgg" :key="index">
                <el-table
                  :data="item"
                  border
                  size="small"
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    label="序号"
                    width="50">
                  </el-table-column>
                  <el-table-column
                    prop="gudongMX"
                    label="股东名称">
                  </el-table-column>
                  <el-table-column
                    prop="chiguSL"
                    label="持股数量（股）">
                  </el-table-column>
                  <el-table-column
                    prop="chiguBL"
                    label="持股比例（%）">
                  </el-table-column>
                  <el-table-column
                    prop="gufengXZ"
                    label="持股性质">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>

          <strong v-if="cDataDetail.gsbgxx" style="display: block;padding: 10px 0; font-size: 16px">工商变更信息</strong>
          <div class="ggbg" cDataDetail.gsbgxx>
            <el-table
              :data="cDataDetail.gsbgxx"
              border
              size="small"
              style="width: 100%">
              <el-table-column
                prop="biangengRQ"
                width="150"
                label="变更日期">
              </el-table-column>
              <el-table-column
                prop="biangengSX"
                width="200"
                label="变更事项">
              </el-table-column>
              <el-table-column
                prop="biangengQNR"
                label="变更前内容">
              </el-table-column>
              <el-table-column
                prop="biangengHNR"
                label="变更后内容">
              </el-table-column>
            </el-table>
          </div>
          <!-- 提示弹框 -->
          <el-dialog class="dialog_tip"
                     :visible.sync="tipDialog"
                     :show-close = false
                     center
                     top="35vh"
                     width="280px">
            <div>
              <i class="el-icon-warning" style="color: #ff00008c;margin-right: 6px"></i>
              <span>暂时没有找到该公司相关信息</span>
            </div>
          </el-dialog>

        </el-tab-pane>
        <el-tab-pane :label="value" :name="value" v-for="(item, value, index) in tab_theme" :key="index">
        </el-tab-pane>
      </el-tabs>
      <div v-if="activeName != '基本信息'" class="com_table">
        <div id="toolbar">
          <div class="filter_item">
            <span class="f_item item" style="color: #fff;background-color: #4378FF">{{queryData.themeTitleThree}}</span>
            <span v-for="(item, index) in filterToolBarList" :key="index">
              <i class="el-icon-plus"></i>
            <span class="item">
          {{item.name}}：{{item.value}}
            <i @click="removeFilter(item.type, item.name)" class="el-icon-circle-close icon"></i>
        </span>
             </span>
            <div class="fu_view fr">
                  <span style="color: #4378FF;font-size: 14px" class="view" @click="reDialog = true">
                    <img style="width: 18px;vertical-align: text-top;" src="@/assets/icon/save.png" title="保存" alt="">
                    保存
                  </span>
              <span class="view" @click="getViewFc">
                    <img style="width: 18px;vertical-align: text-top;" src="@/assets/icon/bar-graph.png" title="统计视图"
                         alt="">
                  </span>
              <span class="view" @click="getDownExcel">
                    <img style="width: 18px;vertical-align: text-top;" src="@/assets/icon/download.png" title="点击下载"
                         alt="">
                  </span>
            </div>
          </div>
        </div>
        <table id="table_art" class="bootstrapTable" data-toolbar="#toolbar"
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
          <div class="statisticsView">
            <p class="p">
              <span class="bold">条目总数</span>
              <span>{{statisticsData.num}}</span>
            </p>
            <div class="number" style="padding: 20px 0" v-if="statisticsData.priceMax || statisticsData.priceMin || statisticsData.priceAvg || statisticsData.priceSum">
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
            <div class="date" style="padding:0 0 20px 0" v-if="statisticsData.dateStart || statisticsData.dateEnd">
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
                   width="300px">
          <div class="string">
            <el-radio class="des" v-model="stringRadio" label="ASC">升序</el-radio>
            <el-radio class="ase" v-model="stringRadio" label="DESC">降序</el-radio>
            <el-select size="small" v-model="strSelect" placeholder="请选择">
              <el-option key="0" label="包含" value="0"></el-option>
              <el-option key="1" label="不包含" value="1"></el-option>
            </el-select>
            <el-input class="input_" size="small" v-model="strValue" placeholder="请输入内容"></el-input>
          </div>
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
        <el-dialog
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
        <!-- 点击行显示详情 -->
        <el-dialog class="dialog_row"
                   :visible.sync="rowDialog"
                   center
                   top="15vh"
                   width="40%">
          <ul class="row">
            <li class="li" v-for="(value, key, index) in rowDataList" :key="index">
              <span class="keys">{{key}}：</span>
              <a v-if="key == '快照' && value.name" :href = value.name>查看快照</a>
              <span v-else class="values">{{value.name}}</span>
            </li>
          </ul>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable eqeqeq */

import {
  getComDeatil,
  getComThemedata,
  getThemeStatistics,
  getMaxMin,
  colCom,
  deleteC,
  getComThemeQueryParams,
  saveThemeBookMark,
  checkBookName
} from '@/utils/api'
import { getToken } from '@/utils/auth'
import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap-table/dist/bootstrap-table.min.css'
import 'bootstrap-table/dist/bootstrap-table.min'
import 'bootstrap-table/dist/locale/bootstrap-table-zh-CN.min'

var that, data
export default {
  name: 'companyInfo',
  data () {
    return {
      tipDialog: false, // 提示弹框
      loading: false,
      activeName: '基本信息',
      is_subMenu: true,
      bookmarkId: null, // 书签id
      rowDataList: {}, // 点击行数据
      cId: '',
      cDataDetail: {},
      listedInfo: null, // 上市信息
      basicInfo: {}, // 基本信息
      gsxxData: {}, //  工商信息
      tableData: null, //  股东信息
      ggxxData: null, //  高管信息
      sdgd_tab: '', // 十大股东切换
      sdltgd_tab: '', // 十大股东切换
      sub_menu: [], //  二级主题数组
      tab_theme: {}, // tab对象

      titleName: '', // 添加标题相关
      reDialog: false, //  添加标题相关
      reMsgDialog: false,
      reMsg: '标题重复，请重新输入',

      statisticsData: {}, // 统计视图数据
      themeList: {},
      themeHeaderList: [],
      type: '', // 筛选类型
      cardVisible: false,
      total: 300,
      filterTitle: '筛选',

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
      dateValue1: null,
      dateValue2: null,
      rowDialog: false,
      filterToolBarList: [],
      queryData: {
        queryType: 'COMPANY_THEME', // 查询方式 COMPANY（企业）
        themeTitleThree: '', // 当前主题名称
        companyName: '',
        stringFilters: [],
        numFilters: [],
        dateFilters: [],
        sort: {},
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  watch: {
    titleName (val, oldVal) {
      if (val.trim()) {
        this.isExistName(val.trim())
      }
    }
  },
  mounted () {
    that = this
    if (this.$route.params.type === 'id') {
      data = {
        companyId: this.$route.params.query
      }
    } else {
      this.queryData.themeTitleThree = this.$route.params.type
      this.bookmarkId = this.$route.query.sqId
      data = {
        companyId: this.$route.params.query
      }
    }
    // 获取企业详情
    this.getCompany()
  },
  methods: {
    // 获取企业主题筛选条件
    getComThemeQuery () {
      getComThemeQueryParams({
        bookmarkId: this.bookmarkId,
        companyId: this.$route.params.query,
        themeTitleThree: this.queryData.themeTitleThree
      }).then(response => {
        if (response.code === 200) {
          this.queryData = response.data
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
          this.tableDataAjax()
        }
      })
    },
    // 获取企业详情
    getCompany () {
      this.loading = true
      getComDeatil(data).then(response => {
        this.loading = false
        if (response.code === 200) {
          this.cDataDetail = response.data
          if (response.data.listedInfo) {
            this.listedInfo = response.data.listedInfo
          }
          if (response.data.basicInfo) {
            this.basicInfo = response.data.basicInfo
          }
          this.gsxxData = response.data.gsxx
          this.tableData = response.data.gdxx
          this.cId = response.data.companyId
          this.ggxxData = response.data.ggxx
          this.queryData.companyName = response.data.companyName
          if (response.data.sdgg) {
            this.sdgd_tab = Object.keys(response.data.sdgg)[0]
            this.sdltgd_tab = Object.keys(response.data.sdltgg)[0]
          }
          this.tab_theme = response.data.tabs
          // 跳转到对应主题
          for (let item in this.tab_theme) {
            for (let i in this.tab_theme[item]) {
              if (this.tab_theme[item][i] === this.queryData.themeTitleThree) {
                this.activeName = item
                this.getComThemeQuery()
              }
            }
          }
          // 切换三级主题
          this.$nextTick(function () {
            setTimeout(function () {
              $('.el-tabs__header .el-tabs__nav .el-tabs__item').hover(function () {
                that.is_subMenu = true
                that.sub_menu = that.tab_theme[this.innerText]
              }, function () {
                $('.shadow').hover(function () {
                  // that.is_subMenu = true
                }, function () {
                  that.is_subMenu = false
                })
              })
            }, 100)
          })
        } else if (response.code === 404) {
          this.tipDialog = true
        }
      })
    },
    // 点击二级菜单
    submenuOnClick (value) {
      this.queryData.themeTitleThree = value
      for (let item in this.tab_theme) {
        for (let i in this.tab_theme[item]) {
          if (this.tab_theme[item][i] === value) {
            that.is_subMenu = false
            this.activeName = item
          }
        }
      }
      this.getComThemeQuery()
    },
    // 关注取消关注
    onCol (val) {
      if (val) {
        deleteC(this.cId).then(response => {
          if (response.code === 200) {
            this.getCompany()
          }
        })
      } else {
        colCom({
          companyId: this.cId,
          companyName: this.cDataDetail.companyName
        }).then(response => {
          if (response.code === 200) {
            this.getCompany()
          }
        })
      }
    },
    // 获取企业主题表格数据
    tableDataAjax () {
      getComThemedata(this.queryData).then(response => {
        if (response.code === 200) {
          this.themeHeaderList = response.data.headers
          this.themeList = response.data.pageInfo
          this.bookmarkId = null
          // 初始化表格数据
          this.initTableData()
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
          var firstColumn = {
            field: '快照',
            title: '快照',
            visible: columns[0].visible,
            class: 'kuahao',
            titleTooltip: '点击筛选',
            formatter: this.operateFormatter
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
      this.clickTableHeader()
    },
    // 点击行显示详情弹窗
    clickRow (row, $element, field) {
      this.rowDialog = true
      this.rowDataList = row
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
    // 快照
    operateFormatter (obj) {
      if (obj.name) {
        return [
          '<a class="pic" href="' + obj.name + '" onclick="event.stopPropagation()" title="查看原网页" target="_blank" rel="noopener">',
          '<i class="kuaizhao-picture"></i>',
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
    // 点击表头筛选
    clickTableHeader () {
      let that = this
      $('#table_art thead .clickHeader').on('click', function () {
        let name = $(this).text().trim()
        that.filterTitle = name
        for (var i = 0; i < that.themeHeaderList.length; i++) {
          if (that.themeHeaderList[i].header === name) {
            that.type = that.themeHeaderList[i].headerType
          }
        }
        if (that.type === 'NUM') {
          that.getMaxMinValue(name)
          that.filterNumber = true
        } else if (that.type === 'DATE') {
          that.getMaxMinValue(name)
          that.filterDate = true
        } else if (that.type === 'STRING') {
          that.strSelect = '0'
          that.strValue = null
          that.filterString = true
        }
      })
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
          this.queryData.dateFilters[0] = dateFilter
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
    // 保存书签
    saveBookmark () {
      if (this.titleName.trim()) {
        saveThemeBookMark({
          name: this.titleName.trim(),
          companyId: this.$route.params.query,
          type: 'COMPANY_THEME',
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
        bookmarkType: 'COMPANY_THEME',
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
        // url: 'http://39.98.70.190:55505/api/V1/tax/theme/down',
        url: '/api/V1/tax/theme/down',
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
        $form.append('<input type="hidden" name="' + key + '" value="' + JSON.stringify(config.data[key]).replace(/"/g, "'") + '" />')
      }
      $form.append('<input type="hidden" name="' + 'userToken' + '" value="' + JSON.stringify(token).replace(/"/g, '\'') + '" />')
      $iframe.append($form)
      $(document.body).append($iframe)
      $form[0].submit()
      $iframe.remove()
    },
    // 统计视图
    getViewFc () {
      getThemeStatistics(this.queryData).then(response => {
        if (response.code === 200) {
          this.statisticsData = response.data
        }
      })
      this.cardVisible = true
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
    // tab切换
    handleClick (val) {
      if (val.name !== '基本信息') {
        this.queryData.themeTitleThree = this.tab_theme[val.name][0]
        this.getComThemeQuery()
      }
    },
    // 十大流通股东
    sdgdClickTab () {

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
  .companyInfo {
    height: 100%;
    overflow: auto;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 20px 20px 0 20px;
    .com_table {
      padding: 0 10px 10px;
      #toolbar {
        .sub_theme_item {
          .a {
            display: inline-block;
            padding: 0 20px;
            color: #55585E;
            vertical-align: super;
            line-height: 49px;
            cursor: pointer;
          }
          .active {
            border-bottom: 1px solid #4378FF;
          }
          width: 100%;
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #E9E9E9;
        }
        .filter_item {
          .f_item {
            display: inline-block;
            margin: 12px 0px 12px 0;
            color: #55585E;
            border: 1px solid #4378FF;
            border-radius: 15px;
          }
          .item {
            cursor: pointer;
            display: inline-block;
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
          .fu_view {
            margin: 12px;
            display: inline-block;
            .view {
              margin: 0 10px;
              cursor: pointer;
            }
          }
        }
      }
      .el-pagination {
        padding: 15px 5px 5px;
        .el-pagination__jump {
          cursor: pointer;
        }
      }
    }
    .base_card {
      padding: 15px;
      /*height: 180px;*/
      width: 100%;
      font-size: 14px;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 6px;
      p {
        margin: 0;
        line-height: 22px;
        color: #55585E;
        .status {
          margin-left: 8px;
          padding: 0px 6px;
          display: inline-block;
          color: #4378FF;
          border: 1px solid #4378FF;
          border-radius: 3px;
        }
        .name {
          font-size: 18px;
        }
        .att {
          height: 20px;
          width: 18px;
          cursor: pointer;
          background-image: url("../../assets/icon/collect_active.png");
          background-repeat: no-repeat;
          background-size: contain;
          background-position: center;
        }
        .unAtt {
          background-image: url("../../assets/icon/collect.png");
        }
        .tag {
          margin: 5px 10px 0 0;
        }
      }
    }
    .info_card {
      position: relative;
      margin-top: 20px;
      padding-bottom: 10px;
      background-color: #fff;
      min-height: 950px;
      width: 100%;
      font-size: 14px;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 6px;
      .shadow {
        position: absolute;
        margin-top: 41px;
        z-index: 100;
        width: 100%;
        line-height: 40px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 3px 6px 0px rgba(13, 22, 45, 0.06);
        .item {
          display: inline-block;
          padding: 0 20px;
          cursor: pointer;
          height: 40px;
          color: #55585E;
        }
        .item:hover {
          color: #4378FF;
        }
      }
      .base-ul {
        border: 1px solid #DEE7FF;
      }
      .li_item {
        border-bottom: 1px solid #DEE7FF;
        font-size: 14px;
        line-height: 28px;
        color: #55585E;
        span {
          display: inline-block;
          border-left: 1px solid #DEE7FF;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          padding: 5px 20px;
        }
        span:first-child {
          border: none;
        }
        .title {
          width: 20%;
          background-color: #F8FAFF;
        }
        .value {
          width: 30%;
        }
        .full_line {
          width: 80%;
        }
      }
      .li_item:last-child {
        border-bottom: none;
      }
      .line {
        display: flex;
      }
    }
  }
</style>
<style lang="less">
  .companyInfo {
    .el-tabs .el-tabs__nav {
      padding-left: 20px;
    }
    .el-tabs {
      .el-tabs__item {
        font-weight: normal;
        font-size: 16px;
        color: #55585E;
      }
      .is-active {
        color: #4378FF;
      }
      .el-tab-pane {
        padding: 0 10px;
        .el-table--border, .el-table--group {
          border: 1px solid #DEE7FF;
        }
        .el-table th {
          background-color: #F8FAFF;
        }
        .el-table td, .el-table th {
          text-align: center !important;
          font-size: 14px !important;
        }
        .el-table td, .el-table th.is-leaf {
          border-bottom: 1px solid #DEE7FF;
        }
        .el-table--border td, .el-table--border th, .el-table__body-wrapper .el-table--border.is-scrolling-left ~ .el-table__fixed {
          border-right: 1px solid #DEE7FF;
        }
      }
      .el-tabs__active-bar {
        left: 20px;
        height: 1px;
        background-color: #4378FF;
      }
      .el-tabs__header {
        margin-bottom: 0px;
      }
      .el-tabs__nav-wrap::after {
        height: 1px
      }
    }
    .dialog_tip {
      .el-dialog {
        border-radius: 6px;
        .el-dialog__header {
          padding: 0 !important;
        }
        .el-dialog__body {
          padding: 20px;
          font-size: 15px;
          text-align: center;
        }
      }
    }
  }
  .com_table {
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
    }
    .el-dialog__body {
      .statisticsView {
        font-size: 15px;
        color: #55585E;
        .title {
          display: block;
          margin-bottom: 10px;
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
      .el-radio {
        display: block;
        .el-radio__inner {
          display: none;
        }
      }
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
            border: 1px solid #DEE7FF;
            .kuaizhao-picture {
              display: block;
              margin: 0 auto;
              height: 16px;
              width: 16px;
              background-image: url("../../assets/icon/polaroid.png");
              background-repeat: no-repeat;
              background-size: contain;
              background-position: center;
            }
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
          max-width: 320px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
        }
      }
      #table_art {
        td {
          max-width: 320px;
        }
      }
      .fixed-table-toolbar {
        .columns {
          margin-top: -90px;
          right: 10px;
          .btn-secondary {
            padding: 3px 8px;
            background-color: #F2F2F9;
            border: 1px solid #C0C1CA;
            color: #55585E;
            box-shadow: none;
          }
          .dropdown-toggle {
            .fa-th-list::after {
              content: '更多列';
              font-style: normal;
              font-size: 14px;
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
</style>
