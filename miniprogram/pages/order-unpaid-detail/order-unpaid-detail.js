// pages/unpaid-detail/unpaid-detail.js
const db = wx.cloud.database();
const order = db.collection("order")
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {order:null,},
  pageData:{id:null},
  money(a) { if (a == null) { return a = 0 } else { return a } },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '数据加载中',
    })
    this.pageData.id = options.id
    order.doc(this.pageData.id).get().then(res => {
      let key = "totalPrice"
      let totalPrice = 0;
      res.data.price.forEach(ele => {
        totalPrice += ele
      })
      totalPrice = totalPrice + this.money(res.data.wrapPrice) + this.money(res.data.sendPrice) - this.money(res.data.youhui)
      res.data[key] = totalPrice
      this.setData({
        order: res.data
      })
      wx.hideLoading()
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

  submitOrder: function() {


    const time = new Date();
    console.log(time)

    wx.showToast({
      title: '下单成功',
    })
    order.doc(this.pageData.id).update({
      data:{
        // "_openid': 'oR-HI5f8-bckzj2pbGo30KNwRhkk',
        orderTime: time
      },
    }).then(res=>{
      
      wx.switchTab({
        url: '../order/order',
      })
    })

    // order.add({
    //     data: {
    //       store: "泰园餐厅",
    //       storeID: null,
    //       dishID: ["王八生煎", "牛鞭"],
    //       dishnum: [10, 5],
    //       price: [150, 250],
    //       paid: false,
    //       done: false,
    //       orderTime: new Date(),
    //       wrapPrice: 4,
    //       sendPrice: 3,
    //       stu:"高剑雄"
    //     }
    //   })
    //   .then(res => {
    //     console.log(res)
    //   })
    //   .catch(console.error)

  }
})