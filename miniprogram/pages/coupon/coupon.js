// pages/coupon/coupon.js
var that;
var app = getApp();
const db = wx.cloud.database();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon: [],
    date: new Date().getTime()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // var coupons = [];
    that.getData();
  },

  /**
   * 获取列表数据
   * 
   */
  getData: function () {
    db.collection('coupon')
      .where({
        user: app.globalData.openid,
      })
      .orderBy('dateEnd', 'desc')
      .get({
        success: function (res) {
          that.data.coupon = res.data;
          // console.log('2', that.data.coupon);
          for (var i in that.data.coupon) {
          that.getstoreInfo(i);
          }
          console.log(that.data.coupon)
        },
      })

  },
  /**
   * 获取coupon商家信息
   */
  getstoreInfo: function (i) {
    // var storeInfo = {};
    // for (var i = 0; i < that.data.collects.length; i++) {
    
      var storeId = that.data.coupon[i].item;
      // console.log('2',i)
      db.collection('store')
        .doc(storeId)
        .get({
          success: function (res) {
            // console.log('i',i)
            var dateTemp = that.data.coupon[i].dateEnd;
            that.data.coupon[i].dateNum = dateTemp.getTime();
            that.data.coupon[i].name=res.data.name;
            that.data.coupon[i].img = res.data.img;
            that.data.coupon[i].dateEnd = dateTemp.toLocaleString();
            // console.log('1', that.data.coupon)
            that.setData({
              coupon: that.data.coupon,
            })
          },
          fail: console.log
        })
  },
  /**
 * item 点击
 */
  onItemClick: function (e) {
    var id = e.currentTarget.dataset.storeid;
    console.log(e);
    wx.redirectTo({
      url: "?id=" + id
    })
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

  }
})