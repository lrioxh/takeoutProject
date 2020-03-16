// pages/unpaid-detail/unpaid-detail.js
const db = wx.cloud.database();
const order = db.collection("order")
const rider = db.collection("rider")
const app = getApp();

Page({
  data: {
    pageid:null,
    order:null,  // 订单
    userInfo: '',// 用户 信息
    orderStatus: 1,   // 0未付款 1已接单 2派送中 3已完成 4订单已取消
    // 骑手&&客户位置
    markers: [
      {
        iconPath: "../../imgs/qishou.png",
        id: 0,
        latitude: 31.60,
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
    order.doc(e.id).get().then(res=>{
      console.log(res)
      var stss=0;
      if (res.data.paid == false && res.data.cancel == false){stss=0}
      if (res.data.isTaken == true && res.data.rider==null && res.data.cancel == false) { stss = 1 }
      if (res.data.isTaken == true && res.data.rider != null && res.data.cancel == false) { stss = 2 }
      if (res.data.done == true) { stss = 3 }
      if (res.data.cancel == true) { stss = 4 }
      let d = res.data.orderTime
      let resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
      let resTime = "-"+this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
      res.data.orderTime = resDate + resTime
      this.setData({
        order:res.data,
        orderStatus:stss
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
    if (this.data.orderStatus == 1) {
      var shopAddress = [
        {
          iconPath: "../../imgs/shop.png",
          id: 0,
          name: '店家地址',
          desc: '店家地址',
          latitude: 31.59,
          longitude: 120.30,
          width: 40,
          height: 40,
          callout: {
            content: '店家地址',
            display: 'ALWAYS',
            borderRadius: 2,
            bgColor: '#ffe400',
            padding: 10
          },
        }];
      var callout = [  {       } ]
      this.setData({
        markers: shopAddress,
        polyline: ''
      })
    }
    var that = this
    wx.getLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          location: {
            longitude: res.longitude,
            latitude: res.latitude
          }
        })
      }
    })
  },

// 地图
  regionchange(e) {
    console.log(e.type)
  },

  markertap(e) {
    console.log(e.markerId)
  },

  controltap(e) {
    console.log(e.controlId)
  },

//--------------------------------------------------------------------------------
//--------------------------------------------------------------------------------
// 联系骑手
callRider:function(){
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
    phoneNumber: '18316588252',
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
  cancel:function(){
    wx.showModal({
      title: '取消订单',
      content: '您确定要取消订单嘛',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          db.collection("order").doc(this.data.orderid).update({
            data: {
              // doneTime: event.doneTime,//订单完成时间
              cancel: true//订单状态
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
  gotoapply:function(){
    wx.navigateTo({
      url: '../order-pay/order-pay?id=' + this.data.pageid,
    })
  },
// 申请退款
  cancelApply: function () {
    wx.navigateTo({
      url: '../order-moneyback/order-moneyback?id='+this.data.pageid,
    })
  },
// 评价订单
  toEvaluate: function () {
    wx.navigateTo({
      url: '../order-evaluate/order-evaluate?id=' + this.data.pageid,
    })
  },
  // 再来一单
  again:function(){
    wx.redirectTo({
      url: '../order-submit/order-submit?id='+this.data.pageid,
    })
  }
})
 