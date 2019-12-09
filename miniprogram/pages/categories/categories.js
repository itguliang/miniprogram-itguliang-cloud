// pages/categories/categories.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow:false,
    categoryName: "",
    categoryId:"",
    categories: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
  },

  // 加载专题列表
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

  onSwipeCellClose:function(event) {
    const { position, instance } = event.detail;
    console.log(event)
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        // Dialog.confirm({
        //   message: '确定删除吗？'
        // }).then(() => {
        //   instance.close();
        // });
        break;
    }
  },

  categoryDialogShow: function (event) {
    console.log(event.target.dataset.categoryId);
    this.setData({
      categoryName: event.target.dataset.categoryName ? event.target.dataset.categoryName:"",
      categoryId: event.target.dataset.categoryId ? event.target.dataset.categoryId : "",
      dialogShow: true
    });
  },

  categoryDialogClose: function () {
    this.setData({ dialogShow: false});
  },

  categoryChange: function () {
    this.setData({ categoryName: event.detail });
  },

  // 保存专题
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
          title: '添加成功',
        })
        this.loadData();
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '添加失败'
        })
      }
    })
  },
})