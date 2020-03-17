// pages/collectstore/collect.js
var that;
var app = getApp();
const db = wx.cloud.database();
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stores: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    that = this;
    var storeList=[];
    db.collection('student')
      .doc(app.globalData.openid
      )
      .field({
        collectStore:1,
      })
      .get({
        success: function (res) {
          storeList=res.data.collectStore;
          // console.log(storeList);

          db.collection('store')
            .where({
              _id: _.in(storeList),
            })
            .field({
              dish: -1,
              rank:-1,
            })
            .get()
            .then(res => {
              that.setData({
                stores: res.data
              })
            })
        },
        fail: console.error
      })

    
  },
  /**
 * item 点击
 */
  onItemClick: function (e) {
    var id = e.currentTarget.dataset.storeid;
    console.log(e);
    wx.navigateTo({
      url: "../shop/shop?id=" + id
    })
  }
})