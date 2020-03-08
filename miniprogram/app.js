//app.js
// let theuserInfo=null;
// let theopenid=null;
App({
  onLaunch: function () {
    var that = this;
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'test-wyzd6',
        traceUser: true,
      }),
        wx.getSetting({
          success(res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function (res) {
                  that.globalData.userInfo = res.userInfo;
                  if (that.userInfoReadyCallback) {
                    that.userInfoReadyCallback(res)
                  }
                  console.log(that.globalData.userInfo)
                }
              })
            }
          }
        }),
        wx.cloud.callFunction({
          name: "login",
          complete: res => {
            that.globalData.openid = res.result.openid;
            console.log(that.globalData.openid)
          }
        })
    }

    this.globalData = {
      openid: null,
      userInfo: null,
      isLogin: false,
      evn: 'test'
    }
  }
})