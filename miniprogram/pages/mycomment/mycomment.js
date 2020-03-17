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
        comment_store: _.gt('')  //评价非空
      })
      .orderBy('orderTime', 'desc')
      .field({
        comment_rider: 1,
        comment_store: 1,
        dish: 1,
        orderTime: 1,
        rate: 1,
        storeID: 1,
        reply: 1,
      })
      .get({
        success: function (res) {
          that.data.comment = res.data;
          console.log('2', that.data.comment);
          for (var i in that.data.comment) {
            that.data.comment[i].dishes = [];
            for (var j in that.data.comment[i].dish) {
              that.data.comment[i].dishes.push(that.data.comment[i].dish[j].name)
            }
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
          // console.log(res)
          that.data.comment[i].time = that.data.comment[i].orderTime.toDateString();
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
      url: "../shop/shop?id=" + id
    })
  }
})