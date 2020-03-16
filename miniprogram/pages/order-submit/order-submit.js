const db = wx.cloud.database();
const order = db.collection("order")
const coupon = db.collection("coupon")
const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
Page({
  data: {
    info: null,
    addr: {}, // 详细信息 下单使用
    addressInfo: {
      detailInfo: "点击选择",
      userName: ""
    }, //用户的地址信息 显示使用
    // openid: null,  // 用户的openid
    couponflag: null, //判断是否选择优惠券
    couponprice: 0, // 选中的优惠券金额
    couponid: null, // 优惠券
    couponnum: 0, // 优惠券数量
    pageid: null, // 订单id
    order: null, // 订单详情
    totalPrice: null, // 实际付出价格
    predictTime: null, //预计送达时间
    note: null, // 备注内容
  },
  login() {
    let _this = this;
    let userInfo = app.globalData.userInfo;
    let user = null;
    user = db.collection('student').doc(app.globalData.openid)
    user.get()
      .then(res => {
        user.update({
          data: userInfo
        })
        this.setData({
          ['addressInfo.detailInfo']: res.data.addr,
          ['addressInfo.userName']: res.data.name,
          user_tel: res.data.tel
        })
      })
      .catch(res => {
        console.log('newUser')
        user.set({
          data: userInfo
        })
      })
    app.globalData.isLogin = true;
    _this.setData({
      isLogin: true,
    })

  },
  p(s) {
    return s < 10 ? '0' + s : s
  },
  h(s) {
    return s == 24 ? s - '24' : s
  },
  onLoad: function(e) {
    var _this = this
    // 判断是否为重新下单
    // 为再来一单情形
    if (e.id != null) {
      // 计算时间，表示成xx-xx-xx形式 
      let d = new Date();
      let hours = _this.p(d.getHours())
      let minutes = d.getMinutes() + 40
      if (minutes > 60) {
        minutes -= 60
        hours += 1
      }
      let predictTime = _this.h(hours) + ':' + _this.p(minutes)
      order.doc(e.id).get().then(res => {
        console.log(res.data)
        _this.setData({
          order: res.data,
          totalPrice: res.data.totalPrice,
          pageid: e.id,
          predictTime: predictTime,
          orderTime: d,
        })
        setTimeout(function() {
          coupon.where({
            item: _this.data.order.storeID
          }).where({
            user: app.globalData.openid
          }).get().then(res => {
            console.log(app.globalData.openid)
            console.log(_this.data.order.storeID)
            console.log(res)
            _this.setData({
              couponnum: res.data.length
            })
          })
        }, 100)
      })
    }
    // 为新订单情形
    else {
      var orderdata = JSON.parse(e.data)
      console.log(orderdata)
      var orderTime = new Date();
      // 计算时间，表示成xx-xx-xx形式 
      let d = new Date();
      let hours = this.p(d.getHours())
      let minutes = this.p(d.getMinutes() + 40)
      if (minutes > 60) {
        minutes -= 60
        hours += 1
      }
      let predictTime = hours + ':' + minutes
      // 格式为数据库中需要的格式
      var dish = [];
      for (let i = 0; i < orderdata.list.length; i++) {
        var list = orderdata.list
        list[i].price *= list[i].num
        dish[i] = list[i]
      }
      var money = orderdata.cart.total //菜品总价
      // 计算打包费、配送费
      if (orderdata.sendPrice == null) {
        var sendPrice = 0;
      } else {
        var sendPrice = orderdata.sendPrice;
      }
      if (orderdata.wrapPrice == null) {
        var wrapPrice = 0;
      } else {
        var wrapPrice = orderdata.wrapPrice;
      }
      money = money + sendPrice + wrapPrice
      var userinfo = app.globalData.userInfo;
      this.setData({
        predictTime: predictTime,
        info: userinfo,
        order: {
          dish: dish,
          orderTime: orderTime,
          tel: orderdata.tel, //餐厅的tel
          hall: orderdata.window.place, // 餐厅名
          store: orderdata.window.name, // 商家名
          storeID: orderdata.window._id, // 商家id
          storeLogo: orderdata.window.img, // 商家logo
          sendPrice: orderdata.sendPrice, // 配送费
          wrapPrice: orderdata.wrapPrice, // 打包费
          totalPrice: money, // 不计算红包价格
        },
        totalPrice: money // 支付价格
      })
      // console.log(this.data.info)
      // console.log(this.data.totalPrice)
      // console.log(this.data.order.totalPrice)
      console.log(this.data.order.storeID)
      coupon.where({
        user: app.globalData.openid
      }).where({
        item: this.data.order.storeID
      }).get().then(res => {
        this.setData({
          couponnum: res.data.length
        })
      })
    }
  },
  onShow: function() {
    this.changePrice()
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
      url: '../order-submit-coupon/order-submit-coupon?id=' + this.data.order.storeID,
    })
  },
  // 查看我的地址（修改）
  //地址
  chooseAddress: function() {
    wx.chooseAddress({
      success: (res) => {
        // console.log(res);
        this.setData({
          addressInfo: res,
        })
        db.collection('student').doc(app.globalData.openid).update({
          data: {
            addr: res.detailInfo,
            tel: res.telNumber,
            name: res.userName
          }
        }).then(console.log)
      },
      fail: function(err) {
        console.log(err)
      }
    })
  },

  // 提交订单
  submitOrder: function() {
    wx.showLoading({
      title: '订单提交中',
    })
    let _this = this
    // 接入腾讯地图api
    qqmapsdk = new QQMapWX({
      key: 'WBSBZ-2BIKX-LWG4R-7YG6W-3FPDT-NWFNU'
    });
    // 调用接口
    console.log(_this.data.addressInfo.detailInfo)
    qqmapsdk.geocoder({
      address: _this.data.addressInfo.detailInfo, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function(res) { //成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        _this.addressdata.address = _this.data.addressInfo.detailInfo,
          _this.addressdata.latitude = latitude,
          _this.addressdata.longitude = longitude
        console.log(_this.addressdata)
        _this.orderadd()
      }
    })
    // if (_this.data.couponid != null) {
    //   coupon.where({
    //     _id: _this.data.couponid
    //   }).remove()
    // }
  },
  addressdata: {
    address: null,
    latitude: null,
    longitude: null,
  },
  orderadd: function() {
    var _this = this
    let _order = _this.data.order
    order.add({
      data: {
        addr: {
          address: _this.addressdata.address,
          latitude: _this.addressdata.latitude,
          longitude: _this.addressdata.longitude
        },
        dish: _order.dish,
        orderTime: new Date(),
        stu: _this.data.addressInfo.userName,
        stuID: app.globalData.openid,
        tel: _this.data.addressInfo.telNumber, //客户的tel
        hall: _order.hall, // 餐厅名
        store: _order.store, // 商家名
        storeID: _order.storeID, // 商家id
        storeLogo: _order.storeLogo, // 商家logo
        sendPrice: _order.sendPrice, // 配送费
        wrapPrice: _order.wrapPrice, // 打包费
        totalPrice: _order.totalPrice, // 不计算红包价格
        payPrice: _this.data.totalPrice,
        coupon: _this.data.couponprice,
        note: _this.data.note, //顾客备注
        comment_rider: {},
        comment_store: {},
        paid: false,
        isTaken: false,
        done: false,
        cancel: false,
        rider_Detail:{},
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      },
      fail: console.error,
      complete: console.log
    })
    wx.showToast({
      title: '提交成功',
    })
    setTimeout(function () {
      wx.switchTab({
        url: "../order/order"
      })
    }, 500)
  },
  //---------------------------------------------------------------------------------------------
  // 使用优惠券函数
  changePrice: function() {
    if (app.globalData.userInfo != null) {
      //1.直接登陆即可
      this.login();
    }
    // 获取优惠券信息
    var _this = this;
    console.log(_this.data.couponid)
    if (_this.data.couponid != null) {
      console.log(_this.data.couponid)
      // 以优惠券id查找
      coupon.where({
        _id: _this.data.couponid
      }).get().then(res => {
        if (res.data[0] == null) {
          _this.setData({
            couponflag: null,
            couponprice: 0
          })
        } else {
          console.log(res)
          _this.setData({
            couponflag: res.data[0],
            couponprice: res.data[0].amount
          })
        }

        console.log(_this.data.couponprice) // 打印优惠券金额
        var n_price = _this.data.order.totalPrice; // 定义一个中间变量
        n_price -= _this.data.couponprice // 价格减去优惠券数量
        _this.setData({
          totalPrice: n_price
        })
        console.log(_this.data.totalPrice)
      })
    } else {
      console.log(this.data)
      _this.setData({
        totalPrice: _this.data.order.totalPrice
      })
    }
  },
  // 备注文字
  textareainput: function(e) {
    this.setData({
      note: e.detail.value
    })
  }
})