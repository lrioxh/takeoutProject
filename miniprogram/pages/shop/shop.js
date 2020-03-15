var app = getApp();
var server = require('../../utils/server');
const db = wx.cloud.database();
Page({
  data: {
    classifyViewed: null,
    window_id: null,
    goods: [],
    window: null,
    category: [],
    story: null,
    location: null,
    tel: null,
    service: null,
    worktime: null,
    inner: null,
    comment: null,
    currentTab: 0,
    cart: {
      count: 0,
      total: 0,
      list: [],
      goods: []
    },
    showCartDetail: false,
    skip: 0,
  },
  onLoad: function(options) {
    console.log("options.id:", options.id)
    this.setData({
      window_id: options.id
    })
  },
  onShow: function() {
    this.setData({
      classifySeleted: this.data.category[0]
    });
    this.getdata(console.log(this.data.goods))
  },
  onReachBotton: function() {
    this.getdata();
  },
  tapAddCart: function(e) {
    this.addCart(e.target.dataset.id);
    this.data.goods[parseInt(e.target.dataset.id)].num += 1
    console.log(this.data.goods[parseInt(e.target.dataset.id)])
  },
  tapReduceCart: function(e) {
    this.reduceCart(e.target.dataset.id);
    this.data.goods[parseInt(e.target.dataset.id)].num -= 1
  },
  addCart: function(id) {
    var num = this.data.cart.list[id] || 0; //this.data.cart.list[id]获取到牛扒咖喱饭这个对象
    this.data.cart.list[id] = num + 1;
    this.countCart();
  },
  reduceCart: function(id) {
    var num = this.data.cart.list[id] || 0;
    if (num <= 1) {
      delete this.data.cart.list[id];
    } else {
      this.data.cart.list[id] = num - 1;
    }
    this.countCart();
  },
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
  follow: function() {
    this.setData({
      followed: !this.data.followed
    });
  },
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
  showCartDetail: function() {
    this.setData({
      showCartDetail: !this.data.showCartDetail
    });
  },
  hideCartDetail: function() {
    this.setData({
      showCartDetail: false
    });
  },
  submit: function(event) {
    console.log(event)
  },
  getdata: function(callback) {
    if (!callback) {
      callback = res => {}
    }
    wx.showLoading({
      title: '数据加载中',
    })
    let store = db.collection('store')
    let order = db.collection('order')
    let _this = this
    store.doc(
      _this.data.window_id
    ).get().then(res => {
      console.log(res);
      if (_this.data.goods.length == res.data.dish.length) {} else {
        this.setData({
          goods: res.data.dish,
          window: res.data,
          story: res.data.story,
          location: res.data.location,
          tel: res.data.tel,
          service: res.data.service,
          worktime: res.data.time,
          inner: res.data.inner
        })
        for (let i = 0; i < _this.data.goods.length; i++) {
          console.log(_this.data.goods[i].category)
          this.setData({
            category: _this.data.category.concat(_this.data.goods[i].category)
          })
          console.log(this.data.category)
        }
      };
      order.where({
        store: _this.data.window.name
      }).get().then(res => {
        console.log("res:", res)
        _this.setData({
          comment: res.data
        })
        console.log("Pingjia:", _this.data.comment)
      })
      // this.data.skip = this.data.skip + 20;
      wx.hideLoading();
      callback();
      console.log(_this.data.goods)
    })
  },
  submit: function(e) {
    var i = 0;
    for (i = 0; i < this.data.goods.length; i++) {
      if (this.data.goods[i].num == 0) {
        this.data.goods.splice(i, 1)
      }
    }
    console.log(this.data.goods)
    let _this = this
    wx.navigateTo({
      url: '../order-submit/order-submit?data=' + JSON.stringify(_this.data),
      success(res) {
        console.log(res)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  swichNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  bindChange: function(e) {
    this.setData({
      currentTab: e.detail.current
    });
    console.log(this.data.currentTab)
  },
});