// pages/order/order.js
const db = wx.cloud.database();
const order = db.collection('order')
var app = getApp()
Page({
  // 搜索历史订单
  searchInput:function(e){
    this.setData({
      searchInfo:e.detail.value
    })
  },
  search:function(){
    wx.showLoading({
      title: '搜索中',
    })
    console.log(app.globalData.openid)
    order.where({
      _openid: app.globalData.openid
    }).where({
    }).get().then(res => {
      console.log(res)
    })
    wx.hideLoading()
    wx.navigateTo({
      url: '../order-search/order-search?info='+this.data.searchInfo,
    })
    this.setData({
      searchInfo:null
    })
  },
  data: {
    searchInfo:null,
    // 搜索信息
    loading: false, //上拉加载更多的loading
    refreshLoading: false, //下拉刷新页面的loading
    orders: null,
    // tab切换  
    currentTab: 0,
    // 加载全部
    haveLoadAll: true,
    // 搜索后
  },
  
  onLoad: function (options) {
    // 获取所有订单信息
    this.initorders()
  },
//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------
  // 滑动切换tab   
  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },
  //点击tab切换 
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    }
    else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
// ---------------------------------------------------------------------------------
// --------------------------------------------------------------------------------
  // 下拉刷新部分
  initorders: function () {
    wx.showLoading({
      title: '数据加载中',
    })
    this.setData({
      refreshLoading: true,
      haveLoadAll:true
    })
    setTimeout(() => {
      this.setData({
        orders: [],
        refreshLoading: false,
      })
      order.where({
        _openid: app.globalData.openid
      }).get().then(res => {
        // console.log(res)
        var that = this;
        let key = "value";
        let value = 0;
        let orderTime = 'orderTime';
        for (let i = 0; i < res.data.length ; i++) {
          // res.data.length
          // 计算菜品总价
          for(let j=0; j<res.data[i].dish.length ; j++){
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
        console.log(res.data)
        this.setData({
          orders: res.data
        }, res => {
          wx.hideLoading();
          this.pageData.skip=0
        })
      })
    }, 1000
    )
  },
  loadmore: function () {
    let _this = this;
    if (this.data.haveLoadAll===true&&this.data.orders.length==20){
      wx.vibrateShort()
      wx.showLoading({
        title: '玩命加载中…'
      })
    }
    if (_this.data.orders.length <20 ){
      _this.pageData.skip = _this.data.orders.length
    }
    order.skip(_this.pageData.skip).where({
      _openid: app.globalData.openid
    }).get().then(res => {
      console.log(res)
      if (res.data.length==0){
        console.log("alldone")
        this.setData({
          haveLoadAll:false
        })
        // haveLoadAll
        wx.hideLoading();
      }
      else{
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
// ------------------------------------------------------------------------------
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  /**
   * 获取云数据库订单信息
   */
  getorderlist:function(){
  },
  // 页面跳转
  gotopeisongdetail:function(){
    wx.redirectTo({
      url: '../order-peisong-detail/order-peisong-detail',
    })
  },

  // 立即支付
  gotosubmitedpay:function(e){
    console.log(e)
    wx.redirectTo({
      url: '../order-submited-pay/order-submited-pay?id=' + [e.target.id],
    })
  },
  // 弹窗确认取消订单
  // js得去components的dialog改！！
  openConfirm: function (e) {
    console.log(e)
    wx.showModal({
      title: '取消订单',
      content: '您确定要取消订单，并申请退款吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '返回中'
          })
          wx.redirectTo({
            url: '../order-cancel-cus/order-cancel-cus?id='+e.target.id,
          })
          wx.hideLoading()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 查询有多少菜品
  queryOrder: function () {
    order.where()
  },
  // 跳过20个开始加载菜品
  pageData: {
    skip: 20
  },
  // x >>>>>>>>0x
  p(s) {
    return s < 10 ? '0' + s : s
  },
  
  //order页面的函数由component中的dialog执行
  sendToDialog(){
    wx.showLoading({
      title: '加载中',
    })
    const id = this.data.tempid
    setTimeout(function () {
      wx.redirectTo({
        url: '../order-cancel-cus/order-cancel-cus?id=' + [id],
      })
      setTimeout(function(){
        wx.hideLoading()
      },100)
    }, 100)
  },
  // 订单详情
  gotoDetail:function(e){
    console.log(e)
    wx.redirectTo({
      url: '../order-peisong-detail/order-peisong-detail?id=' + [e.currentTarget.id],
    })
  },
})

