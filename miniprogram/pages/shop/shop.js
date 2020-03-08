var app = getApp();
var server = require('../../utils/server');
const db = wx.cloud.database();
Page({
	data: {
		windowName:null,
		goods:[],
		category: [
			{
				id: 'hot',
				classifyName: '热销',
				goods: [1, 2, 3, 4, 5]
			},
			{
				id: 'new',
				classifyName: '新品',
				goods: [1, 3]
			},
			{
				id: 'vegetable',
				classifyName: '蔬菜',
				goods: [1, 6, 5]
			},
			{
				id: 'mushroom',
				classifyName: '蘑菇',
				goods: [2, 7, 8, 9]
			},
			{
				id: 'food',
				classifyName: '主食',
				goods: [3, 4]
			}
		],
		cart: {
			count: 0,
			total: 0,
			list: {}
		},
		showCartDetail: false,
	},
	onLoad: function (options) {
		this.setData({
			windowName:options.id
		})
		this.getdata(console.log(this.data.goods))
	},
	onShow: function () {
		this.setData({
			classifySeleted: this.data.category[0].id
		});
	},
	onReachBotton:function(){
		this.getdata();
	},
	tapAddCart: function (e) {
		this.addCart(e.target.dataset.id);
	},
	tapReduceCart: function (e) {
		this.reduceCart(e.target.dataset.id);
	},
	addCart: function (id) {
		var num = this.data.cart.list[id] || 0;
		this.data.cart.list[id] = num + 1;
		this.countCart();
	},
	reduceCart: function (id) {
		var num = this.data.cart.list[id] || 0;
		if (num <= 1) {
			delete this.data.cart.list[id];
		} else {
			this.data.cart.list[id] = num - 1;
		}
		this.countCart();
	},
	countCart: function () {
		var count = 0,
			total = 0;
		for (var id in this.data.cart.list) {
			var goods = this.data.goods[id];
			count += this.data.cart.list[id];
			total += goods[0].price * this.data.cart.list[id];
		}
		this.data.cart.count = count;
		this.data.cart.total = total;
		this.setData({
			cart: this.data.cart
		});
	},
	follow: function () {
		this.setData({
			followed: !this.data.followed
		});
	},
	onGoodsScroll: function (e) {
		if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
			this.setData({
				scrollDown: true
			});
		} else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
			this.setData({
				scrollDown: false
			});
		}

		var scale = e.detail.scrollWidth / 570,
			scrollTop = e.detail.scrollTop / scale,
			h = 0,
			classifySeleted,
			len = this.data.category.length;
		this.data.category.forEach(function (classify, i) {
			var _h = 70 + classify.goods.length * (46 * 3 + 20 * 2);
			if (scrollTop >= h - 100 / scale) {
				classifySeleted = classify.id;
			}
			h += _h;
		});
		this.setData({
			classifySeleted: classifySeleted
		});
	},
	tapClassify: function (e) {
		var id = e.target.dataset.id;
		this.setData({
			classifyViewed: id
		});
		var self = this;
		setTimeout(function () {
			self.setData({
				classifySeleted: id
			});
		}, 100);
	},
	showCartDetail: function () {
		this.setData({
			showCartDetail: !this.data.showCartDetail
		});
	},
	hideCartDetail: function () {
		this.setData({
			showCartDetail: false
		});
	},
	submit:function(event){
		console.log(event)
	},
	getdata: function (callback) {
		if (!callback) {
			callback = res => { }
		}
		wx.showLoading({
			title: '数据加载中',
		})
		let store = db.collection('store')
		let _this = this
		store.where({
			name:_this.data.windowName
		}).skip(this.pagedata.skip).get().then(res => {
			console.log(res);
			this.setData({
				goods:res.data[0].dish
			}),
				this.pagedata.skip = this.pagedata.skip + 20;
			wx.hideLoading();
			callback();
			console.log(_this.data.goods)
		})
	},
	pagedata: {
		skip: 0
	}
	// submit: function (e) {
	// 	server.sendTemplate(e.detail.formId, null, function (res) {
	// 		if (res.data.errorcode == 0) {
	// 			wx.showModal({
	// 				showCancel: false,
	// 				title: '恭喜',
	// 				content: '订单发送成功！下订单过程顺利完成，本例不再进行后续订单相关的功能。',
	// 				success: function(res) {
	// 					if (res.confirm) {
	// 						wx.navigateBack();
	// 					}
	// 				}
	// 			})
	// 		}
	// 	}, function (res) {
	// 		console.log(res)
	// 	});
	// }
});

