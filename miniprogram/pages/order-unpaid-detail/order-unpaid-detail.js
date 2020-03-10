// pages/unpaid-detail/unpaid-detail.js
const db = wx.cloud.database();
const order = db.collection("order")
const app = getApp();
Page({
  data: {
    order: null,

    // 选择送货方式
    view1st: "#eee",
    view2nd: "red",
    view1Color: "black",
    view2Color: "white",
    textdecration: "none",
    // 是否有选择位置
    orderlocation: null,
    isLocation: false,
  },
  pageData: {
    id: null
  },
  money(a) {
    if (a == null) {
      return a = 0
    } else {
      return a
    }
  },
  onLoad: function(options) {
    wx.showLoading({
      title: '数据加载中',
    })
    // 判断是否为再次下单
    if (options.id != null) {
      this.pageData.id = options.id
      order.doc(this.pageData.id).get().then(res => {
        let key = "totalPrice"
        let totalPrice = 0;
        // 总价
        for (let j = 0; j < res.data.dish.length; j++) {
          totalPrice += res.data.dish[j].price
        }
        totalPrice = totalPrice + this.money(res.data.wrapPrice) + this.money(res.data.sendPrice) - this.money(res.data.coupon)
        res.data[key] = totalPrice
        this.setData({
          order: res.data
        })
        wx.hideLoading()
        console.log(this.data.order)
      })
    } else {
      let key = "totalPrice"
      let totalPrice = 0;
      var orderList = {};
      let dish = "dish"
      var dishes = JSON.parse(options.data)
      for (let i = 0; i < dishes.length; i++) {
        // 总价
        totalPrice += dishes[i].price
      }
      orderList[key] = totalPrice
      orderList[dish] = dishes
      this.setData({
        order: orderList
      })
      wx.hideLoading()
      console.log(this.data.order)
    }
  },
  // 提交订单函数
  update_set_Order: function() {
    var _this = this;
    var time1 = new Date();
    wx.showLoading({
      title: '订单提交中',
    })
    if (this.data.isLocation == false) {
      var address = _this.data.orderlocation
    } else {
      var address = null
    }
    // order.doc(_this.pageData.id).set({
    order.add({
      data: {
        addr: address,
        orderTime: time1,
        paid: false,
        done: false,
        isTaken: false, // 是否接单
        cancel: false, // 订单未取消
        wrapPrice: 4,
        sendPrice: 3,
        coupon: 5, // 优惠
        store: this.data.store,
        storeID: this.data.storeID,
        stu: "丁焊月",
        stuID: "4cgdfg325htg8ct8sfgcvtc834hc8",
        comment: null,
        rate: 4,
        tel: 15725055202,
        dish: this.data.order
        // totalPrice: this.data.order.totalPrice,
      },
    }).then(res => {
      wx.showToast({
        title: '提交成功',
      })
      setTimeout(function() {
        // wx.switchTab({
        //   url: '../order/order',
        // })
      }, 100)
    })
  },
  // 提交订单
  submitOrder: function() {
    if (this.data.isLocation == true || (this.data.isLocation == false && this.data.orderlocation != null)) {
      this.update_set_Order();
    } else {
      wx.showToast({
        title: ' 请选择地址 ',
        image: "../../imgs/img1/about_us.png",
        duration: 1500
      })
    }
  },
  //--------------------------------------------------------------------------------------------------------------
  // 选择到店自取or外卖配送
  // 到店自取
  choose1st: function() {
    wx.showLoading({
      title: '切换中',
    })
    // 计算总价
    let key = "totalPrice"
    let totalPrice = 0;
    let order = this.data.order;
    for (let j = 0; j < order.dish.length; j++) {
      totalPrice += order.dish[j].price
    }
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
  choose2nd: function() {
    wx.showLoading({
      title: '切换中',
    })
    let key = "totalPrice"
    let totalPrice = 0;
    let order = this.data.order;
    for (let j = 0; j < order.dish.length; j++) {
      totalPrice += order.dish[j].price
    }
    totalPrice = totalPrice + this.money(order.wrapPrice) + this.money(order.sendPrice) - this.money(order.youhui)
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
    console.log(this.data.order)
  },
  //--------------------------------------------------------------------------------------------------------------
  // 获取优惠券信息
  gotoCoupin: function() {
    wx.showLoading({
      title: '加载中',
    })
    wx.navigateTo({
      url: '../coupon/coupon',
    })
    wx.hideLoading()


    // wx.showActionSheet({
    //   itemList: ['A', 'B', 'C', "d", "g", "g"],
    //   success(res) {
    //     console.log(res.tapIndex)
    //   },
    //   fail(res) {
    //     console.log(res.errMsg)
    //   }
    // })
  },
  // 获取地址
  getLocation: function() {
    var _this = this
    wx.chooseLocation({
      success: function(res) {
        _this.setData({
          orderlocation: res
        })
      },
    })
  }
})