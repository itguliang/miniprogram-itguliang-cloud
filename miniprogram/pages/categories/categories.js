// pages/categories/categories.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow:false,
    categoryName:"",
    categories: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  loadData: function () {
    const db = wx.cloud.database()
    // 查询当前用户所有的 categories
    db.collection('categories').get({
      success: res => {
        this.setData({ categories: res.data });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
  },
  categoryDialogShow: function () {
    this.setData({
      categoryName: "",
      dialogShow: true
    });
  },
  categoryDialogClose(event) {
    this.setData({ dialogShow: false});
  },
  categoryChange(event) {
    this.setData({ categoryName: event.detail });
  },
  saveCategory: function (event) {
    console.log(this.data.categoryName)
    if (!this.data.categoryName){
      wx.showToast({
        title: '专题名称不能为空',
      })
      this.setData({ dialogShow: true });
      return
    }
    const db = wx.cloud.database()
    db.collection('categories').add({
      data: {
        name: this.data.categoryName
      },
      success: res => {
        this.categoryDialogClose();
        wx.showToast({
          title: '新增记录成功',
        })
        this.loadData();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})