// pages/order/order.js
const db = wx.cloud.database();
const order = db.collection('order')
const images = require('../../utils/images.js')
const app = getApp()
Page({
  data: {
    searchInfo: null,
    // 搜索信息
    loading: false, //上拉加载更多的loading
    refreshLoading: false, //下拉刷新页面的loading
    orders: null,
    // tab切换  
    currentTab: 0,
    // 加载全部
    haveLoadAll: true,
    // 搜索后
    // 图片地址
    images:images,
    openid:null
  },

  onLoad: function(options) {
    wx.cloud.callFunction({
      name: "login",
      complete: res => {
        console.log(res.result)
        this.setData({
          openid : res.result.openid
        })
      }
    })
    var _this = this
    _this.initorders()
    console.log(_this.data.images)
  },
  // --------------------------------------------------------------------------------
  // 下拉刷新部分
  initorders: function () {
    var _this = this
    wx.showLoading({
      title: '数据加载中',
    })
    _this.setData({
      refreshLoading: true,
      haveLoadAll: true
    })
    setTimeout(() => {
      _this.setData({
        orders: [],
      })
      console.log(app.globalData.openid)
      order.where({
        _openid: app.globalData.openid
      }).orderBy('orderTime', 'desc').get().then(res => {
        _this.setData({
          refreshLoading: false,
        })
        var that = this;
        let key = "value";
        let value = 0;
        let orderTime = 'orderTime';
        let sum = "sum";
        let number = 0;
        console.log(res.data)
        for (let i = 0; i < res.data.length; i++) {
          // res.data.length
          // 计算菜品总价
          for (let j = 0; j < res.data[i].dish.length; j++) {
            value += res.data[i].dish[j].price
            number += res.data[i].dish[j].num
            res.data[i][key] = value
            res.data[i][sum] = number
          }
          value = 0;
          number = 0;
          // 计算时间，表示成xx-xx-xx形式
          let d = res.data[i].orderTime
          let resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
          // let resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
          res.data[i][orderTime] = resDate
        }
        console.log(res.data)
        this.setData({
          orders: res.data
        }, res => {
          wx.hideLoading();
          this.pageData.skip = 0
        })
      })
    }, 1200)
  },
  loadmore: function () {
    let _this = this;
    if (this.data.haveLoadAll === true && this.data.orders.length == 20) {
      wx.vibrateShort()
      wx.showLoading({
        title: '玩命加载中…'
      })
    }
    if (_this.data.orders.length < 20) {
      _this.pageData.skip = _this.data.orders.length
    }
    order.skip(_this.pageData.skip).where({
      _openid: app.globalData.openid
    }).get().then(res => {
      console.log(res)
      if (res.data.length == 0) {
        console.log("alldone")
        this.setData({
          haveLoadAll: false
        })
        // haveLoadAll
        wx.hideLoading();
      } else {
        var that = this;
        let key = "value";
        let value = 0;
        let orderTime = 'orderTime';
        for (let i = 0; i < res.data.length; i++) {
          // res.data.length
          // 计算菜品总价
          for (let j = 0; j < res.data[i].dish.length; j++) {
            value += res.data[i].dish[j].price
            res.data[i][key] = value
          }
          value = 0;
          // 计算时间，表示成xx-xx-xx形式
          let d = res.data[i].orderTime
          let resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
          // let resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
          res.data[i][orderTime] = resDate
        }
        let oldData = _this.data.orders;
        var order = oldData.concat(res.data)
        _this.setData({
          orders: order
        }, res => {
          _this.pageData.skip = _this.pageData.skip + 20
          console.log(_this.pageData.skip)
          wx.hideLoading();
        })
      }
    })
  },
  // ------------------------------------------------------------------------------
  // 搜索历史订单
  searchInput: function (e) {
    this.setData({
      searchInfo: e.detail.value
    })
  },
  search: function () {
    wx.showLoading({
      title: '搜索中',
    })
    order.where({
      _openid: app.globalData.openid
    }).get().then(res => {
      console.log(res)
    })
    wx.hideLoading()
    wx.navigateTo({
      url: '../order-search/order-search?info=' + this.data.searchInfo,
    })
    this.setData({
      searchInfo: null
    })
  },
  //-----------------------------------------------------------------------------------
  //-----------------------------------------------------------------------------------
  // 滑动切换tab   
  bindChange: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  //点击tab切换 
  swichNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // ---------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------
  // 页面跳转
  // 订单详情
  gotoDetail: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../order-detail/order-detail?id=' + [e.currentTarget.id],
    })
  },
  // 再来一单
  orderagain: function(e) {
    console.log(e)
    wx.redirectTo({
      url: '../order-submit/order-submit?id=' + [e.target.id],
    })
  },
  
  // 跳过20个开始加载菜品
  pageData: {
    skip: 20
  },
  // x >>>>>>>>0x
  p(s) {
    return s < 10 ? '0' + s : s
  },

})