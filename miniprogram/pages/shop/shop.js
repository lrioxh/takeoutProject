var app = getApp();
var server = require('../../utils/server');
const db = wx.cloud.database();
Page({
  data: {
    classifyViewed: null,
    // windowName:null,
    window: null,
    goods: [],
    category: [],
    cart: {
      count: 0,
      total: 0,
      list: [],
      goods: []
    },
    // 获取商家id
    storeid:null,
    showCartDetail: false,
  },
  onLoad: function(options) {
    // 此时optionss接受的到的store的id！！
    this.setData({storeid:options.id})
    db.collection("store").where({
      _id: options.id//在数据库中针对商家id查询，只有一个id，因此skip就没有必要了
    }).get().then(res=>{
      // 这里为什么是0呢，因为是通过get得到的结果，它必须为这个结构
      // 但是，因为商家唯一，所以这里可以写死为[0]
      console.log(res.data[0].name)//没有改变原有的结构，因此globalData依然存在，用来存储商家名字
      app.globalData.windowName = res.data[0].name
    })
    
  },
  onShow: function() {
    this.setData({
      classifySeleted: this.data.category[0]
    });
    console.log(app.globalData.windowName)
    this.getdata(console.log(this.data.goods))
  },
  onReachBotton: function() {
    this.getdata();
  },
// 选择菜品（加号）
  tapAddCart: function(e) {
    this.addCart(e.target.dataset.id);
    this.data.goods[parseInt(e.target.dataset.id)].num += 1
    console.log(this.data.goods[parseInt(e.target.dataset.id)])
  },
// 购物车中的减少菜品----------------------------------------------------------------
  reduceCart: function(id) {
    var num = this.data.cart.list[id] || 0;
    if (num <= 1) {
      delete this.data.cart.list[id];
    } else {
      this.data.cart.list[id] = num - 1;
    }
    this.countCart();
  },
  tapReduceCart: function(e) {
    this.reduceCart(e.target.dataset.id);
    this.data.goods[parseInt(e.target.dataset.id)].num -= 1
  },
//--------------------------------------------------------------------------------
  // 购物车中添加菜品
  addCart: function(id) {
    var num = this.data.cart.list[id] || 0; //this.data.cart.list[id]获取到牛扒咖喱饭这个对象
    this.data.cart.list[id] = num + 1;
    this.countCart();
  },
  // 购物车中减少菜品
  countCart: function() {
    var count = 0,
      total = 0;
    for (var id in this.data.cart.list) {
      var goods = this.data.goods;
      count += this.data.cart.list[id];
      total += goods[id].price * this.data.cart.list[id];
    }
    this.data.cart.count = count;
    this.data.cart.total = total;
    this.setData({
      cart: this.data.cart
    });
  },
//-----购物车中添加菜品的操作（上方）----------------------------------------------------------------
// -------------------------------------------------------------
// 收藏商家
  follow: function() {
    this.setData({
      followed: !this.data.followed
    });
  },
// 右边菜品栏
  onGoodsScroll: function(e) {
    if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
      this.setData({
        scrollDown: true
      });
    } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
      this.setData({
        scrollDown: false
      });
    }
  },
// 左边分类栏
  tapClassify: function(e) {
    var id = e.target.dataset.id;
    console.log(e)
    this.setData({
      classifyViewed: id
    });
    var self = this;
    setTimeout(function() {
      self.setData({
        classifySeleted: id
      });
    }, 100);
  },
//-----------------购物车（下方代码）----------------------------------
  // 显示购物车
  showCartDetail: function() {
    this.setData({
      showCartDetail: !this.data.showCartDetail
    });
  },
  // 隐藏购物车
  hideCartDetail: function() {
    this.setData({
      showCartDetail: false
    });
  },
//-----------------购物车----------------------------------

// 获取商家菜品-------------
  getdata: function(callback) {
    if (!callback) {
      callback = res => {}
    }
    wx.showLoading({
      title: '数据加载中',
    })
    let store = db.collection('store')
    let _this = this
    store.where({
      _id: this.data.storeid
    }).skip(this.pagedata.skip).get().then(res => {
      console.log("==========================")
      console.log(res);
      this.setData({
        goods: res.data[0].dish,
        window: res.data[0]
      })
      var i = 0
      for (i = 0; i < _this.data.goods.length; i++) {
        console.log(_this.data.goods[i].category)
        this.setData({
          category: _this.data.category.concat(_this.data.goods[i].category)
        })
        console.log(this.data.category)
      };
      // 这里不应加skip已经注释，可以验证
      // this.pagedata.skip = this.pagedata.skip + 20;
      wx.hideLoading();
      callback();
      console.log(_this.data.goods)
    })
  },
  pagedata: {
    skip: 0
  },
//----------------------------------------------------------------------------
// 去结算，对应的跳转到下单界面
  submit: function(e) {
    var i = 0;
    for (i = 0; i < this.data.goods.length; i++) {
      if (this.data.goods[i].num == 0) {
        console.log('rrrrrrrrrrrrrr')
        this.data.goods.splice(i, 1)
      }
    }
    console.log(this.data.goods)
    let _this = this
    // 这里发送数据应该这么发送
    // 我删除了原有的冗杂部分
    wx.navigateTo({
      url: '../order-unpaid-detail/order-unpaid-detail?data=' + JSON.stringify(_this.data.goods),
      success(res) {
        // console.log(res)
      },
      fail(err) {
        // console.log(err)
      }
    })
  },
//----------------------------------------------------------------------------
  // spider组件的滑动
  swichNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
});