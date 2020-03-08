const db = wx.cloud.database();
// const store = db.collection("store");
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		onsale:[]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getdata()
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		// console.log(this.data.windows)
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.getdata(res => {
			wx.stopPullDownRefresh();
		});
		this.pagedata.skip = 0;
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		this.getdata();
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

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
			onsale: true				//这一句是无效的
		}).skip(this.pagedata.skip).get().then(res => {
			console.log(res);
			this.setData({
				onsale: this.data.onsale.concat(res.data)
			}),
				this.pagedata.skip = this.pagedata.skip + 20;
			wx.hideLoading();
			callback();
		})
	},
	pagedata: {
		skip: 0
	}
})