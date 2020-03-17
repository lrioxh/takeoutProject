// pages/unpaid-detail/unpaid-detail.js
const db = wx.cloud.database();
const order = db.collection("order")
const rider = db.collection("rider")
const app = getApp();

Page({
  data: {
    rider:null,
    location: {},
    pageid: null,
    order: null, // 订单
    userInfo: '', // 用户 信息
    orderStatus: 1, // 0未付款 1已接单 2派送中 3已完成 4订单已取消 5等待商家接单
    // 骑手0&&1客户位置
    markers: [{
      iconPath: "../../imgs/qishou.png",
      id: 0,
      latitude: 31.5,
      longitude: 120.30,
      width: 40,
      height: 40
    },
    {
      id: 1,
      latitude: 31.49,
      longitude: 120.306122,
      width: 40,
      height: 40
    }
    ],
    polyline: [{
      points: [{
        latitude: 31.60,
        longitude: 120.30,
      }, {
        latitude: 31.49,
        longitude: 120.306122,
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
  },
  // x >>>>>>>>0x
  p(s) {
    return s < 10 ? '0' + s : s
  },
  onLoad: function (e) {
    var that = this;
    this.setData({
      pageid: e.id
    })
    order.doc(e.id).get().then(res => {
      console.log(res)
      var stss = 0;
      if (res.data.paid == false && res.data.cancel == false) {
        stss = 0
      }
      if (res.data.paid == true && res.data.cancel == false && res.data.isTaken_store == false) {
        stss = 5
      }
      if (res.data.isTaken_store == true && res.data.isTaken_rider == false && res.data.cancel == false) {
        stss = 1
      }
      if (res.data.isTaken_rider == true && res.data.cancel == false) {
        stss = 2
      }
      if (res.data.done == true && res.data.cancel == false) {
        stss = 3
      }
      if (res.data.cancel == true) {
        stss = 4
      }
      let d = res.data.orderTime
      let resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
      let resTime = "   " + this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
      res.data.orderTime = resDate + resTime
      this.setData({
        order: res.data,
        orderStatus: stss
      })
      rider.where({ openid: this.data.order.rider_Detail}).get().then(res => {
        console.log(res.data[0])
        this.setData({
          rider:res.data[0]
        })
        console.log(this.data.rider.name)
        wx.getLocation({
          success: function (res) {
            console.log(res)
            var riderlongitude = res.longitude + 0.01
            var riderlatitude = res.latitude + 0.01
            console.log(riderlongitude)
            console.log(riderlatitude)
            that.setData({
              hasLocation: true,
              location: {
                longitude: res.longitude,
                latitude: res.latitude
              },
              markers: [{
                iconPath: "../../imgs/qishou.png",
                id: 0,
                latitude: riderlatitude,
                longitude: riderlongitude,
                width: 40,
                height: 40
              }, {
                id: 1,
                latitude: res.latitude,
                longitude: res.longitude,
                width: 40,
                height: 40
              }],
              polyline: [{
                points: [{
                  latitude: riderlatitude,
                  longitude: riderlongitude,
                }, {
                  latitude: res.latitude,
                  longitude: res.longitude,
                }],
                color: "#ffa844",
                width: 3,
              }]
            })
          }
        })
        console.log(this.data)
      })
    })
    wx.getUserInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          userInfo: res.userInfo
        })
      }
    })
  },

  // 地图
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  // 联系骑手
  callRider: function () {
    wx.makePhoneCall({
      phoneNumber: '18316588252',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  // 联系商家
  callStore: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.order.store_tel,
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  //--------------------------------------------------------------------------------
  //--------------------------------------------------------------------------------
  // 取消订单
  cancel: function () {
    wx.showModal({
      title: '取消订单',
      content: '您确定要取消订单嘛',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          db.collection("order").doc(this.data.orderid).update({
            data: {
              // doneTime: event.doneTime,//订单完成时间
              cancel: true //订单状态
            }
          })
          setTimeout(function () {
            wx.showLoading({
              title: '订单取消中',
            })
            wx.switchTab({
              url: "../order/order"
            })
          }, 500)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 去支付
  gotoapply: function () {
    wx.navigateTo({
      url: '../order-pay/order-pay?id=' + this.data.pageid,
    })
  },
  // 申请退款
  cancelApply: function () {
    wx.navigateTo({
      url: '../order-moneyback/order-moneyback?id=' + this.data.pageid,
    })
  },
  // 评价订单
  toEvaluate: function () {
    wx.navigateTo({
      url: '../order-evaluate/order-evaluate?id=' + this.data.pageid,
    })
  },
  // 再来一单
  again: function () {
    wx.redirectTo({
      url: '../order-submit/order-submit?id=' + this.data.pageid,
    })
  }
})