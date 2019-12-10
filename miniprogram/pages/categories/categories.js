// pages/categories/categories.js

import Dialog from '@vant/weapp/dialog/dialog';

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dialogShow: false,
    categoryName: "",
    categoryId: "",
    categories: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.loadData();
  },

  // 加载专题列表
  loadData: function() {
    const db = wx.cloud.database()
    // 查询当前用户所有的 categories
    db.collection('categories').get({
      success: res => {
        this.setData({
          categories: res.data
        });
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    })
  },

  categoryDelConfirm: function(event) {
    this.setData({
      categoryId: event.target.dataset.categoryId ? event.target.dataset.categoryId : ""
    });
    Dialog.confirm({
      message: '确定删除吗？'
    }).then(() => {
      this.removeCategory();
    }).catch(() => {
      // on cancel
    });
  },

  categoryDialogShow: function(event) {
    this.setData({
      categoryName: event.target.dataset.categoryName ? event.target.dataset.categoryName : "",
      categoryId: event.target.dataset.categoryId ? event.target.dataset.categoryId : "",
      dialogShow: true
    });
  },

  categoryDialogClose: function() {
    this.setData({
      dialogShow: false
    });
  },

  categoryChange: function(event) {
    this.setData({
      categoryName: event.detail
    });
  },

  // 保存专题
  saveCategory: function(event) {
    if (!this.data.categoryName) {
      wx.showToast({
        title: '专题名称不能为空',
      })
      this.setData({
        dialogShow: true
      });
      return
    }
    if (!this.data.categoryId) {
      this.addCategory();
    } else {
      this.updateCategory();
    }
  },
  addCategory: function() {
    const db = wx.cloud.database()
    db.collection('categories').add({
      data: {
        name: this.data.categoryName
      },
      success: res => {
        this.categoryDialogClose();
        this.loadData();
        wx.showToast({
          title: '添加成功',
        })
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '添加失败'
        })
      }
    })
  },
  updateCategory: function() {
    const db = wx.cloud.database()
    db.collection('categories').doc(this.data.categoryId).update({
      data: {
        name: this.data.categoryName
      },
      success: res => {
        this.categoryDialogClose();
        this.loadData();
        this.setData({
          categoryId: ""
        })
        wx.showToast({
          title: '更新成功',
        })
      },
      fail: err => {
        icon: 'none',
        console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  removeCategory: function() {
    if (this.data.categoryId) {
      const db = wx.cloud.database()
      db.collection('categories').doc(this.data.categoryId).remove({
        success: res => {
          this.loadData();
          this.setData({
            categoryId: ''
          })
          wx.showToast({
            title: '删除成功',
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
        }
      })
    } else {
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
  }
})