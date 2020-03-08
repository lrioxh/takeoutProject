// pages/order-peisong-detail/order-peisong-detail.js
const db = wx.cloud.database();
const rider = db.collection("rider")
const order = db.collection("order")
Page({
  data: {
    longitude: null,
    latitude: null,
    accuracy: null,
    markers: [{
        id: 0,
        latitude: null,
        longitude: null,
        width: 30,
        height: 30,
        title: 'aaa'
      },
      {
        id: 1,
        latitude: null,
        longitude: null,
        width: 30,
        height: 30,
      }
    ],
    time: '14:10',
    order: null,
  },
  // 把数字 x 格式化为 0x
  p(s) {
    return s < 10 ? '0' + s : s
  },
  pageData:{
    id:null,
  },
  money(a) {
    if (a == null) {
      return a = 0
    } else {
      return a
    }
  },
  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    var _this = this
    wx.showLoading({
      title: '数据加载中',
    })
    _this.pageData.id = options.id
    order.doc(_this.pageData.id).get().then(res => {
      let key = "totalPrice"
      let totalPrice = 0;
      // 总价
      for (let j = 0; j < res.data.dish.length; j++) {
        totalPrice += res.data.dish[j].price
      }
      totalPrice = totalPrice + _this.money(res.data.wrapPrice) + _this.money(res.data.sendPrice) - _this.money(res.data.coupon)
      res.data[key] = totalPrice
      _this.setData({
        order: res.data
      })
      wx.hideLoading()
    })
    wx.getLocation({
      type: "wgs84",
      success: function(res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        rider.get().then(res => {
          var rider_latitude = res.data[0].location.latitude;
          var rider_longitude = res.data[0].location.longitude;
          _this.setData({
            latitude: latitude,
            longitude: longitude,
            markers: [{
                latitude: latitude,
                longitude: longitude
              },
              {
                latitude: rider_latitude,
                longitude: rider_longitude
              }
            ]
          })
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 测试使用
  logfsdf: function() {
    console.log(this.data.markers)
  }
})