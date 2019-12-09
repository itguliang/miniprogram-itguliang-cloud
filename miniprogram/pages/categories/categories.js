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
    instance.close();
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

  categoryChange: function (event) {
    this.setData({ categoryName: event.detail });
  },

  // 保存专题
  saveCategory: function (event) {
    if (!this.data.categoryName){
      wx.showToast({
        title: '专题名称不能为空',
      })
      this.setData({ dialogShow: true });
      return
    }

    if (!this.data.categoryId){
      this.addCategory();
    }else{
      this.updateCategory();
    }
  },
  addCategory: function () {
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
  updateCategory: function () {
    const db = wx.cloud.database()
    db.collection('categories').doc(this.data.categoryId).update({
      data: {
        name: this.data.categoryName
      },
      success: res => {
        this.categoryDialogClose();
        this.setData({
          categoryId: ""
        })
        wx.showToast({
          title: '更新成功',
        })
        this.loadData();
      },
      fail: err => {
        icon: 'none',
          console.error('[数据库] [更新记录] 失败：', err)
      }
    })
  },
  removeCategory: function () {
    if (this.data.categoryId) {
      const db = wx.cloud.database()
      db.collection('categories').doc(this.data.categoryId).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          this.setData({
            counterId: '',
            count: null,
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    } else {
      wx.showToast({
        title: '无记录可删，请见创建一个记录',
      })
    }
  }
})