// pages/unpaid-detail/unpaid-detail.js
const db = wx.cloud.database();
const order = db.collection("order")
const app = getApp();
Page({
  data: {
    order: null,
    view1st: "#eee",
    view2nd: "red",
    view1Color: "black",
    view2Color: "white",
    textdecration: "none",
    orderlocation: null,
    isLocation: false,
  },
  pageData: { id: null },
  money(a) {
    if (a == null) { return a = 0 } else {
      return a
    }
  },

  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
    })
    this.pageData.id = options.id
    order.doc(this.pageData.id).get().then(res => {
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
      wx.hideLoading()
    })
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () { },
  // 提交订单函数
  update_set_Order: function () {
    var _this = this;
    var time111 = new Date();
    wx.showLoading({
      title: '订单提交中',
    })
    if (this.data.isLocation == false) {
      var address = _this.data.orderlocation
    } else {
      var address = null
    }
    order.doc(_this.pageData.id).set({
      data: {
        addr: address,
        arriveTime: time111,
        fetchTime: time111,
        orderTime: time111,
        store: "泰园餐厅",
        storeID: "fdfdsfdsgfdsg",
        comment: "还行，米饭太软了",
        storeID: null,
        dishID: ["番茄炒蛋", "水煮牛蛙"],
        dishnum: [1, 1],
        price: [15, 50],
        paid: false,
        done: false,
        isTaken: false,
        wrapPrice: 5,
        sendPrice: 3,
        stu: "孔可赛",
        stuID: "4cgdfg325htg8ct8sfgcvtc834hc8",
        rate: 4,
        tel: 15725055202,
        coupon: 4
      },
    }).then(res => {
      wx.showToast({
        title: '提价成功',
      })
      setTimeout(function () {
        wx.switchTab({
          url: '../order/order',
        })
      }, 100)
    })
  },
  // 提交订单
  submitOrder: function () {
    if (this.data.isLocation == true || (this.data.isLocation == false && this.data.orderlocation != null)) {
      this.update_set_Order();
      console.log("123")
    }
    else {
      wx.showToast({
        title: ' 请选择地址！ ',
        image: "../../imgs/img1/about_us.png",
        duration: 1500
      })
    }


  },
  //--------------------------------------------------------------------------------------------------------------
  // 选择到店自取or外卖配送
  // 到店自取
  choose1st: function () {
    wx.showLoading({
      title: '切换中',
    })
    let key = "totalPrice"
    let totalPrice = 0;
    let order = this.data.order;
    order.price.forEach(ele => {
      totalPrice += ele
    })
    totalPrice = totalPrice + this.money(order.wrapPrice) - this.money(order.coupon)
    order[key] = totalPrice
    this.setData({
      order: order,
      view1st: "red",
      view2nd: "#eee",
      view1Color: "white",
      view2Color: "black",
      textdecration: "line-through",
      isLocation: true,
    })
    wx.hideLoading()
  },
  // 外卖配送
  choose2nd: function () {
    wx.showLoading({
      title: '切换中',
    })
    let key = "totalPrice"
    let totalPrice = 0;
    let order = this.data.order;
    order.price.forEach(ele => {
      totalPrice += ele
    })
    totalPrice = totalPrice + this.money(order.wrapPrice) + this.money(order.sendPrice) - this.money(order.coupon)
    order[key] = totalPrice
    this.setData({
      order: order,
      view1st: "#eee",
      view2nd: "red",
      view1Color: "black",
      view2Color: "white",
      textdecration: "none",
      isLocation: false,
    })
    wx.hideLoading()
  },
  //--------------------------------------------------------------------------------------------------------------
  // 获取优惠券信息
  gotoCoupin: function () {
    wx.showActionSheet({
      itemList: ['A', 'B', 'C', "d", "g", "g"],
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  // 获取地址
  getLocation: function () {
    var _this = this
    wx.chooseLocation({
      success: function (res) {
        _this.setData({
          orderlocation: res
        })
      },
    })
  }
})