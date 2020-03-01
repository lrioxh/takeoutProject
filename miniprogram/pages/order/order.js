// pages/order/order.js

// order = db.collection('dish')
var app = getApp()
Page({
  data: {
    // 页面配置
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,

    orderlist: [
      {
        "id": 55172,
        "name": `王八生煎`,
        "time": '2020-2-22',
        "image": "../../img/food.jpg",
        value: 60,
      },
      {
        "id": 57039,
        "name": `王八生煎`,
        "time": '2020-2-23',
        "image": "../../img/food.jpg", 
        value: 70,
      },
      {
        "id": 14336,
        "name": `王八生煎`,
        "time": '2020-2-24',
        "image": "../../img/food.jpg", 
        value: 10,
      },
      {
        "id": 56817,
        "name": `王八生煎`,
        "time": '2020-2-24',
        "image": "../../img/food.jpg",
        value: 20,
      },
      {
        "id": 57256,
        "name": `王八生煎`,
        "time": '2020-2-25',
        "image": "../../img/food.jpg",
        value: 50,
      },
      {
        "id": 57253,
        "name": `王八生煎`,
        "time": '2020-2-29',
        "image": "../../img/food.jpg",
        value: 50,
      }

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        this.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
  },

  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    }
    else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

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
  gotopeisongdetail:function(){
    wx.redirectTo({
      url: '../order-peisong-detail/order-peisong-detail',
    })
  },
  gotocanceldetail:function(){
    wx.redirectTo({
      url: '../order-cancel-detail/order-cancel-detail',
    })
  }
})