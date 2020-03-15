const db = wx.cloud.database();
const order = db.collection("order")
const coupon = db.collection("coupon")
const app = getApp();
Page({
  data: {
    // openid: null, // 用户的openid

    pageid: null, // 订单id
    order: null, // 订单详情
  },
  onLoad: function(e) {
    // wx.cloud.callFunction({
    //   name: "login",
    //   complete: res => {
    //     console.log(res.result)
    //     this.setData({
    //       openid: res.result.openid
    //     })
    //   }
    // })
    console.log(e)
    // 判断是否为重新下单
    // 为再来一单情形
    if (e.id != null) {
      this.setData({
        pageid: e.id
      })
      order.doc(e.id).get().then(res => {
        console.log(res)
        this.setData({
          order: res.data
        })
      })
    }
    // 为新订单情形
    else {
      var orderdata = JSON.parse(e.data)
      console.log(orderdata)
      var orderTime = new Date();
      var dish = [];
      var totalPrice = 0;
      for (let i = 0; i < orderdata.goods.length; i++) {
        dish[i] = orderdata.goods[i]
        totalPrice += dish[i].price
      }
      totalPrice = totalPrice + orderdata.sendPrice + orderdata.wrapPrice
      this.setData({
        order: {
          dish: dish,
          orderTime: orderTime,
          tel: orderdata.tel,
          hall: orderdata.window.place, // 餐厅名
          store: orderdata.window.name, // 商家名
          storeID: orderdata.window._id, // 商家id
          storeLogo: orderdata.window.img, // 商家logo
          sendPrice: orderdata.sendPrice, // 配送费
          wrapPrice: orderdata.wrapPrice, // 打包费
          totalPrice: totalPrice
        }
      })
      console.log(this.data.order)
    }
    coupon.where({
      user: app.globalData.openid
    }).get().then(res => {
      console.log(res)
    })


  },
  // 联系商家
  calling: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.order.tel,
      success: function() {
        console.log("拨打电话成功！")
      },
      fail: function() {
        console.log("拨打电话失败！")
      }
    })
  },
  // 查看红包
  toMyPackage: function() {
    wx.navigateTo({
      url: '../myPackage/myPackage',
    })
  },
  // 查看我的地址
  toMyAddress: function() {
    wx.navigateTo({
      url: '../address/address',
    })
  },

  // 提交订单
  submitOrder: function() {
    let _order = this.data.order
    order.add({
      data: {
        dish: _order.dish,
        orderTime: _order.orderTime,
        tel: _order.tel,
      }
    })
  }
})