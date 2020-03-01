// pages/order-peisong-detail/order-peisong-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: null,
    latitude: null,
    accuracy:null,
    markers: [{
      id: 0,
      latitude: null,
      longitude: null,
      width: 30,
      height: 30
    }],
    time: '14:10',
    orderlist: [
      {
        "id": 55172,
        "name": `王八生煎`,
        "time": '2020-2-22',
        "number": 1,
        price: 15
      },
      {
        "id": 57039,
        "name": `王八生煎`,
        "time": '2020-2-23',
        "number": 2,
        price: 30
      },
      {
        "id": 14336,
        "name": `王八生煎`,
        "time": '2020-2-24',
        number: 3,
        price: 45
      },

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude,
          markers: [{
            latitude: latitude,
            longitude: longitude
          }]
        })
      }
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