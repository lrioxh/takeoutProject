// pages/ordercanceldetail/ordercanceldetail.js
const db = wx.cloud.database();
const order = db.collection('order')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
  },

  pageData: {id: null},
  money(a) {if (a == null) {return a = 0} else {return a}},

  onLoad: function(options) {
    this.pageData.id = options.id
    order.doc(options.id)
      .get()
      .then(res => {
        let key = "totalPrice"
        let totalPrice = 0;
        for (let j = 0; j < res.data.dish.length; j++) {
          totalPrice += res.data.dish[j].price
        }
        totalPrice = totalPrice + this.money(res.data.wrapPrice) + this.money(res.data.sendPrice) - this.money(res.data.coupon)
        res.data[key] = totalPrice
        this.setData({
          order: res.data
        })
      })
  },

  goToOrder: function() {
    wx.showLoading({
      title: '返回中'
    })
    wx.switchTab({
      url: '../order/order',
    })
    wx.hideLoading()
  },

  // 重新下单
  gotounpaiddetail: function() {
    wx.showLoading({
      title: '重新下单'
    })
    wx.redirectTo({
        url: '../order-unpaid-detail/order-unpaid-detail?id=' + this.pageData.id ,
    })
    wx.hideLoading()
  }

})