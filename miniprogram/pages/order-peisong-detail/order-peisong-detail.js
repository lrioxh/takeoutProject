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
    // 获取位置信息
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
              // 第二个位置标点
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
  // 取消订单
  cancelOrder:function(){
    wx.showModal({
      title: '取消订单',
      content: '您确定要取消订单吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '返回中'
          })
          wx.switchTab({
            url: '../order/order',
          })
          wx.hideLoading()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 修改配送地址
  updateOrder: function () {
    var _this = this
    if (_this.data.order.addr == null) {
      wx.showToast({
        title: '您已选择自取！',
        image: "../../imgs/img1/about_us.png",
        duration: 1500
      })
    } else {
      wx.chooseLocation({
        success: function (res) {
          wx.showLoading({
            title: '修改地址中',
          })
          order.doc(_this.pageData.id).update({
            data: {
              addr: res
            },
            success: console.log,
          })
          wx.hideLoading()
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
    }
  },
})