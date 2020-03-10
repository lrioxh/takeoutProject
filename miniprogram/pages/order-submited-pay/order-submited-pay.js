// pages/ordersubmited/ordersubmited.js
const db = wx.cloud.database();
const order = db.collection('order')
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order: null,
    // 确认取消订单
    dialogShow: false,
    tempid: null, // 选中点单的id
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
  },
  // 生命周期函数--监听页面加载
  p(s) {
    return s < 10 ? '0' + s : s
  },
  //防止出现24：xx
  h(s) {
    return s == 24 ? s - '24' : s
  },
  pageData: {
    id: null
  },
  onLoad: function(options) {
    this.pageData.id = options.id
    order.doc(options.id)
      .get()
      .then(res => {
        let orderTime = 'orderTime';
        let d = res.data.orderTime
        // let resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
        var hours = this.p(d.getHours() + 1)
        let resTime = this.h(hours) + ':' + this.p(d.getMinutes())
        res.data[orderTime] = resTime
        this.setData({
          order: res.data
        })
      })
  },
  //--------------------------------------------------------------------------------------------------------
  // 弹窗dialog确认是否取消订单
  openConfirm: function (e) {
    console.log(e)
    wx.showModal({
      title: '取消订单',
      content: '您确定要取消订单，并申请退款吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '返回中'
          })
          wx.redirectTo({
            url: '../order-cancel-cus/order-cancel-cus?id=' + e.target.id,
          })
          wx.hideLoading()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

// 修改订单地址
  updateOrder: function() {
    var _this = this
    if (_this.data.order.addr == null) {
      wx.showToast({
        title: '您已选择自取！',
        image: "../../imgs/img1/about_us.png",
        duration: 1500
      })
    } else {
      wx.chooseLocation({
        success: function(res) {
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
  gotoDetali: function() {
    console.log()
    wx.navigateTo({
      url: '../order-detail/order-detail?id=' + [this.pageData.id],
    })
  }
})