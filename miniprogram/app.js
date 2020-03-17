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
      windowName:null,
      openid: null,
      userInfo: null,
      isLogin: false,
      evn: 'test',
			queryDishes:null
    }
  },
  editTabBar: function (that) {

    var tabBar = that.data.tabBar;

    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = '/' + currentPage.route //当前页面url


    for (var i = 0; i < tabBar.list.length; i++) {
      tabBar.list[i].active = false;
      if (tabBar.list[i].pagePath == url) {
        tabBar.list[i].active = true;//根据页面地址设置当前页面状态  
      }
    }

    that.setData(that.data);
    //that.setData(tabBar); 这样页面不会渲染新数据
    //console.log(that.data);

  }
})