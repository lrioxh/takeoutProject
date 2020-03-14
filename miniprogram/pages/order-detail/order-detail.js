// pages/unpaid-detail/unpaid-detail.js
const db = wx.cloud.database();
const order = db.collection("order")
const app = getApp();
Page({
  data: {
    pageid:null,
    order:null,  // 订单
    userInfo: '',// 用户 信息
    orderStatus: 3,   // 0未付款 1已接单 2派送中 3已完成 4订单已取消
    // 骑手&&客户位置
    markers: [
      {
        iconPath: "../../imgs/qishou.png",
        id: 0,
        latitude: 23.099994,
        longitude: 113.324520,
        width: 40,
        height: 40
      },
      {
        iconPath: "../../imgs/me.jpg",
        id: 1,
        latitude: 23.090094,
        longitude: 113.324520,
        width: 40,
        height: 40
      }
    ],
    polyline: [{
      points: [{
        longitude: 113.324520,
        latitude: 23.099994
      }, {
        longitude: 113.324520,
        latitude: 23.090094
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
  },
  //获取当前位置
  onLoad: function (e) {
    var that = this;
    this.setData({
      pageid: e.id
    })
    order.doc(e.id).get().then(res=>{
      console.log(res)
      this.setData({
        order:res.data
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
          latitude: 23.099994,
          longitude: 113.324520,
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
      var callout = [
        {

        }
      ]
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
// 申请退款
  cancelApply: function () {
    wx.navigateTo({
      url: '../cancelorder/applyRefund?id='+this.data.pageid,
    })
  },
// 评价订单
  toEvaluate: function () {
    wx.navigateTo({
      url: '../evaluate/evaluate?id=' + this.data.pageid,
    })
  },
  // 再来一单
  again:function(){
    wx.redirectTo({
      url: '../order-submit/order-submit?id='+this.data.pageid,
    })
  }
})
 