<template>
  <div class="t_table"  v-loading="loading"  element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading">
    <div class="filter">
      <span style="color: #fff;background-color: #4378FF" class="item">企业信息</span>
      <i v-if="queryData.companyName" class="el-icon-plus"></i>
      <span class="item" v-if="queryData.companyName">
        企业名称：{{queryData.companyName}}
        <i @click="removeFilter('com','企业名称')" class="el-icon-circle-close icon"></i>
      </span>
      <span v-for="(item, index) in filterToolBarList" :key="index">
        <i class="el-icon-plus"></i>
        <span class="item">
            {{item.name}}：{{item.value}}
            <i @click="removeFilter(item.type, item.name)" class="el-icon-circle-close icon"></i>
        </span>
      </span>
    </div>
    <span style="color: #4378FF;font-size: 14px" class="view fr" @click="reDialog = true">
      <img style="width: 18px;vertical-align: text-top;" src="@/assets/icon/save.png" title="保存" alt="">
      保存
    </span>
    <div class="company_table">
      <el-table
        :data="tableData.data"
        @header-click="onClickHeader"
        border
        size="small"
        style="width: 100%">
        <el-table-column
          prop="companyName"
          label-class-name="company_name"
          min-width="100px"
          show-overflow-tooltip
          label="企业名称">
          <template slot="header" slot-scope="scope">
            <el-popover
              placement="bottom"
              width="220"
              trigger="hover">
              <div class="comSearch">
                <el-input v-model="comSearch"
                          size="small"
                          @keyup.enter.native="enter"
                          prefix-icon="el-icon-search"
                          placeholder="请输入内容"></el-input>
                <ul v-if="comList.length > 0"
                    style="padding-top: 8px;border: 1px solid #D6D7DE;border-radius: 4px;margin-top: 10px">
                  <li @click="clickFilter('com',item.companyName)" class="item" v-for="(item, index) in comList" :key="index">
                    {{item.companyName}}
                    <span style="margin-left: 0px" class="span" v-if="item.companyOld">（曾用名：{{item.companyOld}}）</span>
                  </li>
                </ul>
              </div>
              <span slot="reference">企业名称</span>
            </el-popover>
          </template>
          <template slot-scope="scope">
            <router-link style="color: #4378FF;" :to=" '/company/companyInfo/' + 'id/' + scope.row.id">
              {{scope.row.companyName}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="companyCode"
          show-overflow-tooltip
          label="统一社会信用代码">
        </el-table-column>
        <el-table-column
          prop="legalRep"
          width="130"
          show-overflow-tooltip
          label="法定代表人">
        </el-table-column>
        <el-table-column
          prop="price"
          show-overflow-tooltip
          label="注册资本">
        </el-table-column>
        <el-table-column
          prop="date"
          width="120"
          show-overflow-tooltip
          label="成立日期">
        </el-table-column>
        <el-table-column
          prop="region"
          show-overflow-tooltip
          label="所在区域">
        </el-table-column>
        <el-table-column
          prop="companyType"
          show-overflow-tooltip
          label="所属行业">
        </el-table-column>
        <el-table-column
          prop="classify"
          show-overflow-tooltip
          label="企业类型">
        </el-table-column>
      </el-table>
      <el-pagination v-if="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pageNum"
        :page-sizes="[20, 30, 40, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total">
      </el-pagination>
      <!-- 筛选字符的弹窗 -->
      <el-dialog
        :title="filterTitle"
        :visible.sync="filterString"
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
          <el-button size="small" @click="filterString = false">取消</el-button>
          <el-button size="small" type="primary" @click="clickFilter('string')">确定</el-button>
        </span>
      </el-dialog>
      <!-- 筛选数字的弹窗 -->
      <el-dialog
        :title="filterTitle"
        :visible.sync="filterNumber"
        top="30vh"
        width="300px">
        <div class="num">
          <el-radio class="des" v-model="numberRadio" label="ASC">升序</el-radio>
          <el-radio class="ase" v-model="numberRadio" label="DESC">降序</el-radio>
          <div class="num">
            <el-input size="small" v-model="startNum"
                      placeholder="请输入内容">
              <i class="yu" slot="suffix">元</i>
            </el-input>
            至
            <el-input size="small" v-model="endNum"
                      placeholder="请输入内容">
              <i class="yu" slot="suffix">元</i>
            </el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="filterNumber = false">取消</el-button>
          <el-button size="small" type="primary" @click="clickFilter('num')">确定</el-button>
        </span>
      </el-dialog>
      <!-- 筛选日期的弹窗 -->
      <el-dialog
        :title="filterTitle"
        :visible.sync="filterDate"
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
          <el-button size="small" @click="filterDate = false">取消</el-button>
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
    </div>
  </div>
</template>

<script>
/* eslint-disable eqeqeq */

import $ from 'jquery'
import { comSearchRec, getCompanyList, getComQueryParams, saveComBookMark, checkBookName } from '@/utils/api'

export default {
  name: 't_table',
  data () {
    return {
      loading: false,
      bookmarkId: null,
      titleName: '',
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
      dateValue1: null,
      dateValue2: null,

      searchCompany: false, // 搜索公司弹窗
      comSearch: '',
      comList: [],
      filterTitle: '筛选',
      tableData: {},
      filterToolBarList: [], // 筛选条件展示
      queryData: {
        companyName: '',
        queryType: 'COMPANY_INFO', // 查询方式 COMPANY（企业）
        stringFilters: [],
        numFilters: [],
        dateFilters: [],
        sort: {},
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  watch: {
    comSearch (val, oldVal) {
      if (val.trim()) {
        //  企业搜索推荐
        this.searchCompanyItem(val.trim())
      }
    },
    titleName (val, oldVal) {
      if (val.trim()) {
        this.isExistName(val)
      }
    }
  },
  mounted () {
    if (this.$route.params.id === 'sidebar') {
      this.bookmarkId = null
    } else {
      this.bookmarkId = this.$route.params.id
    }
    // 获取企业筛选条件
    this.getComQuery(1)
    // 设置表格的高度
    $('.el-table__body-wrapper').height($(document).height() - 220)
  },
  methods: {
    // 获取企业筛选条件
    getComQuery (val) {
      getComQueryParams({
        bookmarkId: this.bookmarkId
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
          if (val) {
            this.getComList()
          }
        }
      })
    },
    // 公司列表
    getComList () {
      this.loading = true
      getCompanyList(this.queryData).then(response => {
        if (response.code === 200) {
          this.tableData = response.data
          $('.el-table__body-wrapper').height($(document).height() - $('.t_table .filter').height() - 210)
        }
        this.bookmarkId = null
        this.loading = false
        this.getComQuery()
      })
    },
    // 分页页数改变
    handleSizeChange (pageSize) {
      this.queryData.pageSize = pageSize
      this.getComList()
    },
    // 当前页数改变
    handleCurrentChange (pageNum) {
      this.queryData.pageNum = pageNum
      this.getComList()
    },
    // 点击表头筛选弹窗
    onClickHeader (val) {
      this.filterTitle = val.label
      if (val.property === 'companyName') {

      } else if (val.property === 'price') {
        this.filterNumber = true
      } else if (val.property === 'date') {
        this.filterDate = true
      } else {
        this.strSelect = '0'
        this.strValue = null
        this.filterString = true
      }
    },
    // 筛选确定
    clickFilter (type, companyName) {
      this.queryData.sort.name = this.filterTitle
      if (type === 'string') {
        this.queryData.sort.type = this.stringRadio
        let stringFilter = {
          stringFilterName: this.filterTitle, // 字符筛选 列名称
          stringFilter: this.strValue, // 参数
          stringFilterType: this.strSelect // 筛选类型  0：包含，1：不包含
        }
        for (let index in this.queryData.stringFilters) {
          if (this.filterTitle === this.queryData.stringFilters[index].stringFilterName || !this.queryData.stringFilters[index].stringFilter) {
            this.queryData.stringFilters.splice(index, 1)
          }
        }
        if (this.strValue) {
          // 拼接筛选展示条件
          let val = this.strSelect == '0' ? '包含' : '不包含'
          let string = {
            name: this.filterTitle,
            value: '（' + val + '）' + this.strValue,
            type: 'string'
          }
          this.filterToolBarList.push(string)
          this.queryData.stringFilters.push(stringFilter)
        }
        this.filterString = false
      } else if (type === 'num') {
        let numFilter = {
          numFilterName: this.filterTitle, // 数字筛选 列名称
          numFilterFrom: this.startNum, // 数字筛选 开始
          numFilterTo: this.endNum // 数字筛选 结束
        }
        this.queryData.sort.type = this.numberRadio
        if (this.startNum && this.endNum) {
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
        this.queryData.sort.type = this.dateRadio
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
      } else if (type === 'com') {
        this.queryData.companyName = companyName
      }
      this.queryData.pageNum = 1
      this.queryData.pageSize = 20
      this.getComList()
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
      } else if (type === 'com') {
        this.queryData.companyName = null
      }
      this.queryData.pageNum = 1
      this.queryData.pageSize = 20
      this.getComList()
    },
    // 保存企业书签
    saveBookmark () {
      if (this.titleName.trim()) {
        saveComBookMark({
          type: 'COMPANY_INFO',
          name: this.titleName.trim(),
          companyFilter: this.queryData
        }).then(response => {
          if (response.code === 200) {
            this.reMsgDialog = false
            this.reDialog = false
            this.titleName = ''
          }
        })
      }
    },
    //  企业搜索推荐
    searchCompanyItem () {
      comSearchRec({
        companyName: this.comSearch
      }).then(response => {
        if (response.code === 200) {
          this.comList = response.data
        }
      })
    },
    // 判断书签名称是否存在
    isExistName (valName) {
      checkBookName({
        bookmarkType: 'COMPANY_INFO',
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
    // 企业名称搜索筛选
    enter () {
      this.clickFilter('com', this.comSearch)
    },
    //  标题弹窗关闭前
    handleClose () {
      this.reMsgDialog = false
      this.reDialog = false
      this.titleName = ''
    },
    //  搜索弹窗关闭前
    hidePop () {
      this.comSearch = null
    }
  }
}
</script>

<style scoped lang="less">
  .t_table {
    margin: 15px;
    padding: 10px;
    background-color: #fff;
    border-radius: 6px;
    .view {
      cursor: pointer;
      position: absolute;
      top: 85px;
      right: 30px;
    }
    .filter {
      width: 100%;
      padding-right: 100px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      /*height: 50px;*/
      line-height: 40px;
      padding-bottom: 10px;
      background-color: #fff;
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
    }
  }

  .el-popover {
    .comSearch {
      .item {
        cursor: pointer;
        display: block;
        font-size: 14px;
        color: #55585E;
        padding: 8px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        .span {
          display: block;
          text-indent: -8px;
          font-size: 12px;
          color: #55585ecc;
        }
      }
      .item:hover {
        background-color: #4378FF;
        color: #fff;
        text-decoration: none;
        .span {
          background-color: #4378FF;
          color: #fff;
        }
      }
    }
  }
</style>
<style lang="less">
  .company_table {
    .el-pagination {
      .el-pagination__jump {
        cursor: pointer;
      }
      margin-top: 10px;
    }
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
      .reName  {
        margin: 10px 0;
        text-align: center;
        .el-input {
          margin: 0 auto;
          /*width: 85%;*/
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
        width: 40px;
      }
    }
  }
  .el-select-dropdown {
    width: 70px;
    .el-scrollbar ul {
      width: auto;
      .el-select-dropdown__item {
        float: none;
        font-size: 12px;
        padding: 0 10px;
      }
    }
  }
</style>
