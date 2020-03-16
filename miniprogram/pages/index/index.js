var app = getApp();
var server = require('../../utils/server');
const db = wx.cloud.database();
const _ = db.command;
Page({
	data: {
		filterId: 1,
		address: '定位中…',
		windows: [],
		query:null,
		dinninghall: [
			{
				id: 1,
				img: '/imgs/index/icon_8.jpg',
				url: '',
				name1: '馨园',
				name2:'馨园餐厅'
			},
			{
				id: 2,
				img: '/imgs/index/icon_8.jpg',
				url: '',
				name1: '荟园',
				name2:'荟园餐厅'
			},
			{
				id: 3,
				img: '/imgs/index/icon_8.jpg',
				url: '',
				name1: '雀园',
				name2:'雀园餐厅'
			},
			{
				id: 4,
				img: '/imgs/index/icon_8.jpg',
				url: '',
				name1: '泰园',
				name2:'泰园餐厅'
			}
		],
		banners: [
			{
				id: 3,
				img: '/imgs/index/fastfood.jpg',
				url: '',
				name: '百亿巨惠任你抢'
			},
			{
				id: 1,
				img: '/imgs/index/fastfood.jpg',
				url: '',
				name: '告别午高峰'
			},
			{
				id: 2,
				img: '/imgs/index/fastfood.jpg',
				url: '',
				name: '金牌好店'
			}
		],
		icons: [
			[
				{
					id: 1,
					img: '/imgs/index/icon_1.jpg',
					name: '快餐便当',
					category:'fastfood',
					url: ''
				},
				{
					id: 2,
					img: '/imgs/index/icon_2.jpg',
					name: '水饺馄饨',
					category: 'dampling',
					url: ''
				},
				{
					id: 3,
					img: '/imgs/index/icon_7.jpg',
					name: '汉堡薯条',
					category: 'hamburger',
					url: ''
				},
				{
					id: 4,
					img: '/imgs/index/icon_4.jpg',
					name: '饮品',
					category: 'drink',
					url: ''
				},
				{
					id: 5,
					img: '/imgs/index/icon_8.jpg',
					name: '面条',
					category: 'noddles',
					url: ''
				},
				{
					id: 6,
					img: '/imgs/index/icon_16.jpg',
					name: '麻辣烫',
					category: 'malatang',
					url: ''
				},
				{
					id: 7,
					img: '/imgs/index/icon_14.jpg',
					name: '香锅',
					category: 'xiangguo',
					url: ''
				},
				{
					id: 8,
					img: '/imgs/index/icon_5.jpg',
					name: '炸鸡烧烤',
					category: 'friedchicken',
					url: ''
				}
			],
			[
				{
					id: 9,
					img: '/imgs/index/icon_9.jpg',
					name: '新商家',
					category: 'newwindow',
					url: ''
				},
				{
					id: 10,
					img: '/imgs/index/icon_10.jpg',
					name: '免配送费',
					category: 'freedelivery',
					url: ''
				},
				{
					id: 11,
					img: '/imgs/index/icon_11.jpg',
					name: '鲜花蛋糕',
					category: 'flowercake',
					url: ''
				},
				{
					id: 12,
					img: '/imgs/index/icon_12.jpg',
					name: '名气窗口',
					category: 'famous',
					url: ''
				},
				{
					id: 13,
					img: '/imgs/index/icon_13.jpg',
					name: '日韩料理',
					category: 'liaoli',
					url: ''
				},
				{
					id: 14,
					img: '/imgs/index/icon_3.jpg',
					name: '小吃',
					category: 'snacks',
					url: ''
				},
				{
					id: 15,
					img: '/imgs/index/icon_15.jpg',
					name: '能量西餐',
					category: 'westernfood',
					url: ''
				},
				{
					id: 16,
					img: '/imgs/index/icon_16.jpg',
					name: '无辣不欢',
					category: 'spicy',
					url: ''
				}
			]
		],
		discount_img: '/imgs/index/fastfood.jpg',
		choice: '/imgs/index/fastfood.jpg',
		shops: []
	},
	onLoad: function () {
		var self = this;
		wx.getLocation({
			type: 'gcj02',
			success: function (res) {
				var latitude = res.latitude;
				var longitude = res.longitude;
			}
		})
		this.getdata()
	},
	onShow: function () {
	},
	onScroll: function (e) {
		if (e.detail.scrollTop > 100 && !this.data.scrollDown) {
			this.setData({
				scrollDown: true
			});
		} else if (e.detail.scrollTop < 100 && this.data.scrollDown) {
			this.setData({
				scrollDown: false
			});
		}
	},
	tapSearch: function () {
		wx.navigateTo({ url: 'search' });
	},
	// toNearby: function () {
	// 	var self = this;
	// 	self.setData({
	// 		scrollIntoView: 'nearby'
	// 	});
	// 	self.setData({
	// 		scrollIntoView: null
	// 	});
	// },
	gotoWindows: function () {
		wx.navigateTo({
			url: '../windows/windows',
		})
	},
	tapFilter: function (e) {
		console.log(e)
		switch (e.target.dataset.id) {
			case '1':
				this.data.shops.sort(function (a, b) {
					return b.rate-a.rate;
				});
				break;
			case '2':
				this.data.shops.sort(function (a, b) {
					return b.sales - a.sales;
				});
				break;
			case '3':
				this.data.shops.sort(function (a, b) {
					return a.sendtime-b.sendtime;
				});
				break;
		}
		this.setData({
			filterId: e.target.dataset.id,
			shops: this.data.shops
		});
	},
	location:function(event){
		let _this=this
		wx.chooseLocation({
			success: function(res) {
				console.log(res)
				_this.setData({
					address:res.address
				})
			},
		})
	},
	// tapBanner: function (e) {
	// 	var name = this.data.banners[e.target.dataset.id].name;
	// 	wx.showModal({
	// 		title: '提示',
	// 		content: '您点击了“' + name + '”活动链接，活动页面暂未完成！',
	// 		showCancel: false
	// 	});
	// }

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
	
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		this.getdata(console.log("触底了"));
	},
	onBindblur:function(event){
		let _this=this
		console.log(event.detail.value)
		_this.setData({
			query:event.detail.value
		})
		console.log(this.data.query)
	},
	query:function(){
		let _this=this
		db.collection("store").where({
			name: new db.RegExp({
				regexp:_this.data.query,
				options: 'i'
			})
		}).get().then(res => {
			console.log(res),
			app.globalData.queryDishes=res.data,
			console.log(app.globalData)
		wx.navigateTo({
				url: '../search/search',
		})})
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
		store.skip(this.pagedata.skip).get().then(res => {
			console.log(res);
			this.setData({
				shops: this.data.shops.concat(res.data)
			}),
				this.pagedata.skip = this.pagedata.skip + 20;
			wx.hideLoading();
			callback();
			console.log(_this.data.shops)
		})
	},
	pagedata: {
		skip: 0
	}
});

