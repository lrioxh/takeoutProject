// pages/collectPo/collect.js
var that
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    pageSize: 5,
    totalCount: 0,
    collects: {},
    topics: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
    that.getData(that.data.page);
  },

  /**
   * 获取列表数据
   * 
   */
  getData: function (page) {

    that.data.topics = [];
    db.collection('collectPo')
      .where({
        _openid: app.globalData.openid, // 填入当前用户 openid
      })
      .orderBy('date', 'desc')
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          that.data.collects = res.data;
          that.getTopicFromCollects();

        },

      })

  },
  /**
   * 获取收藏中的 id 的话题
   */
  getTopicFromCollects: function (event) {
    var tempTopics = {};
    // for (var i = 0; i < that.data.collects.length; i++) {
    for (var i in that.data.collects) {
      var topicId = that.data.collects[i].topicid;
      db.collection('topicPo')
        .doc(topicId)
        .get({
          success: function (res) {
            // console.log('i', i)
            that.data.topics.push(res.data);
            // console.log('1', that.data.topics)
            that.setData({
              topics: that.data.topics,
            })
          },
          fail: console.log
        })
    }
  },
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    console.log('pulldown');
    that.getData(that.data.page);
  },
  /**
   * item 点击
   */
  onItemClick: function (event) {
    var id = event.currentTarget.dataset.topicid;
    console.log(id);
    wx.navigateTo({
      url: "../homeDetail/homeDetail?id=" + id
    })
  }
})