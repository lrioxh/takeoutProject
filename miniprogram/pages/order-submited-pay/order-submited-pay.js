// pages/ordersubmited/ordersubmited.js
const db = wx.cloud.database();
const order = db.collection('order')
const $ = db.command.aggregate
Page({

  /**
   * 页面的初始数据
   */
  data: {
    a: '15:00',
  },

  /**
   * 生命周期函数--监听页面加载
   */

  p(s) {
    return s < 10 ? '0' + s : s
  },
  fidngsd:function(){



    order.field({
      orderTime:true,
    }).get().then(res => {
      console.log(res)
    })
    // var myDate = new Date();
    // var a = myDate.dateToString({
    //   data:"date",
    //   format:"%Y-%m-%d"
    
    // var b = myDate.getDay()+1 $date
    // var c = myDate.getMonth()+1
    // var d = myDate.getFullYear()
    // var e = d+"-"+c+"-"+b
    // console.log(a)
  },

  onLoad: function (options) {

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