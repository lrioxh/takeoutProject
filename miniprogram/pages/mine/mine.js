// mine.js
const app = getApp()
const db = wx.cloud.database();
// let userinfo = app.globalData.userInfo

Page({
  data: {
    userInfo: app.globalData.userInfo,
//    logged: false,
//    takeSession: false,
//    requestResult: '',
    addressInfo: { detailInfo: "点击选择" },
    isLogin: app.globalData.isLogin,

  },

  onLoad: function () {
    // console.log('mine',userinfo)
    
  },

  onShow: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })

    //代表已经授权过
    if (app.globalData.userInfo != null) {
      //1.直接登陆即可
      this.login();
    }

    //云端获取addr赋给addressInfo.detailInfo

  },

  /**
     * 监听授权的点击事件
     */
  authorizeClick: function (event) {
    let _this = this;
    // console.log(event);
    //1.授权之后将数据存放在app.js中
    let userInfo = event.detail.userInfo;
    if (userInfo) {
      app.globalData.userInfo = userInfo;
      //2.刷新界面
      _this.setData({
        userInfo: userInfo,
      })
      // console.log(app.globalData.userInfo, this.data.userInfo)
      //3.实现登陆功能
      this.login();
    }

  },

  login() {
    let _this = this;
    let userInfo = app.globalData.userInfo;
    let user=null;
    // //openid
    // wx.cloud.callFunction({
    //   name:"login",
    //   // data: {data: userInfo},
    //   complete: res => {
        
    //     app.globalData.openid = res.result.openid;
        //注册/更新本地userInfo
        user=db.collection('student').doc(app.globalData.openid)
        // console.log(userInfo);
        // console.log(user)
        user.get()
        .then(res => {
          user.update({ data: userInfo })
          // console.log(res.data.addr);
          // addressInfo.detailInfo=res.data.addr;
          this.setData({
            ['addressInfo.detailInfo']: res.data.addr
          })
          })
        .catch(res => {
          console.log('newUser')
          user.set({ data: userInfo })
          })
        
        // console.log(userInfo.openid);
        app.globalData.isLogin = true;
        _this.setData({
          isLogin: true,
        })
      // }
    // })

  },

  //地址
  chooseAddress() {
    wx.chooseAddress({
      success: (res) => {
        // console.log(res);
        this.setData({
          addressInfo: res,
        })
        // console.log(res);
        db.collection('student').doc(app.globalData.openid).update({
          data:{
            addr: res.detailInfo,
            tel: res.telNumber,
            name: res.userName
          }
        }).then(console.log)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //路由
  toCoupon: function () {
    wx.navigateTo({
      url: '../coupon/coupon'
    })
  },
  toAnalysis: function () {
    wx.navigateTo({
      url: '../analysis/analysis'
    })
  },
  toCollect: function () {
    wx.navigateTo({
      url: '../collectstore/collect'
    })
  },
  toComment: function () {
    wx.navigateTo({
      url: '../mycomment/mycomment'
    })
  },
  toFeedback: function () {
    wx.navigateTo({
      url: '../feedback/feedback'
    })
  },
  toOrder: function () {
    wx.switchTab({
      url: '../order/order'
    })
  },
  toService: function () {
    wx.navigateTo({
      url: '../service/service'
    })
  },

  //退出
logout:function(){
  // wx.navigateTo({
  //   url: '../index/index'
  // })
  app.globalData.userInfo=null;
  this.setData({
    userInfo:null
  })
  wx.switchTab({
    url: '../index/index'
  })
}

})

