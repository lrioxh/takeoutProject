// pages/mycomment/mycomment.js
var that;
var app = getApp();
const db = wx.cloud.database();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: [],
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    that = this;
    // var comments = [];
    that.getData();
  },

  /**
   * 获取列表数据
   * 
   */
  getData: function () {
    db.collection('order')
      .where({
        stuID: app.globalData.openid,
      })
      .orderBy('fetchTime', 'desc')
      .field({
        comment: 1,
        dishID: 1,
        fetchTime: 1,
        rate: 1,
        storeID: 1,
      })
      .get({
        success: function (res) {
          that.data.comment = res.data;
          // console.log('2', that.data.comment);
          for (var i in that.data.comment) {
            that.getstoreInfo(i);
          }
          console.log(that.data.comment)
        },
      })

  },
  /**
   * 获取comment商家信息
   */
  getstoreInfo: function (i) {
    // var storeInfo = {};
    // for (var i = 0; i < that.data.collects.length; i++) {

    var storeId = that.data.comment[i].storeID;
    // console.log('2',i)
    db.collection('store')
      .doc(storeId)
      .get({
        success: function (res) {
          that.data.comment[i].time = that.data.comment[i].fetchTime.toDateString();
          that.data.comment[i].name = res.data.name;
          that.data.comment[i].img = res.data.img;
          // console.log('1', that.data.comment)
          that.setData({
            comment: that.data.comment,
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
    wx.navigateTo({
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