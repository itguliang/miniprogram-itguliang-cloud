// pages/home/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    loadMore: true,
    articles:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.cloud.callFunction({
    //   // 云函数名称
    //   name: 'getAccessToken',
    //   success: function (res) {
    //     console.log("微信公众号AccessToken:")
    //     console.log(res.result) 
    //   },
    //   fail: console.error
    // })
    this.loadWechatPosts();
    wx.showToast({
      title: '数据加载中',
      icon: 'loading'
    })
    this.loadData();
  },
  loadWechatPosts:function(){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getPosts',
      success: function (res) {
        console.log("微信公众号文章列表：")
        console.log(res.result)
      },
      fail: console.error
    })
  },

  // 加载文章列表
  loadData: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 categories
    db.collection('articles').get({
      success: res => {
        wx.hideToast();
        this.setData({
          articles: res.data
        });
        wx.stopPullDownRefresh();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
    this.setData({
      loading: false,
      // pageIndex: 1
    })
    // this.fetchData(this.data.pageIndex);
    this.loadData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //写文章
  addArticle:function(){
    wx.navigateTo({
      url: '../article/articleAddorEdit'
    })
  }
})