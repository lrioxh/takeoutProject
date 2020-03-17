// pages/reviews/reviews.js
const db = wx.cloud.database();
const _ = db.command;
const order = db.collection("order");

var _app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    review_img:[
      {
        src:""
      }
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    order.where({
      storeID: _app.globalData.openid,
    }).get().then(res =>{
      var allData = res.data;
      var i = 0;
      for (i = 0; i < res.data.length; i++){
        var orderStTime = allData[i].orderTime
        // console.log(orderStTime)
        var order_date = orderStTime.getFullYear() + "-" + (orderStTime.getMonth() + 1) + "-" + orderStTime.getDate();
        var order_time = orderStTime.getHours() + ':' + orderStTime.getMinutes() + ':' + orderStTime.getSeconds()
        var time = [order_date, order_time]
        allData[i].orderTime = time
      }
      this.setData({
        orderDetails: allData,
      })
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